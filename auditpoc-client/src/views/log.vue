<style>
    .clearfix {
        clear: both;
    }
</style>
<template>
    <div style="padding:0 40px;">
        <div :model="formItem" :label-width="80" inline style="padding-bottom: 5px">
            <!--<FormItem label="用户名" style="float: left;border: 1px red solid;">-->
            <!--<span style="font-weight: 600;float: left;line-height: 30px;margin-right: 5px;">用户名</span>-->
            <Input v-model="formItem.input" placeholder="请选择用户" style="width: 200px;float: left;"></Input>
            <!--</FormItem>-->
            <!--<FormItem label="时间" style="float: left;border: 1px red solid;">-->
            <!--<span style="font-weight: 600;float: left;line-height: 30px;margin-right: 5px;margin-left: 10px;">时间</span>-->
            <div class="block" style="float: left;">
                <DatePicker type="datetimerange" v-model="formItem.value" placeholder="请选择时间" style="width: 300px;margin-left: 10px;">
                </DatePicker>
            </div>
            <!--</FormItem>-->
            <ButtonGroup style="padding-left:10px;">
                <Button @click="search" type="primary" icon="search">搜索</Button>
                <Button @click="reset" type="ghost" icon="refresh">重置</Button>
            </ButtonGroup>
        </div>

        <Table :columns="columns" :data="data" border :loading="loading" :height="height-235"></Table>

        <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="total"
                style="float: right;margin-top: 20px">
        </el-pagination>
    </div>
    <!--</div>-->
    <!---->
    <!--</div>-->
</template>

<script>
    import copy from './copy.vue';

    export default {
        mounted() {
            var that = this;
            that.$http.post("/api/log/logTypes", that.querystring.stringify({})).then(response => {
                if ((response.data.status & 1) == 1) {
                    for (let i in response.data.data) {
                        that.logTypes[response.data.data[i].path] = response.data.data[i].value;
                    }
                }
                this.search();
            });
        },
        components: {
            'layout-copy': copy
        },
        data: function () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 100,
                loading: false,
                height: window.screen.availHeight - 150,
                formItem: {
                    input: '',
                    value: [],
                },
                columns: [
                    {
                        title: '用户名',
                        key: 'userName',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '操作类型',
                        key: 'operationType',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', this.logTypes[params.row.operationType] ? this.logTypes[params.row.operationType] : params.row.operationType)
                            ]);
                        }
                    },
                    {
                        title: '操作参数',
                        key: 'operationParamdesc',
                        align: 'center'
                    },
                    {
                        title: '时间',
                        key: 'date',
                        align: 'center',
                        width: 250,
                        height: 10,
                        render: (h, params) => {
                            return h('div',{},new Date(params.row.date * 1).format('yyyy-MM-dd hh:mm:ss'));
                        }
                    },
                    {
                        title: 'Ip地址',
                        key: 'ipAddress',
                        width: 150,
                        align: 'center'
                    },
                ],
                data: [],
                logTypes: {}
            }
        },
        methods: {
            handleCurrentChange() {
                this.search();
            },
            search() {
                var data = {
                    page: (this.currentPage - 1),
                    name: this.formItem.input
                };
                (this.formItem.value[0]) && (data.start = this.formItem.value[0].getTime());
                (this.formItem.value[1]) && (data.end = this.formItem.value[1].getTime());
                this.loading = true;
                var that = this;
                $.post('/api/log/selectLogs',
                    data,
                    function (response) {
                        that.loading = false;
                        that.$set(that, 'data', response.data);
                        that.total = response.page.totalElements;
                    });
            },
            reset() {
                this.formItem.input = '';
                this.formItem.value = [];
                this.currentPage = 1;
            }
        }
    }
</script>