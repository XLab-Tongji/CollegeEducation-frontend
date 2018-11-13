<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <!----- 搜索栏 ----->
        <div>
            <!-- 输入搜索内容 -->
            <el-input
                placeholder="查找内容"
                clearable="true"
                prefix-icon="el-icon-search"
                v-model="keywords"
                style="width: 250px"
                size="mini">
            </el-input>
            <!-- 选择搜索类型 -->
            <el-select value="" v-model="searchType" class="type-select" size="mini">
                <el-option
                    v-for="item in searchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!-- 搜索键 -->
            <el-button type="primary" icon="el-icon-search" @click="search" class="search-button" size="mini">搜索</el-button>
            <!-- 选择标签 -->
            <div style="float: right" v-show="searchType !== 1">
                <el-checkbox v-model="tagKeyword" label="计算机软件及计算机应用" border size="mini" @change="search"></el-checkbox>
                <el-checkbox v-model="tagKeyword" label="互联网技术" border size="mini" @change="search"></el-checkbox>
                <el-checkbox v-model="tagKeyword" label="电信技术" border size="mini" @change="search"></el-checkbox>
            </div>
        </div>

        <!----- 话题列表 ----->
        <div>
            <el-table
                ref="multipleTable"
                :data="articles"
                tooltip-effect="dark"
                class="topic-table"
                v-loading="loading">
                <!-- 可展开的话题详情 -->
                <el-table-column type="expand">
                    <template slot-scope="scope"><div>{{scope.row.TopicText}}</div>
                        <!-- 收藏/评论/点赞按键 -->
                        <el-row style="margin-top: 15px;">
                            <el-col :span="8"><div align="center"><el-button type="text" style="color: #1ac7c3;" @click="collect(scope.$index)" v-loading="collectLoading"><i class="fa fa-star fa-lg" v-show="isCollected[scope.$index]" aria-hidden="true" style="margin-right: 5px;"></i><i class="fa fa-star-o fa-lg" v-show="!isCollected[scope.$index]" aria-hidden="true" style="margin-right: 5px;"></i>收藏</el-button></div></el-col>
                            <el-col :span="8"><div align="center"><el-button type="text" style="color: #1ac7c3;" @click="showComments(scope.$index)"><i class="fa fa-list-ul fa-lg" aria-hidden="true" style="margin-right: 5px;"></i>评论</el-button></div></el-col>
                            <el-col :span="8"><div align="center"><el-button type="text" style="color: #1ac7c3;" @click="like(scope.$index)" v-loading="likeLoading"><i class="fa fa-thumbs-up fa-lg" v-show="isLiked[scope.$index]" aria-hidden="true" style="margin-right: 5px;"></i><i class="fa fa-thumbs-o-up fa-lg" v-show="!isLiked[scope.$index]" aria-hidden="true" style="margin-right: 5px;"></i>点赞</el-button></div></el-col>
                        </el-row>
                        <!-- 评论列表 -->
                        <div v-show="isShowComments[scope.$index]" style="margin: 0 auto">
                            <el-table :data="commentsAt[scope.$index]" v-loading="commentLoading" style="margin-top: 20px; border: 2px" :default-sort="{prop: 'ReplyDate', order: 'ascending'}">
                                <el-table-column label="评论内容" style="color: #6A6A6A">
                                    <template slot-scope="scope">
                                        <p style="font-size: 12px">{{scope.row.UserId}}：{{scope.row.ReplyText}}</p>
                                        <p style="font-size: 8px">{{scope.row.ReplyDate}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="按时间" width="100px" style="font-size: 10px; color: #6A6A6A" align="right" sortable prop="ReplyDate">
                                    <template slot-scope="scope">
                                    </template>
                                </el-table-column>
                                <el-table-column label="按人气" width="100px" style="font-size: 8px; color: #6A6A6A" align="center" sortable prop="PraiseCount">
                                    <template slot-scope="scope">
                                        <div style="height: 20px"></div>
                                        <span><el-button type="text" style="color: #6A6A6A">回复</el-button></span>
                                        <span style="margin-left: 10px"><i class="fa fa-thumbs-o-up" aria-hidden="true" style="margin-right: 5px;"></i>{{scope.row.PraiseCount}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 发表评论 -->
                            <el-row gutter="50" style="margin-top: 10px">
                                <el-col :span="22"><el-input v-model="commentText" placeholder="输入评论" maxlength="150" autosize></el-input></el-col>
                                <el-col :span="2"><el-button type="primary" @click="postComment(scope.$index)" style="background-color: #1ac7c3; border-color: #1ac7c3;">发表</el-button></el-col>
                            </el-row>
                        </div>
                    </template>
                </el-table-column>
                <!-- 主题 -->
                <el-table-column
                    label="主题"
                    width="500" style="text-align: center">
                    <template slot-scope="scope">
                        <p class="margin-top: 10px;"><el-button type="text" @click="goDetails(scope.$index)" style="font-size: 14px; font-weight: bold; color: #0A9894">{{ scope.row.TopicTitle }}</el-button></p>
                        <p class="topic-content"> {{scope.row.TopicText | filterHtml | htmlDecode}}</p>
                    </template>
                </el-table-column>
                <!-- 作者 -->
                <el-table-column
                    label="作者"
                    align="center">
                    <template slot-scope="scope">
                        <p style="font-size: 12px; color: #6A6A6A">id: {{scope.row.UserId}} </p>
                        <p style="font-size: 9px; color: #6A6A6A">发表于 {{scope.row.TopicDate}}</p>
                    </template>
                </el-table-column>
                <!-- 标签 -->
                <el-table-column
                    label="标签"
                    align="center">
                    <template slot-scope="scope">
                        <p style="font-size: 11px; color: #6A6A6A">{{scope.row.sectorName}} </p>
                    </template>
                </el-table-column>
                <!-- 回复 -->
                <el-table-column
                    label="回复"
                    align="center" width="100">
                    <template slot-scope="scope"><span style="font-size: 10px; color: #6A6A6A">{{scope.row.ReplyCount}} </span></template>
                </el-table-column>
                <!-- 点赞数 -->
                <el-table-column
                    label="点赞"
                    align="center" width="100">
                    <template slot-scope="scope"><span style="font-size: 10px; color: #6A6A6A">{{scope.row.PraiseCount}} </span></template>
                </el-table-column>
                <!-- 点击数 -->
                <el-table-column
                label="阅读"
                align="center" width="100">
                <template slot-scope="scope"><span style="font-size: 10px; color: #6A6A6A">{{scope.row.ClickingRate}} </span></template>
            </el-table-column>

            </el-table>
        </div>

        <!----- 翻页 ----->
        <div class="topic-table-footer" align="center">
            <el-pagination
                small
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="totalCount"
                class="page-change"
                :current-page="currentPage"
                @current-change="currentChange" v-show="articles.length > 0">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import server from '../../../config/index';
    import axios from 'axios'
    export default{
        data() {
            return {
                articles: [], // 存储文章信息
                comments: [], // 存储评论信息
                commentsAt: [], // 读取指定文章的评论
                loading: false, // 文章加载状态
                collectLoading: false, // 收藏状态改变
                commentLoading: false, // 评论加载状态
                likeLoading: false, // 点赞状态改变
                searchType: 0, // 搜索类型
                currentPage: 1, // 当前位于第几页
                totalCount: -1, // 文章总数
                pageSize: 5, // 每页显示多少文章
                keywords: '', // 输入的关键词
                titleKeyword: '', // 按标题搜索关键词
                sectorKeyword: [], // 按标签和全部搜索关键词
                tagKeyword: [], // 选择的标签关键词
                commentText: '', // 发表评论内容
                searchUrl: '/article/all?userID=1&SectorId=1&keywords=',
                // 搜索类型
                searchOptions: [{
                    value: 0,
                    label: '全部'
                }, {
                    value: 1,
                    label: '按标题'
                }, {
                    value: 2,
                    label: '按标签'
                }],
                isLiked: [], // 点赞状态
                isCollected: [], // 收藏状态
                isShowComments: [], //显示评论
                // 收藏实体
                favoriteEntity: {
                    topic_id: 0,
                    user_id: 1, // 需要获取
                    collection_time: new Date()
                },
                // 评论实体
                replyEntity: {
                    TopicId: -1,
                    UserId: 1, // 需要获取
                    ReplyText: '',
                    ReplyDate: new Date(),
                    ClickingRate: 0,
                    PraiseCount: 0
                }
            }
        },

        mounted: function () {
            this.commentsAt = new Array(this.pageSize);
            this.loading = true;
            this.loadBlogs(1, this.pageSize);
            for(var i = 0;i < this.pageSize;i++) {
                this.isShowComments.push(false);
                this.commentsAt[i] = [];
            }
        },

        methods: {
            // 搜索
            search: function() {
                if(this.keywords === '' && this.tagKeyword.length === 0) {
                    this.searchUrl = '/article/all?userID=1&SectorId=1&keywords=';
                }
                else {
                    // 按标题
                    if (this.searchType === 1) {
                        this.titleKeyword = this.keywords;
                        this.searchUrl = '/article/all?userID=1&SectorId=1&keywords=' + this.titleKeyword;
                    }
                    // 按标签和全部
                    else {
                        this.sectorKeyword = [];
                        for (var i = 0; i < this.tagKeyword.length; i++) {
                            this.sectorKeyword.push(this.tagKeyword[i]);
                        }
                        if(this.keywords !== '') {
                            let k = this.keywords.trim().split(/\s+/);
                            for (var i = 0; i < k.length; i++) {
                                this.sectorKeyword.push(k[i]);
                            }
                        }
                        this.searchUrl = '/article/all?userID=1&SectorId=' + this.searchType;
                        for(var i = 0; i < this.sectorKeyword.length;i++){
                            this.searchUrl += '&SectorName=' + this.sectorKeyword[i];
                        }
                    }
                }
                this.currentChange(1);
            },
            // 翻页
            currentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.loading = true;
                for(var i = 0;i < this.pageSize;i++) {
                    this.isShowComments[i] = false;
                    this.commentsAt[i] = [];
                }
                this.loadBlogs(currentPage, this.pageSize);

            },
            // 加载文章
            loadBlogs: function (page, count) {
                this.articles = [];
                this.isLiked = [];
                this.isCollected = [];
                this.$http.get(server.url + this.searchUrl).then((response) => {
                    this.loading = false;
                    if (response.status === 200) {
                        var articleList = JSON.parse(response.bodyText);
                        this.totalCount = articleList.data.length;
                        var i = (page - 1) * count;
                        var j = (page * count < this.totalCount ? page * count : this.totalCount);
                        while (i < j) {
                            this.articles.push({
                                UserId: articleList.data[i].UserId,
                                TopicDate: articleList.data[i].TopicDate,
                                ReplyCount: articleList.data[i].ReplyCount,
                                TopicId: articleList.data[i].TopicId,
                                TopicText: articleList.data[i].TopicText,
                                TopicTitle: articleList.data[i].TopicTitle,
                                ClickingRate: articleList.data[i].ClickingRate,
                                PraiseCount: articleList.data[i].PraiseCount,
                                sectorName: articleList.data[i].sectorName,
                                sectorState: articleList.data[i].sectorState,
                                praise_id: articleList.data[i].praise_id,
                                favorite_id: articleList.data[i].favorite_id
                            });
                            if(articleList.data[i].praise_id === -1) this.isLiked.push(false);
                            else this.isLiked.push(true);
                            if(articleList.data[i].favorite_id === -1) this.isCollected.push(false);
                            else this.isCollected.push(true);
                            i++;
                        }
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '文章加载失败!'});
                    }
                }, (response) => {
                    if (response.status === 403) {
                        this.loading = false;
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '文章加载失败!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '文章加载失败!'});
                })
            },
            // 点赞和取消点赞
            like: function(index) {
                if(this.isLiked[index] === false) {
                    // 1为userID，需要获取
                    this.$http.post(server.url + '/article/like', this.articles[index], {params:{userID:1}}).then(response => {
                        if (response.status === 200){
                            this.likeLoading = true;
                            this.isLiked[index] = true;
                            this.likeLoading = false;
                            alert(this.articles[index].praise_id);
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
                    this.$http.post(server.url + '/article/like/delete', this.articles[index], {params:{userID:1}}).then(response => {
                        if (response.status === 200){
                            this.likeLoading = true;
                            this.isLiked[index] = false;
                            this.likeLoading = false;
                            alert(this.articles[index].praise_id);
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
            // 收藏
            collect: function(index) {
                this.favoriteEntity.topic_id = this.articles[index].TopicId;
                var t = new Date();
                this.favoriteEntity.collection_time = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/article/collect', this.favoriteEntity).then(response => {
                    if (response.status === 200){
                        this.collectLoading = true;
                        this.isCollected[index] = !this.isCollected[index];
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
            },
            // 显示评论
            showComments: function(index) {
                this.commentLoading = true;
                this.isShowComments[index] = !this.isShowComments[index];
                if(this.isShowComments[index] === true) {
                    this.loadComments(index);
                    this.commentsAt[index] = this.comments;
                }
                else this.commentsAt[index] = [];
                this.commentLoading = false;
            },
            // 加载评论
            loadComments: function(index) {
                this.comments = [];
                this.$http.get(server.url + '/article/reply/get?TopicId=' + this.articles[index].TopicId).then((response) => {
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
                                PraiseCount: commentList.data[i].PraiseCount
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
            postComment: function(index) {
                this.replyEntity.TopicId = this.articles[index].TopicId;
                this.replyEntity.ReplyText = this.commentText;
                var t = new Date();
                this.replyEntity.ReplyDate = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/article/reply', this.replyEntity).then(response => {
                    if (response.status === 200){
                        this.$message({type: 'success', message: '评论成功'});
                        this.commentLoading = true;
                        this.loadComments(index);
                        this.commentsAt[index] = this.comments;
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
            // 跳转至详情页面
            goDetails: function(index) {
                this.$router.push({
                    //path: '/topic-details',
                    name: 'TopicDetails',
                    params: {
                        topicID: index
                    }
                })
            }
        },

        filters:{
            // 去除文字的html标签
            filterHtml: function(val) {
                return val.replace(/<[^>]*>/g, "");//去除文字的<...></...>标签
            },
            // 显示emoji
            htmlDecode: function(val) {
                //1.首先动态创建一个容器标签元素，如DIV
                var temp = document.createElement("div");
                //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
                temp.innerHTML = val;
                //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
                var output = temp.innerText || temp.textContent;
                temp = null;
                return output;
            }
        },
    }
</script>

<style type="text/css">
    .topic-table-footer {
        box-sizing: content-box;
        margin-top: 20px;
    }

    .page-change {
        color: #939393;
    }

    .type-select {
        width: 100px;
        margin-left: 10px;
    }

    .search-button {
        margin-left: 10px;
        background-color: #1ac7c3;
        border-color: #1ac7c3;
    }

    .topic-table {
        overflow-x: hidden;
        overflow-y: hidden;
        padding-top: 10px;
    }

    .topic-content {
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        font-size: 12px;
        color: #B0B0B0;
        padding-bottom: 8px;
    }

</style>
