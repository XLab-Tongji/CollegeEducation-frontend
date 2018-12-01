<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <el-row gutter="20">
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
                                    <el-row gutter="15">
                                        <!-- 头像 -->
                                        <el-col :span="4">
                                            <div><img :src="scope.row.image" class="img"/></div>
                                        </el-col>
                                        <!-- 其他信息 -->
                                        <el-col :span="20">
                                            <el-row>
                                                <div style="font-size: 15px; padding-left: 2px">{{scope.row.title}}</div>
                                            </el-row>
                                            <el-row style="margin-top: 5px">
                                                <div style="font-size: 13px;padding-left: 3px">{{scope.row.author}}</div>
                                            </el-row>
                                            <el-row gutter="15" style="margin-top: 6px">
                                                <el-col :span="5">
                                                    <div>
                                                        <div style="border-right: solid 1px #E1E1E1"><el-tag color="#fff" style="color: #AAAAAA; border-color: #AAAAAA">{{scope.row.tag}}</el-tag></div>
                                                    </div>
                                                </el-col>
                                                <el-col :span="19">
                                                    <el-rate
                                                        v-model="scope.row.score"
                                                        disabled
                                                        show-score
                                                        text-color="#ff9900"
                                                        score-template="{value}">
                                                    </el-rate>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
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

    export default {
        name: "QuestionList",
        data() {
            return {
                questions: [{image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543568683144&di=a86f2c37fc1013631dda629cfa2e6d77&imgtype=0&src=http%3A%2F%2Fp4.so.qhmsg.com%2Ft01b7802b9bf3f8e4ce.jpg",
                    title: "标题", author: "作者", tag: "软件工程", score: 3.9}],
                loading: false
            }
        },
        methods : {
            // 获取问题信息
            getQuestions() {

            }
        },
        mounted() {
            // 生成二维码
            let qrcode = new QRCode('qrcode',{
                width: 150, // 设置宽度，单位像素
                height: 150, // 设置高度，单位像素
                text: 'https://www.baidu.com'   // 设置二维码内容或跳转地址
            });
            this.getQuestions();
        },
        components: {QRCode},
    }
</script>

<style scoped>

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
