<template>
    <div style="margin-top: 2pt">
    <el-card class='listCard' style='margin-bottom: 2pt' shadow='hover' v-for='item in sourceList' @click.native='clickCard(item)'>
        <el-row>
            <el-col :span='2' style="display:inline-block;max-width: 60px">
            <i class="el-icon-upload" style="font-size: 40px;text-align: center;color:#449CFA;padding-top: 4pt"></i>
            </el-col>
            <el-col :span='22' style="display: inline-block;vertical-align: top;">
                <div class="title" style="font-size: 12pt;margin-bottom: 4pt;font-weight: bold;display: inline-block;">{{item.resourceName}}</div>       
                <div class="context" style="font-size:10pt;color: grey;line-height: 150%;text-align: justify">{{item.description}}</div>
                <div class="subtitle" style="margin-top: 4pt; font-size: 8pt; color:darkgrey;">{{item.uploadTime}}</div>
            </el-col>
        </el-row>
    </el-card>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import server from '../../../config/index';
    export default {
        name: 'baseform',
        data: function(){
            return {
                sourceList:[],
            }
        }, 
        mounted:function(){
            this.getCollectionList()
        },
        methods: {
        // 监听点击卡片事件，处理页面跳转
            clickCard(res){
                this.$router.push({
                    name:'SourcePage',
                    params:{
                        resourceID:res.resourceID,
                        id:res.id,
                        uploaderID:res.uploaderID,
                        categoryID:res.categoryID,
                        resourceMajorID:res.resourceMajorID,
                        resourceName:res.resourceName,
                        description:res.description,
                        downloadTimes:res.downloadTimes,
                        uploadTime:res.uploadTime
                    }
                })
                console.log('clickMethod')
                console.log(res.description)
            },
            getCollectionList(){
                this.$http.get(server.url+'/myFavourite',{}).then(function(response){
                    //清空数组，在调试后移除
                    this.sourceList.splice(0,this.sourceList.length)
                    console.error(response)
                    for(let i=0;i<response.data.data.length;i++){
                        this.sourceList.push(response.data.data[i]);
                    }
                })
            }
        }
    }
</script>

