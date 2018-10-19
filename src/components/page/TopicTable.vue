<template>
    <div>
        <div>
            <div style="float: left">
                <el-input
                    placeholder="查找内容"
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

        <div style="padding-top: 20px">
            <el-table
                ref="multipleTable"
                :data="articles"
                stripe
                tooltip-effect="dark"
                class="topic-table"
                @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column
                    label="主题"
                    align="left"
                    width="350">
                    <template>
                        <p style="font-size: 15px; font-weight: bold; color: #0A9894;cursor: pointer">{{ articles._topicTitle }}</p>
                        <p style="font-size: 12px; color: #282828">作者： {{ articles._userId}} </p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="点击数"
                    align="left" width="100">
                    <p style="font-size: 12px">{{ articles._clickingRate}} </p>
                </el-table-column>
                <el-table-column
                    label="回复数"
                    align="left" width="100">
                    <template>
                        <p style="font-size: 12px">{{ articles._replyCount}} </p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="最新回复"
                    align="left">
                    <template>
                        <p style="font-size: 12px">{{ articles._userId}} </p>
                        <p style="font-size: 10px">{{ articles._topicDate | formatDateTime}}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <div class="topic-table-footer">
                <el-pagination
                    small
                    :page-size="pageSize"
                    pager-count="11"
                    layout="prev, pager, next"
                    :total="totalCount"
                    style="color: #939393"
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
                articles: [],
                selItems: [],
                loading: false,
                searchType: '1',
                currentPage: 1,
                totalCount: -1,
                pageSize: 2,
                keywords: '',
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
            //翻页
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.loading = true;
                this.loadBlogs(currentPage, this.pageSize);
            },
            loadBlogs(page, count){
                var _this = this;
                this.$http.get(server.url + '/article/all').then(response => {
                    _this.$message({type: 'error', message: '数据加载1'});
                    //console.log(response)
                    _this.loading = false;
                    if(response.status == 200){
                        _this.$message({type: 'error', message: '数据加载1'});
                        var i = (page - 1) * count;
                        var articleList = JSON.parse(response.data);
                        while(i < count){
                            this.articles.push({
                                _userId: articleList.data[i].userId,
                                _topicDate: articleList.data[i].topicDate,
                                _replyCount: articleList.data[i].replyCount,
                                _sectorId:articleList.data[i].sectorId,
                                _topicId: articleList.data[i].topicId,
                                _topicText: articleList.data[i].topicText,
                                _topicTitle: articleList.data[i].topicTitle,
                                _clickingRate: articleList.data[i].clickingRate,
                                _sectorState: articleList.data[i].sectorState
                            });
                            _this.$message({type: 'error', message: '数据加载2'});
                            i++;
                        }
                    }else {
                        _this.$message({type: 'error', message: '数据加载失败!'});
                    }
                }, response=> {
                    _this.loading = false;
                    if (response.status == 403) {
                        _this.$message({type: 'error', message: resp.response.data});
                    } else {
                        _this.$message({type: 'error', message: '403 not found!'});
                    }
                }).catch(response=> {
                    _this.loading = false;
                    _this.$message({type: 'error', message: '找不到服务器!'});
                })
            },
            handleSelectionChange(val) {
                this.selItems = val;
            },
            handleEdit(index, row) {
                this.$router.push({path: '/editBlog', query: {from: this.activeName,id:row.id}});
            },
        },
        props: ['state', 'showEdit', 'showDelete', 'activeName']
    }
</script>

<style type="text/css">
    .topic_table-footer {
        box-sizing: content-box;
        margin-top: 20px;
        text-emphasis-color: #1ac7c3;
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
    }
</style>
