<style scoped>
    .layout-logo {
        width: 210px;
        height: 40px;
        float: left;
        position: relative;
        font-size: 18px;
        top: 8px;
        left: 10px;
        background: url(../img/site-logo.png) no-repeat;
        -moz-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .ivu-menu-item-selected {
        color: #2d8cf0 !important;
        border-bottom: 2px solid #2d8cf0;
        font-size: 14px;
    }

    .layout-nav {
        display: inline-table;
        width: 100%;
        padding: 0px 15px;
    }

    .layout-toolbar {
        float: right;
    }

    .layout-menu {
        float: left;
        padding-left: 35px;
    }

    .ivu-menu-horizontal {
        padding-bottom: 63px;
    }

    .dropdown-warning {
        width: 380px;
        padding: 0px 10px;
        line-height: 16px;
        font-size: 12px;
    }

    .dropdown-warning ul {
        border-bottom: 0.2px dashed #dddddd;
        padding: 10px 0px;
    }

    .dropdown-warning-title {
        line-height: 30px;
        font-weight: 800;
        font-size: 15px;
    }

    .ivu-dropdown-item-divided:before {
        background-color: transparent;
    }

    .ivu-dropdown-item-divided {
        border-top: none;
        text-align: center;
    }

    .dropdown-warning a {
        color: #2d8cf0;
    }

    .ivu-badge-count-alone {
        padding: 0px 4px !important;
        font-size: 8px !important;
        height: 15px !important;
    }

    .ivu-badge {
        margin-left: 10px
    }

    .search-bar-container {
        display: inline-block;
        width: 550px;
        padding-left: 30px;
    }

    .search-bar-container .ivu-input-group-append {
        margin-left: -1px;
        padding: 7px 20px 7px 10px;
    }

    .layout-nav .header-link {
        color: black;
    }

    .layout-nav .header-link:hover, .ivu-menu-item-selected .header-link {
        color: #2d8cf0;
    }

    .layout-menu .ivu-menu-item {
        padding: 0 15px;
        font-size: 13px;

    }

</style>
<style>
    #search-bar .ivu-select-visible .ivu-select-selection {
        box-shadow: none;
    }

    body .el-notification {
        width: 450px;
        padding: 15px;
    }

    body .el-notification__content {
        font-size: 14px;
        line-height: 15px;
        margin: 5px 0 0;
    }

    body .el-notification__icon {
        font-size: 25px;
    }

    body .el-notification .el-icon-warning {
        color: #ff9900;
    }
</style>
<template>
    <Menu mode="horizontal" :theme="theme" style="min-width: 1300px">
        <div class="layout-nav">
            <div class="layout-logo">
            </div>
            <div class="layout-menu">
                <li :class="activeItem=='overview'||activeItem=='company' || activeItem =='macro' || activeItem =='bank'? 'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected':'ivu-menu-item'">
                    <Dropdown>
                        <router-link to="./overview" class="header-link" :target="activeItem=='overview'">
                            <Icon type="android-globe"></Icon>
                            数据概览
                            <Icon type="arrow-down-b"></Icon>
                        </router-link>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <router-link to="./overview" class="header-link" style="color:black"
                                             :target="activeItem=='overview'">
                                    <!--:target="activeItem=='company'? '_blank':''">-->
                                    支付关系
                                </router-link>
                            </DropdownItem>
                            <DropdownItem>
                                <router-link to="./company" class="header-link" style="color:black"
                                             :target="activeItem=='company'">
                                    工商关系
                                </router-link>
                            </DropdownItem>
                            <DropdownItem>
                                <router-link to="./company" class="header-link" style="color:black"
                                             :target="activeItem=='bank'">
                                    银行重复担保
                                </router-link>
                            </DropdownItem>
                            <DropdownItem>
                                <router-link to="./macro" class="header-link" style="color:black"
                                             :target="activeItem=='macro'">
                                    宏观数据展示
                                </router-link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <li :class="activeItem=='doubts'|| activeItem=='doubtsDetail' ? 'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected':'ivu-menu-item'">
                    <!--<router-link to="./doubts" :target="activeItem=='overview'||activeItem=='company'"-->
                    <!--class="header-link">-->
                    <!--<Icon type="eye"></Icon>-->
                    <!--疑点管理-->
                    <!--</router-link>-->
                    <Dropdown>
                        <router-link to="./doubts" class="header-link" :target="activeItem=='overview'||activeItem=='company'">
                            <Icon type="eye"></Icon>
                            疑点管理
                            <Icon type="arrow-down-b"></Icon>
                        </router-link>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <router-link to="./doubtsDetail" class="header-link" style="color:black"
                                             :target="activeItem=='doubtsDetail'">
                                    疑点权限
                                </router-link>
                            </DropdownItem>
                            <DropdownItem>
                                <router-link to="./exportInfo" class="header-link" style="color:black"
                                             :target="activeItem=='exportInfo'">
                                    导出信息
                                </router-link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <li :class="activeItem=='explore'||activeItem=='doubleExplore' ? 'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected':'ivu-menu-item'">
                    <Dropdown>
                        <router-link to="./explore" class="header-link">
                            <Icon type="navigate"></Icon>
                            关系探索
                            <Icon type="arrow-down-b"></Icon>
                        </router-link>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <router-link to="./explore" class="header-link" style="color:black"
                                             :target="activeItem=='explore'">
                                    <!--:target="activeItem=='company'? '_blank':''">-->
                                    单节点关系探索
                                </router-link>
                            </DropdownItem>
                            <DropdownItem>
                                <router-link to="./doubleExplore" class="header-link" style="color:black"
                                             :target="activeItem=='doubleExplore'">
                                    双节点关系探索
                                </router-link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <li :class="activeItem=='dataImport'|| activeItem=='dataManagement' || activeItem=='vertexInfoModify' || activeItem=='edgeInfoModify'? 'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected':'ivu-menu-item'">
                    <Dropdown>
                        <router-link to="./dataImport" class="header-link">
                            <Icon type="settings"/>
                            数据管理
                            <Icon type="arrow-down-b"></Icon>
                        </router-link>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <router-link to="./dataImport" class="header-link" style="color:black"
                                             :target="activeItem=='dataImport'">
                                    数据导入
                                </router-link>
                            </DropdownItem>
                            <DropdownItem>
                                <router-link to="./vertexInfoModify" class="header-link" style="color:black"
                                             :target="activeItem=='vertexInfoModify'">
                                    点信息修改
                                </router-link>
                            </DropdownItem>
                            <DropdownItem>
                                <router-link to="./edgeInfoModify" class="header-link" style="color:black"
                                             :target="activeItem=='edgeInfoModify'">
                                    边信息修改
                                </router-link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
            </div>
            <div class="search-bar-container" style="display: inline-flex;" :class="activeItem=='explore'||activeItem=='doubleExplore'">
                <div v-if="type !=2" style="display: inline-flex;">
                    <div :width="searchBarWidth" :maxNodeSelect="maxNodeSelect" style="display: inline-flex;">
                        <search-bar ref="searchBar" :style="'width: '+searchBarWidth+'px'"></search-bar>
                    </div>
                </div>
                <div v-else="type ==2" style="display: inline-flex;">
                    <div :width="searchBarWidth" :maxNodeSelect="maxNodeSelect" style="display: inline-flex;">
                        <search-bar ref="searchBar" :style="'width: '+searchBarWidth*0.5+'px'"></search-bar>
                        <search-bar ref="searchBarTwo" :style="'width: '+searchBarWidth*0.5+'px'"></search-bar>
                    </div>
                </div>
                <Button icon="ios-search" class="ivu-input-group-append" @click="exploreGraph"></Button>
            </div>
            <div class="layout-toolbar" style="margin-right: 20px">
                <!--<Dropdown>-->
                <!--<Button type="text" size="small">-->
                <!--<Icon type="email" size="20"></Icon>-->
                <!--</Button>-->
                <!--<Dropdown-menu slot="list">-->
                <!--<div class="dropdown-warning">-->
                <!--<ul v-for="messageData in messages" v-if="messageData.messageList.length>0">-->
                <!--<span class="dropdown-warning-title">{{messageData.display}}</span><br>-->
                <!--<li v-for="message in messageData.messageList">-->
                <!--{{message.name}}-->
                <!--<router-link :target="activeItem=='overview'||activeItem=='company'?'_blank':''"-->
                <!--:to="'/explore?type='+message.type+'&pathId='+message.id">-->
                <!--查看详情>>-->
                <!--</router-link>-->
                <!--</li>-->
                <!--</ul>-->
                <!--<li class="ivu-dropdown-item ivu-dropdown-item-divided">-->
                <!--<router-link to="/doubts"-->
                <!--:target="activeItem=='overview'||activeItem=='company'? '_blank':''">查看全部-->
                <!--</router-link>-->
                <!--</li>-->
                <!--</div>-->
                <!--</Dropdown-menu>-->
                <!--</Dropdown>-->
                <Dropdown>
                    <Button type="text" size="small">
                        <Icon type="person" size="20"></Icon>
                    </Button>
                    <Dropdown-menu slot="list">
                        <Dropdown-item>
                            <a href="./self"
                               :target="activeItem=='overview'||activeItem=='company'">个人中心
                                <!--:target="activeItem=='overview'||activeItem=='company'? '_blank':''">个人中心-->
                            </a>
                        </Dropdown-item>
                        <Dropdown-item>
                            <a href="/logout">注销登陆
                            </a>
                        </Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
                <Dropdown>
                    <Button type="text" size="small">
                        <Icon type="wrench" size="20"></Icon>
                    </Button>
                    <Dropdown-menu slot="list">
                        <Dropdown-item>
                            <a href="./config"
                               :target="activeItem=='overview'||activeItem=='company'">系统设置
                                <!--:target="activeItem=='overview'||activeItem=='company'? '_blank':''">系统设置-->
                            </a>
                        </Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </div>
        </div>
    </Menu>
</template>
<script>
    import searchBar from '../components/paginationSearchBar.vue';
    import Util from '../libs/util';
    import dictionary from '../config/dictionary'

    export default {
        components: {
            'search-bar': searchBar,
        },
        mounted() {
            this.queryCircle();
            var show = sessionStorage.getItem('show');
            if (this.activeItem == 'doubts') {
                if (show === "1") {
                    return;
                } else {
                    sessionStorage.setItem('show', '1')
                }
            }
            this.queryDoubts('/api/graph/findKinshipHavePaymentList?size=' + this.maxMessage, '亲属与公职人员单位发生贸易往来', 'findKinshipHavePaymentDetail');
            this.queryDoubts('/api/graph/newCompanyGetPaymentList?size=' + this.maxMessage, '新办企业获得财政补贴', 'newCompanyGetPaymentDetail');
        },
        props: ['activeItem', 'disableSearch', 'type'],
        data() {
            return {
                nodeSelect: [],
                maxNodeSelect: 2,
                theme: Util.theme,
                messages: {},
                maxMessage: 5,
                searchBarWidth: Math.max(window.screen.availWidth * 0.35, 350)
            };
        },
        methods: {
            exploreGraph() {
                this.nodeSelect = this.$refs.searchBar.getSelected();
                if (this.activeItem == 'explore') {
                    if (this.nodeSelect == '') {
                        alert("查找的目标不能为空，请选中节点信息！")
                    };
                    this.$emit("exploreResult",this.nodeSelect)
                }
                else if (this.activeItem == 'doubleExplore') {
                    this.nodeSelectTwo = this.$refs.searchBarTwo.getSelected();
                    if (this.nodeSelect == '' || this.nodeSelectTwo == '') {
                        alert("两个查找的目标都不能为空")
                    };
                    this.$emit("doubleExploreResult",{id1:this.nodeSelect,id2:this.nodeSelectTwo})
                }
            },
            queryDoubts(url, title, type) {
                var h = this.$createElement;
                var that = this;
                if (that.activeItem == 'doubts') {
                    $.post(url, function (data) {
                        var elements = [];
                        for (let i in data.list) {
                            var item = data.list[i];
                            elements.push(h('li', null, [h('span', null, item.name + ' '), h('a', {
                                attrs: {
                                    href: '/explore?type=' + type + '&pathId=' + item.id,
                                    // target: '_blank'
                                }
                            }, ' 查看详情>>')]));
                        }
                        that.$notify({
                            title: title,
                            message: h('ul', null, elements),
                            type: 'warning',
                            duration: 4500
                        });
                    });
                }
            },
            queryCircle() {

//                var h = this.$createElement;
//                var that = this;
//                Util.ajax('/api/graph/pathList', {
//                    headers: {
//                        'Access-Control-Allow-Origin': '*',
//                    }
//                }).then(function (response) {
//                    var elements = [];
//                    var message = {
//                        name: 'circle',
//                        display: '疑点环',
//                        messageList: []
//                    };
//                    for (let i in response.data.data) {
//                        var curName = response.data.data[i].startNode.name;
//                        elements.push(h('li', null, [h('span', null, curName + ' '), h('a', {
//                            attrs: {
//                                href: '/explore?type=circle' + '&pathId=' + response.data.data[i].startNode.id,
//                                target: '_blank'
//                            }
//
//                        }, ' 查看详情>>')]));
//                        message.messageList.push({
//                            id: response.data.data[i].startNode.id,
//                            name: curName,
//                            type: 'circle'
//                        })
//                    }
//                    that.$set(that.messages, 'circle', message);
//
//                    if (that.activeItem == 'overview' && response.data.data.length > 0)
//                        that.$notify({
//                            title: '疑点环',
//                            message: h('ul', null, elements),
//                            type: 'warning',
//                            duration: 0
//                        });
//                });
            }

        }
    }
</script>