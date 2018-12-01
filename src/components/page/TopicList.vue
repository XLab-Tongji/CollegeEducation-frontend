<template>
    <el-container>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <el-main style="padding-top: 0">
            <div>
                <el-menu
                    default-active="/topic-list"
                    router
                    mode="horizontal"
                    background-color="#fff"
                    text-color="#282828"
                    active-text-color="#1ac7c3">
                    <el-menu-item index="/topic-list"><i class="fa fa-list-alt" aria-hidden="true" style="margin-right: 5px"></i>首页</el-menu-item>
                    <el-menu-item index="/blackboard-list"><i class="fa fa-clipboard" aria-hidden="true" style="margin-right: 5px"></i>黑板报</el-menu-item>
                    <el-submenu index="">
                        <template slot="title"><i class="fa fa-pencil-square-o" aria-hidden="true" style="margin-right: 5px"></i>发布</template>
                        <el-menu-item index="/topic-post">文章</el-menu-item>
                        <el-menu-item index="/blackboard">黑板报</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/question"><i class="fa fa-question-circle-o" aria-hidden="true" style="margin-right: 5px"></i>答疑</el-menu-item>
                </el-menu>
            </div>
            <div style="margin-top: 15px"><router-view></router-view></div>
        </el-main>
    </el-container>
</template>

<style>

</style>
