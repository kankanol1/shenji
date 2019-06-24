<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px'" style="padding: 20px 40px 0 40px">
            <div style="margin-left:30%;margin-bottom:18px;">
                <el-select
                        v-model="selectStartVertexId"
                        filterable
                        clearable
                        remote
                        placeholder="请输入开始节点关键词"
                        :remote-method="queryStartVertexsByName"
                        :loading="startLoading">
                    <el-option
                            v-for="item in selectStartData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                    </el-option>
                </el-select>
                <el-select
                        v-model="selectEndVertexId"
                        filterable
                        clearable
                        remote
                        placeholder="请输入结束节点关键词"
                        :remote-method="queryEndVertexsByName"
                        :loading="endLoading">
                    <el-option
                            v-for="item in selectEndData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                    </el-option>
                </el-select>

                <a href="#" @click="queryEdge">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;" :disabled="!(this.selectStartVertexId && this.selectEndVertexId)">查询</Button>
                </a>
                <a href="#" @click="showAddEdge">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;" :disabled="!(this.selectStartVertexId && this.selectEndVertexId)">添加</Button>
                </a>
            </div>
            <Table :loading="tableLoading"
                   border
                   ref="singleTable"
                   :columns="columns"
                   :data="edgeData"
                   highlight-current-row
                   style="width:100%"></Table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentTBPage"
                    :page-size="pageTBSize"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    style="float: right;margin-top: 20px">
            </el-pagination>
        </div>
        <el-dialog
                title="边编辑"
                :visible.sync="dialogVisible"
                width="600px">
            <el-form :modal="selectEdgeForm" label-width="30%">
                <el-form-item v-for="item in currentEdgeProps" :label="item.display" :prop="item.name">
                    <el-input v-if="item.date===false" v-model="selectEdgeForm[item.name]"></el-input>
                    <el-date-picker
                            style="width:100%"
                            v-if="item.date===true"
                            v-model="selectEdgeForm[item.name]"
                            type="date"
                            :format="item.dateFormat"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateEdge">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="边添加"
                :visible.sync="addDialogVisible"
                width="600px">
            <el-form :modal="selectEdgeForm" label-width="30%">
                <el-form-item label="边类型">
                    <el-select
                            style="width:100%"
                            v-model="edgeType"
                            placeholder="请选择添加类型"
                            @change="changeEdgeType">
                        <el-option
                                v-for="item in edgeTypeList"
                                :key="item.id"
                                :label="item.description"
                                :value="item.content">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-for="item in currentEdgeProps" :label="item.display" :prop="item.name">
                    <el-input v-if="item.date===false" v-model="selectEdgeForm[item.name]"></el-input>
                    <el-date-picker
                            style="width:100%"
                            v-if="item.date===true"
                            v-model="selectEdgeForm[item.name]"
                            type="date"
                            :format="item.dateFormat"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEdge">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    import Util from '../libs/util';

    export default {
        mounted() {
            this.queryEdgeProp();
            this.queryEdgeTypeList();
        },
        components: {
        },
        data() {
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                currentPage: 0,
                pageSize: 10,

                currentTBPage: 1,
                pageTBSize: 10,
                total: 0,

                selectStartData: [],
                selectEndData: [],

                selectStartVertexId: '',
                selectEndVertexId: '',

                edgeProps:{},
                edgeData:[],
                selectEdgeForm:{},
                edgeType:null,

                currentProps:[],
                currentEdgeProps:[],
                selectEdgeId:'',
                edgeTypeList:[],

                dialogVisible: false,
                addDialogVisible: false,
                startLoading: false,
                endLoading: false,
                tableLoading: false,
                columns: [
                    {
                        title: '节点类型',
                        key: 'type',
                        align: 'center'
                    },{
                        title: '节点属性',
                        key: 'propertyList',
                        align: 'center',
                        render: (h,params) => {
                        const row = params.row;
            return h('div', [
                h('span',{},row.propertyList.tips)
            ])
        }
        },{
                title: '操作',
                    key: 'id',
                    align: 'center',
                    render: (h,params) => {
                    const row = params.row;
                    return h('div', [
                        h('Button',{
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                this.showUpdateEdge(params.index)
                        }
                }
                },'编辑'),
                    h('Button',{
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        on: {
                            click: () => {
                            this.deleteEdge(params.index)
                    }
                }
                },'删除'),
                ])
                }
            },
        ],
        }
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            showAddEdge() {
                this.clearForm();
                this.currentEdgeProps = {};
                this.selectEdgeForm = {};
                this.addDialogVisible = true;
            },
            showUpdateEdge(index) {
                this.clearForm();
                var edgeData = this.edgeData[index];

                var id = edgeData.id;
                var that = this;
                that.$http.post("/api/node/selectNode", that.querystring.stringify({
                        id:id,
                        type:'edge'
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var item = response.data.data;
                        var type = item.type;
                        that.currentEdgeProps = that.edgeProps[type].properties;
                        that.selectEdgeForm = item.propertyList;
                        that.dialogVisible = true;
                    } else if ((response.data.status & 1) != 1) {
                        that.selectEdgeForm = {};
                        that.dialogVisible = false;
                        that.$message({
                            showClose: true,
                            message: '节点类型列表读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            clearForm() {
                this.currentEdgeProps = null;
                this.selectEdgeForm = null;
                this.edgeType = '';
            },
            addEdge(){
                var params1 = [];
                var params2 = [];
                if(this.selectEdgeForm){
                    for(var i=0;i<this.currentEdgeProps.length;i++){
                        var item = this.currentEdgeProps[i];
                        var key = item.name;
                        if(this.selectEdgeForm[key]){
                            params1.push(key+"@@"+this.selectEdgeForm[key]);
                        }else{
                            params2.push(key);
                        }
                    }
                    var that = this;
                    that.$http.post("/api/node/insertNode", that.querystring.stringify({
                            from:that.selectStartVertexId,
                            to:that.selectEndVertexId,
                            type:'edge',
                            label:that.edgeType,
                            kvs:params1.join('$$'),
                            dkeys:params2.join(','),
                        })
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            setTimeout(function(){
                                that.queryEdge();
                            },1000);
                            that.$message({
                                showClose: true,
                                message: '添加成功',
                                type: 'success'
                            });
                            that.addDialogVisible = false;
                            that.clearForm();
                        } else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                }
            },
            updateEdge() {
                var params1 = [];
                var params2 = [];
                if(this.selectEdgeForm){
                    for(var i=0;i<this.currentEdgeProps.length;i++){
                        var item = this.currentEdgeProps[i];
                        var key = item.name;
                        if(this.selectEdgeForm[key]){
                            params1.push(key+"@@"+this.selectEdgeForm[key]);
                        }else{
                            params2.push(key);
                        }
                    }
                    var that = this;
                    that.$http.post("/api/node/updateNode", that.querystring.stringify({
                            id:that.selectEdgeForm.id,
                            type:'edge',
                            kvs:params1.join('$$'),
                            dkeys:params2.join(','),
                        })
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            that.queryEdge();
                            that.$message({
                                showClose: true,
                                message: '更新成功',
                                type: 'success'
                            });
                            that.dialogVisible = false;
                        } else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                }
            },
            deleteEdge(index) {
                var that = this;
                var edgeId = this.edgeData[index].id;
                that.$http.post("/api/node/deleteNode", that.querystring.stringify({
                        id:edgeId,
                        type:'edge',
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'error'
                        });
                        setTimeout(function(){
                            that.queryEdge();
                        },1000);

                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })

            },
            queryEdgeProp() {
                var that = this;
                that.$http.post("/api/dictionaries/fields", that.querystring.stringify({
                        type:'edge'
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.edgeProps = response.data.data.edge;
                    } else if ((response.data.status & 1) != 1) {
                        that.edgeProps = {};
                        that.$message({
                            showClose: true,
                            message: '边属性读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryEdge() {
                var that = this;
                if (this.selectStartVertexId && this.selectEndVertexId) {
                    that.tableLoading = true;
                    that.$http.post("/api/graph/linksBetween", that.querystring.stringify({
                            "page": that.currentTBPage - 1,
                            "size": that.pageTBSize,
                            "id1": this.selectStartVertexId,
                            "id2": this.selectEndVertexId,
                        })
                    ).then(function (response) {
                        that.tableLoading = false;
                        if (response.status === 200 && (response.data.status & 1) == 1) {
                            that.edgeData = response.data.data;
                        } else if ((response.data.status & 1) != 1) {
                            that.edgeData = [];
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                } else {
                    that.edgeData = [];
                }
            },
            queryStartVertexsByName(query) {
                this.queryVertexsByName(query,'startLoading','selectStartData');
            },
            queryEndVertexsByName(query) {
                this.queryVertexsByName(query,'endLoading','selectEndData');
            },
            changeEdgeType(item){
                if(this.edgeProps[item]){
                    this.currentEdgeProps = this.edgeProps[item].properties||[];
                } else {
                    this.currentEdgeProps = [];
                }
            },
            queryEdgeTypeList(){
                var that = this;
                that.$http.post("/api/dictionaries/edges", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var result = response.data.data||[];
                        that.edgeTypeList = result.filter(function(o){return !!o.id;});
                    } else if ((response.data.status & 1) != 1) {
                        that.edgeTypeList = [];
                        that.$message({
                            showClose: true,
                            message: '边类型列表读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryVertexsByName(query,loadingKey,selectDataKey) {
                var that = this;
                if (query !== '') {
                    that[loadingKey] = true;
                    that.$http.post("/api/node/queryNodes", that.querystring.stringify({
                            "page": that.currentPage,
                            "size": that.pageSize,
                            "value": query,
                        })
                    ).then(function (response) {
                        that[loadingKey] = false;
                        if ((response.data.status & 1) == 1) {
                            that[selectDataKey] = response.data.data;
                        } else if ((response.data.status & 1) != 1) {
                            that[selectDataKey] = [];
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                } else {
                    that[selectDataKey] = [];
                }
            }
        }
    };
</script>