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
    export default {
        name: 'baseform',
        data: function(){
            return {
                sourceList:[{resourceName:'收藏页面的测试数据',description:'Teledyne LeCroy quantumdata 980 48G 用于HDMI 测试的协议分析 仪/发生器模块配备了HDMI Tx 和Rx 端口，支持HDMI 2.1 固定速率链 路和FEC 捕获分析和解码，最高可达48Gbps（12Gbps /通道）。 HDMI Rx 分析端口可提供固定速率链路的打包-超级模块，字符模块和 FRL 数据包以及底层TMDS 视频，协议，控制和元数据的可视性。',uploadTime:'2018年10月21日'},
                    {resourceName:'Office 2007 Access Database Engine',description:'如果你的c#程序采用oledb方式连接access数据库,需要安装此 engine',uploadTime:'2018年10月20日'},
                    {resourceName:'随机过程与应用',description:'机过程与应用pdf课件，本书内容包括：概率论基础，随机过程基础，泊松过程及其推广，马尔可夫过程，二阶矩过程，平稳过程，以及高阶统计量与非平稳过程',uploadTime:'2018年10月21日'}
                    ],
            }
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
        }
    }
</script>

