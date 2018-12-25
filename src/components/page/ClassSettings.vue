<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <div>
            <el-card style="margin-top: 20px">
                <el-tabs tab-position="left">
                    <el-tab-pane label="创建班级">
                        <el-form :model="ruleForm" status-icon label-position="top" :rules="rules" ref="ruleForm2" class="demo-ruleForm" style="padding-left: 20px">
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
                                    <!-- el-form-item label="选择身份" prop="course_class_status">
                                        <el-radio v-model="ruleForm.course_class_status" label="0">学生</el-radio>
                                        <el-radio v-model="ruleForm.course_class_status" label="1">教师</el-radio>
                                    </--el-form-item -->
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
                                    <el-button type="primary" @click="submit">确认</el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="管理成员">
                        <el-row>
                            <el-col>
                                <div style="font-size: 14px; font-weight: bold">输入成员邮箱</div>
                                <div style="font-size: 12px; margin-top: 3px; color: #BABABA">-输入邮箱之后，成员将收到你的邀请邮件。</div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-checkbox v-model="checked" style="margin-top: 10px">添加/删除模式</el-checkbox>
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
                                <el-button type="primary" v-show="!checked" style="margin-top: 10px">添加成员</el-button>
                                <el-button type="primary" v-show="checked" @click="dialogVisible = true" style="margin-top: 10px">添加/删除成员</el-button>
                            </el-col>
                            <el-col>

                            </el-col>
                        </el-row>
                        <el-dialog title="添加/删除学生" :visible.sync="dialogVisible">
                            <el-transfer
                                filterable
                                :filter-method="filterMethod"
                                filter-placeholder="请输入城市拼音"
                                v-model="value2"
                                :data="data2">
                            </el-transfer>
                        </el-dialog>
                    </el-tab-pane>

                    <el-tab-pane label="加入班级">
                        <div>
                            <el-input
                                placeholder="请输入邮箱"
                                v-model="classEmail"
                                clearable
                                style="width: 200px">
                            </el-input>
                        </div>
                        <div style="margin-top: 10px">
                            <el-input
                                placeholder="请输入班级验证码"
                                v-model="classAccessCode"
                                clearable
                                style="width: 200px">
                            </el-input>
                        </div>
                        <div style="margin-top: 10px">
                            <el-button type="primary" v-show="!checked" style="margin-top: 10px">确认</el-button>
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
                let atPos=value.indexOf('@');
                let dotPos=value.indexOf('.');
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
            const generateData2 = _ => {
                const data = [];
                const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
                const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
                cities.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: index,
                        pinyin: pinyin[index]
                    });
                });
                return data;
            };
            return {
                data2: generateData2(),
                value2: [],
                filterMethod(query, item) {
                    return item.pinyin.indexOf(query) > -1;
                },
                classEmail: '',
                classAccessCode: '',
                universityOptions:[],
                schoolOptions:[],
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
                    course_instructor_self_signup: '',
                    course_class_status: '',
                    course_credit: '',
                    admin_name: '',
                    admin_userid: '',
                    admin_email: ''
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
                memberEmail: '',
                members: [],
                fileList: [],
                checked: false,
                dialogVisible: false,
                activeName: 'first',
                termOptions: [{
                    value: '0',
                    label: '2018-2019第一学期'
                }, {
                    value: '1',
                    label: '2018-2019第二学期'
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
                }]
            };
        },
        methods: {
            submit: function() {

            },
            querySearch(queryString, cb) {
                let results = queryString ? this.nameOptions.filter(this.createFilter(queryString)) : this.nameOptions;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (res) => {
                    return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                this.ruleForm.className = item.value
            },
            // 获取大学列表
            getUniversityList(){
                var that=this;
                this.$axios({
                    method:'get',
                    url:server.url + '/register/university/',
                    data:{},
                    headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')}
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
            // 获取专业信息
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
