<template>
    <div>
        <div>
            <div style="float: left">
                <el-input
                    placeholder="查找内容"
                    clearable="true"
                    prefix-icon="el-icon-search"
                    v-model="keywords"
                    style="width: 250px"
                    size="mini">
                </el-input>
                <el-select v-model="searchType" class="type-select" size="mini">
                    <el-option
                        v-for="item in searchOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="searchClick" class="search-button" size="mini">搜索</el-button>
            </div>
        </div>

        <div>
            <el-table
                ref="multipleTable"
                :data="articles"
                tooltip-effect="dark"
                class="topic-table"
                v-loading="loading">
                <el-table-column type="expand">
                    <template slot-scope="scope"><div>{{scope.row.topicText}}</div>
                        <el-row :gutter="20" type="flex" justify="center" style="margin-top: 15px;">
                            <el-col :span="2"><div><el-button type="primary" circle style="border-color: #fff; color: #1ac7c3; background-color: #fff;" @click="Collect(scope.$index)"><i class="fa fa-star fa-lg" aria-hidden="true" v-if="isCollected[scope.$index]"></i><i class="fa fa-star-o fa-lg" aria-hidden="true" v-else></i></el-button></div></el-col>
                            <el-col :span="2"><div><el-button type="primary" circle style="border-color: #fff; color: #1ac7c3; background-color: #fff;" @click="Like(scope.$index)"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true" v-if="isLiked[scope.$index]"></i><i class="fa fa-thumbs-o-up fa-lg" aria-hidden="true" v-else></i></el-button></div></el-col>
                        </el-row>
                        <el-collapse style="margin-top: 20px">
                            <el-collapse-item title="评论" name="1" style="text-align: center;color: #6A6A6A;font-size: 10px">
                                <div align="left">
                                    <el-table>

                                    </el-table>
                                    <el-input v-model="commentText" placeholder="输入评论"></el-input>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </template>
                </el-table-column>
                <el-table-column
                    label="主题"
                    width="350" style="text-align: center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goDetails" style="font-size: 14px; font-weight: bold; color: #0A9894; padding-top: 7px;">{{ scope.row.topicTitle }}</el-button>
                        <p class="topic-content"> {{ scope.row.topicText | filterHtml | htmlDecode}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="点击数"
                    align="center" width="100" min-width='200'>
                    <template slot-scope="scope"><span style="font-size: 13px; color: #6A6A6A">{{ scope.row.clickingRate}} </span></template>
                </el-table-column>
                <el-table-column
                    label="回复数"
                    align="center" width="100">
                    <template slot-scope="scope"><span style="font-size: 13px; color: #6A6A6A">{{ scope.row.replyCount}} </span></template>
                </el-table-column>
                <el-table-column
                    label="最新回复"
                    align="center">
                    <template slot-scope="scope">
                        <p style="font-size: 13px; color: #6A6A6A">id: {{ scope.row.userId}} </p>
                        <p style="font-size: 10px; color: #6A6A6A">{{ scope.row.topicDate.replace(/^([-\d]*)T([\d:]*)\..*$/, '$1 $2')}}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="float: right">
            <el-card class="tag-card" shadow="never">
                <div v-for="o in 4" :key="o">
                    {{'tag ' + o }}
                </div>
            </el-card>
        </div>
        <div>
            <div class="topic-table-footer">
                <el-pagination
                    small
                    :page-size="pageSize"
                    pager-count="11"
                    layout="prev, pager, next"
                    :total="totalCount"
                    class="page-change"
                    @current-change="currentChange" v-show="this.articles.length>0">
                </el-pagination>
            </div>
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
                loading: false, // 加载状态
                searchType: '1', // 搜索类型
                currentPage: 1, // 当前位于第几页
                totalCount: -1, // 文章总数
                pageSize: 3, // 每页显示多少文章
                keywords: '', // 搜索关键词
                clickId: -1,
                commentText: '',
                searchOptions: [{
                    value: '1',
                    label: '全部'
                }, {
                    value: '2',
                    label: '按标题'
                }, {
                    value: '3',
                    label: '按标签'
                }],
                isLiked: [],
                isCollected: []
            }
        },
        mounted: function () {
            this.loading = true;
            this.loadBlogs(1, this.pageSize);
            // 从后台加载
            for (var i = 0;i < this.pageSize; i++) {
                this.isLiked.push(false);
                this.isCollected.push(false);
            }
        },
        methods: {
            searchClick: function() {
                this.loadBlogs(1, this.pageSize);
            },
            // 翻页
            currentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.loading = true;
                this.loadBlogs(currentPage, this.pageSize);
            },
            // 加载文章
            loadBlogs: function (page, count) {
                this.articles = [];
                var url = '/article/all';
                var param = new URLSearchParams();
                // 搜索类别处理未完成
                switch (this.searchType) {
                    case '1': {
                        param.append('keywords', this.keywords);
                        break;
                    }
                    case '2': {
                        param.append('keywords', this.keywords);
                        break;
                    }
                    case '3': {
                        break;
                    }
                    default:
                        break;
                }
                this.$http.get(server.url + url + '?' + param, param).then((response) => {
                    this.loading = false;
                    if (response.status == 200) {
                        var articleList = JSON.parse(response.bodyText);
                        this.totalCount = articleList.data.length;
                        var i = (page - 1) * count;
                        var j = (page * count < this.totalCount ? page * count : this.totalCount);
                        while (i < j) {
                            this.articles.push({
                                userId: articleList.data[i].userId,
                                topicDate: articleList.data[i].topicDate,
                                replyCount: articleList.data[i].replyCount,
                                sectorId: articleList.data[i].sectorId,
                                topicId: articleList.data[i].topicId,
                                topicText: articleList.data[i].topicText,
                                topicTitle: articleList.data[i].topicTitle,
                                clickingRate: articleList.data[i].clickingRate,
                                sectorState: articleList.data[i].sectorState
                            });
                            i++;
                        }
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '数据加载失败!'});
                    }
                }, (response) => {
                    if (response.status == 403) {
                        this.loading = false;
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '数据加载失败!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '数据加载失败!'});
                })
            },
            Like: function(index) {
                // 与后台交互
                this.isLiked[index] = !this.isLiked[index];
            },
            Collect: function(index) {
                // 与后台交互
                this.isCollected[index] = !this.isCollected[index];
            },
            goDetails: function(index) {
                this.$router.push('/topic-details')
            }
        },
        filters:{
            filterHtml: function(val) {
                return val.replace(/<[^>]*>/g, "");//去除文字的<...></...>标签
            },
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
        }
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
        width: 80%;
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
        margin-top: 4px;
        padding-bottom: 7px;
    }

    .tag-card {
        width: 120px;
        margin-top: 0px;
        margin-right: 10px;
    }
</style>
