<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <el-row :gutter="20">
            <el-col :span="16" align="right">
                <el-card class="box-card">
                    <div class="item">
                        <el-table
                            :data="questions"
                            style="width: 100%"
                            v-loading="loading">
                            <el-table-column>
                                <!-- 推广 -->
                                <template slot="header" slot-scope="scope">
                                    <div align="center"><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543562366979&di=6af4d77c00492b8da615fad24597b3b4&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F013e43591c3c78a801216a3e7a4c6f.jpg%401280w_1l_2o_100sh.jpg" style="width: 520px;height: auto;" /></div>
                                </template>
                                <!-- 问题列表 -->
                                <template slot-scope="scope">
                                    <div style="padding-top: 10px; padding-bottom: 10px" align="left" @click="goDetails(scope.$index)">
                                        <el-row :gutter="20">
                                            <!-- 图片 -->
                                            <el-col :span="4">
                                                <div><img :src="scope.row.picture_path" class="img"/></div>
                                            </el-col>
                                            <!-- 其他信息 -->
                                            <el-col :span="20">
                                                <el-row>
                                                    <div style="font-size: 13.5px; padding-left: 2px">{{scope.row.question_title}}</div>
                                                </el-row>
                                                <el-row style="margin-top: 5px">
                                                    <div style="white-space: nowrap; text-overflow:ellipsis; overflow:hidden;font-size: 13px;padding-left: 3px">{{scope.row.question_text}}</div>
                                                </el-row>
                                                <el-row :gutter="10" style="margin-top: 6px">
                                                    <el-col :span="4">
                                                        <div>
                                                            <div style="border-right: solid 1px #E1E1E1"><el-tag color="#fff" style="color: #AAAAAA; border-color: #AAAAAA">{{scope.row.sector_name}}</el-tag></div>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="7">
                                                        <el-rate
                                                            v-model="scope.row.question_evaluation"
                                                            disabled
                                                            show-score
                                                            text-color="#ff9900"
                                                            score-template="{value}" style="zoom: 80%; padding-top: 6px">
                                                        </el-rate>
                                                    </el-col>
                                                    <el-col :span="13">
                                                        <div style="font-size: 12px; margin-left: 5px; color: #AAAAAA">
                                                            {{scope.row.question_participate}}人参与
                                                        </div>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-row>
                        <!----- 翻页 ----->
                        <div class="question-footer" align="center">
                            <el-pagination
                                small
                                :page-size="pageSize"
                                layout="prev, pager, next"
                                :total="totalCount"
                                class="page-change"
                                :current-page="currentPage"
                                @current-change="currentChange" v-show="questions.length > 0">
                            </el-pagination>
                        </div>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card style="width: 200px">
                    <div class="item" align="center">
                        <!-- 显示二维码 -->
                        <el-popover
                            placement="bottom"
                            width="150"
                            trigger="hover">
                            <div id="qrcode"></div>
                            <el-button slot="reference" type="text">显示二维码</el-button>
                        </el-popover>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2'
    import server from '../../../config/index';

    export default {
        name: "QuestionList",
        data() {
            return {
                questions: [],
                loading: false,
                currentPage: 1,
                pageSize: 10,
                totalCount: 0
            }
        },
        methods : {
            // 获取问题信息
            getQuestions(page, count) {
                this.questions = [];
                this.$http.get(server.url + '/question/get/all', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    this.loading = false;
                    if (response.status === 200) {
                        let questionList = JSON.parse(response.bodyText);
                        this.totalCount = questionList.data.length;
                        var i = (page - 1) * count;
                        var j = (page * count < this.totalCount ? page * count : this.totalCount);
                        while (i < j) {
                            this.questions.push({
                                question_ID: questionList.data[i].question_ID,
                                question_sector_ID: questionList.data[i].question_sector_ID,
                                question_title: questionList.data[i].question_title,
                                sector_name: questionList.data[i].sector_name,
                                user_ID: questionList.data[i].user_ID,
                                question_text: questionList.data[i].question_text,
                                question_date: questionList.data[i].question_date,
                                answer_count: questionList.data[i].answer_count,
                                clicking_rate: questionList.data[i].clicking_rate,
                                question_evaluation: questionList.data[i].question_evaluation,
                                question_follow: questionList.data[i].question_follow,
                                question_participate: questionList.data[i].question_participate,
                                picture_path: questionList.data[i].picture_path
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
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '加载失败!'});
                })
            },
            // 翻页
            currentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.loading = true;
                this.loadBlogs(currentPage, this.pageSize);
            },
            // 跳转至详情页面
            goDetails: function(index) {
                this.$router.push({
                    path: '/question-details',
                    name: 'QuestionDetails',
                    query: {
                        index: this.questions[index]
                    }
                })
            }
        },
        mounted: function() {
            // 生成二维码
            let qrcode = new QRCode('qrcode',{
                width: 150, // 设置宽度，单位像素
                height: 150, // 设置高度，单位像素
                text: 'https://www.baidu.com'   // 设置二维码内容或跳转地址
            });
            this.getQuestions(1, this.pageSize);
        },
        components: {QRCode},
    }
</script>

<style scoped>
    .question-footer {
        box-sizing: content-box;
        margin-top: 10px;
    }

    .item {
        padding: 18px 0;
    }

    .box-card {
        width: 600px;
    }

    .img {
        width: 80px;
        height: 80px;
        border-radius: 10px;
    }
</style>
