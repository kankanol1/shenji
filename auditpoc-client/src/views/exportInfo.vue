<style scoped="">
    .passText {
        text-align: center;
        margin: 40px 0;
        font-weight: bold;
    }

    .form {
        padding-right: 20px
    }

    .clearfix {
        clear: both;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px'">
            <Modal v-model="showModal" @on-ok="ok" loading ref="addModal">
                <div class="form">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                        <FormItem label="用户名" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入用户名" :disabled="modify"></Input>
                        </FormItem>
                        <FormItem label="真实姓名" prop="realName">
                            <Input v-model="formValidate.realName" placeholder="请输入真实姓名"></Input>
                        </FormItem>
                        <FormItem label="电话" prop="tel">
                            <Input v-model="formValidate.tel" placeholder="请输入电话"></Input>
                        </FormItem>
                        <FormItem label="邮箱" prop="mail">
                            <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
                        </FormItem>
                        <FormItem label="角色" prop="role">
                            <Select v-model="formValidate.role">
                                <Option v-for="item in RoleList" :value="item" :key="item">{{item}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="授权点类型" prop="vper">
                            <Select v-model="formValidate.vper" placeholder="请选择" @on-change="selectVPer">
                                <Option v-for="(item,index) in authorizeList" :value="item.vid" :key="item.vid">
                                    {{item.vdescription}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="授权边类型">
                            <Select v-model="formValidate.epers" multiple placeholder="请选择" @on-change="selectEPer">
                                <Option v-for="(item,index) in eper" :key="item.eid" :value="item.eid">
                                    {{item.edescription}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="授权行政区划">
                            <Select v-model="formValidate.rlists" multiple placeholder="请选择">
                                <Option v-for="(item,index) in rlist" :key="item.id" :value="item.id">{{item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="导出权限">
                            <Select v-model="formValidate.exp" placeholder="请选择">
                                <Option v-for="(item,index) in expList" :key="item" :value="item">{{item}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </Modal>

            <h1>哈哈！意外了吧！这里暂时没有内容！</h1>
            <!--<div style="padding: 0px 40px;">-->
            <!--<Row>-->
            <!--<ButtonGroup style="padding-bottom: 5px;float: right;">-->
            <!--<Button @click="show()" icon="plus-round" type="info">添加</Button>-->
            <!--<Button @click="remove()" icon="minus-round" type="error">删除</Button>-->
            <!--</ButtonGroup>-->
            <!--</Row>-->
            <!--<Row>-->
            <!--<Table :loading="loading" border ref="selection" :columns="columns" :data="tableData"-->
            <!--:height="height-235"></Table>-->
            <!--</Row>-->
            <!--<div class="clearfix"></div>-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</div>-->
        </div>

    </div>
</template>
<script>
    import copy from './copy.vue';
    import Util from '../libs/util';

    export default {
        mounted() {
            this.refresh();
            var that = this;
            that.$http.post("/api/user/listRoles", this.querystring.stringify({})).then(data => {
                if (!!data && data.status === 200) {
                    that.RoleList = data.data;
                }
            })
            that.$http.post("/api/regioncode/selectChildren", this.querystring.stringify({pid: 370000})).then(data => {
                if (!!data && data.status === 200) {
                    that.rlist = data.data.data;
                }
            })

        },
        components: {
            'layout-copy': copy,
        },
        data() {
            var that = this;
            const validateName = function (rule, value, callback) {
                if (that.modify) callback();
                that.$http.post("/api/user/hasUser", that.querystring.stringify({"name": value})).then(data => {
                    if (!!data && data.status === 200) {
                        if (data.data) {
                            callback(new Error('该用户已存在！'));
                        } else {
                            callback();
                        }
                    }
                })

            };
            return {
                formValidate: {
                    name: '',
                    realName: '',
                    tel: '',
                    mail: '',
                    role: '',
                    vper: '',
                    eper: '',
                    epers: '',
                    exp: '',
                    rlists: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '名字不能为空', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '真实姓名不能为空', trigger: 'blur'},
                    ],
                    mail: [
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'},
                    ],
                    role: [
                        {required: true, message: '角色不能为空', trigger: 'blur'},
                    ],

                },
                RoleList: [],
                expList: ["true", "false"],
                authorizeList: [
                    {"vid": 0, "vdescription": "空", "eper": []},
                    {"vid": 1, "vdescription": "人", "eper": [{"eid": 1, "edescription": "婚姻"}]},
                    {"vid": 2, "vdescription": "公司", "eper": [{"eid": 4, "edescription": "企业投资"}]},
                    {
                        "vid": 3,
                        "vdescription": "人,公司",
                        "eper": [{"eid": 1, "edescription": "婚姻"},
                            {"eid": 4, "edescription": "企业投资"},
                            {"eid": 2, "edescription": "个人投资"},
                            {"eid": 32, "edescription": "法人"},
                            {"eid": 8, "edescription": "任职"}]
                    },
                    {
                        "vid": 4,
                        "vdescription": "单位",
                        "eper": [{"eid": 16, "edescription": "项目"}, {"eid": 64, "edescription": "支付"}]
                    },
                    {
                        "vid": 5,
                        "vdescription": "人,单位",
                        "eper": [{"eid": 1, "edescription": "婚姻"},
                            {"eid": 16, "edescription": "项目"},
                            {"eid": 64, "edescription": "支付"},
                            {"eid": 8, "edescription": "任职"}]
                    },
                    {
                        "vid": 6,
                        "vdescription": "公司,单位",
                        "eper": [{"eid": 4, "edescription": "企业投资"},
                            {"eid": 16, "edescription": "项目"},
                            {"eid": 64, "edescription": "支付"}]
                    },
                    {
                        "vid": 7,
                        "vdescription": "人,公司,单位",
                        "eper": [{"eid": 1, "edescription": "婚姻"},
                            {"eid": 2, "edescription": "个人投资"},
                            {"eid": 32, "edescription": "法人"},
                            {"eid": 8, "edescription": "任职"},
                            {"eid": 4, "edescription": "企业投资"},
                            {"eid": 16, "edescription": "项目"},
                            {"eid": 64, "edescription": "支付"}]
                    },
                ],
                eper: [],
                rlist: [],
                loading: false,
                height: window.screen.availHeight - 150,
                showModal: false,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '真实姓名',
                        key: 'realName'
                    },
                    {
                        title: '角色',
                        key: 'role',
                        filters: [
                            {
                                label: '超级管理员',
                                value: 1
                            },
                            {
                                label: '普通用户',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 1) {
                                return row.role == '超级管理员';
                            } else if (value === 2) {
                                return row.role != '超级管理员';
                            }
                        }
                    },
                    {
                        title: '电话',
                        key: 'tel'
                    },
                    {
                        title: '邮箱',
                        key: 'mail'
                    },
                    {
                        title: '密码',
                        key: 'password',
                        align: 'center',
                        render: function (h, params) {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: function () {
                                            $.ajax({
                                                method: "post",
                                                url: "/api/user/reset",
                                                data: {id: params.row.id},
                                                success: function (data) {
                                                    that.$message({
                                                        type: 'info',
                                                        message: data.msg
                                                    });
                                                    that.refresh();
                                                }
                                            });
                                        }
                                    }
                                }, '重置密码')
                            ]);
                        }
                    },
                    {
                        title: "授权点类型",
                        key: 'vdesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: "授权边类型",
                        key: 'edesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: "授权行政区划",
                        key: 'rlist',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: "导出权限",
                        key: 'exp',
                        width: 150,
                        align: 'center'
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
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: function () {
                                            that.show(params.row)
                                        }
                                    }
                                }, '编辑'),
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
                tableData: [],
                roles: [],
                reset: false,
                modify: false
            }
        },
        methods: {
            show(row) {
                this.showModal = true;
                var that = this;
                if (row) {
                    this.modify = true;
                    this.formValidate = $.extend(true, {}, row);
                    this.selectVPer(row.vper);
                }
                else {
                    this.modify = false;
                    this.formValidate = {
                        name: '',
                        realName: '',
                        tel: '',
                        mail: '',
                        role: '',
                        vper: '',
                        eper: '',
                        rlists: '',
                        exp: ''
                    };
                }
            },
            refresh() {
                var that = this;
                this.loading = true;
                $.ajax({
                    type: "post",
                    url: "/api/user/list",
                    success: function (response) {
                        that.loading = false;
                        var result = [];
                        response.forEach(function (item, index) {
                            var eper = item.eper;
                            var epers = [];
                            for (var i = 1; i <= 64; i = i * 2) {
                                if ((eper & i) > 0) {
                                    epers.push(i);
                                }
                            }
                            item['epers'] = epers;
                            result.push(item);
                        });
                        that.$set(that, 'tableData', result);
                    }
                })
            },
            remove(ids) {
                if (!ids) {
                    ids = [];
                    for (let i in this.$refs.selection.getSelection())
                        ids.push(this.$refs.selection.getSelection()[i].id)
                }
                this.$http.post("/api/user/del", this.querystring.stringify({ids: ids.join(',')})).then(response => {
                    if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                        this.$message({showClose: true, type: 'info', message: response.data.msg});
                        this.refresh();
                    } else {
                        this.$message({showClose: true, message: '删除失败', type: 'warning'});
                    }
                }).catch(response => this.$message({showClose: true, message: '网络异常,请重试!', type: 'warning'}));
            },
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.$http.post("/api/user/add", this.querystring.stringify(this.formValidate || {})
                        ).then(response => {
                            if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                                this.$message({showClose: true, type: 'info', message: response.data.msg});
                                this.refresh();
                                this.showModal = false;
                            } else {
                                this.$message({showClose: true, message: '添加失败', type: 'warning'});
                            }
                        }).catch(response => this.$message({message: '网络异常,请重试!', type: 'warning'}));
                    } else {
                        this.$Message.error('信息格式不对！');
                        this.$refs.addModal.buttonLoading = false;
                    }
                });
            },
            selectVPer(value) {
                var that = this;
                that.authorizeList.forEach(function (item, index) {
                    if (item.vid == value) {
                        that.eper = item.eper;
                    }
                })
            },
            selectEPer(value) {
                var that = this;
                var sum = 0;
                for (var i = 0; i < value.length; i++) {
                    sum = sum + value[i];
                }
                that.formValidate.eper = sum;
            }
        }
    }
</script>