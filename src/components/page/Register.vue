<template>
    <div class="login-wrap" v-loading='loading'>
        <div class="avatar">
            <croppa v-model="myCroppa"
                placeholder="点击这里上传头像"
                placeholder-color="#000"
                :placeholder-font-size="12"
                canvas-color="transparent"
                :show-loading="true"
                :prevent-white-space="true"
                accept="image/png"
                :file-size-limit="81920"
                @file-type-mismatch="onFileTypeMismatch"
                @file-size-exceed="onFileSizeExceed"
                @new-image-drawn="onFileLoaded"
                :width="180"
                :height="180"
                style='margin-top: 10px;'
            ></croppa>
            <div style="font-size:10pt;line-height: 120%;margin-top: 8pt;">头像不超过80kb</div>
            <div style="font-size:10pt;line-height: 120%;margin-bottom: 10px;">拖动或滑动鼠标滑轮裁剪</div>
        </div>
        <div class="ms-login">
            <div class="ms-title">用户注册</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="ms-content" :status-icon='true'>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item prop="uName">
                            <el-input v-model="ruleForm.uName" placeholder="请输入姓名" >
                                <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"> 
                                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="repassword">
                            <el-input type="password" placeholder="请确认密码" v-model="ruleForm.repassword"> 
                                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="sID">
                            <el-input v-model="ruleForm.sID" placeholder="请输入学号/工号">
                                <el-button slot="prepend" icon="el-icon-edit"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="email">
                            <el-input v-model="ruleForm.email" placeholder="请输入电子邮箱">
                                <el-button slot="prepend" icon="el-icon-lx-mail"></el-button>
                            </el-input>
                        </el-form-item>
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
                    <el-col :span='12'>
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
                        <el-form-item prop="birthday">
                            <el-date-picker
                                v-model="ruleForm.birthday"
                                type="month"
                                placeholder="请选择出生年月" style='width: 100%'>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="startYear">
                            <el-date-picker
                                v-model="ruleForm.startYear"
                                type="year"
                                placeholder="请选择入学年份" style='width: 100%'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="login-btn"><el-button type="primary" @click="register()">注册</el-button></div>
                <el-row class="el-row--flex" justify="center"><el-button type="text" @click="toLogin()" >已有账号？点击登录</el-button></el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import 'vue-croppa/dist/vue-croppa.css'
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
                    {value:'male', label:'男'},
                    {value:'female', label:'女'}
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
                myCroppa: {},
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
                var that=this;
                this.$axios({
                        method:'get',
                        url:server.url + '/register/university/' + val,
                        data:{},
                        header:{}  
                    }).then(function(response){
                        var majorIn = response.data.data;
                        for(let i=0;i<majorIn.length;i++){
                            var majorDetail=majorIn[i]
                            that.schoolOptions.push({value:majorDetail.id,label:majorDetail.majorName})
                        }
                })
            }
        },
        methods: {
            // 上传头像
            uploadCroppedImage(token) {
                var that=this;
                this.myCroppa.generateBlob((blob) => {
                    var fd = new FormData()
                    fd.append('icon', blob)
                    that.$axios({
                        method:'put',
                        url:server.url + '/user/uploadIcon',
                        data:fd,
                        headers:{
                            'Authorization':'Bearer '+token,
                            'Content-Type':'multipart/form-data'
                        }  
                    }).then(function(res){
                        console.log(res)
                    })
               }, 'image/jpeg', 0.8) // 80% compressed jpeg file
             },
            // 控制头像大小和格式
            onFileTypeMismatch (file) {
               this.$message.error('头像仅支持JPG/JPEG/PNG/TIF/TIFF/ICON格式');
            },
            onFileSizeExceed (file) {
               this.$message.error('头像不要超过80kb哦，请重试！');
            },
            // 监听完成上传
            onFileLoaded(){
                
            },
            toLogin(){
                console.log("toLogin");
                this.$router.push('/login');
            },
            getUniversityList(){
                var that=this;
                this.$axios({
                        method:'get',
                        url:server.url + '/register/university/',
                        data:{},
                        header:{}  
                    }).then(function(response){
                        var universityList = response.data.data;
                        for(let i=0;i<universityList.length;i++){
                            var universityDetail=universityList[i]
                            that.universityOptions.push({value:universityDetail.universityID,label:universityDetail.universityName})
                        }
                })
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
                var that=this;
                this.$axios({
                        method:'post',
                        url:server.url + '/register',
                        data:{
                            username:that.ruleForm.uName,
                            password:that.ruleForm.password,
                            email:that.ruleForm.email,
                            gender:that.ruleForm.gender,
                            universityID:that.ruleForm.university,
                            majorID:that.ruleForm.school,
                            birthday:that.ruleForm.birthday.getFullYear()+'-'+(that.ruleForm.birthday.getMonth()+1)+'-01',
                            studentID:that.ruleForm.sID,
                            auth:that.ruleForm.auth,
                            admissionYear:that.ruleForm.startYear.getFullYear(),
                        },
                        headers:{}  
                    }).then(function(response){
                        console.log(response)
                        that.$axios({
                            method:'post',
                            url:server.url + '/auth',
                            data:{username:that.ruleForm.uName,password:that.ruleForm.password},
                            headers:{}
                        }).then(function(response){
                            console.log(response)
                            localStorage.setItem('token',response.data.token);
                            localStorage.setItem('ms_username',that.ruleForm.uName);
                            that.uploadCroppedImage(response.data.token)
                            that.$notify({
                                title: '注册成功',
                                message: '稍后将转向首页',
                                type: 'success'
                            });
                            that.loading=false;
                            setTimeout(function(){
                                that.$router.push('/');
                            },2000)
                        })
                }).catch((response) =>{
                    that.$notify.error({
                        title: '注册失败',
                        message: '请稍后重试'
                    });
                    that.loading=false;
                })
            }
        }
    }
</script>

<!--为了重写error提示，style标签去掉了scoped-->
<style>

    .croppa-container {
        background-color: #F6F5FB;
        border:solid 1px #FFFFFF;
        border-radius: 5px;
        width:180px;
        height: 180px
     }
     
     .croppa-container:hover {
        opacity: 1;
        background-color: #8ac9ef;
        border:solid 1px #3399ff;

     }

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
    .avatar{
        position: absolute;
        left: 50%;
        top:50%;
        margin-top: -180px;
        margin-left: -520px;
        background: rgba(255,255,255, 0.8);
        border-radius: 5px;
        width: 200px;
        text-align: center;
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



</style>
