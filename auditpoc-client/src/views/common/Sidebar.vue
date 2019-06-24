<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#e8eef5"
                 text-color="#495060" active-text-color="#d1675a" :unique-opened="true" router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" class="sub-menu">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title" class="pd-l-10">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">
                                    <i class="fa fa-angle-double-right"></i><span slot="title" class="pd-l-10">{{ subItem.title }}</span>
                                </template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    <i class="fa fa-angle-right"></i><span slot="title" class="pd-l-10">{{ threeItem.title }}</span>
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                <i class="fa fa-angle-double-right"></i><span slot="title" class="pd-l-10">{{ subItem.title }}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title" class="pd-l-10">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';
    export default {
        mounted(){
            this.showSidebar();
        },
        data() {
            return {
                collapse: false,
                items: []
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
        })
        },
        methods:{
            showSidebar(){
                var that =this;
                /*var database = {
                    icon: 'fa fa-database',
                    title: '数据管理',
                    index: '1',
                    subs: [
                        {
                            index: '11',
                            title: '数据导入',
                            subs: [
                                {
                                    index: 'dataImportTask',
                                    title: '数据库数据导入'
                                },
                                {
                                    index: 'dataImport',
                                    title: '文本数据导入',
                                },
                            ]
                        },
                        {
                            index: 'dataCleaning',
                            title: '数据清洗',
                        },
                        {
                            index: 'dataTransform',
                            title: '数据转换'
                        },
                        {
                            index: '14',
                            title: '数据修改',
                            subs: [
                                {
                                    index: 'vertexInfoModify',
                                    title: '点信息修改'
                                },
                                {
                                    index: 'edgeInfoModify',
                                    title: '边信息修改',
                                },
                            ]
                        },
                        {
                            index: 'dataInterface',
                            title: '数据接口',

                        },
                    ]
                };*/
                var globel = {
                    icon: 'fa fa-globe',
                    title: '宏观态势',
                    index: '2',
                    subs: [
                        {
                            index: 'overview',
                            title: '支付关系',
                        },
                        {
                            index: 'company',
                            title: '工商关系',
                        },
                        {
                            index:  'bank',
                            title:  '流水概览',
                        },
                        {
                            index: 'macro',
                            title: '数据展示'
                        },
                    ]
                };
                var eye = {
                    icon: 'fa fa-eye',
                    title: '疑点管理',
                    index: '3',
                    subs: [
                        {
                            index: 'doubts',
                            title: '疑点查看',
                        },
                        {
                            index: 'doubtsDetail',
                            title: '疑点权限',
                        },
                    ]
                };
                var sitemap = {
                    icon: 'fa fa-sitemap',
                    title: '动态探索',
                    index: '4',
                    subs: [
                        {
                            index: 'explore',
                            title: '单节点探索',
                        },
                        {
                            index: 'doubleExplore',
                            title: '双节点探索',
                        },
                    ]
                };
                var cogs = {
                    icon: 'fa fa-cogs',
                    title: '安全控制',
                    index: '5',
                    subs: [
                        {
                            index: '51',
                            title: '系统管理',
                            subs: [
                                {
                                    index: 'customerModify',
                                    title: '个人信息',
                                },
                                {
                                    index: 'pwdModify',
                                    title: '密码修改',
                                },
                                {
                                    index: 'uManagement',
                                    title: '用户管理',
                                },
                            ]
                        },
                        {
                            index: '52',
                            title: '权限配置',
                            subs: [
                                {
                                    index: 'orgManagement',
                                    title: '业务科室管理',
                                },
                              /*  {
                                    index: 'rlManagement',
                                    title: '角色管理',
                                },*/
                                {
                                    index: 'auManagement',
                                    title: '白名单授权管理',
                                },
                                {
                                    index: 'whiteListManagement',
                                    title: '白名单管理',
                                },
                            ]
                        },
                        {
                            index: '53',
                            title: '日志管理',
                            subs: [
                                {
                                    index: 'lgManagement',
                                    title: '日志查看',
                                },
                                {
                                    index: 'keyWordConfiguration',
                                    title: '敏感词汇配置',
                                },
                                {
                                    index: 'lgWaring',
                                    title: '日志预警',
                                },
                            ]
                        },
                    ]
                };
                if(sessionStorage.getItem("userInfo")==null){

                    this.$http.post('/api/user/info',{}).then(function (response) {
                        if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                            sessionStorage.setItem("userInfo",JSON.stringify(response.data.data));
                            var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

                            var name = userInfo.name;
                            var names = ["admin","xuquan","shenwei","zhangteng","libing","jun"];
                            if(names.indexOf(name)>-1){
                                that.items = [];
                                //that.items.push(database);
                                that.items.push(globel);
                                that.items.push(eye);
                                that.items.push(sitemap);
                                that.items.push(cogs);
                            }else{
                                that.items = [];
                                /*database = {
                                    icon: 'fa fa-database',
                                    title: '数据管理',
                                    index: '1',
                                    subs: [
                                        {
                                            index: '11',
                                            title: '数据导入',
                                            subs: [
                                                {
                                                    index: 'dataImport',
                                                    title: '文本数据导入',
                                                },
                                            ]
                                        },
                                        {
                                            index: '14',
                                            title: '数据修改',
                                            subs: [
                                                {
                                                    index: 'vertexInfoModify',
                                                    title: '点信息修改'
                                                },
                                                {
                                                    index: 'edgeInfoModify',
                                                    title: '边信息修改',
                                                },
                                            ]
                                        },
                                        {
                                            index: 'dataInterface',
                                            title: '数据接口',

                                        },
                                    ]
                                };*/
                                //that.items.push(database);
                                that.items.push(globel);
                                that.items.push(eye);
                                that.items.push(sitemap);
                                that.items.push(cogs);
                            }
                        }
                    });
                }else{
                    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

                    var name = userInfo.name;
                    var names = ["admin","xuquan","shenwei","zhangteng","libing","jun"];
                    if(names.indexOf(name)>-1){
                        that.items = [];
                        //that.items.push(database);
                        that.items.push(globel);
                        that.items.push(eye);
                        that.items.push(sitemap);
                        that.items.push(cogs);
                    }else{
                        that.items = [];
                        /*database = {
                            icon: 'fa fa-database',
                            title: '数据管理',
                            index: '1',
                            subs: [
                                {
                                    index: '11',
                                    title: '数据导入',
                                    subs: [
                                        {
                                            index: 'dataImport',
                                            title: '文本数据导入',
                                        },
                                    ]
                                },
                                {
                                    index: '14',
                                    title: '数据修改',
                                    subs: [
                                        {
                                            index: 'vertexInfoModify',
                                            title: '点信息修改'
                                        },
                                        {
                                            index: 'edgeInfoModify',
                                            title: '边信息修改',
                                        },
                                    ]
                                },
                                {
                                    index: 'dataInterface',
                                    title: '数据接口',

                                },
                            ]
                        };*/
                        //that.items.push(database);
                        that.items.push(globel);
                        that.items.push(eye);
                        that.items.push(sitemap);
                        that.items.push(cogs);
                    }

                }

            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 60px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 210px;
    }
    .sidebar > ul {
        height:100%;
    }
    .sidebar i.fa{
        font-size:18px;
    }
    .el-submenu__title>span{
        padding-left:10px;
    }
    .sidebar>.sidebar-el-menu>.sub-menu>.el-menu>.el-submenu{
        border-top:1px solid #fff!important;
    }
    .sidebar>.sidebar-el-menu>.el-submenu>.el-submenu__title>span{
        font-size:16px;
    }
    .sidebar>.sidebar-el-menu>.el-submenu>.el-menu>.el-submenu>.el-submenu__title>span{
        font-size:14px;
    }
    .sidebar>.sidebar-el-menu>.el-submenu>.el-menu>.el-submenu>.el-menu>.el-menu-item{
        font-size:13px;
        height:50px;
        line-height: 50px;
    }
    .pd-l-10{
        padding-left:10px;
    }
    .el-submenu .el-menu-item,.el-submenu .el-submenu__title{
        height:50px!important;
        line-height: 50px!important;
        background:red;
    }
</style>