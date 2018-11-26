<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-upload"></i> 资源详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card style='margin-bottom: 8pt'>
            <el-row>
                <el-col :span='2' style='display: inline-block; max-width: 84pt'>
                    <i class="el-icon-upload" style="font-size: 60pt;text-align: center;color:#449CFA;padding-top: 4pt;padding-left: 8pt;padding-right: 16pt"></i>
                </el-col>
                <el-col :span='22' style="display: inline-block;vertical-align: top;">
                    <div style="margin-bottom: 4pt">
                        <div class="sourceTitle" style="display: inline-block;">{{this.$route.params.resourceName}}</div>
                        <div style="display: inline-block;vertical-align: top;padding-top: 2pt;margin-left: 4pt">
                            <el-tag>标签1</el-tag>
                            <el-tag>标签2</el-tag>
                        </div>
                    </div>
                    <div class="context">{{this.$route.params.description}}</div>
                    <div style="margin-top: 12pt">
                        <el-button size='mini' icon='el-icon-lx-group'>分享</el-button>
                        <el-button-group style="display: inline-block;">
                          <el-button size='mini'>赞</el-button>
                          <el-button size='mini'>踩</el-button>
                        </el-button-group>
                        <el-button size='mini' @click='downloadBtn'>下载 (12.1Mb)</el-button>
                        
                        <el-button size='mini' style='margin-left: 1pt' @click='editComment'>发表评论</el-button>
                        <el-button size='mini' @click='collection' style='margin-left: 1pt' v-bind:type='collectionBind'>{{collectionButtonInfo}}</el-button>

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
                        <!--
                            <el-button type='primary' plain @click='editComment'>我也要写评论</el-button>
                        -->

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


            <el-row>
                
 
            </el-row>
        </el-card>

    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import Vue from 'vue';
    import axios from 'axios';
    import server from '../../../config/index';
    export default {
        name: 'download',
        data: function(){
            return {
                model:{
                    radioTypeList:'',
                    selectCategoryList:'',
                    selectKeyword:''
                },
                typeList:[],
                categoryList:[],
                tag:'latestUpdate',
                sourceList:[],
                commentList:[ ],
                commentPublish:{
                    title:'',
                    content:'',
                    rate:'',
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
                showLoading:false,
            }
        },
        watch:{
            $route(){
            	this.requestComment(1);

            }
        },
        mounted:function(){
        	this.requestComment(1);
            this.requestRelatedResource(1);
        },
        destroyed: function () {
            // 目前离开页面，页面即刻被销毁
        },
        methods:{
            // 监听点击相关资源推荐卡片事件，处理页面跳转
            // TODO:相关资源推荐无法跳转
            clickCard(res){
                this.$route.params.resourceID=res.resourceID;
                this.$route.params.uploaderID=res.uploaderID;
                this.$route.params.categoryID=res.categoryID;
                this.$route.params.resourceMajorID=res.resourceMajorID;
                this.$route.params.resourceName=res.resourceName;
                this.$route.params.description=res.description;
                this.$route.params.downloadTimes=res.downloadTimes;
                this.$route.params.uploadTime=res.uploadTime;
            },
        	// 获取评论
        	requestComment(pageID){
                this.$http.get(server.url+'/resource/comments/'+this.$route.params.resourceID+'/'+pageID.toString(),{}).then(function(response){
                	this.commentList.splice(0,this.commentList.length);
                	this.commentPages.total=response.data.data.total;
                    this.commentPages.size=response.data.data.pageSize;
                	for(let i=0;i<response.data.data.list.length;i++){
                		this.commentList.push(response.data.data.list[i])
                	}
                })
        	},
            // 页码改变（刷新评论）
            commentPageChange(val){
                this.requestComment(val)
            },
            // 获取相关资源
            requestRelatedResource(pageID){
                this.$http.get(server.url+'/resource/recommend/'+this.$route.params.resourceMajorID+'/'+this.$route.params.categoryID+'/'+pageID.toString(),{}).then(function(response){
                    this.sourceList.splice(0,this.sourceList.length);
                    for(let i=0;i<response.data.data.list.length;i++){
                        this.sourceList.push(response.data.data.list[i])
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
                this.$http.post(server.url+'/resource/comment/make',{
                      "resourceID": this.$route.params.resourceID,
                      "comment": this.commentPublish.content,
                      "score": this.commentPublish.rate,
                      "commentTitle": this.commentPublish.title
                }).then(function(response){
                    this.showLoading=false;
                    this.requestComment(1);
                    // 显示第一页
                    this.$message({
                      message: '评论发布成功',
                      type: 'success'
                    });
                })
            },
            // 监听下载按钮
            // TODO: 下载文件类型需要做判断，目前只能下载PDF Version
            downloadBtn(){
                console.error('Bearer '+localStorage.getItem('token'))
                axios.get(server.url+'/downloadResource/'+this.$route.params.resourceID,{
                    headers:{Authorization:'Bearer '+localStorage.getItem('token')}
                },{responseType:'arraybuffer'}).then((res)=>{
                    let blob = new Blob([res.data],{type:'application/pdf'});
                    let objectUrl=URL.createObjectURL(blob);
                    window.location.href=objectUrl;
                }).catch(function(res){});
                
            },
            // 监听收藏按钮
            collection(){
                if(this.collectionBind=='danger'){
                    // 已经收藏
                    this.$http.delete(server.url+'/resource/favourite/dislike/'+this.$route.params.resourceID,{}).then(function(response){
                        if(response.status==200){
                            // 做出取消收藏成功的动作
                            this.collectionBind='primary';
                            this.collectionButtonInfo='收藏资源';
                            this.$message({
                              message: '取消收藏成功',
                              type: 'success'
                            });
                        }else{
                            this.$message.error('咦？取消收藏失败了，请再试一次');
                        }
                    })
                }else{
                    // 没有收藏
                    this.$http.post(server.url+'/resource/favourite/like/'+this.$route.params.resourceID,{}).then(function(response){
                        if(response.status==200){
                            // 做出收藏成功的动作
                            this.collectionBind='danger';
                            this.collectionButtonInfo='取消收藏';
                            this.$message({
                              message: '您已成功收藏资源',
                              type: 'success'
                            });
                        }else{
                            this.$message.error('咦？收藏失败了，请再试一次');
                        }
                    })
                }
            }

        },
        created(){
            this.cropImg = this.defaultSrc;
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