<template>
    <el-container class="topic-post">
        <!----- 引入wangEditor的css文件 ----->
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="../../../node_modules/wangeditor/release/wangEditor.min.css">
        <el-main class="main" v-loading="loading">
            <el-card style="width: 100%">
                <!----- 输入标题 ----->
                <div align="left" class="topic-title">
                    <el-input v-model="blackboard.blackboard_name" size="small" maxlength="25"
                              placeholder="请输入标题..."
                              style="width: 350px">
                    </el-input>
                </div>
                <!----- 编辑器 ----->
                <div id="editor" style="margin-top: 20px"></div>
                <!----- 提示字数限制 ----->
                <div align="right" style="font-size: 12px;color: #A6A6A6;">{{count}} / 200</div>
                <div class="selectp">
                    <!-- 选择分类 -->
                    <el-select value="" v-model="sid" size="mini" style="width: 200px" placeholder="请选择类别">
                        <el-option
                            v-for="item in sectors"
                            :key="item.SectorId"
                            :label="item.SectorName"
                            :value="item.SectorId">
                        </el-option>
                    </el-select>
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
                let t = this.editor.txt.text();
                // 限制字数
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
            this.getSectors();
        },
        methods: {
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
            saveInDrafts: function(){
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.draft.draft_name = this.blackboard.blackboard_name;
                this.draft.draft_text = this.blackboard.blackboard_text;
                if(this.sid !== '') this.draft.sector_id = Number(this.sid);
                var t = new Date();
                this.draft.write_date = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/draft/save', this.draft, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.loading = false;
                        this.isSaved = true;
                        this.$message({type: 'success', message: '黑板报已保存'});
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
            postOn: function(){
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
                var t = new Date();
                this.blackboard.blackboard_date = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/blackboard/save', this.blackboard, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.loading = false;
                        this.isSaved = true;
                        this.$message({type: 'success', message: '已发表，页面即将跳转'});
                        this.$router.push('/blackboard-list');
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
                    this.$message({type: 'error', message: '发表失败'});
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
                count: 0, // 当前输入的字数
                loading: false, // 加载状态
                isSaved: false, // 是否已经保存
                sid: '', // 标签ID
                sectors: [], // 可选标签
                // 黑板报实体
                blackboard: {
                    sector_id: 0,
                    blackboard_name: '',
                    blackboard_text: '',
                    blackboard_date: new Date(),
                    user_id: 1, // 不知道如何获取
                    reply_count: 0,
                    clicking_rate: 0,
                    praise_count: 0,
                    favorite_count: 0
                },
                // 草稿实体
                draft: {
                    user_id: 1,
                    publish_type_id: 1,
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
