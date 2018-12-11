<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">

        <!----- 话题列表 ----->
        <div>
            <el-card style="margin-top: 20px">
                <!----- 搜索栏 ----->
                <div>
                    <!-- 输入搜索内容 -->
                    <el-input
                        placeholder="请输入关键字"
                        clearable
                        v-model="keywords"
                        style="width: 250px"
                        v-show="searchType !== 2"
                        size="mini">
                    </el-input>
                    <!-- 选择标签 -->
                    <el-select
                        v-model="sectorKeyword"
                        multiple
                        collapse-tags
                        filterable
                        placeholder="请输入关键字"
                        style="width: 250px"
                        v-show="searchType === 2"
                        size="mini">
                        <el-option
                            v-for="item in sectors"
                            :key="item.SectorId"
                            :label="item.SectorName"
                            :value="item.SectorName">
                        </el-option>
                    </el-select>
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
                </div>
                <el-table
                    ref="multipleTable"
                    :data="articles"
                    tooltip-effect="dark"
                    class="topic-table"
                    v-loading="loading">
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
                            <p style="font-size: 12px; color: #6A6A6A">{{scope.row.USERNAME}} </p>
                            <p style="font-size: 9px; color: #6A6A6A">发表于 {{scope.row.TopicDate}}</p>
                        </template>
                    </el-table-column>
                    <!-- 标签 -->
                    <el-table-column
                        label="分类"
                        align="center">
                        <template slot-scope="scope">
                            <p style="font-size: 11px; color: #6A6A6A" v-for="s in scope.row.sectorName">{{s}} </p>
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
                <!----- 翻页 ----->
                <div class="topic-table-footer" align="center">
                    <el-pagination
                        small
                        :page-size="pageSize"
                        layout="prev, pager, next"
                        :total="totalCount"
                        class="page-change"
                        :current-page.sync="currentPage"
                        @current-change="currentChange(currentPage)"
                        v-show="articles.length > 0"
                        v-loading="loading">
                    </el-pagination>
                </div>
            </el-card>
        </div>

    </div>
</template>

<script>
    import server from '../../../config/index';

    export default{
        data() {
            return {
                articles: [], // 存储文章信息
                loading: false, // 文章加载状态
                searchType: 0, // 搜索类型
                currentPage: 0, // 当前位于第几页
                historyPage: 0, // 转换前位于第几页
                totalCount: -1, // 文章总数
                pageSize: 5, // 每页显示多少文章
                keywords: '', // 输入的关键词
                sectorKeyword: [], // 按标签和全部搜索关键词
                sectors: [], // 可选择的标签关键词
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
                }]
            }
        },
        created: function() {
            this.loading = true;
            let page = Number(localStorage.getItem('pageT'));
            if (page <= 0) page = 1;
            this.currentChange(page);
            this.getSectors();
        },

        methods: {
            // 搜索
            search: function() {
                if(this.keywords === '' && this.sectorKeyword.length === 0) {
                    this.searchUrl = '/article/all?userID=1&SectorId=1&keywords=';
                }
                else {
                    // 按标题
                    if (this.searchType === 1) {
                        this.searchUrl = '/article/all?userID=1&SectorId=1&keywords=' + this.keywords;
                    }
                    // 按标签和全部
                    else {
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
                        this.sectorKeyword = [];
                    }
                }
                this.currentChange(1);
            },
            // 翻页
            // 页面跳转有问题
            currentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.loading = true;
                this.loadBlogs(this.currentPage, this.pageSize);
            },
            // 加载文章
            loadBlogs: function (page, count) {
                this.articles = [];
                this.$http.get(server.url + this.searchUrl, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    this.loading = false;
                    if (response.status === 200) {
                        var articleList = JSON.parse(response.bodyText);
                        this.totalCount = articleList.data.length;
                        var i = (page - 1) * count;
                        var j = (page * count < this.totalCount ? page * count : this.totalCount);
                        while (i < j) {
                            this.articles.push({
                                publish_id: articleList.data[i].publish_id,
                                publish_type_id: articleList.data[i].publish_type_id,
                                sector_use_id: articleList.data[i].sector_use_id,
                                UserId: articleList.data[i].UserId,
                                TopicDate: articleList.data[i].TopicDate,
                                ReplyCount: articleList.data[i].ReplyCount,
                                TopicId: articleList.data[i].TopicId,
                                TopicText: articleList.data[i].TopicText,
                                TopicTitle: articleList.data[i].TopicTitle,
                                ClickingRate: articleList.data[i].ClickingRate,
                                PraiseCount: articleList.data[i].PraiseCount,
                                favorite_count: articleList.data[i].favorite_count,
                                sectorName: articleList.data[i].sectorName,
                                sectorState: articleList.data[i].sectorState,
                                praise_id: articleList.data[i].praise_id,
                                favourite_id: articleList.data[i].favourite_id,
                                USERNAME: articleList.data[i].USERNAME
                            });
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
            // 获取标签
            getSectors: function() {
                if (this.sectors.length === 0) {
                    this.$http.get(server.url + '/sector/get', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                        if (response.status === 200) {
                            var sectorList = JSON.parse(response.bodyText);
                            var i = 0;
                            while (i < sectorList.data.length) {
                                this.sectors.push({
                                    SectorId: sectorList.data[i].SectorId,
                                    SectorName: sectorList.data[i].SectorName
                                });
                                i++;
                            }
                        } else {
                            this.$message({type: 'error', message: '加载失败!'});
                        }
                    }, (response) => {
                        if (response.status === 403) {
                            this.$message({type: 'error', message: response.response.data});
                        } else {
                            this.$message({type: 'error', message: '加载失败!'});
                        }
                    }).catch((response) => {
                        this.$message({type: 'error', message: '加载失败!'});
                    })
                }
            },
            // 跳转至详情页面
            goDetails: function(index) {
                localStorage.setItem('pageT',JSON.stringify(this.currentPage));
                this.$http.post(server.url + '/article/browse', this.articles[index], {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => { }, response => {
                    this.$message({type: 'error', message: '加载错误'});
                }).catch((response) => {
                    this.$message({type: 'error', message: '加载错误'});
                });
                this.$router.push({
                    path: '/topic-details',
                    name: 'TopicDetails',
                    query: {
                        index: this.articles[index]
                    }
                })
            }
        },

        filters:{
            // 将图片转换成文字显示
            filterHtml: function(val) {
                return val.replace(/<img(.*?)>/g, "[图片]")
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
        margin-top: 10px;
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
