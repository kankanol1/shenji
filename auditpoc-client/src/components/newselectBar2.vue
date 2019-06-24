<style scoped>
    .ivu-input-group-append {
        padding-right: 20px;
    }
    #select2 li:hover{
        color:blue;
        background:Silver;
    }
    li {list-style-type:none; color:#000000;}

    .button { /* 按钮美化 */
        width: 45px; /* 宽度 */
        height: 25px; /* 高度 */
        border-width: 0px; /* 边框宽度 */
        border-radius: 3px; /* 边框半径 */
        background: #1E90FF; /* 背景颜色 */
        cursor: pointer; /* 鼠标移入按钮范围时出现手势 */
        outline: none; /* 不显示轮廓线 */
        font-family: Microsoft YaHei; /* 设置字体 */
        color: white; /* 字体颜色 */
        font-size: 8px; /* 字体大小 */
    }
    .button:hover { /* 鼠标移入按钮范围时改变颜色 */
        background: #5599FF;
    }
</style>
<template>
    <div id="selectPage" class="ivu-input-group-with-append" style="display: inline-flex;">


        <!--选择框 -->
        <div style="width:153px" >

            <div style="float:left;" >
                <input id="sousu2" style="height:30px;border-radius:5px;width:150px;" autocomplete="off"  v-on:input="setOption()"  />
                <input id="nodeid2" style="display: none;"  autocomplete="off" />
            </div>

            <!--下拉选择 -->
            <div style="" >
                <div id="select2" style="border-radius:5px;display:none;border:1px solid #000;margin-top: 30x;width:150px;overflow-x: auto;white-space: nowrap;">
                    <div style="text-align: center;margin-top: 5px;">
                        <button value="" class="button" style="margin-top:10px;"  @click.stop="preData">上一页</button>(第{{page+ 1}}/{{totalPages}}页)<button class="button"  style="margin-top:10px;" value="" @click.stop="nextData">下一页</button>
                    </div>
                    <ul v-for="node in nodeData"  id="selectUl2" style="margin:0; padding:5px; text-align:left;">
                        <li  @click="getValue(node.name,node.id)"> {{node.name}}<em style="color:grey">(类型:{{node.type ? nodeTypes[node.type].display:'未知'}} {{node.uid ? ',编号:'+node.uid:''}})</em></li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import dictionary from '../config/dictionary';
    import searchBar from '../components/searchBar/searchBar.vue';
    import searchResult from '../components/searchBar/result.vue';
    import Util from '../libs/util';

    export default {
        props: {
            // width: {
            //     type: Number,
            //     default: 300
            // },
            maxNodeSelect: {
                type: Number,
                default: 1
            },
            enableSelectAll: {
                type: Boolean,
                default: false
            },
            onSearch: {
                type: Function
            }
        },

        data() {
            return {
                nodeSelect: '',
                fullSelectedData: {},
                query: '',
                queryLastUpdate: 0,
                searchBarLoading: false,
                nodeTypes: dictionary.nodeTypes,
                nodeData: [],
                first: true,
                last: true,
                total: 0,
                pageSize: 10,
                page: 0,
                totalPages: 0
            }
        },
        components: {
            'search-bar': searchBar,
            'search-result': searchResult
        },
        methods: {
            updateXY:function(event){
                this.x=event.offsetX;
                this.y=event.offsetY
            },
            getSelected() {
                return $("#nodeid2").val();
            },
            getSelectedName() {
                return $("#sousu2").val();
            },
            preData() {
                if (this.first) return;
                this.page = this.page - 1;
                this.queryNodes(this.query)
            },
            nextData() {
                if (this.last) return;
                this.page = this.page + 1;
                this.queryNodes(this.query)
            },
            changeNode(value) {
                var that = this;
                var nodeData = this.nodeData || [];
                nodeData.forEach(function (item, index) {
                    if (item.id == value) {
                        that.nodeSelectName = item.name;
                    }
                });
            },
            setOption(){//
                    this.page=0;
                    var obj = document.getElementById("sousu2")
                    var sizeObj = obj.getBoundingClientRect(); // 取得元素距离窗口的绝对位置
                    // 窗口的滚动偏移（垂直、水平）
                    var bodyOffset = {top: document.body.scrollTop, left: document.body.scrollLeft};
                    // 元素相对于页面的绝对位置 = 窗口滚动偏移 + 元素相对于窗口的绝对位置
                    var inputOffsetTop = sizeObj.top + bodyOffset.top; // 距顶部
                    var inputOffsetLeft = sizeObj.left + bodyOffset.left; // 距左侧
                    //document.getElementById("select2").style.position = "absolute";
                    document.getElementById("select2").style.left=inputOffsetLeft;
                    document.getElementById("select2").style.top=inputOffsetTop+130;
                    $("#select2").show();
                    //
                    this.queryNodes(obj.value)


            },
            getValue(nodename,nodeid2){//获取选中的值

                $("#sousu2").val(nodename);
                $("#nodeid2").val(nodeid2);

                $("#select2").hide();

            },

            queryNodes(query) {
                if (!query.trim()) return;
                query = query.trim();
                this.query = query;
                if (!query) return;
                this.searchBarLoading = true;
                var that = this;

                var realQuery = query;
                var url = '/api/node/queryNodes';
                var params = {
                    value: realQuery,
                    page: that.page,
                    size: that.pageSize,
                    vper: 15
                };
                if(Util.testPersonUid(query)){
                    url = '/api/node/person-uid';
                    params = {uid: query}
                }
                console.log(url)
                that.$http.post(url,that.querystring.stringify(params))
                    .then(function (response){
                        if(response.data){
                            console.log(response.data)
                            that.searchBarLoading = false;
                            that.$set(that, 'nodeData', response.data.data || []);
                            if (response.data.page) {
                                that.first = response.data.page.first;
                                that.last = response.data.page.last;
                                that.total = response.data.page.totalElements;
                                that.page = response.data.page.page;
                                that.totalPages = response.data.page.totalPages;
                            }else{
                                that.first = true;
                                that.last = true;
                                that.total = 0;
                                that.page = 0;
                                that.totalPages = 0;
                            }
                        }
                    })
            }
        }
    }
</script>