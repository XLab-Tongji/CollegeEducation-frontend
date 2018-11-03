<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 个人中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
                <el-menu-item index="/my-download">我的下载</el-menu-item>
                <el-menu-item index="/my-upload">我的上传</el-menu-item>
            </el-menu>
            <div style="margin-top: 15px"><router-view></router-view></div>
        </div>
    

        

    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                activeIndex:'/my-upload'
            }
        },
        methods: {
            
        }
    }
</script>