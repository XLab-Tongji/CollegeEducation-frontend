<template>
    <div style="max-width: 1920px;margin: auto">
        <el-header style='background-color: white;border-bottom: 3px #F0F0F0 solid;margin-top: 4pt;padding-top: 16pt;padding-bottom: 16pt;height: '>
            <div>
                <div style="display: inline-block;">
                    <img src="../../assets/1.jpg" style="width: 80pt;height:80pt;border-radius: 40pt;vertical-align: middle;">
                </div>
                <div style="display: inline-block;vertical-align: top;margin-left:16pt;padding-top: 1pt">
                    <div class="nickName">{{userInfo.nickname}}</div>
                    <div class="description">{{userInfo.description}}</div>
                    <div class="tag"><el-tag style='margin-right: 2pt' type="success">同济大学</el-tag><el-tag>软件工程专业</el-tag></div>
                </div>
            </div>
            <div></div>
        </el-header>
        <div style='padding-top: -50px;margin:auto;'>
	        <el-menu :default-active="activeIndex" mode="horizontal" router background-color='white'>
                <el-menu-item index="/my-upload">我的上传</el-menu-item>
	            <el-menu-item index="/my-download">我的下载</el-menu-item>
                <el-menu-item index="/collection">我的收藏</el-menu-item>
	        </el-menu>
	        <div style="margin-top: 0px"><router-view></router-view></div>
        </div>
	
    

        

    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                activeIndex:'/my-upload',
                userInfo:{
                    nickname:"Techevan",
                    description:"这里是一句很矫情的签名。"
                }
            }
        },
        methods: {
            
        }
    }
</script>

<style scoped>
.nickName{
    font-size: 18pt;
}
.description{
    padding-left: 1pt;
    margin-top: 2pt;
    color:#cccccc;
    font-size: 10pt;
}
.tag{
    margin-top: 8pt;
}
</style>

