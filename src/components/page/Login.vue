<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">学习平台</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"> 
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn" style="width: 100%;height: 36px;margin-bottom: 10px;text-align: center;">
                    <el-button type="primary" @click="submitForm()" style='width: 100%' v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </div>
                 <div class="login-btn" style="width: 100%;height: 36px;margin-bottom: 10px;text-align: center;">
                    <el-button type="primary" @click="toRegister()" style='width: 100%'>注册</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import server from '../../../config/index';
    import axios from 'axios';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                fullscreenLoading:false
            }
        },
        methods: {
            toRegister(){
                this.$router.push('/register');
            },
            submitForm() {
            	var that=this;
            	this.fullscreenLoading=true;
                this.$http.post(server.url + '/auth', {username:this.ruleForm.username,password:this.ruleForm.password}).then(response => {
	                    localStorage.setItem('token',response.data.token);
	                    localStorage.setItem('ms_username',this.ruleForm.username);
	                    that.fullscreenLoading=false;
	                    that.$notify({
	                        title: '登录成功',
	                        message: '稍后将转向首页',
	                        type: 'success',
	                        duration:2000
	                    });
	                    setTimeout(function(){
	                        that.$router.push('/');
	                    },2000)
                   }, response => {
                    console.log('登录失败：',response);
                    that.fullscreenLoading=false;
                    that.$notify.error({
                        title: '登录失败',
                        message: '用户名密码不匹配或网络错误',
                        duration:2000
                    });
                });
            },
            getToken(){
                return localStorage.getItem('token');
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
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
</style>
