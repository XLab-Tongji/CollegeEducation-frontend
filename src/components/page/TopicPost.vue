<template>
    <el-container class="topic-post">
        <!----- 引入wangEditor的css文件 ----->
        <link rel="stylesheet" href="../../../node_modules/wangeditor/release/wangEditor.min.css">
        <el-main class="main" v-loading="loading">
            <!----- 输入标题 ----->
            <div align="left" class="topic-title">
                <el-input v-model="article.TopicTitle" size="small" maxlength="25"
                          placeholder="请输入标题..."
                          style="width: 350px">
                </el-input>
            </div>
            <!----- 编辑器 ----->
            <div id="editor" style="margin-top: 20px"></div>

            <div class="selectp">
                <!-- 选择分类 -->
                <el-select value="" v-model="sid" size="mini" style="width: 200px" placeholder="请选择分类">
                    <el-option
                        v-for="item in sectorStates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 添加标签 -->
                <el-tag
                    :key="tag"
                    v-for="tag in SectorName"
                    closable
                    :disable-transitions="false"
                    class="tag"
                    @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                    v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput"
                    size="mini" style="width: 80px" maxlength="10"
                    @keyup.space.native="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else type="primary" size="mini" @click="showInput">+Tag</el-button>
            </div>

            <!----- 保存和发表按键 ----->
            <div class="post">
                <el-button size="mini" class="save-btn" @click="saveInDrafts">保存到草稿箱</el-button>
                <el-button type="primary" size="mini" class="post-btn" @click="postOn">发布</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script >
    import WangEditor from 'wangeditor';
    import data from '../../data/sina-data.js'
    import server from '../../../config/index.js';
    import {UPLOADER} from '../../tools/utils.js'

    export default {
        name: 'editor',
        mounted(){
            for(var i = 0;i < data.length;i++){
                this.sinaData.push({alt: data[i].phrase, src: data[i].icon});
            }
            this.editor.customConfig.menus = [
                'link',  // 插入链接
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
            this.editor.customConfig.onchange = () => {
                this.article.TopicText = this.editor.txt.html();
                // 文章再次修改
                this.isSaved = false;
            };
            this.editor.customConfig.emotions = [
                {
                    // tab 的标题
                    title: '新浪',
                    // type -> 'emoji' / 'image'
                    type: 'image',
                    // content -> 数组
                    content: this.sinaData
                },
                {
                    title: 'emoji',
                    type: 'emoji',
                    content: this.emojiData
                }];
            this.editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0; // 开启debug模式
            this.editor.create();
            this.editor.config.customUploadInit = this.UPLOADER(this.editor).init();
        },
        methods: {
            // 删除tag
            handleClose(tag) {
                this.SectorName.splice(this.SectorName.indexOf(tag), 1);
            },
            // 添加tag
            showInput() {
                this.tagInputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 失去焦点时确认添加tag
            handleInputConfirm() {
                if(this.tagValue === ' '){
                    this.tagValue = '';
                    return;
                }
                let tagValue = this.tagValue;
                for(var i in this.SectorName){
                    if(this.SectorName[i] === tagValue) {
                        this.$message({type: 'error', message: '该标签已添加'});
                        return;
                    }
                }
                if (tagValue) {
                    this.SectorName.push(tagValue);
                }
                this.tagInputVisible = false;
                this.tagValue = '';
            },
            // 存入草稿箱
            saveInDrafts(){
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.draft.draft_name = this.article.TopicTitle;
                this.draft.draft_text = this.article.TopicText;
                if(this.sid !== '') this.draft.sector_id = Number(this.sid);
                var t = new Date();
                this.draft.write_date = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/draft/save', this.draft, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.loading = false;
                        this.isSaved = true;
                        this.$message({type: 'success', message: '文章已保存'});
                    }
                    else{
                        this.loading = false;
                        this.editor.$textElem.attr('contenteditable', true);
                        this.$message({type: 'error', message: '保存失败'});
                    }
                }, response => {
                    this.editor.$textElem.attr('contenteditable', true);
                    this.loading = false;
                    this.$message({type: 'error', message: '保存失败'});
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '保存失败'});
                });
            },
            // 发布
            postOn(){
                if(this.article.TopicTitle === '') {
                    this.$message({type: 'error', message: '请输入标题！'});
                    return
                }
                if(this.article.TopicText === '') {
                    this.$message({type: 'error', message: '请输入内容！'});
                    return
                }
                if(this.sid === '') {
                    this.$message({type: 'error', message: '请选择分类！'});
                    return
                }
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.article.SectorId = Number(this.sid);
                switch (this.sid) {
                    case '1':{
                        this.article.SectorName = '计算机软件及计算机应用';
                        break;
                    }
                    case '2':{
                        this.article.SectorName = '互联网技术';
                        break;
                    }
                    case '3':{
                        this.article.SectorName = '电信技术';
                        break;
                    }
                    default: break;
                }
                var t = new Date();
                this.article.TopicDate = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/article/save', this.article, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.loading = false;
                        this.isSaved = true;
                        this.$message({type: 'success', message: '已发表，页面即将跳转'});
                        this.$router.push('/topic');
                    }
                    else{
                        this.loading = false;
                        this.editor.$textElem.attr('contenteditable', true);
                        this.$message({type: 'error', message: '发表失败'});
                    }
                }, response => {
                    this.editor.$textElem.attr('contenteditable', true);
                    this.loading = false;
                    this.$message({type: 'error', message: '发表失败'});
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '保存失败'});
                });
            }
        },

        data() {
            return {
                editor: new WangEditor('#editor'), // 编辑器
                sinaData: [], // 新浪表情数组
                // emoji数组
                emojiData: ['😀','😃','😄','😁','😆','😅','😂','🤣','😇','😊','🙂','🙃','😉','😌','😍','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','😢','😭','😤','😠','😡','🤬','🤯','😳','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','😴','😪','😵','🤐','🤧','😷','😈','👿','💩','👻','🤲','🙌','👏','🤝','👍','👎','👊','✊','🤛','🤜','🤞','✌','🤟','👌','👈','👉','👆','👇','👋','🤙','💪','🙏','👀','🙇‍','🙅‍','🙆‍','🙋‍','🤦‍','🤷‍','💅','🌝','🌚','❤️','💔','❣️','💕','💓','💗','💖','❌','✅','⭕️','💯','❗️','❓','⁉️','📝'],
                tagInputVisible: false, // 添加标签后显示组件
                tagValue: '', // 用户每次输入的标签内容
                loading: false, // 加载状态
                isSaved: false, // 是否已经保存
                sectorStates: [{value: '1', label: '计算机软件及计算机应用'}, {value: '2', label: '互联网技术'}, {value: '3', label: '电信技术'}], // 分类列表
                SectorName: [], // 所有已经添加的标签内容
                sid: '', // 标签ID
                // 发表文章实体
                article: {
                    SectorId: 0,
                    TopicTitle: '',
                    TopicText: '',
                    TopicDate: new Date(),
                    UserId: 1, // 不知道如何获取
                    ReplyCount: 0,
                    ClickingRate: 0,
                    PraiseCount: 0,
                    SectorName: '',
                    favorite_count: 0
                },
                // 草稿实体
                draft: {
                    user_id: 1,
                    publish_type_id: 0,
                    sector_id: 0,
                    draft_name: '',
                    draft_text: '',
                    write_date: new Date()
                },
                UPLOADER // 图片上传组件
            }
        },

        /*
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        // 提示用户离开前是否需要保存
        beforeRouteLeave: function(to, from , next){
            if(!this.isSaved){
                this.$confirm('内容已编辑，是否存入草稿箱?', '', {
                    confirmButtonText: '保存',
                    cancelButtonText: '不保存',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '已保存!'
                    });
                    next();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '未保存'
                    });
                    next();
                });
            }
        }
        */
    }
</script>
<style>
    .topic-post > .main {
        flex-direction: column;
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        padding-top: 0;
        padding-left: 0;
    }

    .topic-post > .main > .selectp {
        margin-top: 17px;
    }

    .topic-post > .main > .selectp .tag {
        background-color: #f7ffff;
        color: #0a9894;
        margin-left: 5px;
    }

    .topic-post > .main > .selectp button {
        background-color: #1ac7c3;
        border-color: #1ac7c3;
        margin-left: 10px;
    }

    .topic-post > .main > .post {
        display: flex;
        justify-content: flex-start;
        margin-top: 15px;
    }

    .topic-post > .main > .post .save-btn {
        border-color: #1ac7c3;
        color: #1ac7c3;
    }

    .topic-post > .main > .post .post-btn {
        background-color: #1ac7c3;
        border-color: #1ac7c3;
    }
</style>
