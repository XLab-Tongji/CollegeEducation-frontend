<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <div>
            <el-card style="margin-top: 20px">
                <el-tabs tab-position="left">
                    <!-- 创建班级 -->
                    <el-tab-pane label="创建班级">
                        <el-form :model="ruleForm" status-icon label-position="top" :rules="rules" ref="ruleForm" style="padding-left: 20px" v-loading="loading1">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item label="选择学校" prop="course_school">
                                        <el-select v-model="ruleForm.course_school" style="width: 300px">
                                            <el-option
                                                v-for="item in universityOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="选择专业" prop="course_major">
                                        <el-select v-model="ruleForm.course_major" style="width: 300px" no-data-text='请首先选择所在学校'>
                                            <el-option
                                                v-for="item in schoolOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="选择学期" prop="course_term">
                                        <el-select v-model="ruleForm.course_term" style="width: 300px">
                                            <el-option
                                                v-for="item in termOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="开课时间" prop="course_start_date" style="width: 300px">
                                        <el-date-picker
                                            v-model="ruleForm.course_start_date"
                                            type="date"
                                            placeholder="">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="班级名称" prop="course_name">
                                        <el-input v-model="ruleForm.course_name" clearable style="width: 300px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="班级编号" prop="course_no">
                                        <el-input v-model="ruleForm.course_no" clearable style="width: 300px"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="课程学分" prop="course_credit">
                                        <el-select v-model="ruleForm.course_credit" style="width: 300px">
                                            <el-option
                                                v-for="item in creditOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="6位验证码" prop="course_access_code">
                                        <el-input v-model="ruleForm.course_access_code" clearable style="width: 300px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="注册地址" prop="course_signup_link">
                                        <span v-for="item in ruleForm.course_signup_link">{{item}}</span>
                                    </el-form-item>
                                    <el-form-item label="班级主页" prop="course_class_link">
                                        <span v-for="item in ruleForm.course_class_link">{{item}}</span>
                                    </el-form-item>
                                    <el-form-item label="邮箱" prop="admin_email">
                                        <el-input v-model="ruleForm.admin_email" clearable style="width: 300px"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-form-item>
                                    <el-button type="primary" @click="createClass">确认</el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <!-- 管理成员 -->
                    <el-tab-pane label="管理成员">
                        <div v-loading="loading4" style="padding-left: 20px">
                            <el-row>
                                <el-col>
                                    <div style="font-size: 14px; font-weight: bold">班级编号</div>
                                    <el-input v-model="course_no" clearable style="width: 300px; margin-top: 10px"></el-input>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <div style="font-size: 14px; font-weight: bold; margin-top: 10px">成员邮箱</div>
                                    <div style="font-size: 12px; margin-top: 5px; color: #BABABA">-输入邮箱之后，成员将收到你的邀请邮件。</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-checkbox v-model="checked" style="margin-top: 10px">筛选模式</el-checkbox>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 10, maxRows: 10}"
                                        placeholder="请输入学生邮箱"
                                        v-model="memberEmail"
                                        style="margin-top: 10px">
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <el-button type="primary" v-show="!checked" style="margin-top: 10px" @click="addStudents(memberEmail)">添加成员</el-button>
                                    <el-button type="primary" v-show="checked" style="margin-top: 10px" @click="getStudents">筛选成员</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <el-dialog title="筛选成员" :visible.sync="dialogVisible" v-loading="loading2">
                            <div>
                                <el-transfer
                                    :titles="['未添加', '已添加']"
                                    v-model="value"
                                    :data="students">
                                </el-transfer>
                            </div>
                            <div align="right" style="margin-top: 10px">
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="dialogVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="confirmExcuting">确 定</el-button>
                                </span>
                            </div>
                        </el-dialog>
                    </el-tab-pane>
                    <!-- 加入班级 -->
                    <el-tab-pane label="加入班级">
                        <div v-loading="loading3" style="padding-left: 20px">
                            <div style="font-size: 14px; font-weight: bold">班级验证码</div>
                            <div>
                                <el-input
                                    placeholder="请输入班级验证码"
                                    v-model="classAccessCode"
                                    clearable
                                    style="width: 200px; margin-top: 12px">
                                </el-input>
                            </div>
                            <div style="margin-top: 8px">
                                <el-button type="primary" style="margin-top: 10px" @click="joinClass">加入班级</el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script>
    import server from '../../../config/index';

    export default {
        name: "ClassCreate",
        data() {
            // 检验表单内容是否有效
            var checkNo = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('此项不能为空'));
                }
                callback();
            };
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('此项不能为空'));
                }
                callback();
            };
            var checkCode = (rule, value, callback) => {
                let myReg = /^[0-9a-zA-Z]*$/g;
                if (!value) {
                    return callback(new Error('此项不能为空'));
                }
                else if (value.length !== 6 || !myReg.test(value)) {
                    return callback(new Error('验证码必须是6位，且只有字母和数字。'));
                }
                else {
                    return callback();
                }
            };
            var checkVolume = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('此项不能为空'));
                }
                else if (!Number.isInteger(value)) {
                    return callback(new Error('此项只能包含数字'));
                }
                else {
                    return callback();
                }
            };
            var checkEmail = (rule, value, callback) => {
                let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
                if(!value){
                    return callback(new Error('此项不能为空'));
                }
                else if(!myReg.test(value)){
                    return callback(new Error('邮箱格式错误'));
                }
                else {
                    return callback();
                }
            };
            return {
                // 创建班级
                newClass: {
                    course_university: '',
                    course_major: '',
                    course_term: '',
                    course_name: '',
                    course_no: '',
                    course_start_date: '',
                    course_signup_link: '',
                    course_access_code: '',
                    course_class_link: '',
                    course_instructor_self_signup: 0,
                    course_class_status: 0,
                    course_credit: '',
                    admin_name: 'qibatu',
                    admin_userid: 2,
                },
                ruleForm: {
                    course_school: '',
                    course_major: '',
                    course_term: '',
                    course_name: '',
                    course_no: '',
                    course_start_date: '',
                    course_signup_link: ['xlab409.com/', '', ''],
                    course_access_code: '',
                    course_class_link: ['xlab409.com/', '', ''],
                    course_credit: '',
                    admin_email: '',
                },
                rules: {
                    course_name: [
                        { validator: checkName, trigger: 'blur' }
                    ],
                    course_no: [
                        { validator: checkNo, trigger: 'blur' }
                    ],
                    course_access_code: [
                        { validator: checkCode, trigger: 'blur'}
                    ],
                    admin_email: [
                        { validator: checkEmail, trigger: 'blur' }
                    ]
                },
                termOptions: [{
                    value: 'SPRING 2018',
                    label: 'SPRING 2018'
                }, {
                    value: 'FALL 2018',
                    label: 'FALL 2018'
                }],
                creditOptions: [{
                    value: '1'
                }, {
                    value: '2'
                }, {
                    value: '3'
                },{
                    value: '4'
                },{
                    value: '5'
                }],
                universityOptions:[],
                schoolOptions:[],
                loading1: false,
                // 管理成员
                course_no: '',
                memberEmail: '',
                emailArray: [],
                checked: false,
                dialogVisible: false,
                students: [],
                fileList: [],
                value: [],
                loading2: false,
                loading4: false,
                // 加入班级
                classAccessCode: '',
                loading3: false,
                userInfo: {
                    username: "qibatu",
                    password: "123456",
                    email: "qibatu@outlook.com",
                    gender: "male",
                    universityID: 1,
                    majorID: 2,
                    birthday: "2018-09-09",
                    studentID: "1655555",
                    auth: 1,
                    admissionYear: "2016"
                },
                // 其他
                activeName: 'first'
            };
        },
        methods: {
            // 创建班级
            createClass: function() {
                this.newClass.course_university = this.ruleForm.course_school;
                this.newClass.course_major = this.ruleForm.course_major;
                this.newClass.course_term = this.ruleForm.course_term;
                this.newClass.course_name = this.ruleForm.course_name;
                this.newClass.course_no = this.ruleForm.course_no;
                this.newClass.course_start_date = this.ruleForm.course_start_date.format("yyyy-MM-dd HH:mm:ss");
                var str = this.ruleForm.course_signup_link[0] + this.ruleForm.course_signup_link[1] + this.ruleForm.course_signup_link[2];
                this.newClass.course_signup_link = str;
                str = this.ruleForm.course_class_link[0] + this.ruleForm.course_class_link[1] + this.ruleForm.course_class_link[2];
                this.newClass.course_class_link = str;
                this.newClass.course_access_code = this.ruleForm.course_access_code;
                this.newClass.course_credit = this.ruleForm.course_credit;
                this.loading1 = true;

                this.$http.post(server.url + '/email', {params: {receiver: this.ruleForm.admin_email}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status === 200){ }
                    else{
                        this.loading1 = false;
                        this.$message({type: 'error', message: '请重试'});
                    }
                }).catch((response) => {
                    this.loading1 = false;
                    this.$message({type: 'error', message: '请重试!'});
                });
                /*
                this.$http.post(server.url + '/class', this.newClass, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status === 200) {
                        this.loading1 = false;
                        this.$message({type: 'success', message: '创建成功！'});
                        this.$router.push('/class-list');
                    }
                    else {
                        this.loading1 = false;
                        this.$message({type: 'error', message: '请重试'});
                    }
                }).catch((response) => {
                this.loading = false;
                this.$message({type: 'error', message: '请重试!'});
                });*/
            },
            // 添加成员
            addStudents(mEmail) {
                // TODO: 学生邮箱转数组
                if (this.course_no === '') {
                    this.$message({type: 'error', message: '请输入班级编号!'});
                    return;
                }
                if (mEmail === '') {
                    this.$message({type: 'error', message: '请输入学生邮箱!'});
                    return;
                }
                this.loading4 = true;
                //this.emailArray = mEmail.split(',');
                let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
                if (!myReg.test(mEmail)) {
                    this.$message({type: 'error', message: '请检查邮箱格式!'});
                    this.loading4 = false;
                    return;
                }
                let email = {student_email: mEmail};
                this.$http.post(server.url + '/class/student', email, {params: {course_no: this.course_no}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status === 200) {
                        this.loading4 = false;
                        this.$message({type: 'success', message: '添加成功！'});
                        this.$router.push('/class-list');
                    }
                    else {
                        this.loading4 = false;
                        this.$message({type: 'error', message: '请重试'});
                    }
                });
            },
            // 删除成员
            deleteStudents(mEmail) {
                if (this.course_no === '') {
                    this.$message({type: 'error', message: '请输入班级编号!'});
                    return;
                }
                if (mEmail === '') {
                    this.$message({type: 'error', message: '请输入学生邮箱!'});
                    return;
                }
                this.loading4 = true;
                //this.emailArray = this.mEmail.split(',');
                let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
                if (!myReg.test(mEmail)) {
                    this.$message({type: 'error', message: '请检查邮箱格式!'});
                    this.loading4 = false;
                    return;
                }
                let email = {student_email: mEmail};
                this.$http.delete(server.url + '/class/student', email, {params: {course_no: this.course_no}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status === 200) {
                        this.loading4 = false;
                    }
                    else {
                        this.loading4 = false;
                        this.$message({type: 'error', message: '请重试'});
                    }
                }, (response) => {
                    if (response.status === 403) {
                        this.loading = false;
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '请重试!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '请重试!'});
                });
            },
            // 获取学生列表
            getStudents() {
                if (this.course_no === '') {
                    this.$message({type: 'error', message: '请输入班级编号!'});
                    return;
                }
                this.loading2 = true;
                this.students = [];
                this.value = [];
                var i = 0;
                if (this.memberEmail !== '') {
                    this.emailArray = this.memberEmail.split(',');
                    let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
                    while (i < this.emailArray.length) {
                        if (!myReg.test(this.emailArray[i])) {
                            this.$message({type: 'error', message: '请检查邮箱格式!'});
                            this.loading2 = false;
                            return;
                        }
                        this.students.push({
                            label: this.emailArray[i],
                            key: i
                        });
                        i++;
                    }
                }
                this.$http.get(server.url + '/teacher/class/member?course_no=' + this.course_no, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    if (response.status === 200) {
                        var studentList = JSON.parse(response.bodyText);
                        var j = 0;
                        while (j < studentList.data.length) {
                            this.students.push({
                                label: studentList.data[j].student_email,
                                key: i
                            });
                            this.value.push(i);
                            i++;
                            j++;
                        }
                        this.loading2 = false;
                    } else {
                        this.loading2 = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }, (response) => {
                    if (response.status === 403) {
                        this.loading2 = false;
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.loading2 = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '加载失败!'});
                });
                this.dialogVisible = true
            },
            // 排序
            sortNumber(a, b)
            {
                return a - b
            },
            // 筛选成员
            confirmExcuting() {
                //this.loading2 = true;
                var unselected = [];
                var selected = [];
                this.value.sort(this.sortNumber);
                var i = 0;
                var j = 0;
                while (j < this.students.length) {
                    if (i < this.value.length && j === this.value[i]) {
                        selected.push (this.students[j]);
                        j++;
                        i++;
                    }
                    else {
                        unselected.push(this.students[j]);
                        j++;
                    }
                }
                var str1 = '';
                var str2 = '';
                for (i = 0;i < unselected.length; i++) {
                    str1 += unselected[i].label + ', ';
                }
                for (i = 0;i < selected.length; i++) {
                    str2 += selected[i].label + ', ';
                }
                alert(str1 + '不在班级内。' + str2 + '在班级内。')
                this.dialogVisible = false;
            },
            // 加入班级
            joinClass() {
                let codeReg = /^[0-9a-zA-Z]*$/g;
                if (!codeReg.test(this.classAccessCode)) {
                    this.$message({type: 'error', message: '班级验证码为六位的字母数字组合'});
                }
                else {
                    this.loading3 = true;
                    // TODO: 获取user信息
                    this.$http.post(server.url + '/student/class', this.userInfo, {params:{course_access_code: this.classAccessCode}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200) {
                            this.loading3 = false;
                            this.$message({type: 'success', message: '你已成功加入班级！'});
                            this.$router.push('/class-list');
                        }
                        else {
                            this.loading3 = false;
                            this.$message({type: 'error', message: '请重试'});
                        }
                    }, (response) => {
                        if (response.status === 403) {
                            this.loading = false;
                            this.$message({type: 'error', message: response.response.data});
                        } else {
                            this.loading = false;
                            this.$message({type: 'error', message: '请重试!'});
                        }
                    }).catch((response) => {
                        this.loading = false;
                        this.$message({type: 'error', message: '请重试!'});
                    });
                }
            },
            // 获取大学列表
            getUniversityList(){
                var that=this;
                this.$axios({
                    method:'get',
                    url:server.url + '/register/university/',
                    data:{},
                    headers:{}
                }).then(function(response){
                    var universityList = response.data.data;
                    for(let i=0;i<universityList.length;i++){
                        var universityDetail=universityList[i];
                        that.universityOptions.push({value:universityDetail.universityID,label:universityDetail.universityName})
                    }
                })
            },
        },
        mounted:function(){
            this.getUniversityList();
        },
        watch:{
            // 监听大学信息
            'ruleForm.course_school':function(val){
                let that=this;
                this.$axios({
                    method:'get',
                    url:server.url + '/register/university/' + val,
                    data:{},
                    headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')}
                }).then(function(response){
                    var majorIn = response.data.data;
                    for(let i=0;i<majorIn.length;i++){
                        var majorDetail=majorIn[i];
                        that.schoolOptions.push({value:majorDetail.id,label:majorDetail.majorName});
                    }
                });
                switch (val) {
                    case 1: {
                        that.ruleForm.course_signup_link[0] = 'xlab409.com/tongji_university/';
                        that.ruleForm.course_class_link[0] = 'xlab409.com/tongji_university/';
                        break;
                    }
                    case 2: {
                        that.ruleForm.course_signup_link[0] = 'xlab409.com/fudan_university/';
                        that.ruleForm.course_class_link[0] = 'xlab409.com/fudan_university/';
                        break;
                    }
                    case 3: {
                        that.ruleForm.course_signup_link[0] = 'xlab409.com/jiaotong_university/';
                        that.ruleForm.course_class_link[0] = 'xlab409.com/jiaotong_university/';
                        break;
                    }
                    default: {
                        that.ruleForm.course_signup_link[0] = 'xlab409.com/';
                        that.ruleForm.course_class_link[0] = 'xlab409.com/';
                        break;
                    }
                }
            },
            // 监听学期选择
            'ruleForm.course_term': function (val) {
                let that = this;
                switch (val) {
                    case '0': {
                        that.ruleForm.course_signup_link[1] = 'fall2018/';
                        that.ruleForm.course_class_link[1] = 'fall2018/';
                        break;
                    }
                    case '1': {
                        that.ruleForm.course_signup_link[1] = 'spring2019/';
                        that.ruleForm.course_class_link[1] = 'spring2019/';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
            // 监听课程名
            'ruleForm.course_name': function (val) {
                let that = this;
                that.ruleForm.course_signup_link[2] = val;
                that.ruleForm.course_class_link[2] = val + '/home';
            }
        },
    }
</script>

<style scoped>

</style>
