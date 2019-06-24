<template>
    <div class="layout">
        <Modal v-model="showModal" :width="900" ref="infoModal">
            <Table :loading="loading" border :columns="myColumn" :data="myData"></Table>
        </Modal>
        <div class="layout-content" style="padding: 20px 40px">
            <div style="display: flex;justify-content:left;align-items: center;">
                <el-form :model="searchForm"
                         :rules="searchFormRule"
                         ref="searchForm"
                         :inline="true"
                         class="demo-form-inline demo-ruleForm"
                         style="width:100%"
                         label-width="0">
                    <el-form-item label=" " prop="vertexEdge">
                        <el-select clearable style="width:200px;" v-model="searchForm.vertexEdge" placeholder="请选择节点类型" @change="selectVE">
                            <el-option v-for="item in veList" :value="item.veId" :label="item.type" :key="item.veId">{{ item.type }}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" " prop="labelName">
                        <el-select clearable style="width:200px;" v-model="searchForm.labelName" placeholder="请选择关系类型">
                            <el-option v-for="item in veper" :value="item.vId" :label="item.label" :key="item.vId">{{ item.label }}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" " prop="fileType">
                        <el-select style="width:200px;" v-model="searchForm.fileType" placeholder="请选择文件类型">
                            <el-option v-for="item in fileTypeList" :value="item.id" :label="item.name" :key="item.id">{{ item.name }}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <a href="#" @click="downloadTemplate">
                            <el-button type="primary">下载模版</el-button>
                        </a>
                    </el-form-item>
                    <el-form-item>
                        <Upload :action="uploadUrl()"
                                :before-upload="beforeUpload" :on-success="onSuccess">
                            <el-button type="primary" icon="ios-cloud-upload-outline">上传文件</el-button>
                        </Upload>
                    </el-form-item>
                </el-form>
            </div>
            <Table :loading="loading" border ref="selection" :columns="columns" :data="tableData"></Table>
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

    </div>
</template>
<script>
    import graph from '../components/cytoscapeGraph.vue';
    import Util from '../libs/util';
    import searchBar from '../components/paginationSearchBar.vue';
    import dictionary from '../config/dictionary';

    export default {
        mounted() {
            this.update();
        },
        watch: {
            currentPage: function () {
                this.update();
            },
            pageSize: function () {
                this.pageSize = 1;
                this.update();
            },
        },
        components: {
            'search-bar': searchBar
        },
        data() {
            return {
                baseUploadUrl:"/api/transfer/uploadTemplate",
                //baseUploadUrl:"http://192.168.0.66:8082/api/transfer/uploadTemplate",
                loading: false,
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                veper: [],
                searchForm:{
                    name:'',
                    vertexEdge:'',
                    labelName:'',
                    fileType:'',
                },
                searchFormRule:{
                    vertexEdge: [
                        { required: true, message: '请选择节点类型', trigger: 'change' },
                    ],
                    labelName: [
                        { required: true, message: '请选择边类型', trigger: 'change' }
                    ],
                    fileType: [
                        { required: true, message: '请选择文件类型', trigger: 'change' }
                    ],
                },
                veList: [
                    {
                        "veId":"vertex","type":"点","veper":[
                        {"vId":1,"label":"人"},{"vId":2,"label":"公司"},{"vId":4,"label":"单位"}
                        ]
                    },
                    {
                        "veId":"edge","type":"边","veper":[
                        {"vId":1,"label":"婚姻"},{"vId":2,"label":"个人投资"},{"vId":4,"label":"企业投资"},
                        {"vId":8,"label":"任职"},{"vId":16,"label":"项目"},{"vId":32,"label":"法人"},
                        {"vId":64,"label":"支付"}
                        ]
                    }
                ],
                vertexEdge: '',
                labelName: '',
                fileType:'xls',
                fileTypeList:[
                    {id:'xls',name:'Excel-2003'},
                    {id:'xlsx',name:'Excel-2007'},
                    {id:'txt',name:'txt文件'},
                    {id:'csv',name:'csv文件'}
                ],
                columns: [
                    {
                        title: '文件名',
                        key: 'filename',
                        align: 'center'
                    },{
                        title: '是节点还是关系',
                        key: 'type',
                        align: 'center'
                    },{
                        title: '节点或关系类型',
                        key: 'label',
                        align: 'center'
                    },{
                        title: '任务提交时间',
                        key: 'timestamp',
                        align: 'center',
                        render: (h,params) => {
                            const row = params.row;
                            return h('div', [ 
                                h('span',{},this.timestampToTime(row.timestamp))
                            ])
                        }
                    },{
                        title: '任务状态',
                        key: 'statusdesc',
                        align: 'center',
                        render: (h,params) => {
                            const row = params.row;
                            return h('div', [
                                h('span',{
                                    style:{
                                        color:(row.status===1)?"#19be6b":"#ed3f14"
                                    }
                                },row.statusdesc)
                            ])
                        }
                    },{
                        title: '任务进度',
                        key: 'progress',
                        align: 'center',
                        render: (h,params) => {
                            const row = params.row;
                            return h('Progress', {
                                props:{
                                    percent:row.progress
                                }
                            })
                        }
                    }
                ],
                tableData: [],
                myColumn: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '身份证号',
                        key: 'uid',
                        align: 'center'
                    },{
                        title: '性别',
                        key: 'sex',
                        align: 'center'
                    },{
                        title: '出生日期',
                        key: 'birthday',
                        align: 'center'
                    },{
                        title: '住址',
                        key: 'address',
                        align: 'center'
                    },{
                        title: '行政区划',
                        key: 'regioncode',
                        align: 'center'
                    },{
                        title: '地市行政区划',
                        key: 'regioncode_city',
                        align: 'center'
                    },{
                        title: '省级行政区划',
                        key: 'regioncode_province',
                        align: 'center'
                    }
                ],
                myData: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                showModal: false
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            selectVE(value,row) {
                var that = this;
                that.veList.forEach(function (item,index) {
                    if(item.veId == value) {
                        that.veper = item.veper;
                    }
                })
            },
            downloadTemplate() {
                var that = this;
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        var url = "/api/transfer/downloadTemplate?type="+that.searchForm.vertexEdge+"&label="+that.searchForm.labelName+"&filetype="+that.searchForm.fileType;
                        window.open(url)
                    } else {
                        return false;
                    }
                });

            },
            changePage() {

            },
            timestampToTime(timestamp) {
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y+M+D+h+m+s;
            },
            update (){
                var that = this;
                that.loading = true;
                that.$http.post("/api/transfer/selectTaskNodes", that.querystring.stringify({
                        "page": that.currentPage - 1,
                        "size": that.pageSize
                    })
                ).then(function (response) {
                    that.loading = false;
                    if ((response.data.status & 1) == 1) {
                        that.tableData = response.data.data;
                        that.total = response.data.total;
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: '网络异常！',
                            type: 'warning'
                        });
                    }
                })
            },
            uploadUrl() {
                return this.baseUploadUrl+"?type="+this.searchForm.vertexEdge+"&label="+this.searchForm.labelName+"&filetype="+this.searchForm.fileType;
            },
            beforeUpload(file) {
                var that = this;
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        return true;
                    } else {
                        return false;
                    }
                });
            },
            onSuccess(response) {
                if((response.status & 1)==1){
                    var that = this;
                    that.showModal = true;
                    var showData = response.data;
                    var columns = [];
                    if(showData.length>0){
                        for(var key in showData[0]){
                            var o = {
                                title: key,
                                key: key,
                                align: 'center'
                            };
                            columns.push(o);
                        }
                        showData.splice(0,1);
                    }
                    that.myData = showData;
                    that.myColumn = columns||[];
                    that.update();
                }else {
                    that.$message({
                        type: 'info',
                        message: "上传文件有误！",
                        showClose: true
                    });
                }

            }
        }
    };
</script>