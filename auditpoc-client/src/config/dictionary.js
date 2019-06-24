/**
 * Created by songxiaomeng on 2017/7/27.
 */
const FILTER_TYPES = {
    DATE: 'date',
    VALUE: 'value',
    CONTAINS: 'contains'
};
var linkTypes = {
    Own: {
        name: 'Own',
        display: '法人',
        properties: {
            project_year: {
                name: 'project_year',
                display: '业务年度',
                tooltip: true
            },
            regioncode:{
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            source:{
                name: 'source',
                display: '数据来源',
                tooltip: true
            },
            role: {
                name: 'role',
                display: '身份',
                tooltip: true
            }
        },
        filters: [
            {display: '法人', property: 'role', type: FILTER_TYPES.CONTAINS}
        ]
    },
    Serve: {
        name: 'Serve',
        display: '任职',
        properties: {
            project_year: {
                name: 'project_year',
                display: '业务年度',
                tooltip: true
            },
            regioncode:{
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            role: {
                name: 'role',
                display: '身份',
                tooltip: true
            },
            duty: {
                name: 'duty',
                display: '职务',
                tooltip: true
            },
            membership: {
                name: 'membership',
                display: '所属科室',
                tooltip: true
            },
            state: {
                name: 'state',
                display: '人员状态',
                tooltip: true
            },
            jointime: {
                name: 'jointime',
                display: '入职时间',
                tooltip: true
            },
            source: {
                name: 'source',
                display: '数据来源',
                tooltip: true
            },

        },
        filters: [
            {display: '身份', property: 'role', type: FILTER_TYPES.CONTAINS}
        ]
    },
    Kinship: {
        name: 'Kinship',
        display: '婚姻',
        properties: {
            status: {
                name: 'status',
                display: '状态',
                tooltip: true
            },
            time: {
                name: 'time',
                display: '生效日期',
                tooltip: true,
                // date: true

            },
            project_year: {
                name: 'project_year',
                display: '业务年度',
                tooltip: true
            },
            regioncode:{
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            /*orguid:{
                name: 'orguid',
                display: '行政区划',
                tooltip: true
            },*/
            orgname:{
                name: 'orgname',
                display: '登记部门名称',
                tooltip: true
            },
            actiontime:{
                name: 'actiontime',
                display: '操作日期',
                tooltip: true
            },
            state:{
                name: 'state',
                display: '状态',
                tooltip: true
            },
            source:{
                name: 'source',
                display: '数据来源',
                tooltip: true
            },

        },
        filters: [
            /*{display: '状态', property: 'status', type: FILTER_TYPES.CONTAINS},*/
            {display: '生效日期', property: 'date', type: FILTER_TYPES.DATE}
        ]
    },
    Individual: {
        name: 'Individual',
        display: '个人出资',
        properties: {
            project_year: {
                name: 'project_year',
                display: '业务年度',
                tooltip: true
            },
            regioncode:{
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            role: {
                name: 'role',
                display: '职位',
                tooltip: true
            },
            /*percent: {
                name: 'percent',
                display: '出资比例(百分比)',
                decimal: 2,
                tooltip: true
            },*/
            /*'subscribed-amount': {
                name: 'subscribed-amount',
                display: '认缴投资额(万元)',
                tooltip: true
            },*/
            'sub_money':{
                name: 'sub_money',
                display: '认缴投资额(万元)',
                tooltip: true
            },
            'real-amount': {
                name: 'real-amount',
                display: '实际出资额(万元)',
                tooltip: true
            },
            present: {
                name: 'present',
                display: '投资比例(百分比)',
                decimal: 2,
                tooltip: true
            },
            source: {
                name: 'present',
                display: '数据来源',
                decimal: 2,
                tooltip: true
            },
        },
        filters: [
            {display: '职位', property: 'role', type: FILTER_TYPES.CONTAINS},
            {display: '出资比例', property: 'percent', type: FILTER_TYPES.VALUE},
            {display: '认缴投资额', property: 'subscribed-amount', type: FILTER_TYPES.VALUE},
            {display: '实际出资额', property: 'real-amount', type: FILTER_TYPES.VALUE},
        ]
    },
    Enterprise: {
        name: 'Enterprise',
        display: '企业投资',
        properties: {
            project_year: {
                name: 'project_year',
                display: '业务年度',
                tooltip: true
            },
            regioncode: {
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            sub_money: {
                name: 'sub_money',
                display: '认缴出资金额',
                tooltip: true
            },
            'real-amount': {
                name: 'real-amount',
                display: '实际出资额(万元)',
                tooltip: true
            },
            'present': {
                name: 'present',
                display: '投资比例',
                tooltip: true
            },
            'source': {
                name: 'source',
                display: '数据来源',
                tooltip: true
            },
            role: {
                name: 'role',
                display: '职位',
                tooltip: true
            },
            /*percent: {
                name: 'percent',
                display: '出资比例(百分比)',
                decimal: 2,
                tooltip: true
            },*/
            /*'subscribed-amount': {
                name: 'subscribed-amount',
                display: '认缴投资额(万元)',
                tooltip: true
            },*/
            /*'real-amount': {
                name: 'real-amount',
                display: '实际出资额(万元)',
                tooltip: true
            }*/
        },
        filters: [
            {display: '职位', property: 'role', type: FILTER_TYPES.CONTAINS},
            {display: '出资比例', property: 'percent', type: FILTER_TYPES.VALUE},
            {display: '认缴投资额', property: 'subscribed-amount', type: FILTER_TYPES.VALUE},
            {display: '实际出资额', property: 'real-amount', type: FILTER_TYPES.VALUE},
        ]
    },
    Payment: {
        name: 'Payment',
        display: '支付',
        properties: {
            regioncode:{
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            project_year: {
                name: 'project_year',
                display: '业务年度',
                tooltip: true
            },
            budget_year:{
                name: 'budget_year',
                display: '预算年度',
                tooltip: true
            },
            time: {
                name: 'time',
                display: '支付时间',
                tooltip: true,
                // date: true,
                // dateFormat: 'yyyy-MM'
            },
            money: {
                name: 'money',
                display: '支付金额',
                tooltip: true
            },
            tips: {
                name: 'tips',
                display: '经济科目名称',
                tooltip: true
            },
            remark: {
                name: 'remark',
                display: '摘要',
                tooltip: true
            },
            source:{
                name: 'source',
                display: '数据来源',
                tooltip: true
            },

        },
        filters: [
            {display: '金额', property: 'money', type: FILTER_TYPES.VALUE},
            {display: '时间', property: 'time', type: FILTER_TYPES.DATE},
            {display: '摘要', property: 'tips', type: FILTER_TYPES.CONTAINS}
        ]
    },
    Project: {
        name: 'Project',
        display: '项目',
        properties: {
            regioncode:{
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            project_year: {
                name: 'project_year',
                display: '业务年度',
                tooltip: true
            },
            uids: {
                name: 'uids',
                display: '合同流水号',
                tooltip: true
            },
            uid: {
                name: 'uid',
                display: '合同号',
                tooltip: true
            },
            money: {
                name: 'money',
                display: '合同金额',
                tooltip: true
            },
            /*type: {
                name: 'type',
                display: '支付方式',
                tooltip: true
            },*/
            'name': {
                name: 'name',
                display: '项目名称',
                tooltip: true,
            },
            'time': {
                name: 'time',
                display: '批复时间',
                tooltip: true,
            },
            'officecode': {
                name: 'officecode',
                display: '处室代码',
                tooltip: true,
            },
            'officename': {
                name: 'officename',
                display: '处室名称',
                tooltip: true,
            },
            'value': {
                name: 'value',
                display: '金额(万)',
                tooltip: true
            },
            'time_stamp': {
                name: 'time_stamp',
                display: '时间',
                tooltip: true,
                date: true
            },
        },
        filters: [
            {display: '金额(万)', property: 'value', type: FILTER_TYPES.VALUE},
            {display: '时间', property: 'time_stamp', type: FILTER_TYPES.DATE},
            {display: '方式', property: 'type', type: FILTER_TYPES.CONTAINS},
            {display: '名称', property: 'name', type: FILTER_TYPES.CONTAINS}
        ]
    },
    Statement:{
        name:'Statement',
        display: '银行流水',
        properties: {
            tips: {
                name: 'tips',
                display: '摘要',
                tooltip: true
            },
            money: {
                name: 'money',
                display: '金额',
                tooltip: true
            },
            time: {
                name: 'time',
                display: '时间',
                tooltip: true,
                // date: true,
                // dateFormat: 'yyyy-MM'
            }
        },
        filters: [
            {display: '金额', property: 'money', type: FILTER_TYPES.VALUE},
            {display: '时间', property: 'time', type: FILTER_TYPES.DATE},
            {display: '摘要', property: 'tips', type: FILTER_TYPES.CONTAINS}
        ]
    }
};
var nodeTypes = {
    Department: {
        name: 'Department',
        display: '预算单位',
        properties: {
            uid: {
                name: 'uid',
                display: '单位编号',
                tooltip: true
            },
            name: {
                name: 'name',
                display: '单位名称',
                tooltip: true
            },
            orguid: {
                name: 'orguid',
                display: '组织机构代码',
                tooltip: true
            },
            regioncode: {
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            address: {
                name: 'address',
                display: '地址',
                tooltip: true
            },
            source: {
                name: 'source',
                display: '数据来源',
                tooltip: true
            },
        }
    },
    Company: {
        name: 'Company',
        display: '公司',
        properties: {
            regPerson: {
                name: 'regPerson',
                display: '法人',
                tooltip: true
            },
            ctype: {
                name: 'ctype',
                display: '公司类型',
                tooltip: true
            },
            state: {
                name: 'state',
                display: '公司状态',
                tooltip: true
            },
            companyName: {
                name: 'companyName',
                display: '公司名称',
                tooltip: true
            },
            regNum: {
                name: 'regNum',
                display: '注册号',
                tooltip: true
            },
            regPersonId: {
                name: 'regPersonId',
                display: '法人身份证',
                tooltip: true
            },
            scope: {
                name: 'scope',
                display: '经营范围',
                tooltip: true

            },
            time: {
                name: 'time',
                display: '注册时间',
                tooltip: true
            },
            regCapital: {
                name: 'regCapital',
                display: '注册资本(万元)',
                tooltip: true
            },
        },
    },
    Person: {
        name: 'Person',
        display: '人物',
        properties: {
            uid: {
                name: 'uid',
                display: '身份证号',
                tooltip: true
            },
            name: {
                name: 'name',
                display: '姓名',
                tooltip: true
            },
            sex: {
                name: 'sex',
                display: '性别',
                tooltip: true
            },
            birthday: {
                name: 'birthday',
                display: '出生日期',
                tooltip: true
            },
            deathday: {
                name: 'deathday',
                display: '死亡日期',
                tooltip: true
            },
            cremationday: {
                name: 'cremationday',
                display: '火化时间',
                tooltip: true
            },
            address: {
                name: 'address',
                display: '住址',
                tooltip: true
            },
            tel: {
                name: 'tel',
                display: '联系电话',
                tooltip: true
            },
            unitid: {
                name: 'unitid',
                display: '单位编号',
                tooltip: true
            },
            unitname: {
                name: 'unitname',
                display: '单位名称',
                tooltip: true
            },
            isprovide: {
                name: 'isprovide',
                display: '是否供养人员',
                tooltip: true
            },
            ismls: {
                name: 'ismls',
                display: '是否低保人员',
                tooltip: true
            },
            mlsid: {
                name: 'mlsid',
                display: '低保人员户号',
                tooltip: true
            },
            ispoverty: {
                name: 'ispoverty',
                display: '是否贫困人口',
                tooltip: true
            },
            povertypid: {
                name: 'povertypid',
                display: '贫困人口编号',
                tooltip: true
            },
            povertyfid: {
                name: 'povertyfid',
                display: '贫困户号',
                tooltip: true
            },
            regioncode: {
                name: 'regioncode',
                display: '行政区划',
                tooltip: true
            },
            source: {
                name: 'source',
                display: '数据来源',
                tooltip: true
            },
        }
    },
    Account:{
        name:'Account',
        display: '银行账户'
    }
};
var dictionary = {
    linkTypes: linkTypes,
    nodeTypes: nodeTypes
};
export default dictionary;