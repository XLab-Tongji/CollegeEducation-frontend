<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">用户注册</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-row :gutter="20">
                <el-col :span='12'>
                    <el-form-item prop="uName">
                        <el-input v-model="ruleForm.uName" placeholder="请输入姓名">
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-radio-group v-model="ruleForm.gender" size="small" style='margin-bottom: 19px'>
                        <el-radio-button label="请选择你的性别" disabled ></el-radio-button>
                        <el-radio-button label="男" ></el-radio-button>
                        <el-radio-button label="女"></el-radio-button>
                    </el-radio-group>

                    <el-form-item prop="sID">
                        <el-input v-model="ruleForm.sID" placeholder="请输入学号">
                            <el-button slot="prepend" icon="el-icon-edit"></el-button>
                        </el-input>
                    </el-form-item>
                    
                    <!--
                    <el-form-item prop="birthday">
                        <el-select v-model="ruleForm.birthdayYear" placeholder="请选择" style="width:49%">
                            <el-option
                             v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="ruleForm.birthdayMonth" placeholder="请选择" style="width:49%;float:right">
                            <el-option
                             v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                -->
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

                <el-col :span='12'>

                    <el-form-item prop="birthday">
                        <el-date-picker
                         v-model="ruleForm.birthday"
                         type="month"
                         placeholder="请选择出生年月" style='width: 100%'>
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item prop="university">
                        <el-select v-model="university" placeholder="请选择所在学校" style='width: 100%'>
                            <el-option
                             v-for="item in universityOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="school">
                        <el-select v-model="ruleForm.school" placeholder="请选择所在院系" style='width: 100%'>
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

                    <!--
                    <el-form-item prop="startYear">
                        <el-input v-model="ruleForm.startYear" placeholder="请输入入学年份">
                            <el-button slot="prepend" icon="el-icon-date"></el-button>
                        </el-input>
                    </el-form-item>
                -->
                </el-col>
                </el-row>
                
                <div class="login-btn">
                    <el-button type="primary" @click="register()">注册</el-button>
                </div>
                <p class="login-tips">Tips : 这是注册页面。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import server from '../../../config/index';
    export default {
        data: function(){
            return {
                authOptions:[{
                                value:'1',// 这里请填入接口中定义的学生和老师对应编号
                                label:'学生'
                             },{
                                value:'2',
                                label:'教师'
                             }],
                universityOptions:[],
                schoolOptions:[],
                university:'',// 把University拿出来的原因：watch监听(ruleForm.university)语法不会写……
                ruleForm: {
                    uName: '',
                    gender:'',
                    sID:'',
                    email:'',
                    password: '',
                    repassword:'',
                    birthday:'',//Date类型，通过.getMonth()+1和.getFullYear()方法获取年份和月份
                    university:'',
                    school:'',
                    auth:'',
                    startYear:'',//Date类型，通过.getFullYear()方法获取年份
                },
                rules: {
                    uName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted:function(){
            this.getUniversityList();
        },
        watch:{
            university:function(val){
                // 请在这里写获取学院列表的请求，val中的参数是用户选择的学校，即university的value
                // 之后将拿到的数据push进schoolOptions中，如下
                this.schoolOptions.push({value:'1',label:'软件学院'});
                this.schoolOptions.push({value:'2',label:'电信学院'});
            }
        },
        methods: {
            getUniversityList(){
                // 请在这里加入获取大学列表的接口信息
                // 之后把get得到的大学列表push进universityOptions中，如下
                this.universityOptions.push({value:'1',label:'同济大学'});
            },
            register() {
                console.log(this.ruleForm);
                this.$http.post(server.url + '/register', {
                    // 这段的接口全部都是我YY的，需要和后端确定
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

            
                   }, response => {
                     console.log("error");
                     console.log(response);
                });
            }
        }
    }
</script>

<style scoped>

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
        color: #aaa;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:600px;
        margin:-250px 0 0 -300px;
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
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>