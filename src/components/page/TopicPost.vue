<template>
    <el-container v-loading="loading" class="topic-post">
        <el-main class="main">
            <div class="title">发表主题</div>
            <div align="left" class="topic-title">
                <el-input v-model="article.title" size="small" maxlength="25"
                          placeholder="请简要描述一下你的问题"
                          style="width: 350px"></el-input>
                <el-tag
                    :key="tag"
                    v-for="tag in article.dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="tagInputVisible" v-model="tagValue" ref="saveTagInput"
                    size="mini" style="width: 80px" maxlength="10"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" type="primary" size="mini" @click="showInput">+Tag</el-button>
            </div>
            <div id="editor">
            <mavon-editor
                :boxShadow="false"
                :subfield="false"
                :toolbars="toolBars"
                :fontSize="12"
                ref=md @imgAdd="$imgAdd" @imgDel="$imgDel">
            </mavon-editor>
            </div>
            <div class="post">
                <el-button size="mini" class="save-btn">保存到草稿箱</el-button>
                <el-button type="primary" size="mini" class="post-btn">发布</el-button>
            </div>
        </el-main>
    </el-container>
</template>
<script>
    import { mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'

    export default {
        name: 'editor',
        components: {
            'mavon-editor': mavonEditor
        },
        methods: {
            $imgAdd(pos, $file){
                // 第一步.将图片上传到服务器.
                var formdata = new FormData();
                formdata.append('image', $file);
                axios({
                    url: 'server url',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    // $vm.$img2Url 将md源码中图片文件名替换为url
                    $vm.$img2Url(pos, url);
                })
            },
            imgDel(pos) {},
            handleClose(tag) {
                this.article.dynamicTags.splice(this.article.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.tagInputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let tagValue = this.tagValue;
                if (tagValue) {
                    this.article.dynamicTags.push(tagValue);
                }
                this.tagInputVisible = false;
                this.tagValue = '';
            }
        },
        data() {
            return {
                tagInputVisible: false,
                tagValue: '',
                loading: false,
                article: {
                    id: '-1',
                    dynamicTags: [],
                    title: '',
                    mdContent: '',
                    cid: ''
                },
                toolBars: {
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    htmlcode: true, // 展示html源码
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    subfield: true, // 单双栏模式
                }
            }
        }
    }
</script>
<style>
    .topic-post > .main > #editor {
        width: 70%;
        height: 100px;
        padding-left: 0px;
        text-align: left;
        margin-top: 10px;
    }

    .topic-post > .main {
        /*justify-content: flex-start;*/
        flex-direction: column;
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        padding-top: 0px;
        padding-left: 0px;
        margin-top: 0px;
    }

    .topic-post > .main > .topic-title {
        margin-top: 10px
    }

    .topic-post > .main > .topic-title tag {
        background-color: #f7ffff;
        color: #0a9894;
        margin-left: 10px;
    }

    .topic-post > .main > .topic-title button {
        background-color: #1ac7c3;
        border-color: #1ac7c3;
    }

    .topic-post > .main > .title {
        font-size: 14px;
        font-weight: bold;
        color: #282828;
    }

    .topic-post > .main > .post {
        display: flex;
        margin-top: 15px;
        justify-content: flex-start;
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
