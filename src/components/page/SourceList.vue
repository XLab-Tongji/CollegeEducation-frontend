<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-upload"></i> 下载资源</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card style='margin-bottom: 14pt;'>
            <el-form label-position='left' label-width='80px'>
                <el-form-item label="资源类型">
                    <el-radio-group v-model="model.radioTypeList" size="medium" @change='radioTypeChange'>
                      <el-radio-button border v-for='(type, idx) in typeList' :key="idx" :label="type.label" ></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="资源分类">
                    <el-select v-model="model.selectCategoryList" size="medium" filterable placeholder="可以滑选或搜索" @change='selectCategoryChanged'>
                        <el-option
                            v-for="category in categoryList"
                            :key='category.value'
                            :label='category.label'
                            :value='category.value'>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键字">
                    <el-select
                        size="medium"
                        v-model='model.selectKeyword'
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder='请输入要检索的关键字'
                        no-data-text='请输入要检索的关键字'
                        @change='selectKeywordChange'>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-loading="showLoading" element-loading-text="稍等一下下喏">
            <el-tabs v-model="tab" @tab-click="swichTab">
                <el-tab-pane label="最新上传" name="latestUpdate">
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
                <el-tab-pane label="最多下载" name="mostDownload">
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
                <el-pagination
                  layout="prev, pager, next"
                  :total="page.pageNum"
                  :page-size="page.pageSize"
                  :current-page='model.currentPage'
                  @current-change='currentPageChange'>
                </el-pagination>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import server from '../../../config/index';
    import axios from 'axios';
    export default {
        name: 'download',
        data: function(){
            return {
                model:{
                    radioTypeList:'',
                    radioTypeValue:0,
                    selectCategoryList:0,
                    selectKeyword:[],
                    currentPage:1
                },
                typeList:[],
                categoryList:[],
                tab:'latestUpdate',
                sourceList:[],
                page:{
                    pageSize:0,
                    pageNum:0
                },
                showLoading:false
            }
        },
        watch:{

        },
        mounted:function(){
            this.initialization()
        },
        methods:{
            /**
             * 初始页面相关methods
             **/

            // 页面初始化
            initialization(){
                this.getCategoryList();
                this.getTypeList();    

                //setTimeout(3000,this.getResourceList(this.iniCategory,this.iniType,1,''))
                this.getResourceList(this.model.selectCategoryList,this.model.radioTypeValue,this.model.currentPage-1,'',this.tab)

                //this.getResourceList(this.categoryList[0].value,this.typeList[0].value,1,'');
            },

            // 获取资源类型列表
            getTypeList(){
                var that=this;
                this.$axios({
                    method:'get',
                    url:server.url + '/resourceCategories',
                    headers:{"Authorization":"Bearer "+localStorage.getItem("token")}
                }).then(function(response){
                    // 把获取回来的东西push进去
                    that.typeList.push({value:0,label:'全部类型'})
                    for(let i=0;i<response.data.data.length;i++){
                        that.typeList.push({value:response.data.data[i].id,label:response.data.data[i].resourceCategoryName});
                    }
                    //this.model.radioTypeValue=this.typeList[0].value
                });
            },
            // 获取所属分类列表
            getCategoryList(){
                var that=this;
                this.$axios({
                    method:'get',
                    url:server.url + '/resourceMajors',
                    headers:{"Authorization":"Bearer "+localStorage.getItem('token')}
                }).then(function(response){
                    // 把获取回来的东西push进去
                    that.categoryList.push({value:0,label:'全部分类'})
                    for(let i=0;i<response.data.data.length;i++){
                        that.categoryList.push({value:response.data.data[i].id,label:response.data.data[i].resourceMajorName});
                    }
                    //this.model.selectCategoryList=this.categoryList[0].value;
                });
            },


            /**
             * 监听事件相关methods
             **/

            // 监听换页事件
            currentPageChange(res){
                console.log(res,'page')
                this.model.currentPage=res;
                var kw=this.model.selectKeyword.join(' ');
                this.getResourceList(this.model.selectCategoryList,this.model.radioTypeValue,res-1,kw,this.tab)
            },
            // 监听单选框事件
            radioTypeChange(res){
                for(let i=0;i<this.typeList.length;i++){
                    if(this.typeList[i].label==res){
                        this.model.radioTypeValue=this.typeList[i].value;
                        break;
                    }
                }
                var kw=this.model.selectKeyword.join(' ');
                this.model.currentPage=1;
                this.getResourceList(this.model.selectCategoryList,this.model.radioTypeValue,this.model.currentPage-1,kw,this.tab)
                
            },
            // 监听下拉菜单事件
            selectCategoryChanged(res){
                var kw=this.model.selectKeyword.join(' ');
                this.model.currentPage=1;
                this.getResourceList(this.model.selectCategoryList,this.model.radioTypeValue,this.model.currentPage-1,kw,this.tab)
            },
            // 监听关键字变化事件
            selectKeywordChange(res){
                var kw=this.model.selectKeyword.join(' ');
                this.model.currentPage=1;
                console.error('切换关键字',this.model.currentPage-1)
                this.getResourceList(this.model.selectCategoryList,this.model.radioTypeValue,this.model.currentPage-1,kw,this.tab)
            },
            // 监听切换tab事件
            swichTab(tab,event){
                console.log(this.tab)
                var kw=this.model.selectKeyword.join(' ');
                this.model.currentPage=1;
                this.getResourceList(this.model.selectCategoryList,this.model.radioTypeValue,this.model.currentPage-1,kw,this.tab)
            },
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


            // 获取资源列表
            getResourceList(resourceMajorID,categoryID,pageID,keyword,tab){
                console.log(resourceMajorID,categoryID,pageID,keyword,tab)
                this.showLoading=true;
                var that=this;
                if(tab=='latestUpdate'){
                    var requestURL=server.url+'/searchResource/time/'+resourceMajorID+'/'+categoryID+'/'+pageID+'?keyword='+keyword;
                    this.$axios({
                        method:'get',
                        url:requestURL,
                        headers:{'Authorization':'Bearer '+localStorage.getItem('token')},
                    }).then(function(response){
                        that.showLoading=false;
                        console.log(requestURL)
                        console.log(response)
                        that.sourceList.splice(0,that.sourceList.length)
                        console.error(response.data.data.content)
                        for(let i=0;i<response.data.data.content.length;i++){
                            that.sourceList.push(response.data.data.content[i]);
                        }
                        that.page.pageNum=response.data.data.totalElements;
                        that.page.pageSize=response.data.data.size;
                    }).catch((res)=>{
                        console.error('按时间查询：',res)
                        that.showLoading=false;
                    })
                }else{
                    var requestURL=server.url+'/searchResource/score/'+resourceMajorID+'/'+categoryID+'/'+pageID+'?keyword='+keyword;
                    this.$axios({
                        method:'get',
                        url:requestURL,
                        headers:{'Authorization':'Bearer '+localStorage.getItem('token')},
                    }).then(function(response){
                        that.showLoading=false;
                        that.sourceList.splice(0,that.sourceList.length)
                        for(let i=0;i<response.data.data.list.length;i++){
                            that.sourceList.push(response.data.data.list[i]);
                        }
                        that.page.pageNum=response.data.data.total;
                        that.page.pageSize=response.data.data.pageSize;
                    }).catch((res)=>{
                        console.error('按分数查询：',res)
                        that.showLoading=false;
                    })
                }

            }
        },
        created(){

        }
    }
</script>

<style scoped>
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