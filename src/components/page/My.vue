<template>
    <div style="max-width: 1920px;margin: auto">
        <el-col :span='6' style='padding-right: 8pt;max-width: 450px'>
            <el-card style="text-align: center;background-color: white;padding-top: 8pt">
                <div>
                    <img :src="srcImg" style="width: 100pt;height:100pt;border-radius: 50pt;vertical-align: middle;">
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
            <el-card style="background-color: white;padding-top: 4pt;margin-top: 8pt">
                <i class="el-icon-star-on" style="color:#449CFA;"> 我的积分</i>
                <i style="float: right;color:#3399ff;font-weight: bold">{{userInfo.leftPoints}}</i>
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
    inject:['reload'];
    import VueCropper  from 'vue-cropperjs';
    import server from '../../../config/index';
    import axios from 'axios';
    export default {
        name: 'baseform',
        data: function(){
            return {
                srcImg:'',
                activeIndex:'/my-upload',
                userInfo:{
                    username:localStorage.getItem('ms_username'),
                    myUploadNum:0,
                    myDownloadNum:0,
                    myFavouriteNum:0,
                    loading:false,
                    mySuggestedNum:0,
                    avgScore:0,
                    suggestedRate:0,
                    leftPoints:0,
                }
            }
        },
        mounted:function(){
            this.reload();
            var that=this;
            this.$axios({
                        method:'get',
                        url:server.url+'/user/getIcon',
                        headers:{'Authorization':'Bearer '+localStorage.getItem('token')},
                        responseType:'arraybuffer',
                    }).then(function(response){
                        var src='data:image/jpeg;base64,'+btoa(new Uint8Array(response.data).reduce((data,byte)=>data+String.fromCharCode(byte),''));
                        that.srcImg=src;
                }).catch((response)=>{
                    console.error('获取头像：',response)
            })
            var that=this;
            this.userInfo.loading=true;
            this.$axios({
                method:'get',
                url:server.url+'/user/detail/',
                headers:{Authorization:'Bearer '+localStorage.getItem('token')},
            }).then(function(response){
                that.userInfo.username=response.data.data.username;
                that.userInfo.myUploadNum=response.data.data.myUploadNum;
                that.userInfo.myDownloadNum=response.data.data.myDownloadNum;
                that.userInfo.myFavouriteNum=response.data.data.myFavouriteNum;
                that.userInfo.mySuggestedNum=response.data.data.mySuggestedNum;
                that.userInfo.avgScore=response.data.data.avgScore;
                that.userInfo.suggestedRate=response.data.data.suggestedRate;
                that.userInfo.loading=false;
                that.userInfo.leftPoints=response.data.data.leftPoints;
                if(!that.userInfo.avgScore){that.userInfo.avgScore=0;}
                if(!that.userInfo.suggestedRate){that.userInfo.suggestedRate=0;}
            })
        },
        methods: {
            personalInformationInit(){
                var that=this;
                this.userInfo.loading=true;
                this.$axios({
                    method:'get',
                    url:server.url+'/user/detail/',
                    headers:{Authorization:'Bearer '+localStorage.getItem('token')},
                }).then(function(response){
                    that.userInfo.username=response.data.data.username;
                    that.userInfo.myUploadNum=response.data.data.myUploadNum;
                    that.userInfo.myDownloadNum=response.data.data.myDownloadNum;
                    that.userInfo.myFavouriteNum=response.data.data.myFavouriteNum;
                    that.userInfo.mySuggestedNum=response.data.data.mySuggestedNum;
                    that.userInfo.avgScore=response.data.data.avgScore;
                    that.userInfo.suggestedRate=response.data.data.suggestedRate;
                    that.userInfo.loading=false;
                    that.userInfo.leftPoints=response.data.data.leftPoints;
                    if(!that.userInfo.avgScore){that.userInfo.avgScore=0;}
                    if(!that.userInfo.suggestedRate){that.userInfo.suggestedRate=0;}
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

