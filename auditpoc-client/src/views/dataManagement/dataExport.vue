<template>
    <div class="layout">
        <el-dialog
                title="导出配置"
                :visible.sync="exportDialogVisible"
                width="600px">
            <el-form :modal="exportForm"
                     label-width="30%">
                <el-form-item label="对接类型" prop="exportType">
                    <el-select
                            style="width:140px"
                            v-model="exportForm.exportType"
                            placeholder="请选择对接类型"
                            @change="changeInterfaceType"
                    >
                        <el-option
                                v-for="item in exportTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务器地址" prop="url">
                    <el-input v-model="exportForm.url"></el-input>
                </el-form-item>
                <el-form-item v-if="exportForm.exportType==='1'" label="用户名" prop="user">
                    <el-input v-model="exportForm.user"></el-input>
                </el-form-item>
                <el-form-item v-if="exportForm.exportType==='1'" label="密码" prop="password">
                    <el-input v-model="exportForm.password"></el-input>
                </el-form-item>
                <el-form-item v-if="exportForm.exportType==='1'" label="文件夹" prop="folder">
                    <el-input v-model="exportForm.folder"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="exportDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="exportResult()">确认导出</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="导出配置结果"
                :visible.sync="exportResultDialogVisible"
                width="600px">
            <el-input v-model="exportResultValue"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exportResultDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="copyExportResult()">复制并关闭</el-button>
            </span>
        </el-dialog>
        <div class="layout-content" :style="'height:'+height+'px'" style="padding: 20px 40px 0 40px">
            <div style="margin:0 auto 18px auto;">
                <el-row>
                    <el-select
                            style="width:140px"
                            v-model="searchType"
                            placeholder="请选择导出类型"
                    >
                        <el-option
                                v-for="item in searchTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select
                            style="width:200px"
                            v-model="VType"
                            @change="changeVType"
                            multiple
                            clearable
                            placeholder="请选择顶点类型">
                        <el-option
                                v-for="item in VData"
                                :key="item.id"
                                :label="item.description"
                                :value="item.id">
                            <span style="float: left">{{ item.description }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px;margin-right:20px;">{{ item.content }}</span>
                        </el-option>
                    </el-select>
                    <el-date-picker
                            v-model="dateValue"
                            type="daterange"
                            range-separator="至"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <a href="#" @click="queryNodeList">
                        <Button type="primary" style="margin-left:8px;margin-top:-4px">查询</Button>
                    </a><a href="#" @click="showExportResult">
                    <Button type="primary" style="margin-left:8px;margin-top:-4px">导出结果</Button>
                </a>
                </el-row>
                <el-row style="margin-top:15px;">
                    <el-col><el-select
                            v-if="searchType=='1'"
                            style="width:300px"
                            v-model="EType"
                            @change="changeEType"
                            multiple
                            clearable
                            placeholder="请选择边类型">
                        <el-option
                                v-for="item in EData"
                                :key="item.id"
                                :label="item.description"
                                :value="item.id">
                            <span style="float: left">{{ item.description }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px;margin-right:20px;">{{ item.content }}</span>
                        </el-option>
                    </el-select></el-col>
                </el-row>
            </div>
            <Table :loading="tableLoading"
                   border
                   ref="selection"
                   :columns="columns"
                   :data="nodeData"
                   highlight-current-row
                   style="width:100%"></Table>
            <el-pagination
                    @size-change="handleSizeChange"
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
    import Util from '../../libs/util';

    export default {
        mounted() {
            this.queryVData();
            this.columns = this.vColumns;
        },
        components: {
        },
        data() {
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60,
                currentPage: 0,
                pageSize: 10,
                total: 0,

                nodeData:[],
                searchTypeList:[
                    {
                        value: '0',
                        label: '点'
                    }, {
                        value: '1',
                        label: '边'
                    }
                ],
                searchType:'0',
                VType:[],
                EType:[],
                vper:'',
                eper:'',
                dateValue:[],

                exportForm:{
                    exportType:'0',
                    url:'',
                    user:'',
                    password:'',
                    folder:''
                },
                exportTypeList:[
                    {
                        value: '0',
                        label: 'WebService'
                    }, {
                        value: '1',
                        label: 'FTP'
                    }
                ],

                VData:[],
                EData:[],
                userList:['liyu','wanglu','liming','majianguo','liuchangsheng','wentianming','guyongmei','lina','liuxiaoqing','zhangheng'],
                passwordList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'],
                exportDialogVisible: false,
                exportResultDialogVisible:false,
                exportResultValue:'',

                tableLoading: false,
                columns:[],
                vColumns: [
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '类型',
                        key: 'label',
                        align: 'center',
                    }
                ],
                eColumns: [
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    }
                ]
            };
        },
        methods: {
            copyUrl2(){
                var Url2=this.exportResultValue;
                var oInput = document.createElement('input');
                oInput.value = Url2;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                this.$message({
                    showClose: true,
                    message: '复制成功',
                    type: 'success'
                });
            },
            changeInterfaceType(value){
                this.exportForm.url = this.getExportUrl(value);
            },
            getExportUrl(type){
                var url = '';
                if(type+'' === '0'){
                    url += '192.168.0.66:8080';
                }else{
                    url += '192.168.0.66:21';
                }
                return url;
            },
            getRandomPassword(step){
                var result = '';
                for(var i=0;i<step;i++){
                    var index = Math.floor(Math.random()*36);
                    result += this.passwordList[index];
                }
                return result;
            },
            showExportResult() {
                this.exportDialogVisible = true;
                this.exportForm.user = this.userList[Math.floor(Math.random()*10)];
                this.exportForm.password = this.getRandomPassword(6);
                this.exportForm.folder = '/user/local/data/'+new Date().format('yyyyMMdd')+'/';
                this.exportForm.url = this.getExportUrl(this.exportForm.exportType);
            },
            queryVData() {
                var that = this;
                that.$http.post("/api/dictionaries/vertices", that.querystring.stringify({})
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var result = response.data.data || [];
                        that.VData = result.filter(function(v){return v.id!==0});
                    } else if ((response.data.status & 1) != 1) {
                        that.VData = [];
                        that.$message({
                            showClose: true,
                            message: '顶点类型读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryEData(vValue,key,callback) {
                var that = this;
                var params = {};

                if(vValue){
                    params.relevanceVertices = vValue;
                }
                that.$http.post("/api/dictionaries/edges", that.querystring.stringify(params)
                ).then(function (response) {
                    if ((response.data.status & 1) == 1) {
                        var result = response.data.data || [];
                        that[key] = result.filter(function(v){return v.id!==0});
                        if(callback){
                            callback(that[key]);
                        }
                    } else if ((response.data.status & 1) != 1) {
                        that[key] = [];
                        that.$message({
                            showClose: true,
                            message: '边类型读取失败',
                            type: 'warning'
                        });
                    }
                })
            },
            queryNodeList() {
                if(this.searchType === '1'){
                    this.columns = this.eColumns;
                }else {
                    this.columns = this.vColumns;
                }
                var that = this;
                var params = {
                    page: this.currentPage - 1,
                    size: this.pageSize,
                };
                if(this.vper){
                    params.vper = this.vper;
                }
                if(this.eper){
                    params.eper = this.eper;
                }
                if(this.dateValue.length>0){
                    params.dateValue = this.dateValue.join(',');
                }
                that.tableLoading = true;
                that.$http.post("/api/node/queryNodes", that.querystring.stringify(params)
                ).then(function (response) {
                    that.tableLoading = false;
                    if ((response.data.status & 1) == 1) {
                        that.nodeData = response.data.data;
                        that.total = response.page?response.page.totalElements:0;
                    } else if ((response.data.status & 1) != 1) {
                        that.nodeData = [];
                        that.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryNodeList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.queryNodeList();
            },
            arrayToValue(array) {
                var result = 0;
                for(var i=0;i<array.length;i++){
                    var id = array[i];
                    result += id;
                }
                return result;
            },
            valueToArray(value,array) {
                array.sort(function(a,b){return b-a;});
                var result = [];
                var v = value;
                for(var i=0;i<array.length;i++){
                    var id = array[i];
                    if(id<=v){
                        v = v-id;
                        result.splice(result.length-1,0,id);
                    }
                }
                return result;
            },
            changeVType(val) {
                this.vper = this.arrayToValue(val);
                this.queryEData(this.vper,'EData');
                this.EType = [];
                this.eper = this.arrayToValue(this.EType);
            },
            changeEType(val) {
                this.eper = this.arrayToValue(val);
            },
            copyExportResult(){
                this.copyUrl2();
                this.exportResultDialogVisible = false;
            },
            exportResult(){
                this.exportResultValue = '';
                if(this.exportForm.exportType + '' === '0'){
                    this.exportResultValue = 'http://'+this.exportForm.url+'/'+new Date().format('yyyyMMddhhmmss')+'.txt';
                }else{
                    var url = this.exportForm.url;
                    this.exportResultValue += 'ftp://'+this.exportForm.user+':'+this.exportForm.password+'@'+url+this.exportForm.folder;
                    this.exportResultValue += new Date().format('yyyyMMddhhmmss')+'.txt';
                }
                this.exportResultDialogVisible = true;
                this.exportDialogVisible = false;
            }
        }
    };
</script>