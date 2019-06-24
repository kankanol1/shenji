<style scoped="">
    .passText {
        text-align: center;
        margin: 40px 0;
        font-weight: bold;
    }

    .form {
        padding-right: 20px
    }

    .clearfix {
        clear: both;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px'">
            <Modal v-model="showModal" @on-ok="nextStep" loading ref="addModal" width="60%" style="min-height:400px;" okText="下一步">
                <div class="ivu-input-group-with-prepend" style="display: inline-flex;margin-bottom: 10px;">
                    <el-input v-model="addInput" placeholder="请输入用户名" style="width:500px;"></el-input>
                </div>
                <Table :loading="loading" border ref="userSelection" :columns="userColumns" :data="userTableData" @on-select="onSelect"></Table>
            </Modal>
            <Modal v-model="doubtsShowModal" title="疑点权限" @on-ok="nextStep2" width="60%" okText="下一步" style="text-align: center">
                <div class="ivu-input-group-with-prepend" style="display: inline-flex;">
                    <el-input v-model="doubtsAddInput" placeholder="请输入相关疑点关键字" style="width: 500px;"></el-input>
                </div>
                <div style="padding: 5px;overflow-y: auto">
                    <legend style="text-align: left;font-size: 14px;font-weight: 800">&nbsp;&nbsp;可选</legend>
                    <Row style="text-align: right">
                        <Checkbox :indeterminate="indeterminate"
                                  :value="checkAll"
                                  @click.prevent.native="handleCheckAll" style="float: left;padding: 10px;">全选
                        </Checkbox>
                        <em style="padding-right: 15px;color: grey;font-size: 10px;">检索到{{total}}条记录，共{{totalPages}}页，当前第{{page + 1}}页</em>
                        <ButtonGroup v-show="nodeData.length>0" style="padding-left: 10px;">
                            <Button type="primary" size="small" :disabled="first" @click.stop="preData">
                                <Icon type="chevron-left"></Icon>上一页
                            </Button>
                            <Button type="primary" size="small" :disabled="last" @click.stop="nextData">
                                <Icon type="chevron-right"></Icon>下一页
                            </Button>
                        </ButtonGroup>
                    </Row>
                    <Row style="text-align: left;">
                        <Col span="22" offset="1">
                            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                <Checkbox v-for="node in nodeData" :key="node.id" :label="node.id"
                                          style="padding: 5px 10px;border-radius: 5px;margin-bottom:10px;border:1px solid #dddee1"
                                >{{node.name}}
                                    <em>(编号{{node.uid}})</em>
                                </Checkbox>
                            </CheckboxGroup>
                        </Col>
                    </Row>
                </div>
                <div style="padding: 5px;overflow-y: auto;text-align: left;">
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
            <!--单击修改后弹出的窗口><-->
            <Modal v-model="doubtsShowModalEdit" title="疑点权限" :doubtsDetailUserNameId="doubtsDetailUserNameId" @on-ok="update_nextStep2" okText="下一步" @on-visible-change="onVisibleChange" width="60%" style="text-align: center" >
                <div class="ivu-input-group-with-prepend" style="display: inline-flex;">
                    <el-input v-model="doubtsAddInput" placeholder="请输入相关疑点关键字" style="width: 500px;"></el-input>
                </div>
                <div style="height: 250px;padding: 5px;overflow-y: auto">
                    <legend style="text-align: left;font-size: 14px;font-weight: 800">&nbsp;&nbsp;可选</legend>
                    <Row style="text-align: right">
                        <Checkbox :indeterminate="indeterminate"
                                  :value="checkAll"
                                  @click.prevent.native="handleCheckAll" style="float: left;padding: 10px;">全选
                        </Checkbox>
                        <em style="padding-right: 15px;color: grey;font-size: 10px;">检索到{{total}}条记录，共{{totalPages}}页，当前第{{page + 1}}页</em>
                        <ButtonGroup v-show="nodeData.length>0" style="padding-left: 10px;">
                            <Button type="primary" size="small" :disabled="first" @click.stop="preData">
                                <Icon type="chevron-left"></Icon>上一页
                            </Button>
                            <Button type="primary" size="small" :disabled="last" @click.stop="nextData">
                                <Icon type="chevron-right"></Icon>下一页
                            </Button>
                        </ButtonGroup>
                    </Row>
                    <Row style="text-align: left;">
                        <Col span="22" offset="1">
                            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                <Checkbox v-for="node in nodeData" :key="node.id" :label="node.id" id="Radio"
                                          style="padding: 5px 10px;border-radius: 5px;margin-bottom:10px;border:1px solid #dddee1"
                                >{{node.name}}
                                    <em>(编号{{node.uid}})</em>
                                </Checkbox>
                            </CheckboxGroup>
                        </Col>
                    </Row>
                </div>
                <div style="height: 200px;padding: 5px;overflow-y: auto;text-align: left;">
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
            <Modal v-model="nodeShowModalEdit" @on-ok="doubtsShowEditSure" width="60%">
                <div class="form">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                        <FormItem label="授权点类型列表" prop="vper">
                            <Select v-model="formValidateEdit.vper" placeholder="请选择授权点类型" multiple>
                                <Option v-for="(item,index) in nodeTypeListData" :key="item.id" :value="item.id">
                                    {{item.description}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="授权疑点类型列表" prop="doubtslist">
                            <Select v-model="formValidateEdit.dper" placeholder="请选择授权疑点类型">
                                <Option v-for="(item,index) in doubtsTypeListData" :key="item.id" :value="item.id">
                                    {{item.description}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
            <Modal v-model="nodeShowModal" @on-ok="ok" width="60%">
                <div class="form">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                        <FormItem label="授权点类型列表" prop="vper">
                            <Select v-model="formValidate.vper" placeholder="请选择授权点类型" multiple>
                                <Option v-for="(item,index) in nodeTypeListData" :key="item.id" :value="item.id">
                                    {{item.description}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="授权疑点类型列表" prop="doubtslist">
                            <Select v-model="formValidate.dper" placeholder="请选择授权疑点类型">
                                <Option v-for="(item,index) in doubtsTypeListData" :key="item.id" :value="item.id">
                                    {{item.description}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
            <Modal v-model="vListShowModal">

            </Modal>
            <!--单击后弹出的授权疑点列表窗口><-->
            <Modal v-model="vperShowModal" @on-ok="vperSure">
                <div class="form">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                        <FormItem label="授权点类型列表" prop="vper">
                            <Select v-model="formValidate.vper" placeholder="请选择授权点类型" ref="vperList" multiple>
                                <Option v-for="(item,index) in nodeTypeListData" :key="item.id" :value="item.id">
                                    {{item.description}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
            <!--单击后弹出的授权疑点类型列表窗口><-->
            <Modal v-model="dperShowModal" @on-ok="dperSure">
                <div class="form">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                        <FormItem label="授权疑点类型列表" prop="doubtslist">
                            <Select v-model="formValidate.dper" placeholder="请选择授权疑点类型" ref="dperList">
                                <Option v-for="(item,index) in doubtsTypeListData" :key="item.id" :value="item.id">
                                    {{item.description}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
            <div style="padding: 0px 40px;">
                <Row style="padding: 30px 0 5px 0;">
                    <Input v-model="nameValue" placeholder="请输入用户名" :style="'width:' +width/4 +'px'"/>
                    <Button type="primary" @click="searchUser" icon="search">搜索</Button>
                    <Button @click="show()" icon="plus-round" type="primary">添加</Button>
                    <Button @click="remove()" icon="minus-round" type="error">删除</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border ref="selection" :columns="columns" :data="tableData"
                           :height="height-235"></Table>
                </Row>
                <div class="clearfix"></div>
            </div>
        </div>

    </div>
</template>
<script>
    import copy from './copy.vue';
    import Util from '../libs/util';
    var userName = '';
    var userNameId = '';
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
                        that.queryNodesDoubts(that.query);
                    }
                }, 401)
            },
            doubtsAddInput(curVal) {
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
            },
        },
        mounted() {
            var userInfo = sessionStorage.getItem("userInfo")||"{}";
            userInfo = JSON.parse(userInfo);
            this.nameValue = userInfo.name||'';
            this.searchUser();
            var that = this;
            that.$http.post("/api/dictionaries/vertices?onlyBase=true&includeEdge=false", that.querystring.stringify({
            })).then(response => {
                if ((response.data.status & 1) == 1) {
                    that.nodeTypeListData = response.data.data.filter(function(v){return v.id!==0});
                } else if ((response.data.status & 1) != 1) {
                    that.$message({
                        showClose: true,
                        message: '获取数据失败！',
                        type: 'warning'
                    });
                }
            })
            that.$http.post("/api/dictionaries/doubts?onlyBase=false", that.querystring.stringify({
            })).then(response => {
                if ((response.data.status & 1) == 1) {
                    that.doubtsTypeListData = response.data.data.filter(function(v){return v.id!==0});
                } else if ((response.data.status & 1) != 1) {
                    that.$message({
                        showClose: true,
                        message: '获取数据失败！',
                        type: 'warning'
                    });
                }
            })
        },
        components: {
            'layout-copy': copy,
        },
        data() {
            var that = this;
            return {
                old_username:'',
                old_userid:'',
                old_vper:'',
                old_dper:'',
                old_nlist:'',
                old_ndesc:'',
                old_row:{},
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                nameValue: '',
                doubtsShowModalEdit: false,
                formValidate: {
                    vper: '',
                    dper: ''
                },
                ruleValidate: {
                    vper: [
                        {required: true, message: '授权点类型列表不能为空', trigger: 'blur'},
                    ],
                    dper: [
                        {required: true, message: '授权疑点类型列表不能为空',trigger: 'blur'}
                    ]
                },
                loading: false,
                height: window.screen.availHeight - 150,
                showModal: false,
                doubtsShowModal:false,
                nodeShowModal:false,
                nodeShowModalEdit:false,
                formValidateEdit:{
                    vper: '',
                    dper: ''
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '授权疑点列表',
                        key: 'vList',
                        align: 'center',
                        render: (h,params) => {
                            return h('a',{
                                style:{
                                    display:'inline-block',
                                    width:'100%',
                                    overflow:'hidden',
                                    textOverflow:'ellipsis',
                                    whiteSpace:'nowrap'
                                },
                                domProps: {
                                    title: params.row.ndesc,
                                },
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.vListModal(params.row)
                                    }
                                }
                            }, params.row.ndesc)
                        }
                    },
                    {
                        title: '授权点类型列表',
                        key: 'vdesc',
                        align: 'center',
                        render: (h,params) => {
                            return h('Button',{
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.vperModal(params.row)
                                    }
                                }
                            },params.row.vdesc)
                        }
                    },
                    {
                        title: '授权疑点类型列表',
                        key: 'ddesc',
                        align: 'center',
                        render: (h,params) => {
                            return h('a',{
                                style:{
                                    display:'inline-block',
                                    width:'100%',
                                    overflow:'hidden',
                                    textOverflow:'ellipsis',
                                    whiteSpace:'nowrap'
                                },
                                domProps: {
                                    title: params.row.ddesc,
                                },
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.dperModal(params.row)
                                    }
                                }
                            },params.row.ddesc)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: function (h, params) {
                            return h('div', [
                                h('Button', {
                                    style:{
                                        marginRight:'5px'
                                    },
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: function () {
                                            that.updateInfo(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: function () {
                                            that.remove([params.row.id]);
                                        }
                                    }
                                }, '删除')

                            ]);
                        }
                    }
                ],
                userColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '真实姓名',
                        key: 'realname',
                        align: 'center'
                    },
                    {
                        title: '角色',
                        key: 'role',
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'tel',
                        align: 'center'
                    },
                    {
                        title: '邮箱',
                        key: 'mail',
                        align: 'center'
                    },
                    {
                        title: '所属科室',
                        key: 'officedesc',
                        align: 'center'
                    },
                    // {
                    //     title: "授权点类型",
                    //     key: 'vdesc',
                    //     align: 'center'
                    // },
                    // {
                    //     title: "授权边类型",
                    //     key: 'edesc',
                    //     align: 'center'
                    // },
                    // {
                    //     title: "授权行政区划",
                    //     key: 'rdesc',
                    //     align: 'center'
                    // },
                    // {
                    //     title: "导出权限",
                    //     key: 'exp',
                    //     align: 'center',
                    //     render: function (h,params) {
                    //         if(params.row.exp == 0){
                    //             return h('div',[
                    //                 h('span',"无")
                    //             ])
                    //         }else {
                    //             return h('div',[
                    //                 h('span',"有")
                    //             ])
                    //         }
                    //     }
                    // }
                ],
                tableData: [],
                userTableData: [],
                vListList: ["人","公司","单位"],
                vTypeListList: [],
                doubtsTypeListList: [],
                addInput: '',
                query: '',
                queryLastUpdate: '',
                indeterminate: false,
                checkAll: false,
                checkAllGroup: [],
                currentPage: 1,
                pageSize: 10,
                total: 1,
                totalPages: 0,
                page: 0,
                nodeData: [],
                first: true,
                last: true,
                nodeSelected: [],//存选中的节点id
                nodeSelectedData: [],//存选中的所有节点信息
                doubtsAddInput: '',
                nodeTypeListData:[],
                doubtsTypeListData:[],
                vListShowModal:false,
                vperShowModal: false,
                dperShowModal: false,
                doubtsDetailUserNameId: ''
            }
        },
        methods: {
            searchUser() {
                var that = this;
                that.loading = true;
                that.$http.post("/api/permissions/doubts/selectNodes", that.querystring.stringify({
                    username: that.nameValue,
                    page: that.page,
                    size: that.pageSize
                })).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.tableData = response.data.data;
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: '获取数据失败！',
                            type: 'warning'
                        });
                    }
                });
                that.loading = false;

            },
            searchAll() {
                var that = this;
                that.loading = true;
                that.$http.post("/api/authority/doubts/selectNodes", that.querystring.stringify({
                    "name": "admin",
                    "page": that.page,
                    "size": that.pageSize
                })).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.tableData = response.data.data
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: '获取数据失败！',
                            type: 'warning'
                        });
                    }
                });
                that.loading = false;
            },
            onVisibleChange(){
                this.doubtsAddInput = '';
                //this.nodeSelectedData = [];
            },
            vListModal(row){
                this.indeterminate = false;
                this.checkAll = false;
                this.checkAllGroup = [];
                this.total = 0;
                this.totalPages = 0;
                this.page = 0;
                this.doubtsAddInput = '';
                var nlistArray = row.nlist.split(",");
                var ndescArray = row.ndesc.split(",");
                var num = row.nlist.length;
                this.nodeSelectedData = [];
                for(var i=0;i<nlistArray.length;i++){
                    var node={};
                    node.id=nlistArray[i];
                    node.name=ndescArray[i];
                    this.nodeSelectedData.push(node);
                }
                this.nodeData = [];
                this.doubtsShowModalEdit = true;
                this.doubtsDetailUserNameId = row.id;
                this.old_row = row;
                this.old_dper=row.dper;
                this.old_vper=row.vper;
                this.old_ndesc=row.ndesc;
                this.old_nlist=row.nlist;
            },
            updateInfo(row){
                //this.old_userid = row.userNameId;
                this.old_userid = row.id;
                this.old_username = row.username;
                this.indeterminate = false;
                this.checkAll = false;
                this.checkAllGroup = [];
                this.nodeSelect = [];
                this.total = 0;
                this.totalPages = 0;
                this.page = 0;
                this.doubtsAddInput = '';
                if(row.nlist!=null&&row.ndesc!=null){
                    var nlistArray = row.nlist.split(",");
                    var ndescArray = row.ndesc.split(",");
                    var num = row.nlist.length;
                    this.nodeSelectedData = [];
                    for(var i=0;i<nlistArray.length;i++){
                        var node={};
                        node.id=nlistArray[i];
                        node.name=ndescArray[i];
                        this.nodeSelectedData.push(node);
                    }
                }

                this.nodeData = [];
                this.doubtsShowModalEdit = true;
                this.doubtsDetailUserNameId = row.id;
                this.old_row = row;
                this.old_dper=row.dper;
                this.old_vper=row.vper;
                this.old_ndesc=row.ndesc;
                this.old_nlist=row.nlist;
            },
            vperModal(row) {
                this.vperShowModal = true;
                row.vper=this.valueToArray(row.vper)
                this.formValidate = $.extend(true, {}, row);
            },
            dperModal(row) {
                this.dperShowModal = true;
                this.formValidate = $.extend(true, {}, row);
                this.old_userid = row.id;
                this.old_username = row.username;
                this.indeterminate = false;
                this.checkAll = false;
                this.checkAllGroup = [];
                this.nodeSelect = [];
                this.total = 0;
                this.totalPages = 0;
                this.page = 0;
                this.doubtsAddInput = '';
                if(row.nlist!=null&&row.ndesc!=null){
                    var nlistArray = row.nlist.split(",");
                    var ndescArray = row.ndesc.split(",");
                    var num = row.nlist.length;
                    this.nodeSelectedData = [];
                    for(var i=0;i<nlistArray.length;i++){
                        var node={};
                        node.id=nlistArray[i];
                        node.name=ndescArray[i];
                        this.nodeSelectedData.push(node);
                    }
                }

                this.nodeData = [];
                this.doubtsDetailUserNameId = row.id;
                this.old_row = row;
                this.old_dper=row.dper;
                this.old_vper=row.vper;
                this.old_ndesc=row.ndesc;
                this.old_nlist=row.nlist;
            },
            handleClose(node) {
                if(this.nodeSelect){
                    var index = this.nodeSelect.indexOf(node.id);
                    this.nodeSelect.splice(index, 1);
                    this.nodeSelectedData.splice(index, 1);
                    if (this.checkAllGroup.indexOf(node.id) >= 0)
                        this.checkAllGroup.splice(this.checkAllGroup.indexOf(node.id), 1);
                }else{
                    var index = this.nodeSelectedData.indexOf(node.id);
                    this.nodeSelectedData.splice(index, 1);
                    if (this.checkAllGroup.indexOf(node.id) >= 0)
                        this.checkAllGroup.splice(this.checkAllGroup.indexOf(node.id), 1);
                }

            },
            show() {
                this.indeterminate = false;
                this.checkAll = false;
                this.checkAllGroup = [];
                this.total = 0;
                this.totalPages = 0;
                this.page = 0;
                this.doubtsAddInput = '';
                this.nodeSelectedData = [];
                this.showModal = true;
                this.addInput = '';
                this.userTableData = [];
                this.formValidate = {
                    vper: '',
                    dper: ''
                };
            },
            refresh() {
                var that = this;
                that.loading = true;
                that.$http.post("/api/permissions/doubts/selectNodes", that.querystring.stringify({
                    username: that.nameValue,
                    "page": that.page,
                    "size": that.pageSize
                })).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.tableData = response.data.data
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: '获取数据失败！',
                            type: 'warning'
                        });
                    }
                });
                that.loading = false;
            },
            remove(ids) {
                if (!ids) {
                    ids = [];
                    for (let i in this.$refs.selection.getSelection())
                        ids.push(this.$refs.selection.getSelection()[i].id)
                }
                var that = this;
                var params = {
                    ids:ids.join(',')
                };
                that.$http.post("/api/permissions/doubts/deleteNode",that.querystring.stringify(params))
                    .then(function (response){
                        if((response.data.status & 1)==1){
                            that.$message({
                                showClose:true,
                                type:'error',
                                message:response.data.msg
                            })
                            that.refresh();
                        }
                    })
            },
            onSelect(selection,row) {
                var that = this;
                if(selection.length == 1){
                    that.userName = (this.$refs.userSelection.data[0].name)
                    that.userNameId = (this.$refs.userSelection.data[0].id)
                }
                else if(selection.length != 1){
                    that.$message({
                        showClose: true,
                        message: "只能选中一条数据",
                        type: 'success'
                    });
                }
            },
            arrayToValue(array){
                var result = 0;
                for(var i=0;i<array.length;i++){
                    result += array[i];
                }
                return result;
            },
            valueToArray(value){
                var vpArry=[];
                if(value==1){
                    vpArry=[1];
                }else if(value==2){
                    vpArry=[2];
                }else if(value==3){
                    vpArry=[1,2];
                }else if(value==4){
                    vpArry=[4];
                }else if(value==2){
                    vpArry=[2];
                }else if(value==5){
                    vpArry=[1,4];
                }else if(value==6){
                    vpArry=[2,4];
                }else if(value==7){
                    vpArry=[1,2,4];
                }else if(value==8){
                    vpArry=[8];
                }else if(value==2){
                    vpArry=[2];
                }else if(value==9){
                    vpArry=[1,8];
                }else if(value==10){
                    vpArry=[2,8];
                }else if(value==11){
                    vpArry=[1,2,8];
                }else if(value==14){
                    vpArry=[2,4,8];
                }else if(value==15){
                    vpArry=[1,2,4,8];
                }
                return vpArry;
            },
            ok() {
                var vper = this.arrayToValue(this.formValidate.vper);
                var that = this;
                var nodeList = that.nodeSelectedData;
                if(nodeList!=null&&nodeList.length>200){
                    that.$message({
                        showClose: true,
                        message: "节点数不能大于200！",
                        type: 'warning'
                    });
                    return;
                }
                var idArray = new Array();
                var nameArray = new Array();
                if(nodeList){
                    for(var i=0;i<nodeList.length;i++){
                        var node = nodeList[i];
                        var id = node.id;
                        var name = node.name;
                        idArray.push(id);
                        nameArray.push(name);
                    }
                }
                var nlist = idArray.toString();
                var ndesc = nameArray.toString();
                var data ={
                    "userid": that.userNameId,
                    "username": that.userName,
                    "vper": vper,
                    "dper": that.formValidate.dper,
                    "nlist": nlist,
                    "ndesc": ndesc
                }
                that.$http.post("/api/permissions/doubts/insertNode",that.querystring.stringify(data)).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'success'
                        });
                        that.nameValue = '';
                        that.searchUser();
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            queryNodesDoubts(query,queryUrl) {
                var that= this;
                that.$http.post("/api/user/hasUsers", that.querystring.stringify({
                    "name": that.query
                })).then(response => {
                    that.userTableData = [];
                    if ((response.data.status & 1) == 1) {
                        that.userTableData = response.data.data
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: '获取数据失败！',
                            type: 'warning'
                        });
                    }
                })
            },
            queryNodes(query, queryUrl) {
                var that = this;
                var url = '/api/doubts/selectDoubtsNodesList';
                var params = {
                    name:that.query,
                };
                if (queryUrl)
                    url = queryUrl ;
                else{
                    params.size = 10;
                    params.page=0;
                }
                that.$http.post(url,that.querystring.stringify(params)).then(function (response) {
                    that.searchBarLoading = false;
                    that.$set(that, 'nodeData', response.data.data);
                    //加一个状态，根据选中的值是否在已选中判断该状态
                    var if_indminat = false;
                    if(that.nodeData) {
                        for (var i = 0; i < that.nodeData.length; i++) {
                            //如果选中的在已选中中存在，则设置全选按钮的样式
                            if (that.nodeSelect.indexOf(that.nodeData[i].id) > -1) {
                                if_indminat = true;
                                that.checkAll = true;
                                that.indeterminate = false;
                            } else {
                                if (if_indminat) {
                                    that.indeterminate = true;
                                    that.checkAll = false;
                                } else {
                                    that.indeterminate = false;

                                }

                            }
                        }
                        if (response.data.page) {
                            that.first = response.data.page.first;
                            that.last = response.data.page.last;
                            that.total = response.data.page.totalElements;
                            that.page = response.data.page.page;
                            that.totalPages = response.data.page.totalPages;
                        }
                    }else{
                        that.$message({
                            showClose: true,
                            message: "未查询到记录",
                            type: 'error'
                        });
                    }
                })
            },
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                //如果是全部选中，则对选中的进行追加
                if (this.checkAll) {
                    var that = this;
                    $.map(this.nodeData, function (value) {
                        if(that.checkAllGroup){
                            that.checkAllGroup.push(value.id);
                        }
                    })
                    //如果取消全部选中，则去掉该页中的数据
                } else {
                    for(var i=0;i<this.nodeData.length;i++){
                        var id = this.nodeData[i].id;
                        var num = this.checkAllGroup.indexOf(id)
                        this.checkAllGroup.splice(num,1);
                    }

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
            nextStep(){
                var that = this;
                that.showModal = false;
                that.doubtsShowModal = true;
                this.nodeData = [];
                this.nodeSelect = [];
            },
            nextStep2(){
                var that = this;
                that.doubtsShowModal = false;
                that.nodeShowModal = true;
            },
            update_nextStep2(){
                var that = this;
                that.doubtsShowModalEdit = false;
                that.nodeShowModalEdit = true;
                //this.formValidateEdit.vper="1"
                this.old_row.vper=this.old_row.vdivide.split(",").map(Number);
                this.formValidateEdit = $.extend(true, {}, this.old_row);
                // this.old_dper=row.dper;
                // this.old_ndesc=row.ndesc;
                // this.old_nlist=row.nlist;

            },
            preData() {
                this.indeterminate = false;
                this.checkAll = false;
                if (this.first) return;
                this.page = this.page - 1;
                this.queryNodes(this.query, '/api/doubts/selectDoubtsNodesList? &size=10&page='+this.page);
            },
            nextData() {
                this.indeterminate = false;
                this.checkAll = false;
                if (this.last) return;
                this.page = this.page + 1;
                this.queryNodes(this.query, '/api/doubts/selectDoubtsNodesList? &size=10&page='+this.page);
            },
            dperSure() {
                var that = this;
                var nodeList = that.nodeSelectedData;
                var idArray = new Array();
                var nameArray = new Array();
                if(nodeList){
                    for(var i=0;i<nodeList.length;i++){
                        var node = nodeList[i];
                        var id = node.id;
                        var name = node.name;
                        idArray.push(id);
                        nameArray.push(name);
                    }
                }
                var nlist = idArray.toString();
                var ndesc = nameArray.toString();
                var vperStr = that.arrayToValue(that.formValidateEdit.vper);
                var data ={
                    "userid": that.old_userid,
                    "username": that.old_username,
                    "vper": vperStr,
                    "dper": that.formValidate.dper,
                    "nlist": nlist,
                    "ndesc": ndesc,
                    "isfull": true
                }
                that.$http.post("/api/permissions/doubts/updateNode", that.querystring.stringify(data)).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'success'
                        });
                        that.refresh();
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            vperSure() {
                var that = this;
                var data ={
                    "id": that.formValidate.id,
                    "vper": that.formValidate.vper
                }
                that.$http.post("/api/permissions/doubts/updateNode", data).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'success'
                        });
                        that.refresh();
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            doubtsShowEditSure() {
                var that = this;
                var nodeList = that.nodeSelectedData;
                if(nodeList!=null&&nodeList.length>200){
                    that.$message({
                        showClose: true,
                        message: "节点数不能大于200！",
                        type: 'warning'
                    });
                    return;
                }
                var idArray = new Array();
                var nameArray = new Array();
                if(nodeList){
                    for(var i=0;i<nodeList.length;i++){
                        var node = nodeList[i];
                        var id = node.id;
                        var name = node.name;
                        idArray.push(id);
                        nameArray.push(name);
                    }
                }
                var nlist = idArray.toString();
                var ndesc = nameArray.toString();
                var vperStr = that.arrayToValue(that.formValidateEdit.vper);
                var data ={
                    "userid": that.old_userid,
                    "username":that.old_username,
                    "vper":vperStr,
                    "dper":that.formValidateEdit.dper,
                    "nlist": nlist,
                    "ndesc":ndesc,
                    "isfull":true
                }
                that.$http.post("/api/permissions/doubts/updateNode", that.querystring.stringify(data)).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'success'
                        });
                        that.refresh();
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
        }
    }
</script>