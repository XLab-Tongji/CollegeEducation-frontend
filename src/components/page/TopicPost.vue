<template>
    <el-container v-loading="loading" class="topic-post">
        <el-main class="main">
            <div class="title">发表主题</div>
            <div align="left" class="topic-title">
                <el-input v-model="article.title" size="small" placeholder="请输入标题..." style="width: 350px"></el-input>
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
                    v-if="tagInputVisible"
                    v-model="tagValue"
                    ref="saveTagInput"
                    size="mini"
                    style="width: 80px"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" type="primary" size="mini" @click="showInput">+Tag</el-button>
            </div>
            <div style="margin-top: 10px; font-size: 10px">此处有框</div>
            <div class="post">
                <el-button size="mini" class="save-btn">保存到草稿箱</el-button>
                <el-button type="primary" size="mini" class="post-btn">发布</el-button>
            </div>
        </el-main>
    </el-container>
</template>
<script>
    // Local Registration
    import {mavonEditor} from 'mavon-editor'
    // 可以通过 mavonEditor.markdownIt 获取解析器markdown-it对象
    import 'mavon-editor/dist/css/index.css'

    export default {
        components: {
            mavonEditor
        },
        methods: {
            imgAdd(pos, $file){

            },
            imgDel(pos){

            },
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
                from: '',
                article: {
                    id: '-1',
                    dynamicTags: [],
                    title: '',
                    mdContent: '',
                    cid: ''
                }
            }
        }
    }
</script>
<style>
    .topic-post > .main > #editor {
        width: 70%;
        height: 100px;
        text-align: left;
        margin-bottom: 0px;
        padding-bottom: 0px;
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
        margin-top: 0px
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
