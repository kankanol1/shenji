import 'bootstrap'
import './bootstrap-contextmenu'
import 'bootstrap-submenu'
import '../styles/bootstrap-submenu.css'
import echarts from './echarts-modified.js';
import dictionary from '../config/dictionary';

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// var color = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
var color = ['#f00', '#F60', 'orange', '#0C0', '#06C', '#909'];

var Graph = function Graph(params) {
    this.options = $.extend(true, {}, this.defaultOptions, params);
    this.nodes = {};
    this.links = {};
    this.filter = {};
    this.currentMergeTime = 0;
    this._init();
};
Graph.prototype = {
    defaultOptions: {
        dateFormat: 'yyyy.MM',
        maxMergeTime: 100,
        nodeType: dictionary.nodeTypes,
        linkType: dictionary.linkTypes
    },
    _init: function () {
        var graph = this;
        graph.filter = {
            node: {},
            link: {}
        };

        $.each(this.options.nodeType, function (typeName, typeData) {
            graph.filter.node[typeName] = {show: true, exists: false};
            if (!typeData.filters) return;
            $.each(typeData.filters, function (index, filter) {
                graph.filter.node[typeName]['property-' + filter.property] = {
                    entity: 'node',
                    entityType: typeName,
                    display: typeData.properties[filter.property].display,
                    type: filter.type,
                    range: [],
                    expression: '',
                    disabled: true
                };
            });
        });

        $.each(this.options.linkType, function (typeName, typeData) {
            graph.filter.link[typeName] = {show: true, exists: false};
            if (!typeData.filters) return;
            $.each(typeData.filters, function (index, filter) {
                graph.filter.link[typeName]['property-' + filter.property] = {
                    entity: 'link',
                    entityType: typeName,
                    display: typeData.properties[filter.property].display,
                    type: filter.type,
                    range: [],
                    expression: '',
                    disabled: true
                };
            });
        });
    },
    setGraph: function (nodes, links) {
        this.nodes = {};
        this.links = {};
        this.currentMergeTime = 0;
        return this.mergeGraph(nodes, links);
    },
    _updateMergeTime: function () {
        var graph = this;
        graph.currentMergeTime ? graph.currentMergeTime++ : graph.currentMergeTime = 1;
        $.each(graph.nodes, function (nodeId) {
            graph.nodes[nodeId].mergeTime ? graph.nodes[nodeId].mergeTime++ : graph.nodes[nodeId].mergeTime = 1;
            graph.nodes[nodeId].mergeTime >= graph.options.maxMergeTime && graph._deleteNode(nodeId);
        });
        $.each(graph.links, function (sourceNodeId, targets) {
            $.each(targets, function (targetNodeId) {
                $.each(graph.options.linkType, function (typeName, typeData) {
                    if (!graph.links[sourceNodeId][targetNodeId][typeName]) return;
                    $.each(graph.links[sourceNodeId][targetNodeId][typeName], function (timestamp, linkData) {
                        graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime ?
                            graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime++ : graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime = 1;

                        // graph.currentMergeTime >= graph.options.maxMergeTime &&
                        graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime >= graph.options.maxMergeTime &&
                        graph._deleteLink(sourceNodeId, targetNodeId, typeName, timestamp);
                    });
                });
            });
        });
        graph.currentMergeTime >= graph.options.maxMergeTime && graph.currentMergeTime--;
        return graph;
    },
    mergeGraph: function (nodes, links, ignoreMergeTime) {
        var graph = this;
        $.each(nodes, function (index, nodeData) {
            graph._addNode(nodeData);
        });
        $.each(links, function (index, linkData) {
            graph._addLink(linkData);
        });
        if (!ignoreMergeTime)
            graph = graph._updateMergeTime();

        return graph.resetFilter();
    },
    goBack: function () {
        if (this.currentMergeTime <= 0) return;
        var graph = this;
        this.currentMergeTime--;
        $.each(graph.nodes, function (nodeId) {
            if (!graph.nodes[nodeId].mergeTime)
                graph.nodes[nodeId].mergeTime = 1;
            graph.nodes[nodeId].mergeTime--;
            if (graph.nodes[nodeId].mergeTime <= 0) {
                graph._deleteNode(nodeId);
            }
        });

        $.each(graph.links, function (sourceNodeId, targets) {
            $.each(targets, function (targetNodeId) {
                $.each(graph.options.linkType, function (typeName, typeData) {

                    if (!graph.links[sourceNodeId][targetNodeId][typeName]) return;
                    $.each(graph.links[sourceNodeId][targetNodeId][typeName], function (timestamp, linkData) {
                        if (!graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime)
                            graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime = 1;
                        graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime--;
                        if (graph.links[sourceNodeId][targetNodeId][typeName][timestamp].mergeTime <= 0) {
                            graph._deleteLink(sourceNodeId, targetNodeId, typeName, timestamp);
                        }
                    });
                });
            });
        });
    },
    _addLink: function (link) {
        if (!link) return;
        var source, target;
        source = link.startNode + '';
        target = link.edNode + '';
        if (!this.links[source]) this.links[source] = {};
        if (!this.links[source][target]) this.links[source][target] = {};
        var typeName = link.type;
        $.each(this.options.linkType, function (type) {
            if (typeName.toLowerCase() == type.toLowerCase())
                typeName = type;
        });

        if (!this.options.linkType[typeName]) {
            this.options.linkType[typeName] = {
                name: typeName,
                display: typeName,
                autoCreated: true,
                properties: {}
            };
            this.filter.link[typeName] = {show: true, exists: true};
        }


        if (!this.links[source][target][typeName]) this.links[source][target][typeName] = {};

        var linkKey = link.id;

        if (!this.links[source][target][typeName][linkKey]) this.links[source][target][typeName][linkKey] = {};
        this.links[source][target][typeName][linkKey] = $.extend(true, this.links[source][target][typeName][linkKey], link);
        this.links[source][target][typeName][linkKey].id = link.id;
        this.links[source][target][typeName][linkKey].source = source;
        this.links[source][target][typeName][linkKey].target = target;
        this.links[source][target][typeName][linkKey].type = this.options.linkType[typeName];
        this.links[source][target][typeName][linkKey].value = link.value;

        if (!link.propertyList) return;
        var graph = this;
        $.each(link.propertyList, function (index, property) {
            var filterName = 'property-' + property.key;
            if (!graph.filter.link[typeName][filterName] || graph.filter.link[typeName][filterName].type == 'contains') return;
            property.value = property.value * 1;
            if (property.value == NaN) return;
            if (graph.filter.link[typeName][filterName].range[0] == undefined || graph.filter.link[typeName][filterName].range[0] > property.value)
                graph.filter.link[typeName][filterName].range[0] = property.value;
            if (graph.filter.link[typeName][filterName].range[1] == undefined || graph.filter.link[typeName][filterName].range[1] < property.value)
                graph.filter.link[typeName][filterName].range[1] = property.value;
        });
    },
    _addNode: function (node) {
        if (!node) return;
        node.id = node.id + '';
        var type;
        $.each(this.options.nodeType, function (typeName, typeData) {
            //updated!!!
            if (node.type.toLowerCase() == typeName.toLowerCase())
                type = typeData;
        });

        if (!type) {
            type = {
                name: node.type,
                display: node.type,
                autoCreated: true,
                properties: {}
            }
            this.options.nodeType[node.type] = type;
            this.filter.node[node.type] = {show: true, exists: true};
        }

        this.nodes[node.id] = $.extend(true, this.nodes[node.id], node, {
            id: node.id,
            name: node.name,
            type: type,
            value: node.value ? node.value : 0
        });
        if (!node.propertyList) return;

        var graph = this;
        $.each(node.propertyList, function (index, property) {
            var filterName = 'property-' + property.key;
            if (!graph.filter.node[node.type][filterName] || graph.filter.node[node.type][filterName].type == 'contains') return;
            property.value = property.value * 1;
            if (property.value == NaN) return;
            if (graph.filter.node[node.type][filterName].range[0] == undefined || graph.filter.node[node.type][filterName].range[0] > property.value)
                graph.filter.node[node.type][filterName].range[0] = property.value;
            if (graph.filter.node[node.type][filterName].range[1] == undefined || graph.filter.node[node.type][filterName].range[1] < property.value)
                graph.filter.node[node.type][filterName].range[1] = property.value;
        });
    },
    _deleteNode: function (nodeId) {
        delete this.nodes[nodeId];
    },
    _deleteLink: function (sourceNodeId, targetNodeId, typeName, linkKey) {
        delete this.links[sourceNodeId][targetNodeId][typeName][linkKey];
    },
    _deleteAllLinksBySourceAndTarget: function (sourceNodeId, targetNodeId) {
        delete this.links[sourceNodeId][targetNodeId];
    },
    isFilteredOut: function (nodeId, keepIsolatedNodes) {//是否被过滤掉了，即不存在于图上，keepIsolatedNodes表示是否保留孤点
        if (this.nodes[nodeId].category &&
            this.customCategories &&
            this.customCategories[this.nodes[nodeId].category] &&
            this.customCategories[this.nodes[nodeId].category].ignoreFilter)
            return false;
        if (!this.filter.node[this.nodes[nodeId].type.name].show)
            return true;
        if (this.getRelativeNodeIds(nodeId).length == 0 && !keepIsolatedNodes)
            return true;

        var filter = this.filter.node[this.nodes[nodeId].type.name], typeName = this.nodes[nodeId].type.name;

        var properties = {};
        if (this.nodes[nodeId].propertyList)
            $.each(this.nodes[nodeId].propertyList, function (index, property) {
                properties['property-' + property.key] = property.value;
            });

        var add = true;
        $.each(filter, function (filterName, filterData) {
            if (!add || filterName.indexOf('property-') != 0) return;
            if (filterData.disabled) return;

            if (!properties[filterName]) {
                add = false;
                return;
            }

            if (filterData.type == 'contains' && properties[filterName]) {
                switch (filterData.operator) {
                    case 'equals':
                        add = (properties[filterName] == filterData.expression);
                        break;
                    case 'contains':
                        add = (properties[filterName].indexOf(filterData.expression) >= 0);
                        break;
                    case 'notEquals':
                        add = (properties[filterName] != filterData.expression);
                        break;
                    case 'notContains':
                        add = (properties[filterName].indexOf(filterData.expression) < 0);
                        break;
                }
            }
            else {
                add = properties[filterName] >= filterData.filter[0] && properties[filterName] <= filterData.filter[1]
            }
        });
        return !add;
    },
    getFilteredLinks: function (sourceNodeId, targetNodeId) {
        var filteredLinks = [];
        var graph = this;
        if (graph.links[sourceNodeId] && graph.links[sourceNodeId][targetNodeId]) {
            $.each(graph.options.linkType, function (typeName) {
                if (!graph.links[sourceNodeId][targetNodeId][typeName]) return;
                if (!graph.filter.link[typeName].show) return;

                var filter = graph.filter.link[typeName];

                $.each(graph.links[sourceNodeId][targetNodeId][typeName], function (linkId, linkData) {
                    var properties = {};
                    $.each(linkData.propertyList, function (index, property) {
                        properties['property-' + property.key] = property.value;
                    });

                    var add = true;

                    $.each(filter, function (filterName, filterData) {
                        if (!add || filterName.indexOf('property-') != 0) return;
                        if (filterData.disabled) return;
                        // if (!properties[filterName]) {
                        //     add = false;
                        //     return;
                        // }

                        if (filterData.type == 'contains' && properties[filterName]) {
                            switch (filterData.operator) {
                                case 'equals':
                                    add = (properties[filterName] == filterData.expression);
                                    break;
                                case 'contains':
                                    add = (properties[filterName].indexOf(filterData.expression) >= 0 || filterData.expression.length == 0);
                                    break;
                                case 'notEquals':
                                    add = (properties[filterName] != filterData.expression);
                                    break;
                                case 'notContains':
                                    add = (properties[filterName].indexOf(filterData.expression) < 0) || filterData.expression.length == 0;
                                    break;
                            }
                        }
                        else {
                            add = properties[filterName] >= filterData.filter[0] && properties[filterName] <= filterData.filter[1]
                        }
                    });
                    if (add)
                        filteredLinks.push(linkData);
                });
            });
        }
        return filteredLinks;
    },
    getAllLinks: function (sourceNodeId, targetNodeId) {
        var filteredLinks = [];
        var graph = this;
        if (graph.links[sourceNodeId] && graph.links[sourceNodeId][targetNodeId]) {
            $.each(graph.options.linkType, function (typeName) {
                if (!graph.links[sourceNodeId][targetNodeId][typeName]) return;
                $.each(graph.links[sourceNodeId][targetNodeId][typeName], function (timestamp, linkData) {
                    filteredLinks.push(linkData);
                });
            });
        }
        return filteredLinks;
    },
    getRelatedLinks: function (nodeId) {
        var graph = this;
        var links = [];
        $.each(graph.nodes, function (nodeId1) {
            links = links.concat(graph.getAllLinks(nodeId1, nodeId));
            links = links.concat(graph.getAllLinks(nodeId, nodeId1));
        });
        return links;
    },
    getRelativeNodeIds: function (nodeId1, linkType) {
        var relativeNodes = [];
        var graph = this;
        $.each(graph.nodes, function (nodeId2) {
            var links = graph.getFilteredLinks(nodeId1, nodeId2).concat(graph.getFilteredLinks(nodeId2, nodeId1));

            $.each(links, function (index, linkData) {
                if (!linkType || linkData.type.name == linkType) {
                    relativeNodes.push(nodeId2);
                }
            })
        });

        return $.unique(relativeNodes);
    },
    getFilterValue: function (filterName) {
        return this.filter[filterName];
    },
    resetFilter: function () {
        var graph = this;
        graph.filter = {
            node: {},
            link: {}
        };
        $.each(this.options.nodeType, function (typeName, typeData) {
            graph.filter.node[typeName] = {show: true, exists: false};
            if (!typeData.filters) return;
            $.each(typeData.filters, function (index, filter) {
                graph.filter.node[typeName]['property-' + filter.property] = {
                    entity: 'node',
                    entityType: typeName,
                    display: typeData.properties[filter.property].display,
                    type: filter.type,
                    range: [],
                    filter: [],
                    expression: '',
                    disabled: true
                };
            });
        });
        $.each(this.options.linkType, function (typeName, typeData) {
            graph.filter.link[typeName] = {show: true, exists: false};
            if (!typeData.filters) return;
            $.each(typeData.filters, function (index, filter) {
                graph.filter.link[typeName]['property-' + filter.property] = {
                    entity: 'link',
                    entityType: typeName,
                    display: typeData.properties[filter.property].display,
                    type: filter.type,
                    range: [],
                    filter: [],
                    expression: '',
                    disabled: true
                };
            });
        });
        $.each(graph.nodes, function (nodeId, node) {
            graph.filter.node[node.type.name].exists = true;
            if (!node.propertyList) return;
            $.each(node.propertyList, function (index, property) {
                var filterName = 'property-' + property.key;
                if (!graph.filter.node[node.type.name][filterName] || graph.filter.node[node.type.name][filterName].type == 'contains') return;
                property.value = property.value * 1;
                if (property.value == NaN) return;
                if (graph.filter.node[node.type.name][filterName].range[0] == undefined || graph.filter.node[node.type.name][filterName].range[0] > property.value) {
                    graph.filter.node[node.type.name][filterName].range[0] = property.value;
                    graph.filter.node[node.type.name][filterName].filter[0] = property.value;
                }
                if (graph.filter.node[node.type.name][filterName].range[1] == undefined || graph.filter.node[node.type.name][filterName].range[1] < property.value) {
                    graph.filter.node[node.type.name][filterName].range[1] = property.value;
                    graph.filter.node[node.type.name][filterName].filter[1] = property.value;
                }
            });
        });
        $.each(graph.links, function (sourceNodeId, targets) {
            $.each(targets, function (targetNodeId) {
                $.each(graph.options.linkType, function (typeName, typeData) {
                    if (!graph.links[sourceNodeId][targetNodeId][typeName]) return;
                    $.each(graph.links[sourceNodeId][targetNodeId][typeName], function (linkId, link) {
                        graph.filter.link[typeName].exists = true;
                        if (!link.propertyList) return;
                        $.each(link.propertyList, function (index, property) {
                            var filterName = 'property-' + property.key;
                            if (!graph.filter.link[typeName][filterName] || graph.filter.link[typeName][filterName].type == 'contains') return;
                            property.value = property.value * 1;
                            if (property.value == NaN) return;
                            if (graph.filter.link[typeName][filterName].range[0] == undefined || graph.filter.link[typeName][filterName].range[0] > property.value) {
                                graph.filter.link[typeName][filterName].range[0] = property.value;
                                graph.filter.link[typeName][filterName].filter[0] = property.value;
                            }
                            if (graph.filter.link[typeName][filterName].range[1] == undefined || graph.filter.link[typeName][filterName].range[1] < property.value) {
                                graph.filter.link[typeName][filterName].range[1] = property.value;
                                graph.filter.link[typeName][filterName].filter[1] = property.value;
                            }
                        });
                    });
                });
            });
        });
        return graph;
    },
    formDate: function (str, fmt) {
        if (!fmt) fmt = this.options.dateFormat;
        var date = new Date();
        if (!str) return;
        if (fmt == 'yyyy-MM' || fmt == 'yyyy-MM-dd') {
            str = str.replace('-', '.');
            fmt = fmt.replace('-', '.');
        }

        if (fmt == 'yyyy.MM' || fmt == 'yyyy.MM.dd') {
            var strArr = str.split('.');
            if ((strArr[0] * 1) + '' != 'NaN')
                date.setFullYear(strArr[0] * 1);
            else
                return;
            if (strArr[1] && (strArr[1] * 1) + '' != 'NaN')
                date.setMonth(strArr[1] * 1 - 1);
            if (strArr[2] && (strArr[2] * 1) + '' != 'NaN')
                date.setDate(strArr[2] * 1);
        }
        return date;
    },
    sortNodeAsc: function () {
        var graph = this;
        return $.map(graph.nodes, function (value) {
            return value;
        });
    },
    clear: function () {
        var graph = this;
        graph.nodes = {};
        graph.links = {};
        this._init();
    }
};
// var darkColor = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'];
var darkColor = ['#f00', '#F60', 'orange', '#0C0', '#06C', '#909'];
var EChartsGraph = function EChartsGraph(params) {
    this.options = $.extend(true, this.defaultOptions, params);
    if (params.theme == 'dark') {
        this.options.echartsOptioins.legend.textStyle.color = 'white';
        this.options.echartsOptioins.color = darkColor;
        this.options.echartsOptioins.tooltip = {
            enterable: true,
            position: 'top'
        };
        this.options.echartsOptioins.toolbox.iconStyle.normal.borderColor = '#efefef';
    }
    this.operations = [];
    this.chart = {};
    this._init();
};
EChartsGraph.prototype = {
    defaultOptions: {
        graphContainerId: 'graphChart',
        echartsCategories: {},
        echartsOptioins: {
            toolbox: {
                show: true,
                itemSize: 20,
                iconStyle: {
                    normal: {
                        borderWidth: 1
                    }
                },
                right: 50,
                top: 20,
                feature: {
                    // myOperationGoback: {
                    //     name: 'myOperationGoback',
                    //     title: '返回上一操作',
                    //     icon: 'M1536 640v-128q0 -53 -32.5 -90.5t-84.5 -37.5h-704l293 -294q38 -36 38 -90t-38 -90l-75 -76q-37 -37 -90 ' +
                    //     '-37q-52 0 -91 37l-651 652q-37 37 -37 90q0 52 37 91l651 650q38 38 91 38q52 0 90 -38l75 -74q38 -38 38 -91t-38 -91l-293 -293h704q52 0 84.5 ' +
                    //     '-37.5t32.5 -90.5z',
                    //     onclick: function (model, api, name, event) {
                    //         var instance = EChartsGraph.instances[$(api.getDom()).attr('id')];
                    //         instance.prevOperation();
                    //     }
                    // },
                    myRefresh: {
                        name: 'myRefresh',
                        title: '复位全部节点',
                        icon: 'M1511 480q0 -5 -1 -7q-64 -268 -268 -434.5t-478 -166.5q-146 0 -282.5 55t-243.5 157l-129 -129q-19 ' +
                        '-19 -45 -19t-45 19t-19 45v448q0 26 19 45t45 19h448q26 0 45 -19t19 -45t-19 -45l-137 -137q71 -66 161 -102t187 -36q134' +
                        ' 0 250 65t186 179q11 17 53 117q8 23 30 23h192q13 0 22.5 -9.5t9.5 -22.5zM1536 1280v-448q0 -26 -19 -45t-45 -19h-448q-26 0 ' +
                        '-45 19t-19 45t19 45l138 138q-148 137 -349 137q-134 0 -250 -65t-186 -179q-11 -17 -53 -117q-8 -23 -30 -23h-199q-13 0 -22.5 9.' +
                        '5t-9.5 22.5v7q65 268 270 434.5t480 166.5q146 0 284 -55.5t245 -156.5l130 129q19 19 45 19t45 -19t19 -45z',
                        onclick: function (model, api, name, event) {
                            var instance = EChartsGraph.instances[$(api.getDom()).attr('id')];
                            instance.resetGraph(true);
                        }
                    }
                }
            },
            color: color,
            legend: {
                show: true,
                textStyle: {
                    fontSize: 15,
                },
                left: 10,
                data: [],
                // selectedMode: false
            },
            tooltip: {
                triggerOn: 'click',
                enterable: true,
                padding: 0,
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 0,
                textStyle: {
                    color: '#000'
                },
                formatter: function (params) {
                    var html = '<div class="tooltip-container" style="max-height: 180px;overflow-y: auto">';
                    html += '<table class="table" style="background-color: transparent;font-size: 12px">';
                    if (params.dataType == 'node') {
                        var nodeData = params.data.data;
                        html += '<thead><tr><th colspan="2"><strong style="font-size: 15.5px">' + nodeData.name + '(' + nodeData.type.display + ')' + '</strong></th></tr></thead>';
                        html += '<tr><th colspan="2">';
                        html += '<a onclick="var e=' +
                            'new CustomEvent(\'nodeDetail\',' +
                            '{bubbles:true,cancelabel:true,detail:{id:\'' + nodeData.id + '\'}});' +
                            'this.dispatchEvent(e);">  查看详情>></a>';
                        html += '</th></tr></thead>'
                        html += '<tbody>';
                        if (nodeData.propertyList)
                            $.each(nodeData.propertyList, function (index, propertyData) {
                                if (dictionary.nodeTypes[nodeData.type.name].properties && dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key] && dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].tooltip) {
                                    if (dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].date) {
                                        var dateFormat = dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].dateFormat;
                                        if (!dateFormat)
                                            dateFormat = 'yyyy.MM';
                                        html += '<tr><td><strong>' + dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].display + '： </strong></td><td>' + new Date(propertyData.value).Format(dateFormat) + '</td></tr>';
                                    }
                                    else if (dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].decimal) {
                                        html += '<tr><td><strong>' + dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].display + '： </strong></td><td>' + propertyData.value.toFixed(dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].decimal) + '</td></tr>';
                                    }
                                    else
                                        html += '<tr><td><strong>' + dictionary.nodeTypes[nodeData.type.name].properties[propertyData.key].display + '： </strong></td><td>' + propertyData.value + '</td></tr>';
                                }
                            });
                        html += '</tbody>';
                    }
                    else {
                        var content = '';
                        var linkType2Count = {};
                        var sourceNodeId = params.data.source, targetNodeId = params.data.target;

                        $.each(params.data.links, function (index, linkData) {
                            if (!linkType2Count[linkData.type.display])
                                linkType2Count[linkData.type.display] = 0;
                            linkType2Count[linkData.type.display]++;

                            if (index >= 10)
                                return;
                            if (index % 2 == 0)
                                content += '<tr>';
                            content += '<td style="' + (index % 2 != 0 ? 'border-left:1.5px solid #282828;padding-left:15px' : '') + '">';
                            content += '<strong>类型： </strong>' + linkData.type.display + '<br/>';
                            if (linkData.propertyList)
                                $.each(linkData.propertyList, function (index, propertyData) {
                                    if (dictionary.linkTypes[linkData.type.name].properties && dictionary.linkTypes[linkData.type.name].properties[propertyData.key] && dictionary.linkTypes[linkData.type.name].properties[propertyData.key].tooltip) {
                                        if (dictionary.linkTypes[linkData.type.name].properties[propertyData.key].date) {
                                            var dateFormat = dictionary.linkTypes[linkData.type.name].properties[propertyData.key].dateFormat;
                                            if (!dateFormat)
                                                dateFormat = 'yyyy.MM';
                                            content += '<strong>' + dictionary.linkTypes[linkData.type.name].properties[propertyData.key].display + '： </strong>' + new Date(propertyData.value).Format(dateFormat) + '<br/>';
                                        }
                                        else if (dictionary.linkTypes[linkData.type.name].properties[propertyData.key].decimal) {
                                            content += '<strong>' + dictionary.linkTypes[linkData.type.name].properties[propertyData.key].display + '： </strong>' + propertyData.value.toFixed(dictionary.linkTypes[linkData.type.name].properties[propertyData.key].decimal) + '<br/>';
                                        }
                                        else
                                            content += '<strong>' + dictionary.linkTypes[linkData.type.name].properties[propertyData.key].display + '： </strong>' + propertyData.value + '<br/>';
                                    }
                                });
                            content += '</td>';
                            if (index % 2 != 0)
                                content += '</tr>'
                        });
                        if (params.data.links.length % 2 != 0 && params.data.links.length <= 10)
                            content += '<td></td></tr>';

                        html += '<thead><tr><th colspan="2"><strong style="font-size: 15.5px">' + params.data.title + '</strong></th></tr>';
                        html += '<tr><th colspan="2">共有' + params.data.links.length + '条关系，其中' + $.map(linkType2Count, function (value, name) {
                            return name + ' ' + value + '条'

                        }).join(', ') + '   ';
                        // if (params.data.links.length > 10)
                        html += '<a onclick="var e=' +
                            'new CustomEvent(\'edgeDetail\',' +
                            '{bubbles:true,cancelabel:true,detail:{source:\'' + sourceNodeId + '\',target:\'' + targetNodeId + '\'}});' +
                            'this.dispatchEvent(e);">  查看详情>></a>';
                        html += '</th></tr></thead>'
                        html += '<tbody>' + content + '</tbody>';
                    }
                    return html + '</table></div>';
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                animationDurationUpdate: 0,
                roam: true,
                force: {
                    repulsion: 200,
                    gravity: 0.1,
                    edgeLength: 80,
                    layoutAnimation: true
                },
                modularity: true,
                modularity: {
                    resolution: 10,
                    sort: false
                },
                draggable: true,
                focusNodeAdjacency: true,
                hoverLayerThreshold: 1,
                categories: []
            }]
        },
        labeledNodePercentage: 0.5,
        maxLinkWidth: 5,
        contextMenuItem: {
            fold: {
                name: 'fold',
                display: '折叠',
                available: function (context) {
                    return context.hasChartParam && context.chartParam.dataType == 'node' && !context.graph.nodes[context.chartParam.data.name].folded;
                },
                onItem: function (context, e) {
                    context.fold(context.chartParam.data.name);
                    return true;
                }
            },
            unfold: {
                name: 'unfold',
                display: '展开',
                available: function (context) {
                    return context.hasChartParam && context.chartParam.dataType == 'node' && context.graph.nodes[context.chartParam.data.name].folded;
                },
                onItem: function (context, e) {
                    context.unfold(context.chartParam.data.name);
                    return true;
                }
            },
            hide: {
                name: 'hide',
                display: '隐藏',
                available: function (context) {
                    return context.hasChartParam && context.chartParam.dataType == 'node';
                },
                onItem: function (context, e) {
                    context.hideNode(context.chartParam.data.name);
                    return true;
                }
            },
            prev: {
                name: 'prev',
                display: '返回上一操作',
                available: function (context) {
                    return context.operations.length > 0;
                },
                onItem: function (context, e) {
                    context.prevOperation();
                }
            }
        },
        graphOptions: {}
    },
    _init:

        function () {
            var graphContainerId = this.options.graphContainerId;
            this.graph = new Graph(this.options.graphOptions);
            this.chart = echarts.init(document.getElementById(graphContainerId));
            var echartsGraph = this;

            this.graph.customCategories = echartsGraph.options.echartsCategories;
            $.each(echartsGraph.options.echartsCategories, function (categoryName, categoryData) {
                echartsGraph.options.echartsOptioins.series[0].categories.push(categoryData);
                if (categoryData.legend)
                    echartsGraph.options.echartsOptioins.legend.data.push({
                        name: categoryData.name,
                        icon: categoryData.symbol
                    });
            });
            echartsGraph.options.echartsOptioins.series[0].categories.push({
                name: '其他'
            });
            $.each(echartsGraph.graph.options.nodeType, function (typeName, typeData) {
                if (echartsGraph.options.echartsCategories[typeName]) return;
                echartsGraph.options.echartsOptioins.series[0].categories.push({name: typeData.display});
                echartsGraph.options.echartsOptioins.legend.itemHeight = 25;
                echartsGraph.options.echartsOptioins.legend.data.push(typeData.display)
            });

            var html = '<div id="' + graphContainerId + 'ContextMenu"><ul class="dropdown-menu" role="menu" data-menu-name="main">';
            var buildContextMenuItemHtml = function (menuName, menuData) {
                html += '<li class=' + (menuData.subMenu ? '"dropdown-submenu"' : '""') + ' data-menu-item-name="' + menuName + '">' +
                    (menuData.html ? menuData.html : '<a href="javascript:void(0);" tabindex="-1" >' + menuData.display + '</a>');
                if (menuData.subMenu) {
                    html += '<ul class="dropdown-menu" role="menu" data-menu-name="' + menuName + '">';
                    $.each(menuData.subMenu, function (subMenuName, subMenuData) {
                        buildContextMenuItemHtml(menuName + '-' + subMenuName, subMenuData);
                    });
                    html += '</ul>';
                }
                html += '</li>';
            };
            $.each(echartsGraph.options.contextMenuItem, function (menuName, menuData) {
                buildContextMenuItemHtml(menuName, menuData);
            });
            html += '</ul></div>';
            $('#' + graphContainerId).append(html);

            $('[data-submenu]').submenupicker();

            $('#' + graphContainerId).contextmenu({
                target: '#' + graphContainerId + 'ContextMenu',
                before: function (e, context) {
                    e.preventDefault();
                    return true;
                },
                after: function (e) {
                    $('li[data-menu-item-name]').each(function () {
                        $(this).removeClass('disabled');
                        var menuData = echartsGraph.options.contextMenuItem,
                            menuName = $(this).attr('data-menu-item-name'),
                            tempData;
                        $.each(menuName.split('-'), function (index, name) {
                            tempData = menuData[name];
                            if (!tempData)
                                tempData = menuData.subMenu[name];
                            menuData = tempData;
                        });
                        if (!menuData) return;
                        if (menuData.after)
                            menuData.after(echartsGraph, e);
                        if (!menuData.available) return;
                        if (typeof menuData.available == 'string' && ( !echartsGraph.hasChartParam || echartsGraph.chartParam.dataType != menuData.available)) {
                            $(this).addClass('disabled');
                        }
                        else if (typeof menuData.available == 'function' && !menuData.available(echartsGraph)) {
                            $(this).addClass('disabled');
                        }
                    });
                },
                onItem: function (context, e) {
                    e.preventDefault();
                    var menuData = echartsGraph.options.contextMenuItem,
                        menuName = $(e.target).parents('[data-menu-item-name]').first().attr('data-menu-item-name'),
                        tempData;
                    $.each(menuName.split('-'), function (index, name) {
                        tempData = menuData[name]
                        if (!tempData)
                            tempData = menuData.subMenu[name];
                        menuData = tempData;
                    });
                    if (!menuData || !menuData.onItem) return true;
                    if ($(e.currentTarget).hasClass('disabled')) return false;
                    return menuData.onItem(echartsGraph, e);
                }
            });
            this.chart.on('drag', function (params) {
                echartsGraph.dragging = true;
                echartsGraph.chart.dispatchAction({
                    type: 'unfocusNodeAdjacency',
                    seriesIndex: params.seriesIndex,
                    dataIndex: params.dataIndex
                });
            });
            this.chart.on('dragend', function (params) {
                // if (echartsGraph.graph.nodes[params.data.name])
                //     echartsGraph.graph.nodes[params.data.name].fixed = true;
                // echartsGraph.dragging = false;
            });

            var that = this;
            this.chart.on('contextmenu', function (params) {
                echartsGraph.hasChartParam = true;
                echartsGraph.chartParam = params;
                $('#' + that.options.graphContainerId).contextmenu('show', params.event.event);
            });
            this.chart.on('mouseout', function (params) {
                echartsGraph.hasChartParam = false;
            });

            $('.dropdown-submenu').on('mouseover', function () {
                if (!$(this).hasClass('disabled'))
                    $(this).addClass('open');
            });
            $('.dropdown-submenu').on('mouseout', function () {
                $(this).removeClass('open');
            });
        }

    ,
    closeContextMenu: function () {
        $('#' + this.options.graphContainerId).contextmenu('closemenu');
    }
    ,
    doNodeSnapShot() {
        var graph = this.graph;
        var echartsInstance = this.chart;
        var snapShot = {};
        echartsInstance._model.eachSeriesByType('graph', function (graphSeries) {
            var echartsGraph = graphSeries.getGraph();
            var nodeData = echartsGraph.data;
            for (var i in nodeData._idList) {
                var nodeId = nodeData._idList[i];
                var point = nodeData.getItemLayout(i);
                snapShot[nodeId] = {
                    fixed: graphSeries.forceLayout.getFixedByRawIndex(nodeData.getRawIndex(i)),
                    x: point[0],
                    y: point[1],
                    hidden: graph.nodes[nodeId].hidden,
                    folded: graph.nodes[nodeId].folded
                }
            }
        });
        $.each(graph.nodes, function (id, data) {
            if (snapShot[id]) return;
            snapShot[id] = {
                fixed: data.fixed,
                x: data.x,
                y: data.y,
                hidden: data.hidden,
                folded: data.folded
            }
        });
        return snapShot;
    }
    ,
    fold: function (nodeId, notRedrawGraph) {
        var graph = this.graph;
        //寻找nodeId的相关节点，若该节点的相关节点中除了nodeId,其他都处于隐藏状态，这次折叠时可将该节点隐藏
        this.operations.push(this.doNodeSnapShot());
        $.each(graph.getRelativeNodeIds(nodeId), function (i, nodeId1) {
            var count = 0;
            $.each(graph.getRelativeNodeIds(nodeId1), function (j, nodeId2) {
                if (!graph.nodes[nodeId2].hidden) count++;
            });
            if (count <= 1 &&
                (graph.getFilteredLinks(nodeId, nodeId1).length == 0 || graph.getFilteredLinks(nodeId1, nodeId).length == 0)
            )
                graph.nodes[nodeId1].hidden = true;
        });
        graph.nodes[nodeId].folded = true;
        if (!notRedrawGraph)
            this.drawGraph();
        return this;
    }
    ,
    unfold: function (nodeId) {
        var graph = this.graph;
        this.operations.push(this.doNodeSnapShot());
        $.each(graph.getRelativeNodeIds(nodeId), function (i, nodeId1) {
            graph.nodes[nodeId1].hidden = false;
        });
        graph.nodes[nodeId].folded = false;
        this.drawGraph();
        return this;
    }
    ,
    resetNode: function (nodeId) {
        this.operations.push(this.doNodeSnapShot());
        this.graph.nodes[nodeId].fixed = undefined;
        this.chart.getModel().eachSeriesByType('graph', function (graphSeries) {
            var graph = graphSeries.getGraph();
            var nodeData = graph.data;
            var rawIndex = nodeData.indexOfName(nodeId);
            graphSeries.forceLayout.setUnfixedByRawIndex(rawIndex);
        });
        this.drawGraph();
        return this;
    }
    ,
    hideNode: function (nodeId) {
        this.hideNodes([nodeId])
    }
    ,
    hideNodes: function (nodeIds) {
        this.operations.push(this.doNodeSnapShot());
        for (var i in nodeIds)
            this.graph.nodes[nodeIds[i]].hidden = true;
        this.drawGraph();
        return this;
    }
    ,
    showNodes: function (nodeIds) {
        this.operations.push(this.doNodeSnapShot());
        for (var i in nodeIds)
            this.graph.nodes[nodeIds[i]].hidden = false;
        this.drawGraph();
        return this;
    }
    ,
    showNode: function (nodeId) {
        this.showNodes([nodeId]);
        return this;
    }
    ,
    setData: function (nodes, links) {
        this.graph.setGraph(nodes, links);
        return this;
    }
    ,
    mergeData: function (nodes, links, ignoreMergeTime) {
        this.graph.mergeGraph(nodes, links, ignoreMergeTime);
        return this;
    }
    ,
    setNodeTooltip: function (nodeId, tooltip) {
        this.graph.nodes[nodeId].tooltip = tooltip;
        return this;
    }
    ,
    resetNodeTooltip: function (nodeId) {
        this.graph.nodes[nodeId].tooltip = undefined;
        return this;
    }
    ,
    setNodeCategory: function (nodeId, categoryName) {
        this.graph.nodes[nodeId].category = categoryName;
        return this;
    }
    ,
    setNodePosition: function (nodeId, position, fixed) {
        this.graph.nodes[nodeId].x = position[0];
        this.graph.nodes[nodeId].y = position[1];
        this.graph.nodes[nodeId].fixed = fixed;
        return this;
    }
    ,
    setNodeStyle: function (nodeId, style) {
        this.graph.nodes[nodeId].style = style;
        return this;
    }
    ,
    resetNodeStyle: function (nodeId) {
        this.graph.nodes[nodeId].style = undefined;
        return this;
    }
    ,
    resetNodeCategory: function (nodeId) {
        if (this.graph.nodes[nodeId])
            this.graph.nodes[nodeId].category = undefined;
        return this;
    }
    ,
    setNodePosition: function (nodeId, position, fixed) {
        this.graph.nodes[nodeId].x = position[0];
        this.graph.nodes[nodeId].y = position[1];
        this.graph.nodes[nodeId].fixed = fixed
        return this;
    }
    ,
    drawGraph: function (keepIsolatedNodes) {
        var categories = this.options.echartsCategories;
        var graph = this.graph;

        var theme = this.options.theme;
        var chartOption = this.options.echartsOptioins;
        var sortedNodes = graph.sortNodeAsc();

        var minLabeledNodeValue = sortedNodes.length > 0 && this.options.labeledNodePercentage > 0 ? sortedNodes[parseInt((1 - this.options.labeledNodePercentage) * sortedNodes.length)].value : -1;
        chartOption.series[0].data = [];
        var hiddenNodes = [], shownNodes = [];
        $.each(sortedNodes, function (index, nodeData) {
            if (!graph.isFilteredOut(nodeData.id) && !graph.nodes[nodeData.id].hidden) {
                shownNodes.push(nodeData);
                chartOption.series[0].data.push($.extend(true, {
                        category: nodeData.category ? nodeData.category : (nodeData.type.autoCreated ? '其他' : nodeData.type.display),
                        symbolSize: nodeData.symbolSize ? nodeData.symbolSize : 10,
                        value: nodeData.value * 10,
                        fixed: nodeData.fixed,
                        x: nodeData.x,
                        y: nodeData.y,
                        type: nodeData.type,
                        label: {
                            normal: {
                                show: nodeData.value > minLabeledNodeValue,
                                position: 'top',
                                textStyle: {
                                    fontSize: 10,
                                },
                                formatter: (function () {
                                    return nodeData.name;
                                }())
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontWeight: 'bolder',
                                    fontSize: 13,
                                }
                            }
                        },
                        itemStyle: nodeData.itemStyle ? nodeData.itemStyle : {
                            normal: {
                                color: nodeData.degree != undefined && graph.getRelativeNodeIds(nodeData.id).length == 1 && nodeData.degree == (graph.getRelatedLinks(nodeData.id).length) && !nodeData.category ? {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.5,
                                    colorStops: [{
                                        offset: 0, color: 'transparent' // 0% 处的颜色
                                    }, {
                                        offset: 0.5, color: 'transparent' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: color[
                                            function () {
                                                var index = 0;
                                                while (index < chartOption.series[0].categories.length) {
                                                    if (chartOption.series[0].categories[index].name == nodeData.type.display)
                                                        break;
                                                    index++
                                                }
                                                index = index % chartOption.series[0].categories.length;
                                                return index;
                                            }()
                                            ] // 100% 处的颜色
                                    }],
                                } : undefined,
                                shadowColor: 'white',
                                shadowBlur: 2,
                                borderWidth: nodeData.marked ? 2 : 0,
                                borderColor: 'red'
                            }
                        }
                    },
                    (nodeData.folded ? {itemStyle: {normal: {color: 'purple'}}} : {}),
                    (categories[nodeData.type.name] ? categories[nodeData.type.name] : {}),
                    (nodeData.category ? categories[nodeData.category] : {}),
                    (nodeData.style ? nodeData.style : {}),
                    (nodeData.tooltip ? {tooltip: nodeData.tooltip} : {}),
                    {name: nodeData.id + ''},
                    {data: nodeData}
                ))
                ;
            }
            else
                hiddenNodes.push(nodeData);
        });

        var maxLinkWidth = this.options.maxLinkWidth;
        chartOption.series[0].links = [];

        $.each(graph.links, function (sourceNodeId, targets) {
            $.each(targets, function (targetNodeId) {

                    var links = graph.getFilteredLinks(sourceNodeId, targetNodeId);

                    if (
                        links.length > 0 &&
                        graph.nodes[sourceNodeId] && !graph.nodes[sourceNodeId].hidden &&
                        graph.nodes[targetNodeId] && !graph.nodes[targetNodeId].hidden
                    ) {
                        chartOption.series[0].links.push($.extend(true, {
                            links: links,
                            title: graph.nodes[sourceNodeId].name + '->' + graph.nodes[targetNodeId].name
                        }, {
                            source: sourceNodeId,
                            target: targetNodeId,
                            value: graph.links[sourceNodeId][targetNodeId].value * 10,
                            lineStyle: {
                                normal: {
                                    width: links.length > maxLinkWidth ? maxLinkWidth : links.length,
                                    curveness: 0.1,
                                    color: function () {
                                        var marked = false;
                                        $.each(links, function (index) {
                                            if (links[index].marked)
                                                marked = true;
                                        })
                                        return marked ? 'red' : (theme == 'dark' ? '#ffffff' : '#444');
                                    }()
                                },
                                emphasis: {
                                    shadowColor: theme == 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 10
                                }
                            },
                            symbol: ['circle', 'arrow'],
                            symbolSize: [4, 10],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'middle',
                                    formatter: (function () {
                                        var relations = $.unique(links.map(function (link) {
                                            return link.type.display
                                        }));
                                        return (relations[0] ? relations[0] : '') + (relations[1] ? ', ' + relations[1] : '') + (relations[2] ? '...' : '');
                                    }()),
                                    textStyle: {
                                        color: theme == 'dark' ? '#fff' : '#333'
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    formatter: (function () {
                                        var relations = $.unique(links.map(function (link) {
                                            return link.type.display;
                                        }));
                                        return (relations[0] ? relations[0] : '') + (relations[1] ? ', ' + relations[1] : '') + (relations[2] ? '...' : '');
                                    }()),
                                    textStyle: {
                                        color: theme == 'dark' ? '#fff' : '#333'
                                    }
                                }
                            }
                        }));
                    }
                }
            );
        });

        this.chart.resize("100%", "100%");
        this.chart.setOption(chartOption);
        if (this.options.onGraphUpdated)
            this.options.onGraphUpdated(shownNodes, hiddenNodes);
        return this;
    }
    ,
    doFilter: function (filter, keepIsolatedNodes) {
        this.graph.filter = $.extend(true, this.graph.filter, filter);
        return this.drawGraph(keepIsolatedNodes);
    }
    ,
    prevGraph: function (notDrawGraph) {
        this.graph.goBack();
        this.graph.resetFilter();
        this.graph.operations = [];
        if (!notDrawGraph)
            this.drawGraph();
    }
    ,
    prevOperation: function () {
        var graph = this.graph;
        var snapshot = this.operations.pop();
        if (!snapshot) return;
        $.each(snapshot, function (nodeId, nodeState) {
            graph.nodes[nodeId].hidden = nodeState.hidden;
            graph.nodes[nodeId].x = nodeState.x;
            graph.nodes[nodeId].y = nodeState.y;
            graph.nodes[nodeId].fixed = nodeState.fixed;
            graph.nodes[nodeId].folded = nodeState.folded;
        });
        this.drawGraph();
        return this;
    }
    ,
    resetOperation: function () {
        this.operations = [];
        return this;
    }
    ,
    resetGraph: function (redrawGraph) {
        var graph = this.graph;
        $.each(graph.nodes, function (nodeId) {
            graph.nodes[nodeId].hidden = undefined;
            graph.nodes[nodeId].fixed = undefined;
            graph.nodes[nodeId].folded = undefined;
        });
        this.operations = [];
        if (redrawGraph)
            this.drawGraph();
        if (this.chart.getModel())
            this.chart.getModel().eachSeriesByType('graph', function (graphSeries) {
                graphSeries.forceLayout.unfixAll();
            });
        return this;
    }
    ,
    clearGraph: function () {
        this.graph.clear();
        this.operations = [];
        // this.drawGraph();
        return this;
    }
}
;
EChartsGraph.instances = {};
EChartsGraph.init = function (options) {
    var containerId = options.graphContainerId ? options.graphContainerId : 'graphChart';
    var graphInstance = new EChartsGraph(options);
    EChartsGraph.instances[containerId] = graphInstance;
    return graphInstance;
};
/**
 * 判断jsonobject是否为空
 * @param obj
 * @return {boolean}
 */
EChartsGraph.isEmptyObject = function isEmptyObject(obj) {
    var empty = true;
    if (typeof obj === "object" && !(obj instanceof Array)) {
        for (var prop in obj) {
            empty = false;
            break;
        }
    }
    return empty;
}

export default EChartsGraph;