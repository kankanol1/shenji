<template>
    <Modal v-model="showModal"
           title="二次搜索"
           @on-ok="ok"
           ok-text="搜索"
    >
        <Row>
            <Col span="4">
            <span>节点名称</span>
            </Col>
            <Col span="20">
            <search-bar v-model="nodeSelect" style="width: 100%;padding: 0px;" :loading="searchBarLoading"
                        :notFound="notFound"
                        v-on:searchQuery="queryNodes">
                <li class="ivu-select-group-wrap">
                    <div>
                        <Checkbox v-model="checkALL">全选</Checkbox>
                    </div>
                    <ul v-if="nodeData.length>0">
                        <li class="ivu-select-group">
                            <search-result v-for="result in nodeData" :value="result.id" :label="result.name">
                                {{result.name}}
                                <em style="color:grey">(编号{{node.uid}})</em>
                            </search-result>
                        </li>
                    </ul>
                </li>
            </search-bar>
            </Col>
        </Row>
    </Modal>

</template>

<script>
    import searchBar from '../components/searchBar/searchBar.vue';
    import searchResult from '../components/searchBar/result.vue'

    export default {
        components: {
            'search-bar': searchBar,
            'search-result': searchResult
        },
        methods: {
            queryNodes(query) {
            },
            show() {
                this.showModal = true;
            },
            hide() {
                this.showModal = false;
            }
        },
        data() {
            return {
                nodeData: [],
                nodeSelect: [],
                checkALL: false,
                showModal: false
            }
        }
    };
</script>