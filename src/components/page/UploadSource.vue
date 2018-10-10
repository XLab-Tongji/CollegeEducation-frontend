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
                        <el-col :span='8'>
                            <el-upload
                                class="upload-demo"
                                drag
                                action="/api/posts/"
                                style='width: 360px'
                                >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-col>
                        <el-col :offset='2' :span='14'>
                            <el-form ref="form" :model="form" :rules='formRules' label-width="80px">
                                <el-form-item label="资源名称" prop='name'>
                                    <el-input v-model="form.name"></el-input>
                                </el-form-item>
                                <el-form-item label="资源类型" prop='type'>
                                    <el-select v-model="form.type" placeholder="请选择资源类型">
                                        <el-option v-for='item in options.type' :key='item.value' :label='item.label' :value='item.value'></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="所属分类" prop='category'>
                                    <el-select v-model="form.category" placeholder="请选择所属分类">
                                        <el-option v-for='item in options.category' :key='item.value' :label='item.label' :value='item.value'></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="资源分数" prop='point'>
                                    <el-select v-model="form.point" placeholder="请选择资源分数">
                                        <el-option v-for='item in options.point' :key='item' :label='item' :value='item'></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <el-row style='margin-top: 18pt'>
                        <el-input
                          type="textarea"
                          :rows="10"
                          placeholder="请输入资源描述"
                          v-model="textarea">
                        </el-input>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span='6'>
                <el-card></el-card>
            </el-col>
        </el-row>



<!--
        <div class="container">
            <div class="content-title">支持拖拽</div>
            
            <el-upload
                class="upload-demo"
                drag
                action="/api/posts/"
                >
                <i class="el-icon-lx-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <div class="content-title">支持裁剪</div>
            <div class="plugins-tips">
                vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
                访问地址：<a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>
            </div>
            <div class="crop-demo">
                <img :src="cropImg" class="pre-img">
                <div class="crop-demo-btn">选择图片
                    <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                </div>
            </div>
        
            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
-->


    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
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
                    agreement:false
                },
                formRules:{
                    name:[{ required: true, message: '请输入资源名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
                    type:[{ required: true, message: '请选择资源类型', trigger: 'blur' }],
                    category:[{ required: true, message: '请选择所属分类', trigger: 'blur' }],
                    point:[{ required: true, message: '请选择资源分数', trigger: 'blur' }],
                },
                // 下拉框选项
                options:{
                    type:[{value:0,label:'文件'},{value:1,label:'代码'}],
                    category:[{value:0,label:'文件'},{value:1,label:'代码'}],
                    point:[1,2,3,4,5]
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
        methods:{
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