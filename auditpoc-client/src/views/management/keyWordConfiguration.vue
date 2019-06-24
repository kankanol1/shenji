<style>
</style>
<template>
    <div class="layout">
        <div class="layout-content" style="padding:20px 40px">
            <div style="margin:0 auto 18px auto;">
                <el-input style="width: 200px" v-model="sensitive" placeholder="请输入关键字名称" clearable>
                </el-input>
                <el-select
                    v-model="type"
                    placeholder="请选择关键字类型"
                    clearable
                >
                    <el-option
                            v-for="item in typeList"
                            :key="item.content"
                            :label="item.description"
                            :value="item.content"
                    ></el-option>
                </el-select>
                <a href="#" @click="queryKeyWordList">
                    <Button type="primary"
                            style="margin-left: 10px;margin-top: -2px;">查询
                    </Button>
                </a>
                <a href="#" @click="showAddKeyWord">
                    <Button type="primary"
                            style="margin-left: 10px;margin-top: -2px;">添加
                    </Button>
                </a>
                <a href="#" @click="deleteKeyWords">
                    <Button type="error"
                            style="margin-left: 10px;margin-top: -2px;">删除
                    </Button>
                </a>
            </div>
            <Table :loading="tableLoading"
                    border
                    ref="selection"
                    :columns="columns"
                    :data="keyWordData"
                    highlight-current-row
                    style="width:100%"></Table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="total,prev, pager, next, jumper"
                :total="total"
                style="float: right;margin-top:20px">
            </el-pagination>
        </div>
        <el-dialog title="关键字配置"
        :visible.sync="addDialogVisible"
        width="600px">
            <el-form :model="addKeyWordForm" :rules="ruleAddValidate"
                     ref="addKeyWordForm" label-width="30%">
                <el-form-item label="关键字名称" prop="word">
                    <el-input v-model="addKeyWordForm.word"></el-input>
                </el-form-item>
                <el-form-item label="关键字类型" prop="type">
                    <el-select
                               style="width: 100%"
                               v-model="addKeyWordForm.type"
                               placeholder="请选择关键字类型"
                               clearable>
                        <el-option
                            v-for="item in typeList"
                            :key="item.content"
                            :label="item.description"
                            :value="item.content">
                            <span>{{item.description}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="insertKeyWord('addKeyWordForm')">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="关键字编辑"
                   :visible.sync="editDialogVisible"
                   width="600px">
            <el-form :model="selectKeyWordForm" label-width="30%">
                <el-form-item label="关键字名称" prop="name">
                    <el-input v-model="selectKeyWordForm.word"></el-input>
                </el-form-item>
                <el-form-item label="关键字类型" prop="type">
                    <el-select
                            style="width: 100%"
                            v-model="selectKeyWordForm.type"
                            placeholder="请选择关键字类型"
                            clearable>
                        <el-option
                                v-for="item in typeList"
                                :key="item.content"
                                :label="item.description"
                                :value="item.content">
                            <span>{{item.description}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="updateKeyWord('selectKeyWordForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import copy from '../copy.vue';
    import graph from '../../components/cytoscapeGraph.vue';
    import Util from '../../libs/util';
    import searchBar from '../../components/paginationSearchBar.vue';
    import dictionary from '../../config/dictionary';

    export default {
        mounted(){
            this.queryTypeList();
            this.queryKeyWordList();
        },
        components:{
            'layout-copy': copy,
            'search-bar': searchBar
        },
        data(){
            return{
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                currentPage: 0,
                pageSize: 10,
                total: 0,

                sensitive:'',
                type:'',
                keyWordData:[],
                tableLoading: false,
                addDialogVisible: false,
                editDialogVisible: false,
                keyWordForm:{
                    word:''
                },
                typeList:[],
                selectKeyWordForm:{},
                addKeyWordForm:{
                    word:'',
                    type:'',
                },
                ruleAddValidate:{
                    word: [
                        {required: true, message: '请输入关键字名称', trigger: 'blur'},
                    ],
                    type: [
                        {required: true, message: '关键字类型不能为空', trigger: 'blur'},
                    ],
                },
                columns:[
                    {
                        type:'selection',
                        width:60,
                        align:'center'
                    },{
                        title:'关键字名称',
                        key:'word',
                        align:'center'
                    },{
                        title:'关键字类型',
                        key:'type',
                        render: function (h, params) {
                            return h('div',{},dictionary.nodeTypes[params.row.type].display);
                        }
                    },{
                        title:'创建时间',
                        key:'addtime',
                        align:'center',
                        render: (h, params) => {
                            return h('div',{},new Date(params.row.addtime * 1).format('yyyy-MM-dd hh:mm:ss'));
                        }
                    },{
                        title:'创建者',
                        key:'addusername',
                        align:'center'
                    },{
                        title:'操作',
                        key:'id',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            const row = params.row;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showEditKeyWord(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteKeyWord(params.index)
                                        }
                                    }
                                }, '删除'),
                            ])
                        }
                    }
                ]

            }
        },
        methods: {
            /*查询关键字类型列表*/
            queryTypeList() {
                var that = this;
                that.$http.post("/api/dictionaries/vertices?onlyBase=true&includeEdge=false", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var result = response.data.data || [];
                        that.typeList = result.filter(function(v){return v.id!==0});
                    } else if ((response.data.status & 1) != 1) {
                        that.typeList = [];
                        that.$message({
                            showClose: true,
                            message: '关键字类型读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryKeyWordList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.queryKeyWordList();
            },
            /*查询关键字列表*/
            queryKeyWordList(formName){
                //this.$refs[formName].validate((valid) => {
                    //if (valid) {
                        var that = this;
                        var params = {
                            page: this.currentPage - 1,
                            size: this.pageSize,
                        };
                        if (this.sensitive) {
                            params.sensitive = this.sensitive;
                        }
                        if (this.type) {
                            params.type = this.type;
                        }
                        that.tableLoading = true;
                        that.$http.post("/api/log/sensitive/selectSensitive", that.querystring.stringify(params)
                        ).then(function (response) {
                            that.tableLoading = false;
                            if ((response.data.status & 1) == 1) {
                                that.keyWordData = response.data.data;
                                if(response.data.page){
                                    that.total = response.data.page.totalElements;
                                }
                            } else if ((response.data.status & 1) != 1) {
                                that.keyWordData = [];
                                that.$message({
                                    showClose: true,
                                    message: response.data.msg,
                                    type: 'warning'
                                });
                            }
                        })
                    //}
                //});
            },
            /*显示添加页面*/
            showAddKeyWord(){
                this.addKeyWordForm = {};
                this.addDialogVisible = true;
            },
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            /*显示编辑页面*/
            showEditKeyWord(index){
                this.selectKeyWordForm = this.clone(this.keyWordData[index]);
                this.editDialogVisible = true;
            },
            /*添加保存*/
            insertKeyWord(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addKeyWordForm) {
                            var that = this;
                            that.$http.post("/api/log/sensitive/insertSensitive", that.querystring.stringify(that.addKeyWordForm)
                            ).then(function (response) {
                                if ((response.data.status & 1) == 1) {
                                    setTimeout(function () {
                                        that.queryKeyWordList();
                                    }, 0);
                                    that.$message({
                                        showClose: true,
                                        message: response.data.msg,
                                        type: 'success'
                                    });
                                    that.addDialogVisible = false;
                                } else if ((response.data.status & 1) != 1) {
                                    that.$message({
                                        showClose: true,
                                        message: response.data.msg,
                                        type: 'warning'
                                    });
                                }
                            })
                        } else {
                            this.addDialogVisible = false;
                        }
                    } else {
                        return false;
                    }
                });
            },
            /*更新*/
            updateKeyWord(index){
                if (this.selectKeyWordForm) {
                    var that = this;
                    that.$http.post("/api/log/sensitive/updateSensitive", that.querystring.stringify(
                        {
                            "id" : that.selectKeyWordForm.id,
                            "sensitive" : that.selectKeyWordForm.word,
                            "type": that.selectKeyWordForm.type,
                        }
                        )
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            setTimeout(function () {
                                that.queryKeyWordList();
                            }, 0);
                            that.$message({
                                showClose: true,
                                message: '更新成功',
                                type: 'success'
                            });
                            that.editDialogVisible = false;
                        } else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                } else {
                    this.editDialogVisible = false;
                }
            },
            /*单条删除*/
            deleteKeyWord(index){
                var row = this.keyWordData[index];
                this.sendDeleteKeyWordRequest(row.id);
            },
            /*多条删除*/
            deleteKeyWords(index){
                var selections = this.$refs.selection.getSelection();
                var ids = [];
                for (var i = 0; i < selections.length; i++) {
                    ids.push(selections[i].id);
                }
                this.sendDeleteKeyWordRequest(ids.join(","));
            },
            sendDeleteKeyWordRequest(ids) {
                var that = this;
                that.$http.post("/api/log/sensitive/deleteSensitive", that.querystring.stringify({
                        ids: ids,
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.queryKeyWordList();
                        that.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'error'
                        });
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
            }

        }
    }
</script>