<style scoped>
    .ivu-input-group-append {
        margin-left: -1px;
        padding: 7px 20px 7px 10px;
    }
</style>
<template>
    <div>
        <Modal v-model="show" width="1000" :styles="{top: '20px'}">
            <p slot="header" style="text-align:center">
                <span style="font-size: 20px">列表模式展示</span>
            </p>
            <div>
                <search-bar :maxSelect="5" :width="800" :queryUrlBuilder="buildSecondSearchUrl"
                            ref="secondSearchBar" style="margin-left: 15px">
                    <Button icon="ios-search" class="ivu-input-group-append" @click="secondSearch"></Button>
                </search-bar>
                <div style="margin: 15px">
                    <Button icon="refresh" type="primary" @click="firstPage">重置</Button>
                    <el-table
                            :data="tableData"
                            border
                            height="300">
                        <el-table-column
                                prop="name"
                                label="节点名称"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="relation"
                                label="与中心节点关系"
                                sortable
                        >
                        </el-table-column>
                        <el-table-column prop="detail" label="节点详情">
                            <template scope="scope">
                                <ul>
                                    <li v-for="str in  scope.row.detail">
                                        {{str}}
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div>
                    <em>邻居节点共 </em>
                    <em
                            v-if="basicInformation&&basicInformation.pageInfo">{{basicInformation.pageInfo.totalElements}} 个</em>
                    <em v-if="basicInformation&&basicInformation.pageInfo">当前第{{basicInformation.pageInfo.page + 1}}页 </em>
                    <em v-if="basicInformation&&basicInformation.pageInfo">共 {{basicInformation.pageInfo.totalPages}} 页， {{basicInformation.pageInfo.size}}个节点/页</em>
                    <Button-group style="padding: 10px;float: right">
                        <Button type="primary" size="small" @click="prevPage"
                                :disabled="basicInformation&&basicInformation.pageInfo&&basicInformation.pageInfo.first">
                            <Icon type="chevron-left"></Icon>
                            上一页
                        </Button>
                        <Button type="primary" size="small"
                                :disabled="basicInformation&&basicInformation.pageInfo&&basicInformation.pageInfo.last"
                                @click="nextPage">
                            下一页
                            <Icon type="chevron-right"></Icon>
                        </Button>
                    </Button-group>
                </div>
            </div>
            <p slot="footer"></p>
        </Modal>
    </div>
</template>
<script>
    import dictionary from '../config/dictionary';
    import Util from '../libs/util';
    import searchBar from '../components/multipleSearchBar.vue';

    export default {
        data() {
            return {
                basicInformation: {},
                show: false,
                tableData: []
            }
        },
        components: {
            'search-bar': searchBar
        },
        methods: {
            showModal(basicInformation) {
                this.show = true;
                var newInfo = $.extend(true, {}, basicInformation);
                newInfo.pageInfo.page = 0;
                newInfo.pageInfo.first = true;
                newInfo.pageInfo.last = true;
                this.$set(this, 'basicInformation', newInfo);
                this.firstPage();
            },
            buildSecondSearchUrl(query, nodeType) {
                if (nodeType == 'Person' && Util.testPersonUid(query))
                    return '/api/graph/queryNeighborUid?id=' + this.basicInformation.id + '&name=' + query + '&nodeType=' + nodeType;
                return '/api/graph/queryNeighborNamed?id=' + this.basicInformation.id + '&value=' + query + '&nodeType=' + nodeType;
            },
            firstPage() {
                if (!this.basicInformation.id) return;
                var url = '/api/graph/neighbor?id=' + this.basicInformation.id
                    + '&page=0'
                    + '&size=' + (this.basicInformation.pageInfo && this.basicInformation.pageInfo.size ? this.basicInformation.pageInfo.size : 10);
                this.formTableData(url);
            },
            prevPage() {
                if (!this.basicInformation.id || !this.basicInformation.pageInfo) return;
                if (this.basicInformation.pageInfo.page - 1 < 0) return;
                var url = '/api/graph/neighbor?id=' + this.basicInformation.id
                    + '&page=' + (this.basicInformation.pageInfo.page - 1)
                    + '&size=' + (this.basicInformation.pageInfo.size);
                this.formTableData(url);
            },
            secondSearch() {
                var nodeStyle = {
                    symbolSize: 18,
                    itemStyle: {
                        normal: {
                            borderColor: 'green',
                            borderWidth: 2
                        }
                    }
                };
                if (this.basicInformation && this.basicInformation.id && this.$refs.secondSearchBar.getSelected().length > 0)
                    this.exploreGraph(undefined, '/api/graph/secondQuery?id=' + this.basicInformation.id + '&ids=' + this.$refs.secondSearchBar.getSelected().join(','), false, false, true, nodeStyle);

            },
            nextPage() {
                if (!this.basicInformation.id || !this.basicInformation.pageInfo) return;
                if (this.basicInformation.pageInfo.page + 1 > this.basicInformation.pageInfo.totalPages) return;
                var url = '/api/graph/neighbor?id=' + this.basicInformation.id
                    + '&page=' + (this.basicInformation.pageInfo.page + 1)
                    + '&size=' + (this.basicInformation.pageInfo.size);

                this.formTableData(url);
            },
            formTableData(url) {
                var that = this;
                this.tableData = [];
                Util.ajax(url, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }).then(function (response) {
                    that.basicInformation = response.data.data.nodes.filter(function(o){return o.id === response.data.data.curNode})[0];
                    that.basicInformation.pageInfo = response.data.page;

                    var nodeId2LinkType2Count = {};
                    var nodeId2NodeData = {};
                    for (var i in response.data.nodes) {
                        var nodeData = response.data.nodes[i];
                        nodeId2NodeData[nodeData.id] = {
                            name: nodeData.name,
                            detail: that.buildNodeDetail(nodeData),
                            relation: {}

                        }
                    }
                    for (var j in response.data.links) {
                        var linkData = response.data.links[j];
                        var nodeId = linkData.startNode == that.basicInformation.id ? linkData.endNode : linkData.startNode;
                        if (!nodeId2NodeData[nodeId][dictionary.linkTypes[linkData.type].display])
                            nodeId2NodeData[nodeId].relation[dictionary.linkTypes[linkData.type].display] = 0;
                        nodeId2NodeData[nodeId].relation[dictionary.linkTypes[linkData.type].display]++;
                    }

                    that.tableData = $.map(nodeId2NodeData, function (value) {
                        value.relation = $.map(value.relation, function (v, name) {
                            return name + '(' + v + ')'
                        }).join(', ')
                        return value;
                    });
                });
            },
            secondSearch() {
                this.formTableData('/api/graph/secondQuery?id=' + this.basicInformation.id + '&ids=' + this.$refs.secondSearchBar.getSelected().join(','));
            },
            buildNodeDetail(nodeData) {
                var html = [];
                if (nodeData.propertyList)
                    $.each(nodeData.propertyList, function (index, propertyData) {
                        if (dictionary.nodeTypes[nodeData.type].properties && dictionary.nodeTypes[nodeData.type].properties[propertyData.key] && dictionary.nodeTypes[nodeData.type].properties[propertyData.key].tooltip) {
                            if (dictionary.nodeTypes[nodeData.type].properties[propertyData.key].date) {
                                var dateFormat = dictionary.nodeTypes[nodeData.type].properties[propertyData.key].dateFormat;
                                if (!dateFormat)
                                    dateFormat = 'yyyy.MM';
                                html.push(dictionary.nodeTypes[nodeData.type].properties[propertyData.key].display + ': ' + new Date(propertyData.value).Format(dateFormat));
                            }
                            else if (dictionary.nodeTypes[nodeData.type].properties[propertyData.key].decimal) {
                                html.push(dictionary.nodeTypes[nodeData.type].properties[propertyData.key].display + ':  ' + propertyData.value.toFixed(dictionary.nodeTypes[nodeData.type].properties[propertyData.key].decimal));
                            }
                            else
                                html.push(dictionary.nodeTypes[nodeData.type].properties[propertyData.key].display + '：' + propertyData.value);
                        }
                    });
                return html;
            }

        }

    }
</script>