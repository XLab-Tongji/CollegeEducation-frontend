import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/my',
                    component: resolve => require(['../components/page/My.vue'], resolve),
                    redirect: '/my-upload',
                    meta: { title: '个人中心' },
                    children:[{
                        path:'/my-upload',
                        meta:{title:'我的上传'},
                        component: resolve => require(['../components/page/myUpload.vue'], resolve),
                        },
                        {
                            path:'/my-download',
                            meta:{title:'我的下载'},
                            component: resolve => require(['../components/page/myDownload.vue'], resolve),
                        },
                        {
                            path: '/collection',
                            component: resolve => require(['../components/page/Collection.vue'], resolve),
                            meta: { title: '我的收藏' }
                        },
                    ]
                },
                
                {
                    path: '/upload-source',
                    component: resolve => require(['../components/page/UploadSource.vue'], resolve),
                    meta: { title: '上传资源' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    path: '/topic',
                    component: resolve => require(['../components/page/TopicList.vue'], resolve),
                    meta: { title: '论坛' },
                    redirect: '/topic-list',
                    children:[
                        {
                            path: '/topic-list',
                            component: resolve => require(['../components/page/TopicTable.vue'], resolve),
                            meta: { title: '文章列表' }
                        },
                        {
                            path: '/blackboard-list',
                            component: resolve => require(['../components/page/BoardTable.vue'], resolve),
                            meta: { title: '黑板报列表' }
                        },
                        {
                            path: '/topic-post',
                            component: resolve => require(['../components/page/TopicPost.vue'], resolve),
                            meta: { title: '发表文章'}
                        },
                        {
                            path: '/blackboard',
                            component: resolve => require(['../components/page/Blackboard.vue'], resolve),
                            meta: { title: '发表黑板报'}
                        },
                        {
                            path: '/question',
                            name: 'QuestionList',
                            component: resolve => require(['../components/page/QuestionList.vue'], resolve),
                            meta: { title: '问题答疑'}
                        },
                        {
                            path: '/topic-details',
                            name: 'TopicDetails',
                            component: resolve => require(['../components/page/TopicDetails.vue'], resolve),
                            meta: { title: '文章详情'}
                        },
                        {
                            path: '/blackboard-details',
                            name: 'BoardDetails',
                            component: resolve => require(['../components/page/BoardDetails.vue'], resolve),
                            meta: { title: '黑板报详情'}
                        },
                        {
                            path: '/question-details',
                            name: 'QuestionDetails',
                            component: resolve => require(['../components/page/QuestionDetails.vue'], resolve),
                            meta: { title: '问题详情'}
                        },
                    ]
                },
                {
                    path: '/source-list',
                    component: resolve => require(['../components/page/SourceList.vue'], resolve),
                    meta: { title: '下载资源' },
                },
                {
                    path: '/source-page',
                    name:'SourcePage',
                    component: resolve => require(['../components/page/SourcePage.vue'], resolve),
                    meta: { title: '资源详情' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve)
        },
        
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
