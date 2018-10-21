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
                    <el-radio-group v-model="model.radioTypeList" size="medium">
                      <el-radio-button border v-for="type in typeList" :label="type.label" ></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="资源分类">
                    <el-select v-model="model.selectCategoryList" size="medium" filterable placeholder="可以滑选或搜索">
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
                        placeholder='请输入要检索的关键字'
                        no-data-text='请输入要检索的关键字'>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-tabs v-model="tag" @tab-click="handleClick">
                <el-tab-pane label="最新上传" name="latestUpdate">
                    <el-card class='listCard' shadow='hover' v-for='item in sourceList'>
                        <el-row>
                            <el-col span='2' style="display:inline-block;max-width: 60px">
                                <i class="el-icon-upload" style="font-size: 40px;text-align: center;color:#449CFA;padding-top: 4pt"></i>
                            </el-col>
                            <el-col span='22' style="display: inline-block;vertical-align: top;">
                                <div class="title">{{item.title}}</div>       
                                <div class="context">{{item.description}}</div>
                                <div class="subtitle">{{item.date}}</div>
                            </el-col>
                        </el-row>
                    </el-card>
                    
                </el-tab-pane>
                <el-tab-pane label="最多下载" name="mostDownload">

                </el-tab-pane>
            </el-tabs>
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
                    ]

            }
        },
        watch:{
            'form.agreement':function(val){
                this.buttonLogic.submitBtn=val;
            }
        },
        mounted:function(){
            this.getCategoryList();
            this.getTypeList();
        },
        methods:{
            // 获取资源类型列表
            getTypeList(){
                this.$http.get(server.url + '/registerCategories',{}).then(function(response){
                    // 把获取回来的东西push进去
                    for(let i=0;i<response.data.data.length;i++){
                        this.typeList.push({value:response.data.data[i].id,label:response.data.data[i].resourceCategoryName});
                    }
                },function(response){  
                    console.error("初始化获取资源类型列表错误")
                });
            },
            // 获取所属分类列表
            getCategoryList(){
                this.$http.get(server.url + '/resourceMajors',{}).then(function(response){
                    // 把获取回来的东西push进去
                    for(let i=0;i<response.data.data.length;i++){
                        this.categoryList.push({value:response.data.data[i].id,label:response.data.data[i].resourceMajorName});
                    }
                },function(response){  
                    console.error("初始化获取所属分类列表错误")
                });
            },
            handleClick(tab,event){
                console.log(tab,event)
            },











            // 提交按钮的函数
            onSubmit(){
                this.$http.post(server.url + '/registerCategories',{
                    "resourceID": this.form.fileID,
                    "categoryID": this.form.type,
                    "resourceMajorID": this.form.category,
                    "resourceName": this.form.name,
                    "description": this.form.description,
                    "point":this.form.point,
                    "tag":this.form.tag
                }).then(function(response){
                    
                },function(response){  
                    console.error("初始化获取资源类型列表错误")
                });
            },

            // 上传文件前判断大小（在这里可以补充上传文件的其他限制）
            beforeUpload(file){
                var limitRule1=(file.size/1024/1024)<128;
                if(!limitRule1){
                    this.$notify.error({
                        title: '错误',
                        position:'bottom-right',
                        message: '上传的文件不可超过128MB'
                    });
                    console.error("上传文件不能超过128MB");
                }
                return limitRule1;
            },
            // 成功完成上传的返回
            uploadSuccess(response, file, fileList){
                console.log(response.data.data);
                this.form.fileID=response.data.data;
            },
            // 点击删除后从服务器删除文件
            uploadRemove(file, fileList){
                var resourceID=this.fileID;
                this.$http.get(server.url + '/deleteResource/'+resourceID,{}).then(function(response){
                    this.fileID='';
                },function(response){  
                    console.error("初始化获取资源类型列表错误")
                });
            },
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
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