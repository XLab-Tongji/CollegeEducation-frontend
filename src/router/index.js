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
                    path: '/forum',
                    component: resolve => require(['../components/page/Forum.vue'], resolve),
                    meta: { title: '论坛' },
                    redirect: '/class-list',
                    children:[
                        {
                            path: '/class-list',
                            name: 'ClassList',
                            component: resolve => require(['../components/page/ClassList.vue'], resolve),
                            meta: { title: '班级列表' }
                        },
                        {
                            path: '/class-settings',
                            name: 'ClassSettings',
                            component: resolve => require(['../components/page/ClassSettings.vue'], resolve),
                            meta: { title: '管理班级' }
                        },
                        {
                            path: '/topic-list',
                            name: 'TopicList',
                            component: resolve => require(['../components/page/TopicList.vue'], resolve),
                            meta: { title: '文章列表' }
                        },
                        {
                            path: '/blackboard-list',
                            name: 'BlackboardList',
                            component: resolve => require(['../components/page/BoardTable.vue'], resolve),
                            meta: { title: '黑板报列表' }
                        },
                        {
                            path: '/question-list',
                            name: 'QuestionList',
                            component: resolve => require(['../components/page/QuestionList.vue'], resolve),
                            meta: { title: '问题答疑'}
                        },
                        {
                            path: '/topic-details',
                            name: 'TopicDetails',
                            component: resolve => require(['../components/page/TopicDetails.vue'], resolve),
                            meta: { title: '文章详情'}
                        }
                    ]
                },
                {
                    path: '/source-list',
                    component: resolve => require(['../components/page/SourceList.vue'], resolve),
                    meta: { title: '下载资源' },
                },
                {
                    path: '/source-page:resourceID&:id&:uploaderID&:categoryID&:resourceMajorID&:resourceName&:description&:uploadTime&:points',
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
