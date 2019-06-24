<style scoped="">
    .clearfix {
        clear: both;
    }
</style>
<template>
    <div>
        <Modal v-model="showModal" @on-ok="ok" :width="550" loading ref="addModal">
            <div class="form">
                <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate">
                    <FormItem label="节点名称" prop="nodeIds">
                        <Select  v-model="formValidate.nodeIds" :loading="searchBarLoading" filterable remote
                                :remote-method="queryChange" :disabled="modify"
                                style="width: 400px;" multiple>
                            <Option v-for="node in nodeData" :value="node.id" :key="node.id" :label="node.nodeName">
                                {{node.nodeName}}
                                <em style="color: grey;font-size: 10px">(节点类型：{{nodeTypes[node.nodeType].display}})</em>
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="起止时间" prop="valueDate">
                        <div class="block">
                            <DatePicker v-model="formValidate.valueDate" type="datetimerange" style="width: 400px;"
                                        :clearable="false">
                            </DatePicker>
                        </div>
                    </FormItem>
                    <FormItem label="用户" prop="userName">
                        <Input v-model="formValidate.userName" placeholder="请输入用户名" style="width: 400px;"> </Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
        <div style="padding: 0px 40px;">
            <div style="padding-bottom: 5px">
                <Input type="text" v-model="formValidate.userName" placeholder="请搜索用户" style="width: 400px;"></Input>
                <Button type="primary" @click="searchUser" icon="search">搜索</Button>
                <Button @click="show()" icon="plus-round" type="primary">添加</Button>
                <Button @click="remove()" icon="minus-round" type="error">删除</Button>
                <div class="clearfix"></div>
            </div>
        </div>
        <div style="padding: 0px 40px;">
            <Table :loading="loading" border ref="selection" :columns="columns" :data="tableData"
                   :height="height-235"></Table>
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    style="float: right;margin-top: 20px">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import copy from './copy.vue';
    import Util from '../libs/util';
    import dictionary from '../config/dictionary'

    export default {
        mounted() {
            this.searchUser();
        },
        components: {},
        data() {
            var that = this;
            return {
                ruleValidate: {
                    nodeIds: [
                        {
                            validator:
                                function (rule, value, callback) {
                                    if (value.length === 0) {
                                        callback(new Error('请至少选择一个节点'));
                                    } else {
                                        callback();
                                    }
                                },
                            type: 'array',
                            trigger: 'change',
                            required: true
                        }
                    ],
                    userName: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                        {
                            validator:
                                function (rule, value, callback) {
                                    /*$.post('/api/user/hasUser?name=' + value, {},
                                        function (data) {
                                            if (!data) {
                                                callback(new Error('该用户不存在！'));
                                            } else {
                                                callback();
                                            }
                                        });*/
                                    var param = {name:value};
                                    that.$http.post('/api/user/hasUser',that.querystring.stringify(param))
                                        .then(function(response){
                                            if(!response.data){
                                                callback(new Error("!该用户不存在"))
                                            }else{
                                                callback();
                                            }
                                        })
                                },
                            trigger: 'blur'
                        }
                    ],
                },
                nodeTypes: dictionary.nodeTypes,
                height: window.screen.availHeight - 100,
                modify: false,
                currentPage: 1,
                pageSize: 10,
                total: 1,
                query: '',
                queryLastUpdate: 0,
                searchBarLoading: false,
                nodeData: [],
                showModal: false,
                loading: false,
                formValidate: {
                    id: '',
                    nodeIds: [],
                    valueDate: [new Date(), new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))],
                    userName: '',
                },
                tableData: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'userName',
                        render: function (h, params) {
                            return h('div', {}, params.row.userName);
                        }
                    },
                    {
                        title: '节点',
                        key: 'nodeName',
                        render: function (h, params) {
                            return h('div', {}, params.row.blackNodeList.nodeName);
                        }
                    },
                    {
                        title: '类型',
                        key: 'nodeType',
                        render: function (h, params) {
                            return h('div', {}, dictionary.nodeTypes[params.row.blackNodeList.nodeType].display);
                        }
                    },
                    {
                        title: '开始时间',
                        key: 'startTime',
                        render: function (h, params) {
                            return h('div', {}, new Date(params.row.startTime * 1).format('yyyy-MM-dd hh:mm:ss'));
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'endTime',
                        render: function (h, params) {
                            return h('div', {}, new Date(params.row.endTime * 1).format('yyyy-MM-dd hh:mm:ss'));
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: function (h, params) {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: function () {
                                            that.remove([params.row.id]);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
            }
        },
        methods: {
            dateFormat(datetime) {

            },
            show(row) {
                this.showModal = true;
                if (row) {
                    this.modify = true;
                    this.formValidate = $.extend(true, {}, {
                        id: row.id,
                        nodeIds: [row.blackNodeList.id],
                        valueDate: [row.startTime, row.endTime]
                    });
                    this.nodeData = [row.blackNodeList];
                }
                else {
                    this.modify = false;
                    this.formValidate = {
                        id: '',
                        valueDate: [new Date(), new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))],
                        nodeIds: [],
                        userName: '',
                    };
                }
            },
            queryChange(query) {
                if (query.length == 0) return;
                var that = this;
                that.query = query;
                that.queryLastUpdate = (new Date()).getTime();

                setTimeout(function () {
                    var now = (new Date()).getTime();

                    if (now - that.queryLastUpdate >= 400) {
                        that.queryNodes(that.query);
                    }
                }, 401)
            },
            queryNodes(query) {
                if (!query.trim) return;
                query = query.trim();
                if (!query) return;
                this.searchBarLoading = true;
                var that = this;
                that.$http.post("/api/authority/black_node/list", that.querystring.stringify({
                        page: 0,
                        size: 500,
                        name: query,
                    })
                ).then(function (response) {
                    if (response.status === 200 && (response.data.status & 1) === 1) {
                        that.$set(that, 'nodeData', response.data.data);
                    }
                    that.searchBarLoading = false;
                });
            },
            remove(ids) {
                if (!ids) {
                    ids = [];
                    for (let i in this.$refs.selection.getSelection())
                        ids.push(this.$refs.selection.getSelection()[i].id)
                }
                var that = this;
                $.ajax({
                    method: "post",
                    url: "/api/authority/user_authority/delete_authorities",
                    data: {ids: ids.join(',')},
                    success: function (data) {
                        that.$message({
                            type: 'error',
                            message: data.msg,
                            showClose: true
                        });
                        that.searchUser();
                    }
                });

            },
            handleCurrentChange() {
                this.searchUser();
            },
            searchUser() {
                //if( this.formValidate.userName.length==0) return;
                this.loading = true;
                var that = this;
                that.$http.post("/api/authority/user_authority/get_blackNodes", that.querystring.stringify({
                    page: (this.currentPage - 1),
                    userName: this.formValidate.userName,
                    size: 15
                })).then(function (response) {
                    if (response.status === 200 && (response.data.status & 1) === 1) {
                        that.$set(that, 'tableData', response.data.data);
                        that.total = response.data.page ? (response.data.page.totalElements || 0) : 0;
                    }
                    that.loading = false;
                });
            },
            ok() {
                var that = this;
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        $.ajax({
                            type: 'post',
                            url: '/api/authority/user_authority/import_black_node_list_batch',
                            data: {
                                userName: that.formValidate.userName,
                                ids: that.formValidate.nodeIds.join(','),
                                startTime: that.formValidate.valueDate[0].getTime(),
                                endTime: that.formValidate.valueDate[1].getTime()
                            },
                            success: function (data) {
                                that.$message({
                                    showClose:true,
                                    type: 'success',
                                    message: data.msg,
                                });
                                that.searchUser();
                                that.showModal = false;
                            }
                        })
                    } else {
                        this.$Message.error('信息格式不对！');
                        this.$refs.addModal.buttonLoading = false;
                    }
                })
                this.nodeData=[];
            }

        }
    }
</script>