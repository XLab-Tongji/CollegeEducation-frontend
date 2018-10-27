<template>
    <el-container class="topic-post">
        <link rel="stylesheet" href="../../../node_modules/wangeditor/release/wangEditor.min.css">
        <el-main class="main" v-loading="loading">
            <div align="left" class="topic-title">
                <el-input v-model="article.topicTitle" size="small" maxlength="25"
                          placeholder="请输入标题..."
                          style="width: 350px">
                </el-input>
            </div>
            <div id="editor" style="margin-top: 20px"></div>
            <div class="selectp">
                <el-select value="" v-model="article.SectorState" size="mini" style="width: 200px" placeholder="请选择分类">
                    <el-option
                        v-for="item in sectorStates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-tag
                    :key="tag"
                    v-for="tag in article.SectorName"
                    closable
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

<script >
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
            this.editor.customConfig.menus = [
                'link',  // 插入链接
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
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
            // 删除tag
            handleClose(tag) {
                this.article.SectorName.splice(this.article.SectorName.indexOf(tag), 1);
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
                let tagValue = this.tagValue;
                for(var i in this.article.SectorName){
                    if(this.article.SectorName[i] === tagValue) {
                        this.$message({type: 'error', message: '该标签已添加'});
                        return;
                    }
                }
                if (tagValue) {
                    this.article.SectorName.push(tagValue);
                }
                this.tagInputVisible = false;
                this.tagValue = '';
            },
            // 存入草稿箱
            saveInDrafts(){

            },
            // 发布
            postOn(){

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
                sectorStates: [{value: '1', label: '信息技术'}],
                article: {
                    SectorState: '',
                    SectorName: [],
                    topicTitle: '',
                    topicText: ''
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
</style>
