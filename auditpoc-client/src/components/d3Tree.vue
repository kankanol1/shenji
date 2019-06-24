<style>

    #tree-container .node {
        cursor: pointer;
    }

    #tree-container .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 1.5px;
        r: 8px;
    }

    #tree-container .node text {
        font-size: 14px;
    }

    #tree-container .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 1.5px;
    }

    #tree-container .templink {
        fill: none;
        stroke: red;
        stroke-width: 3px;
    }

    #tree-container .ghostCircle.show {
        display: block;
    }

    #tree-container .ghostCircle, .activeDrag .ghostCircle {
        display: none;
    }

    #tree-container .nodeText {
        color: white;
    }

</style>
<template>
    <div id="tree-container"></div>
</template>
<script>
    import Tree from '../libs/dndTree'
    import Util from '../libs/util';

    export default {
        data() {
            return {
                treeInstance: {}
            }
        },
        methods: {
            refresh(name) {
                document.getElementById('tree-container').innerHTML = '';
                var that = this;
                Util.ajax('/api/graph/investTree?name=' + name, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }).then(function (response) {
                    var data = {name: name, children: []};
                    for (var i in response.data.nodes) {
                        if (response.data.nodes[i].name != name)
                            data.children.push(response.data.nodes[i])
                    }
                    that.treeInstance = Tree.treeJSON(data, that.addChildren);
                });
            },
            addChildren(d) {
                var that = this;
                Util.ajax('/api/graph/investTree?name=' + d.name, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }).then(function (response) {
                    var children = [];
                    for (var i in response.data.nodes) {
                        if (response.data.nodes[i].name != d.name)
                            children.push(response.data.nodes[i]);
                    }
                    that.treeInstance.addChildren(children, d.name)
                });
            },

        }
    }
</script>