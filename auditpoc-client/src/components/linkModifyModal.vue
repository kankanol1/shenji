<template>
    <div>
        <Modal v-model="show" width="640" :styles="{top: '20px'}" class="example">
            <p slot="header" style="text-align:center">
                <span style="font-size: 20px">信息修改</span>
            </p>
            <div>
                <el-table border
                          :data="tableData"
                          style="width: 100%;text-align: center">
                    <el-table-column
                            label="属性"
                            width="200">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.property }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="原始值">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.oldValue }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click.native.prevent="deleteRow(scope.$index, tableData)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <p slot="footer"></p>
        </Modal>
        <Modal v-model="formShow" width="400" :styles="{top: '20px'}" class="example" @on-ok="ok()" ref="editModal">
            <div>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="属性名">
                        <el-input v-model="form.propertyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="原始值">
                        <el-input v-model="form.oldValue" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="目标值">
                        <el-input v-model="form.newValue"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </Modal>
    </div>
</template>
<style scoped src="../assets/bootstrap.min.css">
    /*@import '../assets/bootstrap.min.css';*/
    h2 {
        font-size: 1.5em;
    }
</style>
<script>
    import dictionary from '../config/dictionary';
    import Util from '../libs/util';
    import  '../assets/bootstrap.min.js';
    var tableData = [];
    export default {
        data() {
            return {
                show: false,
                tableData: tableData,
                formShow: false,
                form: {
                    propertyName: '',
                    oldValue: '',
                    newValue: ''
                }
            }
        },
        watch:{

        },
        methods: {
            showModalEdit(info) {
                this.info = info;
                this.getDataSelect();
                this.show = true;
            },
            getDataSelect() {
                var that = this;
                that.$http.post("/api/node/selectNode", that.querystring.stringify({
                    "id": that.info.id,
                    "type": "edge"
                }))
                    .then(response => {
                        if ((response.data.status & 1) == 1) {
                            var tableDataTemp = response.data.data.propertyList;
                            switch (that.info.label) {
                                case "Enterprise":
                                    that.tableData = [
                                        {
                                            key:"state",
                                            property:"企业状态",
                                            oldValue:  tableDataTemp.state
                                        },
                                        {
                                            key:"time",
                                            property:"成立时间",
                                            oldValue:  tableDataTemp.time
                                        },
                                        {
                                            key:"ctype",
                                            property:"企业类型",
                                            oldValue:  tableDataTemp.ctype
                                        },
                                        {
                                            key:"percent",
                                            property:"出资比例",
                                            oldValue:  tableDataTemp.percent
                                        },
                                        {
                                            key:"scope",
                                            property:"经营范围",
                                            oldValue:  tableDataTemp.scope
                                        },
                                        {
                                            key:"subscribed_amount",
                                            property:"认缴出资金额",
                                            oldValue:  tableDataTemp.subscribed_amount
                                        },
                                        {
                                            key:"real_amount",
                                            property:"实际出资金额",
                                            oldValue:  tableDataTemp.real_amount
                                        }
                                    ];
                                    break;
                                case "Individual":
                                    that.tableData = [
                                        {
                                            key:"state",
                                            property:"企业状态",
                                            oldValue:  tableDataTemp.state
                                        },
                                        {
                                            key:"time",
                                            property:"成立时间",
                                            oldValue:  tableDataTemp.time
                                        },
                                        {
                                            key:"ctype",
                                            property:"企业类型",
                                            oldValue:  tableDataTemp.ctype
                                        },
                                        {
                                            key:"percent",
                                            property:"出资比例",
                                            oldValue:  tableDataTemp.percent
                                        },
                                        {
                                            key:"scope",
                                            property:"经营范围",
                                            oldValue:  tableDataTemp.scope
                                        },
                                        {
                                            key:"subscribed_amount",
                                            property:"认缴出资金额",
                                            oldValue:  tableDataTemp.scope
                                        },
                                        {
                                            key:"real_amount",
                                            property:"实际出资金额",
                                            oldValue:  tableDataTemp.scope
                                        }
                                    ];
                                    break;
                                case "Kinship":
                                    that.tableData = [
                                        {
                                            key:"uid",
                                            property:"婚姻登记证编号",
                                            oldValue:  tableDataTemp.uid
                                        },
                                        {
                                            key:"registname",
                                            property:"注册单位名称",
                                            oldValue:  tableDataTemp.registname
                                        },
                                        {
                                            key:"registid",
                                            property:"注册单位id",
                                            oldValue:  tableDataTemp.registid
                                        },
                                        {
                                            key:"jointime",
                                            property:"登记日期",
                                            oldValue:  tableDataTemp.jointime
                                        },
                                        {
                                            key:"status",
                                            property:"婚姻状态",
                                            oldValue:  tableDataTemp.status
                                        }
                                    ];
                                    break;
                                case "Own":
                                    that.tableData = [
                                        {
                                            key:"state",
                                            property:"企业状态",
                                            oldValue:  tableDataTemp.state
                                        },
                                        {
                                            key:"time",
                                            property:"成立时间",
                                            oldValue:  tableDataTemp.time
                                        },
                                        {
                                            key:"ctype",
                                            property:"企业类型",
                                            oldValue:  tableDataTemp.ctype
                                        },
                                        {
                                            key:"scope",
                                            property:"经营范围",
                                            oldValue:  tableDataTemp.scope
                                        }
                                    ];
                                    break;
                                case "Payment":
                                    that.tableData = [
                                        {
                                            key:"uid",
                                            property:"支付凭证流水号",
                                            oldValue:  tableDataTemp.uid
                                        },
                                        {
                                            key:"money",
                                            property:"支付金额",
                                            oldValue:  tableDataTemp.money
                                        },
                                        {
                                            key:"time",
                                            property:"支付日期",
                                            oldValue:  tableDataTemp.time
                                        },
                                        {
                                            key:"regioncode",
                                            property:"行政区划",
                                            oldValue:  tableDataTemp.regioncode
                                        },
                                        {
                                            key:"tips",
                                            property:"经济科目名称",
                                            oldValue:  tableDataTemp.tips
                                        }
                                    ];
                                    break;
                                case "Project":
                                    that.tableData = [
                                        {
                                            key:"uid",
                                            property:"合同号",
                                            oldValue:  tableDataTemp.uid
                                        },
                                        {
                                            key:"money",
                                            property:"经济科目名称",
                                            oldValue:  tableDataTemp.money
                                        },
                                        {
                                            key:"time",
                                            property:"录入时间",
                                            oldValue:  tableDataTemp.time
                                        },
                                        {
                                            key:"jointime",
                                            property:"操作日期",
                                            oldValue:  tableDataTemp.jointime
                                        }
                                    ];
                                    break;
                                case "Serve":
                                    that.tableData = [
                                        {
                                            key:"role",
                                            property:"人员身份",
                                            oldValue:  tableDataTemp.role
                                        },
                                        {
                                            key:"duty",
                                            property:"职务（职称）",
                                            oldValue:  tableDataTemp.duty
                                        },
                                        {
                                            key:"membership",
                                            property:"隶属处（科）室",
                                            oldValue:  tableDataTemp.membership
                                        }
                                    ];
                                    break;
                            }
                        } else if ((response.data.status & 1) != 1) {
                            that.$message({
                                showClose: true,
                                message: '暂无内容',
                                type: 'warning'
                            });
                        }
                    })
            },
            showForm(index, row) {
                this.formShow = true;
                this.form.key = row.key;
                this.form.propertyName = row.property;
                this.form.oldValue = row.oldValue;
            },
            handleEdit(index, row) {
                this.showForm(index, row);
            },
            deleteRow(index, rows) {
                this.form.oldValue = '';
                var that = this;
                that.$http.post("/api/node/updateNode", that.querystring.stringify({
                    "id": that.info.id,
                    "type": "edge",
                    "dkeys": rows[index]['key']
                })).then(response => {
                    if((response.data.status & 1) == 1){
                        that.$message({
                            showClose: true,
                            message: '更新成功',
                            type: 'success'
                        });
                    }else if((response.data.status & 1) != 1){
                        that.$message({
                            showClose: true,
                            message: '更新失败',
                            type: 'warning'
                        });
                    }
                    that.getDataSelect();
                })
            },
            ok(){
                var that = this;
                if(this.form.newValue == '') {
                    that.$message({
                        showClose: true,
                        message: '修改值不能为空',
                        type: 'warning'
                    });
                }else if(this.form.newValue !== ''){
                    that.$http.post("/api/node/updateNode", that.querystring.stringify({
                        "id": that.info.id,
                        "type": "edge",
                        "kvs": this.form.key + "@@" + this.form.newValue
                    })).then(response => {
                        if((response.data.status & 1) == 1){
                        that.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success'
                        });
                    }else if((response.data.status & 1) != 1){
                            that.$message({
                            showClose: true,
                            message: '修改失败',
                            type: 'warning'
                        });
                        }
                        that.getDataSelect();
                })
                }
            }
        }
    }
</script>