<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px'" style="padding: 20px 40px 0 40px">
            <div style="display: flex;justify-content:left;align-items: center;margin-bottom: 10px;">
                <Select v-model="dbName" :style="'width:'+width/5+'px'" style="margin-top: -8px;" placeholder="请选择源数据库" @on-change="selectTable" clearable>
                    <Option v-for="item in dbList" :value="item.dbId" :key="item.dbId">{{ item.dbname }}</Option>
                </Select>
                <Select v-model="tableName" :style="'width:'+width/5+'px'" style="margin-top: -8px;margin-left:10px" placeholder="请选择源表名称" clearable>
                    <Option v-for="item in getdbName" :value="item.tableId" :key="item.tableId">{{ item.tableName }}</Option>
                </Select>
                <a href="#" @click="queryTask">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;">任务查询</Button>
                </a>
                <a href="#" @click="addTask">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;">新增任务</Button>
                </a>
                <router-link to="dataSourceManagement">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;">数据源配置</Button>
                </router-link>
                <router-link to="dataTargetSourceManagement">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;">目标源配置</Button>
                </router-link>
            </div>
            <el-dialog
                    title="任务添加"
                    :visible.sync="dialogVisible"
                    width="650px">
                <el-form :model="addTaskForm" :rules="rules" ref="addTaskForm" label-width="25%">
                    <el-form-item label="任务Id" prop="taskId" v-if="false" >
                        <el-input v-model="addTaskForm.id" ></el-input>
                    </el-form-item>
                    <el-form-item label="任务名称" prop="taskName" >
                        <el-input v-model="addTaskForm.taskName" clearable> </el-input>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="type">
                        <el-select style="width:100%" v-model="addTaskForm.type"  label="请选择任务类型" clearable>
                            <el-option v-for="item in taskList" :value="item.typeId" :key="item.typeId" :label="item.typeName">{{ item.typeName }}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="源数据库" prop="sourcedbName">
                        <el-select
                                style="width:100%"
                                v-model="addTaskForm.sourcedbName"
                                clearable
                                @change="selectSourceTable"
                                placeholder="请选择源数据库">
                            <el-option
                                    v-for="item in dbList"
                                    :key="item.dbId"
                                    :label="item.dbname"
                                    :value="item.dbId">
                                <span>{{ item.dbname }} </span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="源表名称" prop="sourceTableName">
                        <el-select
                                style="width:100%"
                                v-model="addTaskForm.sourceTableName"
                                clearable
                                placeholder="表名称">
                            <el-option
                                    v-for="item in getSourcedbName"
                                    :key="item.tableId"
                                    :label="item.tableName"
                                    :value="item.tableId">
                                <span style="float: left">{{ item.tableName }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="节点类型" prop="targetdbName">-->
                        <!--<el-select v-model="addTaskForm.vertexEdge"  label="请选择节点类型" @change="selectVE">-->
                            <!--<el-option v-for="item in veList" :value="item.veId" :key="item.veId" :label="item.type">{{ item.type }}</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="关系类型" prop="labelName">-->
                        <!--<el-select v-model="addTaskForm.labelName"  label="请选择关系类型">-->
                            <!--<el-option v-for="item in veper" :value="item.vId" :key="item.vId" :label="item.label">{{ item.label }}</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->

                    <el-form-item label="任务描述" prop="description">
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入任务描述内容"
                                v-model="addTaskForm.description">
                        </el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertTask('addTaskForm')">确 定</el-button>
            </span>
            </el-dialog>
            <Table :loading="loading" border ref="selection" :columns="columns" :data="tableData"
                   :height="height-200"></Table>
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
    </div>
</template>
<script>
    import copy from '../copy.vue';
    import graph from '../../components/cytoscapeGraph.vue';
    import Util from '../../libs/util';
    import searchBar from '../../components/paginationSearchBar.vue';
    import dictionary from '../../config/dictionary';

    export default {
        mounted() {
            this.initdata();
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
            'layout-copy': copy,
            'search-bar': searchBar
        },
        data() {
            var that = this ;
            return {
                dialogVisible:false,     //模态框是否显示
                addLoading: false,       //是否显示loading
                baseUploadUrl:"http://120.224.45.37:8082/api/transfer/uploadTemplate",
                //baseUploadUrl:"http://192.168.0.66:8082/api/transfer/uploadTemplate",
                loading: false,
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                tables: [],
                dbName:[],
                getdbName:[],
                getadddbName:[],
                getSourcedbName:[],//源数据表
                getTargetdbName:[],//目标数据表
                addTaskForm: {
                    description:''
                },
                description:'',
                veper: [],
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
                taskList:[
                    {"typeId":"全量导入","typeName":"全量导入"},{"typeId":"增量导入","typeName":"增量导入"}
                ],
                vertexEdge: '',
                dbList: [
                    {
                        "dbId":"finance库","dbname":"finance库","tables":[
                            {"tableId":"pay_unit_budget_c_rate表","tableName":"pay_unit_budget_c_rate表"},{"tableId":"pay_unit_department_name表","tableName":"pay_unit_department_name表"}
                        ]
                    },
                    {
                        "dbId":"SocialSecurity库","dbname":"SocialSecurity库","tables":[
                            {"tableId":"pay_unit_project_c_rate表","tableName":"pay_unit_project_c_rate表"},{"tableId":"pay_visualization_payment_voucher表","tableName":"pay_visualization_payment_voucher表"}
                        ]
                    }
                ],
                tableName: '',
                columns: [

                    {
                        type: 'index',
                        title:'序号',
                        width: 60,
                        align: 'center'
                    },{
                        title: '任务名称',
                        key: 'taskName',
                        align: 'center'
                    },{
                        title: '任务类型',
                        key: 'type',
                        align: 'center'
                    },{
                        title:'任务状态',
                        key: 'status',
                        align: 'center',
                        render: (h,params) => {
                            const row = params.row;
                            var status ;
                            if(row.status==0){
                                status = "未执行";
                            }else if(row.status==1){
                                status = "正在运行";
                            }else if(row.status==2){
                                status = "运行失败";
                            }else if(row.status==3){
                                status = "成功";
                            }
                            return h('div', [  //
                                h('span',{
                                    style:{
                                        color: (row.status==1)?"#19be6b":(row.status==2?"#ed3f14":"#2d8cf0")
                                    }
                                },status)
                            ])
                        }
                    },{
                        title: '执行时间',
                        key: 'timestamp',
                        width: 120,
                        align: 'center'
                    },{
                        title: '源数据库',
                        key: 'sourcedbName',
                        align: 'center'
                    },{
                        title: '源表名称',
                        key: 'sourceTableName',
                        align: 'center'
                    },{
                        title:'进度',
                        width: 180,
                        key:'percentage',
                        align:'center',
                        render: (h,params) => {
                            const row = params.row;
                            return h('Progress', {
                                props:{
                                    percent:row.percentage
                                }
                            })
                        }
                    },{
                        title: '操  作',
                        key: '',
                        width:220,
                        align: 'center',
                        render: function (h, params) {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small',
                                        disabled:(params.row.status=='1' || params.row.status=='3')?true:false,
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            that.execute(params.index);
                                        }
                                    }
                                }, '执行'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:(params.row.status=='1' || params.row.status=='3')?true:false,
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            that.editTask(params.index);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            //console.log(params)
                                            that.removeData(params.row.id);
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }
                    }
                ],
                tableData: [],
                initTableData:[],
                myData: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                showModal: false,
                rules: {
                    taskName: [
                        {required: true, message: '请输入任务名称', trigger: 'blur,change'},
                    ],
                    type: [
                        {required: true, message: '请选择任务类型', trigger: 'blur,change'},
                    ],
                    sourcedbName: [
                        {required: true, message: '请选择源数据库', trigger: 'blur,change'},
                    ],
                    sourceTableName: [
                        {required: true, message: '请选择源表名称', trigger: 'blur,change'},
                    ]
                }
            }
        },
        methods: {
            task(o){
                o.percentage = parseFloat(o.percentage);
                o.percentage += Math.round(Math.random()*20);
                o.status = 1;
                if(o.percentage >= 100){
                    o.percentage = 100;
                    o.status = 3;
                }
            },
            execute(index){
                var progress =  this.tableData[index];
                var that = this;
                var interval = setInterval(function(){
                    if(progress.percentage>=100){
                        clearInterval(interval);
                    }else{
                        that.task(progress);
                    }
                },1000);
            },
            handleSizeChange(val) {
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            selectVE(value) {
                var that = this;
                that.veList.forEach(function (item,index) {
                    if(item.veId == value) {
                        that.veper = item.veper;
                    }
                })
            },
            selectTable(value) {
                var that = this;
                that.dbList.forEach(function (item,index) {
                    if(item.dbId == value) {
                        that.getdbName = item.tables;
                    }
                })
            },
            selectSourceTable(value) {//设置源数据库-表
                var that = this;
                that.dbList.forEach(function (item,index) {
                    if(item.dbId == value) {
                        that.getSourcedbName = item.tables;
                    }
                })
            },
            selectTargetTable(value) {//设置源数据库-表
                var that = this;
                that.dbList.forEach(function (item,index) {
                    if(item.dbId == value) {
                        that.getTargetdbName = item.tables;
                    }
                })
            },
            addTask(){
                this.dialogVisible = true
                this.addTaskForm={}
                this.addTaskForm.id= Math.random();
            },
            queryTask() {
                var that = this;
                if(this.dbName == '') {
                    alert("请选择数据库！");
                    return false;
                }else if(this.tableName == '') {
                    alert("请选择表名称！");
                    return false;
                }
                var newTableData=[];
                this.initTableData.forEach(function(obj){
                    if(obj.sourcedbName==that.dbName&&obj.sourceTableName==that.tableName){
                        newTableData.push(obj);
                    }
                })
                this.tableData=newTableData;
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
            initdata(){//初始化列表数据

                    this.initTableData=[{"id":"1","taskName":"预算表导入任务","type":"全量导入","timestamp":"2018-10-12 24:00:00","status":1,"sourcedbName":"finance库","sourceTableName":"pay_unit_budget_c_rate表","percentage":60,"description":"预算表导入任务"},
                    {"id":"2","taskName":"部门表导入任务","type":"全量导入","timestamp":"2018-08-12 16:30:00","status":0,"sourcedbName":"finance库","sourceTableName":"pay_unit_department_name表","percentage":0,"description":"部门表导入任务"}
                ];
                this.tableData=this.initTableData;
            },
            removeData(id){
                var newTableData=[];
                this.tableData.forEach(function(obj){
                    if(obj.id!=id){
                        newTableData.push(obj);
                    }
                })
                this.$message({
                    showClose: true,
                    message: '删除成功！',
                    type: 'error'
                });
                this.tableData=newTableData;
            },
            insertTask(formId){
                //判断如果id相同则移除列表的数据
                this.$refs[formId].validate((valid) => {
                    if (valid) {
                        var that = this;
                        this.tableData.forEach(function(obj,index){
                            if(that.addTaskForm.id==obj.id){
                                that.tableData.splice(index,1)
                            }
                        });
                        if(this.addTaskForm){
                            var addTaskForm = this.addTaskForm;
                            var taskName = addTaskForm.taskName;
                            var type = addTaskForm.type;
                            var sourcedbName = addTaskForm.sourcedbName;
                            var sourceTableName = addTaskForm.sourceTableName;
                            var description = addTaskForm.description;
                            var percentage = 0;
                            var data = {"taskName":taskName,
                                        "type":type,
                                        "timestamp":getCurrentDate(2),
                                        "status":0,
                                        "sourcedbName":sourcedbName,
                                        "sourceTableName":sourceTableName,
                                        "percentage":percentage,
                                        "description":description
                            };
                            this.tableData.push(data);
                            this.dialogVisible=false;
                            this.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                        }
                    }
                });


            },
            editTask(index){
                if(this.tableData[index].status!=1){
                    this.dialogVisible=true;
                    this.addTaskForm=this.clone(this.tableData[index]);
                }else{
                    this.$message({
                        showClose: true,
                        message: '执行状态，不允许编辑!',
                        type: 'warning'
                    });
                }


                // if(this.addTaskForm){
                //     this.tableData.push(this.addTaskForm)
                // }

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
            }
        }
    };
    /**
     *获取当前时间
     *format=1精确到天
     *format=2精确到分
     */
    function getCurrentDate(format) {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        var day = now.getDay();//得到周几
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        var sec = now.getSeconds();//得到秒
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        var time = "";
        //精确到天
        if(format==1){
            time = year + "-" + month + "-" + date;
        }
        //精确到分
        else if(format==2){
            time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
        }
        return time;
    }
</script>