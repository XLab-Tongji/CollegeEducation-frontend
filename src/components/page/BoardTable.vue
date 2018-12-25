<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <!----- 搜索栏 ----->
        <div style="margin-top: 20px; margin-left: 160px">
            <!-- 输入搜索内容 -->
            <el-input
                placeholder="请输入关键字"
                clearable
                v-model="keywords"
                style="width: 250px"
                v-show="searchType !== 2">
            </el-input>
            <!-- 选择标签 -->
            <el-select
                v-model="sectorKeyword"
                multiple
                collapse-tags
                filterable
                placeholder="请输入关键字"
                style="width: 250px"
                v-show="searchType === 2">
                <el-option
                    v-for="item in sectors"
                    :key="item.SectorId"
                    :label="item.SectorName"
                    :value="item.SectorName">
                </el-option>
            </el-select>
            <!-- 选择搜索类型 -->
            <el-select value="" v-model="searchType" class="type-select">
                <el-option
                    v-for="item in searchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!-- 搜索键 -->
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <!----- 黑板报列表 ----->
        <div>
            <el-row type="flex" justify="center" :gutter="40" v-loading="loading">
               <el-col :span="9">
                   <el-card
                       v-for="item in blackboardsCol1"
                       :key="item.blackboard_id"
                       :label="item.blackboard_name"
                       :value="item.blackboard_id"
                       style="margin-top: 15px; width: 450px">
                       <div slot="header" style="height: 15px; font-size: 14px; font-weight: bold; padding-left: 1rem">
                           {{item.blackboard_name}}
                       </div>
                       <div class="card-body">
                           <div id="spy-example1" data-spy="scroll" data-target="#navbar-example1" data-offset="65" style="font-size: 13px;position: relative; height: 200px; overflow: auto; margin-top: .5rem; overflow-y: scroll;">
                               <div style="min-height: 110px">{{item.blackboard_text | imgEncode | sEncode | htmlDecode}}</div>
                               <div style="font-size: 12px; color: #6A6A6A">{{item.USERNAME}} </div>
                               <div style="font-size: 9px; color: #6A6A6A">发表于 {{item.blackboard_date}}</div>
                               <div style="font-size: 11px; color: #6A6A6A">分类：{{item.sectorName}} </div>
                               <div align="center" style="margin-top: 5px">
                                   <el-button type="text" style="color: #6A6A6A" @click="goDetails(item)"><i class="fa fa-commenting-o" aria-hidden="true" style="margin-right: 5px;"></i>评论</el-button>
                                   <el-button type="text" @click="collect(item)" v-loading="collectLoading" style="color: #6A6A6A; margin-left: 30px"><i  class="fa fa-star" v-show="item.is_collected" aria-hidden="true" style="margin-right: 5px;color: #FFE100"></i><i class="fa fa-star-o" v-show="!item.is_collected" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>收藏</el-button>
                                   <el-button type="text" @click="like(item)" v-loading="likeLoading" style="color: #6A6A6A; margin-left: 30px"><i class="fa fa-thumbs-o-up" v-show="item.is_praised" aria-hidden="true" style="margin-right: 5px;color: #FF7B00;"></i><i class="fa fa-thumbs-o-up" v-show="!item.is_praised" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>{{item.praise_count}}</el-button>
                               </div>
                           </div>
                       </div>
                   </el-card>
               </el-col>
               <el-col :span="9">
                   <el-card
                       v-for="item in blackboardsCol2"
                       :key="item.blackboard_id"
                       :label="item.blackboard_name"
                       :value="item.blackboard_id"
                       style="margin-top: 15px; width: 450px">
                       <div slot="header" class="clearfix" style="height: 15px; font-size: 14px; font-weight: bold; padding-left: 1rem">
                           {{item.blackboard_name}}
                       </div>
                       <div class="card-body">
                           <div id="spy-example2" data-spy="scroll" data-target="#navbar-example1" data-offset="65" style="font-size: 13px;position: relative; height: 200px; overflow: auto; margin-top: .5rem; overflow-y: scroll;">
                               <div style="min-height: 110px">{{item.blackboard_text | imgEncode | sEncode | htmlDecode}}</div>
                               <div style="font-size: 12px; color: #6A6A6A">{{item.USERNAME}} </div>
                               <div style="font-size: 9px; color: #6A6A6A">发表于 {{item.blackboard_date}}</div>
                               <div style="font-size: 11px; color: #6A6A6A">分类：{{item.sectorName}} </div>
                               <div align="center" style="margin-top: 5px">
                                   <el-button type="text" style="color: #6A6A6A" @click="goDetails(item)"><i class="fa fa-commenting-o" aria-hidden="true" style="margin-right: 5px;"></i>评论</el-button>
                                   <el-button type="text" @click="collect(item)" v-loading="collectLoading" style="color: #6A6A6A; margin-left: 30px"><i  class="fa fa-star" v-show="item.is_collected" aria-hidden="true" style="margin-right: 5px;color: #FFE100"></i><i class="fa fa-star-o" v-show="!item.is_collected" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>收藏</el-button>
                                   <el-button type="text" @click="like(item)" v-loading="likeLoading" style="color: #6A6A6A; margin-left: 30px"><i class="fa fa-thumbs-o-up" v-show="item.is_praised" aria-hidden="true" style="margin-right: 5px;color: #FF7B00;"></i><i class="fa fa-thumbs-o-up" v-show="!item.is_praised" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>{{item.praise_count}}</el-button>
                               </div>
                       </div>
                       </div>
                   </el-card>
               </el-col>
           </el-row>
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
                pageSize: 6, // 每页显示多少黑板报
                keywords: '', // 输入的关键词
                sectorKeyword: [], // 按标签和全部搜索关键词
                sectors: [], // 可选择的标签
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
                }],
                collectLoading: false, // 收藏状态改变
                likeLoading: false, // 点赞状态改变
                // 收藏实体
                favoriteEntity: {
                    topic_id: 0,
                    user_id: 1, // 需要获取
                    collection_time: new Date(),
                    type: 1
                }
            }
        },

        created: function () {
            this.loading = true;
            let page = Number(localStorage.getItem('pageB'));
            if (page <= 0) page = 1;
            this.currentChange(page);
            this.getSectors();
        },

        methods: {
            // 搜索
            search: function() {
                if(this.keywords === '' && this.sectorKeyword.length === 0) {
                    this.searchUrl = '/blackboard/get?userID=1&SectorId=1&keywords=';
                }
                else {
                    // 按标题
                    if (this.searchType === 1) {
                        this.searchUrl = '/blackboard/get?userID=1&SectorId=1&keywords=' + this.keywords;
                    }
                    // 按标签和全部
                    else {
                        if (this.keywords !== '') {
                            let k = this.keywords.trim().split(/\s+/);
                            for (var i = 0; i < k.length; i++) {
                                this.sectorKeyword.push(k[i]);
                            }
                        }
                        this.searchUrl = '/blackboard/get?userID=1&SectorId=' + this.searchType;
                        for (var i = 0; i < this.sectorKeyword.length; i++) {
                            this.searchUrl += '&SectorName=' + this.sectorKeyword[i];
                        }
                        this.sectorKeyword = [];
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
                                publish_id: blackboardList.data[i].publish_id,
                                publish_type_id: blackboardList.data[i].publish_type_id,
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
                                favourite_id: blackboardList.data[i].favourite_id,
                                USERNAME: blackboardList.data[i].USERNAME,
                                is_praised: false,
                                is_collected: false
                            });
                            if (blackboardList.data[i].praise_id !== -1) this.blackboards[i].is_praised = true;
                            if (blackboardList.data[i].favourite_id !== -1) this.blackboards[i].is_collected = true;
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
            // 获取标签
            getSectors: function() {
                this.$http.get(server.url + '/sector/get', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
                    if (response.status === 200) {
                        var sectorList = JSON.parse(response.bodyText);
                        var i = 0;
                        while (i < sectorList.length) {
                            this.sectors.push({
                                SectorId: sectorList.data[i].SectorId,
                                SectorName: sectorList.data[i].SectorName
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
            // 跳转至详情页面
            goDetails: function(val) {
                localStorage.setItem('pageB',JSON.stringify(this.currentPage));
                this.$router.push({
                    path: '/blackboard-details',
                    name: 'BoardDetails',
                    query: {
                        index: val
                    }
                })
            },
            // 点赞和取消点赞
            like: function(val) {
                if(val.is_praised === false) {
                    // 1为userID，需要获取
                    this.$http.post(server.url + '/blackboard/praise', val, {params: {userID:1}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200){
                            this.likeLoading = true;
                            val.is_praised = true;
                            val.praise_count++;
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
                    this.$http.post(server.url + '/blackboard/praise/delete', val, {params: {userID:1}, headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200){
                            this.likeLoading = true;
                            val.is_praised = false;
                            val.praise_count--;
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
            collect: function(val) {
                this.favoriteEntity.topic_id = val.blackboard_id;
                var t = new Date();
                this.favoriteEntity.collection_time = t.format("yyyy-MM-dd HH:mm:ss");
                if (val.is_collected === false) {
                    this.$http.post(server.url + '/blackboard/collect', this.favoriteEntity, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                        if (response.status === 200){
                            this.collectLoading = true;
                            val.is_collected = true;
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
                            val.is_collected = false;
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
        },

        filters:{
            // 将图片转换成文字显示
            imgEncode: function(val) {
                if(val !== null) return val.replace(/<img src="http:\/\/tjce-image(.*?)>/g, "[图片]")
            },
            // 将表情转换成文字显示
            sEncode: function(val) {
                if(val !== null) return val.replace(/<img(.*?)>/g, "[表情]")
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
        computed: {
            blackboardsCol1: function () {
                var result = [];
                if (this.blackboards.length >= 1) {
                    result.push(this.blackboards[0]);
                }
                if (this.blackboards.length >= 3) {
                    result.push(this.blackboards[2]);
                }
                if (this.blackboards.length >= 5) {
                    result.push(this.blackboards[4]);
                }
                return result;
            },

            blackboardsCol2: function () {
                var result = [];
                if (this.blackboards.length >= 2) {
                    result.push(this.blackboards[1]);
                }
                if (this.blackboards.length >= 4) {
                    result.push(this.blackboards[3]);
                }
                if (this.blackboards.length === 6) {
                    result.push(this.blackboards[5]);
                }
                return result;
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


    .navbar-light .navbar-text a {
        color: rgba(0, 0, 0, 0.9);
    }

    .navbar-light .navbar-text a:hover, .navbar-light .navbar-text a:focus {
        color: rgba(0, 0, 0, 0.9);
    }

    .card-body {
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        padding: 1.25rem;
    }

</style>
