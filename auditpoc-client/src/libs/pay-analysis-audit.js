//关于列表不能跟随刷新
//①用同一个crossfilter
//②在同一个方法内render
//933行，51行
    var originData,
	chunkData,
    unitList,
    bubbleChart,
    bubbleChartDim,
    bubbleChartGroup,
    pie1,
    pie2,
    pie3,
    pie4,
    pie1ChartDim,
    pie2ChartDim,
    pie3ChartDim,
    pie4ChartDim,
    pie5ChartDim,
    pie6ChartDim,
    pie7ChartDim,
    pie4ChartDim,

    pie1ChartGroup,
    pie2ChartGroup,
    pie3ChartGroup,
    pie4ChartGroup,
    pie5ChartGroup,
    pie6ChartGroup,
    pie7ChartGroup,
    pie8ChartGroup,
    bar1,
    pie9,
    row1,
    row1ChartDim,
    row1ChartGroup,
    total=0,
    accountType=["借方发生额","贷方发生额"],
    i=1,
    _type=accountType[0],
    curCityName="省本级",
    pifuNames=["一季度批复","二季度批复","三季度批复","四季度批复"],
    zhifuNames=["一季度支出","二季度支出","三季度支出","四季度支出"],
    biliNames=["前三季度支付比例","第四季度支付比例"];
    export const proType=["季度批复","季度支出","支付比例"];
	var curUnitName=localStorage.getItem("selectedFromIndex5");

    var heatChart,heatOption,x,y,heatOriginData,heatData=[],curClass="支付方式名称",heatGroup
    var scale;
    var tmpData;
    var cf;
    var dataTable;
    var originTableData;

    var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width = 300 - margin.left - margin.right,
    barHeight = 20,
    barWidth = width * .8;

    var i = 0,
    duration = 400,
    root;

    var tree = d3.layout.tree()
        .nodeSize([0, 20]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("#leftlist").append("svg")
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var numberFormat = d3.format('.0f');
    var numberFormat2 = d3.format('.8f');
    var numberFormat3 = d3.format('.5f');
    initLeftList();
    window.onunload=function(){
        localStorage.setItem("selectedFromIndex5",null);
    }
    if (curUnitName!= "null" && curUnitName!= null) {
    getDetailJson(curUnitName);
    getProjectJson(curUnitName,proType[0]);
    d3.select("#rightArea").style({"visibility":"visible"});
    d3.select("#饼图").style({"visibility":"visible"});
    d3.select("#热力图").style({"visibility":"visible"});
    d3.select('#总体分析').text(curUnitName);

}

$('#myTabs a').click(function(e){
    e.preventDefault();
    $(this).tab('show')
    var name = e.toElement.innerHTML;
    if (name == "总体分析") {
        initDataTable(originTableData)
    }
})
function getPropData(){

}
function initBubbleChart(type){

    bubbleChart = dc.bubbleChart('#bubbleChart');
    bubbleChart
        .height(350)
        .width(990)
        .transitionDuration(1700)
        .margins({top:10,right:10,bottom:40,left:40})
        .dimension(bubbleChartDim)
        .group(bubbleChartGroup)
        // .rangeChart(volumeChart)
        .colors(d3.scale.category20())
        .colorDomain([0,20000])
        .colorAccessor(function(p){
            return p.value.二三级总支出数
        })
        .keyAccessor(function (p) {
            return p.value.二三级总支出数;
        })
        .valueAccessor(function (p) {
            return p.value.二三级总完成率;
        })
        .radiusValueAccessor(function (p) {
            return p.value.二三级总完成率;
        })
        .maxBubbleRelativeSize(0.05)
        .x(d3.scale.linear().domain(getPropX(bubbleChartGroup)))
        .y(d3.scale.linear().domain(getPropY(bubbleChartGroup)))
        .r(d3.scale.linear().domain([0,10]))
        //决定是否需要坐标重新调整以适应数据
        .elasticY(true)
        .elasticX(true)
        .elasticRadius(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .xAxisLabel('各单位支出总额 元')
        .yAxisLabel('占比 ')
        // .renderLabel(true)
        // .label(function (p) {
        //     return p.key;
        // })
        .renderTitle(true)
        .title(function (p) {

            return [
                p.name,
                '预算项目：' + p.key,
                '支付金额: ' + numberFormat3(p.value.二三级总支出数),
                '预算执行率: ' + numberFormat3(p.value.二三级总完成率)*100 + '%',
            ].join('\n');
        })
        .yAxis().tickFormat(function (v) {
        return v ;
    });
    bubbleChart.on('filtered',function(d,name){
        getDetailJson(name)
        $("#总体分析").text(name)
    })
    bubbleChart.render();


}
function getPropX(group){
    var all = group.all();
    var arr = all.map(function(d){return +d.value.二三级总支出数})
    var sortedArr = arr.sort();
    var dist = (sortedArr[0] - sortedArr[sortedArr.length - 1])/100
    return [sortedArr[sortedArr.length - 1]-dist,sortedArr[0]+dist]
}
function getPropY(group){
    var all = group.all();
    var arr = all.map(function(d){return +d.value.二三级总完成率})
    var sortedArr = arr.sort();
    var dist = (sortedArr[0] - sortedArr[sortedArr.length - 1])/10
    return [sortedArr[0]+dist,sortedArr[sortedArr.length - 1]-dist]
}
function initPieGroup(){
    pie1 = dc.pieChart('#pie1');
    pie2 = dc.pieChart('#pie2');
    pie3 = dc.pieChart('#pie3');
    pie4 = dc.pieChart('#pie4');
    pie5 = dc.pieChart('#pie5');
    pie6 = dc.pieChart('#pie6');
    pie7 = dc.pieChart('#pie7');
    pie8 = dc.pieChart('#pie8');
    pie1
        .width(180)
        .radius(90)
        .dimension(pie1ChartDim)
        .group(pie1ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie2
        .width(180)
        .radius(90)
        .dimension(pie2ChartDim)
        .group(pie2ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie3
        .width(180)
        .radius(90)
        .dimension(pie3ChartDim)
        .group(pie3ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie4
        .width(180)
        .radius(90)
        .dimension(pie4ChartDim)
        .group(pie4ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie5
        .width(180)
        .radius(90)
        .dimension(pie5ChartDim)
        .group(pie5ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie6
        .width(180)
        .radius(90)
        .dimension(pie6ChartDim)
        .group(pie6ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie7
        .width(180)
        .radius(90)
        .dimension(pie7ChartDim)
        .group(pie7ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie8
        .width(180)
        .radius(90)
        .dimension(pie8ChartDim)
        .group(pie8ChartGroup)
        .renderLabel(true)
        .label(function(d){
            var label = d.key;
            return label;
        })
        .renderTitle(true)
        .title(function (p) {
            return [
                p.key,
                '支付金额: ' + numberFormat(p.value),
            ].join('\n');
        })
    pie1.render();
    pie2.render();
    pie3.render();
    pie4.render();
    pie5.render();
    pie6.render();
    pie7.render();
    pie8.render();

    heatGroup={
        "支付方式名称":pie3ChartGroup,
        "月份":pie4ChartGroup,
        "项目分类名称":pie5ChartGroup,
        "功能科目名称":pie6ChartGroup,
        "经济科目名称":pie7ChartGroup,
        "收款人分类":pie8ChartGroup
    };
}
function initProjectsAnalysis(type){

}
function initAccountingAnalysis(type){

};
function initBar(){

}
function initLeftList(){
    // $.get('20.28.29.150:5000/alldepartname',function(flare){
    // })
    $.ajax({
        type:'post',
        url:'http://20.28.29.150:83/alldepartname',
        success:function(flare){
            // initAccountDimAndGroup(d);
            var flare1 = d3.nest()
                .key(function(d){return d.一级预算单位名称})
                .entries(flare)
            flare1.forEach(function(e,i){
                e.children = e.values;
                e.name = e.key;
                e.children.forEach(function(e1,i1){
                    e1.name = e1.二三级预算单位名称;
                })
            })
            var newflare = {}
            newflare.name = "省本级"
            newflare.children = flare1
            newflare.x0 = 0;
            newflare.y0 = 0;

            //初始全部闭合
            newflare.children.forEach(function(e,i){
                e.children.forEach(function(e1,i1){
                    e1._children = e1.children;
                    e1.children = null;

                })
                e._children = e.children;
                e.children = null;
            })
            // newflare._children = newflare.children
            // newflare.children = null;


            update(root = newflare);

        },
        dataType:'json'
    })
}

function initDimensionAndGroup(data,condition,type){

    //后期可以补充条件
    //bubbleChart
    var cf = crossfilter(data);

    bubbleChartDim = cf.dimension(function(d){
        return d.二三级预算单位名称;
    })
    bubbleChartGroup = bubbleChartDim.group().reduce(
        function(p,v){
            // 	if (v.贷方发生额>0) {
            // }
            p.预算执行率 = v.预算执行率;
            p.二三级总完成率 = v.二三级总完成率
            p.二三级总支出数 += v.二三级总支出数
            return p;
        },
        function(p,v){
            p.二三级总支出数 -= v.二三级总支出数
            return p;
        },
        function(){
            return {
                预算执行率:0,
                二三级总完成率:0,
                二三级总支出数:0,

            };
        }
    )

}
function initDetailDimensionAndGroup(data){

    cf = crossfilter(data);

    //pieChart
    pie1ChartDim = cf.dimension(function(d){
        return d.指标来源名称
    })
    pie2ChartDim = cf.dimension(function(d){
        return d.资金性质名称
    })
    pie3ChartDim = cf.dimension(function(d){
        return d.支付方式名称
    })
    pie4ChartDim = cf.dimension(function(d){
        return d.月份
    })
    pie5ChartDim = cf.dimension(function(d){
        return d.项目分类名称
    })
    pie6ChartDim = cf.dimension(function(d){
        return d.功能科目名称
    })
    pie7ChartDim = cf.dimension(function(d){
        return d.经济科目名称
    })
    pie8ChartDim = cf.dimension(function(d){
        return d.收款人分类
    })

    pie1ChartGroup = pie1ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );

    pie2ChartGroup = pie2ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );
    pie3ChartGroup = pie3ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );
    pie4ChartGroup = pie4ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );
    pie5ChartGroup = pie5ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );

    pie6ChartGroup = pie6ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );
    pie7ChartGroup = pie7ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );
    pie8ChartGroup = pie8ChartDim.group().reduce(
        function(p,v){
            p += +v.支付金额
            return p;
        },
        function(p,v){
            p -= +v.支付金额
            return p;
        },
        function(){
            return 0;
        }
    );


}
function update(source) {

    // Compute the flattened node list. TODO use d3.layout.hierarchy.
    var nodes = tree.nodes(root);

    var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

    d3.select("svg").transition()
        .duration(duration)
        .attr("height", height);

    d3.select(self.frameElement).transition()
        .duration(duration)
        .style("height", height + "px")

    // Compute the "layout".
    nodes.forEach(function(n, i) {
        n.x = i * barHeight;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .style("opacity", 1e-6);

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
        .attr("y", -barHeight / 2)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .style("fill", color)
        .on("click", click);

    nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", 5.5)
        .text(function(d) { return d.name; });

    // Transition nodes to their new position.
    nodeEnter.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1);

    node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1)
        .select("rect")
        .style("fill", color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .style("opacity", 1e-6)
        .remove();

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        })
        .transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);

    //请求单位信息
    if (d.depth == 1) {

        getDepartmentJson(d.name)
    } else if (d.depth == 2) {
        getDetailJson(d.name);
        getProjectJson(d.name,proType[0])
        //修改名字
        $("#总体分析").text(d.name)
        curUnitName = d.name;
        localStorage.setItem("selectedFromIndex10",curUnitName);

    }

}
$("#btn1,#btn2,#btn3").on('click',function(d){
    var name = $(this).context.innerHTML;
    getProjectJson(curUnitName,name)
})
$("#网络分析,#决算分析").on('click',function(d){
    var index = $(this).index();
    if (index == 1 ) {
        location.href = "./支付网络分析.html"
    } else {
        location.href = "./单位决算分析.html"
    }
})
function getDepartmentJson(name){
    $.ajax({
        type:'post',
        url:'http://20.28.29.150:83/departname',
        data:{name:name},
        success:function(d){

            initDimensionAndGroup(d);
            initBubbleChart();
        },
        dataType:'json'
    })
}

export function getDetailJson(name){
    $.ajax({
        type:'post',
        url:'http://20.28.29.150:83/EVD',
        data:{name:name},
        success:function(d){
            d.forEach(function(d){
                d.支付金额 = +d.支付金额
            })
            initDetailDimensionAndGroup(d);
            initPieGroup();
            initHeatMap(d);
            initDataTable(d);
            originTableData = d;
            d3.select("#rightArea").style({"visibility":"visible"});
            d3.select("#饼图").style({"visibility":"visible"});
            d3.select("#热力").style({"visibility":"visible"});

        },
        dataType:'json'
    })

}

export function getProjectJson(name,type){
    $.ajax({
        type:'post',
        url:'http://20.28.29.150:83/PCR',
        data:{name:name},
        success:function(d){
            var finalData;
            if (type==proType[0]) {
                finalData = byPifu(d);
            } else if(type == proType[1]){
                finalData = byZhichu(d);
            } else if(type == proType[2]){
                finalData = byBili(d);
            } else {
                finalData = byPifu(d);
            }

            initProjectDimAndGroup(finalData,type)

        },
        dataType:'json'
    })
    // d3.csv('./static/data/项目完成率.csv',function(data){

    // })
}
function initHeatMap(d){
    //比例尺

    var moneyArr = d.map(function(d){
        return d.支付金额
    })
    var min = moneyArr.length>0?Math.min.apply(null,moneyArr):0
    var max = moneyArr.length>0?Math.max.apply(null,moneyArr):0;

    scale = d3.scale.linear()
        .domain([min,max])
        .range([0,10])
    //热力图

    heatChart = echarts.init(document.getElementById('热力图main'));

    tmpData = d;
    heatTmpData = d;


    x=[];
    var cf = crossfilter(d);
    var dim = cf.dimension(function(d){return d.预算项目名称})
    var group = dim.group().reduceCount()
    x = group.all().map(function(d){
        return d.key
    })
    var nest = d3.nest()
        .key(function(d){return d[curClass]})
        .key(function(d){return d["预算项目名称"]})
        .entries(heatTmpData)
    //y要从这这个nest的key获取，大坑。要不顺序会错
    y = nest.map(function(d){
        return d.key
    })
    nest.forEach(function(d,i){
        d.values.forEach(function(d1,i1){
            d1.sum = 0;
            d1.heat=[];
            d1.values.forEach(function(d2){
                d1.sum += +d2.支付金额
            })
            x.forEach(function(d2,i3){
                if (d2 == d1.key) {
                    d1.heat[0] = i3;
                }
            })
            // d1.heat = [i1,i,numberFormat((d1.sum))]
            d1.heat[1] = i;
            d1.heat[2] = numberFormat((d1.sum));
            heatData.push(d1.heat)
        })
    })

    heatOption = {
        tooltip:{
            position:'top',
            formatter:function(d){
                return d.name+":"+d.data[2]
            }
        },
        animation:false,
        grid:{
            height:'50%',
            width:'100%',
            y:'10%',
            x:'0',
            containLabel:true
        },
        xAxis:{
            type:'category',
            data:x,
            // splitArea:{
            // 	show:true
            // },
            axisLabel:{
                rotate:60,
                interval:0
            },
        },
        yAxis:{
            type:'category',
            data:y,
            splitArea:{
                show:true
            }
        },
        visualMap:{
            min:min,
            max:max,
            calculable:true,
            orient:'horizontal',
            left:'center',
            bottom:'15%'
        },
        series:[{
            name:'热力图',
            type:'heatmap',
            data:heatData,
            label:{
                normal:{
                    show:true,
                    textStyle:{
                        color:'#000'
                    }
                }
            },
            itemStyle:{
                emphasis:{
                    shadowBlur:10,
                    shadowColor:'rgba(0,0,0,0,0.5)'
                }
            }
        }]
    }
    heatChart.setOption(heatOption)
    addHeatMapListener(d);
}
function addHeatMapListener(d){
    heatChart.on('click',function(params){

        var index = params.data[1];
        var xname = params.name
        var yname = y[index];

        var filteredData = [];
        d.forEach(function(d1,i){
            if (d1[curClass] == yname && d1["预算项目名称"] == xname) {
                filteredData.push(d1);
            }
        })
        reloadDataTable(filteredData);


    })

}
function reloadDataTable(filteredData){
    var cf = crossfilter(filteredData);
    var dim = cf.dimension(function(d){
        return d.主管科室名称
    })
    dataTable
        .dimension(dim)
        // .group(经济科目名称维度)
        .group(function(d){
            return d.预算项目名称
        })
        .size(filteredData.length)
        .columns([
            {
                label:'支付方式',
                format:function(d){
                    //因为在最开头/了10000
                    return d.支付方式名称
                },
            },
            {
                label:'项目分类',
                format:function(d){
                    return d.项目分类名称
                },
            },

            {
                label:'功能科目',
                format:function(d){
                    //因为在最开头/了10000
                    return d.功能科目名称
                },
            },
            {
                label:'经济科目',
                format:function(d){
                    return d.经济科目名称
                },
            },
            {
                label:'收款单位',
                format:function(d){
                    //因为在最开头/了10000
                    return d.收款人分类
                },
            },
            {
                label:'支付金额',
                format:function(d){
                    //因为在最开头/了10000
                    return d.支付金额
                },
            },
            {
                label:'摘要',
                format:function(d){
                    return d.摘要
                },
            },




        ])
        .order(d3.ascending)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });
    dataTable.render();
}
function initDataTable(data){
    dataTable = dc.dataTable('#dataTable')

    var total;
    //这里应该判断名字

    // var cf = crossfilter(data);

    dataTableDim = cf.dimension(function(d){
        return d.主管科室名称
    })
    dataTable
        .dimension(dataTableDim)
        // .group()
        .group(function(d){
            return d.预算项目名称
        })
        .size(data.length)
        .columns([
            {
                label:'支付方式',
                format:function(d){
                    //因为在最开头/了10000
                    return d.支付方式名称
                },
            },
            {
                label:'项目分类',
                format:function(d){
                    return d.项目分类名称
                },
            },

            {
                label:'功能科目',
                format:function(d){
                    //因为在最开头/了10000
                    return d.功能科目名称
                },
            },
            {
                label:'经济科目',
                format:function(d){
                    return d.经济科目名称
                },
            },
            {
                label:'收款单位',
                format:function(d){
                    //因为在最开头/了10000
                    return d.收款人分类
                },
            },
            {
                label:'支付金额',
                format:function(d){
                    //因为在最开头/了10000
                    return d.支付金额
                },
            },
            {
                label:'摘要',
                format:function(d){
                    return d.摘要
                },
            },




        ])
        .order(d3.ascending)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });
    dataTable.render();
}
function byPifu(d){
    var	byPifuArr=[];
    d.forEach(function(d){
        byPifuArr.push({
            Expt:"一季度批复",
            Run:d.预算项目名称,
            Speed:+ d.一季度批复
        })
    })
    d.forEach(function(d){
        byPifuArr.push({
            Expt:"二季度批复",
            Run:d.预算项目名称,
            Speed:+ d.二季度批复
        })
    })
    d.forEach(function(d){
        byPifuArr.push({
            Expt:"三季度批复",
            Run:d.预算项目名称,
            Speed:+ d.三季度批复
        })
    })
    d.forEach(function(d){
        byPifuArr.push({
            Expt:"四季度批复",
            Run:d.预算项目名称,
            Speed:+ d.四季度批复
        })
    })
    return byPifuArr;
}
function byZhichu(d){
    var	byZhichuArr=[];
    d.forEach(function(d){
        byZhichuArr.push({
            Expt:"一季度支出",
            Run:d.预算项目名称,
            Speed:+ d.一季度支出
        })
    })
    d.forEach(function(d){
        byZhichuArr.push({
            Expt:"二季度支出",
            Run:d.预算项目名称,
            Speed:+ d.二季度支出
        })
    })
    d.forEach(function(d){
        byZhichuArr.push({
            Expt:"三季度支出",
            Run:d.预算项目名称,
            Speed:+ d.三季度支出
        })
    })
    d.forEach(function(d){
        byZhichuArr.push({
            Expt:"四季度支出",
            Run:d.预算项目名称,
            Speed:+ d.四季度支出
        })
    })
    return byZhichuArr;
}
function byBili(d){
    var	byBiliArr=[];
    d.forEach(function(d){
        byBiliArr.push({
            Expt:"前三季度支付比例",
            Run:d.预算项目名称,
            Speed:+ d.第四季度支付比例
        })
    })
    d.forEach(function(d){
        byBiliArr.push({
            Expt:"第四季度支付比例",
            Run:d.预算项目名称,
            Speed:+ d.第四季度支付比例
        })
    })

    return byBiliArr;
}
function initProjectDimAndGroup(proData,type){
    //projectAnalysis
    //确定名字数组
    var nameArray;
    if (type==proType[0]) {
        nameArray = pifuNames;
    } else if(type == proType[1]){
        nameArray = zhifuNames;
    } else if(type == proType[2]){
        nameArray = biliNames;
    } else {
        nameArray = pifuNames;
    }


    function multikey(x,y) {
        return x + 'x' + y;
    }
    function splitkey(k) {
        return k.split('x');
    }
    function stack_second(group) {
        return {
            all: function() {
                var all = group.all(),
                    m = {};
                // build matrix from multikey/value pairs
                all.forEach(function(kv) {
                    var ks = splitkey(kv.key);
                    m[ks[0]] = m[ks[0]] || {};
                    m[ks[0]][ks[1]] = kv.value;
                });
                // then produce multivalue key/value pairs
                return Object.keys(m).map(function(k) {
                    return {key: k, value: m[k]};
                });
            }
        };
    }
    bar1 = dc.barChart('#bar1');
    pie9 = dc.pieChart('#pie9');

    var ndx = crossfilter(proData),
        runExptDim = ndx.dimension(function(d) { return multikey(d.Run, d.Expt); }),
        runExptGroup = runExptDim.group().reduceSum(function(d) {
            return d.Speed;
        }),
        stackedGroup = stack_second(runExptGroup);
    var quantizeSpeed = d3.scale.quantize().domain(d3.extent(proData, function(d) {
        return d.Speed;
    })).range(['lowest', 'low', 'medium', 'high', 'highest']);
    var quantizeSpeedDim = ndx.dimension(function(d) {
        return quantizeSpeed(d.Speed);
    }), quantizeSpeedGroup = quantizeSpeedDim.group();

    function sel_stack(i) {
        return function(d) {
            return d.value[nameArray[i-1]];
        };
    }

    var tmpDim = ndx.dimension(function(d){return d.Run});
    var tmpGroup = tmpDim.group().reduceCount();
    bar1
        .width(600)
        .height(400)
        .controlsUseVisibility(true)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal().domain(tmpGroup.all().map(function(e){
            return e.key
        })))
        .elasticY(true)

        .margins({left: 100, top: 20, right: 10, bottom: 110})
        .brushOn(false)
        .clipPadding(10)
        .title(function(d) {
            return d.key + '[' + nameArray[this.layer-1] + ']: ' + d.value[nameArray[this.layer-1]];
        })
        .dimension(runExptDim)
        .group(stackedGroup, '1', sel_stack('1'))


    for(var i = 2; i<6; ++i)
        bar1.stack(stackedGroup, ''+i, sel_stack(i));

    bar1.on('pretransition', function(chart) {
        chart.selectAll('rect.bar')
            .classed('stack-deselected', function(d) {
                // display stack faded if the chart has filters AND
                // the current stack is not one of them
                var key = multikey(d.x, d.layer);
                return chart.filter() && chart.filters().indexOf(key)===-1;
            })
            .on('click', function(d) {
                chart.filter(multikey(d.x, d.layer));
                dc.redrawAll();
            });
    });

    pie9
        .width(200)
        .height(200)
        .controlsUseVisibility(true)
        .dimension(quantizeSpeedDim)
        .group(quantizeSpeedGroup);

    bar1.render();
    pie9.render();
    changeSVG();
}
function changeSVG(){
    d3.selectAll("#bar1 g.x text")
        .attr('class', 'rotateXais')
        .style("text-anchor", "end")
        .attr("transform", "translate(-10,0) rotate(330)");


    d3.selectAll(".barLabel")
        .style("font-size",5);
}

function initAccountDimAndGroup(name){
    var filteredData = [];
    originData.forEach(function(d){
        if (d.会计科目全称 == name) {
            filteredData.push(d);
        }
    })
    var cf = crossfilter(filteredData)

    bar2ChartDim = cf.dimension(function(d){
        return d.会计期间
    }).filter(function(d) {
        return d!="NULL";
    });


    bar2ChartGroup = bar2ChartDim.group().reduce(
        function(p,v){
            p += v[_type]
            return p;
        },
        function(p,v){
            p -= v[_type]
            return p;
        },
        function(){
            return 0;
        }
    );
    // bar2ChartGroup = getAccountGroup(bar2ChartGroupTmp,name)

}

function getAccountGroup(source_group ,name){
    return {
        top:function top(n) {
            return source_group.top(n).filter(function(d) {
                return d.name == name;
            });
        },
        all:function all(){
            return source_group.all().filter(function(d) {
                return d.name == name;
            })
        }
    };
}
function clickAccount(name){
    initAccountDimAndGroup(name);
    initAccountingAnalysis(_type);
    d3.select("#rightArea").style({"visibility":"visible"});
    d3.select("#饼图").style({"visibility":"visible"});
    d3.select("#热力").style({"visibility":"visible"});
}
function color(d) {
    if (d.depth == 4) {
        return "#b5c334"
    } else if (d.depth == 3) {
        return "#e87c25"
    } else if (d.depth == 2) {
        return "#27727b"
    } else if(d.depth == 1){
        return "#96dee8"
    }
}
function addListener(){
    d3.select('#jie').on('click',function(e){
        _type = accountType[0];
        redrawPage(accountType[0])
    })
    d3.select('#dai').on('click',function(e){
        _type = accountType[1]
        redrawPage(accountType[1])
    })
    d3.select('#viewAll').on('click',function(e){
        localStorage.setItem('curUnitName',curUnitName);
        location.href = "./index8_all.html"
    })

}
function redrawPage(type){
    initDimensionAndGroup(originData,'',type);
    // initBubbleChart(type);
    // initPieGroup(type);
    // initProjectsAnalysis(type);
    initAccountingAnalysis(type);
}
