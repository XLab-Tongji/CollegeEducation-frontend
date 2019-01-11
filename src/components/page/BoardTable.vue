<template>
    <div>
        <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="../../../node_modules/wangeditor/release/wangEditor.min.css">
        <!----- 搜索栏 ----->
        <div style="margin-top: 20px; margin-left: 170px">
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
                               <div style="min-height: 110px">
                                   <div :id="item.blackboard_id"></div>
                               </div>
                               <div style="font-size: 12px; color: #6A6A6A">{{item.USERNAME}} </div>
                               <div style="font-size: 9px; color: #6A6A6A">发表于 {{item.blackboard_date}}</div>
                               <div style="font-size: 11px; color: #6A6A6A">分类：{{item.sectorName}} </div>
                               <div align="center" style="margin-top: 5px">
                                   <el-button type="text" style="color: #6A6A6A" @click="loadComments(item.blackboard_id)"><i class="fa fa-commenting-o" aria-hidden="true" style="margin-right: 5px;"></i>评论</el-button>
                                   <el-button type="text" @click="collect(item)" v-loading="collectLoading" style="color: #6A6A6A; margin-left: 30px"><i  class="fa fa-star" v-show="item.is_collected" aria-hidden="true" style="margin-right: 5px;color: #FFE100"></i><i class="fa fa-star-o" v-show="!item.is_collected" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>收藏</el-button>
                                   <el-button type="text" @click="like(item)" v-loading="likeLoading" style="color: #6A6A6A; margin-left: 30px"><i class="fa fa-thumbs-o-up" v-show="item.is_praised" aria-hidden="true" style="margin-right: 5px;color: #FF7B00;"></i><i class="fa fa-thumbs-o-up" v-show="!item.is_praised" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>{{item.praise_count}}</el-button>
                               </div>
                           </div>
                       </div>
                       <div>
                           <el-dialog title="评论列表" :visible.sync="dialogVisible1">
                               <div>
                                   <el-card shadow="never">
                                       <el-table :data="comments" v-loading="commentLoading" :default-sort="{prop: 'ReplyDate', order: 'ascending'}" style="padding-top: 0">
                                           <el-table-column label="评论" style="color: #6A6A6A;">
                                               <template slot-scope="scope">
                                                   <el-row style="margin: 15px 0">
                                                       <el-col :span="6">
                                                           <el-row>
                                                               <div><img :src="replyImg[scope.$index]" class="img" /></div>
                                                           </el-row>
                                                           <el-row style="padding-top: 10px;font-size: 12px;width: 80px">
                                                               <div align="center">{{scope.row.username}}</div>
                                                           </el-row>
                                                       </el-col>
                                                       <el-col :span="18">
                                                           <el-row style="min-height: 120px">
                                                               <p style="font-size: 14px;line-height: 24px">{{scope.row.ReplyText}}</p>
                                                           </el-row>
                                                           <el-row style="margin-top: 30px">
                                                               <div style="font-size: 12px;padding-top: 8px">{{scope.row.ReplyDate}}</div>
                                                           </el-row>
                                                       </el-col>
                                                   </el-row>
                                               </template>
                                           </el-table-column>
                                           <el-table-column label="按时间" width="80px" sortable prop="ReplyDate" style="margin: 15px 0">
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
                                   <el-button type="primary" @click="postComment(bid)" style="background-color: #1ac7c3; border-color: #1ac7c3;margin-top: 15px" size="mini">发表</el-button>
                               </div>
                           </el-dialog>
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
                               <div style="min-height: 110px">
                                   <div :id="item.blackboard_id"></div>
                               </div>
                               <div style="font-size: 12px; color: #6A6A6A">{{item.USERNAME}} </div>
                               <div style="font-size: 9px; color: #6A6A6A">发表于 {{item.blackboard_date}}</div>
                               <div style="font-size: 11px; color: #6A6A6A">分类：{{item.sectorName}} </div>
                               <div align="center" style="margin-top: 5px">
                                   <el-button type="text" style="color: #6A6A6A" @click="loadComments(item.blackboard_id)"><i class="fa fa-commenting-o" aria-hidden="true" style="margin-right: 5px;"></i>评论</el-button>
                                   <el-button type="text" @click="collect(item)" v-loading="collectLoading" style="color: #6A6A6A; margin-left: 30px"><i  class="fa fa-star" v-show="item.is_collected" aria-hidden="true" style="margin-right: 5px;color: #FFE100"></i><i class="fa fa-star-o" v-show="!item.is_collected" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>收藏</el-button>
                                   <el-button type="text" @click="like(item)" v-loading="likeLoading" style="color: #6A6A6A; margin-left: 30px"><i class="fa fa-thumbs-o-up" v-show="item.is_praised" aria-hidden="true" style="margin-right: 5px;color: #FF7B00;"></i><i class="fa fa-thumbs-o-up" v-show="!item.is_praised" aria-hidden="true" style="margin-right: 5px; color: #6A6A6A;"></i>{{item.praise_count}}</el-button>
                               </div>
                       </div>
                       </div>
                       <div>
                           <el-dialog title="评论列表" :visible.sync="dialogVisible1">
                               <div>
                                   <el-card shadow="never">
                                       <el-table :data="comments" v-loading="commentLoading" :default-sort="{prop: 'ReplyDate', order: 'ascending'}" style="padding-top: 0">
                                           <el-table-column label="评论" style="color: #6A6A6A;">
                                               <template slot-scope="scope">
                                                   <el-row style="margin: 15px 0">
                                                       <el-col :span="6">
                                                           <el-row>
                                                               <div><img :src="replyImg[scope.$index]" class="img" /></div>
                                                           </el-row>
                                                           <el-row style="padding-top: 10px;font-size: 12px;width: 80px">
                                                               <div align="center">{{scope.row.username}}</div>
                                                           </el-row>
                                                       </el-col>
                                                       <el-col :span="18">
                                                           <el-row style="min-height: 120px">
                                                               <p style="font-size: 14px;line-height: 24px">{{scope.row.ReplyText}}</p>
                                                           </el-row>
                                                           <el-row style="margin-top: 30px">
                                                               <div style="font-size: 12px;padding-top: 8px">{{scope.row.ReplyDate}}</div>
                                                           </el-row>
                                                       </el-col>
                                                   </el-row>
                                               </template>
                                           </el-table-column>
                                           <el-table-column label="按时间" width="80px" sortable prop="ReplyDate" style="margin: 15px 0">
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
                                   <el-button type="primary" @click="postComment(bid)" style="margin-top: 15px">发表</el-button>
                               </div>
                           </el-dialog>
                       </div>
                   </el-card>
               </el-col>
           </el-row>
        </div>
        <!-- 发表黑板报 -->
        <div style="margin-top: 40px; width: 962px; margin-left: 168px">
            <div>
                <el-card v-loading="postLoading">
                    <div slot="header" style="height: 15px; font-size: 14px; font-weight: bold; padding-left: 1rem">
                        发表黑板报
                    </div>
                    <!----- 输入标题 ----->
                    <div align="left">
                        <el-input v-model="blackboard.blackboard_name" size="small" maxlength="25"
                                  placeholder="请输入标题..."
                                  style="width: 350px">
                        </el-input>
                        <el-button type="text" style="margin-left: 500px">选择草稿</el-button>
                    </div>
                    <!----- 编辑器 ----->
                    <div id="editor" style="margin-top: 20px"></div>
                    <!----- 提示字数限制 ----->
                    <div align="right" style="font-size: 12px;color: #A6A6A6;">{{count}} / 200</div>
                    <div>
                        <!-- 选择分类 -->
                        <el-select value="" v-model="sid" style="width: 200px; margin-top: 10px" placeholder="请选择类别">
                            <el-option
                                v-for="item in sectors"
                                :key="item.SectorId"
                                :label="item.SectorName"
                                :value="item.SectorId">
                            </el-option>
                        </el-select>
                        <el-button @click="saveInDrafts" style="margin-left: 530px">保存到草稿箱</el-button>
                        <el-button type="primary" @click="postOn" style="margin-left: 10px">发布</el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import server from '../../../config/index';
    import WangEditor from 'wangeditor';
    import data from '../../data/sina-data.js'
    import {UPLOADER} from '../../tools/utils'

    export default{
        name: 'editor',
        data() {
            return {
                dialogVisible1: false,
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
                comments: [], // 存储评论信息
                commentLoading: false, // 评论加载状态
                commentText: '', // 发表评论内容
                replyImg: [], // 评论头像
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
                postLoading: false,
                editor: new WangEditor('#editor'), // 编辑器
                sinaData: [], // 新浪表情数组
                // emoji数组
                emojiData: ['😀','😃','😄','😁','😆','😅','😂','🤣','😇','😊','🙂','🙃','😉','😌','😍','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','😢','😭','😤','😠','😡','🤬','🤯','😳','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','😴','😪','😵','🤐','🤧','😷','😈','👿','💩','👻','🤲','🙌','👏','🤝','👍','👎','👊','✊','🤛','🤜','🤞','✌','🤟','👌','👈','👉','👆','👇','👋','🤙','💪','🙏','👀','🙇‍','🙅‍','🙆‍','🙋‍','🤦‍','🤷‍','💅','🌝','🌚','❤️','💔','❣️','💕','💓','💗','💖','❌','✅','⭕️','💯','❗️','❓','⁉️','📝'],
                count: 0, // 当前输入的字数
                sid: '', // 标签ID
                // 黑板报实体
                blackboard: {
                    sector_id: 0,
                    blackboard_name: '',
                    blackboard_text: '',
                    blackboard_date: new Date(),
                    user_id: 1, // 不知道如何获取
                    reply_count: 0,
                    clicking_rate: 0,
                    praise_count: 0,
                    favorite_count: 0
                },
                // 草稿实体
                draft: {
                    user_id: 1,
                    publish_type_id: 1,
                    sector_id: 0,
                    draft_name: '',
                    draft_text: '',
                    write_date: new Date()
                },
                UPLOADER, // 图片上传组件
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
                },
                bid: 0, // 评论所在黑板报的id
            }
        },

        created: function () {
            this.loading = true;
            let page = Number(localStorage.getItem('pageB'));
            if (page <= 0) page = 1;
            this.currentChange(page);
            this.getSectors();
        },
        mounted() {
            for(var i = 0;i < data.length;i++){
                this.sinaData.push({alt: data[i].phrase, src: data[i].icon});
            }
            this.editor.customConfig.onchange = () => {
                let t = this.editor.txt.text();
                // 限制字数
                if(this.count > 200) {
                    this.$message({type: 'error', message: '字数超出范围！'});
                    var str = t.substring(0, 200);
                    this.editor.txt.text(str);
                }
                this.count = t.length;
                this.blackboard.blackboard_text = this.editor.txt.html();
            };
            this.editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'foreColor',  // 文字颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
            this.editor.customConfig.emotions = [
                {
                    // tab 的标题
                    title: '新浪',
                    // type -> 'emoji' / 'image'
                    type: 'image',
                    // content -> 数组
                    content: this.sinaData
                },
                {
                    title: 'emoji',
                    type: 'emoji',
                    content: this.emojiData
                }];
            this.editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0; // 开启debug模式
            this.editor.create();
            this.editor.config.customUploadInit = this.UPLOADER(this.editor).init();
        },
        updated : function(){
            for (var j = 0;j < this.blackboards.length;j++) {
                this.loadText(this.blackboards[j]);
            }
            this.$nextTick(function(){
                for (var j = 0;j < this.blackboards.length;j++) {
                    this.loadText(this.blackboards[j]);
                }
            });

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
                        this.keywords = '';
                    }
                    // 按标签和全部
                    else {
                        if (this.keywords !== '') {
                            let k = this.keywords.trim().split(/\s+/);
                            for (var i = 0; i < k.length; i++) {
                                this.sectorKeyword.push(k[i]);
                            }
                            this.keywords = '';
                        }
                        this.searchUrl = '/blackboard/get?userID=1&SectorId=' + this.searchType;
                        for (var i = 0; i < this.sectorKeyword.length; i++) {
                            this.searchUrl += '&SectorName=' + this.sectorKeyword[i];
                        }
                    }
                }
                this.sectorKeyword = [];
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
                        this.loading = false;
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
            // 加载评论
            loadComments: function(id) {
                this.comments = [];
                this.replyImg = [];
                this.bid = id;
                this.$http.get(server.url + '/blackboard/reply/get?TopicId=' + id.toString(), {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((response) => {
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
                            this.$http.get(server.url + '/user/image/get?userID=' + commentList.data[i].UserId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then((res) => {
                                if (res.status === 200) {
                                    this.replyImg.push(JSON.parse(res.bodyText).data);
                                } else {
                                    this.$message({type: 'error', message: '头像加载失败!'});
                                }
                            }, (res) => {
                                this.$message({type: 'error', message: '头像加载失败!'});
                            }).catch((res) => {
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
                this.dialogVisible1 = true;
            },
            // 评论
            postComment: function(id) {
                if(this.commentText === '') {
                    this.$message({type: 'error', message: '请输入内容！'});
                    return
                }
                this.replyEntity.TopicId = id.toString();
                this.replyEntity.ReplyText = this.commentText;
                var t = new Date();
                this.replyEntity.ReplyDate = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/blackboard/reply', this.replyEntity, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status === 200){
                        this.$message({type: 'success', message: '评论成功'});
                        this.commentLoading = true;
                        this.loadComments(id);
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
            // 存入草稿箱
            saveInDrafts: function(){
                this.postLoading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.draft.draft_name = this.blackboard.blackboard_name;
                this.draft.draft_text = this.blackboard.blackboard_text;
                if(this.sid !== '') this.draft.sector_id = Number(this.sid);
                var t = new Date();
                this.draft.write_date = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/draft/save', this.draft, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status == 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.postLoading = false;
                        this.$message({type: 'success', message: '黑板报已保存'});
                    }
                    else{
                        this.postLoading = false;
                        this.editor.$textElem.attr('contenteditable', true);
                        this.$message({type: 'error', message: '保存失败'});
                    }
                }, response => {
                    this.editor.$textElem.attr('contenteditable', true);
                    this.postLoading = false;
                    this.$message({type: 'error', message: '保存失败'});
                }).catch((response) => {
                    this.postLoading = false;
                    this.$message({type: 'error', message: '保存失败'});
                });
            },
            // 发布
            postOn: function(){
                if(this.blackboard.blackboard_name === '') {
                    this.$message({type: 'error', message: '请输入标题！'});
                    return
                }
                if(this.blackboard.blackboard_text === '') {
                    this.$message({type: 'error', message: '请输入内容！'});
                    return
                }
                if(this.sid === '') {
                    this.$message({type: 'error', message: '请选择分类！'});
                    return
                }
                this.postLoading = true;
                this.editor.$textElem.attr('contenteditable', false);
                this.blackboard.sector_id = Number(this.sid);
                var t = new Date();
                this.blackboard.blackboard_date = t.format("yyyy-MM-dd HH:mm:ss");
                this.$http.post(server.url + '/blackboard/save', this.blackboard, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {
                    if (response.status === 200){
                        this.editor.$textElem.attr('contenteditable', true);
                        this.$message({type: 'success', message: '发表成功'});
                        this.postLoading = false;
                        this.blackboard.blackboard_name = '';
                        this.blackboard.blackboard_text = '';
                        this.editor.txt.clear();
                        this.sid = '';
                        this.loading = true;
                        this.loadBlackboards(1, this.pageSize);
                    }
                    else{
                        this.postLoading = false;
                        this.editor.$textElem.attr('contenteditable', true);
                        this.$message({type: 'error', message: '发表失败'});
                    }
                }, response => {
                    this.editor.$textElem.attr('contenteditable', true);
                    this.postLoading = false;
                    this.$message({type: 'error', message: '发表失败'});
                }).catch((response) => {
                    this.postLoading = false;
                    this.$message({type: 'error', message: '发表失败'});
                });
            },
            // 显示内容
            createNode: function(val) {
                const template = `<div class='child'>${val}</div>`;
                let tempNode = document.createElement('div');
                tempNode.innerHTML = template;
                return tempNode.firstChild;
            },
            loadText: function(item) {
                const container = document.getElementById(item.blackboard_id);
                if (container.childElementCount === 0) {
                    container.appendChild(this.createNode(item.blackboard_text));
                }
            }
        },

        filters:{
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

    .type-select {
        width: 100px;
        margin-left: 10px;
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

    .img {
        width: 80px;
        height: 80px;
        border-radius: 10px;
    }

</style>
