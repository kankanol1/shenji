<style>

</style>
<template>
    <Modal v-model="showModal"
           title="自定义探索配置"
           @on-ok="ok"

    >

        <div v-if="loading">
            <Row>
                <i-col span="1" offset="11">
                    <Spin size="small"></Spin>
                </i-col>
                <i-col span="1">
                    <Spin size="small"></Spin>
                </i-col>
                <i-col span="1">
                    <Spin size="small"></Spin>
                </i-col>
            </Row>
            <Row style="margin-top: 10px">
                <i-col span="6" offset="11">
                    <span>加载中……</span>
                </i-col>
            </Row>
        </div>
        <Form v-if="!loading" :model="formItem" :label-width="100" id="configForm">
            <!--<Form-item label="节点类型">-->
            <!--<Checkbox-->
            <!--:indeterminate="indeterminateNode"-->
            <!--:value="checkAllNode"-->
            <!--@click.prevent.native="handleCheckAll('node')"-->
            <!--style="padding: 0 15px;border-right: 1px solid #eeeeee">全选-->
            <!--</Checkbox>-->
            <!--<Checkbox-group v-model="formItem.nodeType" style="display: inline;">-->
            <!--<Checkbox v-for="(type,name) in nodeTypes" :label="name">-->
            <!--{{type.display}}-->
            <!--</Checkbox>-->
            <!--</Checkbox-group>-->
            <!--</Form-item>-->
            <!--<Form-item label="与中心节点关系">-->
            <!--<Checkbox-->
            <!--:indeterminate="indeterminateLink"-->
            <!--:value="checkAllLink"-->
            <!--@click.prevent.native="handleCheckAll('link')"-->
            <!--style="padding: 0 15px;border-right: 1px solid #eeeeee">全选-->
            <!--</Checkbox>-->
            <!--<Checkbox-group v-model="formItem.linkType" style="display: inline;">-->
            <!--<Checkbox v-for="(type,name) in linkTypes" :label="name">{{type.display}}</Checkbox>-->
            <!--</Checkbox-group>-->
            <!--</Form-item>-->
            <!--<Form-item label="节点权值范围">-->
            <!--<Input-number v-model="formItem.nodeWeight[0]" style="width: 100px"></Input-number>-->
            <!--<span>&#45;&#45;</span>-->
            <!--<Input-number v-model="formItem.nodeWeight[1]" style="width: 100px"></Input-number>-->
            <!--</Form-item>-->
            <!--<Form-item label="边金额范围">-->
            <!--<Input-number v-model="formItem.linkWeight[0]" style="width: 100px"></Input-number>-->
            <!--<span>&#45;&#45;</span>-->
            <!--<Input-number v-model="formItem.linkWeight[1]" style="width: 100px"></Input-number>-->
            <!--<small style="color: red"> (仅用于支付关系)</small>-->
            <!--</Form-item>-->
            <!--<Form-item label="节点排名范围">-->
            <!--<Row>-->
            <!--<Col span="7">-->
            <!--<Slider v-model="formItem.nodeSortRange" range style="width: 200px;"></Slider>-->
            <!--</Col>-->
            <!--<Col span="6">-->
            <!--<Input-number v-model="formItem.nodeSortRange[0]"-->
            <!--style="width: 70px;"></Input-number>-->
            <!--<span>&#45;&#45;</span>-->
            <!--<Input-number v-model="formItem.nodeSortRange[1]" style="width: 70px"></Input-number>-->
            <!--</Col>-->
            <!--<Col span="11">-->
            <!--<small v-if="formItem.nodeSortRange[1]-formItem.nodeSortRange[0]>50" style="color: red">-->
            <!--<Icon type="android-warning"></Icon>-->
            <!--(请求点数过多可能会造成浏览器卡顿、崩溃，请慎重选择)-->
            <!--</small>-->
            <!--</Col>-->
            <!--</Row>-->
            <!--<Row>-->
            <!--<Radio-group v-model="formItem.sortType">-->
            <!--<Radio label="origin">按自然顺序排序</Radio>-->
            <!--<Radio label="weigth">按节点重要性排序</Radio>-->
            <!--</Radio-group>-->
            <!--</Row>-->
            <!--</Form-item>-->

            <div style="margin-bottom: 15px;font-size:15px;text-align: center;width: 100% ">
                该节点共有邻居节点 <strong>{{total}}</strong> 个
            </div>
            <Form-item label="页数">
                <Input-number v-model="formItem.page" :max="maxPage" :min="1"></Input-number>
            </Form-item>
            <Form-item label="每页节点数量">
                <Row>
                    <Col>
                    <Slider v-model="formItem.size" show-input style="width: 75%" :min="1"></Slider>
                    </Col>
                    <Col>
                    <small v-if="formItem.size>50" style="color: red">
                        <Icon type="android-warning"></Icon>
                        (请求点数过多可能会造成浏览器卡顿、崩溃，请慎重选择)
                    </small>
                    </Col>
                </Row>
                <Row>
                    <Radio-group v-model="formItem.sortType">
                        <Radio label="weight">按节点重要性排序</Radio>
                    </Radio-group>
                </Row>
            </Form-item>
            <Form-item label="折叠其他相关点">
                <i-switch v-model="formItem.delete"></i-switch>
                <Tooltip content="是否隐藏图上只与该节点相关的已有节点" placement="top">
                    <Button type="text" shape="circle" icon="ios-help-outline"
                            style="padding: 0px;width: 0px"></Button>
                </Tooltip>
            </Form-item>
        </Form>
    </Modal>

</template>

<script>
    import Util from '../libs/util';


    export default {
        props: ['nodeTypes', 'linkTypes'],
        watch: {
            'formItem.nodeType': function (curVal, oldVal) {
                var flag = true;
                for (var name in this.nodeTypes) {
                    if (curVal.indexOf(name) < 0)
                        flag = false;
                }
                if (curVal.length > 0 && !flag) {
                    this.indeterminateNode = true;
                    this.checkAllNode = false;
                }
                if (curVal.length == 0) {
                    this.indeterminateNode = false;
                    this.checkAllNode = false;
                }
                if (flag) {
                    this.indeterminateNode = false;
                    this.checkAllNode = true;
                }
            },
            'formItem.linkType': function (curVal, oldVal) {
                var flag = true;
                for (var name in this.linkTypes) {
                    if (curVal.indexOf(name) < 0)
                        flag = false;
                }
                if (curVal.length > 0 && !flag) {
                    this.indeterminateLink = true;
                    this.checkAllLink = false;
                }
                if (curVal.length == 0) {
                    this.indeterminateLink = false;
                    this.checkAllLink = false;
                }
                if (flag) {
                    this.indeterminateLink = false;
                    this.checkAllLink = true;
                }
            },
            'total': function (curVal, oldVal) {
                this.maxPage = Math.ceil(curVal / this.formItem.size)
            },
            'formItem.size': function (curVal, oldVal) {
                this.maxPage = Math.ceil(this.total / curVal);
                if (this.formItem.page > this.maxPage)
                    this.formItem.page = this.maxPage;
            }
        },
        methods: {
            handleCheckAll(type) {
                if (type == 'node') {
                    if (this.checkAllNode)
                        this.formItem.nodeType = [];
                    else {
                        var nodeTypes = this.nodeTypes;
                        this.formItem.nodeType = function () {
                            var ret = [];
                            for (var name in nodeTypes) {
                                ret.push(name);
                            }
                            return ret;
                        }();
                    }
                }
                if (type == 'link') {
                    if (this.checkAllLink)
                        this.formItem.linkType = [];
                    else {
                        var linkTypes = this.linkTypes;
                        this.formItem.linkType = function () {
                            var ret = [];
                            for (var name in linkTypes) {
                                ret.push(name);
                            }
                            return ret;
                        }();
                    }
                }
            },
            show(nodeData, pageInfo) {
                this.nodeData = nodeData;
                this.showModal = true;
                if (!pageInfo)
                    this.loadExploreParam();
                else {
                    this.loading = false;
                    this.total = pageInfo.totalElements;
                }
            },

            loadExploreParam() {
                var that = this;
                Util.ajax('/api/graph/neighbor?id=' + that.nodeData.data.id + '&page=0&size=1', {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }).then(function (response) {
                    that.loading = false;
                    that.total = response.data.page.totalElements;
                }).catch(function (response) {
                    that.loading = false;
                });
            },
            hide() {
                this.showModal = false;
            },
            ok() {
                var url = '/api/graph/neighbor?id=' + this.nodeData.data.id + '&page=' + (this.formItem.page - 1) + '&size=' + this.formItem.size;
                Util.exploreGraph(this.nodeData.data.id, undefined, false, url, false, undefined, this.formItem.fold);
            }
        },
        data() {
            return {
                loading: true,
                spinCount: 0,
                nodeData: {},
                showModal: false,
                indeterminateNode: false,
                checkAllNode: false,
                indeterminateLink: false,
                checkAllLink: false,
                total: 10,
                maxPage: 5,
                formItem: {
                    nodeType: [],
                    linkType: [],
                    nodeWeight: [0, 100],
                    linkWeight: [0, 100],
                    nodeSortRange: [1, 50],
                    fold: true,
                    page: 1,
                    size: 20,
                    sortType: 'weight'
                }
            };
        }
    };
</script>