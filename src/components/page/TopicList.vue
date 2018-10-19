<template>
    <el-container class="topic-list">
        <el-main class="main">
            <div>
                <el-menu
                    :default-active="activeName"
                    class="el-menu-demo"
                    mode="horizontal"
                    background-color="#fff"
                    text-color="#282828"
                    active-text-color="#1ac7c3">
                    <el-menu-item index="all">全部</el-menu-item>
                    <el-menu-item index="refined">精华</el-menu-item>
                    <el-menu-item index="album">图册</el-menu-item>
                    <el-menu-item index="message">我的</el-menu-item>
                </el-menu>
            </div>
            <div>
                <div style="float: right">
                    <el-card class="tag-card" shadow="never">
                        <div v-for="o in 4" :key="o">
                            {{'tag ' + o }}
                        </div>
                    </el-card>
                </div>
                <div style="margin-top: 20px">
                    <topic_table state="-1" :activeName="activeName" :keywords="keywords"></topic_table>
                </div>
            </div>

            <div style="margin-top: 20px">
                <topic_post></topic_post>
            </div>
        </el-main>
    </el-container>
</template>
<script>
    import TopicTable from './TopicTable'
    import TopicPost from './TopicPost'
    export default {
        data() {
            return {
                activeName: 'all'
            };
        },
        methods: {
            searchClick(){
//        Utils.$emit(event);
            },
            handleClick(tab, event) {
                //console.log(tab, event);
            },
        },
        components: {
            'topic_table': TopicTable,
            'topic_post': TopicPost
        }
    };
</script>
<style>
    .topic-list{
        background-color: #fff;
    }

    .topic-list > .main {
        padding-top: 0px;
    }

    .tag-card {
        width: 120px;
        margin-top: 50px;
        margin-right: 10px;
    }
</style>
