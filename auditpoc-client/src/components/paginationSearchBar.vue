<style scoped>
    .ivu-input-group-append {
        padding-right: 20px;
    }
</style>
<template>
    <div class="ivu-input-group-with-append" style="display: inline-flex;">
        <Select v-model="nodeSelect" :loading="searchBarLoading" filterable remote :remote-method="queryNodes"
                @on-change="changeNode">
            <ButtonGroup v-show="nodeData.length>0" style="padding-left:10px;width:100%">
                <em style="padding-right:15px;color:grey;float:right;font-size:10px">检索到{{total}}条记录，共{{totalPages}}页,当前第{{page
                    + 1}}页</em>
                <Button type="primary" size="small" :disabled="first" @click.stop="preData">
                    <Icon type="chevron-left"></Icon>
                    上一页
                </Button>
                <Button type="primary" size="small" :disabled="last" @click.stop="nextData">
                    下一页
                    <Icon type="chevron-right"></Icon>
                </Button>
            </ButtonGroup>
            <Option v-for="node in nodeData" :value="node.id" :key="node.id" :label="node.name">
                {{node.name}}
                <em style="color:grey">(类型:
                    {{node.type ? nodeTypes[node.type].display:'未知'}}
                    {{node.uid ? ',编号:'+node.uid:''}})</em>
            </Option>
        </Select>
    </div>
</template>
<script>
    import dictionary from '../config/dictionary';
    import searchBar from '../components/searchBar/searchBar.vue';
    import searchResult from '../components/searchBar/result.vue';
    import Util from '../libs/util';

    export default {
        props: {
            // width: {
            //     type: Number,
            //     default: 300
            // },
            maxNodeSelect: {
                type: Number,
                default: 1
            },
            enableSelectAll: {
                type: Boolean,
                default: false
            },
            onSearch: {
                type: Function
            }
        },
        data() {
            return {
                nodeSelect: '',
                fullSelectedData: {},
                query: '',
                queryLastUpdate: 0,
                searchBarLoading: false,
                nodeTypes: dictionary.nodeTypes,
                nodeData: [],
                first: true,
                last: true,
                total: 0,
                pageSize: 10,
                page: 0,
                totalPages: 0
            }
        },
        components: {
            'search-bar': searchBar,
            'search-result': searchResult
        },
        methods: {
            getSelected() {
                return this.nodeSelect;
            },
            getSelectedName() {
                return this.nodeSelectName;
            },
            preData() {
                if (this.first) return;
                this.page = this.page - 1;
                this.queryNodes(this.query)
            },
            nextData() {
                if (this.last) return;
                this.page = this.page + 1;
                this.queryNodes(this.query)
            },
            changeNode(value) {
                var that = this;
                var nodeData = this.nodeData || [];
                nodeData.forEach(function (item, index) {
                    if (item.id == value) {
                        that.nodeSelectName = item.name;
                    }
                });
            },
//            queryChange(query) {
//                if (query.length == 0) return;
//                var that = this;
//                that.query = query;
//                that.queryLastUpdate = (new Date()).getTime();
//
//                setTimeout(function () {
//                    var now = (new Date()).getTime();
//                    if (now - that.queryLastUpdate >= 400) {
//                        that.queryNodes(that.query);
//                    }
//                }, 401)
//            },
            queryNodes(query) {
                if (!query.trim()) return;
                query = query.trim();
                this.query = query;
                if (!query) return;
                this.searchBarLoading = true;
                var that = this;
                var realQuery = query;
                /*var url = '/api/node/queryNodes?' + 'value=' + realQuery + '&page=' + that.page + '&size=' + that.pageSize + '&vper = 7';
                if (Util.testPersonUid(query))
                    url = '/api/node/person-uid?uid=' + query;
                $.post(url, function (data) {
                    that.searchBarLoading = false;
                    that.$set(that, 'nodeData', data.data || []);
                    if (data.page) {
                        that.first = data.page.first;
                        that.last = data.page.last;
                        that.total = data.page.totalElements;
                        that.page = data.page.page;
                        that.totalPages = data.page.totalPages;
                    }
                });*/
                var url = '/api/node/queryNodes';
                var params = {
                    value: realQuery,
                    page: that.page,
                    size: that.pageSize,
                    vper: 15
                };
                if(Util.testPersonUid(query)){
                    url = '/api/node/person-uid';
                    params = {uid: query}
                }
                //var url = 'http://api/192.168.0.131:9200/janusgraph_all_vertex/_search';
                /*var params = {
                    "from": that.page,
                    "size": that.pageSize,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "name": {
                                            "query": realQuery,
                                            "operator": "AND",
                                            "prefix_length": 0,
                                            "max_expansions": 50,
                                            "fuzzy_transpositions": true,
                                            "lenient": false,
                                            "zero_terms_query": "NONE",
                                            "auto_generate_synonyms_phrase_query": true,
                                            "boost": 1
                                        }
                                    }
                                },
                                {
                                    "terms": {
                                        "type": [
                                            "Account",
                                            "Department",
                                            "Company",
                                            "Person"
                                        ],
                                        "boost": 1
                                    }
                                }
                            ],
                            "adjust_pure_negative": true,
                            "boost": 1
                        }
                    },
                    "_source": {
                        "includes": [],
                        "excludes": []
                    }
                }*/
                that.$http.post(url,
                    that.querystring.stringify(params))
                    .then(function (response){
                        if(response.data){
                            that.searchBarLoading = false;
                            that.$set(that, 'nodeData', response.data.data || []);
                            if (response.data.page) {
                                that.first = response.data.page.first;
                                that.last = response.data.page.last;
                                that.total = response.data.page.totalElements;
                                that.page = response.data.page.page;
                                that.totalPages = response.data.page.totalPages;
                            }
                        }
                    })
            }
        }
    }
</script>