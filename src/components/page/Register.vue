<template>
    <div class="login-wrap" v-loading='loading'>
        <div class="ms-login">
            <div class="ms-title">用户注册</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content" status-icon='true'>
                <el-row :gutter="20">
                <el-col :span='12' id='ms-left'>
                    <el-form-item prop="uName">
                        <el-input v-model="ruleForm.uName" placeholder="请输入姓名" >
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-radio-group v-model="ruleForm.gender" size="small" style='margin-bottom: 23px;margin-top: 2px'>
                        <el-radio-button label="请选择你的性别" disabled ></el-radio-button>
                        <el-radio-button label="男" ></el-radio-button>
                        <el-radio-button label="女"></el-radio-button>
                    </el-radio-group>

                    <el-form-item prop="sID">
                        <el-input v-model="ruleForm.sID" placeholder="请输入学号">
                            <el-button slot="prepend" icon="el-icon-edit"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="email">
                        <el-input v-model="ruleForm.email" placeholder="请输入电子邮箱">
                            <el-button slot="prepend" icon="el-icon-lx-mail"></el-button>
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

                </el-col>

                <el-col :span='12' id='ms-right'>

                    <el-form-item prop="birthday">
                        <el-date-picker
                         v-model="ruleForm.birthday"
                         type="month"
                         placeholder="请选择出生年月" style='width: 100%'>
                        </el-date-picker>
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

                    <el-form-item prop="startYear">
                        <el-date-picker
                         v-model="ruleForm.startYear"
                         type="year"
                         placeholder="请选择入学年份" style='width: 100%'>
                        </el-date-picker>
                    </el-form-item>

                </el-col>
                </el-row>
                
                <div class="login-btn">
                    <el-button type="primary" @click="register()">注册</el-button>
                </div>
                <p class="login-tips">Tips : 所有信息均为必填。</p>
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
                if(!value){
                    return callback(new Error('请输入密码'));
                }else if(value.length<5){
                    return callback(new Error('密码非法'));
                }else{
                    return callback();
                }
            };
            // 验证再次输入密码是否与原值相同
            var repasswordValidity = (rule, value, callback) =>{
                if(!value){
                    return callback(new Error('请再次输入密码以确认'));
                }else if(value!=this.ruleForm.password){
                    return callback(new Error('两次输入的密码不一致，请重试'));
                }else{
                    callback();
                }
            };
            // 验证邮箱输入的合法性
            var emailValidity = (rule, value, callback) =>{
                var atPos=value.indexOf('@');
                var dotPos=value.indexOf('.');
                if(!value){
                    return callback(new Error('请输入电子邮箱'));
                }else if(!(atPos>0&&dotPos>0&&dotPos-atPos>1&&dotPos!=value.length-1)){
                    return callback(new Error('输入的电子邮箱非法，请重试'));
                }else{
                    return callback();
                }
            }
            return {
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
                    startYear:false
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
            getUniversityList(){
                // Evan:请在这里加入获取大学列表的接口信息
                // 之后把get得到的大学列表push进universityOptions中，如下
                this.universityOptions.push({value:'1',label:'同济大学'});
            },
            register() {
                this.loading=true;

                // To Be Done:判断表单提交前的所有字段合法性

                if(this.ruleForm.birthday==''||this.ruleForm.startYear==''||this.ruleForm.birthday==null||this.ruleForm.startYear==null){
                    this.$notify.error({
                    title: '注册失败',
                    message: '没有填写出生年月或入学时间'
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

</style>