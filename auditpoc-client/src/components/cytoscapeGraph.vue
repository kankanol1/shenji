<style scoped>
    .graph-filter {
        width: 350px;
        height: 100%;
        overflow-y: auto;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 101;
    }

    .graph {
        position: absolute;
        top: 0;
        left: 0px;
        /*left: 350px;*/
        right: 0;
        bottom: 0;
    }
    .leftGraph {
        position: absolute;
        top: 0;
        right: 350px;
        left: 0;
        bottom: 0;
        z-index:100;
    }
    .container {
        position: relative;
        border:none;
    }
    .leftIcon {
        margin-left: 20px;
    }
    .rightIcon {
        position:absolute;
        right:20px;
    }
    .rightIconBox{
        height:27px;
    }
    .iconBackground{
        font-size: 14px;
        cursor:pointer;
        margin-bottom: 2px;
        border-color: rgba(0, 0, 0, 1) rgba(0, 0, 0, 1) rgba(0, 0, 0, 1);
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2) inset, 0 1px 2px rgba(0, 0, 0, 0.2);
        padding: 6px 8px;
        border-radius: 2px;
    }
    .showBar{
        display: block;
    }
    .hideBar{
        display: none;
    }
</style>
<template>
    <div style="overflow: hidden">
        <node-modify-modal ref="nodeModifyModal"></node-modify-modal>
        <link-modify-modal ref="linkModifyModal"></link-modify-modal>
        <node-detail-modal ref="nodeDetailModal"></node-detail-modal>
        <link-detail-modal ref="linkDetailModal"></link-detail-modal>
        <div class="rightIconBox">
            <Icon type="navicon-round" @click="foldUnfold" class="iconBackground" :class="rightIcon"></Icon>
        </div>
        <div class="container" :style="'height:'+height+'px;'">
            <div class="graph-filter" :class = "[isShowBar ? hideBar : showBar]" :style="'height:'+height+'px;'">
                <slot></slot>
                <Card :padding="12">
                    <p slot="title">
                        关系筛选
                    </p>
                    <ButtonGroup slot="extra">
                        <Button size="small" type="ghost" icon="refresh" @click="resetFilter(true)">复位</Button>
                        <Button type="primary" size="small" icon="play" @click="doFilter">筛选</Button>
                    </ButtonGroup>
                    <!--<div ref="linkFilterContainer" style="height: 300px;overflow-y: auto">-->
                    <div ref="linkFilterContainer" style="overflow-y: auto" :style="'height:'+height * 0.7+'px;'">
                        <entity-filter v-for="(entity,typeName) in linkTypes" :key="typeName" :ref="typeName"
                                       :entity="entity"></entity-filter>
                    </div>
                </Card>
            </div>
            <!--<div class="graph">-->
            <div :class="[isActive ? graph : leftGraph]">
                <div style="height:100%;" ref="graph"></div>
            </div>
        </div>
        <div ref="nodeTooltip" style="display: none">
            <p v-if="tooltipNodeData.type">
                <span style="float: left"><strong>类型：</strong>{{nodeTypes[tooltipNodeData.type].display}} </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a style="float: right" @click="showNodeDetail">查看详情>></a><br/>
                <!--<a style="float: right" @click="infoModify">信息修改>></a><br/>-->
                <!--<a style="float: right" @click="deleteNode">删除>></a>-->
            </p>
            <div v-if="tooltipNodeData.type">
                <p v-for="propertyData in nodeTypes[tooltipNodeData.type].properties">
                <span v-if="tooltipNodeData.propertyList[propertyData.name]">
                    <strong>{{propertyData.display}}：</strong>
                    <span v-if="propertyData.date">
                            {{ new Date(tooltipNodeData.propertyList[propertyData.name]).Format(propertyData.dateFormat ? propertyData.dateFormat : 'yyyy.MM')}}
                    </span>
                    <span v-else-if="propertyData.decimal">{{tooltipNodeData.propertyList[propertyData.name].toFixed(2)}}</span>
                    <span v-else>{{tooltipNodeData.propertyList[propertyData.name]}}</span>
                </span>
                </p>
            </div>
        </div>
        <div ref="linkTooltip" style="display: none">
            <div v-if="tooltipLinkData.loading" style="text-align: center;font-size: 15px;padding: 10px">加载中...</div>
            <div v-if="!tooltipLinkData.loading">
                <strong>总数：</strong>
                {{tooltipLinkData.total}}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <strong>当前：</strong>
                {{tooltipLinkData.current}}/{{tooltipLinkData.total}}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a style="float: right" @click="showLinkDetail">查看全部>></a>
                <!--<div v-if="tooltipLinkData.linkData.length>0"
                           v-for="value in tooltipLinkData.linkData"
                           style="float: left;width: 50%;padding:5px;border-left: 2px solid #e9eaec;margin-bottom: 5px">
                <div v-if="value.propertyList" v-for="propertyData in linkTypes[value.type].properties">
                        <span v-if="value.propertyList[propertyData.name]">
                            <strong>{{propertyData.display}}：</strong>
                            <span v-if="propertyData.date">
                                {{ new Date(value.propertyList[propertyData.name]).Format(propertyData.dateFormat ? propertyData.dateFormat : 'yyyy.MM')}}
                            </span>
                            <span v-else-if="propertyData.decimal">
                                {{value.propertyList[propertyData.name].toFixed(2)}}
                            </span>
                            <span v-else>{{value.propertyList[propertyData.name]}}</span>
                        </span>
                </div>
            </div>-->
                <div v-if="tooltipLinkData.linkData.length>0">
                    <el-table :height="200" :columns="table.columns" :data="tableDatas" :loading="table.loading">
                        <el-table-column v-for="( item,key, index) in cols" :label="item.title" :key="item.key">
                            <template slot-scope="scope">
                                <span style="margin-left: 0px">{{ scope.row[item.key]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    // node/link types and filters
    import dictionary from '../config/dictionary';

    //layouts
    import 'cytoscape-cola';

    //context menu
    import '../libs/cytoscape/cytoscape-cxtmenu';

//    //tooltip
    import 'qtip2/dist/jquery.qtip.min';
    import 'qtip2/dist/jquery.qtip.min.css';

    //toolbar
    import '../libs/cytoscape/cytoscape-toolbar';
    import 'font-awesome/css/font-awesome.css';

    //expand-collapse
    import '../libs/cytoscape/cytoscape-undo-redo';
    import '../libs/cytoscape/cytoscape-expand-collapse';

    import '../libs/cytoscape/cytoscape-graph';

    //custom css
    import '../libs/cytoscape/cytoscape-graph-style.css';

    // node/link detail components
    import nodeDetailModal from '../components/nodeDetailModal.vue';
    import linkDetailModal from '../components/linkDetailModal.vue';

    //link filters
    import entityFilter from '../components/entityFilter.vue';
    import nodeModifyModal from '../components/nodeModifyModal.vue';
    import linkModifyModal from '../components/linkModifyModal.vue';
    export default {
        components: {
            'node-detail-modal': nodeDetailModal,
            'link-detail-modal': linkDetailModal,
            'entity-filter': entityFilter,
            'node-modify-modal': nodeModifyModal,
            'link-modify-modal':linkModifyModal
        },
        props: {
            height: {
                type: Number,
                default: window.screen.availHeight - 70
            },
            contextMenu: {
                type: Object
            },
            onGoBack: {
                type: Function
            }

        },
        data() {
            return {
                graph: 'graph',
                leftGraph: 'leftGraph',
                leftIcon: 'leftIcon',
                rightIcon: 'rightIcon',
                showBar:'showBar',
                hideBar:'hideBar',
                iconIsActive:true,
                isActive:true,
                isShowBar:true,
//                showBar:false,
                curNodeHistory: [],
                currentMergeTime: 0,
                //cytoscape-graph实例
                cytoScapeGraph: {},
                //当前提示框数据（节点）
                tooltipNodeData: {
                    type: '',
                    propertyList: []
                },
                //当前提示框数据（关系）
                tooltipLinkData: {
                    loading: true,
                    total: 0,
                    current: 0,
                    linkData: []
                },
                //节点类型字典
                nodeTypes: dictionary.nodeTypes,
                //关系类型字典
                linkTypes: dictionary.linkTypes,
                //不参与筛选的关系矩阵（两点之间所有的关系类型)格式类型{a:{b:{type:{mergeTime:mergeTime,id:id},...}},...}
                allLinks: {},
                //不参与筛选的所有节点格式类型{a:{mergeTime:mergeTime,id:id},...}
                allNodes: {},
                table: {
                    columns: [],
                    data: [],
                    loading: true
                },
                cols:[],
                tableDatas:[],
            }
        },
        methods: {
            foldUnfold(){
                this.isShowBar = !this.isShowBar;
                this.isActive = !this.isActive;
                this.iconIsActive = !this.iconIsActive;
            },
            showMessage(){
                this.$message({
                    showClose: true,
                    message: '没有导出权限',
                    type: 'warning'
                });
            },
            /**
             * 清空当前图
             */
            clear() {
                this.currentMergeTime = 0;
                this.cytoScapeGraph.clearGraph();
                this.allLinks = {};
                this.resetFilter(false);
            },
            /**
             * 重置筛选器
             * @param redraw 是否进行图像重画(图像重画不会发生版本更新)
             */
            resetFilter(redraw) {
                for (var linkType in this.linkTypes) {
                    this.$refs[linkType][0].reset()
                }
                if (redraw)
                    this.doFilter();
            },
            /**
             * 执行筛选,图像重画（不进行版本更新）
             */
            doFilter() {
                var that = this;
                $.ajax({
                    url: '/api/graph/filter',
                    method: 'post',
                    data: {
                        links: (function () {
                            var start2End2LinkTypes = {};
                            for (var start in that.allLinks) {
                                start2End2LinkTypes[start] = {};
                                for (var end in that.allLinks[start]) {
                                    start2End2LinkTypes[start][end] = [];
                                    for (var type in that.allLinks[start][end]) {
                                        start2End2LinkTypes[start][end].push(type);
                                    }
                                }
                            }
                            return JSON.stringify(start2End2LinkTypes);
                        }()),
                        filter: function () {
                            var typeName2Filters = {};
                            for (var linkType in that.linkTypes) {
                                var filter = that.$refs[linkType][0].getData();
                                if (!that.$refs[linkType][0].isEnabled()) continue;
                                if (!typeName2Filters[linkType])
                                    typeName2Filters[linkType] = [];
                                typeName2Filters[linkType] = typeName2Filters[linkType].concat(filter);
                            }
                            return JSON.stringify(typeName2Filters);
                        }()
                    },
                    success: function (data) {
                        //把所有的数据一起删掉，重画新图
                        that.cytoScapeGraph.clearGraph();
                        that.mergeData(data, false, false, true, false, true);//不进行版本更新
                    }
                });

            },
            /**
             * 关系提示框中的查看详情
             * @param e
             */
            showLinkDetail(e) {
//                this.$refs.linkDetailModal.showModal(this.tooltipLinkData.source.data(), this.tooltipLinkData.target.data(), this.tooltipLinkData.type);
                this.$refs.linkDetailModal.showModal(this.tooltipLinkData);
            },
            /**s
             * 节点提示框中的查看详情
             * @param e
             */
            showNodeDetail(e) {
                this.$refs.nodeDetailModal.showModal(this.tooltipNodeData);
            },
            infoModify(e) {
                this.$refs.nodeModifyModal.showModal(this.tooltipNodeData);
            },
            infoModifyLink(){
                this.$refs.linkModifyModal.showModal(this.tooltipLinkData);
            },
            deleteNode(){
                var that = this;
                that.$http.post("/api/node/deleteNode", that.querystring.stringify({
                    "id": that.tooltipNodeData.id,
                    "type": "vertex"
                }))
                    .then(response => {
                        if (response.data.status == 1) {
                            that.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                        } else if (response.data.status == 0) {
                            that.$message({
                                showClose: true,
                                message: '删除失败',
                                type: 'warning'
                            });
                        }
                    })
            },
            deleteLink(){
                var that = this;
                that.$http.post("/api/node/deleteNode", that.querystring.stringify({
                    "id": that.tooltipNodeData.id,
                    "type": "edge"
                }))
                    .then(response => {
                        if (response.data.status == 1) {
                            that.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                        } else if (response.data.status == 0) {
                            that.$message({
                                showClose: true,
                                message: '删除失败',
                                type: 'warning'
                            });
                        }
                    })
            },
            /**
             * 合并当前图，并更新到下一版本
             * @param data
             * @param markNewData 为data中每一个节点（边）加marked类（红色边框）
             * @param goBackThenMerge 先回退到上一版本，再执行合并与版本更新
             * @param ignoreVersion 将data的数据合并到当前版本，不执行版本更新
             * @param spotlightNodes 为data中的节点信息加spotlight类（节点变大，黑色边框）
             * @param randomizeNodes 随机节点位置（初始布局使用）
             */
            mergeData(data, markNewData, goBackThenMerge, ignoreVersion, spotlightNodes, randomizeNodes) {
                if (data.status== 30003) {
                    this.$message({
                        showClose: true,
                        message: data.msg,
                        type: 'error'
                    });
                    return;
                }
                if (!data.data.nodes) {
                    this.$message({
                        showClose: true,
                        message: '暂无数据',
                        type: 'warning'
                    });
                    return;
                }
                if (goBackThenMerge) {
                    this.goBack();
                }
                var nodes = data.data.nodes||[],
                    links = data.data.links||[];
                // nodes = nodes.concat(data.data.curNode ? data.data.curNode : []);
                // nodes = nodes.concat(data.data.endNode ? data.data.endNode : []);
                this.cytoScapeGraph.mergeData(nodes, links, randomizeNodes);
                var linkIds = links.map(function (value) {
                        return '#link-' + value.id
                    }).join(', '),
                    nodeIds = nodes.map(function (value) {
                        return '#node-' + value.id
                    }).join(', ');
                if (markNewData) {
                    this.cytoScapeGraph.cy.elements(linkIds).addClass('marked');
                    this.cytoScapeGraph.cy.elements(nodeIds).addClass('marked');
                }
                if (spotlightNodes) {
                    this.cytoScapeGraph.cy.elements(nodeIds).addClass('spotlight');
                    this.cytoScapeGraph.cy.elements('#node-' + data.data.curNode).removeClass('spotlight');
                }
                if (data.data.curNode) {
                    if (this.curNodeHistory.length > 0)
                        this.cytoScapeGraph.cy.elements('#node-' + this.curNodeHistory[this.curNodeHistory.length - 1]).removeClass('curNode');
                    this.cytoScapeGraph.cy.elements('#node-' + data.data.curNode).addClass('curNode');
                    this.curNodeHistory.push(data.data.curNode);
                } else if (this.curNodeHistory.length > 0) {
                    this.cytoScapeGraph.cy.elements('#node-' + this.curNodeHistory[this.curNodeHistory.length - 1]).addClass('curNode');
                }

                if (data.data.endNode) {
                    this.cytoScapeGraph.cy.elements('#node-' + data.data.endNode).addClass('curNode');
                }
                //data.centerNodes = [8240,4144];
                if (data.data.centerNodes) {
                    for (var index in data.data.centerNodes) {
                        var id = data.data.centerNodes[index];
                        this.cytoScapeGraph.cy.elements('#node-' +id).addClass('center');
                    }
                }
                if (data.data.middleNodes) {
                    for (var index in data.data.middleNodes) {
                        var id = data.data.middleNodes[index];
                        this.cytoScapeGraph.cy.elements('#node-' +id).addClass('middle');
                    }
                }


                //allLinks/allNodes原来存在的数据版本更新
                if (!ignoreVersion) {
                    for (var start in this.allLinks)
                        for (var end in this.allLinks[start])
                            for (var type in this.allLinks[start][end]) {
                                this.allLinks[start][end][type].mergeTime++;
                            }
                    for (var nodeId in this.allNodes) {
                        this.allNodes[nodeId].mergeTime++;
                    }
                    this.currentMergeTime++;
                }

                //之前不存在的加入allLinks/allNodes
                for (var i in links) {
                    if (!this.allLinks[links[i].startNode])
                        this.allLinks[links[i].startNode] = {};
                    if (!this.allLinks[links[i].startNode][links[i].endNode])
                        this.allLinks[links[i].startNode][links[i].endNode] = {};
                    if (!this.allLinks[links[i].startNode][links[i].endNode][links[i].type])
                        this.allLinks[links[i].startNode][links[i].endNode][links[i].type] = {
                            id: links[i].id,
                            mergeTime: 1
                        };
                }
                for (var j in nodes) {
                    if (!this.allNodes[nodes[j].id])
                        this.allNodes[nodes[j].id] = {
                            id: nodes[j].id,
                            mergeTime: 1
                        };
                }
            },
            /**
             * 版本回退
             */
            goBack() {
                if (this.currentMergeTime < 1) return;
                if (this.curNodeHistory.length > 0) {
                    var prevNode = this.curNodeHistory.pop();
                    this.cytoScapeGraph.cy.elements('#node-' + prevNode).removeClass('curNode');
                    if (this.curNodeHistory.length > 0)
                        this.cytoScapeGraph.cy.elements('#node-' + this.curNodeHistory[this.curNodeHistory.length - 1]).addClass('curNode');
                }


                this.currentMergeTime--;
                var elementIds2Remove = [];
                for (var start in this.allLinks)
                    for (var end in this.allLinks[start])
                        for (var type in this.allLinks[start][end]) {
                            this.allLinks[start][end][type].mergeTime--;
                            if (this.allLinks[start][end][type].mergeTime == 0) {
//                                elementIds2Remove.push('#link-' + this.allLinks[start][end][type].id);
                                delete this.allLinks[start][end][type];
                            }
                        }
                for (var nodeId in this.allNodes) {
                    this.allNodes[nodeId].mergeTime--;
                    if (this.allNodes[nodeId].mergeTime == 0) {
                        elementIds2Remove.push('#node-' + this.allNodes[nodeId].id);
                        delete this.allNodes[nodeId];
                    }
                }
                if (elementIds2Remove.length > 0) {
                    var nodes2Remove = this.cytoScapeGraph.cy.elements(elementIds2Remove.join(' ,'));
                    nodes2Remove.connectedEdges().remove();
                    nodes2Remove.remove();
                }
                (this.onGoBack) && this.onGoBack();
            }
        },
        mounted() {
            $(this.$refs.linkFilterContainer).height(this.height - (this.$slots.default ? $(this.$slots.default[0].elm).height() : 0) - 100);
            var that = this;
            this.cytoScapeGraph = new CytoScapeGraph({
                container: this.$refs.graph,
                classes: {
                    marked: {
                        'border-color': "#ffa2a3",
                        'border-width': "1",
                        'line-color': '#ffa2a3',
                        'target-arrow-color': '#ffa2a3',
                    },
                    spotlight: {
                        'width': '20px',
                        'height': '20px',
                        'border-color': "gold",
                        'border-width': "2"
                    },
                    curNode: {
                        'width': '20px',
                        'height': '20px',
                        'background-color': "red",
                    }
                },
                linkLabelFormatter: function (ele) {
                    return ele.data('type').display + '(' + ele.data('origin').count + ')'
                },
                linkTooltipFormatter: function (link) {
                    var tooltip = {};
                    var source = link.source(), target = link.target();
                    tooltip.title = '起点：' + source.data('name') + '<br/>' + '终点：' + target.data('name') + '<br/>类型：' + link.data('type').display;
                    tooltip.content = $(that.$refs.linkTooltip);
                    that.$set(that.tooltipLinkData, 'loading', true);
                    $.ajax({
                        url: '/api/graph/linksBetween',
                        data: {
                            id1: source.data('origin').id,
                            id2: target.data('origin').id,
                            type: link.data('type').name,
                            page: 0,
                            size: 10,
                            filter: JSON.stringify(that.$refs[link.data('type').name][0].getData())
                        },
                        success: function (data) {
                            that.$set(that.tooltipLinkData, 'type', link.data('type'));
                            that.$set(that.tooltipLinkData, 'source', source);
                            that.$set(that.tooltipLinkData, 'target', target);
                            that.$set(that.tooltipLinkData, 'loading', false);
                            that.$set(that.tooltipLinkData, 'linkData', data.data);
                            that.$set(that.tooltipLinkData, 'total', link.data('origin').count);
                            that.$set(that.tooltipLinkData, 'current', (link.data('origin').count > 10 ? '10' : link.data('origin').count));
                            that.cols = [];//展示的属性
                            var tableKeys = [];
                            that.tableDatas = [];
                            var datas = data.data;
                            var value = datas[0];
                            var propertyData = dictionary.linkTypes[value.type].properties;
                            for(var key1 in propertyData){
                                for(var key2 in value.propertyList){
                                    if(key1==key2){
                                        that.cols.push({
                                            title:propertyData[key2].display,
                                            key: key2
                                        })
                                        tableKeys.push(key2);
                                    }
                                }
                            }
                            for(var k=0;k<datas.length;k++){
                                var newobj={};
                                for(var h=0;h<tableKeys.length;h++){
                                    var colkey = tableKeys[h];
                                    var colValue = datas[k].propertyList[colkey];
                                    newobj[colkey]=colValue;
                                }
                                that.tableDatas.push(newobj);
                                if(k>5){
                                    break;
                                }
                            }
                        }
                    });
                    return tooltip;
                },
                nodeTooltipFormatter: function (target) {
                    var tooltip = {};
                    tooltip.title = '<span style="float: left">' + target.data('name') + '</span>';
                    var propertyObj = target.data('origin');
                    var propertyList = propertyObj.propertyList;
                    if(propertyList.uid) {
                        var userInfo = sessionStorage.getItem("userInfo") || "{}";
                        userInfo = JSON.parse(userInfo);
                        if (userInfo.office) {
                            var detail = userInfo.office.detail;
                            if ("" + detail === "1") {
                            } else {
                                var uid = propertyList.uid.substring(0, 10) + "******" + propertyList.uid.substring(16, 18);
                                propertyList.uid = uid;
                            }
                        }
                    }
                    propertyList.sex = 1?"男":"女";
                    propertyList.isprovide = 1?"是":"否";
                    propertyList.ismls = 1?"是":"否";
                    propertyList.ispoverty = 1?"是":"否";
                    propertyObj.propertyList = propertyList;
                    that.$set(that, 'tooltipNodeData', propertyObj);
                    tooltip.content = $(that.$refs.nodeTooltip);
                    return tooltip;
                },
                nodeTypes: dictionary.nodeTypes,
                linkTypes: dictionary.linkTypes,
                contextMenu: this.contextMenu,
                toolbar: {
                    prevGraph: [
                        {
                            icon: 'fa fa-reply',
                            event: ['tap'],
                            selector: 'node',
                            tooltip: '返回上一中心',
                            action: [function (event) {
                                that.goBack()
                            }]
                        },
                    ]
                }
            });
            this.cytoScapeGraph.showMessage = this.showMessage;
        }
    };
</script>