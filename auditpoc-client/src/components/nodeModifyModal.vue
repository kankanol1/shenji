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
            showModal(info) {
                this.info = info;
                this.getDataSelect();
                this.show = true;
            },
            getDataSelect() {
                var that = this;
                that.$http.post("/api/node/selectNode", that.querystring.stringify({
                    "id": that.info.id,
                    "type": "vertex"
                }))
                    .then(response => {
                        if ((response.data.status & 1) == 1) {
                            var tableDataTemp = response.data.data.propertyList;
                            switch (that.info.label) {
                                case "Department":
                                    that.tableData = [
                                        {
                                            key:"uid",
                                            property:"注册号",
                                            oldValue:  tableDataTemp.uid
                                        },
                                        {
                                            key:"name",
                                            property:"单位名称",
                                            oldValue:  tableDataTemp.name
                                        },
                                        {
                                            key:"time",
                                            property:"注册时间",
                                            oldValue:  tableDataTemp.time
                                        },
                                        {
                                            key:"reg_person",
                                            property:"企业法人",
                                            oldValue:  tableDataTemp.reg_person
                                        }
                                    ];
                                    break;
                                case "Person":
                                    that.tableData = [
                                        {
                                            key:"uid",
                                            property:"身份证号",
                                            oldValue:  tableDataTemp.uid
                                        },
                                        {
                                            key:"name",
                                            property:"姓名",
                                            oldValue:  tableDataTemp.name
                                        },
                                        {
                                            key:"address",
                                            property:"地址",
                                            oldValue:  tableDataTemp.address
                                        },
                                        {
                                            key:"sex",
                                            property:"性别",
                                            oldValue:  tableDataTemp.sex
                                        },
                                        {
                                            key:"birthday",
                                            property:"出生日期",
                                            oldValue:  tableDataTemp.birthday
                                        }
                                    ];
                                    break;
                                case "Company":
                                    that.tableData = [
                                        {
                                            key:"uid",
                                            property:"注册号",
                                            oldValue:  tableDataTemp.uid
                                        },
                                        {
                                            key:"name",
                                            property:"公司名称",
                                            oldValue:  tableDataTemp.name
                                        },
                                        {
                                            key:"time",
                                            property:"注册时间",
                                            oldValue:  tableDataTemp.time
                                        },
                                        {
                                            key:"reg_person",
                                            property:"公司法人",
                                            oldValue:  tableDataTemp.reg_person
                                        },
                                        {
                                            key:"state",
                                            property:"公司状态",
                                            oldValue:  tableDataTemp.state
                                        },
                                        {
                                            key:"ctype",
                                            property:"公司类型",
                                            oldValue:  tableDataTemp.ctype
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
                    "type": "vertex",
                    "dkeys": rows[index]['key']
                })).then(response => {
                    if((response.data.status & 1) == 1){
                        that.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success'
                        });
                    }else if((response.data.status & 1) != 1){
                        that.$message({
                            showClose: true,
                            message: '删除失败',
                            type: 'warning'
                        });
                    }
                    that.getDataSelect();
                })
            },
            onSubmit() {
                console.log('submit!');
            },
            ok(){
                var that = this;
                that.$http.post("/api/node/updateNode", that.querystring.stringify({
                    "id": that.info.id,
                    "type": "vertex",
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
</script>