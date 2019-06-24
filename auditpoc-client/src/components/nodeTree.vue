<template>
    <div class="node-tree">
        <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
        </el-input>

        <el-tree
                class="filter-tree"
                :data="nodeData"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                :render-content="renderContent"
                ref="tree2"
        >
        </el-tree>
    </div>
</template>

<script>
    import Util from '../libs/util';

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },

        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
            },
            renderContent(h, {node, data, store}) {
                return h(
                    {
                        template: '<div style="padding:5px;width:85%;display: inline-block"><label style="font-size: 14px;font-weight: 500;line-height: 20px;vertical-align: middle">' + data.label + '</label>' +
                        '<Button-group style="float:right;margin-right: 20px">' +
                        '<Button type="ghost" size="small"' +
                        'icon="ios-list-outline"' +
                        'title="详情" @click.stop="nodeDetail(\'' + data.id + '-' + data.type + '\')"></Button>' +
                        '<Button type="ghost" size="small"' +
                        'icon="ios-navigate-outline"' +
                        'title="探索" @click.stop="exploreGraph(\'' + data.id + '\',\'' + data.type + '\')"></Button>' +
                        '</Button-group></div>',
                        methods: {
                            nodeDetail(node) {
                                Util.vueInstance.queryNodeDetail(node);
                            },
                            exploreGraph(nodeId, nodeType) {
                                Util.exploreGraph(nodeId, nodeType.toLowerCase());
                            }
                        }

                    }
                )
            },
            addChildren(nodes, parentNode) {
                if (this.nodeTreeIndex[parentNode.id] == undefined) {
                    var index = this.nodeData.length;
                    this.nodeTreeIndex[parentNode.id] = index + '';
                    this.nodeData.push({
                        id: parentNode.id + '',
                        label: parentNode.name,
                        children: [],
                        type: parentNode.type
                    });
                }
                var parentIndex = this.nodeTreeIndex[parentNode.id].split('-');
                var parent = this.nodeData[parentIndex[0]];
                if (parentIndex.length > 1) {
                    for (var j = 1; j < parentIndex.length; j++) {
                        parent = parent.children[parentIndex[j]]
                    }
                }

                for (var k in nodes) {
                    var node = nodes[k];
                    if (this.nodeTreeIndex[node.id] != undefined) continue;

                    if (!parent.children)
                        parent.children = [];
                    var childIndex = parent.children.length;
                    parent.children.push({
                        id: node.id,
                        label: node.name,
                        children: [],
                        type: node.type
                    });
                    this.nodeTreeIndex[node.id]
                    this.nodeTreeIndex[node.id] = parentIndex.join('-') + '-' + childIndex;
                }

            },
            refresh() {
                this.nodeData = [];
                this.nodeTreeIndex = {};
            }

        },

        data() {
            return {
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                nodeTreeIndex: {},
                nodeData: []
            };
        }
    };
</script>