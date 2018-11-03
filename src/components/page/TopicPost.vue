<template>
    <el-container class="topic-post">
        <link rel="stylesheet" href="../../../node_modules/wangeditor/release/wangEditor.min.css">
        <el-main class="main" v-loading="loading">
            <div align="left" class="topic-title">
                <el-input v-model="article.TopicTitle" size="small" maxlength="25"
                          placeholder="请输入标题..."
                          style="width: 350px">
                </el-input>
            </div>
            <div id="editor" style="margin-top: 20px"></div>
            <div class="selectp">
                <el-select value="" v-model="sid" size="mini" style="width: 200px" placeholder="请选择分类">
                    <el-option
                        v-for="item in sectorStates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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
                this.draft.write_date = new Date();
                this.$http.post(server.url + '/draft/save', this.draft).then(response => {
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
                this.article.TopicDate = new Date();
                this.$http.post(server.url + '/article/save', this.article).then(response => {
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
                editor: new WangEditor('#editor'),
                sinaData: [],
                emojiData: ['😀','😃','😄','😁','😆','😅','😂','🤣','😇','😊','🙂','🙃','😉','😌','😍','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','😢','😭','😤','😠','😡','🤬','🤯','😳','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','😴','😪','😵','🤐','🤧','😷','😈','👿','💩','👻','🤲','🙌','👏','🤝','👍','👎','👊','✊','🤛','🤜','🤞','✌','🤟','👌','👈','👉','👆','👇','👋','🤙','💪','🙏','👀','🙇‍','🙅‍','🙆‍','🙋‍','🤦‍','🤷‍','💅','🌝','🌚','❤️','💔','❣️','💕','💓','💗','💖','❌','✅','⭕️','💯','❗️','❓','⁉️','📝'],
                tagInputVisible: false,
                tagValue: '',
                loading: false,
                isSaved: false,
                sectorStates: [{value: '1', label: '信息技术'}],
                SectorName: [],
                sid: '',
                article: {
                    SectorId: 0,
                    TopicTitle: '',
                    TopicText: '',
                    TopicDate: new Date(),
                    UserId: 1, // 不知道如何获取
                    ReplyCount: 0,
                    ClickingRate: 0,
                    PraiseCount: 0,
                    favorite_count: 0
                },
                draft: {
                    user_id: 1,
                    publish_type_id: 0,
                    sector_id: 0,
                    draft_name: '',
                    draft_text: '',
                    write_date: new Date()
                },
                UPLOADER
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        }
    }
</script>
<style>
    .topic-post > .main {
        /*justify-content: flex-start;*/
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
