const routers = [
    {
        path: '/',
        redirect: '/audit/overview',
    },
    {
        path: '/audit/login',
        meta: {
            title: '登录页'
        },
        component: (resolve) => require(['./views/login.vue'], resolve),
    },
    // 404page
    {
        path: '/errorinfo',
        component:  (resolve) => require(['./views/errorinfo.vue'], resolve),
    },

    {
        path: "*", // 此处需特别注意置于最底部
        redirect: "/errorInfo"
    },
    {
        path: '/audit',
        meta: {
            title: '主路由'
        },
        component: (resolve) => require(['./views/common/Home.vue'], resolve),
        children:[
            {
                path: 'overview',
                meta: {
                    title: '支付关系'
                },
                component: (resolve) => require(['./views/overview.vue'], resolve)
            },
            {
                path: 'company',
                meta: {
                    title: '工商关系'
                },
                component: (resolve) => require(['./views/company.vue'], resolve)
            },
            {
                path: 'bank',
                meta: {
                    title: '流水概览'
                },
                component: (resolve) => require(['./views/bank.vue'], resolve)
            },
            {
                path: 'explore',
                meta: {
                    title: '单节点探索'
                },
                component: (resolve) => require(['./views/explore.vue'], resolve)
            },
            {
                path: 'macro',
                meta: {
                    title: '数据展示'
                },
                component: (resolve) => require(['./views/macro.vue'], resolve)
            },
            {
                path: 'doubleExplore',
                meta: {
                    title: '双节点探索'
                },
                component: (resolve) => require(['./views/doubleExplore.vue'], resolve)
            },
            {
                path: 'doubts',
                meta: {
                    title: '疑点查看'
                },
                component: (resolve) => require(['./views/doubts.vue'], resolve)
            },
            {
                path: 'doubtsDetail',
                meta: {
                    title: '疑点权限'
                },
                component: (resolve) => require(['./views/doubtsDetail.vue'], resolve)
            },
            {
                path: 'exportInfo',
                meta: {
                    title: '导出信息'
                },
                component: (resolve) => require(['./views/exportInfo.vue'], resolve)
            },
            {
                path: 'dataManagement',
                meta: {
                    title: '数据管理'
                },
                component: (resolve) => require(['./views/dataManagement.vue'], resolve)
            },
            {
                path:'dataSourceManagement',
                meta: {
                    title: '数据源配置'
                },
                component:(resolve) => require(['./views/dataManagement/dataSourceManagement.vue'],resolve)
            },
            {
                path:'dataTargetSourceManagement',
                meta: {
                    title: '目标源配置'
                },
                component:(resolve) => require(['./views/dataManagement/dataTargetSourceManagement.vue'],resolve)
            },
            {
                path: 'dataImport',
                meta: {
                    title: '文本数据导入'
                },
                component: (resolve) => require(['./views/dataImport.vue'], resolve)
            },
            {
                path: 'dataImportTask',
                meta: {
                    title: '数据库数据导入'
                },
                component: (resolve) => require(['./views/dataManagement/dataImportTask.vue'], resolve)
            },
            {
                path: 'dataCleaning',
                meta: {
                    title: '数据清洗'
                },
                component: (resolve) => require(['./views/dataManagement/dataCleaning.vue'], resolve)
            },
            {
                path: 'dataTransform',
                meta: {
                    title: '数据转换'
                },
                component: (resolve) => require(['./views/dataManagement/dataTransform.vue'], resolve)
            },
            {
                path: 'vertexInfoModify',
                meta: {
                    title: '点信息修改'
                },
                component: (resolve) => require(['./views/vertexInfoModify.vue'], resolve)
            },
            {
                path: 'edgeInfoModify',
                meta: {
                    title: '边信息修改'
                },
                component: (resolve) => require(['./views/edgeInfoModify.vue'], resolve)
            },
            {
                path: 'self',
                meta: {
                    title: '个人信息'
                },
                component: (resolve) => require(['./views/self.vue'], resolve)
            },
            {
                path: 'config',
                meta: {
                    title: '权限控制'
                },
                component: (resolve) => require(['./views/config.vue'], resolve)
            },
            {
                path: 'cytoscape',
                meta: {
                    title: 'cytoscape'
                },
                component: (resolve) => require(['./components/cytoscapeGraph.vue'], resolve)
            },
            {
                path: 'customerModify',
                meta: {
                    title: '个人信息'
                },
                component: (resolve) => require(['./views/self/customerModify.vue'], resolve)
            },
            {
                path: 'pwdModify',
                meta: {
                    title: '密码修改'
                },
                component: (resolve) => require(['./views/self/pwdModify.vue'], resolve)
            },
            {
                path: 'uManagement',
                meta: {
                    title: '用户管理'
                },
                component: (resolve) => require(['./views/management/uManagement.vue'], resolve)
            },
            /*{
                path: '/rlManagement',
                meta: {
                    title: '角色管理'
                },
                component: (resolve) => require(['./views/management/rlManagement.vue'], resolve)
            },*/
            {
                path: 'orgManagement',
                meta: {
                    title: '科室权限管理'
                },
                component: (resolve) => require(['./views/management/orgManagement.vue'], resolve)
            },
            {
                path: 'lgManagement',
                meta: {
                    title: '日志查看'
                },
                component: (resolve) => require(['./views/management/lgManagement.vue'], resolve)
            },
            {
                path:'keyWordConfiguration',
                meta: {
                    title: '关键字配置'
                },
                component: (resolve) => require(['./views/management/keyWordConfiguration.vue'],resolve)
            },
            {
                path:'lgWaring',
                meta: {
                    title: '日志预警'
                },
                component: (resolve) => require(['./views/management/logWaring.vue'],resolve)
            },
            {
                path: 'auManagement',
                meta: {
                    title: '白名单授权管理'
                },
                component: (resolve) => require(['./views/management/auManagement.vue'], resolve)
            },
            {
                path: 'whiteListManagement',
                meta: {
                    title: '白名单管理'
                },
                component: (resolve) => require(['./views/management/whiteListManagement.vue'], resolve)
            },
            {
                path: 'dataInterface',
                meta: {
                    title: '数据接口'
                },
                component: (resolve) => require(['./views/dataManagement/dataExport.vue'], resolve)
            },
        ]
    },

];
export default routers;
