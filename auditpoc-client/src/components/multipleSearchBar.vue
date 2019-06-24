<style scoped>


</style>
<template>
    <div class="ivu-input-group-with-prepend" style="display: inline-flex">
        <!--<Select style="width: 100px" class="ivu-input-group-prepend" v-model="selectedType" size="small">-->
        <!--<Option v-for="typeData in nodeTypes" :value="typeData.name" :key="typeData.name"> {{typeData.display}}-->
        <!--</Option>-->
        <!--</Select>-->
        <search-bar v-model="selected"
                    :loading="loading"
                    v-on:searchQuery="queryNodes" :width="width"
                    :notFound="notFound"
                    ref="searchBar"
        >
            <search-result v-for="node in nodeData" :value="node.id" :key="node.id" :label="node.name">
                {{node.name}}
                <em style="color:grey">(编号{{node.uid}}, {{nodeTypes[node.type].display}})</em>
            </search-result>
        </search-bar>
        <slot></slot>
    </div>
</template>
<script>
    import dictionary from '../config/dictionary';
    import Util from '../libs/util';
    import searchBar from '../components/searchBar/searchBar.vue';
    import searchResult from '../components/searchBar/result.vue';

    export default {
        components: {
            'search-bar': searchBar,
            'search-result': searchResult
        },
        props: {
            width: {
                type: Number,
                default: 200
            },
            maxSelect: {
                type: Number,
                default: 0
            },
            queryUrlBuilder: Function
        },
        data() {
            return {
                selected: [],
                query: '',
                loading: false,
                selectedType: 'Department',
                nodeTypes: dictionary.nodeTypes,
                nodeData: [],
                notFound: false,
            }
        },
        methods: {

            refresh() {
                this.selected = [];
                this.nodeData = [];
                this.$refs.searchBar.clear();
            },
            getSelected() {
                return this.selected;
            },
            queryNodes(query) {
                if (!query.trim()) return;
                var url = this.queryUrlBuilder(query, this.selectedType);
                this.loading = true;
                var that = this;
                Util.ajax.get(url, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }).then(function (response) {
                    that.loading = false;
                    that.$set(that, 'nodeData', response.data.nodes);
                })
            }
        },
    }
</script>
