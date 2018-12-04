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
                    <div style="float: right" v-show="searchType === 2">
                        <el-checkbox v-model="tagKeyword" label="计算机软件及计算机应用" border size="mini" @change="search"></el-checkbox>
                        <el-checkbox v-model="tagKeyword" label="互联网技术" border size="mini" @change="search"></el-checkbox>
                        <el-checkbox v-model="tagKeyword" label="电信技术" border size="mini" @change="search"></el-checkbox>
                    </div>
                </div>
                <el-table
                    ref="multipleTable"
                    :data="blackboards"
                    tooltip-effect="dark"
                    class="topic-table"
                    v-loading="loading">
                    <!-- 主题 -->
                    <el-table-column
                        label="主题"
                        width="500" style="text-align: center">
                        <template slot-scope="scope">
                            <p class="margin-top: 10px;"><el-button type="text" @click="goDetails(scope.$index)" style="font-size: 14px; font-weight: bold; color: #0A9894">{{ scope.row.blackboard_name }}</el-button></p>
                            <p class="topic-content"> {{scope.row.blackboard_text | filterHtml | htmlDecode}}</p>
                        </template>
                    </el-table-column>
                    <!-- 作者 -->
                    <el-table-column
                        label="作者"
                        align="center">
                        <template slot-scope="scope">
                            <p style="font-size: 12px; color: #6A6A6A">id: {{scope.row.user_id}} </p>
                            <p style="font-size: 9px; color: #6A6A6A">发表于 {{scope.row.blackboard_date}}</p>
                        </template>
                    </el-table-column>
                    <!-- 标签 -->
                    <el-table-column
                        label="分类"
                        align="center">
                        <template slot-scope="scope">
                            <p style="font-size: 11px; color: #6A6A6A">{{scope.row.sectorName}} </p>
                        </template>
                    </el-table-column>
                    <!-- 回复 -->
                    <el-table-column
                        label="回复"
                        align="center" width="100">
                        <template slot-scope="scope"><span style="font-size: 10px; color: #6A6A6A">{{scope.row.reply_count}} </span></template>
                    </el-table-column>
                    <!-- 点赞数 -->
                    <el-table-column
                        label="点赞"
                        align="center" width="100">
                        <template slot-scope="scope"><span style="font-size: 10px; color: #6A6A6A">{{scope.row.praise_count}} </span></template>
                    </el-table-column>
                    <!-- 点击数 -->
                    <el-table-column
                        label="阅读"
                        align="center" width="100">
                        <template slot-scope="scope"><span style="font-size: 10px; color: #6A6A6A">{{scope.row.clicking_rate}} </span></template>
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
                        :current-page="currentPage"
                        @current-change="currentChange" v-show="blackboards.length > 0">
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
                blackboards: [], // 存储黑板报信息
                loading: false, // 黑板报加载状态
                searchType: 0, // 搜索类型
                currentPage: 1, // 当前位于第几页
                totalCount: -1, // 黑板报总数
                pageSize: 5, // 每页显示多少黑板报
                keywords: '', // 输入的关键词
                titleKeyword: '', // 按标题搜索关键词
                sectorKeyword: [], // 按标签和全部搜索关键词
                tagKeyword: [], // 选择的标签关键词
                searchUrl: '/blackboard/get?userID=1&SectorId=1&keywords=',
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

        mounted: function () {
            this.loading = true;
            this.loadBlackboards(1, this.pageSize);
        },

        methods: {
            // 搜索
            search: function() {
                if(this.keywords === '' && this.tagKeyword.length === 0) {
                    this.searchUrl = '/blackboard/get?userID=1&SectorId=1&keywords=';
                }
                else {
                    // 按标题
                    if (this.searchType === 1) {
                        this.titleKeyword = this.keywords;
                        this.searchUrl = '/blackboard/get?userID=1&SectorId=1&keywords=' + this.titleKeyword;
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
                        this.searchUrl = '/blackboard/get?userID=1&SectorId=' + this.searchType;
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
                this.loadBlackboards(currentPage, this.pageSize);

            },
            // 加载黑板报
            loadBlackboards: function (page, count) {
                this.blackboards = [];
                this.$http.get(server.url + this.searchUrl, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    this.loading = false;
                    if (response.status === 200) {
                        var blackboardList = JSON.parse(response.bodyText);
                        this.totalCount = blackboardList.data.length;
                        var i = (page - 1) * count;
                        var j = (page * count < this.totalCount ? page * count : this.totalCount);
                        while (i < j) {
                            this.blackboards.push({
                                blackboard_id: blackboardList.data[i].blackboard_id,
                                user_id: blackboardList.data[i].user_id,
                                sector_id: blackboardList.data[i].sector_id,
                                blackboard_name: blackboardList.data[i].blackboard_name,
                                blackboard_text: blackboardList.data[i].blackboard_text,
                                blackboard_date: blackboardList.data[i].blackboard_date,
                                reply_count: blackboardList.data[i].reply_count,
                                clicking_rate: blackboardList.data[i].clicking_rate,
                                praise_count: blackboardList.data[i].praise_count,
                                favorite_count: blackboardList.data[i].favorite_count,
                                sectorName: blackboardList.data[i].sectorName,
                                praise_id: blackboardList.data[i].praise_id,
                                favourite_id: blackboardList.data[i].favourite_id
                            });
                            i++;
                        }
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '黑板报加载失败!'});
                    }
                }, (response) => {
                    if (response.status === 403) {
                        this.loading = false;
                        this.$message({type: 'error', message: response.response.data});
                    } else {
                        this.loading = false;
                        this.$message({type: 'error', message: '黑板报加载失败!'});
                    }
                }).catch((response) => {
                    this.loading = false;
                    this.$message({type: 'error', message: '黑板报加载失败!'});
                })
            },
            // 跳转至详情页面
            goDetails: function(index) {
                this.$router.push({
                    path: '/blackboard-details',
                    name: 'BoardDetails',
                    query: {
                        blackboard: this.blackboards[index]
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
