<template>
    <div class="layout">
        <div class="layout-content" style="min-height: 500px">
            <div ref="wordCloudContainer" style="min-height: 250px;margin:30px;background-color: #f6f8f9;"></div>
            <div style="padding: 30px">
                <Input placeholder="输入关键字过滤中心节点" v-model="filterText" style="width: 400px">
                </Input>
                <Button-group>
                    <Button @click="doFilter" type="primary">筛选</Button>
                    <Button @click="resetFilter" type="primary" style="margin-left: 5px;">复位</Button>
                </Button-group>
                <el-table
                        :data="filteredData"
                        border
                        style="width: 100%;margin-top: 20px"
                        :height="height"
                        :default-sort = "{prop: 'related', order: 'descending'}"
                >
                    <el-table-column
                            prop="curNode"
                            label="中心节点"
                            sortable
                            width="250">
                        <template scope="scope">
                            {{scope.row.curNode}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="疑点类型"
                            sortable
                            width="300"
                            :filters="[{text:'亲属与公职人员单位发生贸易往来',value:'亲属与公职人员单位发生贸易往来'},{text:'新办企业获得财政补贴',value:'新办企业获得财政补贴'},{text:'非法集资',value:'非法集资'}]"
                            :filter-method="filterTag"
                            filter-placement="bottom"
                    >
                    </el-table-column>
                    <el-table-column prop="related" label="相关金额" sortable :sort-method="sortTableData">
                        <template scope="scope">
                            <div style="padding:10px 0px">
                                {{scope.row.money}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="operator"
                            label="操作"
                            width="150">
                        <template scope="scope">
                            <!--<a @click="go2Detail(scope.row.type,scope.row.pathId,scope.row.curNode)">
                                查看关系图>>
                            </a>-->
                            <!--<a @click="go2Detail(scope.row.pathId,scope.row.dper)">
                                查看关系图>>
                            </a>-->
                            <a @click="go2Detail(scope.row.pathId,scope.row.curNode,scope.row.dper)">
                                查看关系图>>
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>
<script>
    import graph from '../components/graph.vue';
    import Util from '../libs/util';
    import searchBar from '../components/paginationSearchBar.vue';

    import '../libs/jQCloud/jqcloud.css';
    import '../libs/jQCloud/jqcloud-1.0.4.min';
    window.wordCloudGo2Detail = function(){};
    export default {
        mounted() {
//            this.queryCircle();
            /*this.queryDoubts('/api/graph/findKinshipHavePaymentList?size=' + this.queryDoubtsLimit, '亲属与公职人员单位发生贸易往来', 'findKinshipHavePaymentDetail');
            this.queryDoubts('/api/graph/newCompanyGetPaymentList?size=' + this.queryDoubtsLimit, '新办企业获得财政补贴', 'newCompanyGetPaymentDetail');*/
            //亲属与公职人员单位发生贸易往来
            this.queryDoubts('-1','1','0','10');
            //新办企业获得财政补贴
            this.queryDoubts('-1','2','0','10');
            ////银行循环担保
            this.queryDoubts('-1','4','0','10');
            var that = this;
            /*window.wordCloudGo2Detail = function(type,pathId,name){
                that.go2Detail(type,pathId,name)
            };*/
            window.wordCloudGo2Detail = function(pathId,name,dper){
                that.go2Detail(pathId,name,dper)
            }
        },
        components: {
            'graph': graph,
            'search-bar': searchBar
        },
        data() {
            return {
                queryDoubtsLimit: 100,
                height: 500,
                filterText: '',
                maxNodeInCell: 5,
                tableData: [],
                filteredData: [],
                wordCloudData: {},
                refreshCount: 0
            }
        },
        methods: {
            /*go2Detail(type,pathId,name){
                var url ='/explore?type='+type+'&pathId='+pathId+'&name='+name;
                this.$parent.go2NewRouter(url);
            },*/
            /*go2Detail(pathId,dper){
                var url ='/explore?pathId='+pathId+'&dper='+dper;
                this.$parent.go2NewRouter(url);
            },*/
            go2Detail(pathId,name,dper){
                if(dper=="4"){
                    var url ='/audit/explore?id='+pathId+'&name='+name+'&dper='+dper;
                }else{
                    var url ='/audit/explore?pathId='+pathId+'&dper='+dper;
                }
                this.$parent.go2NewRouter(url);
            },
            sortTableData(a, b) {
                return a.money - b.money;
            },
            /*refreshWordCloud(data, type) {
                this.refreshCount++;
                for (var i in data) {
                    var node = data[i];
                    if (!this.wordCloudData[node.id]) {
                        this.wordCloudData[node.id] = {
                            id: node.id,
                            name: node.name,
                            count: 0,
                            type: type,
                            pathId: node.id
                        }
                    }
                    this.wordCloudData[node.id].count += node.money;
                }
                if (this.refreshCount == 2) {

                    var word_list = $.map(this.wordCloudData, function (value) {
                        return {
                            text: value.name,
                            weight: value.count,
                            html: {title: value.name + ':' + value.count.toFixed(2) + '(涉及金额)'},
                            link: {
                                href: "javacript:void(0);",
                                //href: "/explore?type=" + value.type + '&pathId=' + value.id+'&name='+value.name,
                                onclick: 'wordCloudGo2Detail("'+value.type+'","'+value.id+'","'+value.name+'");return false;',
                                // target: "_blank",
                                style: 'color:rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
                            }
                        };
                    });
                    $(this.$refs.wordCloudContainer).jQCloud(word_list);
                }
            },*/
            refreshWordCloud(data) {
                this.refreshCount++;
                for (var i in data) {
                    var node = data[i];
                    if (!this.wordCloudData[node.id]) {
                        this.wordCloudData[node.id] = {
                            id: node.id,
                            name: node.name,
                            count: 0,
                            dper: node.classify,
                            //type: type,
                            pathId: node.id
                        }
                    }

                    this.wordCloudData[node.id].count += node.money;
                }
                if (this.refreshCount == 3) {
                    var word_list = $.map(this.wordCloudData, function (value) {
                        return {
                            text: value.name,
                            weight: value.count,
                            html: {title: value.name + ':' + value.count.toFixed(2) + '(涉及金额)'},
                            link: {
                                href: "javacript:void(0);",
                                //href: "/explore?type=" + value.type + '&pathId=' + value.id+'&name='+value.name,
                                onclick: 'wordCloudGo2Detail("'+value.id+'","'+value.name+'","'+value.dper+'");return false;',
                                // target: "_blank",
                                style: 'color:rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
                            }
                        };
                    });
                    $(this.$refs.wordCloudContainer).jQCloud(word_list);
                }
            },
            filterTag(value, row) {
                return row.title == value;
            }
            ,
            resetFilter() {
                this.filteredData = this.tableData;
            }
            ,
            doFilter() {
                if (!this.filterText) return;
                this.filteredData = [];
                for (let i in this.tableData) {
                    var row = this.tableData[i];
                    if (row.curNode.indexOf(this.filterText) >= 0)
                        this.filteredData.push(row);
                    /*else if (row.dper.indexOf(this.filterText) >= 0)
                        this.filteredData.push(row);*/
                }
            }
            ,
            /*queryDoubts(url, title, type) {
                var that = this;
                $.post(url, function (data) {
                    for (var i in data.data) {
                        var item = data.data[i];
                        that.tableData.push({
                            curNode: item.name,
                            title: title,
                            money: item.money,
                            type: type,
                            pathId: item.id
                        });
                        that.filteredData.push({
                            curNode: item.name,
                            title: title,
                            money: item.money.toFixed(2)*1,
                            type: type,
                            pathId: item.id
                        });
                    }
                    that.refreshWordCloud(data.data, type);
                });
            },*/
            queryDoubts(vper,dper,page,size){
                var url = "/api/doubts/selectDoubtsNodesList/";
                var title;
                if(dper=="1"){
                    title = "亲属与公职人员单位发生贸易往来"
                }else if(dper=="2"){
                    title = "新办企业获得财政补贴"
                }else if(dper=="4"){
                    title = "非法集资";
                }
                var params = {
                    vper:vper,
                    dper:dper,
                    page:page,
                    size:size
                }
                var that = this;
                /*$.post(url,params, function (data) {
                    for (var i in data.data) {
                        var item = data.data[i];
                        that.tableData.push({
                            curNode: item.name,
                            title: title,
                            money: item.money,
                            dper:  item.classify,
                            //type: type,
                            pathId: item.id
                        });
                        that.filteredData.push({
                            curNode: item.name,
                            title: title,
                            money: item.money.toFixed(2)*1,
                            dper: item.classify,
                            //type: type,
                            pathId: item.id
                        });
                    }
                    /!*that.refreshWordCloud(data.data, type);*!/
                    that.refreshWordCloud(data.data);
                });*/
                /*$.post(url,params, function (data) {
                    for (var i in data.data) {
                        var item = data.data[i];
                        that.tableData.push({
                            curNode: item.name,
                            title: title,
                            money: item.money,
                            dper:  item.classify,
                            //type: type,
                            pathId: item.id
                        });
                        that.filteredData.push({
                            curNode: item.name,
                            title: title,
                            money: item.money.toFixed(2)*1,
                            dper: item.classify,
                            //type: type,
                            pathId: item.id
                        });
                    }
                    /!*that.refreshWordCloud(data.data, type);*!/
                    that.refreshWordCloud(data.data);
                });*/
                that.$http.post(url,that.querystring.stringify(params))
                    .then(function(response){
                        for (var i in response.data.data) {
                            var item = response.data.data[i];
                            that.tableData.push({
                                curNode: item.name,
                                title: title,
                                money: item.money,
                                dper:  item.classify,
                                //type: type,
                                pathId: item.id
                            });
                            that.filteredData.push({
                                curNode: item.name,
                                title: title,
                                money: item.money.toFixed(2)*1,
                                dper: item.classify,
                                //type: type,
                                pathId: item.id
                            });
                        }
                        that.refreshWordCloud(response.data.data);
                    });
            },
            queryCircle() {
                var that = this;
                Util.ajax('/api/graph/pathList', {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }).then(function (response) {
                    var wordCloudData = {};
                    for (let i in response.data.data) {
                        wordCloudData[response.data.data[i].startNode.name] = [{curNode: response.data.data[i].startNode}];
                        Util.ajax('/api/graph/path?id=' + response.data.data[i].startNode.id, {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                            }
                        }).then(function (response1) {
                            that.tableData.push({
                                curNode: response.data.data[i].startNode.name,
                                title: '疑点环',
                                related: $.map(response1.data.nodes, function (value, index) {
                                    if (index > 3) return;
                                    return value.name
                                }).join(','),
                                type: 'circle',
                                pathId: response.data.data[i].startNode.id
                            });
                            that.filteredData.push({
                                curNode: response.data.data[i].startNode.name,
                                title: '疑点环',
                                related: $.map(response1.data.nodes, function (value, index) {
                                    if (index > 3) return;
                                    return value.name
                                }).join(','),
                                type: 'circle',
                                pathId: response.data.data[i].startNode.id
                            });
                        })
                    }
                    that.refreshWordCloud(wordCloudData, 'circle');
                });
            }
        }
    };
</script>