<template>
    <div class="layout">
        <div class="layout-content" style="padding: 20px 40px 0 40px">
            <div class="macroContainer" style="background-color: #F7F7F9">
                <!--<div class="container">-->
                    <div class="row" style="margin:20px 0 30px 0;">
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="serveRole" style="width: 300px;height: 350px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="companyTimeMonth" style="width: 300px;height: 350px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="projectAmount" style="width: 300px;height: 350px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin:20px 0 30px 0;">
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="serveDuty" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="companyStatus" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="projectYear" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin:20px 0 30px 0;">
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="paymentAmount" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="paymentTimeMonth" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="serveSex" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin:20px 0 30px 0;">
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="replyTimeYear" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="companyAmount" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="replyTimeMonth" style="width: 300px;height: 300px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin:20px 0 30px 0;">
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="companyType" style="width: 300px;height: 350px;"></div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div class="rowMargin">
                                <div ref="companyTimeYear" style="width: 300px;height: 350px;"></div>
                            </div>
                        </div>
                    </div>
                <!--</div>-->
            </div>
        </div>

    </div>
</template>
<style>
    .rowMargin{
        box-shadow: 0 2px 7px #ddd;
        position: relative;
        -webkit-transition: -webkit-transform .2s ease-in-out;
        background-color: #fff;
    }
</style>
<style scoped src="../assets/bootstrap.min.css">
</style>
<script>
    import copy from './copy.vue';
    import Util from '../libs/util';
    import searchBar from '../components/paginationSearchBar.vue';

    export default {
        mounted() {
            var that = this;
            that.$http.post("/api/charts/macroscopic", that.querystring.stringify({}))
                .then(response => {
                    if(response.status == 200){
                        if(response.data.data){
                        if(response.data.data.serve_role != "") {
                            var serveRoleData = [];
                            var serveRoleResponse = response.data.data.serve_role;
                            serveRoleResponse.forEach(function (item,index,arr) {
                                serveRoleData.push({
                                    name: arr[index].types,
                                    value :arr[index].num
                                })
                            })
                            var serveRoleX = [];
                            serveRoleResponse.forEach(function (item,index,arr) {
                                serveRoleX.push(arr[index].types)
                            })
                            let serveRoleContainer = Util.initChart(that.$refs.serveRole);
                            serveRoleContainer.setOption({
                                title: {
                                    text: '人员身份统计',
                                    left: 'center'
                                },
                                color: ['#434348','#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80'],
                                tooltip : {
                                    trigger: 'item',
                                    formatter: "人员身份：{b}<br/> 人员数量：{c}<br> 该人员身份所占百分比：{d}%"
                                },
                                legend: {
                                    bottom:2,
                                    left: 'center',
                                    data: serveRoleX
                                },
                                series: [
                                    {
                                        type: 'pie',
                                        radius: '65%',
                                        center: ['50%','50%'],
                                        selectedMode: 'single',
                                        data: serveRoleData,
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            },
                                            normal: {
                                                label: {
                                                    show: false
                                                },
                                                labelLine: {
                                                    show: false
                                                }
                                            }
                                        }
                                    },
                                ]
                            })
                        }
                        if(response.data.data.serve_sex != "") {
                            var serveSexData = [];
                            var serveSexResponse = response.data.data.serve_sex;
                            serveSexResponse.forEach(function (item,index,arr) {
                                serveSexData.push({
                                    name: arr[index].types,
                                    value :arr[index].num
                                })
                            })
                            var serveSexX = [];
                            serveSexResponse.forEach(function (item,index,arr) {
                                serveSexX.push(arr[index].types)
                            })
                            let serveSexContainer = Util.initChart(that.$refs.serveSex);
                            serveSexContainer.setOption({
                                title: {
                                    text: '性别统计',
                                    left: 'center'
                                },
                                color: ['#434348','#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80'],
                                tooltip : {
                                    trigger: 'item',
                                    formatter: "性别：{b}<br/> 人员数量：{c}<br> 所占百分比：{d}%"
                                },
                                legend: {
                                    bottom:10,
                                    left: 'center',
                                    data: serveSexX
                                },
                                series: [
                                    {
                                        type: 'pie',
                                        radius: '65%',
                                        center: ['50%','50%'],
                                        selectedMode: 'single',
                                        data: serveSexData,
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            },
                                            normal: {
                                                label: {
                                                    show: false
                                                },
                                                labelLine: {
                                                    show: false
                                                }
                                            }
                                        }
                                    },
                                ]
                            })
                        }
                        if(response.data.data.payment_time_month != "") {
                            var paymentTimeMonthResponse = response.data.data.payment_time_month;
                            var paymentTimeMonthX = [];
                            paymentTimeMonthResponse.forEach(function (item,index,arr) {
                                paymentTimeMonthX.push(arr[index].types)
                            })
                            var paymentTimeMonthY = [];
                            paymentTimeMonthResponse.forEach(function (item,index,arr) {
                                paymentTimeMonthY.push(Number(arr[index].num))
                            })
                            let paymentTimeMonthContainer = Util.initChart(that.$refs.paymentTimeMonth);
                            paymentTimeMonthContainer.setOption({
                                title: {
                                    text: '支付日期',
                                    left: 'center'
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params) {
                                        return '日期：'+ params[0].axisValue +'<br/>支付金额：'+params[0].data+'元';
                                    }
                                },
                                legend: {
                                    data: paymentTimeMonthX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: paymentTimeMonthX,
                                    axisLabel: {
                                        show: true,
                                        interval: 0,
                                        rotate: 40
                                    },
                                    axisLine: {
                                        lineStyle: {
                                            color: '#666'
                                        }
                                    }
                                },
                                yAxis: {
                                    type: 'value',
                                    axisLine: {
                                        lineStyle: {
                                            color: '#666'
                                        }
                                    }
                                },
                                grid: {
                                    left: 64
                                },
                                series: [{
                                    data: paymentTimeMonthY,
                                    type: 'line',
                                    color: '#7CB5EC',
                                    itemStyle: {
                                        normal: {
                                            color: '#7CB5EC',
                                            lineStyle: {
                                                color: '#7CB5EC',
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.serve_duty != ""){
                            var serveDutyResponse = response.data.data.serve_duty;
                            var serveDutyX = [];
                            serveDutyResponse.forEach(function (item,index,arr) {
                                serveDutyX.push(arr[index].types)
                            })
                            var serveDutyY = [];
                            serveDutyResponse.forEach(function (item,index,arr) {
                                serveDutyY.push(Number(arr[index].num))
                            })
                            let serveDutyContainer = Util.initChart(that.$refs.serveDuty);
                            serveDutyContainer.setOption({
                                title: {
                                    text: '职务（职称）统计',
                                    left: 'center'
                                },
                                legend: {
                                    data: serveDutyX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: serveDutyX,
                                    axisLabel: {
                                        show: true,
                                        interval: 3,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type : 'shadow'
                                    },
                                    formatter: '职务名称：{b} <br />人数：{c0}<br />'
                                },
                                series: [{
                                    data: serveDutyY,
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: function (params) {
                                                var colorList = ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#E4D354','#2B908F','#F45B5B','#91E8E1'];
                                                return colorList[params.dataIndex%9];
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.company_amount != ""){
                            var companyAmountResponse = response.data.data.company_amount;
                            var companyAmountX = [];
                            companyAmountResponse.forEach(function (item,index,arr) {
                                companyAmountX.push(arr[index].types)
                            })
                            var companyAmountY = [];
                            companyAmountResponse.forEach(function (item,index,arr) {
                                companyAmountY.push(Number(arr[index].num))
                            })
                            let companyAmountContainer = Util.initChart(that.$refs.companyAmount);
                            companyAmountContainer.setOption({
                                title: {
                                    text: '工商注册资金金额',
                                    left: 'center'
                                },
                                legend: {
                                    data: companyAmountX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: companyAmountX,
                                    axisLabel: {
                                        show: true,
                                        interval: 3,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 80
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type : 'shadow'
                                    },
                                    formatter: '金额区间：{b} <br />数量：{c0}<br />'
                                },
                                series: [{
                                    data: companyAmountY,
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: function (params) {
                                                var colorList = ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#E4D354','#2B908F','#F45B5B','#91E8E1'];
                                                return colorList[params.dataIndex%9];
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.project_year != "") {
                            var projectYearResponse = response.data.data.project_year;
                            var projectYearX = [];
                            projectYearResponse.forEach(function (item,index,arr) {
                                projectYearX.push(arr[index].types)
                            })
                            var projectYearY = [];
                            projectYearResponse.forEach(function (item,index,arr) {
                                projectYearY.push(Number(arr[index].num))
                            })
                            let projectYearContainer = Util.initChart(that.$refs.projectYear);
                            projectYearContainer.setOption({
                                title: {
                                    text: '关系业务年度统计',
                                    left: 'center'
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params) {
                                        return '日期：'+ params[0].axisValue +'<br/>金额：'+params[0].data+'元';
                                    }
                                },
                                legend: {
                                    data: projectYearX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: projectYearX,
                                    axisLabel: {
                                        show: true,
                                        interval: 0,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                series: [{
                                    data: projectYearY,
                                    type: 'line',
                                    color: '#7CB5EC',
                                    itemStyle: {
                                        normal: {
                                            color: '#7CB5EC',
                                            lineStyle: {
                                                color: '#7CB5EC',
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.project_amount != ""){
                            var projectAmountResponse = response.data.data.project_amount;
                            var projectAmountX = [];
                            projectAmountResponse.forEach(function (item,index,arr) {
                                projectAmountX.push(arr[index].types)
                            })
                            var projectAmountY = [];
                            projectAmountResponse.forEach(function (item,index,arr) {
                                projectAmountY.push(Number(arr[index].num))
                            })
                            let projectAmountContainer = Util.initChart(that.$refs.projectAmount);
                            projectAmountContainer.setOption({
                                title: {
                                    text: '合同金额',
                                    left: 'center'
                                },
                                legend: {
                                    data: projectAmountX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: projectAmountX,
                                    axisLabel: {
                                        show: true,
                                        interval: 3,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type : 'shadow'
                                    },
                                    formatter: '金额区间：{b} <br />数量：{c0}<br />'
                                },
                                series: [{
                                    data: projectAmountY,
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: function (params) {
                                                var colorList = ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#E4D354','#2B908F','#F45B5B','#91E8E1'];
                                                return colorList[params.dataIndex%9];
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.company_type != "") {
                            var companyTypeData = [];
                            var companyTypeResponse = response.data.data.company_type;
                            companyTypeResponse.forEach(function (item,index,arr) {
                                companyTypeData.push({
                                    name: arr[index].types,
                                    value :arr[index].num
                                })
                            })
                            var companyTypeX = [];
                            companyTypeResponse.forEach(function (item,index,arr) {
                                companyTypeX.push(arr[index].types)
                            })
                            let companyTypeContainer = Util.initChart(that.$refs.companyType);
                            companyTypeContainer.setOption({
                                title: {
                                    text: '工商表企业类型统计',
                                    left: 'center'
                                },
                                color: ['#434348','#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80'],
                                tooltip : {
                                    trigger: 'item',
                                    formatter: "企业类型：{b}<br/> 该企业类型数量：{c} <br/>该企业类型数量所占百分比：{d}%"
                                },
                                legend: {
                                    bottom:2,
                                    left: 'center',
                                    data: companyTypeX
                                },
                                series: [
                                    {
                                        type: 'pie',
                                        radius: '65%',
                                        center: ['50%','50%'],
                                        selectedMode: 'single',
                                        data: companyTypeData,
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            },
                                            normal: {
                                                label: {
                                                    show: false
                                                },
                                                labelLine: {
                                                    show: false
                                                }
                                            }
                                        }
                                    },
                                ]
                            })
                        }
                        if(response.data.data.company_time_month != "") {
                            var companyTimeMonthResponse = response.data.data.company_time_month;
                            var companyTimeMonthX = [];
                            companyTimeMonthResponse.forEach(function (item,index,arr) {
                                companyTimeMonthX.push(arr[index].types)
                            })
                            var companyTimeMonthY = [];
                            companyTimeMonthResponse.forEach(function (item,index,arr) {
                                companyTimeMonthY.push(Number(arr[index].num))
                            })
                            let companyTimeMonthContainer = Util.initChart(that.$refs.companyTimeMonth);
                            companyTimeMonthContainer.setOption({
                                title: {
                                    text: '企业成立时间统计(按月统计)',
                                    left: 'center'
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params) {
                                        return '日期：'+ params[0].axisValue +'<br/>企业成立数量：'+params[0].data+'个';
                                    }
                                },
                                legend: {
                                    data: companyTimeMonthX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: companyTimeMonthX,
                                    axisLabel: {
                                        show: true,
                                        interval: 10,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                series: [{
                                    data: companyTimeMonthY,
                                    type: 'line',
                                    color: '#7CB5EC',
                                    itemStyle: {
                                        normal: {
                                            color: '#7CB5EC',
                                            lineStyle: {
                                                color: '#7CB5EC',
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.payment_amount != ""){
                            var paymentAmountResponse = response.data.data.payment_amount;
                            var paymentAmountX = [];
                            paymentAmountResponse.forEach(function (item,index,arr) {
                                paymentAmountX.push(arr[index].types)
                            })
                            var paymentAmountY = [];
                            paymentAmountResponse.forEach(function (item,index,arr) {
                                paymentAmountY.push(Number(arr[index].num))
                            })
                            let paymentAmountContainer = Util.initChart(that.$refs.paymentAmount);
                            paymentAmountContainer.setOption({
                                title: {
                                    text: '支付表的支付金额',
                                    left: 'center'
                                },
                                legend: {
                                    data: paymentAmountX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: paymentAmountX,
                                    axisLabel: {
                                        show: true,
                                        interval: 2,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type : 'shadow'
                                    },
                                    formatter: '金额区间：{b} <br />数量：{c0}<br />'
                                },
                                series: [{
                                    data: paymentAmountY,
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: function (params) {
                                                var colorList = ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#E4D354','#2B908F','#F45B5B','#91E8E1'];
                                                return colorList[params.dataIndex%9];
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.reply_time_month != "") {
                            var replyTimeMonthResponse = response.data.data.reply_time_month;
                            var replyTimeMonthX = [];
                            replyTimeMonthResponse.forEach(function (item,index,arr) {
                                replyTimeMonthX.push(arr[index].types)
                            })
                            var replyTimeMonthY = [];
                            replyTimeMonthResponse.forEach(function (item,index,arr) {
                                replyTimeMonthY.push(Number(arr[index].num))
                            })
                            let replyTimeMonthContainer = Util.initChart(that.$refs.replyTimeMonth);
                            replyTimeMonthContainer.setOption({
                                title: {
                                    text: '关系批复时间统计(按月统计)',
                                    left: 'center'
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params) {
                                        return '日期：'+ params[0].axisValue +'<br/>企业成立数量：'+params[0].data+'次';
                                    }
                                },
                                legend: {
                                    data: replyTimeMonthX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: replyTimeMonthX,
                                    axisLabel: {
                                        show: true,
                                        interval: 10,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                series: [{
                                    data: replyTimeMonthY,
                                    type: 'line',
                                    color: '#7CB5EC',
                                    itemStyle: {
                                        normal: {
                                            color: '#7CB5EC',
                                            lineStyle: {
                                                color: '#7CB5EC',
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.company_status != "") {
                            var companyStatusData = [];
                            var companyStatusResponse = response.data.data.company_status;
                            companyStatusResponse.forEach(function (item,index,arr) {
                                companyStatusData.push({
                                    name: arr[index].types,
                                    value :arr[index].num
                                })
                            })
                            var companyStatusX = [];
                            companyStatusResponse.forEach(function (item,index,arr) {
                                companyStatusX.push(arr[index].types)
                            })
                            let companyStatusContainer = Util.initChart(that.$refs.companyStatus);
                            companyStatusContainer.setOption({
                                title: {
                                    text: '企业状态统计',
                                    left: 'center'
                                },
                                color: ['#434348','#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80'],
                                tooltip : {
                                    trigger: 'item',
                                    formatter: "企业状态：{b}<br> 该企业状态企业数量：{c}<br> 该企业状态企业数量所占百分比：{d}%"
                                },
                                legend: {
                                    bottom:2,
                                    left: 'center',
                                    data: companyStatusX
                                },
                                series: [
                                    {
                                        type: 'pie',
                                        radius: '65%',
                                        center: ['50%','50%'],
                                        selectedMode: 'single',
                                        data: companyStatusData,
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            },
                                            normal: {
                                                label: {
                                                    show: false
                                                },
                                                labelLine: {
                                                    show: false
                                                }
                                            }
                                        }
                                    },
                                ]
                            })
                        }
                        if(response.data.data.reply_time_year != "") {
                            var replyTimeYearResponse = response.data.data.reply_time_year;
                            var replyTimeYearX = [];
                            replyTimeYearResponse.forEach(function (item,index,arr) {
                                replyTimeYearX.push(arr[index].types)
                            })
                            var replyTimeYearY = [];
                            replyTimeYearResponse.forEach(function (item,index,arr) {
                                replyTimeYearY.push(Number(arr[index].num))
                            })
                            let replyTimeYearContainer = Util.initChart(that.$refs.replyTimeYear);
                            replyTimeYearContainer.setOption({
                                title: {
                                    text: '关系批复时间统计（按年统计）',
                                    left: 'center'
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params) {
                                        return '日期：'+ params[0].axisValue +'<br/>企业成立数量：'+params[0].data+'次';
                                    }
                                },
                                legend: {
                                    data: replyTimeYearX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: replyTimeYearX,
                                    axisLabel: {
                                        show: true,
                                        interval: 0,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                series: [{
                                    data: replyTimeYearY,
                                    type: 'line',
                                    color: '#7CB5EC',
                                    itemStyle: {
                                        normal: {
                                            color: '#7CB5EC',
                                            lineStyle: {
                                                color: '#7CB5EC',
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        if(response.data.data.company_time_year != "") {
                            var companyTimeYearResponse = response.data.data.company_time_year;
                            var companyTimeYearX = [];
                            companyTimeYearResponse.forEach(function (item,index,arr) {
                                companyTimeYearX.push(arr[index].types)
                            })
                            var companyTimeYearY = [];
                            companyTimeYearResponse.forEach(function (item,index,arr) {
                                companyTimeYearY.push(Number(arr[index].num))
                            })
                            let companyTimeYearContainer = Util.initChart(that.$refs.companyTimeYear);
                            companyTimeYearContainer.setOption({
                                title: {
                                    text: '企业成立时间统计(按年统计)',
                                    left: 'center'
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params) {
                                        return '日期：'+ params[0].axisValue +'<br/>企业成立数量：'+params[0].data+'个';
                                    }
                                },
                                legend: {
                                    data: companyTimeYearX
                                },
                                xAxis: {
                                    type: 'category',
                                    data: companyTimeYearX,
                                    axisLabel: {
                                        show: true,
                                        interval: 0,
                                        rotate: 40
                                    },
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                grid: {
                                    left: 64
                                },
                                series: [{
                                    data: companyTimeYearY,
                                    type: 'line',
                                    color: '#7CB5EC',
                                    itemStyle: {
                                        normal: {
                                            color: '#7CB5EC',
                                            lineStyle: {
                                                color: '#7CB5EC',
                                            }
                                        }
                                    }
                                }]
                            })
                        }
                        }
                    }
                })
        },
        watch: {

        },
        components: {
            'layout-copy': copy,
            'search-bar': searchBar
        },
        data() {
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
            }
        },
        methods: {
        }
    };
</script>