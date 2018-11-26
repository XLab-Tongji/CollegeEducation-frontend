<template>
    <div style="max-width: 1920px;margin: auto">
        <el-col :span='6' style='padding-right: 8pt;max-width: 450px'>
            <el-card style="text-align: center;background-color: white;padding-top: 8pt">
                <div>
                    <img src="../../assets/1.jpg" style="width: 100pt;height:100pt;border-radius: 50pt;vertical-align: middle;">
                </div>
                <div class="nickName">{{userInfo.username}}</div>
                <div class="description">
                    <el-tag style='margin-left:1pt;margin-right: 1pt' type="success">点赞{{userInfo.mySuggestedNum}}次</el-tag>
                    <el-tag style='margin-left:1pt;margin-right: 1pt'>我获得了{{(userInfo.suggestedRate*100).toFixed(2)}}%的赞</el-tag>
                    <el-tag style='margin-left:1pt;margin-right: 1pt' type="warning">资源平均分：{{userInfo.avgScore.toFixed(2)}}</el-tag>
                </div>
                <div style="margin-top: 16pt;border-top: solid #eeeeee 1px; padding-top: 8pt;padding-bottom: 12pt" v-loading='userInfo.loading'>
                    <div style="display: inline-block;width: 50pt;padding-left: 4pt;padding-right: 4pt;">
                        <div class="infoNumber">{{userInfo.myUploadNum}}</div>
                        <div class="infoTag">我的上传</div>
                    </div>
                    <div style="display: inline-block;width: 50pt;padding-left: 4pt;padding-right: 4pt;">
                        <div class="infoNumber">{{userInfo.myDownloadNum}}</div>
                        <div class="infoTag">我的下载</div>
                    </div>
                    <div style="display: inline-block;width: 50pt;padding-left: 4pt;padding-right: 4pt;">
                        <div class="infoNumber">{{userInfo.myFavouriteNum}}</div>
                        <div class="infoTag">我的收藏</div>
                    </div>
                </div>

            </el-card>
        </el-col>

        <el-col :span='18' style='padding-top: -50px;margin:auto;' >
            <el-menu :default-active="activeIndex" mode="horizontal" router background-color='white'>
                <el-menu-item index="/my-upload" @click='personalInformationInit'>我的上传</el-menu-item>
                <el-menu-item index="/my-download" @click='personalInformationInit'>我的下载</el-menu-item>
                <el-menu-item index="/collection" @click='personalInformationInit'>我的收藏</el-menu-item>
            </el-menu>
            <div style="margin-top: 0px"><router-view></router-view></div>
        </el-col>

    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import server from '../../../config/index';
    export default {
        name: 'baseform',
        data: function(){
            return {
                activeIndex:'/my-upload',
                userInfo:{
                    username:"",
                    myUploadNum:0,
                    myDownloadNum:0,
                    myFavouriteNum:0,
                    loading:false,
                    mySuggestedNum:0,
                    avgScore:0,
                    suggestedRate:0,
                }
            }
        },
        mounted:function(){
            this.personalInformationInit();
        },
        methods: {
            personalInformationInit(){
                this.userInfo.loading=true;
                this.$http.get(server.url+'/user/detail/',{}).then(function(response){
                    this.userInfo.username=response.data.data.username;
                    this.userInfo.myUploadNum=response.data.data.myUploadNum;
                    this.userInfo.myDownloadNum=response.data.data.myDownloadNum;
                    this.userInfo.myFavouriteNum=response.data.data.myFavouriteNum;
                    this.userInfo.mySuggestedNum=response.data.data.mySuggestedNum;
                    this.userInfo.avgScore=response.data.data.avgScore;
                    this.userInfo.suggestedRate=response.data.data.suggestedRate;
                    this.userInfo.loading=false;
                })
            }
        }
    }
</script>

<style scoped>
.nickName{
    font-size: 24pt;
    margin-top: 8pt;
}
.description{
    padding-left: 1pt;
    margin-top: 8pt;
    color:#cccccc;
    font-size: 12pt;
    line-height: 28pt;
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

