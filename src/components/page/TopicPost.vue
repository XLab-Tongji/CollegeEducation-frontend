<template>
    <el-container class="topic-post">
        <!----- 引入wangEditor的css文件 ----->
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="../../../node_modules/wangeditor/release/wangEditor.min.css">
        <el-main class="main" v-loading="loading">
            <el-card style="width: 100%">
                <!----- 输入标题 ----->
                <div align="left">
                    <el-input v-model="article.TopicTitle" size="small" maxlength="25"
                              placeholder="请输入标题..."
                              style="width: 350px">
                    </el-input>
                </div>
                <!----- 编辑器 ----->
                <div id="editor" style="margin-top: 20px"></div>

                <div class="selectp">
                    <!-- 添加标签 -->
                    <div style="margin-top: 10px">
                        <el-select
                            value=""
                            v-model="SectorName"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="添加标签" style="width: 40%">
                            <el-option
                                v-for="item in sectors"
                                :key="item.SectorId"
                                :label="item.SectorName"
                                :value="item.SectorName">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <!----- 保存和发表按键 ----->
                <div class="post">
                    <el-button size="mini" class="save-btn" @click="saveInDrafts">保存到草稿箱</el-button>
                    <el-button type="primary" size="mini" class="post-btn" @click="postOn">发布</el-button>
                </div>
            </el-card>
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
        mounted: function(){
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
            this.getSectors();
        },
        methods: {
            // 存入草稿箱
            saveInDrafts: function() {
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.draft.draft_name = this.article.TopicTitle;
                this.draft.draft_text = this.article.TopicText;
                this.draft.sectorName = this.SectorName;
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
            postOn: function() {
                if(this.article.TopicTitle === '') {
                    this.$message({type: 'error', message: '请输入标题！'});
                    return
                }
                if(this.article.TopicText === '') {
                    this.$message({type: 'error', message: '请输入内容！'});
                    return
                }
                if(this.SectorName === []) {
                    this.$message({type: 'error', message: '请添加标签！'});
                    return
                }
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.article.sectorName = this.SectorName;
                var t = new Date();
                this.article.TopicDate = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/article/save', this.article, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.loading = false;
                        this.isSaved = true;
                        this.$message({type: 'success', message: '已发表，页面即将跳转'});
                        this.$router.push({
                            path: '/topic-list',
                            name: 'TopicList',
                            query: {
                                index: 1
                            }
                        });
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
            },
            // 获取标签
            getSectors: function() {
                if (this.sectors.length === 0) {
                    this.$http.get(server.url + '/sector/get', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                        if (response.status === 200) {
                            var sectorList = JSON.parse(response.bodyText);
                            var i = 0;
                            while (i < sectorList.data.length) {
                                this.sectors.push({
                                    SectorId: sectorList.data[i].SectorId,
                                    SectorName: sectorList.data[i].SectorName
                                });
                                i++;
                            }
                        } else {
                            this.$message({type: 'error', message: '加载失败!'});
                        }
                    }, (response) => {
                        if (response.status === 403) {
                            this.$message({type: 'error', message: response.response.data});
                        } else {
                            this.$message({type: 'error', message: '加载失败!'});
                        }
                    }).catch((response) => {
                        this.$message({type: 'error', message: '加载失败!'});
                    })
                }
            },
        },

        data() {
            return {
                editor: new WangEditor('#editor'), // 编辑器
                sinaData: [], // 新浪表情数组
                // emoji数组
                emojiData: ['😀','😃','😄','😁','😆','😅','😂','🤣','😇','😊','🙂','🙃','😉','😌','😍','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','😢','😭','😤','😠','😡','🤬','🤯','😳','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','😴','😪','😵','🤐','🤧','😷','😈','👿','💩','👻','🤲','🙌','👏','🤝','👍','👎','👊','✊','🤛','🤜','🤞','✌','🤟','👌','👈','👉','👆','👇','👋','🤙','💪','🙏','👀','🙇‍','🙅‍','🙆‍','🙋‍','🤦‍','🤷‍','💅','🌝','🌚','❤️','💔','❣️','💕','💓','💗','💖','❌','✅','⭕️','💯','❗️','❓','⁉️','📝'],
                loading: false, // 加载状态
                isSaved: false, // 是否已经保存
                SectorName: [], // 所有已经添加的标签内容
                sectors: [], // 可选择的标签
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
                    sectorName: [],
                    favorite_count: 0
                },
                // 草稿实体
                draft: {
                    user_id: 1,
                    publish_type_id: 0,
                    sectorName: [],
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
        display: flex;
        justify-content: flex-start;
        padding-top: 0;
        padding-left: 0;
    }

    .selectp {
        margin-top: 17px;
    }

    .selectp button {
        background-color: #1ac7c3;
        border-color: #1ac7c3;
    }

    .post {
        display: flex;
        justify-content: flex-start;
        margin-top: 15px;
    }

    .post .save-btn {
        border-color: #1ac7c3;
        color: #1ac7c3;
    }

    .post .post-btn {
        background-color: #1ac7c3;
        border-color: #1ac7c3;
    }
</style>
