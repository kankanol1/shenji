<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px'" style="padding: 20px 40px 0 40px">
            <div style="margin-left:30%;margin-bottom:18px;">
                <el-select
                        v-model="selectVertexId"
                        filterable
                        clearable
                        remote
                        placeholder="请输入节点关键词"
                        @change="changeVertex"
                        :remote-method="queryVertexsByName"
                        :loading="loading">
                    <el-option
                            v-for="item in selectData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                    </el-option>
                </el-select>
                <a href="#" @click="updateVertex">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;" :disabled="!canSave">保存</Button>
                </a>
                <a href="#" @click="insertVertex">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;">添加</Button>
                </a>
                <a href="#" @click="deleteVertex">
                    <Button type="primary" style="margin-left: 10px;margin-top: -8px;" :disabled="!selectVertexId">删除</Button>
                </a>
            </div>
            <el-form :modal="selectVertexForm" label-width="30%" v-if="isAdd===false">
                <el-form-item v-for="item in currentProps" :label="item.display" :prop="item.name">
                    <el-input v-if="item.date===false" v-model="selectVertexForm[item.name]" clearable></el-input>
                    <el-date-picker
                            style="width:100%"
                            v-if="item.date===true"
                            v-model="selectVertexForm[item.name]"
                            type="date"
                            :format="item.dateFormat"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-form :modal="addVertexForm" label-width="30%" v-if="isAdd===true">
                <el-form-item label="节点类型">
                    <el-select
                            style="width:100%"
                            v-model="addVertex"
                            placeholder="请选择添加类型"
                            @change="changeVertexType"
                            clearable>
                        <el-option
                                v-for="item in vertexTypeList"
                                :key="item.id"
                                :label="item.description"
                                :value="item.content">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-for="item in currentAddProps" :label="item.display" :prop="item.name">
                    <el-input v-if="item.date===false" v-model="addVertexForm[item.name]"></el-input>
                    <el-date-picker
                            style="width:100%"
                            v-if="item.date===true"
                            v-model="addVertexForm[item.name]"
                            type="date"
                            :format="item.dateFormat"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
    import copy from './copy.vue';
    import Util from '../libs/util';

    Date.prototype.Format = function(formatStr){
        var str = formatStr;
        var Week = ['日','一','二','三','四','五','六'];

        str=str.replace(/yyyy|YYYY/,this.getFullYear());
        str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

        str=str.replace(/MM/,this.getMonth()>9?this.getMonth().toString():'0' + this.getMonth());
        str=str.replace(/M/g,this.getMonth());

        str=str.replace(/w|W/g,Week[this.getDay()]);

        str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
        str=str.replace(/d|D/g,this.getDate());

        str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
        str=str.replace(/h|H/g,this.getHours());
        str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
        str=str.replace(/m/g,this.getMinutes());

        str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
        str=str.replace(/s|S/g,this.getSeconds());

        return str;
    }
    export default {
        mounted() {
            this.queryVertexProp();
            this.queryVertexTypeList();
        },
        components: {
        },
        data() {
            var that = this;
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                currentPage: 0,
                pageSize: 10,
                selectData: [],
                addVertex: null,
                addVertexForm: {},
                selectVertexId: '',
                selectVertex: null,
                vertexProps:{},
                currentProps:[],
                selectVertexForm:{},
                currentAddProps:[],
                vertexTypeList:[],
                loading: false,
                isAdd: false,
                canSave:false,
            }
        },
        methods: {
            updateVertex() {
                this.canSave = false;
                var params1 = [];
                var params2 = [];
                if(this.isAdd){
                    if(this.addVertex && this.addVertexForm){
                        for(var i=0;i<this.currentAddProps.length;i++){
                            var item = this.currentAddProps[i];
                            var key = item.name;
                            if(this.addVertexForm[key]){
                                var value = '';
                                if(item.date){
                                    value = new Date(this.addVertexForm[key]).Format(item.dateFormat||'YYYY-MM-DD');
                                }else{
                                    value = this.addVertexForm[key];
                                }
                                params1.push(key+"@@"+value);
                            }else{
                                params2.push(key);
                            }
                        }
                        var that = this;
                        that.$http.post("/api/node/insertNode", that.querystring.stringify({
                                id:parseInt(new Date().getTime() / 256) * 256,
                                type:'vertex',
                                label:that.addVertex,
                                kvs:params1.join('$$'),
                                dkeys:params2.join(','),
                            })
                        ).then(function (response) {
                            if ((response.data.status & 1) == 1) {
                                that.$message({
                                    showClose: true,
                                    message: '添加成功',
                                    type: 'success'
                                });
                            } else if ((response.data.status & 1) != 1) {
                                that.$message({
                                    showClose: true,
                                    message: response.data.msg,
                                    type: 'warning'
                                });
                            }
                        })
                    }
                }else{
                    if(this.selectVertexForm){
                        for(var i=0;i<this.currentProps.length;i++){
                            var item = this.currentProps[i];
                            var key = item.name;
                            if(this.selectVertexForm[key]){
                                var value = '';
                                if(item.date){
                                    value = new Date(this.selectVertexForm[key]).Format(item.dateFormat||'YYYY-MM-DD');
                                }else{
                                    value = this.selectVertexForm[key];
                                }
                                params1.push(key+"@@"+value);
                            }else{
                                params2.push(key);
                            }
                        }
                        var that = this;
                        that.$http.post("/api/node/updateNode", that.querystring.stringify({
                                id:that.selectVertexForm.id,
                                type:'vertex',
                                kvs:params1.join('$$'),
                                dkeys:params2.join(','),
                            })
                        ).then(function (response) {
                            if ((response.data.status & 1) == 1) {
                                that.$message({
                                    showClose: true,
                                    message: '更新成功',
                                    type: 'success'
                                });
                            } else if ((response.data.status & 1) != 1) {
                                that.$message({
                                    showClose: true,
                                    message: response.data.msg,
                                    type: 'warning'
                                });
                            }
                        })
                    }
                }

            },
            insertVertex() {
                this.isAdd = true;
                this.canSave = false;
                this.clearForm();
            },
            clearForm() {
                this.selectVertex = null;
                this.selectData = null;
                this.selectVertexId = '';
                this.selectVertexForm = null;
                this.currentProps = [];
                this.currentAddProps = [];
                this.addVertexForm = {};
                this.addVertex = null;
            },
            deleteVertex() {

                var that = this;
                that.$http.post("/api/node/deleteNode", that.querystring.stringify({
                        id:that.selectVertex.id,
                        type:'vertex',
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'error'
                        });
                        that.clearForm();
                        that.canSave = false;
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })

            },
            changeVertexType(item) {
                if(this.vertexProps[item]){
                    this.currentAddProps = this.vertexProps[item].properties||[];
                    this.canSave = true;
                } else {
                    this.currentAddProps = [];
                }
            },
            changeVertex(id) {
                var that = this;
                that.$http.post("/api/node/selectNode", that.querystring.stringify({
                    id:id,
                    type:'vertex'
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var item = response.data.data;
                        that.isAdd = false;
                        that.currentAddProps = [];
                        that.addVertex = null;
                        that.selectVertex = item;
                        that.canSave = true;
                        var type = item.type;
                        if(type && that.vertexProps[type]){
                            that.currentProps = that.vertexProps[type].properties||[];
                            that.selectVertexForm = item.propertyList;
                        }

                    } else if ((response.data.status & 1) != 1) {
                        that.selectVertexForm = [];
                        that.$message({
                            showClose: true,
                            message: '节点类型列表读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryVertexTypeList() {
                var that = this;
                that.$http.post("/api/dictionaries/vertices", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var result = response.data.data||[];
                        that.vertexTypeList = result.filter(function(o){return !!o.id;});
                    } else if ((response.data.status & 1) != 1) {
                        that.vertexTypeList = [];
                        that.$message({
                            showClose: true,
                            message: '节点类型列表读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryVertexProp() {
                var that = this;
                that.$http.post("/api/dictionaries/fields", that.querystring.stringify({
                        type:'vertex'
                    })
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        that.vertexProps = response.data.data.vertex;
                    } else if ((response.data.status & 1) != 1) {
                        that.vertexProps = {};
                        that.$message({
                            showClose: true,
                            message: '节点属性读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryVertexsByName(query) {
                var that = this;
                if (query !== '') {
                    that.loading = true;
                    that.$http.post("/api/node/queryNodes", that.querystring.stringify({
                            "page": that.currentPage,
                            "size": that.pageSize,
                            "value": query,
                        })
                    ).then(function (response) {
                        that.loading = false;
                        if ((response.data.status & 1) == 1) {
                            that.selectData = response.data.data;
                        } else if ((response.data.status & 1) != 1) {
                            that.selectData = [];
                            that.$message({
                                showClose: true,
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                } else {
                    that.selectData = [];
                }


            }
        }
    };
</script>