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
                                    :on-success="uploadSuccess"
                                    class="upload-demo"
                                    drag
                                    action='http://yapi.demo.qunar.com/mock/20940/uploadResource'
                                    style='width: 360px'
                                    :beforeUpload='beforeUpload'
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
                                        <el-button type="primary" icon="el-icon-lx-roundcheck" @click="onSubmit">提交</el-button>
                                    </el-row>
                                </el-form>
                            </el-col>
                        </div>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span='6'>
                <el-card></el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import server from '../../../config/index';
    export default {
        name: 'upload',
        data: function(){
            return {
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
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
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
                        Authorization:'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJxaWJhdHUiLCJleHAiOjE1Mzk4NTEyMzksImlhdCI6MTUzOTI0NjQzOX0.L0i_uqSjfXvcgNIyP_zKWde8FZ9nQT0xQB2pbslPuMIGDYTptthB4f4sqJLZP2bramTtWPdO1mELRy1zA_Yicw'
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
            // 获取资源类型列表
            getTypeList(){
                this.$http.get(server.url + '/registerCategories',{}).then(function(response){
                    // 把获取回来的东西push进去
                    for(let i=0;i<response.data.data.length;i++){
                        this.options.type.push({value:response.data.data[i].id,label:response.data.data[i].resourceCategoryName});
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
                        this.options.category.push({value:response.data.data[i].id,label:response.data.data[i].resourceMajorName});
                    }
                },function(response){  
                    console.error("初始化获取所属分类列表错误")
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