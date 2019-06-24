<template>
    <Modal v-model="show" width="1000" :styles="{top: '20px'}" class="example">
        <p slot="header" style="text-align:center">
            <span style="font-size: 20px">详细信息</span>
        </p>
        <div>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="基本信息" name="name1" v-if="info.type">
                    <div style="max-height: 450px;overflow-y: auto">
                        <h2 style="font-size: 1.5em;font-weight: bold;">&nbsp;&nbsp;{{info.name}}</h2>
                        <ol style="font-size: 14px;padding: 10px;">
                            <li><strong>类型：</strong><span>{{nodeTypes[info.type].display}}</span></li>

                            <li v-if="info.uid&&info.type=='Person'"><strong>编号：</strong><span>{{info._uid}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'"><strong>性别：</strong><span>{{info.propertyList.sex==1?"男":"女"}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.birthday"><strong>出生日期：</strong><span>{{info.propertyList.birthday}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.deathday"><strong>死亡日期：</strong><span>{{info.propertyList.deathday}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.cremationday"><strong>火化时间：</strong><span>{{info.propertyList.cremationday}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.address"><strong>住址：</strong><span>{{info.propertyList.address}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.tel"><strong>联系电话：</strong><span>{{info.propertyList.tel}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.unitid"><strong>单位编号：</strong><span>{{info.propertyList.unitid}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.unitname"><strong>单位名称：</strong><span>{{info.propertyList.unitname}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.isprovide"><strong>是否供养人员：</strong><span>{{info.propertyList.isprovide==1?"是":"否"}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.ismls"><strong>是否低保人员：</strong><span>{{info.propertyList.ismls==1?"是":"否"}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.mlsid"><strong>低保人员户号：</strong><span>{{info.propertyList.mlsid}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.ispoverty"><strong>是否贫困人口：</strong><span>{{info.propertyList.ispoverty==1?"是":"否"}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.povertypid"><strong>贫困人口编号：</strong><span>{{info.propertyList.povertypid}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.povertyfid"><strong>贫困户号：</strong><span>{{info.propertyList.povertyfid}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.regioncode"><strong>行政区划：</strong><span>{{info.propertyList.regioncode}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Person'&&info.propertyList.source"><strong>数据来源：</strong><span>{{info.propertyList.source}}</span>
                            </li>


                            <li v-for=" (data,name) in additionalInfo">
                                <span>
                                    <strong>{{name}}: </strong>
                                    <span v-html="data"></span>
                                </span>
                            </li>

                            <li v-if="info.uid&&info.type=='Company'"><strong>企业名称：</strong><span>{{info.propertyList.uid}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.name"><strong>营业执照注册号：</strong><span>{{info.propertyList.name}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.reg_name"><strong>法定代表人：</strong><span>{{info.propertyList.reg_name}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.reg_uid"><strong>法定代表人证件号码：</strong><span>{{info.propertyList.reg_uid}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.state"><strong>企业状态：</strong><span>{{info.propertyList.state}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.ctype"><strong>企业类型：</strong><span>{{info.propertyList.ctype}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.createtime"><strong>成立时间：</strong><span>{{info.propertyList.createtime}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.checktime"><strong>核准日期：</strong><span>{{info.propertyList.checktime}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.money"><strong>注册资金：</strong><span>{{info.propertyList.money}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.scope"><strong>经营范围：</strong><span>{{info.propertyList.scope}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.registername"><strong>登记机关名称：</strong><span>{{info.propertyList.registername}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.regioncode"><strong>行政区划：</strong><span>{{info.propertyList.regioncode}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.source"><strong>数据来源：</strong><span>{{info.propertyList.source}}</span>
                            </li>
                            <li v-if="info.uid&&info.type=='Company'&&info.propertyList.tips"><strong>摘要：</strong><span>{{info.propertyList.tips}}</span>
                            </li>

                            <li v-if="info.type&&info.type=='Company'">
                                <strong>企业股东</strong>
                                <Table border
                                       :no-data-text="investInfo.investO.noTextData"
                                       :loading="investInfo.investO.loading"
                                       :columns="investInfo.investO.columns"
                                       :data="investInfo.investO.data"
                                       :show-header="false"
                                >
                                </Table>
                            </li>
                            <li v-if="info.type&&info.type=='Company'">
                                <strong>个人股东</strong>
                                <Table border
                                       :no-data-text="investInfo.investH.noTextData"
                                       :loading="investInfo.investH.loading"
                                       :columns="investInfo.investH.columns"
                                       :data="investInfo.investH.data"
                                       :show-header="false"
                                >
                                </Table>
                            </li>
                            <li v-if="info.type&&info.type=='Company'">
                                <strong>董事</strong>
                                <Table border
                                       :no-data-text="investInfo.investD.noTextData"
                                       :loading="investInfo.investD.loading"
                                       :columns="investInfo.investD.columns"
                                       :data="investInfo.investD.data"
                                       :show-header="false"
                                >
                                </Table>
                            </li>

                            <li v-if="info.type&&info.type=='Department'"><strong>单位编号：</strong><span>{{info.uid}}</span>
                            </li>
                            <li v-if="info.type&&info.type=='Department'"><strong>单位名称：</strong><span>{{info.name}}</span>
                            </li>
                            <li v-if="info.type&&info.type=='Department'&&info.propertyList.orguid"><strong>组织机构代码：</strong><span>{{info.propertyList.orguid}}</span>
                            </li>
                            <li v-if="info.type&&info.type=='Department'&&info.propertyList.regioncode"><strong>行政区划：</strong><span>{{info.propertyList.regioncode}}</span>
                            </li>
                            <li v-if="info.type&&info.type=='Department'&&info.propertyList.address"><strong>地址：</strong><span>{{info.propertyList.address}}</span>
                            </li>
                            <li v-if="info.type&&info.type=='Department'&&info.propertyList.source"><strong>数据来源：</strong><span>{{info.propertyList.source}}</span>
                            </li>

                            <li v-if="info.type&&info.type=='Account'"><strong>卡号：</strong><span>{{info._uid}}</span>
                            </li>
                        </ol>
                        <div ref="departmentPie" style="height: 200px;width: 950px" v-show="departmentPie"></div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="地税信息" name="name2" v-if="info.type&&info.type=='Company'">
                    <div style="text-align: center;" v-show="landTaxChart">
                        <div style="padding-bottom: 10px">
                            <strong style="font-size: 15px">选择时间：</strong>
                            <Date-picker type="month" placeholder="开始时间" v-model="landTaxModalData.datePicker[0]"
                                         style="width: 200px;display: inline-block"></Date-picker>
                            <span>--</span>
                            <Date-picker type="month" placeholder="结束时间" v-model="landTaxModalData.datePicker[1]"
                                         style="width: 200px;display: inline-block"></Date-picker>
                            <Button type="primary" @click="filterLandTax">筛选</Button>
                        </div>
                        <div style="max-height: 400px;overflow-y: auto">
                            <div ref="landTaxDetailChart" style="height: 0px;width: 900px"></div>
                        </div>
                    </div>
                    <div v-show="!landTaxChart" style="font-size:20px;font-weight:800;text-align:center;padding:20px">
                        暂无数据
                    </div>
                </el-tab-pane>
                <el-tab-pane label="社保信息" name="name3" v-if="info.type&&info.type=='Company'">
                    <div style="text-align: center" v-show="securityChart">
                        <div style="padding-bottom: 10px">
                            <strong style="font-size: 15px">选择时间：</strong>
                            <Date-picker type="month" placeholder="开始时间"
                                         v-model="socialSecurityModalData.datePicker[0]"
                                         style="width: 200px;display: inline-block"></Date-picker>
                            <span>--</span>
                            <Date-picker type="month" placeholder="结束时间"
                                         v-model="socialSecurityModalData.datePicker[1]"
                                         style="width: 200px;display: inline-block"></Date-picker>
                            <Button type="primary" @click="filterSocialSecurity">筛选</Button>
                        </div>
                        <div style="max-height: 400px;overflow-y: auto">
                            <div ref="socialSecurityDetailChart" style="height: 0px;width: 900px"></div>
                        </div>
                    </div>
                    <div v-show="!securityChart" style="font-size:20px;font-weight:800;text-align:center;padding:20px">
                        暂无数据
                    </div>
                </el-tab-pane>
                <el-tab-pane label="支付详情" name="name2" v-if="info.type&&info.type=='Department'">
                    <div style="" v-show="payDetailChart">
                        <div style="max-height: 400px;overflow-y: auto" class="row">
                            <h4 ref="title" style="padding: 0;margin: 0;text-align:center;"></h4>
                            <div ref="payPie" style="height:600px;width: 900px;margin: 0 auto;"></div>
                        </div>
                        <div style="margin: 0 auto;">
                            <el-collapse v-model="activeNames" accordion @change="collapseHandleChange">
                                <el-collapse-item :title="payList" :name="key" v-for="(payList,key) in payListData">
                                    <el-table height="250" style="width: 100%;" :data="payData" :loading="loading">
                                        <!--<el-table-column :label="title[key]" style="width: 100%;" height="40">-->
                                        <el-table-column prop="pay_way_name" label="支付方式"></el-table-column>
                                        <el-table-column prop="project_class_name" label="项目分类"></el-table-column>
                                        <el-table-column prop="functional_subjects_name" label="功能科目"></el-table-column>
                                        <el-table-column prop="economic_subjects_name" label="经济科目"></el-table-column>
                                        <el-table-column prop="payee_name" label="收款单位"></el-table-column>
                                        <el-table-column prop="pay_amount" label="支付金额"></el-table-column>
                                        <el-table-column prop="remark" label="摘要"></el-table-column>
                                        <!--</el-table-column>-->
                                    </el-table>
                                    <div style="float: right">
                                        <el-pagination
                                                @size-change="handleSizeChange"
                                                @current-change="handleCurrentChange"
                                                :page-sizes="[5, 10, 15, 20]"
                                                :page-size="size"
                                                :current-page="page"
                                                layout="sizes, prev, pager, next"
                                                :total="total">
                                        </el-pagination>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="决算详情" name="name3" v-if="info.type&&info.type=='Department'">
                    <div style="text-align: center" v-show="finalAccountChart">
                        <div style="max-height: 400px;overflow-y: auto;margin:20px 0 30px 10px" class="row">
                            <h4 ref="finnalTitle" style="padding: 0;margin: 0 0 10px 0"></h4>
                            <div class="col-md-4 col-sm-4">
                                <div ref="incomeChart" style="height: 300px;width: 300px;"></div>
                            </div>
                            <div class="col-md-4 col-sm-4">
                                <div ref="payAndSettleChart" style="height: 300px;width: 300px;"></div>
                            </div>
                            <div class="col-md-4 col-sm-4">
                                <div ref="spendFinalAccountChart" style="height: 300px;width: 300px;"></div>
                            </div>
                        </div>
                        <div class="" style="margin: 0 auto">
                            <div ref="sixSpendChart" style="height: 400px;width: 1083px;margin-left:-44px;"></div>
                        </div>
                    </div>
                    <div v-show="!finalAccountChart" style="font-size:20px;font-weight:800;text-align:center;padding:20px">
                        暂无数据
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <p slot="footer"></p>
    </Modal>
</template>
<style scoped src="../assets/bootstrap.min.css">
    /*@import '../assets/bootstrap.min.css';*/
    h2 {
        font-size: 1.5em;
    }
</style>
<script>
    import dictionary from '../config/dictionary';
    import Util from '../libs/util';
    import  '../assets/bootstrap.min.js';
    var payListData = [];
    var payData = [];
    export default {
        data() {
            return {
                show: false,
                socialSecurityDetailChartContainer: '',//社保图标容器
                landTaxDetailChartContainer: '',//社保图标容器
                activeTab: 'name1',
                landTaxChart: false,
                securityChart: false,
                payDetailChart :false,
                finalAccountChart:false,
                departmentChart: false,
                departmentPie: false,
                info: {},//节点基本信息（初始化传入）
                nodeTypes: dictionary.nodeTypes,
                landTaxModalData: {
                    dateRange: [],
                    datePicker: [],
                    originData: [],
                    formedData: {},//{税种类型：{count：缴税次数，amount：缴税金额}，根据datePicker过滤
                },
                socialSecurityModalData: {
                    dateRange: [],
                    datePicker: [],
                    originData: [],
                    formedData: {}//{保险类型：{payed：参保缴费人数，paused：暂停缴费人数}，根据datePicker过滤
                },
                additionalInfo: {},//节点基本信息（去后台请求）
                investInfo: {
                    investH: {
                        noTextData: '无个人股东',
                        data: [],
                        columns: [
                            {key: 0},
                            {key: 1}
                        ],
                        loading: false
                    },
                    investO: {
                        noTextData: '无企业股东',
                        data: [],
                        columns: [
                            {key: 0},
                            {key: 1}
                        ],
                        loading: false
                    },
                    investD: {
                        noTextData: '暂无数据',
                        data: [],
                        columns: [
                            {key: 0},
                            {key: 1},
                            {key: 2},
                        ],
                        loading: false
                    }
                },
                page: 1,
                size: 5,
                total: 0,
                key:'',
                loading:false,
                payListData:payListData,
                payData:payData,
                activeNames: ['0'],
                header:["支付方式","项目分类","功能科目","经济科目","收款单位","支付金额","摘要"]
            }
        },
        watch:{
            page: function () {
                this.update();
            },
            size: function () {
                this.page = 1;
                this.update();
            },
            key :function () {
                this.update();
            }
        },
        methods: {
            handleSizeChange(val) {
                this.size = val;
            },
            handleCurrentChange(val) {
                this.page = val;
            },
            showModal(info) {
                this.info = info;
                if(this.info.uid){
                    var userInfo = sessionStorage.getItem("userInfo")||"{}";
                    userInfo = JSON.parse(userInfo);
                    console.log(userInfo);
                    if(userInfo.office){
                        var detail = userInfo.office.detail;
                        if(""+detail==="1"){
                            this.info._uid = this.info.uid;
                        }else{
                            var uid = this.info.uid.substring(0,10)+"******"+info.uid.substring(16,18);
                            this.info._uid = uid;
                        }
                    }else{
                        this.info._uid = this.info.uid;
                    }
                }
                this.activeTab = 'name1';
                this.buildInfoDetail();
                this.show = true;
            },
            buildInfoDetail() {
                this.additionalInfo = {};
                var that = this;
                this.landTaxChart = false;
                this.securityChart = false;
                this.departmentChart = false;
                this.departmentPie = false;
                if (this.info.type.toLowerCase() == 'company') {
                    this.drawLandTaxDetail(this.info.name);
                    this.drawSocialSecurityDetail(this.info.name);
                    /*$.post('/api/charts/company-all-info?name=' + this.info.name, function (data) {
                        if (!data) {
                            that.$message({
                                showClose: true,
                                message: '暂无该公司注册信息',
                                type: 'warning'
                            });
                        }
                        for (var propertyName in dictionary.nodeTypes.Company.properties) {
                            if (data[propertyName] && propertyName != 'companyName')
                                that.$set(that.additionalInfo, dictionary.nodeTypes.Company.properties[propertyName].display, data[propertyName]);
                        }
                    });*/
                    that.$http.post('/api/charts/company-all-info',that.querystring.stringify({name:this.info.name}))
                        .then(function (response){
                            if(!response.data){
                                that.$message({
                                    showClose:true,
                                    message:'暂无该公司注册信息',
                                    type:'warning'
                                })
                            }
                            for(var propertyName in dictionary.nodeTypes.Company.properties){
                                if (response.data[propertyName] && propertyName != 'companyName')
                                    that.$set(that.additionalInfo, dictionary.nodeTypes.Company.properties[propertyName].display, response.data[propertyName]);
                            }
                        })
                    that.investInfo.investH.loading = true;
                    that.investInfo.investO.loading = true;
                    that.investInfo.investD.loading = true;
                    /*$.post('/api/charts/company-invest?name=' + that.info.name, function (data) {
                        that.investInfo.investH.loading = false;
                        that.investInfo.investO.loading = false;
                        that.investInfo.investD.loading = false;
                        if (data.O && data.O.length > 0)
                            that.$set(that.investInfo.investO, 'data', that.formTable(data.O, 2));
                        if (data.H && data.H.length > 0)
                            that.$set(that.investInfo.investH, 'data', that.formTable(data.H, 2));
                        if (data.D && data.D.length > 0)
                            that.$set(that.investInfo.investD, 'data', that.formTable(data.D, 2));
                    });*/
                    that.$http.post('/api/charts/company-invest',that.querystring.stringify({name:that.info.name}))
                        .then(function (response){
                            that.investInfo.investH.loading = false;
                            that.investInfo.investO.loading = false;
                            that.investInfo.investD.loading = false;
                            if (response.data.O && response.data.O.length > 0)
                                that.$set(that.investInfo.investO, 'data', that.formTable(response.data.O, 2));
                            if (response.data.H && response.data.H.length > 0)
                                that.$set(that.investInfo.investH, 'data', that.formTable(response.data.H, 2));
                            if (response.data.D && response.data.D.length > 0)
                                that.$set(that.investInfo.investD, 'data', that.formTable(response.data.D, 2));
                        })
                }
                else {
                    if (this.info.type.toLowerCase() == 'person') {
                        /*Util.ajax('/api/charts/person-kinship?id=' + this.info.uid,
                            {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                }
                            }).then(function (response) {
                            if (response.data && response.data.length > 0)
                                that.$set(that.additionalInfo, '配偶', response.data.join(','));

                        });*/
                        var id = this.info.uid;
                        var that = this;
                        $.post("/api/charts/person-kinship", that.querystring.stringify(
                            {id:id}
                            )).then(response => {
                            that.$set(that.additionalInfo, '配偶', response.data.join(','));
                        })
                    }
                    if (this.info.type.toLowerCase() == 'department') {
                        this.departmentChart = true;
                        this.finalAccountChart = true;
                        this.payDetailChart = true;
                        // Util.ajax('http://20.28.29.150:83/BaseDepartInfo?name=' + this.info.name,
                        //     {
                        //         headers: {
                        //             'Access-Control-Allow-Origin': '*',
                        //         }
                        //     }).then(function (response) {
                        //     that.$set(that, 'additionalInfo', response.data[0]);
                        // });
                        this.drawPayDetailChart();
                        this.drawFinalAccountChart();
//                        this.drawDepartmentPie(this.info.name);
                    }
                }
            },
            formTable(data, columnCount) {
                var tableData = [];
                for (var i in data) {
                    if (i % columnCount == 0)
                        tableData.push({});
                    tableData[Math.floor(i / columnCount)][i % columnCount] = data[i];
                }
                return tableData;
            },
            drawLandTaxDetail(companyName) {
                var that = this;
                that.landTaxChart = true;
                /*$.post('/api/charts/land_tax_chart?name=' + companyName, function (response) {
                    if (!response.data || response.data.length == 0) {
                        that.landTaxChart = false;
                        that.$message({
                            showClose: true,
                            message: '暂无该地税公司数据',
                            type: 'warning'
                        });
                        return;
                    }
                    that.landTaxModalData.originData = response.data;
                    that.landTaxModalData.dateRange = [Util.formDate(response.data[0].month), Util.formDate(response.data[response.data.length - 1].month)];
                    that.landTaxModalData.datePicker = [Util.formDate(response.data[0].month), Util.formDate(response.data[response.data.length - 1].month)];
                    that.filterLandTax();
                });*/
                that.$http.post('/api/charts/land_tax_chart',that.querystring.stringify({name:companyName}))
                    .then(function (response){
                        if (!response.data.data || response.data.data.length == 0) {
                            that.landTaxChart = false;
                            that.$message({
                                showClose: true,
                                message: '暂无该地税公司数据',
                                type: 'warning'
                            });
                            return;
                        }
                        that.landTaxModalData.originData = response.data.data;
                        that.landTaxModalData.dateRange = [Util.formDate(response.data.data[0].month), Util.formDate(response.data.data[response.data.data.length - 1].month)];
                        that.landTaxModalData.datePicker = [Util.formDate(response.data.data[0].month), Util.formDate(response.data.data[response.data.data.length - 1].month)];
                        that.filterLandTax();
                    })
            },
            drawSocialSecurityDetail(companyName) {
                var that = this;
                that.securityChart = true;
                /*$.post('/api/charts/social_security_chart?name=' + companyName, function (response) {
                    if (!response.data || response.data.length == 0) {
                        that.securityChart = false;
                        that.$message({
                            showClose: true,
                            message: '暂无该公司社保数据',
                            type: 'warning'
                        });
                        return;
                    }
                    that.socialSecurityModalData.originData = response.data;
                    that.socialSecurityModalData.dateRange = [Util.formDate(response.data[0].month), Util.formDate(response.data[response.data.length - 1].month)];
                    that.socialSecurityModalData.datePicker = [Util.formDate(response.data[0].month), Util.formDate(response.data[response.data.length - 1].month)];
                    that.filterSocialSecurity();
                });*/
                that.$http.post('/api/charts/social_security_chart',that.querystring.stringify({name:companyName}))
                    .then(function (response){
                        if (!response.data.data || response.data.data.length == 0) {
                            that.securityChart = false;
                            that.$message({
                                showClose: true,
                                message: '暂无该公司社保数据',
                                type: 'warning'
                            });
                            return;
                        }
                        that.socialSecurityModalData.originData = response.data;
                        that.socialSecurityModalData.dateRange = [Util.formDate(response.data.data[0].month), Util.formDate(response.data.data[response.data.data.length - 1].month)];
                        that.socialSecurityModalData.datePicker = [Util.formDate(response.data.data[0].month), Util.formDate(response.data.data[response.data.data.length - 1].month)];
                        that.filterSocialSecurity();
                    })
            },
            formSocialSecurityData() {
                this.socialSecurityModalData.formedData = {};
                for (var i in this.socialSecurityModalData.originData) {
                    var item = this.socialSecurityModalData.originData[i];
                    var date = Util.formDate(item.month);
                    if (date.getTime() <= this.socialSecurityModalData.datePicker[0].getTime() - 1 || date.getTime() >= this.socialSecurityModalData.datePicker[1].getTime() + 1) {
                        continue;
                    }
                    if (!this.socialSecurityModalData.formedData[item.type])
                        this.socialSecurityModalData.formedData[item.type] = {
                            payed: {},
                            paused: {}
                        };
                    if (item.state == '参保缴费')
                        this.socialSecurityModalData.formedData[item.type].payed[item.month] = item;
                    if (item.state == '暂停缴费')
                        this.socialSecurityModalData.formedData[item.type].paused[item.month] = item;
                }
            },
            formLandTaxData() {
                this.landTaxModalData.formedData = {};
                for (var i in this.landTaxModalData.originData) {
                    var item = this.landTaxModalData.originData[i];
                    var date = Util.formDate(item.month);
                    if (date.getTime() <= this.landTaxModalData.datePicker[0].getTime() - 1 || date.getTime() >= this.landTaxModalData.datePicker[1].getTime() + 1) {
                        continue;
                    }
                    if (!this.landTaxModalData.formedData[item.item])
                        this.landTaxModalData.formedData[item.item] = {
                            count: {},
                            amount: {}
                        };
                    this.landTaxModalData.formedData[item.item].count[item.month] = item;
                    this.landTaxModalData.formedData[item.item].amount[item.month] = item;
                }
            },
            drawPayDetailChart() {
                var that = this;
                that.$nextTick(function () {
                    that.$refs.title.innerHTML = that.info.name;
                    that.$http.post("/api/charts/pay", that.querystring.stringify({"name": that.info.name}))
                        .then(response => {
                            if ((response.data.status & 1) == 1) {
                                that.payListData = response.data.data.pay.list_pay;
                                var draw = true;
                                for (var itemName in response.data.data.pay.list_pie) {
                                    draw = draw && response.data.data.pay.list_pie[itemName] != null;
                                }
                                if (draw) {
                                    var pieChart = Util.initChart(that.$refs.payPie);
                                    var data = [];
                                    for (let itemName in response.data.data.pay.list_pie) {
                                        var dataItem = [];
                                        for (let i in response.data.data.pay.list_pie[itemName]) {
                                            dataItem.push({
                                                name: i,
                                                value: (Math.floor(response.data.data.pay.list_pie[itemName][i] * 100) / 100)
                                            })
                                        }
                                        data.push({name: itemName, data: dataItem});
                                    }
                                    pieChart.setOption({
                                        title: $.map(data, function (value, index) {
                                            return {
                                                text: value.name,
                                                top: 0,
                                                left: (index < 3 ? ((0.5 + index) * 25 + '%') : ((index - 2.5) * 25 + '%')),
                                                top: (index < 3 ? ("5%") : ("40%")),
                                                textStyle: {
                                                    fontSize: 15
                                                }
                                            }
                                        }),
                                        tooltip: {},
                                        series: $.map(data, function (value, index) {
                                            return {
                                                name: value.name,
                                                data: value.data,
                                                type: 'pie',
                                                radius: '30%',
                                                label: {
                                                    normal: {
                                                        position: 'inner',
                                                        color: '#fff'
                                                    }
                                                },
                                                center: [index < 3 ? ((20 + index * 30 ) + '%') : (((index - 3) * 30 + 20) + '%'), index < 3 ? '25%' : '60%'],
                                                labelLine: {
                                                    normal: {
                                                        length: 5
                                                    }
                                                }
                                            }
                                        })
                                    });
                                    echarts.connect(pieChart)
                                }
                            } else if ((response.data.status & 1) != 1) {
                                that.$message({
                                    showClose: true,
                                    message: '暂无信息',
                                    type: 'warning'
                                });
                            }
                        }).catch(error => that.showNotification('提示', "网络异常, 请重试."));
                })
            },
            drawFinalAccountChart() {
                var that = this;
                that.$nextTick(function () {
                    that.$refs.finnalTitle.innerHTML = that.info.name+"收入支出结算表";
                    Util.ajax('/api/account?name=' + that.info.name, {
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        }
                    }).then(function (response) {
                        if((response.data.status & 1) == 1){
                            if(response.data.data.income != null){
                                let incomeChartContainer = Util.initChart(that.$refs.incomeChart);
                                incomeChartContainer.setOption({
                                    title: {
                                        text: '收入决算表',
                                        x: '13%',
                                        y: '8%',
                                        textStyle: {
                                            fontSize: 16,
                                            fontWeight: 'bolder'
                                        }
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow'
                                        },
                                    },
                                    legend: {
                                        data: ['决算数','年初预算数','调整预算数']
                                    },
                                    xAxis: {
                                        data: response.data.data.income.x,
                                        axisLabel: {
                                            show: true,
                                            interval: 0,
                                            rotate: 60
                                        },
                                        axisTick: {
                                            show: false
                                        }
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [
                                        {
                                            name: '决算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal:{
                                                    color: '#C23531'
                                                }
                                            },
                                            data: response.data.data.income.y[0]
                                        },
                                        {
                                            name: '年初预算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#2F4554'
                                                }
                                            },
                                            data: response.data.data.income.y[1]
                                        },
                                        {
                                            name: '调整预算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#61A0A8'
                                                }
                                            },
                                            data: response.data.data.income.y[2]
                                        }
                                    ]
                                });
                            }
                            if(response.data.data.efficacy != null){
                                let payAndSettleChartContainer = Util.initChart(that.$refs.payAndSettleChart);
                                payAndSettleChartContainer.setOption({
                                    title: {
                                        text: '支出结算表（按功能分类）',
                                        x: '13%',
                                        y: '8%',
                                        textStyle: {
                                            fontSize: 16,
                                            fontWeight: 'bolder'
                                        }
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow'
                                        },
                                    },
                                    legend: {
                                        data: ['决算数','年初预算数','调整预算数']
                                    },
                                    xAxis: {
                                        data: response.data.data.efficacy.x,
                                        axisLabel: {
                                            show: true,
                                            interval: 0,
                                            rotate: 60
                                        },
                                        axisTick: {
                                            show: false
                                        }
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [
                                        {
                                            name: '决算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal:{
                                                    color: '#C23531'
                                                }
                                            },
                                            data: response.data.data.efficacy.y[0]
                                        },
                                        {
                                            name: '年初预算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#2F4554'
                                                }
                                            },
                                            data: response.data.data.efficacy.y[1]
                                        },
                                        {
                                            name: '调整预算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#61A0A8'
                                                }
                                            },
                                            data: response.data.data.efficacy.y[2]
                                        }
                                    ]
                                });
                            }
                            if(response.data.data.expenditure != null){
                                let spendFinalAccountChartContainer = Util.initChart(that.$refs.spendFinalAccountChart);
                                spendFinalAccountChartContainer.setOption({
                                    title: {
                                        text: '支出决算表（按自出性质分类）',
                                        x: '13%',
                                        y: '8%',
                                        textStyle: {
                                            fontSize: 16,
                                            fontWeight: 'bolder'
                                        }
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow'
                                        },
                                    },
                                    legend: {
                                        data: ['决算数','年初预算数','调整预算数']
                                    },
                                    xAxis: {
                                        data: response.data.data.expenditure.x,
                                        axisLabel: {
                                            show: true,
                                            interval: 0,
                                            rotate: 60
                                        },
                                        axisTick: {
                                            show: false
                                        }
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [
                                        {
                                            name: '决算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal:{
                                                    color: '#C23531'
                                                }
                                            },
                                            data: response.data.data.expenditure.y[0]
                                        },
                                        {
                                            name: '年初预算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#2F4554'
                                                }
                                            },
                                            data: response.data.data.expenditure.y[1]
                                        },
                                        {
                                            name: '调整预算数',
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#61A0A8'
                                                }
                                            },
                                            data: response.data.data.expenditure.y[2]
                                        }
                                    ]
                                });
                            }
                            if(response.data.data.six != null){
                                let sixSpendChartContainer = Util.initChart(that.$refs.sixSpendChart);
                                sixSpendChartContainer.setOption({
                                    title: {
                                        text: '六项费用',
                                        x: '13%',
                                        y: '8%',
                                        textStyle: {
                                            fontSize: 16,
                                            fontWeight: 'bolder'
                                        }
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow'
                                        },
                                    },
                                    legend: {
                                        data: ["办公费","差旅费","因公出国(境)费用","会议费","培训费","公务接待费","公务用车运行维护费"]
                                    },
                                    xAxis: {
                                        data: response.data.data.six.x,
                                        axisLabel: {
                                            show: true,
                                            interval: 0,
                                            rotate: 60
                                        },
                                        axisTick: {
                                            show: false
                                        }
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [
                                        {
                                            name: "办公费",
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#C23531'
                                                }
                                            },
                                            barWidth: '10px',
                                            data: response.data.data.six.y[0]
                                        },
                                        {
                                            name: "差旅费",
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#2F4554'
                                                }
                                            },
                                            barWidth: '10px',
                                            data: response.data.data.six.y[1]
                                        },
                                        {
                                            name: "因公出国(境)费用",
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#61A0A8'
                                                }
                                            },
                                            barWidth: '10px',
                                            data: response.data.data.six.y[2]
                                        },
                                        {
                                            name: "会议费",
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#D48265'
                                                }
                                            },
                                            barWidth: '10px',
                                            data: response.data.data.six.y[3]
                                        },
                                        {
                                            name: "培训费",
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#91C7AE'
                                                }
                                            },
                                            barWidth: '10px',
                                            data: response.data.data.six.y[4]
                                        },
                                        {
                                            name: "公务接待费",
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#749F83'
                                                }
                                            },
                                            barWidth: '10px',
                                            data: response.data.data.six.y[5]
                                        },
                                        {
                                            name: "公务用车运行维护费",
                                            type: 'bar',
                                            itemStyle:{
                                                normal: {
                                                    color: '#CA8622'
                                                }
                                            },
                                            barWidth: '10px',
                                            data: response.data.data.six.y[6]
                                        }
                                    ]
                                });
                            }
                        }else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: '暂无信息',
                                type: 'warning'
                            });
                        }
                    });
                })
            },
            filterSocialSecurity() {
                if (!this.socialSecurityDetailChartContainer)
                    this.socialSecurityDetailChartContainer = Util.initChart(this.$refs.socialSecurityDetailChart);
                this.formSocialSecurityData();
                var sortedData = $.map(this.socialSecurityModalData.formedData, function (value, item) {
                    value.name = item;
                    return value;
                }).sort(function (a, b) {
                    return (a.name).localeCompare(b.name)
                });
                var options = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            snap: true,
                        },
                    },
                    title: [],
                    grid: [],
                    xAxis: [],
                    yAxis: [],
                    series: []
                }
                var itemCount = 0;//保险类型计数
                for (var index in sortedData) {
                    var item = sortedData[index].name;
                    if (!item || item == 'null') continue;
                    options.title.push({
                        text: item + '-参保缴费',
                        x: '20%',
                        y: itemCount * 200 + 30,
                        textStyle: {
                            fontSize: 14
                        }
                    });
                    options.title.push({
                        text: item + '-暂停缴费',
                        x: '70%',
                        y: itemCount * 200 + 30,

                        textStyle: {
                            fontSize: 14
                        }
                    });
                    options.grid.push({
                        x: '50',
                        y: 60 + itemCount * 200,
                        width: '37%',
                        height: '170',
                        containLabel: true
                    });
                    options.grid.push({
                        x: '55%',
                        y: 60 + itemCount * 200,
                        width: '37%',
                        height: '170',
                        containLabel: true
                    });

                    options.xAxis.push({
                        gridIndex: itemCount * 2,
                        type: 'time',
                        name: '时间',
                        splitLine: {show: false},
                        axisLabel: {
                            formatter: function (value, index) {
                                var date = new Date(value);
                                return date.getFullYear() + '-' + (date.getMonth() + 1);
                            }
                        }
                    });
                    options.xAxis.push({
                        gridIndex: itemCount * 2 + 1,
                        type: 'time',
                        name: '时间',
                        splitLine: {show: false},
                        axisLabel: {
                            formatter: function (value, index) {
                                var date = new Date(value);
                                return date.getFullYear() + '-' + (date.getMonth() + 1);
                            }
                        }
                    });
                    options.yAxis.push({gridIndex: itemCount * 2, type: 'value', name: '人数'});
                    options.yAxis.push({gridIndex: itemCount * 2 + 1, type: 'value', name: '人数'});

                    options.series.push({
                        name: item + '-参保缴费',
                        type: 'line',
                        xAxisIndex: itemCount * 2,
                        yAxisIndex: itemCount * 2,
                        data: $.map(sortedData[index].payed, function (value, time) {
                            return [[time, value.count]]
                        })
                    });

                    options.series.push({
                        name: item + '-暂停缴费',
                        type: 'line',
                        xAxisIndex: itemCount * 2 + 1,
                        yAxisIndex: itemCount * 2 + 1,
                        data: $.map(sortedData[index].paused, function (value, time) {
                            return [[time, value.count]]
                        })
                    });

                    itemCount++;
                }
                this.$refs.socialSecurityDetailChart.style.height = itemCount * 200 + 50 + 'px';
                Util.updateChart(options, this.socialSecurityDetailChartContainer);
            },
            filterLandTax() {
                if (!this.landTaxDetailChartContainer)
                    this.landTaxDetailChartContainer = Util.initChart(this.$refs.landTaxDetailChart);
                this.formLandTaxData();
                var sortedData = $.map(this.landTaxModalData.formedData, function (value, item) {
                    value.name = item;
                    return value;
                }).sort(function (a, b) {
                    return (a.name).localeCompare(b.name)
                });
                var options = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            snap: true,
                        },
                    },
                    title: [],
                    grid: [],
                    xAxis: [],
                    yAxis: [],
                    series: []
                }
                var itemCount = 0;
                for (var index in sortedData) {
                    var item = sortedData[index].name;
                    if (!item || item == 'null') continue;
                    options.title.push({
                        text: item + '-缴税次数',
                        x: '20%',
                        y: itemCount * 200 + 30,
                        textStyle: {
                            fontSize: 14
                        }
                    });
                    options.title.push({
                        text: item + '-缴税金额',
                        x: '70%',
                        y: itemCount * 200 + 30,

                        textStyle: {
                            fontSize: 14
                        }
                    });
                    options.grid.push({
                        x: '50',
                        y: 60 + itemCount * 200,
                        width: '37%',
                        height: '170',
                        containLabel: true
                    });
                    options.grid.push({
                        x: '55%',
                        y: 60 + itemCount * 200,
                        width: '37%',
                        height: '170',
                        containLabel: true
                    });

                    options.xAxis.push({
                        gridIndex: itemCount * 2,
                        type: 'time',
                        name: '时间',
                        splitLine: {show: false},
                        axisLabel: {
                            formatter: function (value, index) {
                                var date = new Date(value);
                                return date.getFullYear() + '-' + (date.getMonth() + 1);
                            }
                        }
                    });
                    options.xAxis.push({
                        gridIndex: itemCount * 2 + 1,
                        type: 'time',
                        name: '时间',
                        splitLine: {show: false},
                        axisLabel: {
                            formatter: function (value, index) {
                                var date = new Date(value);
                                return date.getFullYear() + '-' + (date.getMonth() + 1);
                            }
                        }
                    });
                    options.yAxis.push({gridIndex: itemCount * 2, type: 'value', name: '次数'});
                    options.yAxis.push({gridIndex: itemCount * 2 + 1, type: 'value', name: '金额'});

                    options.series.push({
                        name: item + '-缴税次数',
                        type: 'line',
                        xAxisIndex: itemCount * 2,
                        yAxisIndex: itemCount * 2,
                        data: $.map(sortedData[index].count, function (value, time) {
                            return [[time, value.count]]
                        })
                    });

                    options.series.push({
                        name: item + '-缴税金额',
                        type: 'line',
                        xAxisIndex: itemCount * 2 + 1,
                        yAxisIndex: itemCount * 2 + 1,
                        data: $.map(sortedData[index].amount, function (value, time) {
                            return [[time, value.amount]]
                        })
                    });

                    itemCount++;
                }
                this.$refs.landTaxDetailChart.style.height = itemCount * 200 + 50 + 'px';
                Util.updateChart(options, this.landTaxDetailChartContainer);
            },
            collapseHandleChange(val){
                this.key = this.payListData[val];
            },
            update (){
                var that = this;
                that.$http.post("/api/charts/getDetail", that.querystring.stringify({
                        "name": this.info.name,
                        "key":this.key,
                        "page":this.page,
                        "size":this.size
                    })
                ).then(function (responseData) {
                    that.payData = responseData.data.data;
                    that.total = responseData.data.total;
                })
            }
        }
    }
</script>