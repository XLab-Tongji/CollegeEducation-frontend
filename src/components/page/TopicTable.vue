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
                <el-button type="primary" icon="el-icon-search" @click="searchClick" class="search-button" size="mini">搜索
                </el-button></div>
        </div>

        <div>
            <el-table
                ref="multipleTable"
                :data="articles"
                tooltip-effect="dark"
                class="topic-table"
                @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column
                    label="主题"
                    width="350" style="text-align: center">
                    <template slot-scope="scope">
                        <p style="font-size: 14px; font-weight: bold; color: #0A9894; padding-top: 7px;">{{ scope.row.topicTitle }}</p>
                        <p class="topic-content"> {{ scope.row.topicText}} </p>
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
            }
        },
        mounted: function () {
            var _this = this;
            this.loading = true;
            this.loadBlogs(1, this.pageSize);
        },
        methods: {
            searchClick(){
                this.loadBlogs(1, this.pageSize);
            },
            // 翻页
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.loading = true;
                this.loadBlogs(currentPage, this.pageSize);
            },
            // 加载文章
            loadBlogs: function (page, count) {
                this.articles = [];
                var url = '/article/all';
                var param = new URLSearchParams();
                // 未做搜索类别处理
                param.append('keywords', this.keywords);
                this.$http.get(server.url + url, param).then((response) => {
                    if (response.status == 200) {
                        var articleList = JSON.parse(response.bodyText);
                        this.totalCount = articleList.data.length;
                        var i = (page - 1) * count;
                        var j = (page * count < this.totalCount? page * count : this.totalCount);
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
                        this.loading = false;
                    } else {
                        this.$message({type: 'error', message: '数据加载失败!'});
                    }
                }, (response) => {
                    this.loading = false;
                    if (response.status == 403) {
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.$message({type: 'error', message: '数据加载失败!'});
                    }
                }).catch((response) => {
                    _this.loading = false;
                    this.$message({type: 'error', message: '数据加载失败!'});
                })
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
