<template>
    <div style="margin-top: 2pt;min-height: 300pt" v-loading='loading'>
        <el-card class='listCard' style='margin-bottom: 2pt' shadow='hover' v-for='(item, idx) in sourceList' :key="idx" @click.native='clickCard(item)'>
            <el-row>
                <el-col :span='2' style="display:inline-block;max-width: 60px">
                <i class="el-icon-upload" style="font-size: 40px;text-align: center;color:#449CFA;padding-top: 4pt"></i>
                </el-col>
                <el-col :span='22' style="display: inline-block;vertical-align: top;">
                    <div class="title" style="font-size: 12pt;margin-bottom: 4pt;font-weight: bold;display: inline-block;">{{item.resourceName}}</div>       
                    <div class="context" style="font-size:10pt;color: grey;line-height: 150%;text-align: justify">{{item.description}}</div>
                    <div class="subtitle" style="margin-top: 4pt; font-size: 8pt; color:darkgrey;">{{item.uploadTime}}</div>
                </el-col>
            </el-row>
        </el-card>
        <div style="font-size:10pt;color:#aaaaaa;text-align: center;padding-top: 32pt" v-if='sourceList.length==0'>
            <img src="../../assets/empty.png" style="width: 80pt;height: 80pt;margin-bottom: 16pt;">
            <div>您还没有下载过资源，快去下载吧</div>
        </div>
        <div style="text-align: center;margin-top: 8pt">
            <div class="block" v-if='sourceList.length!=0'>
              <el-pagination
                @current-change='getDownloadList'
                :background='true'
                layout="prev, pager, next"
                :total="page.total"
                :current-page='page.current'
                :page-size='page.size'>
              </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import server from '../../../config/index';
    import axios from 'axios';
    export default {
        name: 'baseform',
        data: function(){
            return {
                sourceList:[],
                page:{
                    total:0,
                    current:0,
                    size:0,
                },
                loading:true,
            }
        },
        mounted:function(){
            this.getDownloadList(1)
        },
        methods: {
        // 监听点击卡片事件，处理页面跳转
            clickCard(res){
                this.$router.push({
                    name:'SourcePage',
                    params:{
                        resourceID:res.resourceID,
                        id:res.id,
                        uploaderID:res.uploaderID,
                        categoryID:res.categoryID,
                        resourceMajorID:res.resourceMajorID,
                        resourceName:res.resourceName,
                        description:res.description,
                        downloadTimes:res.downloadTimes,
                        uploadTime:res.uploadTime,
                        points:res.points
                    }
                })
            },
            getDownloadList(val){
                var that=this;
                this.loading=true;
                this.page.current=val;
                this.$axios({
                    method:'get',
                    url:server.url+'/resource/myDownload/'+val,
                    headers:{Authorization:'Bearer '+localStorage.getItem('token')},
                    data:{}
                }).then(function(response){
                    that.page.total=response.data.data.total;
                    that.page.size=response.data.data.pageSize;
                    that.sourceList.splice(0,that.sourceList.length)
                    for(let i=0;i<response.data.data.list.length;i++){
                        that.sourceList.push(response.data.data.list[i]);
                    }
                    that.loading=false;
                })
            }
        }
    }
</script>

