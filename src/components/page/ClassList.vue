<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <div style="margin-top: 20px">
            <el-button type="primary" @click="goSettings">管理我的班级</el-button>
        </div>
        <div style="margin-top: 10px" v-loading="loading">
            <el-row :gutter="10">
                <el-col :span="8">
                    <!-- 我创建的班级 -->
                    <div style="font-size: 14px; font-weight: bold; margin-top: 10px">我创建的</div>
                    <div>
                        <el-card style="margin-top: 10px; width: 400px"
                                 v-for="item in classes1"
                                 :key="item.course_id"
                                 :label="item.course_name"
                                 :value="item.course_id">
                            <div style="font-size: 13px;">
                                <el-row>
                                    课程：{{item.course_no}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    课程名称：{{item.course_name}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    学期：{{item.course_term}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    开课时间：{{item.course_start_date}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    课程主页：{{item.course_class_link}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    教师：{{item.admin_name}}
                                </el-row>
                            </div>
                        </el-card>
                    </div>
                </el-col>
                <!-- 我加入的班级 -->
                <el-col :span="8">
                    <div style="font-size: 14px; font-weight: bold; margin-top: 10px">我加入的</div>
                    <div>
                        <el-card style="margin-top: 10px; width: 400px"
                                 v-for="item in classes2"
                                 :key="item.course_id"
                                 :label="item.course_name"
                                 :value="item.course_id">
                            <div style="font-size: 13px;">
                                <el-row>
                                    课程：{{item.course_no}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    课程名称：{{item.course_name}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    学期：{{item.course_term}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    开课时间：{{item.course_start_date}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    课程主页：{{item.course_class_link}}
                                </el-row>
                                <el-row style="margin-top: 3px">
                                    教师：{{item.admin_name}}
                                </el-row>
                            </div>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import server from '../../../config/index';

    export default {
        name: "ClassList",
        data() {
            return {
                classes1: [], // 我创建的班级
                classes2: [], // 我加入的班级
                loading: false,
            }
        },
        mounted() {
            this.loading = true;
            this.getClasses()
        },
        methods: {
            goSettings() {
                this.$router.push('/class-settings');
            },
            getClasses() {
                this.classes1 = [];
                this.classes2 = [];
                this.$http.get(server.url + '/teacher/class?userid=2', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    if (response.status === 200) {
                        var classList = JSON.parse(response.bodyText);
                        var i = 0;
                        while (i < classList.data.length) {
                            this.classes1.push({
                                course_id: classList.data[i].course_id,
                                course_no: classList.data[i].course_no,
                                course_name: classList.data[i].course_name,
                                course_term: classList.data[i].course_term,
                                course_start_date: classList.data[i].course_start_date,
                                course_signup_link: classList.data[i].course_signup_link,
                                course_access_code: classList.data[i].course_access_code,
                                course_class_link: classList.data[i].course_class_link,
                                course_instructor_self_signup: classList.data[i].course_instructor_self_signup,
                                course_class_status: classList.data[i].course_class_status,
                                course_credit: classList.data[i].course_credit,
                                admin_id: classList.data[i].admin_id,
                                admin_name: classList.data[i].admin_name,
                                admin_class: classList.data[i].admin_class,
                                admin_userid: classList.data[i].admin_userid
                            });
                            i++;
                        }
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }, (response) => {
                    if (response.status === 403) {
                        this.loading = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '加载失败!'});
                });
                this.$http.get(server.url + '/student/class?student_email=qibatu@outlook.com', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    this.loading = false;
                    if (response.status === 200) {
                        var classList = JSON.parse(response.bodyText);
                        var i = 0;
                        while (i < classList.data.length) {
                            this.classes2.push({
                                course_id: classList.data[i].course_id,
                                course_no: classList.data[i].course_no,
                                course_name: classList.data[i].course_name,
                                course_term: classList.data[i].course_term,
                                course_start_date: classList.data[i].course_start_date,
                                course_signup_link: classList.data[i].course_signup_link,
                                course_access_code: classList.data[i].course_access_code,
                                course_class_link: classList.data[i].course_class_link,
                                course_instructor_self_signup: classList.data[i].course_instructor_self_signup,
                                course_class_status: classList.data[i].course_class_status,
                                course_credit: classList.data[i].course_credit,
                                admin_id: classList.data[i].admin_id,
                                admin_name: classList.data[i].admin_name,
                                admin_class: classList.data[i].admin_class,
                                admin_userid: classList.data[i].admin_userid
                            });
                            i++;
                        }
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }, (response) => {
                    if (response.status === 403) {
                        this.loading = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '加载失败!'});
                });
            }
        }
    }
</script>

<style scoped>

</style>
