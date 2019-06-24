var data = syncReadCsv('./static/data/shouru3.csv');
var dataArray = [];
var dataArray1 = [];
var dataArray2 = [];
var zhifudata = syncReadCsv('./static/data/按功能支出.csv');
zhifudata.forEach(function (d) {
    d.预算执行率 = (0.4 * Math.random() + 0.2) * 100
    var darr1 = [];
    for (var key in d) {
        var o1 = {
            key: key,
            value: +d[key]
        }
        darr1.push(o1);
    }
    dataArray1.push(darr1)
});
var zhifudata2 = syncReadCsv('./static/data/按支出性质支出.csv');
zhifudata2.forEach(function (d) {
    d.预算执行率 = (0.4 * Math.random() + 0.2) * 100
    var darr2 = [];
    for (var key in d) {
        var o1 = {
            key: key,
            value: +d[key]
        }
        darr2.push(o1);
    }
    dataArray2.push(darr2)
});
var zhifudata7 = syncReadCsv('./static/data/六项费用.csv');

//format数据，只保留两位小数点
data.forEach(function (d) {
    d.预算执行率 = (0.4 * Math.random() + 0.2) * 100
    var darr = [];
    for (var key in d) {
        var o = {
            key: key,
            value: +d[key]
        }
        darr.push(o);
    }
    dataArray.push(darr)
})


var 总金额 = 0;
data.forEach(function (d) {
    d.支付金额 = +d.支付金额 / 10000;
    总金额 += d.支付金额
})


/**
 * Echarts部分
 */
var dom = document.getElementById('spent0910');
var myChart = this.$echarts.init(dom);
var option = {
    title: [{
        text: '收入决算表',
        x: '13%',
        y: '8%',
        textStyle: {
            fontSize: 16,
            fontWeight: 'bolder'
        }
    },
        {
            text: '支出结算表（按功能分类）',
            x: '40%',
            y: '8%',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bolder'
            }
        },
        {
            text: '支出决算表（按支出性质分类)',
            x: '75%',
            y: '8%',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bolder'
            }
        }],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },

    },
    legend: {
        data: ['决算数', '年初预算数', '调整预算数']
    },
    grid: [{
        // top:'70',
        left: 30,
        containLabel: true,
        width: '29%',
    },
        {
            width: '29%',
            left: '33%',
            // top:70,
            containLabel: true,
        },
        {
            width: '29%',
            left: '66%',
            // top:70,
            containLabel: true,
        }
    ],
    xAxis: [{
        data: [],
        axisLabel: {
            show: true,
            interval: 0,
            rotate: 60
        },
        axisTick: {
            show: false
        }
    },
        {
            data: [],
            gridIndex: 1,
            axisLabel: {
                show: true,
                interval: 0,
                rotate: 60
            },
            axisTick: {
                show: false
            }
        },
        {
            data: [],
            gridIndex: 2,
            axisLabel: {
                show: true,
                interval: 0,
                rotate: 60
            },
            axisTick: {
                show: false
            }
        }],
    yAxis: [{
        type: 'value'
    },
        {
            type: 'value',
            gridIndex: 1
        },
        {
            type: 'value',
            gridIndex: 2
        }],
    series: []
}


//option5

var dom5 = document.getElementById('spent0915');
var myChart5 = this.$echarts.init(dom5);
var option5 = {
    title: {
        text: '六项费用',
        x: '42%',
        y: '8%',
        textStyle: {
            fontSize: 16,
            fontWeight: 'bolder'
        }
    },
    grid: {containLabel: true},
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['会议费', '公务接待费', '公务用车运行维护费', '办公费', '因公出国（境）费用', '培训费', '差旅费']
    },
    xAxis: {
        data: [],
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
    series: []
}

//左侧目录的单击事件
export function clickUnit(d) {
    var zc = document.getElementById('zc');
    var name = d;
    var finnalArray = [];
    var finnalArray1 = [];
    var finnalArray2 = [];
    var finnalArray7 = [];
    zc.style.display = "block";
    data.forEach(function (d1, i1) {
        if (name == d1.单位名称) {
            dataArray[i1].forEach(function (d2, i2) {
                if (d2.key.indexOf("年初预算数") > 0 && i2 < dataArray[i1].length - 2 && dataArray[i1][i2 + 1].key.indexOf('调整预算数') > 0 && dataArray[i1][i2 + 2].key.indexOf('决算数') > 0 &&
                    d2.value > 0 && dataArray[i1][i2 + 1].value > 0 && dataArray[i1][i2 + 2].value > 0) {
                    var o = {
                        key: d2.key.split(' ')[0],
                        value: [d2.value, dataArray[i1][i2 + 1].value, dataArray[i1][i2 + 2].value]
                    }
                    finnalArray.push(o);
                }
            })
        }

    })
    option.xAxis[0].data = finnalArray.map(function (d) {
        return d.key
    })
    option.legend.data.forEach(function (d, i) {
        option.series[i] = {
            name: d,
            type: 'bar',
            silent: true,
            //    xAxisIndex:1,
            //    yAxisIndex:1
            data: finnalArray.map(function (e) {
                return e.value[i]
            })
        }

    })


    zhifudata.forEach(function (d1, i1) {
        if (name == d1.单位名称) {
            dataArray1[i1].forEach(function (d2, i2) {
                if (d2.key.indexOf("年初预算数") > 0 && i2 < dataArray1[i1].length - 2 && dataArray1[i1][i2 + 1].key.indexOf('调整预算数') > 0 && dataArray1[i1][i2 + 2].key.indexOf('决算数') > 0 &&
                    d2.value > 0 && dataArray1[i1][i2 + 1].value > 0 && dataArray1[i1][i2 + 2].value > 0) {
                    var o = {
                        key: d2.key.split(' ')[0],
                        value: [d2.value, dataArray1[i1][i2 + 1].value, dataArray1[i1][i2 + 2].value]
                    }
                    finnalArray1.push(o);
                }
            })
        }

    })
    option.xAxis[1].data = finnalArray1.map(function (d) {
        return d.key
    })
    option.legend.data.forEach(function (d, i) {
        option.series[i + 3] = {
            name: d,
            type: 'bar',
            silent: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: finnalArray1.map(function (e) {
                return e.value[i]
            })
        }

    })


    zhifudata2.forEach(function (d1, i1) {
        if (name == d1.单位名称) {
            dataArray2[i1].forEach(function (d2, i2) {
                if (d2.key.indexOf("年初预算数") > 0 && i2 < dataArray2[i1].length - 2 && dataArray2[i1][i2 + 1].key.indexOf('调整预算数') > 0 && dataArray2[i1][i2 + 2].key.indexOf('决算数') > 0 &&
                    d2.value > 0 && dataArray2[i1][i2 + 1].value > 0 && dataArray2[i1][i2 + 2].value > 0) {
                    var o = {
                        key: d2.key.split(' ')[0],
                        value: [d2.value, dataArray2[i1][i2 + 1].value, dataArray2[i1][i2 + 2].value]
                    }
                    finnalArray2.push(o);
                }
            })
        }

    })
    option.xAxis[2].data = finnalArray2.map(function (d) {
        return d.key
    })
    option.legend.data.forEach(function (d, i) {
        option.series[i + 6] = {
            name: d,
            type: 'bar',
            silent: true,
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: finnalArray2.map(function (e) {
                return e.value[i]
            })
        }

    })

    zhifudata7.forEach(function (d1) {
        if (name == d1.单位名称) {
            var o = {
                key: d1['项目#支出功能分类科目编码#类1'],
                value: [
                    +d1['商品和服务支出#会议费'],
                    +d1['商品和服务支出#公务接待费'],
                    +d1['商品和服务支出#公务用车运行维护费'],
                    +d1['商品和服务支出#办公费'],
                    +d1['商品和服务支出#因公出国（境）费用'],
                    +d1['商品和服务支出#培训费'],
                    +d1['商品和服务支出#差旅费'],
                ]
            }
            finnalArray7.push(o)
        }

    })
    option5.xAxis.data = finnalArray7.map(function (d) {
        return d.key
    })

    option5.legend.data.forEach(function (d, i) {
        option5.series[i] = {
            name: d,
            type: 'bar',
            silent: true,
            // xAxisIndex:2,
            // yAxisIndex:2,
            data: finnalArray7.map(function (e) {
                return e.value[i]
            })
        }

    })


    myChart.setOption(option)
    myChart5.setOption(option5)
}

function syncReadCsv(url) {
    var response = [];
    $.ajax({
        url: url,
        async: false,
        success: function (result) {
            var array = result.split('\n');
            var header = array[0].split(',');
            array.shift();
            if (!array[array.length - 1]) array.pop();
            $.each(array, function (index, data) {
                var dataArr = data.split(',');
                var o = {};
                $.each(header, function (index, value) {
                    o[value] = dataArr[index];
                });
                response.push(o);
            });
        }
    });
    return response;
}
