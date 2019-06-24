<style scoped>
    .search-bar-container .ivu-input-group-append {
        margin-left: -1px;
        padding: 7px 20px 7px 10px;
    }
</style>
<template>
    <div class="layout">
        <Modal v-model="showModal" title="在邻居节点中搜索" @on-ok="secondSearch" :width="580">
            <search-bar :maxSelect="maxNodeSelect" :width="540" :queryUrlBuilder="buildSecondSearchUrl"
                        ref="secondSearchBar"></search-bar>
        </Modal>
        <list-neighbor-modal ref="listNeighborModal"></list-neighbor-modal>
        <div class="layout-content" :style="'height:'+height+'px'">
            <div class="search-bar-container" style="display:none;position:absolute;left:500px;top:10px;display: inline-flex;z-index: 101;zoom:1.1;">
            <div style="z-index: 1000">
                    <div style="float:left">
                        <selectPageBar ref="selectPageBar"></selectPageBar>
                    </div>
                    <div style="float:left">
                        <selectPageBar1 ref="selectPageBar2"></selectPageBar1>
                    </div>

                </div>
                <div style="margin-left: 0;">
                    <Button icon="ios-search" class="ivu-input-group-append" @click="exploreGraphSearch"></Button>
                </div>
            </div>
            <graph :height="height" ref="graph" :contextMenu="contextMenuItem" :onGoBack="prevBasicInformation">
                <Card>
                    <p slot="title">
                        当前中心
                    </p>

                    <span>当前中心：</span><span
                        v-if="basicInformation&&basicInformation.name">{{basicInformation.name}}</span>
                    <br>
                    <span>邻居节点共 </span><span
                        v-if="basicInformation&&basicInformation.pageInfo">{{basicInformation.pageInfo.totalElements}} 个</span>
                    <br>
                    <span v-if="basicInformation&&basicInformation.pageInfo">当前第{{basicInformation.pageInfo.page + 1}}页 </span><br>
                    <span v-if="basicInformation&&basicInformation.pageInfo">共 {{basicInformation.pageInfo.totalPages}} 页， {{basicInformation.pageInfo.size}}个节点/页</span><br>
                    <Button-group style="margin-top: 10px">
                        <Button type="primary" size="small" @click="prevPage" title="上一页"
                                :disabled="basicInformation&&basicInformation.pageInfo&&basicInformation.pageInfo.first">
                            <Icon type="chevron-left"></Icon>
                        </Button>
                        <Button type="primary" size="small" title="下一页"
                                :disabled="basicInformation&&basicInformation.pageInfo&&basicInformation.pageInfo.last"
                                @click="nextPage">
                            <Icon type="chevron-right"></Icon>
                        </Button>
                        <Button type="ghost" size="small"
                                @click="showSecondSearchModal" :disabled="!basicInformation||!basicInformation.id"
                                icon="ios-search">
                            结果搜索
                        </Button>
                        <Button type="ghost" size="small"
                                @click="showListNeighborModal" :disabled="!basicInformation||!basicInformation.id"
                                icon="ios-list-outline">
                            列表模式
                        </Button>

                    </Button-group>
                </Card>
            </graph>
        </div>

    </div>
</template>
<script>
    import copy from './copy.vue';
    import graph from '../components/cytoscapeGraph.vue';
    import Util from '../libs/util';
    import searchBar from '../components/multipleSearchBar.vue';
    import listNeighborModal from '../components/listNeighborModal.vue'
    import searchBar1 from '../components/paginationSearchBar.vue';
    import selectPageBar from '../components/newselectBar.vue';
    import selectPageBar1 from '../components/newselectBar2.vue';

    export default {
        watch: {
            $route(to, from) {
                this.routeChanged(to);
            }
        },
//        mounted() {
//            this.routeChanged(this.$router.currentRoute);
//        },
        components: {
            'layout-copy': copy,
            'graph': graph,
            'search-bar': searchBar,
            'search-bar1': searchBar1,
            'list-neighbor-modal': listNeighborModal,
            'selectPageBar': selectPageBar,
            'selectPageBar1': selectPageBar1,


        },
        data() {
            var that = this;
            return {
                doubleType:2,
                nodeSelect: [],
                nodeSelectTwo: [],
                maxNodeSelect1: 2,
                searchBarWidth: Math.max(window.screen.availWidth * 0.35, 350),
                contextMenuItem: {
                    realControl: {
                        content: '查看控股链',
                        available: function (ele) {
                            return ele.data('type').name == 'Company';
                        },
                        select: function (ele, event) {
                            that.exploreInvestmentChain(ele.data('origin').id,ele.data('origin').name);

                        }
                    },
                    explore: {
                        content: '探索',
                        available: function (ele) {
                            return true;
                        },
                        select: function (ele, event) {
                            that.exploreGraph('/api/graph/neighbor?id=' + ele.data('origin').id + '&name='+ele.data('origin').name+'&page=0&size=15');
                        },
                    },
                    // cancel: {
                    //     content: '取消',
                    //     available: function (ele) {
                    //         return true;
                    //     },
                    //     select: function (ele) {
                    //     },
                    // }
                },

                //结果搜索模态框
                showModal: false,

                height: window.screen.availHeight - 220,
                width: window.screen.availWidth - 60,

                //结果搜索最多可选节点
                maxNodeSelect: 5,

                //当前中心节点基本信息
                basicInformation: {
                    pageInfo: {
                        page: 0,
                        totalPages: 0,
                        size: 15,
                        first: true,
                        last: true
                    }
                },

                //中心节点基本信息历史记录
                basicInformationHistory: [],
            }
        },
        methods: {
            exploreGraphSearch() {
                this.nodeSelect = this.$refs.selectPageBar.getSelected();
                this.nodeSelectTwo = this.$refs.selectPageBar2.getSelected();
                var name1 = this.$refs.selectPageBar.getSelectedName();
                var name2 = this.$refs.selectPageBar2.getSelectedName();
                if (this.nodeSelect == '' || this.nodeSelectTwo == '') {
                    alert("两个查找的目标都不能为空")
                };
                this.$refs.graph.clear();
                this.doubleExploreResult({
                    id1:this.nodeSelect,
                    id2:this.nodeSelectTwo,
                    name1:name1,
                    name2:name2,
                })
            },
            showListNeighborModal() {
                this.$refs.listNeighborModal.showModal(this.basicInformation);
            },

            /**
             * 通过路由，获取页面初始加载（或者路径改变）时的参数，根据参数请求后台画图
             * @param to
             */
            doubleExploreResult(params){
                this.exploreNode(params.id1, params.id2,params.name1,params.name2);
            },
            secondSearch() {
                if (this.basicInformation && this.basicInformation.id && this.$refs.secondSearchBar.getSelected().length > 0)
                    this.exploreGraph('/api/graph/secondQuery?id=' + this.basicInformation.id + '&ids=' + this.$refs.secondSearchBar.getSelected().join(','), false, false, true, true);

            },
            showSecondSearchModal() {
                this.showModal = true;
                this.$refs.secondSearchBar.refresh();

            },
            buildSecondSearchUrl(query, nodeType) {
                if (nodeType == 'Person' && Util.testPersonUid(query))
                    return '/api/graph/queryNeighborUid?id=' + this.basicInformation.id + '&name=' + query ;
                return '?id=' + this.basicInformation.id + '&name=' + query;
            },


            prevBasicInformation() {
                if (this.basicInformationHistory.length <= 1) return;
                this.basicInformationHistory.pop();
                this.$set(this, 'basicInformation', this.basicInformationHistory[this.basicInformationHistory.length - 1]);
            },
            prevPage() {
                if (!this.basicInformation.id || !this.basicInformation.pageInfo) return;
                if (this.basicInformation.pageInfo.page - 1 < 0) return;
                var url = '/api/graph/neighbor?id=' + this.basicInformation.id
                    + '&page=' + (this.basicInformation.pageInfo.page - 1)
                    + '&size=' + (this.basicInformation.pageInfo.size);
                this.exploreGraph(url, false, true);
            },
            nextPage() {
                if (!this.basicInformation.id || !this.basicInformation.pageInfo) return;
                if (this.basicInformation.pageInfo.page + 1 > this.basicInformation.pageInfo.totalPages) return;
                var url = '/api/graph/neighbor?id=' + this.basicInformation.id
                    + '&page=' + (this.basicInformation.pageInfo.page + 1)
                    + '&size=' + (this.basicInformation.pageInfo.size);
                this.exploreGraph(url, false, true);
            },
            exploreDoubts(type, id) {
                var that = this;
                that.$refs.graph.cytoScapeGraph.clearGraph();
                that.$refs.graph.cytoScapeGraph.showLoading();
                /*$.post('/api/graph/' + type+ '?id=' +id,function (data) {
                    that.$refs.graph.cytoScapeGraph.hideLoading();
                    that.$refs.graph.mergeData(data, true, false, false, false);
                    that.basicInformation.pageInfo={}
                })*/
                var param = {id:id};
                that.$http.post('/api/graph'+type,that.querystring.stringify(param))
                    .then(function(response){
                        that.$refs.graph.cytoScapeGraph.hideLoading();
                        that.$refs.graph.mergeData(response.data, true, false, false, false);
                        that.basicInformation.pageInfo={}
                    })
            },

            exploreNode(id1, id2,name1,name2) {
                this.exploreGraph('/api/graph/pathBetween?id1=' + id1 + '&id2=' + id2 +'&name1=' + name1 +'&name2=' + name2 + '&hops=3');
            },


            exploreInvestmentChain(id,name) {
                this.exploreGraph('/api/graph/getInvestmentChain?id='+id+'&name=' + name);
            },

            /**
             * 请求后台，返回nodequeryresult进行画图,用cytoscape进行画图
             * @param url
             * @param markNewData 标记新数据（点、边加红色边框）
             * @param goBackThenMerge 首先将图回退至上一版本，再进行数据合并
             * @param ignoreVersion 忽略版本数据，插入的新数据数据当前最新版本的数据
             * @param spotlightNode 突出新加的节点信息（节点变大，有黑色边框）
             */
            exploreGraph(url, markNewData, goBackThenMerge, ignoreVersion, spotlightNode) {
                var that = this;
                that.$refs.graph.cytoScapeGraph.showLoading();
                $.post(url, function (data) {
                    that.$refs.graph.cytoScapeGraph.hideLoading();
                    that.$refs.graph.mergeData(data, markNewData, goBackThenMerge, ignoreVersion, spotlightNode);

                    if (data.page && !ignoreVersion) {
                        that.basicInformation = data.data.nodes.filter(function(o){return o.id === data.data.curNode})[0];
                        that.$set(that.basicInformation, 'pageInfo', data.page);
                        that.basicInformationHistory.push(that.basicInformation);
                    }
                });
            }
        }

    };
</script>