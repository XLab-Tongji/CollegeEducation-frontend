<template>
    <el-container>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <el-main style="padding-top: 0">
            <div>
                <el-breadcrumb separator="/" style="margin-top: 10px">
                    <el-breadcrumb-item :to="{ path: '/class-list' }" replace>班级</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/topic-list' }" replace @click="setTopicPage">文章</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/blackboard-list' }" replace @click="setBlackboardPage">黑板报</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/question-list' }" replace>答疑</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div style="margin-top: 15px"><router-view></router-view></div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
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
        }
    }
</script>

<style>

</style>
