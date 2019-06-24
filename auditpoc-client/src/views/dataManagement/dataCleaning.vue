<style>
    .el-tb-edit .el-input,
    .el-tb-edit .el-input-number,
    .el-tb-edit .el-select {
        display: none;
        width: 100%;
    }

    .el-tb-edit .current-row .el-input,
    .el-tb-edit .current-row .el-input-number,
    .el-tb-edit .current-row .el-select {
        display: inherit;
    }

    .el-tb-edit .current-row .el-input+span,
    .el-tb-edit .current-row .el-input-number+span,
    .el-tb-edit .current-row .el-select+span {
        display: none;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-content"
             style="padding:20px 40px">
            <div :model="formItem" style="margin:0 auto 18px auto;">
                <el-select
                        v-model="formItem.sourceDbName"
                        placeholder="请选择数据源类型"
                        clearable
                >
                    <el-option
                            v-for="item in dataSourceList"
                            :key="item.id"
                            :label="item.sourceDbName"
                            :value="item.id"
                    >{{ item.sourceDbName }}</el-option>
                </el-select>
                <el-input style="width:200px;"
                          v-model="formItem.sourceTableName"
                          placeholder="请输入源库表名称" clearable>
                </el-input>
                <el-input
                        style="width:200px;"
                        v-model="formItem.targetTbName"
                        placeholder="请输入目标表名称" clearable>
                </el-input>
                <a href="#" @click="queryDataCleanList">
                    <Button type="primary"
                            style="margin-left: 10px;">查询</Button>
                </a>
                <a href="#" @click="insertRule">
                    <Button type="primary"
                            style="margin-left: 10px;">新增规则</Button>
                </a>
             </div>
            <Table :columns="columns" :data="showData" border :loading="loading" :height="height-235"></Table>

            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    style="float: right;margin-top: 20px">
            </el-pagination>
        </div>
        <el-dialog
                title="新增规则"
                :visible.sync="insertRuleDialogVisible">
            <el-form :modal="insertRuleForm"
                     label-width="50%">
                <el-row>
                    <el-col :span="8">
                        <el-form-item  label="规则名称" prop="ruleName">
                            <el-input v-model="insertRuleForm.ruleName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="源库名称" prop="sourceDbName">
                            <el-select
                                       v-model="insertRuleForm.sourceDbName"
                                       clearable
                                       @change="selectSourceTable"
                                       placeholder="请选择源数据库">
                                <el-option v-for="item in sourceDbList"
                                           :key="item.sourceDbId"
                                           :label="item.sourceDbName"
                                           :value="item.sourceDbId">
                                    {{item.sourcedbName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="源库表名称" prop="sourceTableName">
                            <el-select
                                       v-model="insertRuleForm.sourceTableName"
                                       clearable
                                       placeholder="请选择源数据表">
                                <el-option v-for="item in sourceTbList"
                                           :key="item.sourceTbId"
                                           :label="item.sourceTableName"
                                           :value="item.sourceTbId">
                                    {{item.sourceTableName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item  label="规则描述" prop="ruleDesc">
                            <el-input  v-model="insertRuleForm.ruleDesc" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目标库名称" prop="targetDbName">
                            <el-select
                                       v-model="insertRuleForm.targetDbName"
                                       clearable
                                       @change="selectTargetTable"
                                       placeholder="请选择源数据库">
                                <el-option v-for="item in targetDbList"
                                           :key="item.targetDbId"
                                           :label="item.targetDbName"
                                           :value="item.targetDbId">
                                    {{item.targetDbName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目标库表名称" prop="targetTbName">
                            <el-select
                                       v-model="insertRuleForm.targetTbName"
                                       clearable
                                       placeholder="请选择目标数据表">
                                <el-option v-for="item in targetTbList"
                                           :key="item.targetTbId"
                                           :label="item.targetTbName"
                                           :value="item.targetTbId">
                                    {{item.targetTbName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            <el-button size="mini" @click="addDemo">+</el-button>
            <el-table
                    :data="cleanData" border
                    highlight-current-row
                    style="width:100%"
                    class="el-tb-edit"
                    @current-change="handleCleanCurrentChange"
                    ref="demoTable">
                <el-table-column prop="colunmName" label="选择列">
                    <template scope="scope">
                        <el-select v-model="scope.row.colunmName" placeholder="请选择" size="mini">
                            <el-option label="一级预算单位名称" :value="0"></el-option>
                            <el-option label="二级预算单位名称" :value="1"></el-option>
                            <el-option label="三级预算单位名称" :value="2"></el-option>
                        </el-select>
                        <span>{{({0:"一级预算单位名称",1:"二级预算单位名称",2:"三级预算单位名称"})[scope.row.colunmName]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ruleType" label="规则类型">
                    <template scope="scope">
                        <el-select v-model="scope.row.ruleType" placeholder="请选择" size="mini">
                            <el-option label="非空" :value="0"></el-option>
                            <el-option label="字典翻译" :value="1"></el-option>
                            <el-option label="数据重复" :value="2"></el-option>
                        </el-select>
                        <span>{{({0:"非空",1:"字典翻译",2:"数据重复"})[scope.row.colunmName]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="param1" label="参数1" width="80">
                    <template scope="scope">
                        <el-input size="mini" v-model="scope.row.param1" placeholder="请输入内容"></el-input>
                        <span>{{scope.row.param1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="param2" label="参数2" width="80">
                    <template scope="scope">
                        <el-input size="mini" v-model="scope.row.param2" placeholder="请输入内容"></el-input>
                        <span>{{scope.row.param2}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="param3" label="参数3" width="80">
                    <template scope="scope">
                        <el-input size="mini" v-model="scope.row.param3" placeholder="请输入内容"></el-input>
                        <span>{{scope.row.param3}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
                <div style="text-align: center">
                    <el-button type="primary" style="margin-top: 20px;" :center="true"
                               @click="insertCleanTask('insertRuleForm')">保 存</el-button>
                    <el-button style="margin-top: 20px;" :center="true" @click="insertRuleDialogVisible = false">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>



        <el-dialog
                title="修改规则"
                :visible.sync="editRuleDialogVisible">
            <el-form :modal="selectRuleForm"
                     label-width="50%">
                <el-row>
                    <el-col :span="8">
                        <el-form-item  label="规则名称" prop="ruleName">
                            <el-input v-model="selectRuleForm.ruleName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="源库名称" prop="sourceDbName">
                            <el-select
                                    v-model="selectRuleForm.sourceDbName"
                                    clearable
                                    @change="selectSourceTable"
                                    placeholder="请选择源数据库">
                                <el-option v-for="item in sourceDbList"
                                           :key="item.sourceDbId"
                                           :label="item.sourceDbName"
                                           :value="item.sourceDbId">
                                    {{item.sourcedbName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="源库表名称" prop="sourceTableName">
                            <el-select
                                    v-model="selectRuleForm.sourceTableName"
                                    clearable
                                    placeholder="请选择源数据表">
                                <el-option v-for="item in sourceTbList"
                                           :key="item.sourceTbId"
                                           :label="item.sourceTableName"
                                           :value="item.sourceTbId">
                                    {{item.sourceTableName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item  label="规则描述" prop="ruleDesc">
                            <el-input  v-model="selectRuleForm.ruleDesc" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目标库名称" prop="targetDbName">
                            <el-select
                                    v-model="selectRuleForm.targetDbName"
                                    clearable
                                    @change="selectTargetTable"
                                    placeholder="请选择目标数据库">
                                <el-option v-for="item in targetDbList"
                                           :key="item.targetDbId"
                                           :label="item.targetDbName"
                                           :value="item.targetDbId">
                                    {{item.targetDbName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目标库表名称" prop="targetTbName">
                            <el-select
                                    v-model="selectRuleForm.targetTbName"
                                    clearable
                                    placeholder="请选择目标数据表">
                                <el-option v-for="item in targetTbList"
                                           :key="item.targetTbId"
                                           :label="item.targetTbName"
                                           :value="item.targetTbId">
                                    {{item.targetTbName}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button size="mini" @click="addDemo">+</el-button>
                <el-table
                        :data="cleanData" border
                        highlight-current-row
                        style="width:100%"
                        class="el-tb-edit"
                        @current-change="handleCleanCurrentChange"
                        ref="demoTable">
                    <el-table-column prop="colunmName" label="选择列">
                        <template scope="scope">
                            <el-select v-model="scope.row.colunmName" placeholder="请选择" size="mini">
                                <el-option label="一级预算单位名称" :value="0"></el-option>
                                <el-option label="二级预算单位名称" :value="1"></el-option>
                                <el-option label="三级预算单位名称" :value="2"></el-option>
                            </el-select>
                            <span>{{({0:"一级预算单位名称",1:"二级预算单位名称",2:"三级预算单位名称"})[scope.row.colunmName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ruleType" label="规则类型">
                        <template scope="scope">
                            <el-select v-model="scope.row.ruleType" placeholder="请选择" size="mini">
                                <el-option label="非空" :value="0"></el-option>
                                <el-option label="字典翻译" :value="1"></el-option>
                                <el-option label="数据重复" :value="2"></el-option>
                            </el-select>
                            <span>{{({0:"非空",1:"字典翻译",2:"数据重复"})[scope.row.colunmName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="param1" label="参数1" width="80">
                        <template scope="scope">
                            <el-input size="mini" v-model="scope.row.param1" placeholder="请输入内容"></el-input>
                            <span>{{scope.row.param1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="param2" label="参数2" width="80">
                        <template scope="scope">
                            <el-input size="mini" v-model="scope.row.param2" placeholder="请输入内容"></el-input>
                            <span>{{scope.row.param2}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="param3" label="参数3" width="80">
                        <template scope="scope">
                            <el-input size="mini" v-model="scope.row.param3" placeholder="请输入内容"></el-input>
                            <span>{{scope.row.param3}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: center">
                    <el-button type="primary" style="margin-top: 20px;" :center="true"
                               @click="updateCleanTask('selectRuleForm')">保 存</el-button>
                    <el-button style="margin-top: 20px;" :center="true" @click="editRuleDialogVisible = false">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        mounted(){
            this.initdata();
            this.initCleanData();
        },
        components: {
        },
        data: function () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 10,
                loading: false,
                height: window.screen.availHeight - 100,
                dataSourceList: [
                    {"id":"财政","sourceDbName":"财政"},
                    {"id":"社保","sourceDbName":"社保"},
                    {"id":"工商","sourceDbName":"工商"},
                    {"id":"税务","sourceDbName":"税务"},
                    {"id":"公积金","sourceDbName":"公积金"},
                    {"id":"医疗","sourceDbName":"医疗"}
                ],
                insertRuleForm:[],
                selectRuleForm:[],
                sourceDbList:[
                    {"sourceDbId":"finance","sourcedbName":"finance",
                        "tables":[
                            {"sourceTbId":"pay_unit_department_name","sourceTableName":"pay_unit_department_name"},
                            {"sourceTbId":"pay_unit_budget_c_rate","sourceTableName":"pay_unit_budget_c_rate"},
                        ]
                    },
                    {"sourceDbId":"socialSecurity","sourcedbName":"socialSecurity",
                        "tables":[
                            {"sourceTbId":"pay_unit_project_c_rate","sourceTableName":"pay_unit_project_c_rate"},
                            {"sourceTbId":"pay_visualization_payment_voucher","sourceTableName":"pay_visualization_payment_voucher"},
                        ]
                    },
                ],
                targetDbList:[
                    {"targetDbId":"finance","targetDbName":"finance",
                        "targetTables":[
                            {"targetTbId":"pay_unit_department_name","targetTbName":"pay_unit_department_name"},
                            {"targetTbId":"pay_unit_budget_c_rate","targetTbName":"pay_unit_budget_c_rate"},
                        ]
                    },
                    {"targetDbId":"socialSecurity","targetDbName":"socialSecurity",
                        "targetTables":[
                            {"targetTbId":"pay_unit_project_c_rate","targetTbName":"pay_unit_project_c_rate"},
                            {"targetTbId":"pay_visualization_payment_voucher","targetTbName":"pay_visualization_payment_voucher"},
                        ]
                    },
                ],
                sourcedbName:'',
                sourceTbName:'',
                targetDbName:'',
                targetTbName:'',
                ruleName:'',
                formItem: {
                },
                data:[],
                sourceTbList:[],
                targetTbList:[],
                cleanData:[],
                insertRuleDialogVisible:false,
                editRuleDialogVisible:false,
                columns: [
                    {
                        title: '数据源类型',
                        key: 'sourceDbName',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '规则名称',
                        key: 'ruleName',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '源数据表名称',
                        key: 'sourceTableName',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '目标表名称',
                        key: 'targetTbName',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '开始时间',
                        key: 'startTime',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '任务状态',
                        key: 'status',
                        width:100,
                        align: 'center',
                    },
                    {
                        title: '进度',
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
                    },
                    {
                        title: '操作',
                        key: 'id',
                        align: 'center',
                        width: 220,
                        render: (h, params) => {
                            const row = params.row;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small',
                                        disabled:(params.row.status=='成功' || params.row.status=='运行中')?true:false,
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.execute(params.index)
                                        }
                                    }
                                }, '执行'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:(params.row.progress!=0)?true:false,
                                    },
                                    style: {
                                        marginRight: '5px',
                                        //display:(params.row.progress!=0)?"none":"inline-block",
                                    },
                                    on: {
                                        click: () => {
                                            this.updateDataClean(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.cloneDataClean(params.index)
                                        }
                                    }
                                }, '克隆'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteDataClean(params.index)
                                        }
                                    }
                                }, '删除'),
                            ])
                        }
                    }
                ],
                showData:[],
            }
        },
        methods: {
            initdata(){
                this.data=[
                    {"id":"1","sourceDbName":"财政","ruleName":"去除空数据","sourceTableName":"A公司年收入信息表","targetDbName":"finance","targetTbName":"A公司年收入信息表","startTime":"2018-10-31 09:40:50","status":"成功","progress":100,"ruleDesc":"去除空数据"},
                    {"id":"2","sourceDbName":"社保","ruleName":"去除空数据","sourceTableName":"A公司缴纳社保情况表","targetDbName":"socialSecurity","targetTbName":"A公司缴纳社保情况表","startTime":"2018-10-31 09:40:50","status":"运行中","progress":60,"ruleDesc":"去除空数据"},
                    {"id":"3","sourceDbName":"公积金","ruleName":"去除空数据","sourceTableName":"A公司缴纳公积金情况表","targetDbName":"finance","targetTbName":"A公司缴纳公积金情况表","startTime":"2018-10-31 09:40:50","status":"运行中","progress":20,"ruleDesc":"去除空数据"}
                    ];
                this.showData = this.data;
            },
            initCleanData(){
              this.cleanData=[
                  {"colunmName":1,"ruleType":1,"param1":"社保","param2":"","param3":""}]

            },
            selectSourceTable(value) {//设置源数据库-表
                var that = this;
                that.sourceDbList.forEach(function (item,index) {
                    if(item.sourceDbId == value) {
                        that.sourceTbList = item.tables;
                    }
                })
            },
            selectTargetTable(value) {//设置目标数据库-表
                var that = this;
                that.targetDbList.forEach(function (item,index) {
                    if(item.targetDbId == value) {
                        that.targetTbList = item.targetTables;
                    }
                })
            },
            handleCurrentChange() {
            },
            addDemo(){
                var d = {
                    colunmName: 1,
                    ruleType: 1,
                    param1: '',
                    param2: '',
                    param3: ''
                };
                this.cleanData.push(d);
                setTimeout(() => { this.$refs.demoTable.setCurrentRow(d); }, 10);
            },
            handleCleanCurrentChange(val){
                this.currentRow = val;
            },
            handleDelete(index, r) {
                this.cleanData.splice(index, 1)
            },
            queryDataCleanList(){
                var result = this.data;
                var sourceDbName = this.formItem.sourceDbName;
                var targetTbName = this.formItem.targetTbName;
                var sourceTableName = this.formItem.sourceTableName;
                this.showData = result.filter(
                    function(v){
                        var flag = (!sourceDbName || v.sourceDbName.indexOf(sourceDbName)>=0)
                            &&(!sourceTableName || v.sourceTableName.indexOf(sourceTableName)>=0)
                            &&(!targetTbName || v.targetTbName.indexOf(targetTbName)>=0)
                        return flag;
                    }
                );
            },
            insertRule(){
                this.insertRuleForm = {};
                this.insertRuleDialogVisible = true;
            },
            /*保存*/
            insertCleanTask(forName){
                if(this.insertRuleForm){
                    var data = this.insertRuleForm;
                    var id = Math.random();
                    //id +=1;
                    var sourceDbName = data.sourceDbName;
                    var targetDbName = data.targetDbName;
                    var ruleName = data.ruleName;
                    var sourceTableName = data.sourceTableName;
                    var targetTbName = data.targetTbName;
                    var ruleDesc = data.ruleDesc;
                    var status = 0;
                    var dataclean = {'id':id,'sourceDbName':sourceDbName,"ruleName":ruleName,"sourceTableName":sourceTableName,
                                    "targetDbName":targetDbName,
                                    "targetTbName":targetTbName,
                                    "startTime":getCurrentDate(2),
                                    "status":"未执行","progress":0,
                                    "ruleDesc":ruleDesc};
                    var that = this;
                    that.showData.push(dataclean);
                    that.insertRuleDialogVisible = false;
                    this.$message({
                        showClose:true,
                        message:"保存成功！",
                        type:'success'
                    });
                }
            },
            deleteDataClean(index){
                this.showData.splice(index,1);
                this.$message({
                    showClose:true,
                    message:"删除成功！",
                    type:'error'
                });
                this.queryDataCleanList();
            },
            /*点击编辑按钮弹出*/
            updateDataClean(index){
                this.editRuleDialogVisible = true;
                this.selectRuleForm = this.clone(this.showData[index]);
                this.selectRuleForm.ind = index;
            },
            /*编辑里的保存*/
            updateCleanTask(formName){
                var that = this;
                var index = this.selectRuleForm.ind;
                var item = this.showData[index];
                for(var key in item){
                    item[key] = this.selectRuleForm[key];
                }
                this.editRuleDialogVisible = false;
                alert("修改成功");
            },
            /*克隆*/
            cloneDataClean(index){
              var newData = this.clone(this.showData[index]);
              newData.progress=0;
              newData.status="未执行";
              this.showData.push(newData);
            },
            task(o){
                o.progress = parseFloat(o.progress);
                o.progress += Math.round(Math.random()*20);
                o.status = '运行中';
                if(o.progress >= 100){
                    o.progress = 100;
                    o.status = '成功';
                }
            },
            execute(index){
                var progress =  this.showData[index];
                var that = this;
                var interval = setInterval(function(){
                    if(progress.progress>=100){
                        clearInterval(interval);
                    }else{
                        that.task(progress);
                    }
                },1000);
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
    }
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