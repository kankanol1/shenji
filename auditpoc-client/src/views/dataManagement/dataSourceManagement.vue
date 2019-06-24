<style>
</style>
<template>
    <div class="layout">
        <div class="layout-content"
             style="padding:20px 40px">
            <div style="margin:0 auto 18px auto;">
                <el-input
                        style="width:200px;"
                        v-model="name"
                        placeholder="请输入数据源名称"
                        clearable
                ></el-input>
                <el-select
                        v-model="type"
                        placeholder="请选择数据源类型"
                        clearable
                >
                    <el-option
                            v-for="item in typeList"
                            :key="item"
                            :label="item"
                            :value="item"
                    ></el-option>
                </el-select>
                <el-select
                        v-model="status"
                        placeholder="请选择可用状态"
                        clearable
                >
                    <el-option
                            v-for="item in statusList"
                            :key="item.description"
                            :label="item.description"
                            :value="item.status"
                    ></el-option>
                </el-select>
                <a href="#" @click="queryDataSourceList">
                    <Button type="primary"
                            style="margin-left: 10px;margin-top: -8px;">查询
                    </Button>
                </a>
                <a href="#" @click="showAddDataSource">
                    <Button type="primary"
                            style="margin-left: 10px;margin-top: -8px;">添加
                    </Button>
                </a>
                <a href="#" @click="deleteDataSources">
                    <Button type="primary"
                            style="margin-left: 10px;margin-top: -8px;">删除
                    </Button>
                </a>
            </div>
            <Table :loading="tableLoading"
                   border
                   ref="selection"
                   :columns="columns"
                   :data="dataSourceData"
                   highlight-current-row
                   style="width:100%"></Table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                    style="float: right;margin-top: 20px">
            </el-pagination>
        </div>
        <el-dialog
                title="数据源添加"
                :visible.sync="addDialogVisible"
                width="600px">
            <el-form :model="addDataSourceForm" :rules="ruleValidate"
                     ref="addDataSourceForm"
                     label-width="30%">
                <el-form-item label="数据源名称" prop="name">
                    <el-input v-model="addDataSourceForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据源描述" prop="description">
                    <el-input
                            type="textarea"
                            :row="2"
                            placeholder="请输入数据源描述内容"
                            v-model="addDataSourceForm.description"
                            >
                    </el-input>
                </el-form-item>
                <el-form-item label="数据源类型" prop="type">
                    <el-select
                            style="width: 100%"
                            v-model="addDataSourceForm.type"
                            clearable
                            placeholder="请选择数据源类型"
                    >
                        <el-option
                                v-for="item in typeList"
                                :key="item"
                                :label="item"
                                :value="item">
                            {{item}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ip地址" prop="ip">
                    <el-input v-model="addDataSourceForm.ip" clearable></el-input>
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                    <el-input-number
                              v-model="addDataSourceForm.port" :min="1" :max="65536"></el-input-number>
                </el-form-item>
                <el-form-item label="数据源数据库实例名" prop="dbname">
                    <el-input v-model="addDataSourceForm.dbname" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据源数据库链接方式" prop="tag">
                    <el-select
                            style="width:100%"
                            v-model="addDataSourceForm.tag"
                            clearable
                            placeholder="请选择数据源数据库链接方式"
                    >
                        <el-option
                                v-for="item in tagList"
                                :key="item"
                                :label="item"
                                :value="item"
                        >{{item}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据库链接驱动" prop="driver">
                    <el-select
                            style="width:100%"
                            v-model="addDataSourceForm.driver"
                            clearable
                            placeholder="请选择数据库链接驱动">
                        <el-option
                                v-for="item in driverList"
                                :key="item"
                                :label="item"
                                :value="item"
                        >{{item}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addDataSourceForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passwd">
                    <el-input type="password" v-model="addDataSourceForm.passwd" clearable></el-input>
                </el-form-item>
                <el-form-item label="链接参数" prop="args">
                    <el-input v-model="addDataSourceForm.args" clearable></el-input>
                </el-form-item>
                <el-form-item label="可用状态">
                    <el-select
                            style="width:100%"
                            v-model="addDataSourceForm.status"
                            clearable
                            placeholder="请选择可用状态"
                    >
                        <el-option
                                v-for="item in statusList"
                                :key="item.description"
                                :label="item.description"
                                :value="item.status"
                        >{{item.description}}
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="checkValidity('selectDataSourceForm')">测试链接</el-button>
                <el-button type="primary"
                           @click="insertDataSource('addDataSourceForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="数据源编辑"
                :visible.sync="editDialogVisible"
                width="600px">
            <el-form :modal="selectDataSourceForm"
                     label-width="30%">
                <el-form-item label="数据源名称" prop="name">
                    <el-input v-model="selectDataSourceForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据源描述" prop="description">
                    <el-input
                            type="textarea"
                            :row="2"
                            placeholder="请输入数据源描述内容"
                            v-model="selectDataSourceForm.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="数据源类型" prop="type">
                    <el-select
                            style="width: 100%"
                            v-model="selectDataSourceForm.type"
                            clearable
                            placeholder="请选择数据源类型"
                    >
                        <el-option
                                v-for="item in typeList"
                                :key="item"
                                :label="item"
                                :value="item">
                            {{item}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ip地址" prop="ip">
                    <el-input v-model="selectDataSourceForm.ip" clearable></el-input>
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                    <el-input-number v-model="selectDataSourceForm.port" :min="1" :max="65536"></el-input-number>
                </el-form-item>
                <el-form-item label="数据源数据库实例名" prop="dbname">
                    <el-input v-model="selectDataSourceForm.dbname" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据源数据库链接方式" prop="tag">
                    <el-select
                            style="width:100%"
                            v-model="selectDataSourceForm.tag"
                            clearable
                            placeholder="请选择数据源数据库链接方式"
                    >
                        <el-option
                                v-for="item in tagList"
                                :key="item"
                                :label="item"
                                :value="item"
                        >{{item}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据库链接驱动" prop="driver">
                    <el-select
                            style="width:100%"
                            v-model="selectDataSourceForm.driver"
                            clearable
                            placeholder="请选择数据库链接驱动">
                        <el-option
                                v-for="item in driverList"
                                :key="item"
                                :label="item"
                                :value="item"
                        >{{item}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input
                            v-model="selectDataSourceForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passwd">
                    <el-input type="password" v-model="selectDataSourceForm.passwd" clearable></el-input>
                </el-form-item>
                <el-form-item label="链接参数" prop="args">
                    <el-input v-model="selectDataSourceForm.args" clearable></el-input>
                </el-form-item>
                <el-form-item label="可用状态">
                    <el-select
                            style="width:100%"
                            v-model="selectDataSourceForm.status"
                            clearable
                            placeholder="请选择可用状态"
                    >
                        <el-option
                                v-for="item in statusList"
                                :key="item.description"
                                :label="item.description"
                                :value="item.status"
                        >{{item.description}}
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="checkValidityUpdate('selectDataSourceForm')">测试链接</el-button>
                <el-button type="primary"
                           @click="updateDataSource('selectDataSourceForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

    export default {
        mounted() {
            this.queryTypeList();
            this.queryStatusList();
            this.queryTagList();
            this.queryDriverList();
            this.queryDataSourceList();
        },
        components: {
        },
        data() {
            /*对IP地址进行校验*/
            var ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            const isvalidateIP = (rule, value, callback) => {
                if (value != null && value != "") {
                    if (!ipReg.test(value)) {
                        callback(new Error('您输入的手机号不正确!'))
                    } else {
                        callback();
                    }
                }
                else {
                    callback();
                }
            }
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                currentPage: 0,
                pageSize: 10,
                total: 0,

                typeList: [],
                statusList: [],
                tagList: [],
                driverList: [],


                name: '',
                description: '',
                type: '',
                ip: '',
                port: '',
                dbname: '',
                username: '',
                passwd: '',
                status: '',
                dataSourceData: [],
                tableLoading: false,
                addDialogVisible: false,
                editDialogVisible: false,
                selectDataSourceForm: {},
                addDataSourceForm: {
                    name: '',
                    type: '',
                    ip: '',
                    port: '',
                    dbname: '',
                    driver: '',
                    username: '',
                    passwd: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '请输入数据源名称', trigger: 'blur'},
                    ],
                    type: [
                        {required: true, message: '数据源类型不能为空', trigger: 'blur'},
                    ],
                    ip: [
                        {required: true, message: 'ip地址不能为空', trigger: 'blur'},
                        {validator: isvalidateIP, message: '请输入正确的ip地址'},
                    ],
                    port: [
                        {required: true, message: '端口不能为空'},
                    ],
                    dbname: [
                        {required: true, message: '数据库名称不能为空', trigger: 'blur'},
                    ],
                    driver: [
                        {required: true, message: '数据库驱动不能为空', trigger: 'blur'},
                    ],
                    username: [
                        {
                            required: true,
                            message: '数据源登录名不能为空',
                            trigger: 'blur'
                        },
                    ],
                    passwd: [
                        {
                            required: true,
                            message: '数据源登录密码不能为空',
                            trigger: 'blur'
                        }
                    ],
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '数据源名称',
                        key: 'name',
                        align: 'center'
                    }, {
                        title: '数据源描述',
                        key: 'description',
                        align: 'center',
                    }, {
                        title: '数据源类型',
                        key: 'type',
                        align: 'center',
                    }, {
                        title: 'ip地址',
                        key: 'ip',
                        align: 'center',
                    }, {
                        title: '端口号',
                        key: 'port',
                        align: 'center',
                    }, {
                        title: '数据库名称',
                        key: 'dbname',
                        align: 'center',
                    }, {
                        title: '数据库驱动',
                        key: 'driver',
                        align: 'center',
                    }, {
                        title: '用户名',
                        key: 'username',
                        align: 'center',
                    }, {
                        title: '密码',
                        key: 'passwd',
                        align: 'center',
                        render: (h,params) => {
                            return h('div',{},(params.row.passwd||'').replace(/./g,"*"));
                        }
                    }, {
                        title: '数据库状态',
                        key: 'statusdesc',
                        align: 'center',
                        render: (h,params) => {
                            const row = params.row;
                            let tmpStr = "";
                            if(row.status==-1){
                                tmpStr = "错误";
                            }else if(row.status==0){
                                tmpStr = "弃用";
                            }else if(row.status==1){
                                tmpStr = "正常";
                            }else{
                                tmpStr = "异常链接";
                            }
                            return h('div', [
                                h('span',{
                                    style:{
                                        color: (row.status==-1)?"#f9906f":(row.status==0?"#c93756":(row.status==1?"#19be6b":"#f47983"))
                                    }
                                },tmpStr)
                            ])
                        }
                    }, {
                        title: '操作',
                        key: 'id',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            const row = params.row;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.cloneDataSource(params.index)
                                        }
                                    }
                                }, '克隆'),
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
                                            this.showEditDataSource(params.index)
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
                                            this.deleteDataSource(params.index)
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
            /*查询数据源类型列表*/
            queryTypeList() {
                var that = this;
                that.$http.post("/api/dataorigin/typelist", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.typeList = response.data.data || [];
                    } else if ((response.data.status & 1) != 1) {
                        that.typeList = [];
                        that.$message({
                            showClose: true,
                            message: '数据源类型读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            /*查询数据源状态下拉数据*/
            queryStatusList() {
                var that = this;
                that.$http.post("/api/dataorigin/statuslist", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.statusList = response.data.data || [];
                    } else if ((response.data.status & 1) != 1) {
                        that.statusList = [];
                        that.$message({
                            showClose: true,
                            message: '可用状态读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            /*查询数据源数据库链接方式*/
            queryTagList() {
                var that = this;
                that.$http.post("/api/dataorigin/taglist", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.tagList = response.data.data || [];
                    } else if ((response.data.status & 1) != 1) {
                        that.tagList = [];
                        that.$message({
                            showClose: true,
                            message: '数据库链接方式失败',
                            type: 'warning'
                        });
                    }
                })
            },
            /*查询数据源驱动下拉数据*/
            queryDriverList() {
                var that = this;
                that.$http.post("/api/dataorigin/driverlist", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.driverList = response.data.data || [];
                    } else if ((response.data.status & 1) != 1) {
                        that.driverList = [];
                        that.$message({
                            showClose: true,
                            message: '数据库链路读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryDataSourceList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.queryDataSourceList();
            },
            /*查询数据源列表*/
            queryDataSourceList() {
                var that = this;
                var params = {
                    page: this.currentPage - 1,
                    size: this.pageSize,
                };
                if (this.name) {
                    params.name = this.name;
                }
                if (this.type) {
                    params.type = this.type;
                }
                if (-2<this.status && this.status<3) {
                    //this.status != undefined && this.status != ''
                    params.status = this.status;
                }
                that.tableLoading = true;
                that.$http.post("/api/dataorigin/selectNode", that.querystring.stringify(params)
                ).then(function (response) {
                    that.tableLoading = false;
                    if ((response.data.status & 1) == 1) {
                        that.dataSourceData = response.data.data;
                        that.total = response.data.page.totalElements;
                    } else if ((response.data.status & 1) != 1) {
                        that.dataSourceData = [];
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            /*新增下的检验数据库链接是否可用*/
            checkValidity(formName) {
                if (this.addDataSourceForm) {
                    var that = this;
                    that.$http.post("/api/dataorigin/checkValidity", that.querystring.stringify(that.addDataSourceForm)
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            setTimeout(function () {
                            }, 0);
                            that.$message({
                                showClose: true,
                                message: '连接成功',
                                type: 'success'
                            })
                        } else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                } else {
                    that.$message({
                        showClose: true,
                        message: '请先输入',
                        type: 'info'
                    })
                }
            },
            /*新增下的检验数据库链接是否可用*/
            checkValidityUpdate(formName) {
                if (this.addDataSourceForm) {
                    var that = this;
                    that.$http.post("/api/dataorigin/checkValidity", that.querystring.stringify(that.selectDataSourceForm)
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            setTimeout(function () {
                            }, 0);
                            that.$message({
                                showClose: true,
                                message: '连接成功',
                                type: 'success'
                            })
                        } else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                } else {
                    that.$message({
                        showClose: true,
                        message: '请先输入',
                        type: 'info'
                    })
                }
            },
            /*添加数据源列表*/
            insertDataSource(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addDataSourceForm) {
                            var that = this;
                            that.$http.post("/api/dataorigin/insertNode", that.querystring.stringify(that.addDataSourceForm)
                            ).then(function (response) {
                                if ((response.data.status & 1) == 1) {
                                    setTimeout(function () {
                                        that.queryDataSourceList();
                                    }, 0);
                                    that.$message({
                                        showClose: true,
                                        message: '添加成功',
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
            showAddDataSource() {
                this.addDataSourceForm = {
                    status: 1
                };
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
            /*克隆数据源*/
            cloneDataSource(index) {
                var row = this.dataSourceData[index];
                var datasourceId = row.id;
                var that = this;
                that.$http.post("/api/dataorigin/cloneNode", that.querystring.stringify({
                        id: datasourceId,
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        setTimeout(function () {
                            that.queryDataSourceList();
                        }, 0);
                        that.$message({
                            showClose: true,
                            message: '添加成功',
                            type: 'info'
                        });
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    } else {
                        this.addDialogVisible = false;
                    }
                })
            },
            /*编辑数据源后预加载数据*/
            showEditDataSource(index) {
                this.selectDataSourceForm = this.clone(this.dataSourceData[index]);
                this.editDialogVisible = true;
            },
            /*更新数据源*/
            updateDataSource(index) {
                if (this.selectDataSourceForm) {
                    var that = this;
                    that.$http.post("/api/dataorigin/updateNode", that.querystring.stringify(that.selectDataSourceForm)
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            setTimeout(function () {
                                that.queryDataSourceList();
                            }, 0);
                            that.$message({
                                showClose: true,
                                message: '更新成功',
                                type: 'info'
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
            /*勾选删除，可一次性删除多个*/
            deleteDataSources(index) {
                var selections = this.$refs.selection.getSelection();
                var ids = [];
                for (var i = 0; i < selections.length; i++) {
                    ids.push(selections[i].id);
                }
                this.sendDeleteDataSourceRequest(ids.join(","));
            },
            /*单条数据删除*/
            deleteDataSource(index) {
                var row = this.dataSourceData[index];
                this.sendDeleteDataSourceRequest(row.id);
            },
            sendDeleteDataSourceRequest(ids) {
                var that = this;
                that.$http.post("/api/dataorigin/deleteNode", that.querystring.stringify({
                        ids: ids,
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.queryDataSourceList();
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