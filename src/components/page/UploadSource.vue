<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-upload"></i> 上传资源</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row :gutter='20'>
            <el-col :span='18'>
                <el-card>
                    <div class="content-title">上传资源</div>
                    <el-row>
                        <div style="display: inline-block; vertical-align: top;">
                            <el-col style="margin-bottom:20pt;">
                                <el-upload
                                    :headers="uploadFunc.uploadHeaders"
                                    drag
                                    action='http://localhost:8080'
                                    style='width: 360px'
                                    :beforeUpload='beforeUpload'
                                    :on-success="uploadSuccess"
                                    >
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
                                </el-upload>
                            </el-col>
                            </div>
                            <div style="display: inline-block;">
                            <el-col :span='14' style='padding-left: 18pt;'>
                                <el-form ref="form" :model="form" :rules='formRules' label-width="80px">
                                    <el-form-item label="资源名称" prop='name'>
                                        <el-input v-model="form.name" style='width: 500px'></el-input>
                                    </el-form-item>
                                    <el-form-item label="资源类型" prop='type'>
                                        <el-select filterable v-model="form.type" placeholder="请选择资源类型">
                                            <el-option v-for='item in options.type' :key='item.value' :label='item.label' :value='item.value'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="所属分类" prop='category'>
                                        <el-select filterable v-model="form.category" placeholder="请选择所属分类">
                                            <el-option v-for='item in options.category' :key='item.value' :label='item.label' :value='item.value'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="资源分数" prop='point'>
                                        <el-select filterable v-model="form.point" placeholder="请选择资源分数">
                                            <el-option v-for='item in options.point' :key='item' :label='item' :value='item'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label='资源描述' prop='discription'>
                                        <el-input
                                          style='width: 500px'
                                          type="textarea"
                                          :rows="5"
                                          placeholder="请输入资源描述"
                                          v-model="form.description">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label='设置标签'>
                                        <el-select
                                          style='width: 500px'
                                          v-model="form.tag"
                                          multiple
                                          filterable
                                          allow-create
                                          default-first-option
                                          placeholder="请选择文章标签"
                                          no-data-text='输入标签后敲击 Enter 确认'>
                                            <el-option
                                                v-for="item in options.tag"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-checkbox v-model="form.agreement" style='margin-top: 8pt;margin-bottom: 18pt'>我已阅读并同意《一份根本不会看的协议》</el-checkbox>
                                    <el-row>
                                        <el-button type="primary" icon="el-icon-lx-roundcheck" @click="onSubmit" :disabled='!buttonLogic.submitBtn'  v-loading.fullscreen.lock="fullscreenLoading" >提交</el-button>
                                    </el-row>
                                </el-form>
                            </el-col>
                        </div>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span='6'>
                <el-card>
                    <div class="subtitle">上传须知</div>
                    <div class="content">• 如涉及侵权内容,您的资源将被移除</div>
                    <div class="content">• 请勿上传小说、mp3、图片等与技术无关的内容.一旦发现将被删除</div>
                    <div class="content">• 请勿在未经授权的情况下上传任何涉及著作权侵权的资源，除非该资源完全由您个人创作</div>
                    <div class="content">• 点击上传资源即表示您确认该资源不违反资源分享的使用条款，并且您拥有该资源的所有版权或者上传资源的授权</div>
                    <div class="content">• 您上传的资源如果因版权、使用、内容完整度 等原因被举报并通过官方审核，将扣除通过该资源获得的全部积分</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import server from '../../../config/index';
    import axios from 'axios';
    export default {
        name: 'upload',
        data: function(){
            return {
                uploadURL:server.url+'/uploadResource',
                form:{
                    name:'',
                    type:'',
                    category:'',
                    tag:[],
                    point:'',
                    description:'',
                    agreement:false,
                    fileID:''
                },
                formRules:{
                    name:[{ required: true, message: ' ', trigger: 'blur' },
                    { min: 3, message: '长度在3个字符以上', trigger: 'blur' }],
                    type:[{ required: true, message: '请选择资源类型', trigger: 'blur' }],
                    category:[{ required: true, message: '请选择所属分类', trigger: 'blur' }],
                    point:[{ required: true, message: '请选择资源分数', trigger: 'blur' }],
                },
                // 下拉框选项
                options:{
                    type:[],
                    category:[],
                    point:[1,2,3,4,5]
                },
                // 上传文件的接口
                uploadFunc:{
                    uploadURL:server.url+"/uploadResource",
                    uploadHeaders:{
                        'Authorization':localStorage.getItem('token'),
                        'Content-Type':'multipart/form-data'
                        // 这里需要更换成Authorization
                    }
                },
                buttonLogic:{
                    submitBtn:false,
                },
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                fullscreenLoading:false,
            }
        },
        components: {
            VueCropper
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
            // 提交按钮的函数
            onSubmit(){
            	var that=this;
                this.fullscreenLoading = true;
                this.$axios({
                	method:'put',
                	url:server.url+'/uploadResourceMetaData',
                	headers:{
                		'Authorization':'Bearer '+localStorage.getItem('token'),
                		'Content-Type':'application/json'
                	},
                	data:{
	                    "resourceID": this.form.fileID,
	                    "categoryID": this.form.type,
	                    "resourceMajorID": this.form.category,
	                    "resourceName": this.form.name,
	                    "description": this.form.description,
	                    "points":this.form.point,
	                    "tags":this.form.tag.join(' ')
                	}
                }).then(function(response){
                	console.log(response);
                    that.$notify({
                        title: '发布成功',
                        message: '稍后将转向首页',
                        type: 'success'
                    });
                    that.loading=false;
                    setTimeout(function(){
                        that.$router.push('/');
                    },2000)
                	that.fullscreenLoading = false;
                }).catch((res)=>{
                	console.error(res);
                	that.$notify.error({
                        title: '发布失败',
                        message: '请稍后重试'
                    });
                	that.fullscreenLoading = false;
                })
            },
            // 获取资源类型列表
            getTypeList(){
            	var that=this;
            	this.$axios({
            		method:'get',
            		url:server.url + '/resourceCategories',
            		headers:{'Authorization':'Bearer '+localStorage.getItem('token')}
            	}).then(function(response){
                    // 把获取回来的东西push进去
                    for(let i=0;i<response.data.data.length;i++){
                        that.options.type.push({value:response.data.data[i].id,label:response.data.data[i].resourceCategoryName});
                    }
                })
            },
            // 获取所属分类列表
            getCategoryList(){
            	var that=this;
            	this.$axios({
            		method:'get',
            		url:server.url + '/resourceMajors',
            		headers:{'Authorization':'Bearer '+localStorage.getItem('token')}
            	}).then(function(response){
                    // 把获取回来的东西push进去
                    for(let i=0;i<response.data.data.length;i++){
                        that.options.category.push({value:response.data.data[i].id,label:response.data.data[i].resourceMajorName});
                    }
                })
            },
            // 上传文件前判断大小（在这里可以补充上传文件的其他限制）
            beforeUpload(file){
                var limitRule1=(file.size/1024/1024)<128;
                console.error(limitRule1)
                if(!limitRule1){
                    this.$notify.error({
                        title: '错误',
                        position:'bottom-right',
                        message: '上传的文件不可超过128MB'
                    });
                    console.error("上传文件不能超过128MB");
                }else{
				    let fd = new FormData();
				    fd.append('resource',file);//传文件
				    this.$axios({
				    	method:'post',
				    	url:server.url+'/uploadResource',
				    	headers:{
				    		'Authorization':'Bearer '+localStorage.getItem('token'),
				    		'Content-Type':''
				    	},
				    	data:fd
				    }).then(function(response){
				    	console.log(response)
				    }).catch((res)=>{
				    	console.error(res)
				    })
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
                var that=this;
                this.$axios({
                	method:'get',
                	url:server.url + '/deleteResource/'+resourceID,
                	headers:{'Authorization':'Bearer '+localStorage.getItem('token')}
                }).then(function(response){
                    that.fileID='';
                })
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
    .subtitle{
        font-weight: 600;
        line-height: 30x;
        margin: 5px 0;
        font-size: 18px;
        color: #1f2f3d;
    }
    .content{
        font-weight: 400;
        line-height: 25px;
        font-size: 14px;
        color: #1f2f3d;
        overflow:scroll;
        overflow-y:hidden;
        overflow-x:hidden;
        margin-bottom: -15px
    }
</style>