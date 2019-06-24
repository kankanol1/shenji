<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px'">
            <h1>暂无数据哦</h1>
        </div>

    </div>
</template>
<script>
    import copy from './copy.vue';
    import graph from '../components/cytoscapeGraph.vue';
    import Util from '../libs/util';
    import searchBar from '../components/paginationSearchBar.vue';
    import dictionary from '../config/dictionary';
    import html2canvas from 'html2canvas'

    export default {
        mounted() {

        },
        components: {
            'layout-copy': copy,
            'graph': graph,
            'search-bar': searchBar
        },
        data() {
            var that = this;
            return {
                height: window.screen.availHeight - 150,
                width: window.screen.availWidth - 60
            }
        },
        methods: {

        }
    };
</script>