<template>
    <div class="login-wrap" v-loading='loading'>
        <div class="ms-login">
            <div class="ms-title">用户注册</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="ms-content" status-icon='true'>
                <el-row :gutter="20">
                    <el-col :span='12'>
                    <el-form-item prop="imgUrl">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-model="ruleForm.imgUrl" v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i><div class="ms-setImg">上传头像</div></i>
                    </el-upload>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item></el-form-item>
                        <el-form-item prop="gender">
                            <el-select v-model="ruleForm.gender" placeholder="请选择你的性别" style='width: 100%'>
                                <el-option
                                    v-for="item in genderOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span='12'>
                    <el-form-item prop="uName">
                        <el-input v-model="ruleForm.uName" placeholder="请输入姓名" >
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item prop="birthday">
                            <el-date-picker
                                v-model="ruleForm.birthday"
                                type="month"
                                placeholder="请选择出生年月" style='width: 100%'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span='12'>
                    <el-form-item prop="sID">
                        <el-input v-model="ruleForm.sID" placeholder="请输入学号/工号">
                            <el-button slot="prepend" icon="el-icon-edit"></el-button>
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item prop="university">
                            <el-select v-model="ruleForm.university" placeholder="请选择所在学校" style='width: 100%'>
                                <el-option
                                    v-for="item in universityOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span='12'>
                    <el-form-item prop="email">
                        <el-input v-model="ruleForm.email" placeholder="请输入电子邮箱">
                            <el-button slot="prepend" icon="el-icon-lx-mail"></el-button>
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item prop="school">
                            <el-select v-model="ruleForm.school" placeholder="请选择所在院系" style='width: 100%' no-data-text='请首先选择所在学校'>
                                <el-option
                                    v-for="item in schoolOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span='12'>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"> 
                            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item prop="auth">
                            <el-select v-model="ruleForm.auth" placeholder="请选择注册身份" style='width: 100%'>
                                <el-option
                                    v-for="item in authOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span='12'>
                    <el-form-item prop="repassword">
                        <el-input type="password" placeholder="请确认密码" v-model="ruleForm.repassword"> 
                            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item prop="startYear">
                            <el-date-picker
                                v-model="ruleForm.startYear"
                                type="year"
                                placeholder="请选择入学年份" style='width: 100%'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row class="el-row--flex" justify="end"><p class="login-tips">Tips : 如不上传头像，系统将使用默认头像，其他信息不能为空。</p></el-row>

                <div class="login-btn"><el-button type="primary" @click="register()">注册</el-button></div>
                <el-row class="el-row--flex" justify="center"><el-button type="text" @click="toLogin()">已有账号？点击登录</el-button></el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import server from '../../../config/index';
    export default {
        data: function(){
            // 验证密码合法性
            var passwordValidity = (rule, value, callback) =>{
                // Evan: 这里设定密码的规则，value值是输入框中的值
                // 密码必须含有大写字母、小写字母和数字，长度为6-18位
                var myReg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,18}$/;
                if(!value){
                    return callback(new Error('请输入密码'));
                }else if(!myReg.test(value)){
                    return callback(new Error('包含大写字母和数字，且不小于6位'));
                }else{
                    return callback();
                }
            };
            // 验证再次输入密码是否与原值相同
            var repasswordValidity = (rule, value, callback) =>{
                var myReg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,18}$/;
                if(!value){
                    return callback(new Error('请再次输入密码以确认'));
                }
                if(value != this.ruleForm.password){
                    return callback(new Error('两次输入的密码不一致'));
                }else if(!myReg.test(value)){
                    return callback(new Error('包含大写字母和数字，且不小于6位'));
                }else{
                    callback();
                }
            };
            // 验证邮箱输入的合法性
            var emailValidity = (rule, value, callback) =>{
                var atPos=value.indexOf('@');
                var dotPos=value.indexOf('.');
                var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
                if(!value){
                    return callback(new Error('请输入电子邮箱'));
                }else if(!myReg.test(value)){
                    return callback(new Error('邮箱格式错误'));
                }else{
                    return callback();
                }
            }
            return {
                genderOptions:[
                    {value:'M', label:'男'},
                    {value:'F', label:'女'}
                ],
                authOptions:[{
                                value:'1',// Evan: 这里请填入接口中定义的学生和老师对应编号
                                label:'学生'
                             },{
                                value:'2',
                                label:'教师'
                             }],
                universityOptions:[],
                schoolOptions:[],
                ruleForm: {
                    uName: '',
                    gender:'',
                    sID:'',
                    email:'',
                    password: '',
                    repassword:'',
                    birthday:'',
                    university:'',
                    school:'',
                    auth:'',
                    startYear:'',
                    imgUrl:''
                },
                rules: {
                    uName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    sID:[
                        { required: true, message: '请正确输入学号', trigger:'blur'}
                    ],
                    password:[
                        { required: true, validator: passwordValidity, trigger: 'blur' }
                    ],
                    repassword:[
                        { required: true, validator: repasswordValidity, trigger: 'blur' }
                    ],
                    email:[
                        { required: true, validator: emailValidity, trigger: 'blur' }
                    ],
                    birthday:[
                        { required: true, message: '请选择出生年月', trigger: 'blur' }
                    ],
                    startYear:[
                        { required: true, message: '请选择入学年份', trigger: 'blur' }
                    ],
                },
                loading:false,
                validity:{
                    uName:false,
                    gender:false,
                    sID:false,
                    email:false,
                    password:false,
                    birthday:false,
                    university:false,
                    school:false,
                    auth:false,
                    startYear:false,
                    imgUrl:false
                }
            }
        },
        mounted:function(){
            this.getUniversityList();
        },
        watch:{
            'ruleForm.university':function(val){
                // 请在这里写获取学院列表的请求，val中的参数是用户选择的学校，即university的value
                // 之后将拿到的数据push进schoolOptions中，如下
                this.schoolOptions.push({value:'1',label:'软件学院'});
                this.schoolOptions.push({value:'2',label:'电信学院'});
            },
        },
        methods: {
            toLogin(){
                console.log("toLogin")
                // 如果没有下面这一行，页面跳转不过去。submitForm()函数跳转至/dashboard页面确实要先检查ms_username，但是/register下我没有找到任何跟localStorage有关的逻辑。希望你们能解决这个神奇的问题 ：） By徐啊歪-2018-09-25
                // localStorage.setItem('ms_username',this.ruleForm.username);
                this.$router.push('/login');
            },
            getUniversityList(){
                // Evan:请在这里加入获取大学列表的接口信息
                // 之后把get得到的大学列表push进universityOptions中，如下
                this.universityOptions.push({value:'1',label:'同济大学'});
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isPNG && isLt2M;
            },
            register() {
                this.loading=true;

                // To Be Done:判断表单提交前的所有字段合法性

                if(this.ruleForm.birthday==''||this.ruleForm.startYear==''||this.ruleForm.birthday==null||this.ruleForm.startYear==null){
                    this.$notify.error({
                    title: '注册失败',
                    message: '所有信息均为必填'
                    });
                    this.loading=false;
                }
               
                this.$http.post(server.url + '/register', {
                    // Evan:这段的接口全部都是我YY的，需要和后端确定
                    uName:this.ruleForm.uName,
                    gender:this.ruleForm.gender,
                    sID:this.ruleForm.sID,
                    email:this.ruleForm.email,
                    password:this.ruleForm.password,
                    birthdayYear:this.ruleForm.birthday.getFullYear(),
                    birthdayMonth:this.ruleForm.birthday.getMonth()+1,
                    university:this.ruleForm.university,
                    school:this.ruleForm.school,
                    auth:this.ruleForm.auth,
                    startYear:this.ruleForm.startYear.getFullYear(),
                    imgUrl:this.ruleForm.imgUrl
                }).then(response => {

                    this.$notify({
                    title: '注册成功',
                    message: '稍后将转向登录页',
                    type: 'success'
                    });
                    this.loading=false;
            
                   }, response => {
                     console.log("error");
                     console.log(response);
                     this.$notify.error({
                     title: '注册失败',
                     message: '请稍后重试'
                     });
                     this.loading=false;
                });
            }
        }
    }
</script>

<!--为了重写error提示，style标签去掉了scoped-->
<style>
    .ms-content .el-form-item__content{
        margin-bottom: 5px;
    }
    
    .ms-content .el-form-item__error{
        top: 110% !important;
        font-weight: bold;
    }

    .ms-content #ms-left .el-form-item__error{
        margin-left: 50px;
    }

    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #888;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:600px;
        margin:-300px 0 0 -300px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.5);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .ms-left{
        display:inline-block;
        width:46%;
    }
    .ms-right{
        display:inline-block;
        width:46%;
        vertical-align:top;
        float:right;
        padding: 30px 0px;
    }
    .login-btn{
        text-align: center;
        width: 30%;
        margin:auto;
        margin-top: 16px;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#0066ff;
    }

    .ms-setImg{
        font-size: 12px;
        text-align: center;
        margin-top: 15px;
        color:#888;
    }

    .avatar-uploader .el-upload {
        width: 60px;
        height: 60px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        width: 60px;
        height: 60px;
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 60px;
        height: 60px;
        text-align: center;
    }
    .avatar {
        width: 60px;
        height: 60px;
        display: block;
    }
</style>
