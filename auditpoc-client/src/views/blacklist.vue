<style scoped="">
    .clearfix {
        clear: both;
    }
</style>
<template>
    <div>
        <Modal
                v-model="showModal"
                title="批量添加"
                @on-ok="batchAdd"
                width="1000"
                style="text-align: center">
            <div class="ivu-input-group-with-prepend" style="display: inline-flex;">
                <input v-model="addInput" placeholder="请输入节点名称关键字" style="height:40px;width:500px;"
                       class="ivu-input"></input>
            </div>
            <div style="height: 250px;padding:5px;overflow-y: auto">
                <legend style="text-align: left;font-size: 14px;font-weight: 800">&nbsp;&nbsp;可选</legend>
                <Row style="text-align: right">
                    <Checkbox
                            :indeterminate="indeterminate"
                            :value="checkAll"
                            @click.prevent.native="handleCheckAll" style="float: left;padding: 10px">全选
                    </Checkbox>
                    <em style="padding-right:15px;color:grey;font-size:10px">检索到{{total}}条记录，共{{totalPages}}页,当前第{{page + 1}}页</em>
                    <ButtonGroup v-show="nodeData.length>0" style="padding-left:10px;">
                        <Button type="primary" size="small" :disabled="first" @click.stop="preData">
                            <Icon type="chevron-left"></Icon>
                            上一页
                        </Button>
                        <Button type="primary" size="small" :disabled="last" @click.stop="nextData">
                            <Icon type="chevron-right"></Icon>
                            下一页
                        </Button>
                    </ButtonGroup>
                </Row>
                <Row style="text-align: left;">
                    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                        <Checkbox v-for="node in nodeData" :key="node.id" :label="node.id" id="Radio"
                                  style="padding: 5px 10px;border-radius: 5px;margin-bottom:10px;border:1px solid #dddee1">
                            {{node.name}}
                            <em>(编号{{node.uid}})</em>
                        </Checkbox>
                    </CheckboxGroup>
                </Row>
            </div>
            <div style="height: 200px;padding:5px;overflow-y: auto;text-align: left;">
                <legend style="text-align: left;font-size: 14px;font-weight: 800">&nbsp;&nbsp;已选</legend>
                <div>
                    <Tag type="border" closable color="blue" v-for="node in nodeSelectedData"
                         @on-close="handleClose(node)" float="left">
                        {{node.name}}
                        <em>(编号{{node.uid}})</em>
                    </Tag>
                </div>
            </div>
        </Modal>
        <div style="padding: 0px 40px;">
            <div style="padding-bottom: 5px">
                <Input v-model="nodeName" style="width: 400px" placeholder="请输入节点名称关键字">
                </Input>
                <Button type="primary" icon="search" @click="handleCurrentChange">搜索</Button>
                <Button @click="showAddModal()" icon="plus-round" type="primary">添加</Button>
                <Button @click="remove()" icon="minus-round" type="error">删除</Button>
            </div>
            <Table :loading="loading" border ref="selection" :columns="columns" :data="data"
                   :height="height-235"></Table>
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    style="float: right;margin-top: 20px">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import searchBar from '../components/paginationSearchBar.vue';
    import dictionary from '../config/dictionary';
    import Util from '../libs/util';


    export default {
        watch: {
            addInput(curVal) {
                if (curVal.length == 0) return;
                var that = this;
                that.query = curVal;
                that.queryLastUpdate = (new Date()).getTime();
                setTimeout(function () {
                    var now = (new Date()).getTime();
                    if (now - that.queryLastUpdate >= 400) {
                        that.queryNodes(that.query);
                    }
                }, 401)
            },
            checkAllGroup(data) {
                for (var i in this.nodeData) {
                    var dataItem = this.nodeData[i];
                    if (data.indexOf(dataItem.id) >= 0 && this.nodeSelect.indexOf(dataItem.id) >= 0) continue;
                    if (data.indexOf(dataItem.id) >= 0 && this.nodeSelect.indexOf(dataItem.id) < 0) {
                        this.nodeSelect.push(dataItem.id);
                        this.nodeSelectedData.push(dataItem);
                    }
                    if (data.indexOf(dataItem.id) < 0 && this.nodeSelect.indexOf(dataItem.id) >= 0) {
                        var index = this.nodeSelect.indexOf(dataItem.id);
                        this.nodeSelect.splice(index, 1);
                        this.nodeSelectedData.splice(index, 1);
                    }

                }
            }
        },
        mounted() {
            this.search();
        },
        components: {
            'search-bar': searchBar,
        },
        data() {
            var that = this;
            return {
                maxNodeSelect: 20,
                showModal: false,
                addInput: '',
                nodeData: [],
                nodeSelected: [],//存选中的节点id
                nodeSelectedData: [],//存选中的所有节点信息
                nodeTypes: dictionary.nodeTypes,
                selectedType: 'Department',
                query: '',
                queryLastUpdate: '',
                first: true,
                last: true,
                total: 0,
                pageSize: 10,
                page: 0,
                totalPages: 0,
                indeterminate: false,
                checkAll: false,
                checkAllGroup: [],
                searchBarWidth: window.screen.availWidth - 400,
                currentPage: 1,
                pageSize: 10,
                total: 1,
                loading: false,
                height: window.screen.availHeight - 100,
                nodeName: '',
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'nodeName'
                    },
                    {
                        title: '类型',
                        key: 'nodeType'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            that.remove([params.row.id])
                                        }
                                    }
                                }, '删除')

                            ]);
                        }
                    }
                ],
                data: [],
            }
        },
        methods: {
            handleClose(node) {
                var index = this.nodeSelect.indexOf(node.id);
                this.nodeSelect.splice(index, 1);
                this.nodeSelectedData.splice(index, 1);
                if (this.checkAllGroup.indexOf(node.id) >= 0)
                    this.checkAllGroup.splice(this.checkAllGroup.indexOf(node.id), 1);

            },
            preData() {
                if (this.first) return;
                this.page = this.page - 1;
                this.queryNodes(this.query, '/api/node/queryNodes?nodeType=' + this.selectedType + '&page=' + this.page + '&size=' + this.pageSize + '&total=' + this.total);
            },
            nextData() {
                if (this.last) return;
                this.page = this.page + 1;
                this.queryNodes(this.query, '/api/node/queryNodes?nodeType=' + this.selectedType + '&page=' + this.page + '&size=' + this.pageSize + '&total=' + this.total);
            },
            queryNodes(query, queryUrl) {
                var that = this;
                var url = '/api/node/queryNodesByName';
                if (queryUrl)
                    var params = {
                        vper: 15,
                        name:this.query,
                        size:10,
                        page:this.page
                    };
                else
                    params = {
                        vper: 15,
                        name:this.query,
                        size:10,
                        page:this.page
                    };
                that.$http.post(url,that.querystring.stringify(params))
                    .then(function (response) {
                        that.searchBarLoading = false;
                        that.$set(that, 'nodeData', response.data.data);
                        if (response.data.page) {
                            that.first = response.data.page.first;
                            that.last = response.data.page.last;
                            that.total = response.data.page.totalElements;
                            that.page = response.data.page.page;
                            that.totalPages = response.data.page.totalPages;
                        }
                    }).catch(function (response) {
                    that.searchBarLoading = false;
                    that.$message({
                        type: 'warning',
                        message: "获取数据异常",
                        showClose: true
                    });
                });
            },
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    this.checkAllGroup = $.map(this.nodeData, function (value) {
                        return value.id;
                    })
                } else {
                    this.checkAllGroup = [];
                }
            },

            checkAllGroupChange(data) {
                if (data.length === this.nodeData.length && this.nodeData.length > 0) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },


            handleCurrentChange() {
                this.search(this.nodeName);
            },
            batchAdd() {
                var params = {
                    blackNodeList: JSON.stringify(this.nodeSelectedData)
                };
                var that = this;
                that.$http.post("/api/authority/black_node/save_batch",that.querystring.stringify(params))
                    .then(function (response){
                        if((response.data.status & 1)==1){
                            that.$message({
                                type: 'success',
                                message: "添加成功",
                                showClose: true
                            });
                            that.search();
                        }
                    });
            },
            showAddModal() {
                this.checkAll = false;
                this.addInput = '';
                this.nodeSelectedData = [];
                this.total = 0;
                this.showModal = true;
                this.nodeData = [];
                this.nodeSelect = [];

            },
            search(nodeName) {
                var data = {
                    page: (this.currentPage - 1),
                    size:10,
                    name: nodeName||''
                };
                this.loading = true;
                var that = this;
                /*$.post('/api/authority/black_node/list',
                    data,
                    function (response) {
                        that.loading = false;
                        that.$set(that, 'data', response.data);
                        if(response.page){
                            that.total = response.page.totalElements;
                        }
                    });*/
                that.$http.post('/api/authority/black_node/list',that.querystring.stringify(data))
                    .then(function(response){
                        that.loading = false;
                        that.$set(that, 'data',response.data.data);
                        if(response.data.page){
                            that.total = response.data.page.totalElements;
                        }
                    })
            },

            remove(ids) {
                if (!ids) {
                    ids = [];
                    for (let i in this.$refs.selection.getSelection())
                        ids.push(this.$refs.selection.getSelection()[i].id)
                }
                var that = this;
                that.$http.post('/api/authority/black_node/delete_batch',that.querystring.stringify({black_node_ids: ids.join(',')}))
                    .then(function (response){
                        that.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'error'
                        });
                        that.search();
                    })
            }
        }
    }
</script>