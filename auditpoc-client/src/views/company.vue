<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px'">
            <graph :height="height" ref="graph" :contextMenu="contextMenuItem"></graph>
        </div>

    </div>
</template>
<script>
    import graph from '../components/cytoscapeGraph.vue';
    import Util from '../libs/util';
    import searchBar from '../components/paginationSearchBar.vue';
    import dictionary from '../config/dictionary';

    export default {
        mounted() {
            var that = this;
            that.$refs.graph.cytoScapeGraph.showLoading();
            /*$.post('/api/graph/regBigGraph?type=1&size=55',function (data) {
                that.insertMiddleNodes(data.data);
                that.$refs.graph.cytoScapeGraph.hideLoading();
                that.$refs.graph.mergeData(data, false, false, false, false,true);
            });*/
            /*that.$http.post('/api/overviews/selectOverviewsNodesDetail?oper=2&page=0&size=10',function (data) {
                that.insertMiddleNodes(data.data);
                that.$refs.graph.cytoScapeGraph.hideLoading();
                that.$refs.graph.mergeData(data, false, false, false, false,false);
            });*/
            var params={
                oper:2,
                page:0,
                size:10
            }
            that.$http.post("/api/overviews/selectOverviewsNodesDetail",that.querystring.stringify(params)
            ).then(function (response) {
                if ((response.data.status & 1) == 1) {
                    that.insertMiddleNodes(response.data.data);
                    that.$refs.graph.cytoScapeGraph.hideLoading();
                    that.$refs.graph.mergeData(response.data, false, false, false, false,false);
                }
            })
        },
        components: {
            'graph': graph,
            'search-bar': searchBar
        },
        data() {
            var that = this;
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                contextMenuItem: {
                    explore: {
                        content: '探索',
                        available: function (ele) {
                            return true;
                        },
                        select: function (ele, event) {
                            var id = ele.data('origin').id;
                            var name = ele.data('origin').name;
                            that.$parent.go2NewRouter('/audit/explore?id='+id+'&name='+name);
                            //window.location.href = ('/explore?id=' + ele.data('origin').id);
                            // window.open('/explore?id=' + ele.data('origin').id);
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
            }
        },
        methods: {
            insertMiddleNodes(data) {
                var nodes = data.nodes;
                var links = data.links;
                var centerNodes = data.centerNodes;
                var middleNodes = [];
                for(var i=0;i<nodes.length;i++){
                    var node = nodes[i];
                    if(centerNodes.indexOf(node.id)<0){
                        var middleLinks = links.filter(
                            link=>
                            (centerNodes.indexOf(link.startNode)>=0||centerNodes.indexOf(link.endNode)>=0)
                            && (link.startNode === node.id || link.endNode === node.id)
                    );
                        if(middleLinks.length>1){
                            middleNodes.push(node.id);
                        }
                    }
                }
                data.middleNodes = middleNodes;
            }
        }
    };
</script>