<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-upload"></i> 资源详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card style='margin-bottom: 8pt'>
            <el-row id='info'>
                <el-col :span='2' style='display: inline-block; max-width: 84pt;min-width: 72pt;margin-bottom: 4pt'>
                    <i class="el-icon-upload" style="font-size: 60pt;text-align: center;color:#449CFA;padding-top: 4pt;padding-left: 8pt;padding-right: 16pt"></i>
                </el-col>
                <el-col :span='22' style="display: inline-block;vertical-align: top;">
                    <div style="margin-bottom: 4pt">
                        <div class="sourceTitle" style="display: inline-block;">{{this.$route.params.resourceName}}</div>
                        <div style="display: inline-block;vertical-align: top;padding-top: 2pt;margin-left: 4pt">
                            <el-tag>资源平均分：{{resourceDetail.avgScore}}</el-tag>
                            <el-tag type="success">下载需要{{this.$route.params.points}}积分</el-tag>
                        </div>
                    </div>
                    <div class="context">{{this.$route.params.description}}</div>
                    <div style="margin-top: 12pt">
                        <el-button size='mini' icon='el-icon-lx-group'>分享</el-button>
                        <el-button-group style="display: inline-block;" id='thumb'>
                          <el-button size='mini' :type='thumb.up' @click='thumbUp'>赞({{resourceDetail.suggestInfoNum}})</el-button>
                          <el-button size='mini' :type='thumb.down' @click='thumbDown'>踩</el-button>
                        </el-button-group>
                        <el-button size='mini' @click='downloadBtn'>下载资源</el-button>
                        
                        <el-button size='mini' style='margin-left: 1pt' @click='editComment'>发表评论</el-button>
                        <el-button id='collection' size='mini' @click='collection' style='margin-left: 1pt' v-bind:type='collectionBind'>{{collectionButtonInfo}}</el-button>
                    </div>
                </el-col>
            </el-row>            
        </el-card>
        <el-card>
            <el-tabs tab-position="top">
                <el-tab-pane label="用户评价">
                    <el-table :data='commentList'
                        v-loading='showLoading'
                        style='width: 100%'>
                        <el-table-column
                         prop='comment'
                         label='评价'
                        >
                            <template slot-scope='scope'>
                                <div class="table-title">{{scope.row.commentTitle}}</div>
                                <div class="table-comment">{{scope.row.comment}}</div>
                                <div class="table-date">{{scope.row.userID}} 发布于 {{scope.row.commentTime}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                         prop='rate'
                         width='120'
                         label='评分'
                         :filters="[{ text: '★', value: '1' }, { text: '★★', value: '2' },{text:'★★★',value:'3'},{text:'★★★★',value:'4'},{text:'★★★★★',value:'5'}]"
                         :filter-method="filterRate"
                         :filter-multiple='false'
                         filter-placement="bottom-end"
                         header-align='center'
                         align='center'
                        >
                          <template slot-scope="scope">
                            <a v-for="item in scope.row.score" style="color:#EBB563;font-size: 12pt">★</a>
                          </template>
                        </el-table-column>
                    </el-table>
                    <div id='pageSelector' style="text-align: center;margin-top: 16pt">
                        <el-pagination :total="commentPages.total" :page-size='commentPages.size' layout="prev, pager, next" @current-change="commentPageChange"></el-pagination>
                    </div>
                    <div id='commentPublish' style="margin-top: 16pt;padding-left: 4pt;padding-right: 4pt">
                        <!--弹出填写评论对话框-->
                        <el-dialog title="发布评论" :visible.sync="commentPublish.dialogFormVisible">
                          <el-form ref="commentPublish" :model="commentPublish" style='width: 98%;margin:auto' :rules='commentPublishRules'>
                            <el-form-item>
                                <div style="display: inline-block;vertical-align: middle;margin-right: 4pt;color: #BFC2CA">为资源打分</div>
                                <el-rate style='display: inline-block;vertical-align: middle;' v-model="commentPublish.rate"></el-rate>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="commentPublish.title" placeholder="请输入评论标题" prefix-icon='el-icon-lx-edit'></el-input>
                            </el-form-item>
                            <el-form-item style='margin-top: -4pt'>
                                <el-input v-model="commentPublish.content" placeholder="请输入评论内容" type='textarea' rows='8'></el-input>
                            </el-form-item>
                          </el-form>
                          <div slot="footer" class="dialog-footer" style="margin-top: -30pt;text-align: center;">
                            <el-button type="primary" @click="onClickDialogPublish" size='small' plain style='width: 100pt'>发布评论</el-button>
                          </div>
                        </el-dialog>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="相关推荐">
                    <el-card class='listCard' shadow='hover' v-for='(item, idx) in sourceList' :key="idx" @click.native='clickCard(item)'>
                        <el-row>
                            <el-col :span='2' style="display:inline-block;max-width: 60px">
                                <i class="el-icon-upload" style="font-size: 40px;text-align: center;color:#449CFA;padding-top: 4pt"></i>
                            </el-col>
                            <el-col :span='22' style="display: inline-block;vertical-align: top;">
                                <div class="title">{{item.resourceName}}</div>       
                                <div class="context">{{item.description}}</div>
                                <div class="subtitle">{{item.uploadTime}}</div>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import Vue from 'vue';
    import axios from 'axios';
    import server from '../../../config/index';
    import { Loading } from 'element-ui';
    export default {
        name: 'download',
        data: function(){
            return {
            	resourceDetail:{
            		avgScore:'暂无评分',
            		uploaderName:'',
            		downloadTimes:'没人下载',
            		favouriteNum:'没人收藏',
            		suggestInfoNum:0	
            	},
            	
                model:{
                    radioTypeList:'',
                    selectCategoryList:'',
                    selectKeyword:''
                },
                uploaderName:'',
                typeList:[],
                categoryList:[],
                tab:'latestUpdate',
                sourceList:[],
                commentList:[ ],
                commentPublish:{
                    title:'',
                    content:'',
                    rate:0,
                    dialogFormVisible:false,
                },
                commentPublishRules:{
                    title:[{ required: true, message: '请输入评论标题', trigger: 'blur' }],
                    content:[{ required: true, message: '请输入评论内容', trigger: 'blur' }],
                    rate:[{ required: true, message: '请打分', trigger: 'blur' }],
                },
                collectionBind:'primary',
                collectionButtonInfo:'收藏资源',
                commentPages:{
                    size:0,
                    total:0,
                },
                thumb:{
                    up:'',
                    down:''
                },
                showLoading:false,
            }
        },
        watch:{
            $route(){
            	this.requestComment(1);

            }
        },
        mounted:function(){
            this.init();
        	this.requestComment(1);
            this.requestRelatedResource(1);
        },
        destroyed: function () {
            // 目前离开页面，页面即刻被销毁
        },
        methods:{
            // 监听点赞按钮
            thumbUp(){
                var that=this;
                let loadingInstance = Loading.service({
                    target:'#thumb',
                    fullscreen:false
                });
                if(this.thumb.up==''){
                    this.$axios({
                        method:'post',
                        url:server.url+'/resource/suggest/make/'+that.$route.params.resourceID,
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token')
                        }
                    }).then(function(response){
                        that.thumb.up='success'
                        that.thumb.down=''
                        that.resourceDetail.suggestInfoNum++;
                        loadingInstance.close()
                    })
                }else if(this.thumb.up=='success'){
                    this.$axios({
                        method:'delete',
                        url:server.url+'/resource/suggest/undo/'+that.$route.params.resourceID,
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token')
                        }
                    }).then(function(response){
                        that.thumb.up=''
                        that.thumb.down=''
                        that.resourceDetail.suggestInfoNum--;
                        loadingInstance.close()
                    })
                }
            },
            // 监听点踩按钮
            thumbDown(){
                var that=this;
                let loadingInstance = Loading.service({
                    target:'#thumb',
                    fullscreen:false,
                });
                if(this.thumb.down==''){
                    this.$axios({
                        method:'post',
                        url:server.url+'/resource/suggest/dislike/'+that.$route.params.resourceID,
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token')
                        }
                    }).then(function(response){
                    	if(that.thumb.up=='success'){
                    		that.resourceDetail.suggestInfoNum--;
                    	}
                        that.thumb.down='info'
                        that.thumb.up=''
                        loadingInstance.close()
                    })
                }else if(this.thumb.down=='info'){
                    this.$axios({
                        method:'delete',
                        url:server.url+'/resource/suggest/undo/'+that.$route.params.resourceID,
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token')
                        }
                    }).then(function(response){
                        that.thumb.up=''
                        that.thumb.down=''
                        loadingInstance.close()
                    })
                }
            },
            // 监听点击相关资源推荐卡片事件，处理页面跳转
            // TODO:相关资源推荐无法跳转
            clickCard(res){
                this.$route.params.resourceID=res.resourceID;
                this.$route.params.id=res.id;
                this.$route.params.uploaderID=res.uploaderID;
                this.$route.params.categoryID=res.categoryID;
                this.$route.params.resourceMajorID=res.resourceMajorID;
                this.$route.params.resourceName=res.resourceName;
                this.$route.params.description=res.description;
                this.$route.params.downloadTimes=res.downloadTimes;
                this.$route.params.uploadTime=res.uploadTime;
                this.$route.params.points=res.points; 
            },
        	// 获取评论
        	requestComment(pageID){
                var that=this;
                this.$axios({
                    method:'get',
                    url:server.url+'/resource/comments/'+that.$route.params.resourceID+'/'+pageID.toString(),
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(function(response){
                	that.commentList.splice(0,that.commentList.length);
                	that.commentPages.total=response.data.data.total;
                    that.commentPages.size=response.data.data.pageSize;
                	for(let i=0;i<response.data.data.list.length;i++){
                		that.commentList.push(response.data.data.list[i])
                	}
                })
        	},
            // 页码改变（刷新评论）
            commentPageChange(val){
                this.requestComment(val)
            },
            // 获取相关资源
            requestRelatedResource(pageID){
                var that=this;
                this.$axios({
                    method:'get',
                    url:server.url+'/resource/recommend/'+that.$route.params.resourceMajorID+'/'+that.$route.params.categoryID+'/'+pageID.toString(),
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(function(response){
                    that.sourceList.splice(0,that.sourceList.length);
                    for(let i=0;i<response.data.data.list.length;i++){
                        that.sourceList.push(response.data.data.list[i])
                    }
                })
            },
        	// 评论评分选择器
            filterRate(value, row){
                return row.score == value;
            },
            // 编辑评论按钮监听
            editComment(){
                this.commentPublish.dialogFormVisible=true;
            },
            // 点击发布评论按钮
            onClickDialogPublish(){
                this.showLoading=true;
                this.commentPublish.dialogFormVisible=false;
                var that=this;
                this.$axios({
                    method:'post',
                    url:server.url+'/resource/comment/make',
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                        'Content-Type':'application/json'
                    },
                    data:{
                      "resourceID": that.$route.params.resourceID,
                      "comment": that.commentPublish.content,
                      "score": that.commentPublish.rate,
                      "commentTitle": that.commentPublish.title
                    }
                }).then(function(response){
                	that.getResourceDetail()
                    that.showLoading=false;
                    that.requestComment(1);
                    // 显示第一页
                    that.$message({
                      message: '评论发布成功',
                      type: 'success'
                    });
                })
            },
            // 监听下载按钮
            // TODO: 下载文件类型需要做判断，目前只能下载PDF Version
            downloadBtn(){
                axios.get(server.url+'/downloadResource/'+this.$route.params.resourceID,{
                    headers:{Authorization:'Bearer '+localStorage.getItem('token')}
                },{responseType:'arraybuffer'}).then((res)=>{
                    let blob = new Blob([res.data],{type:'application/pdf'});
                    let objectUrl=URL.createObjectURL(blob);
                    window.location.href=objectUrl;
                }).catch(function(res){});
                
            },
            // 页面初始化执行的函数
            init(){
                var that=this;
                let loadingInstance = Loading.service({
                    target:'#info',
                    fullscreen:false
                });
                this.$axios({
                    method:'get',
                    url:server.url+'/resource/user/history/'+that.$route.params.resourceID,
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(function(response){
                        if(response.data.data.favourite==0){
                            that.collectionBind='primary';
                            that.collectionButtonInfo='收藏资源';
                        }else if(response.data.data.favourite==1){
                            that.collectionBind='danger';
                            that.collectionButtonInfo='取消收藏';
                        }
                        if(response.data.data.suggested==-1){
                            that.thumb.up='';
                            that.thumb.down='';
                        }else if(response.data.data.suggested==0){
                            that.thumb.up='';
                            that.thumb.down='info';
                        }else if(response.data.data.suggested==1){
                            that.thumb.up='success';
                            that.thumb.down='';
                        }
                        loadingInstance.close();
                    })
                this.getResourceDetail();
            },
            // 获取资源评分等信息
            getResourceDetail(){
            	var that=this;
            	this.$axios({
                	method:'get',
                	url:server.url+'/resource/detail/'+that.$route.params.resourceID,
                	headers:{'Authorization':'Bearer '+localStorage.getItem('token')},
                }).then(function(response){
                	if(response.data.data.commentInfo.resourceAvgScore!=null){
                		that.resourceDetail.avgScore=response.data.data.commentInfo.resourceAvgScore.toFixed(2);
                	}else{
                		that.resourceDetail.avgScore='暂无评分'
                	}
                	that.resourceDetail.uploaderName=response.data.data.uploaderInfo.uploaderName;
                	if(response.data.data.suggestInfo!=null){
                		that.resourceDetail.suggestInfoNum=response.data.data.suggestInfo.suggestedNum;
                	}else{
                		that.resourceDetail.suggestInfoNum=0
                	}
                })
            },
            // 监听收藏按钮
            collection(){
                var that=this;
                let loadingInstance = Loading.service({
                    target:'#collection',
                    fullscreen:false,
                });
                if(this.collectionBind=='danger'){
                    // 已经收藏
                    this.$axios({
                        method:'delete',
                        url:server.url+'/resource/favourite/dislike/'+that.$route.params.resourceID,
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token')
                        }
                    }).then(function(response){
                        if(response.status==200){
                            // 做出取消收藏成功的动作
                            that.collectionBind='primary';
                            that.collectionButtonInfo='收藏资源';
                            that.$message({
                              message: '取消收藏成功',
                              type: 'success'
                            });
                        }else{
                            that.$message.error('咦？取消收藏失败了，请再试一次');
                        }
                        loadingInstance.close();
                    })
                }else{
                    // 没有收藏
                    this.$axios({
                        method:'post',
                        url:server.url+'/resource/favourite/like/'+that.$route.params.resourceID,
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token')
                        }
                    }).then(function(response){
                        if(response.status==200){
                            // 做出收藏成功的动作
                            that.collectionBind='danger';
                            that.collectionButtonInfo='取消收藏';
                            that.$message({
                              message: '您已成功收藏资源',
                              type: 'success'
                            });
                        }else{
                            that.$message.error('咦？收藏失败了，请再试一次');
                        }
                        loadingInstance.close();
                    })
                }
            }
        },
        created(){

        }
    }
</script>
<style>
    
</style>
<style scoped>
    .table-title{
        font-size: 14px;
        color:#449CFA;
        font-weight: bold;
        margin-top: 8pt;
        margin-bottom: 4pt;
    }
    .table-comment{
        font-size: 14px;
        color:grey;
        margin-bottom: 8pt;
    }
    .table-date{
        color: darkgrey
    }
    .sourceTitle{
        font-size: 16pt;
        margin-bottom: 8pt;
        font-weight: bold;
    }
    .title{
        font-size: 12pt;
        margin-bottom: 4pt;
        font-weight: bold;
        display: inline-block;
    }
    .subtitle{
        margin-top: 4pt;
        font-size: 8pt;
        color:darkgrey;
    }
    .uploaderInfo{
    	margin-bottom: 4pt;
        font-size: 8pt;
        color:#449CFA;
    }
    .context{
        font-size:10pt;
        color: grey;
        line-height: 150%;
        text-align: justify
    }
    .listCard{
        margin-bottom: 12pt;
    }
    .listCard:hover{
        margin-bottom: 12pt;
        color:#489AF5
    }

    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>