<style scoped>
    .filter-form {
        background-color: white;

        width: 320px;
        position: absolute;
        top: 50px;
        left: 10px;
        overflow: auto;
        z-index: 2;
        height: 100%;
        box-shadow: 0px 0px 2px #ccc;
        padding: 12px 2px
    }

    .graph-container {
        position: absolute;
        top: 0;
        right: 0;
    }

    .refresh-button {
        position: absolute;
        top: 55px;
        left: 248px;
        z-index: 3;
    }

    .reset-button {
        position: absolute;
        top: 55px;
        left: 185px;
        z-index: 3;
    }
</style>
<template>
    <div v-on:edgeDetail="showEdgeDetail" v-on:nodeDetail="showNodeDetail">
        <!--<node-detail-modal ref="nodeDetailModal"></node-detail-modal>-->
        <!--<link-detail-modal ref="linkDetailModal"></link-detail-modal>-->
        <!--<Button v-if="inited" type="primary" icon="play" @click="" class="refresh-button" size="small"-->
                <!--@click="doFilter">筛选-->
        <!--</Button>-->
        <!--<Button v-if="inited" type="ghost" icon="refresh" @click="" class="reset-button" size="small"-->
                <!--@click="resetFilter">复位-->
        <!--</Button>-->
        <!--<div v-show="inited" class="filter-form" ref="filterContainer">-->
            <!--<div v-for="(entity,typeName) in filters" :key="typeName">-->
                <!--<entity-filter v-show="!inited||entity.exists==true" :ref="typeName" :entity="entity"></entity-filter>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div ref="graphContainer" style="min-height: 500px" class="graph-container"></div>-->
    </div>
</template>
<script>
//    import echarts from '../libs/echarts-modified.min';
//    import EChartsGraph from '../libs/echarts-graph';
//    import dictionary from '../config/dictionary';
//    import entityFilter from '../components/entityFilter.vue';
//    import Util from '../libs/util';
//    import nodeDetailModal from '../components/nodeDetailModal.vue';
//    import linkDetailModal from '../components/linkDetailModal.vue';
//
//
//    export default {
//        components: {
//            'entity-filter': entityFilter,
//            'node-detail-modal': nodeDetailModal,
//            'link-detail-modal': linkDetailModal
//
//        },
//        props: ['contextMenuItem', 'width', 'height', 'enablePrev'],
//        mounted() {
//            var that = this;
//
//            var id = function guid() {
//                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                    return v.toString(16);
//                });
//            }();
//            id = 'graph-' + id;
//            this.$refs.graphContainer.id = id;
//            this.id = id;
//            this.$refs.filterContainer.style.height = this.height;
//            this.height && ( this.$refs.graphContainer.style.height = this.height + 'px')
//            && (this.$refs.filterContainer.style.height = (this.height - 65) + 'px');
//            this.width && ( this.$refs.graphContainer.style.width = this.width + 'px');
//            this.graph = EChartsGraph.init({
//                onGraphUpdated: function (shownNodes, hiddenNodes) {
//                    that.$emit('graphUpdated', {shownNodes: shownNodes, hiddenNodes: hiddenNodes});
//                },
//                theme: Util.theme,
//                graphContainerId: that.id,
//                labeledNodePercentage: -1,
//                contextMenuItem: (
//                    function () {
//                        var ret = {};
//                        that.contextMenuItem && (ret = that.contextMenuItem );
////                        ret.details = that.detailsContextMenuItem;
//                        return ret;
//                    }
//                    ()),
//                echartsCategories: {
//                    CURRENT_NODE: {
//                        ignoreFilter: true,
//                        name: 'CURRENT_NODE',
//                        symbolSize: 40,
//                        label: {
//                            normal: {
//                                position: 'inside',
//                                show: true,
//                                textStyle: {
//                                    fontSize: 13,
//                                    color: Util.theme != 'dark' ? 'black' : '#eee'
//                                }
//                            },
//                            emphasis: {
//                                show: true,
//                                textStyle: {
//                                    fontSize: 15,
//                                    fontWeight: 800,
//                                    color: Util.theme != 'dark' ? 'black' : '#eee'
//                                }
//                            }
//                        }
//                    }
//                },
//                echartsOptioins: {
//                    toolbox: {
//                        feature: that.enablePrev ? {myGraphGoback: that.prevGraphToolboxFeature} : {}
//                    }
//                }
//
//            });
//        },
//        data() {
//            var that = this;
//            return {
//                inited: false,
//                id: '',
//                graph: {},
//                exploreHistory: [],
//                filters: dictionary.linkTypes,
//                prevGraphToolboxFeature: {
//                    name: 'myGraphGoback',
//                    title: '返回上一探索中心点',
//                    icon: 'path://M1792 416q0 -166 -127 -451q-3 -7 -10.5 -24t-13.5 -30t-13 -22q-12 -17 -28 -17q-15 0 ' +
//                    '-23.5 10t-8.5 25q0 9 2.5 26.5t2.5 23.5q5 68 5 123q0 101 -17.5 181t-48.5 ' +
//                    '138.5t-80 101t-105.5 69.5t-133 42.5t-154 21.5t-175.5 6h-224v-256q0 -26 -19 -45t-45 -19t-45 19 ' +
//                    'l-512 512q-19 19 -19 45t19 45l512 512q19 19 45 19t45 -19t19 -45v-256h224q713 0 875 -403q53 -134 53 -333z',
//                    onclick: that.prevGraph
//                }
//            }
//        },
//        methods: {
//            showNodeDetail(e) {
//                this.$refs.nodeDetailModal.showModal(this.graph.graph.nodes[e.detail.id]);
//            },
//            showEdgeDetail(e) {
//                var links = this.graph.graph.getFilteredLinks(e.detail.source, e.detail.target);
//                var info = {
//                    title: this.graph.graph.nodes[e.detail.source].name + '->' + this.graph.graph.nodes[e.detail.target].name,
//                    source: e.detail.source,
//                    target: e.detail.target
//                };
//                var type2Links = {}, typeCount = 0, paymentCount = 0;
//                for (let i in links) {
//                    if (!type2Links[links[i].type.name]) {
//                        type2Links[links[i].type.name] = [];
//                        typeCount++;
//                    }
//                    if (links[i].type.name != 'PAYMENT')
//                        type2Links[links[i].type.name].push(links[i]);
//                    else
//                        paymentCount++;
//                }
//                info.type2Links = type2Links;
//                info.typeCount = typeCount;
//                info.paymentCount = paymentCount;
//                info.paymentFilter = this.graph.graph.filter.link.PAYMENT;
//                this.$refs.linkDetailModal.showModal(info);
//            },
//            clear() {
//                this.inited = false;
//                this.exploreHistory = [];
//                        this.graph.clearGraph();
//                },
//                    mergeData(response, markNewData, goBackThenMerge, ignoreHistory) {
//                        this.inited = true;
//                        this.graph.chart.hideLoading();
//                        if (response.data.status > 0) {
//                            this.$message({
//                                showClose: true,
//                        message:'服务器异常，Message= ' + response.data.msg,
//                        type: 'error'
//                    });
//                    return;
//                }
//                if (!response.data.nodes) {
//                    this.$message({
//                        showClose: true,
//                        message: '暂无数据',
//                        type: 'warning'
//                    });
//                    return;
//                }
//                if (this.exploreHistory.length > 0)
//                    this.graph.resetNodeCategory(this.exploreHistory[this.exploreHistory.length - 1]);
//                if (response.data.curNode && !ignoreHistory)
//                    this.exploreHistory.push(response.data.curNode.id);
//
//                if (markNewData) {
//                    for (let i in response.data.nodes) {
//                        response.data.nodes[i].marked = true;
//                    }
//                    for (let j in response.data.links) {
//                        response.data.links[j].marked = true;
//                    }
//                    if (response.data.curNode)
//                        response.data.curNode.marked = true;
//                }
//
//                if (goBackThenMerge) {
//                    if (this.exploreHistory.length > 0)
//                        this.exploreHistory.pop();
//                    this.graph.prevGraph(true);
//                }
//
//                if (response.data.curNode)
//                    response.data.nodes = response.data.nodes.concat(response.data.curNode);
//                this.graph.mergeData(response.data.nodes, response.data.links, ignoreHistory);
//                if (response.data.curNode)
//                    this.graph.setNodeCategory(response.data.curNode.id, 'CURRENT_NODE');
//
//                this.graph.resetOperation().drawGraph();
//                this.updateFilters();
//            },
//            prevGraph() {
//                if (this.exploreHistory.length == 1)
//                    return;
//                var currentMainNode = this.exploreHistory.pop();
//                if ((currentMainNode + '').indexOf('-') < 0) {
//                    this.graph.resetNodeCategory(currentMainNode);
//                    this.graph.setNodeCategory(this.exploreHistory[this.exploreHistory.length - 1], 'CURRENT_NODE');
//                }
//                this.graph.prevGraph();
//                this.graph.resetGraph();
//                this.updateFilters();
//                this.$emit('prevGraph');
//            },
//            updateFilters() {
//                for (var typeName in this.graph.graph.filter.link) {
//                    this.$set(this.filters[typeName], 'exists', this.graph.graph.filter.link[typeName].exists);
//                    if (!this.graph.graph.filter.link[typeName].exists) continue;
//                    if (this.$refs[typeName])
//                        this.$refs[typeName][0].update(this.graph.graph.filter.link[typeName]);
//
//                    if (!this.filters[typeName]) {
//                        this.filters[typeName] = {
//                            name: typeName,
//                            display: typeName
//                        }
//                    }
//                }
//            },
//            doFilter() {
//                var filter = {};
//                for (var typeName in this.filters) {
//                    filter[typeName] = this.$refs[typeName][0].getData();
//                }
//                this.graph.doFilter({link: filter});
//            },
//            resetFilter() {
//                this.graph.graph.resetFilter();
//                this.graph.drawGraph();
//                this.updateFilters();
//            }
//
//
//        }
//
//    }
</script>