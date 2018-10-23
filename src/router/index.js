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
                    path: '/topiclist',
                    component: resolve => require(['../components/page/TopicList.vue'], resolve),
                    meta: { title: '问题交流' }
                },
                {
                    path: '/source-list',
                    component: resolve => require(['../components/page/SourceList.vue'], resolve),
                    meta: { title: '下载资源' }
                },
                {
                    path: '/source-page',
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
