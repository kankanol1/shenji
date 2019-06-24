<template>
    <div class="layout">
        <div class="layout-content" style="padding: 20px 40px">
            <div style="margin:0 auto 18px auto;">
                <el-input
                        style="width:200px;"
                        v-model="roleName"
                        placeholder="请输入角色名称"
                        clearable
                ></el-input>
                <el-input
                        style="width:200px;"
                        v-model="roleDescription"
                        placeholder="请输入角色描述"
                        clearable
                ></el-input>
                <el-select
                        v-model="roleExp"
                        placeholder="请选择导出权限"
                        clearable
                >
                    <el-option
                            v-for="item in expData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select
                        v-model="roleDetail"
                        placeholder="请选择查看详情权限"
                        clearable
                >
                    <el-option
                            v-for="item in detailData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <a href="#" @click="queryRoleList">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;" >查询</Button>
                </a>
                <a href="#" @click="showAddRole">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;" >添加</Button>
                </a>
                <a href="#" @click="deleteRoles">
                    <Button type="error" style="margin-left: 10px;margin-top: -8px;" >删除</Button>
                </a>
            </div>
            <Table :loading="tableLoading"
                   border
                   ref="selection"
                   :columns="columns"
                   :data="roleData"
                   highlight-current-row
                   style="width:100%"></Table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    style="float: right;margin-top: 20px">
            </el-pagination>
        </div>
        <el-dialog
                title="角色添加"
                :visible.sync="addDialogVisible"
                width="600px">
            <el-form :model="addRoleForm"
                     label-width="30%">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="addRoleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入角色描述内容"
                            v-model="addRoleForm.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="顶点类型" prop="vper">
                    <el-select
                            style="width:100%"
                            v-model="addVType"
                            @change="changeAddVType"
                            multiple
                            clearable
                            placeholder="请选择顶点类型">
                        <el-option
                                v-for="item in roleVData"
                                :key="item.id"
                                :label="item.description"
                                :value="item.id">
                            <span style="float: left">{{ item.description }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px;margin-right:20px;">{{ item.content }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="边类型" prop="eper">
                    <el-select
                            style="width:100%"
                            v-model="addEType"
                            @change="changeAddEType"
                            multiple
                            clearable
                            placeholder="请选择边类型">
                        <el-option
                                v-for="item in addRoleEData"
                                :key="item.id"
                                :label="item.description"
                                :value="item.id">
                            <span style="float: left">{{ item.description }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px;margin-right:20px;">{{ item.content }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="导出权限" prop="exp">
                    <el-radio-group v-model="addRoleForm.exp" size="small">
                        <el-radio label="1" border>允许</el-radio>
                        <el-radio label="0" border>不允许</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="查看详情权限" prop="detail">
                    <el-radio-group v-model="addRoleForm.detail" size="small">
                        <el-radio label="1" border>允许</el-radio>
                        <el-radio label="0" border>不允许</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="行政区划" prop="rlist">
                    <el-select
                            style="width:100%"
                            v-model="addRoleForm.rlist"
                            clearable
                            placeholder="请选择行政区划">
                        <el-option
                                v-for="item in roleCodeData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertRole('addRoleForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="角色编辑"
                :visible.sync="editDialogVisible"
                width="600px">
            <el-form :model="selectRoleForm"
                     label-width="30%">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="selectRoleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入角色描述内容"
                            v-model="selectRoleForm.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="顶点类型" prop="vper">
                    <el-select
                            style="width:100%"
                            v-model="editVType"
                            @change="changeEditVType"
                            multiple
                            clearable
                            placeholder="请选择顶点类型">
                        <el-option
                                v-for="item in roleVData"
                                :key="item.id"
                                :label="item.description"
                                :value="item.id">
                            <span style="float: left">{{ item.description }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px;margin-right:20px;">{{ item.content }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="边类型" prop="eper">
                    <el-select
                            style="width:100%"
                            v-model="editEType"
                            @change="changeEditEType"
                            multiple
                            clearable
                            placeholder="请选择边类型">
                        <el-option
                                v-for="item in editRoleEData"
                                :key="item.id"
                                :label="item.description"
                                :value="item.id">
                            <span style="float: left">{{ item.description }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px;margin-right:20px;">{{ item.content }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="导出权限" prop="exp">
                    <el-radio-group v-model="selectRoleForm.exp" size="small">
                        <el-radio label="1" border>允许</el-radio>
                        <el-radio label="0" border>不允许</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="查看详情权限" prop="detail">
                    <el-radio-group v-model="selectRoleForm.detail" size="small">
                        <el-radio label="1" border>允许</el-radio>
                        <el-radio label="0" border>不允许</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="行政区划" prop="rlist">
                    <el-select
                            style="width:100%"
                            v-model="selectRoleForm.rlist"
                            clearable
                            placeholder="请选择行政区划">
                        <el-option
                                v-for="item in roleCodeData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateRole('selectRoleForm')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    import copy from '../copy.vue';
    import Util from '../../libs/util';

    export default {
        mounted() {
            this.queryRoleCode();
            this.queryRoleVData();
            var that = this;
            this.queryRoleEData('','roleEData',function(data){
                that.addRoleEData = [].concat(data);
                that.editRoleEData = [].concat(data);
            });

            this.queryRoleList();
        },
        components: {
            'layout-copy': copy,
        },
        data() {
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                currentPage: 0,
                pageSize: 10,
                total: 0,

                expData: [{
                    value: '1',
                    label: '允许导出'
                }, {
                    value: '0',
                    label: '不允许导出'
                }],
                detailData: [{
                    value: '1',
                    label: '允许查看详情'
                }, {
                    value: '0',
                    label: '不允许查看详情'
                }],

                roleName:'',
                roleDescription: '',
                roleExp: '',
                roleDetail: '',

                addVType:[],
                addEType:[],
                editVType:[],
                editEType:[],

                roleCodeData:[], //行政区划数据
                roleVData: [],
                roleEData: [],
                addRoleEData: [],
                editRoleEData: [],
                roleData: [],    //办公室数据

                addDialogVisible: false,
                editDialogVisible: false,

                tableLoading: false,
                selectRoleForm: {},
                addRoleForm: {
                    detail:'1',
                    exp:'1'
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '角色名称',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '角色描述',
                        key: 'description',
                        align: 'center',
                    },{
                        title: '顶点类型',
                        key: 'vdesc',
                        align: 'center',
                    },{
                        title: '边类型',
                        key: 'edesc',
                        align: 'center',
                    },{
                        title: '导出权限',
                        key: 'expdesc',
                        align: 'center',
                    },{
                        title: '查看详细信息权限',
                        key: 'detaildesc',
                        align: 'center',
                    },{
                        title: '行政区划',
                        key: 'rdesc',
                        align: 'center',
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
                                            this.showEditRole(params.index)
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
                                            this.deleteRole(params.index)
                                        }
                                    }
                                },'删除'),
                            ])
                        }
                    },
                ]
            };
        },
        methods: {
            queryRoleVData() {
                var that = this;
                that.$http.post("/api/dictionaries/vertices", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var result = response.data.data || [];
                        that.roleVData = result.filter(function(v){return v.id!==0});
                    } else if ((response.data.status & 1) != 1) {
                        that.roleVData = [];
                        that.$message({
                            showClose: true,
                            message: '顶点类型读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryRoleEData(vValue,key,callback) {
                var that = this;
                var params = {};

                if(vValue){
                    params.relevanceVertices = vValue;
                }
                that.$http.post("/api/dictionaries/edges", that.querystring.stringify(params)
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var result = response.data.data || [];
                        that[key] = result.filter(function(v){return v.id!==0});
                        if(callback){
                            callback(that[key]);
                        }
                    } else if ((response.data.status & 1) != 1) {
                        that[key] = [];
                        that.$message({
                            showClose: true,
                            message: '边类型读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryRoleCode() {
                var that = this;
                that.$http.post("/api/regioncode/selectChildren", that.querystring.stringify({
                        pid:'370000'
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.roleCodeData = response.data.data;
                    } else if ((response.data.status & 1) != 1) {
                        that.roleCodeData = [];
                        that.$message({
                            showClose: true,
                            message: '行政区划读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryRoleList() {
                var that = this;
                var params = {
                    page: this.currentPage - 1,
                    size: this.pageSize,
                };
                if(this.roleName){
                    params.name = this.roleName;
                }
                if(this.roleDescription){
                    params.description = this.roleDescription;
                }
                if(this.roleExp && this.roleExp !== 'all'){
                    params.exp = this.roleExp;
                }
                if(this.roleDetail && this.roleDetail !== 'all'){
                    params.detail = this.roleDetail;
                }
                that.tableLoading = true;
                that.$http.post("/api/role/selectNode", that.querystring.stringify(params)
                ).then(function (response) {
                    that.tableLoading = false;
                    if ((response.data.status & 1) == 1) {
                        that.roleData = response.data.data;
                        that.total = response.data.page.totalElements;
                    } else if ((response.data.status & 1) != 1) {
                        that.roleData = [];
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
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
            showAddRole() {
                this.addRoleForm = {
                    detail:'1',
                    exp:'1'
                };
                this.addVType = [];
                this.addEType = [];
                this.addDialogVisible = true;
            },
            showEditRole(index) {
                this.editVType = [];
                this.editEType = [];

                this.selectRoleForm = this.clone(this.roleData[index]);
                var vArr = [];
                var eArr = [];
                for(var i=0;i<this.roleVData.length;i++){
                    vArr.push(this.roleVData[i].id);
                }
                for(var i=0;i<this.roleEData.length;i++){
                    eArr.push(this.roleEData[i].id);
                }
                this.editVType = this.valueToArray(this.selectRoleForm.vper,vArr);
                this.editEType = this.valueToArray(this.selectRoleForm.eper,eArr);
                this.selectRoleForm.detail = this.selectRoleForm.detail + "";
                this.selectRoleForm.exp = this.selectRoleForm.exp + "";
                this.editDialogVisible = true;
            },
            deleteRoles() {
                var selections = this.$refs.selection.getSelection();
                var ids = [];
                for(var i=0;i<selections.length;i++){
                    ids.push(selections[i].id);
                }
                this.sendDeleteRoleRequest(ids.join(","));
            },
            deleteRole(index) {
                var row = this.roleData[index];
                this.sendDeleteRoleRequest(row.id);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryRoleList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.queryRoleList();
            },
            arrayToValue(array) {
                var result = 0;
                for(var i=0;i<array.length;i++){
                    var id = array[i];
                    result += id;
                }
                return result;
            },
            valueToArray(value,array) {
                array.sort(function(a,b){return b-a;});
                var result = [];
                var v = value;
                for(var i=0;i<array.length;i++){
                    var id = array[i];
                    if(id<=v){
                        v = v-id;
                        result.splice(result.length-1,0,id);
                    }
                }
                return result;
            },
            changeAddVType(val) {
                this.addRoleForm.vper = this.arrayToValue(val);
                this.queryRoleEData(this.addRoleForm.vper,'addRoleEData');
                this.addEType = [];
                this.addRoleForm.eper = this.arrayToValue(this.addEType);
            },
            changeAddEType(val) {
                this.addRoleForm.eper = this.arrayToValue(val);
            },
            changeEditVType(val) {
                this.selectRoleForm.vper = this.arrayToValue(val);
                this.queryRoleEData(this.selectRoleForm.vper,'editRoleEData');
                this.editEType = [];
                this.selectRoleForm.eper = this.arrayToValue(this.editEType);
            },
            changeEditEType(val) {
                this.selectRoleForm.eper = this.arrayToValue(val);
            },
            insertRole(formName) {
                if(this.addRoleForm){
                    var that = this;
                    that.$http.post("/api/role/insertNode", that.querystring.stringify(that.addRoleForm)
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            setTimeout(function(){
                                that.queryRoleList();
                            },0);
                            that.$message({
                                showClose: true,
                                message: '添加成功',
                                type: 'success'
                            });
                            that.addDialogVisible = false;
                            that.addRoleForm = {
                                detail:'1',
                                exp:'1'
                            };
                        } else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                }else{
                    this.addDialogVisible = false;
                }
            },
            updateRole() {
                if(this.selectRoleForm){
                    var that = this;
                    that.$http.post("/api/role/updateNode", that.querystring.stringify(that.selectRoleForm)
                    ).then(function (response) {
                        if ((response.data.status & 1) == 1) {
                            setTimeout(function(){
                                that.queryRoleList();
                            },0);
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
                }else{
                    this.editDialogVisible = false;
                }
            },
            sendDeleteRoleRequest(ids) {
                var that = this;
                that.$http.post("/api/role/deleteNode", that.querystring.stringify({
                        ids:ids,
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.queryRoleList();
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
    };
</script>