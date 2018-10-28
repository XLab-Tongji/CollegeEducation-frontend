<template>
    <el-container class="topic-post">
        <link rel="stylesheet" href="../../../node_modules/mavon-editor/dist/css/index.css">
        <el-main class="main" v-loading="loading">
            <div align="left" class="topic-title">
                <el-input v-model="blackboard.blackboard_name" size="small" maxlength="25"
                          placeholder="请输入标题..."
                          style="width: 350px">
                </el-input>
            </div>
            <div id="editor" style="margin-top: 20px"></div>
            <div align="right" style="font-size: 12px;color: #A6A6A6;">{{count}} / 200</div>
            <div class="select">
            <el-select value="" v-model="sid" size="mini" style="width: 200px" placeholder="请选择类别">
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
                closable、
                :disable-transitions="false"
                class="tag"
                @close="handleClose(tag)">
                {{tag}}
            </el-tag>
            <el-input
                v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput"
                size="mini" style="width: 80px" maxlength="10"
                @keyup.enter.native="handleInputConfirm"
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
<script>
    import WangEditor from 'wangeditor';
    import data from '../../data/sina-data.js'
    import server from '../../../config/index';
    import {UPLOADER} from '../../tools/utils'
    export default {
        name: 'editor',
        mounted(){
            for(var i = 0;i < data.length;i++){
                this.sinaData.push({alt: data[i].phrase, src: data[i].icon});
            }
            this.editor.customConfig.onchange = () => {
                var t = this.editor.txt.text();
                if(this.count > 200) {
                    this.$message({type: 'error', message: '字数超出范围！'});
                    var str = t.substring(0, 200);
                    this.editor.txt.text(str);
                }
                this.count = t.length;
                this.blackboard.blackboard_text = this.editor.txt.html();
                // 文章再次修改
                this.isSaved = false;
            };
            this.editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'foreColor',  // 文字颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
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
            // 添加标签
            handleClose(tag) {
                this.Sectorname.splice(this.SectorName.indexOf(tag), 1);
            },
            showInput() {
                this.tagInputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let tagValue = this.tagValue;
                for(var i in this.SectorName){
                    if(this.SectorName[i] === tagValue) {
                        this.$message({type: 'error', message: '该标签已添加'});
                        return;
                    }
                }
                this.SectorName.push(tagValue);
                this.tagInputVisible = false;
                this.tagValue = '';
            },
            // 读取版块名称
            /*
            loadSectorState(){
                var url = '';
                this.$http.get(server.url + url).then((response) => {
                    if (response.status == 200) {
                        var stateList = JSON.parse(response.bodyText);
                        var i = 0;
                        while(i < stateList.length) {
                        sectorStates.push({});
                        i++;
                        }
                    } else {
                        this.$message({type: 'error', message: '数据加载失败!'});
                    }
                }, (response) => {
                    this.loading = false;
                    if (response.status == 403) {
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.$message({type: 'error', message: '数据加载失败!'});
                    }
                }).catch((response) => {
                    _this.loading = false;
                    this.$message({type: 'error', message: '数据加载失败!'});
                })
            },
            */
            // 存入草稿箱
            saveInDrafts(){
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.draft.draft_name = this.blackboard.blackboard_name;
                this.draft.draft_text = this.blackboard.blackboard_text;
                if(this.sid !== '') this.draft.sector_id = Number(this.sid);
                this.draft.write_date = new Date();
                var param = new URLSearchParams();
                param.append('draft', this.draft);
                this.$http.post(server.url + '/draft/save', param).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.loading = false;
                        this.isSaved = true;
                        this.$message({type: 'success', message: '文章已保存'});
                    }
                    else{
                        this.loading = false;
                        this.editor.$textElem.attr('contenteditable', true);
                        this.$notify.error({
                            title: '保存失败',
                            message: 'status='+response.status
                        })
                    }
                }, response => {
                    this.editor.$textElem.attr('contenteditable', true);
                    this.loading = false;
                    console.log("error");
                    console.log(response);
                    this.$notify.error({
                        title: '保存失败',
                        message: 'status='+response.status
                    })
                }).catch((response) => {
                    alert(response.status);
                    this.loading = false;
                    this.$notify.error({
                        title: '保存失败',
                        message: 'status='+response.status
                    })
                });
            },
            // 发布
            postOn(){
                if(this.blackboard.blackboard_name === '') {
                    this.$message({type: 'error', message: '请输入标题！'});
                    return
                }
                if(this.blackboard.blackboard_text === '') {
                    this.$message({type: 'error', message: '请输入内容！'});
                    return
                }
                if(this.sid === '') {
                    this.$message({type: 'error', message: '请选择分类！'});
                    return
                }
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.blackboard.sector_id = Number(this.sid);
                this.blackboard.blackboard_date = new Date();
                var param = new URLSearchParams();
                param.append('blackboard', this.blackboard);
                this.$http.post(server.url + '/blackboard/save', param).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.loading = false;
                        this.isSaved = true;
                        this.$message({type: 'success', message: '已发表，页面即将跳转'});
                        this.$router.push('/topic-list');
                    }
                    else{
                        this.loading = false;
                        this.editor.$textElem.attr('contenteditable', true);
                        this.$notify.error({
                            title: '发表失败',
                            message: 'status='+response.status
                        })
                    }
                }, response => {
                    this.editor.$textElem.attr('contenteditable', true);
                    this.loading = false;
                    console.log("error");
                    console.log(response);
                    this.$notify.error({
                        title: '保存失败',
                        message: 'status='+response.status
                    })
                }).catch((response) => {
                    alert(response.status);
                    this.loading = false;
                    this.$notify.error({
                        title: '保存失败',
                        message: 'status='+response.status
                    })
                });
            }
        },
        data() {
            return {
                objectName: '',
                editor: new WangEditor('#editor'),
                sinaData: [],
                emojiData: ['😀','😃','😄','😁','😆','😅','😂','🤣','😇','😊','🙂','🙃','😉','😌','😍','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','😢','😭','😤','😠','😡','🤬','🤯','😳','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','😴','😪','😵','🤐','🤧','😷','😈','👿','💩','👻','🤲','🙌','👏','🤝','👍','👎','👊','✊','🤛','🤜','🤞','✌','🤟','👌','👈','👉','👆','👇','👋','🤙','💪','🙏','👀','🙇‍','🙅‍','🙆‍','🙋‍','🤦‍','🤷‍','💅','🌝','🌚','❤️','💔','❣️','💕','💓','💗','💖','❌','✅','⭕️','💯','❗️','❓','⁉️','📝'],
                tagInputVisible: false,
                tagValue: '',
                count: 0,
                loading: false,
                isSaved: false,
                sectorStates: [{value: '1', label: '信息技术'}],
                SectorName: [],
                sid: '',
                blackboard: {
                    sector_id: 0,
                    blackboard_name: '',
                    blackboard_text: '',
                    blackboard_date: new Date(),
                    user_id: 33, // 不知道如何获取
                    reply_count: 0,
                    clicking_rate: 0,
                    praise_count: 0,
                    favorite_count: 0
                },
                draft: {
                    user_id: 33,
                    publish_type_id: 1,
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
        },
        /*
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
        /*justify-content: flex-start;*/
        flex-direction: column;
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        padding-top: 0;
        padding-left: 0;
    }

    .topic-post > .main > .select .tag {
        background-color: #f7ffff;
        color: #0a9894;
        margin-left: 5px;
    }

    .topic-post > .main > .select button {
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
