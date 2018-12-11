<template>
    <el-container>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <el-main style="padding-top: 0">
            <div>
                <el-menu
                    :default-active="path"
                    router
                    mode="horizontal"
                    background-color="#fff"
                    text-color="#282828"
                    active-text-color="#1ac7c3">
                    <el-menu-item index="/topic-list" @click="setTopicPage"><i class="fa fa-list-alt" aria-hidden="true" style="margin-right: 5px"></i>首页</el-menu-item>
                    <el-menu-item index="/blackboard-list" @click="setBlackboardPage"><i class="fa fa-clipboard" aria-hidden="true" style="margin-right: 5px"></i>黑板报</el-menu-item>
                    <el-submenu index="">
                        <template slot="title"><i class="fa fa-pencil-square-o" aria-hidden="true" style="margin-right: 5px"></i>发布</template>
                        <el-menu-item index="/topic-post">文章</el-menu-item>
                        <el-menu-item index="/blackboard-post">黑板报</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/question-list"><i class="fa fa-question-circle-o" aria-hidden="true" style="margin-right: 5px"></i>答疑</el-menu-item>
                </el-menu>
            </div>
            <div style="margin-top: 15px"><router-view></router-view></div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                index: -1
            }
        },
        created: function(){
            this.setTopicPage();
            this.setBlackboardPage();
            this.getParams();
        },
        methods: {
            setTopicPage: function() {
                localStorage.setItem('pageT',JSON.stringify(1));
            },
            setBlackboardPage: function() {
                localStorage.setItem('pageB',JSON.stringify(1));
            },
            // 获取上一页面传递的参数
            getParams: function () {
                //alert(this.index)
                this.index = this.$route.query.index;
            },
        },
        destroyed: function() {
            localStorage.removeItem('pageT');
            localStorage.removeItem('pageB');
        },
        computed: {
            path: function(){
                var defaultPath = '';
                switch (this.index) {
                    case 1: {
                        defaultPath='/topic-list';
                        break;
                    }
                    case 2: {
                        defaultPath='/blackboard-list';
                        break;
                    }
                    case 3: {
                        defaultPath='/question-list';
                        break;
                    }
                    default: {
                        defaultPath='/topic-list';
                        break;
                    }
                }
                return defaultPath;
            },
        }
    }
</script>

<style>

</style>
