<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <el-main style="background-color: #fff">
            <el-card shadow="never">
                <div slot="header">
                    <span><el-button icon="fa fa-chevron-left" @click="goBack()" style="border-color: #fff; margin-right: 2px"></el-button></span>
                    <span style="font-size: 15px">{{blackboard.blackboard_name}}</span>
                </div>
                <div>
                    <el-row style="color: #6A6A6A">
                        <el-col :span="3">
                            <el-row>
                                <div>
                                    <div><img :src="authorImg" class="img" /></div>
                                </div>
                            </el-row>
                            <el-row style="padding-top: 10px;font-size: 12px;width: 100px">
                                <div align="center">{{blackboard.USERNAME}}</div>
                            </el-row>
                        </el-col>
                        <el-col :span="21" style="padding-left: 20px">
                            <el-row style="font-size: 14px; width: 78%; min-height: 120px; line-height: 24px">
                                <div id="text"></div>
                            </el-row>
                            <el-row style="font-size: 12px;margin-top: 30px;padding-right: 170px">
                                <el-col :span="15"><div style="padding-top: 8px">{{blackboard.blackboard_date}}</div></el-col>
                                <el-col :span="3"><div align="right"><el-button type="text" @click="collect()" v-loading="collectLoading" style="color: #6A6A6A"><i  class="fa fa-star fa-lg" v-show="isCollected" aria-hidden="true" style="margin-right: 5px;color: #FFE100"></i><i class="fa fa-star-o fa-lg" v-show="!isCollected" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>收藏</el-button></div></el-col>
                                <el-col :span="3"><div align="right"><a href="#postComment"><el-button type="text" style="color: #6A6A6A"><i class="fa fa-commenting-o fa-lg" aria-hidden="true" style="margin-right: 5px;"></i>评论</el-button></a></div></el-col>
                                <el-col :span="3"><div align="right"><el-button type="text" @click="like()" v-loading="likeLoading" style="color: #6A6A6A"><i class="fa fa-thumbs-o-up fa-lg" v-show="isLiked" aria-hidden="true" style="margin-right: 5px;color: #FF7B00;"></i><i class="fa fa-thumbs-o-up fa-lg" v-show="!isLiked" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>{{blackboard.praise_count}}</el-button></div></el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>
                <!-- 收藏/评论/点赞按键 -->
            </el-card>
            <!-- 评论列表 -->
            <div style="margin-top: 10px">
                <el-card shadow="never">
                    <el-table :data="comments" v-loading="commentLoading" :default-sort="{prop: 'ReplyDate', order: 'ascending'}" style="padding-top: 0">
                        <el-table-column label="评论" style="color: #6A6A6A;">
                            <template slot-scope="scope">
                                <el-row style="margin: 15px 0">
                                    <el-col :span="4">
                                        <el-row>
                                            <div><img :src="replyImg[scope.$index]" class="img" /></div>
                                        </el-row>
                                        <el-row style="padding-top: 10px;font-size: 12px;width: 100px">
                                            <div align="center">{{scope.row.username}}</div>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="20">
                                        <el-row style="min-height: 120px" id="content">
                                            <p style="font-size: 14px;line-height: 24px">{{scope.row.ReplyText}}</p>
                                        </el-row>
                                        <el-row style="margin-top: 30px">
                                            <el-col :span="18"><div style="font-size: 12px;padding-top: 8px">{{scope.row.ReplyDate}}</div></el-col>
                                            <el-col :span="3"><div align="right" style="font-size: 12px"><el-button type="text" style="color: #6A6A6A"><i class="fa fa-commenting-o fa-lg" aria-hidden="true" style="margin-right: 5px;"></i>回复</el-button></div></el-col>
                                            <el-col :span="3"><div align="right" style="font-size: 12px"><el-button type="text" style="color: #6A6A6A"><i class="fa fa-thumbs-o-up fa-lg" aria-hidden="true" style="margin-right: 5px;"></i></el-button>{{scope.row.PraiseCount}}</div></el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="按时间" width="80px" sortable prop="ReplyDate" style="margin: 15px 0">
                            <template slot-scope="scope">

                            </template>
                        </el-table-column>
                        <el-table-column label="按人气" width="80px" style="font-size: 12px; color: #6A6A6A; margin: 15px 0" align="center" sortable prop="PraiseCount">
                            <template slot-scope="scope">

                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </div>
            <div>
                <!-- 发表评论 -->
                <div style="margin-top: 20px;font-size: 14px;font-weight: bold;color: #6A6A6A">发表评论</div>
                <el-input type="textarea" v-model="commentText" placeholder="输入评论内容（400字以内）" maxlength="400" :autosize="{ minRows: 9, maxRows: 9}" style="margin-top: 15px;"></el-input>
                <el-button type="primary" @click="postComment()" style="background-color: #1ac7c3; border-color: #1ac7c3;margin-top: 15px" size="mini">发表</el-button>
            </div>
        </el-main>
    </div>
</template>

<script>
    import server from '../../../config/index';

    export default {
        mounted: function() {
            this.getParams();
            if (this.blackboard.praise_id !== -1) this.isLiked = true;
            if (this.blackboard.favourite_id !== -1) this.isCollected = true;
            const container = document.getElementById('text');
            container.appendChild(this.createNode(this.blackboard.blackboard_text));
            this.getAuthorImg();
            this.loadComments();
        },
        data() {
            return {
                blackboard: {},
                comments: [], // 存储评论信息
                collectLoading: false, // 收藏状态改变
                commentLoading: false, // 评论加载状态
                likeLoading: false, // 点赞状态改变
                commentText: '', // 发表评论内容
                isLiked: false, // 点赞状态
                isCollected: false, // 收藏状态
                authorImg: '', // 楼主头像
                replyImg: [], // 评论头像
                // 收藏实体
                favoriteEntity: {
                    topic_id: 0,
                    user_id: 1, // 需要获取
                    collection_time: new Date(),
                    type: 1
                },
                // 评论实体
                replyEntity: {
                    TopicId: -1,
                    UserId: 1, // 需要获取
                    ReplyText: '',
                    ReplyDate: new Date(),
                    ClickingRate: 0,
                    PraiseCount: 0,
                    type: 1
                }
            }
        },
        methods: {
            getParams: function () {
                this.blackboard = this.$route.query.index;
            },
            goBack: function() {
                this.$router.go(-1);
            },
            // 点赞和取消点赞
            like: function() {
                if(this.isLiked === false) {
                    // 1为userID，需要获取
                    this.$http.post(server.url + '/blackboard/praise', this.blackboard, {params: {userID:1}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200){
                            this.likeLoading = true;
                            this.isLiked = true;
                            this.blackboard.praise_count++;
                            this.likeLoading = false;
                        }
                        else{
                            this.$message({type: 'error', message: '请重试'});
                        }
                    }, response => {
                        this.$message({type: 'error', message: '请重试'});
                    }).catch((response) => {
                        this.$message({type: 'error', message: '请重试'});
                    });
                }
                else {
                    // 1为userID，需要获取
                    this.$http.post(server.url + '/blackboard/praise/delete', this.blackboard, {params: {userID:1}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200){
                            this.likeLoading = true;
                            this.isLiked = false;
                            this.blackboard.praise_count--;
                            this.likeLoading = false;
                        }
                        else{
                            this.$message({type: 'error', message: '请重试'});
                        }
                    }, response => {
                        this.$message({type: 'error', message: '请重试'});
                    }).catch((response) => {
                        this.$message({type: 'error', message: '请重试'});
                    });
                }
            },
            // 收藏和取消收藏
            collect: function() {
                this.favoriteEntity.topic_id = this.blackboard.blackboard_id;
                var t = new Date();
                this.favoriteEntity.collection_time = t.format("yyyy-MM-dd HH:mm:ss");
                if (this.isCollected === false) {
                    this.$http.post(server.url + '/blackboard/collect', this.favoriteEntity, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200){
                            this.collectLoading = true;
                            this.isCollected = true;
                            this.collectLoading = false;
                        }
                        else{
                            this.$message({type: 'error', message: '请重试'});
                        }
                    }, response => {
                        this.$message({type: 'error', message: '请重试'});
                    }).catch((response) => {
                        this.$message({type: 'error', message: '请重试'});
                    });
                }
                else {
                    this.$http.post(server.url + '/blackboard/collect/delete', this.favoriteEntity, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200){
                            this.collectLoading = true;
                            this.isCollected = false;
                            this.collectLoading = false;
                        }
                        else{
                            this.$message({type: 'error', message: '请重试'});
                        }
                    }, response => {
                        this.$message({type: 'error', message: '请重试'});
                    }).catch((response) => {
                        this.$message({type: 'error', message: '请重试'});
                    });
                }
            },
            // 加载评论
            loadComments: function() {
                this.comments = [];
                this.replyImg = [];
                this.$http.get(server.url + '/blackboard/reply/get?TopicId=' + this.blackboard.blackboard_id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    if (response.status === 200) {
                        let commentList = JSON.parse(response.bodyText);
                        var i = 0;
                        while (i < commentList.data.length) {
                            this.comments.push({
                                ReplyId: commentList.data[i].ReplyId,
                                TopicId: commentList.data[i].TopicId,
                                UserId: commentList.data[i].UserId,
                                ReplyText: commentList.data[i].ReplyText,
                                ReplyDate: commentList.data[i].ReplyDate,
                                ClickingRate: commentList.data[i].ClickingRate,
                                PraiseCount: commentList.data[i].PraiseCount,
                                username: commentList.data[i].username
                            });
                            this.$http.get(server.url + '/user/image/get?userID=' + commentList.data[i].UserId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                                if (response.status === 200) {
                                    this.replyImg.push(JSON.parse(response.bodyText).data);
                                } else {
                                    this.$message({type: 'error', message: '头像加载失败!'});
                                }
                            }, (response) => {
                                this.$message({type: 'error', message: '头像加载失败!'});
                            }).catch((response) => {
                                this.$message({type: 'error', message: '头像加载失败!'});
                            });
                            i++;
                        }
                    } else {
                        this.$message({type: 'error', message: '评论加载失败!'});
                    }
                }, (response) => {
                    if (response.status === 403) {
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.$message({type: 'error', message: '评论加载失败!'});
                    }
                }).catch((response) => {
                    this.$message({type: 'error', message: '评论加载失败!'});
                })
            },
            // 评论
            postComment: function() {
                this.replyEntity.TopicId = this.blackboard.blackboard_id;
                this.replyEntity.ReplyText = this.commentText;
                var t = new Date();
                this.replyEntity.ReplyDate = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/blackboard/reply', this.replyEntity, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status === 200){
                        this.$message({type: 'success', message: '评论成功'});
                        this.commentLoading = true;
                        this.loadComments();
                        this.commentText = '';
                        this.commentLoading = false;
                    }
                    else{
                        this.$message({type: 'error', message: '请重试'});
                    }
                }, response => {
                    this.$message({type: 'error', message: '请重试'});
                }).catch((response) => {
                    this.$message({type: 'error', message: '请重试'});
                });
            },
            // 获取楼主头像
            getAuthorImg: function() {
                this.$http.get(server.url + '/user/image/get?userID=' + this.blackboard.user_id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    if (response.status === 200) {
                        this.authorImg = JSON.parse(response.bodyText).data;
                    } else {
                        this.$message({type: 'error', message: '头像加载失败!'});
                    }
                }, (response) => {
                    this.$message({type: 'error', message: '头像加载失败!'});
                }).catch((response) => {
                    this.$message({type: 'error', message: '头像加载失败!'});
                });
            },
            // 显示内容
            createNode: function(val) {
                const template = `<div class='child'>${val}</div>`;
                let tempNode = document.createElement('div');
                tempNode.innerHTML = template;
                return tempNode.firstChild;
            }
        },
        watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            '$route': 'getParams'
        }
    }
</script>

<style scoped>
    .img {
        width: 80px;
        height: 80px;
        border-radius: 10px;
    }
</style>
