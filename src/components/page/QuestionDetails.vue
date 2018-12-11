<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <div>
            <el-card class="box-card">
                <div class="item">
                    <el-card shadow="never">
                        <div slot="header">
                            <span><el-button icon="fa fa-chevron-left" @click="goBack()" style="border-color: #fff; margin-right: 2px"></el-button></span>
                            <span style="font-size: 15px">{{question.question_title}}</span>
                        </div>
                        <div>
                            {{question.question_text}}
                        </div>
                    </el-card>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import server from '../../../config/index';

    export default {
        name: "QuestionDetails",
        mounted: function() {
            this.getParams();
        },
        data() {
            return {
                question: {}
            }
        },
        methods: {
            getParams: function () {
                this.question = this.$route.query.index;
            },
            goBack: function() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>
    .item {
        padding: 18px 0;
    }

    .box-card {
        width: 600px;
    }
</style>
