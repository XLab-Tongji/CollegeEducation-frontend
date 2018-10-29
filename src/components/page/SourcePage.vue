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

                    </div>
                </el-col>
            </el-row>            
        </el-card>
        <el-card>
            <el-tabs tab-position="top">
                <el-tab-pane label="用户评价">
                    <el-table :data='commentList'
                        style='width: 100%'>
                        <el-table-column
                         prop='comment'
                         label='评价'
                        >
                            <template slot-scope='scope'>
                                <div class="table-title">{{scope.row.title}}</div>
                                <div class="table-comment">{{scope.row.comment}}</div>
                                <div class="table-date">{{scope.row.uid}} 发布于 {{scope.row.date}}</div>
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
                            <a v-for="item in 4" style="color:#EBB563;font-size: 12pt">★</a>
                          </template>
                        </el-table-column>
                    </el-table>
                    <div id='pageSelector' style="text-align: center;margin-top: 16pt">
                        <el-pagination layout="prev, pager, next" :total="1000"></el-pagination>
                    </div>
                    <div id='commentPublish' style="margin-top: 16pt;padding-left: 4pt;padding-right: 4pt">
                        <!--
                            <el-button type='primary' plain @click='editComment'>我也要写评论</el-button>
                        -->

                        <!--弹出填写评论对话框-->
                        <el-dialog title="发布评论" :visible.sync="commentPublish.dialogFormVisible">
                          <el-form ref="commentPublish" :model="commentPublish" style='width: 98%;margin:auto'>
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
                    <el-card class='listCard' shadow='hover' v-for='item in sourceList'>
                        <el-row>
                            <el-col :span='2' style="display:inline-block;max-width: 60px">
                                <i class="el-icon-upload" style="font-size: 40px;text-align: center;color:#449CFA;padding-top: 4pt"></i>
                            </el-col>
                            <el-col :span='22' style="display: inline-block;vertical-align: top;">
                                <div class="title">{{item.title}}</div>       
                                <div class="context">{{item.description}}</div>
                                <div class="subtitle">{{item.date}}</div>
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
                sourceList:[{title:'QuantumdataDP1.4产品技术资料',description:'Teledyne LeCroy quantumdata 980 48G 用于HDMI 测试的协议分析 仪/发生器模块配备了HDMI Tx 和Rx 端口，支持HDMI 2.1 固定速率链 路和FEC 捕获分析和解码，最高可达48Gbps（12Gbps /通道）。 HDMI Rx 分析端口可提供固定速率链路的打包-超级模块，字符模块和 FRL 数据包以及底层TMDS 视频，协议，控制和元数据的可视性。',date:'2018年10月21日'},
                    {title:'Office 2007 Access Database Engine',description:'如果你的c#程序采用oledb方式连接access数据库,需要安装此 engine',date:'2018年10月20日'},
                    {title:'随机过程与应用',description:'机过程与应用pdf课件，本书内容包括：概率论基础，随机过程基础，泊松过程及其推广，马尔可夫过程，二阶矩过程，平稳过程，以及高阶统计量与非平稳过程',date:'2018年10月21日'}
                    ],
                commentList:[
                    {date:'2018年10月23日',uid:'我是用户名',rate:'4',comment:'此店铺诚信问题很大，所送商品需好评才能送，之前并没有说清楚！而且相互推诿，没有诚信的此店铺诚信问题很大，所送商品需好评才能送，之前并没有说清楚！而且相互推诿，没有诚信的店铺希望大家斟酌！此店铺诚信问题很大，所送商品需好评才能送，之前并没有说清楚！而且相互推诿，没有诚信的店铺希望大家斟酌！此店铺诚信问题很大，所送商品需好评才能送，之前并没有说清楚！而且相互推诿，没有诚信的店铺希望大家斟酌！店铺希望大家斟酌！这里是一条温馨提示',title:'这是评论标题'},
                    {date:'2018年10月23日',uid:'我是用户名',rate:'4',comment:'这里是一条温馨提示',title:'这是评论标题'},
                    {date:'2018年10月23日',uid:'我是用户名',rate:'4',comment:'这里是一条温馨提示',title:'这是评论标题'}
                    ],
                commentPublish:{
                    title:'',
                    content:'',
                    dialogFormVisible:false,
                }

            }
        },
        watch:{
            
        },
        mounted:function(){
        	
        },
        methods:{
        	// 评论评分选择器
            filterRate(value, row){
                return row.rate === value;
            },
            // 编辑评论按钮监听
            editComment(){
                console.log("HHHW")
                this.commentPublish.dialogFormVisible=true;
            },
            // 点击发布评论按钮
            onClickDialogPublish(){
                this.commentPublish.dialogFormVisible=false;
                // TODO: 在这里添加网络请求
            },

            handleClick(tab,event){
                console.log(tab,event)
            },
            // 监听下载按钮
            downloadBtn(){
            	this.$http.get(server.url+'/downloadResource/'+this.$route.params.resourceID,{}).then(function(response){
            		this.$message({
            			message:'下载即将开始',
            			type:'success',
            			showClose:true
            		})
            	})
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