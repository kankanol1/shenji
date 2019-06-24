(function () {
    'use strict';
    window.CytoScapeGraph = function (options) {
        this.options = $.extend(true, {}, this.defaultOptions, options);
        this._init();
    };
    CytoScapeGraph.prototype = {
        // colors: ['#CECECE','#67A3EC','#CCFF99', '#f7cb4a', '#f88d48', '#f35352'],
        //colors: ['#71A9FF', '#9bcc66', '#3fb27e', '#3F3FBF', '#f7cb4a', '#f35352'],
        colors: ['#00B0F0', '#9bcc66', '#00B050', '#3F3FBF', '#f7cb4a', '#f35352'],
        foldedElements: {},
        legendOffElements: {},//图例未被选中的节点
        defaultOptions: {
            container: $('#graph'),
            cytoScapeOption: {},
            classes: {},
            nodeTypes: {},
            linkTypes: {},
            toolbar: {},
            contextMenu: {},
            filter: {},
            nodeLabelFormatter: function (ele) {
                var dataName = ele.data().name;
                if(dataName!=null){
                    var len = dataName.length;
                    if(len>5){
                        dataName = ele.data().name.substr(0,5) +"...";
                    }
                }


                return dataName;
            },
            linkLabelFormatter: function (ele) {
                return ele.data().type.display
            },
            nodeTooltipFormatter: function (target) {
                var tooltip = {
                    title: '',
                    content: ''
                };
                var data = target.data();
                tooltip.title = data.name;
                tooltip.content = '<strong>节点类型：</strong>' + data.type.display;
                return tooltip;
            },
            linkTooltipFormatter: function (target) {
                var tooltip = {
                    title: '',
                    content: ''
                };
                var data = target.data();
                var sourceData = target.source().data();
                var targetData = target.target().data();
                tooltip.content = '<table>' +
                    '<tr><td style="width: 100px"><strong>起始节点：</strong></td><td style="width: 200px">' + sourceData.name + '(' + sourceData.type.display + ')' + '</td></tr>' +
                    '<tr><td><strong>终止节点：</strong></td><td>' + targetData.name + '(' + targetData.type.display + ')' + '</td></tr>' +
                    '<tr><td><strong>关系类型：</strong></td><td>' + data.type.display + '</td></tr></table>';
                return tooltip;
            }
        },
        _init: function () {
            var that = this;
            $(this.options.container).append('<table class="cytoscape-graph-legend"></table>');
            $(this.options.container).append('<div class="cytoscape-graph-container"></div>');
            $(this.options.container).append('<div id="graphLoadingContainer"><div class="spinner"></div></div>');
            var optionLegend = ($.extend(true, {
                boxSelectionEnabled: true,
                layout: {name: 'random'},
                fit: true
            }, this.options.cytoScapeOption, {container: $(this.options.container).find('.cytoscape-graph-container')}));
            var cy = cytoscape(optionLegend)
           /* cy.pon('layoutstop').then(function (event) {
                //for (var i = 0; i < 10; i++) {
                    $("#tool-4-0").trigger("click");

                    setTimeout(function(){//1秒后跳转
                        $("#tool-4-0").trigger("click");
                    },1000);
                    // setTimeout(function(){//两秒后跳转
                    //     $("#tool-4-0").trigger("click");
                    // },2000);
                    // setTimeout(function(){//两秒后跳转
                    //     $("#tool-4-0").trigger("click");
                    // },3000);


                //}
            });*/
            cy.style()
                .selector('node')
                .style({
                    'label': this.options.nodeLabelFormatter,
                    'font-size': '10px',
                    'width': '12px',
                    'height': '12px'
                })

                .selector(':parent')
                .style({
                    'background-opacity': 0.333,
                    "background-color": "#5bc0de",
                })
                .selector('node.cy-expand-collapse-collapsed-node')
                .style({
                    "background-color": "darkblue",
                    "shape": "rectangle"
                })
                .selector('edge')
                .style({
                    'target-arrow-shape': 'triangle',
                    'target-arrow-size': '0.5px',
                    'curve-style': 'bezier',
                    'text-outline-color': 'white',
                    'text-outline-width': '2px',
                    'label': this.options.linkLabelFormatter,
                    'font-size': '10px',
                    'width': '1px',
                    'text-rotation': 'autorotate',
                })
                .selector('.light-off')
                .style({
                    'opacity': '0.1',
                })

                .selector('edge:selected')
                .style({
                    'width': '2px',
                });
            cy.style().selector('.center')
                .style({
                    'width': '24px',
                    'height': '24px',
                    'border-color': "#e1a23d",
                    'border-width': "2",
                });
            cy.style().selector('.middle')
                .style({
                    'width': '18px',
                    'height': '18px',
                    'border-color': "#e1a23d",
                    'border-width': "2",
                });
            /*cy.style().selector('.authority')
                .style({
                    'background-color': 'black'
                });*/
            //节点颜色
            var index = 0;
            $.each(this.options.nodeTypes, function (type, typeData) {
                cy.style().selector('.' + type)
                    .style({
                        'background-color': that.colors[index % that.colors.length]
                    });
                $(that.options.container).find('.cytoscape-graph-legend')
                    .append('<tr><td><button data-node-type="' + type + '" class="cytoscape-graph-legend-item" style="background: ' + that.colors[index % that.colors.length] + '"></button></td><td>' + typeData.display + '</td></tr>');
                index++;
            });
            var typeNodes = [];
            $.each(this.options.nodeTypes, function (type, typeData) {
                typeNodes.push(type)
            })
            $(that.options.container).find('.cytoscape-graph-legend button.cytoscape-graph-legend-item').on('click', function (event) {
                if ($(this).hasClass('inactive')) {
                    $(this).removeClass('inactive');
                    that.resetGraph();
                    let notSelected = [];
                    for (let i in typeNodes) {
                        if (typeNodes[i] != $(this).attr('data-node-type')) {
                            if ($("button[data-node-type = " + typeNodes[i] + "]").hasClass('inactive')) {
                                notSelected.push(typeNodes[i]);
                                that.legendOff(typeNodes[i]);
                            }
                        }
                    }
                }
                else {
                    $(this).addClass('inactive');
                    that.legendOff($(this).attr('data-node-type'));
                }

            });

            $.each(this.options.classes, function (selector, style) {
                cy.style()
                    .selector('.' + selector)
                    .style(style);
            });

            cy.style()
                .selector('.folded')
                .style({
                    'shape': 'diamond'

                })
                .selector(':selected')
                .style({
                    'border-color': "#c84e40",
                    'border-width': "2",
                    'line-color': '#c84e40',
                    'target-arrow-color': '#c84e40',
                });


            //加载工具栏
            var tools = [
                [
                    {
                        icon: 'fa fa-magic',
                        event: ['tap'],
                        selector: 'node',
                        tooltip: '高亮邻居节点',
                        action: [
                            function (event) {
                                var ids = [];
                                event.cy.elements('node:selected').forEach(function (ele) {
                                    if (ele.data().compound) return;
                                    ids.push(ele.id());
                                });
                                that.lightOn(ids);
                                event.cy.once('click', function (e) {
                                    that.lightOff();
                                });
                            }
                        ]
                    }
                ],
                [
                    {
                        icon: 'fa fa-refresh',
                        event: ['tap'],
                        selector: 'node',
                        tooltip: '刷新布局',
                        action: [
                            function (event) {
                                that.refreshButtonLayout();
                            }
                        ]
                    }
                ],
                [
                    {
                        icon: 'fa fa-th',
                        event: ['tap'],
                        selector: 'node',
                        tooltip: '网格布局',
                        action: [
                            function (event) {
                                that.refreshLayout('grid');
                            }
                        ]
                    }
                ],
                [
                    {
                        icon: 'fa fa-connectdevelop',
                        event: ['tap'],
                        selector: 'node',
                        tooltip: '环形布局',
                        action: [
                            function (event) {
                                that.refreshLayout('circle');
                            }
                        ]
                    }
                ],
                [
                    {
                        icon: 'fa fa-scissors',
                        event: ['tap', 'click'],
                        selector: 'node',
                        tooltip: '局部导出',
                        action: [
                            function (event) {
                                var userInfo = sessionStorage.getItem("userInfo")||"{}";
                                userInfo = JSON.parse(userInfo);
                                if(userInfo.office){
                                    var exp = userInfo.office.exp;
                                    if(exp==0){
                                        if(that.showMessage){
                                            that.showMessage();
                                        }
                                        return;
                                    }
                                }
                                if (event.cy.elements('node:selected').size() == 0) return;
                                var compoundId = that.formUid();
                                event.cy.add({
                                    data: {
                                        id: compoundId,
                                        compound: true,
                                        parent: event.cy.elements('node:selected').data('parent')
                                    },
                                });
                                event.cy.elements('node:selected').move({parent: compoundId});
                                setTimeout(function () {
                                    var compoundIdId = event.cy.getElementById(compoundId);
                                    var zoom = that.cy.zoom();
                                    var w = compoundIdId.width();
                                    var h = compoundIdId.height();
                                    var size = {
                                        w: w * zoom + 10,
                                        h: h * zoom + 10
                                    }
                                    var x = compoundIdId.renderedPosition('x');
                                    var y = compoundIdId.renderedPosition('y');
                                    var position = {
                                        l: x - size.w / 2,
                                        t: y - size.h / 2
                                    };
                                    var url = that.getCanvasUrl(event.cy._private.container.children[1].lastChild, position, size);
                                    var image = new Image()
                                    // 解决跨域 Canvas 污染问题
                                    image.setAttribute('crossOrigin', 'anonymous')
                                    image.onload = function () {
                                        var canvas = document.createElement('canvas')
                                        canvas.width = image.width
                                        canvas.height = image.height

                                        var context = canvas.getContext('2d');
                                        context.fillStyle = "#fff";
                                        context.drawImage(image, 0, 0, image.width, image.height);
                                        that.drawWatermark(canvas);

                                        var url = canvas.toDataURL('image/png')

                                        // 生成一个a元素
                                        var a = document.createElement('a')
                                        // 创建一个单击事件
                                        var event = new MouseEvent('click')

                                        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                                        a.download = name || 'picture'
                                        // 将生成的URL设置为a.href属性
                                        a.href = url

                                        // 触发a的单击事件
                                        a.dispatchEvent(event)
                                    }
                                    image.src = url;
                                    // window.open(url);
                                }, 1000);
                            }]
                    },
                ],
                [
                    {
                        icon: 'fa fa-file-image-o',
                        event: ['tap', 'click'],
                        selector: 'node',
                        tooltip: '全图导出',
                        action: [
                            function (event) {
                                var userInfo = sessionStorage.getItem("userInfo")||"{}";
                                userInfo = JSON.parse(userInfo);
                                if(userInfo.office){
                                    var exp = userInfo.office.exp;
                                    if(exp==0){
                                        if(that.showMessage){
                                            that.showMessage();
                                        }
                                        return;
                                    }
                                }
                                var canvas = event.cy._private.container.children[1].lastChild;
                                var size = {
                                    w: canvas.width,
                                    h: canvas.height
                                }
                                var url = that.getCanvasUrl(canvas, {l: 0, t: 0}, size);
                                var image = new Image()
                                // 解决跨域 Canvas 污染问题
                                image.setAttribute('crossOrigin', 'anonymous')
                                image.onload = function () {

                                    var canvas = document.createElement('canvas')
                                    canvas.width = image.width
                                    canvas.height = image.height

                                    var context = canvas.getContext('2d');
                                    context.fillStyle = "#fff";
                                    context.drawImage(image, 0, 0, image.width, image.height);
                                    that.drawWatermark(canvas);

                                    var url = canvas.toDataURL('image/png')

                                    // 生成一个a元素
                                    var a = document.createElement('a')
                                    // 创建一个单击事件
                                    var event = new MouseEvent('click')

                                    // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                                    a.download = name || 'picture'
                                    // 将生成的URL设置为a.href属性
                                    a.href = url

                                    // 触发a的单击事件
                                    a.dispatchEvent(event)
                                }
                                image.src = url;
                            }]
                    },
                ],

                [
                    {
                        icon: 'fa fa-object-group',
                        event: ['tap', 'click'],
                        selector: 'node',
                        tooltip: '将选中节点作为组合节点',
                        action: [function (event) {
                            if (event.cy.elements('node:selected').size() == 0) return;
                            var compoundId = that.formUid();
                            event.cy.add({
                                data: {
                                    id: compoundId,
                                    compound: true,
                                    parent: event.cy.elements('node:selected').data('parent')
                                }
                            });
                            event.cy.elements('node:selected').move({parent: compoundId});
                        }]
                    },
                ],
                [
                    {
                        icon: 'fa fa-object-ungroup',
                        event: ['tap'],
                        selector: 'node',
                        tooltip: '删除选中分组',
                        action: [function (event) {
                            var parent = event.cy.elements(':selected').data().parent;
                            event.cy.elements(':selected').forEach(function (ele) {
                                if (ele.data().compound) {
                                    var children = ele.children();
                                    children.move({parent: parent ? parent : null});
                                    ele.remove();
                                }
                            });
                        }]
                    },
                ]
            ];
            $.each(this.options.toolbar, function (name, value) {
                tools.push(value);
            });
            cy.ready(function () {
                cy.toolbar({
                    toolbarContainer: $(that.options.container),
                    tools: tools,
                    appendTools: true,
                    position: 'top',
                    toolbarClass: 'ui-cytoscape-toolbar toolbar-container',
                    zIndex: 10
                });
            });
            //加载提示框
            this.tooltipsApi = $(this.options.container).qtip({
                prerender: true,
                content: {
                    text: ''
                },
                position: {
                    target: 'mouse',
                    container: $(this.options.container),
                    adjust: {
                        mouse: false
                    }
                },
                hide: {
                    leave: false,
                    event: 'click',
                    effect: function () {
                        $(this).slideUp(100);
                    }
                },
                show: {
                    event: false,
                    effect: function () {
                        $(this).slideDown(100);

                    }
                },
                style: {
                    tip: {
                        corner: true,
                    },
                    classes: 'qtip-light qtip-rounded qtip-shadow qtip-custom',

                }
            }).qtip('api');

            //加载单击事件
            cy.on('tap', function (event) {
                var evtTarget = event.target;
                //点击权限验证
                if(evtTarget._private.data){
                    var origin = evtTarget._private.data.origin;
                    if(origin){
                        if(!origin.permission || !origin.propertyList){
                            return;
                        }
                    }
                }
                if (evtTarget === cy) {
                    // that.hideTooltip(evtTarget);
                } else {
                    that.showTooltip(evtTarget);
                }
            });
            //加载右键菜单
            this.cxtmenuApi = cy.cxtmenu({
                selector: 'node',
                commands: function (element) {
                    var origin = element._private.data.origin;
                    const available = [];
                    const availableDefault = [
                        {
                            content: '高亮邻居',
                            authControl:'true',
                            select: function (ele) {
                                that.lightOn([ele.id()]);
                                that.cy.once('click', function (e) {
                                    that.lightOff();
                                });
                            }
                        },
                        {
                            content: '删除节点',
                            authControl:'true',
                            select: function (ele) {
                                that.cy.remove(ele);
                                var nodes = that.cy.nodes();
                                var links = that.cy.edges();
                                $.each(nodes, function (index, node) {
                                    var edges = links.filter(function (o) {
                                        return o.data().origin.startNode === node.data().origin.id
                                            || o.data().origin.endNode === node.data().origin.id
                                    });
                                    if (edges.length == 0) {
                                        that.cy.remove(node);
                                    }
                                });
                            }
                        },
                        {
                            content: !element.hasClass('folded') ? '折叠' : '展开',
                            authControl:'true',
                            select: function (ele) {
                                !element.hasClass('folded') ? that.fold(ele.id()) : that.unfold(ele.id())
                            }
                        }
                    ];
                    origin.authList = '高亮邻居,删除节点,折叠,展开,探索';
                    const addRowByAuth = (_origin, list, row) => {
                        if (row.authControl === 'true' && _origin && (!_origin.permission || !_origin.propertyList)) {
                            if (origin.authList.indexOf(row.content) >= 0) {
                                list.push({
                                    content: '无数据权限',
                                });
                                return;
                            }
                        }
                        list.push(row);
                    }
                    // availableDefault是数组
                    $.each(availableDefault, function (i, value) {
                        addRowByAuth(origin, available, value);
                    });
                    // that.options.contextMenu是对象
                    $.each(that.options.contextMenu, function (name, value) {
                        value.authControl = 'true';
                        if (value.available && value.available(element)) {
                            addRowByAuth(origin, available, value);
                        }
                    });
                    if (element.data().compound) return [];
                    return available;
                },
                fillColor: 'rgba(80, 80, 80, 0.75)', // the background colour of the menu
                activeFillColor: 'rgba(51, 192, 222, 0.75)', // the colour used to indicate the selected command
                activePadding: 15, // additional size in pixels for the active command
                indicatorSize: 24, // the size in pixels of the pointer to the active command
                separatorWidth: 3, // the empty spacing in pixels between successive commands
                spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
                minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
                maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
                openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                itemColor: 'white', // the colour of text in the command's content
                itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
                zIndex: 16000, // the z-index of the ui div
                menuRadius: 85,
                atMouse: false // draw menu at mouse position
            });
            this.expandCollapseApi = cy.expandCollapse({
                layoutBy: {
                    name: "cola",
                    animate: "end",
                    randomize: false,
                    fit: true
                },
                fisheye: true,
                animate: true,
                undoable: false
            });
            this.cy = cy;
        },
        legendOn(type) {
            this.legendOffElements[type].restore();
        },
        legendOff(type) {
            var nodes = this.cy.elements('.' + type).remove();
            this.legendOffElements[type] = nodes;
        },
        refreshLayout(layoutName) {
            var layout = this.cy.layout({name: layoutName});
            layout.run();
        },
        showLoading() {
            $(this.options.container).find('#graphLoadingContainer').css('display', 'block');
        },
        hideLoading() {
            $(this.options.container).find('#graphLoadingContainer').css('display', 'none');
        },
        refresh(randomizeNodes) {
            var layout = this.cy.layout({name: 'cola', randomize: randomizeNodes});
            layout.run();
        },
        refreshButtonLayout(randomizeNodes) {
            var that = this;
            var layout = this.cy.layout({name: 'cola', randomize: randomizeNodes});
            layout.run();
            //that.showLoading();
            layout.pon('layoutstop').then(function (event) {
              //  that.hideLoading();
            });
        },
        showLoad() {
            var eTip = document.createElement("div");
            eTip.style.position = 'absolute';
            eTip.style.display = 'none';
            eTip.style.border = 'solid 0px #D1D1D1';
            eTip.style.backgroundColor = '#4B981D';
            eTip.style.padding = '5px 15px';
            eTip.style.top = '10px';
            eTip.style.right = '10px';
            eTip.style.width = '120px';
            eTip.innerHTML = 'loaing......';
            try {
                document.body.appendChild(eTip);
            } catch (e) {
            }
            $("#tipDiv").css("float", "right");
            $("#tipDiv").css("z-index", "99");
            $('#tipDiv').fadeIn();
        },
        closeLoad() {
            $("#tipDiv").fadeOut();
        },
        hide(eleId) {
            this.cy.elements("#" + eleId).neighborhood('node').forEach(function (ele) {
                if (ele.neighborhood('node').length == 1) {
                    ele.remove();
                }
            });
            this.cy.elements("#" + eleId).remove();
        },
        resetGraph() {
            this.mergeData(...this.graphData);
        },
        mergeData: function (nodes, links, randomizeNodes, showAcnode) {
            this.graphData = arguments;
            var elements2Add = [];
            var that = this;
            nodes = nodes || [];
            links = links || [];
            $.each(nodes, function (index, node) {
                var edges = links.filter(function (o) {
                    return o.startNode+'' === node.id+'' || o.endNode+'' === node.id+''
                });
                var addFlag = false;
                if (edges.length == 0) {
                    //是否显示孤点，默认不显示孤点
                    if (showAcnode || (links.length == 0 && nodes.length == 1)) {
                        addFlag = true;
                    }
                } else {
                    addFlag = true;
                }
                if (addFlag) {
                    //有权限的正常显示，无权限的节点显示黑色
                    //if(node.permission && node.propertyList!={}){
                        elements2Add.push({
                            group: "nodes",
                            data: {
                                id: 'node-' + node.id,
                                name: node.name,
                                type: that.options.nodeTypes[node.type],
                                origin: node
                            },
                            classes: that.options.nodeTypes[node.type].name + ' ' + node.classes
                        })
                    //}else {
                        /*elements2Add.push({
                            group: "nodes",
                            data: {
                                id: 'node-' + node.id,
                                name: node.name,
                                type: 'authority',
                                origin: node
                            },
                            classes: 'authority' + ' ' + node.classes
                        })
                    }*/
                }


            });
            $.each(links, function (index, link) {
                elements2Add.push({
                    group: "edges",
                    data: {
                        id: 'link-' + link.id,
                        source: 'node-' + link.startNode,
                        target: 'node-' + link.endNode,
                        type: that.options.linkTypes[link.type],
                        origin: link
                    },
                    classes: link.classes
                })
            });
            this.cy.add(elements2Add);

            this.refresh(randomizeNodes);
        },
        clearGraph() {
            this.cy.remove(this.cy.elements());
        },
        doFilter: function (filter) {

        },
        resetFilter: function () {

        },

        flow: function (nodeId1, nodeId2) {
            var position = $.extend(true, {}, this.cy.elements('#' + nodeId1).position());
            var dijkstra = this.cy.elements().dijkstra('#' + nodeId1, function () {
                return 1;
            });
            var nodesOnPath = [];
            var pathToJ = dijkstra.pathTo(this.cy.$('#' + nodeId2));
            pathToJ.forEach(function (element) {
                if (element.isNode()) {
                    nodesOnPath.push(element);
                }
            })
            nodesOnPath.shift();
            nodesOnPath.reverse();

            var dot = this.cy.add({
                group: "nodes",
                position: position,
                style: {
                    'width': 10,
                    'height': 10,
                    //'z-index':10,
                    'background-color': "red"
                }
            });

            this.cy.$("edge").style("curve-style", "haystack");
            this.cy.userPanningEnabled(false);
            this.cy.userZoomingEnabled(false);
            this.cy.autounselectify(true);
            this.cy.autoungrabify(true);
            for (var j = nodesOnPath.length - 1; j >= 0; j--) {
                dot.animate({
                        position: nodesOnPath[j].position(),
                    }, {
                        duration: 2000
                    }
                )
            }
            var that = this;
            this.cy.delay(2000 * nodesOnPath.length, function () {
                dot.remove();
                that.cy.$("edge").style("curve-style", "bezier");
                that.cy.userPanningEnabled(true);
                that.cy.userZoomingEnabled(true);
                that.cy.autounselectify(false);
                that.cy.autoungrabify(false);
            });
        },
        fold: function (foldId) {
            var foldedElements = this.foldedElements;
            this.cy.elements("#" + foldId).addClass("folded");
            foldedElements[foldId] = [];
            this.cy.elements("#" + foldId).neighborhood('node').forEach(function (ele) {
                if (ele.neighborhood('node').length == 1) {
                    foldedElements[foldId].push(ele.remove());
                }
            })
        },

        unfold: function (unfoldId) {
            var unfoldCollections = this.foldedElements[unfoldId];
            unfoldCollections.forEach(function (value) {
                value.restore();
            });
            this.cy.elements('#' + unfoldId).removeClass('folded');
        },
        lightOn: function (ids) {
            if (!ids || ids.length == 0) return;
            var cy = this.cy;
            var lightOn = this.cy.nodes('edge');
            ids.forEach(function (id) {
                lightOn.merge(cy.elements('#' + id).neighborhood().merge(cy.elements('#' + id)));
            });
            this.cy.elements().difference(lightOn).addClass("light-off");
        },
        lightOff: function () {
            this.cy.elements().removeClass("light-off");
        },
        lineFlow: function (lineFlowId1, lineFlowId2) {
            var dijkstra = this.cy.elements().dijkstra('#' + lineFlowId1, function () {
                return 1;
            });
            var pathToJ = dijkstra.pathTo(this.cy.$('#' + lineFlowId2));
            for (var j = pathToJ.length - 1; j >= 0; j--) {
                var edge = pathToJ[j];
                edge.delay((j) * 500).animate({
                    style: {
                        'background-color': '#61bffc',
                        'line-color': '#61bffc',
                        'target-arrow-color': '#61bffc'
                    },
                    duration: 500
                })
            }
        },
        showTooltip(target) {
            if (target.data().compound) return;
            // this.hideTooltip(target);
            var that = this;
            var tooltip;
            target.isNode() && (tooltip = this.options.nodeTooltipFormatter(target));
            target.isEdge() && (tooltip = this.options.linkTooltipFormatter(target));
            setTimeout(function () {
                that.tooltipsApi.set('content.title', tooltip.title);
                that.tooltipsApi.set('content.text', tooltip.content);
                that.tooltipsApi.toggle(true);
            }, 50);
        },
        hideTooltip(target) {
            this.tooltipsApi.toggle(false);
        },
        formUid() {
            return function guid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xgby]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }();
        },
        getCanvasUrl(canvas1, position, size) {
            // console.log(position,size);
            var l = position.l || 0;
            var t = position.t || 0;
            var w = size.w || 10;
            var h = size.h || 10;
            var cxt1 = canvas1.getContext("2d")
            var dataImg = cxt1.getImageData(l, t, w, h)
            var canvas2 = document.createElement("canvas")
            var cxt2 = canvas2.getContext("2d")
            canvas2.width = w;
            canvas2.height = h;
            cxt2.fillStyle = "#fff";
            cxt2.putImageData(dataImg, 0, 0, 0, 0, canvas2.width, canvas2.height)
            return canvas2.toDataURL("image/png");
        },
        drawWatermark(crw) {


            var cw = document.createElement('canvas');
            var opt = {
                fontStyle: "20px microsoft yahei", //水印字体设置
                rotateAngle: -30 * Math.PI / 180, //水印字体倾斜角度设置
                fontColor: "rgba(0, 0, 0, 0.4)", //水印字体颜色设置
                firstLinePositionX: -20, //canvas第一行文字起始X坐标
                firstLinePositionY: 80, //Y
                SecondLinePositionX: 0, //canvas第二行文字起始X坐标
                SecondLinePositionY: 70 //Y
            };
            var ctx = cw.getContext("2d");
            //清除小画布
            ctx.clearRect(0, 0, 160, 100);
            ctx.font = opt.fontStyle;
            //文字倾斜角度
            ctx.rotate(opt.rotateAngle);

            ctx.fillStyle = opt.fontColor;
            //第一行文字
            ctx.fillText(this.getUserName(), opt.firstLinePositionX, opt.firstLinePositionY);
            //第二行文字
            //ctx.fillText(window.watermark.mobile, self.opt.SecondLinePositionX, self.opt.SecondLinePositionY);
            //坐标系还原
            ctx.rotate(-opt.rotateAngle);

            var ctxr = crw.getContext("2d");
            var pat = ctxr.createPattern(cw, "repeat");
            ctxr.fillStyle = pat;
            ctxr.fillRect(0, 0, crw.width, crw.height);
        },
        getUserName() {
            var that = this;
            var userName = '';
            $.ajax({
                url: '/api/user/info',
                method: 'post',
                async: false,
                data: {},
                success: function (response) {
                    that.userName = response.data.officedesc
                        + '\t' + response.data.name
                        + '\t' + (response.data.tel ? response.data.tel : '');
                }
            });
            return that.userName;
        }
    };

})();
