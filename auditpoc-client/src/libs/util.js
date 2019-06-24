import axios from 'axios';
import env from '../config/env';
import echarts from 'echarts';

let util = {};
/**
 * 新建echarts实例
 * @param container
 * @returns {*}
 */
util.initChart = function (container) {
    var myChart = echarts.init(container);
    return myChart;
};
/**
 * 根据实例更新echarts数据
 * @param options
 * @param echartInstance
 */
util.updateChart = function (options, echartInstance) {
    echartInstance.resize('100%', '100%');
    echartInstance.setOption(options);
};

/**
 * 设置网页title
 * @param title
 */
util.title = function (title) {
    title = title ? '智能审计分析系统' + ' - ' + title : '';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8888' :
    env === 'production' ?
        '' :
        'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
});


/**
 *检验输入是否符合十八位身份证格式
 * @param str
 * @returns {boolean}
 */
util.testPersonUid = function (str) {
    /*var reg = /(\d{18})|(\d{17}(X|x))/;*/
    var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    var reg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
    return str.search(reg)>=0||str.search(reg2)>=0;
};

/**
 * 将yyyy-mm格式的string转换成date
 * @param str
 * @returns {Date}
 */
util.formDate = function (str) {
    var date = new Date(0);
    date.setFullYear(str.split('-')[0], str.split('-')[1] - 1, 1);
    return date;
};
Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
export default util;