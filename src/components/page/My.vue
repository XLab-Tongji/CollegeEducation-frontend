<template>
    <div style="max-width: 1920px;margin: auto">
        <el-header hidden='true' style='background-color: white;border-bottom: 3px #F0F0F0 solid;margin-top: 4pt;padding-top: 16pt;padding-bottom: 16pt;height: '>
            <div hidden="true">
                <div style="display: inline-block;">
                    <img src="../../assets/1.jpg" style="width: 80pt;height:80pt;border-radius: 40pt;vertical-align: middle;">
                </div>
                <div style="display: inline-block;vertical-align: top;margin-left:16pt;padding-top: 1pt">
                    <div class="nickName">{{userInfo.nickname}}</div>
                    <div class="description">{{userInfo.description}}</div>
                    <div class="tag"><el-tag style='margin-right: 2pt' type="success">同济大学</el-tag><el-tag>软件工程专业</el-tag></div>
                </div>
            </div>
        </el-header>
        <el-col :span='6' style='padding-right: 8pt;max-width: 450px'>
            <el-card style="text-align: center;background-color: white;padding-top: 8pt">
                <div>
                    <img src="../../assets/1.jpg" style="width: 100pt;height:100pt;border-radius: 50pt;vertical-align: middle;">
                </div>
                <div class="nickName">{{userInfo.nickname}}</div>
                <div class="description">{{userInfo.description}}</div>
                <div style="margin-top: 16pt;border-top: solid #eeeeee 1px; padding-top: 8pt">
                    <div style="display: inline-block;width: 50pt;padding-right: 4pt">
                        <div class="infoNumber">8</div>
                        <div class="infoTag">我的上传</div>
                    </div>
                    <div style="display: inline-block;width: 50pt;padding-left: 4pt;padding-right: 4pt;">
                        <div class="infoNumber">17</div>
                        <div class="infoTag">我的下载</div>
                    </div>
                    <div style="display: inline-block;width: 50pt;padding-left: 4pt">
                        <div class="infoNumber">2</div>
                        <div class="infoTag">我的收藏</div>
                    </div>
                </div>
                <div style="margin-top: 24pt;font-size: 8pt;">下面可以是列表式的按钮或风琴式的信息</div>
            </el-card>
        </el-col>
        <!--
        <div style='padding-top: -50px;margin:auto;' >
	        <el-menu :default-active="activeIndex" mode="horizontal" router background-color='white'>
                <el-menu-item index="/my-upload">我的上传</el-menu-item>
	            <el-menu-item index="/my-download">我的下载</el-menu-item>
                <el-menu-item index="/collection">我的收藏</el-menu-item>
	        </el-menu>
	        <div style="margin-top: 0px"><router-view></router-view></div>
        </div>
	    -->
        <el-col :span='18' style='padding-top: -50px;margin:auto;' >
            <el-menu :default-active="activeIndex" mode="horizontal" router background-color='white'>
                <el-menu-item index="/my-upload">我的上传</el-menu-item>
                <el-menu-item index="/my-download">我的下载</el-menu-item>
                <el-menu-item index="/collection">我的收藏</el-menu-item>
            </el-menu>
            <div style="margin-top: 0px"><router-view></router-view></div>
        </el-col>

    

        

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
/*.nickName{
    font-size: 18pt;
}
.description{
    padding-left: 1pt;
    margin-top: 2pt;
    color:#cccccc;
    font-size: 10pt;
}*/
.nickName{
    font-size: 24pt;
    margin-top: 8pt;
}
.description{
    padding-left: 1pt;
    margin-top: 4pt;
    color:#cccccc;
    font-size: 12pt;
}
.tag{
    margin-top: 8pt;
}
.infoNumber{
    font-size: 20pt;
    padding-top: 4pt;
}
.infoTag{
    margin-top: 4pt;
    font-size: 8pt;
    color:#888888;
    padding-bottom: 4pt;
}
</style>

