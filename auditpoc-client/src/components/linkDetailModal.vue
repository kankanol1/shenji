<template>
    <div>
        <!--<Button @click="showModal">show</Button>-->
        <link-modify-modal ref="linkModifyModal"></link-modify-modal>
        <Modal v-model="show" width="1000" :styles="{top: '20px'}">
            <p slot="header" style="text-align:center">
                <span style="font-size: 20px">{{info.source.name}}--{{info.target.name}}({{info.type.display}})</span>
            </p>
            <Row v-if="info.type.name&&table.columns.length>2" style="padding: 0 10px">
                <Col span="6" offset="1" v-for="(filter,index) in linkTypes[info.type.name].filters"
                     :key="filter.property"
                     style="margin-bottom:5px;">
                <contains-filter-item
                        v-if="filter.type=='contains'"
                        :display="filter.display"
                        :property="filter.property"

                        ref="filterItem">

                </contains-filter-item>
                <value-filter-item
                        v-if="filter.type=='value'"
                        :display="filter.display"
                        :property="filter.property"
                        ref="filterItem"></value-filter-item>
                <date-filter-item
                        v-if="filter.type=='date'"
                        :display="filter.display"
                        :property="filter.property"
                        ref="filterItem"></date-filter-item>
                </Col>
            </Row>
            <Row type="flex" justify="end">
                <Col span="3">
                <ButtonGroup>
                    <!--<Button type="ghost" icon="refresh" @click="resetFilter()" size="small">
                        重置
                    </Button>
                    <Button type="primary" icon="play" @click="doFilter()" size="small">
                        筛选
                    </Button>-->
                </ButtonGroup>
                </Col>
            </Row>
            <el-table :height="400" :columns="table.columns" :data="table.data" :loading="table.loading">
                <el-table-column
                        label="起点">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.start }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="终点">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.end }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="类型">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.type}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="( item,key, index) in cols" :label="item.title" :key="item.key">
                    <template slot-scope="scope">
                        <span style="margin-left: 0px">{{ scope.row[item.key]}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column label="操作" width="200">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button-->
                                <!--size="mini"-->
                                <!--@click="handleEdit(scope.$index, scope.row)">编辑-->
                        <!--</el-button>-->
                        <!--<el-button-->
                                <!--size="mini"-->
                                <!--type="danger"-->
                                <!--@click.native.prevent="deleteRow(scope.$index, table.data)">删除-->
                        <!--</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <el-pagination
                    @current-change="queryPage"
                    :current-page.sync="pageInfo.current"
                    :page-size="pageInfo.size"
                    layout="prev, pager, next, jumper"
                    :total="pageInfo.totalElements"
                    style="float: right;margin-top: 20px">
            </el-pagination>
            <div class="clearfix"></div>
            <p slot="footer"></p>
        </Modal>
    </div>
</template>
<script>
    import dictionary from '../config/dictionary';
    import containsFilterItem from './filterItem/containsFilterItem.vue';
    import valueFilterItem from './filterItem/valueFilterItem.vue'
    import dateFilterItem from './filterItem/dateFilterItem.vue'
    import linkModifyModal from './linkModifyModal.vue'
    var cols = [];
    var linkInfoObj = {};
    export default {
        components: {
            'contains-filter-item': containsFilterItem,
            'value-filter-item': valueFilterItem,
            'date-filter-item': dateFilterItem,
            'link-modify-modal': linkModifyModal
        },
        data() {
            return {
                show: false,
                linkTypes: dictionary.linkTypes,
                pageInfo: {
                    current: 1,
                    page: 0,
                    size: 10,
                    totalElements: 0
                },
                filter: {},
                table: {
                    columns: [],
                    data: [],
                    loading: true
                },
                info: {
                    source: {},
                    target: {},
                    type: {}
                },
                cols:cols
            }
        },
        methods: {
            doFilter() {
                this.pageInfo.page = 0;
                this.pageInfo.current = 1;
                this.queryPage()
            },
            showModal(linkInfo) {
                this.linkInfoObj = linkInfo;
                this.$set(this.info, 'source', linkInfo.source.data());
                this.$set(this.info, 'target', linkInfo.target.data());
                this.$set(this.info, 'type', linkInfo.type);
                this.cols = [];
                for (var property in linkInfo.type.properties) {
                    this.cols.push({
                        title: linkInfo.type.properties[property].display,
                        key: property
                    })
                }
                this.$nextTick(function () {
                    this.resetFilter();
                    this.show = true;
                });
            },
            handleEdit(index, row) {
                this.$refs.linkModifyModal.showModalEdit(this.linkInfoObj.linkData[index]);
                this.show = false;
            },
            deleteRow(index, rows){
                var that = this;
                rows.splice(index,1);
                that.$http.post("/api/node/deleteNode", that.querystring.stringify({
                    "id": that.linkInfoObj.linkData[index].id,
                    "type": "edge"
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
                })
            },
            resetFilter() {
                for (var i in this.$refs.filterItem) {
                    this.$refs.filterItem[i].reset();
                }
                this.doFilter();
            },
            queryPage() {
                if (!this.info.source || !this.info.target) return;
                this.pageInfo.page = this.pageInfo.current - 1;
                this.$nextTick(function () {
                    var that = this;
                    this.table.loading = true;
                    this.table.data = [];
                    $.ajax({
                        url: '/api/graph/linksBetween',
                        data: {
                            id1: this.info.source.origin.id,
                            id2: this.info.target.origin.id,
                            type: this.info.type.name,
                            page: this.pageInfo.page,
                            size: this.pageInfo.size,
                            filter: function () {
                                var data = [];
                                for (var i in that.$refs.filterItem) {
                                    data = data.concat(that.$refs.filterItem[i].getData());
                                }
                                return JSON.stringify(data);
                            }()
                        },
                        success: function (data) {
                            that.table.loading = false;
                            that.table.data = [];
                            for (var i in data.data) {
                                var rowData = {
                                    start: that.info.source.name,
                                    end: that.info.target.name,
                                    type: that.info.type.display
                                };
                                for (var propertyName in that.linkTypes[that.info.type.name].properties) {
                                    if (!data.data[i].propertyList[propertyName]) continue;
                                    var propertyData = that.linkTypes[that.info.type.name].properties[propertyName];
                                    var cellStr = data.data[i].propertyList[propertyName];
                                    if (propertyData.date)
                                        cellStr = new Date(cellStr * 1).Format(propertyData.dateFormat ? propertyData.dateFormat : 'yyyy:MM');
                                    if (propertyData.decimal)
                                        cellStr = (cellStr * 1).toFixed(2);
                                    rowData[propertyName] = cellStr;
                                }
                                that.table.data.push(rowData);
                            }
                            data.page.current=data.page.page+1;
                            that.$set(that, 'pageInfo', data.page);

                        }
                    });
                })
            },
        }

    }
</script>