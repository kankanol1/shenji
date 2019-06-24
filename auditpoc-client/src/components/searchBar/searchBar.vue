<style scoped>

</style>
<template>
    <div class="ivu-select ivu-select-multiple" :style="'width:'+width+'px'" @click="handleOpen"
         v-clickoutside="handleClose">
        <div class="ivu-select-selection">
            <div class="ivu-tag" v-for="(item,index) in selectedResults" :key="index">
                <span class="ivu-tag-text">{{ item.name }}</span>
                <Icon type="ios-close-empty" @click.native.stop="removeTag(index)"></Icon>
            </div>
            <input v-model="query" type="text" placeholder="请输入相关节点" class="ivu-select-input"
                   :style="'min-width:'+(width*0.3)+'px'" ref="input">
        </div>
        <transition name="fade">
            <div class="ivu-select-dropdown" v-show="resultListVisible" ref="resultList">
                <ul v-show="notFound" class="ivu-select-not-found">
                    <li>无匹配数据</li>
                </ul>
                <ul v-show="!notFound&&!loading" class="ivu-select-dropdown-list">
                    <slot></slot>
                </ul>
                <ul v-show="loading" class="ivu-select-loading">加载中</ul>
            </div>
        </transition>
    </div>
</template>
<script>
    import clickoutside from '../../libs/clickoutside';

    export default {
        directives: {clickoutside},
        watch: {
            query(curVal) {
                if (curVal.length == 0) return;
                var that = this;
                that.query = curVal;
                that.queryLastUpdate = (new Date()).getTime();

                setTimeout(function () {
                    var now = (new Date()).getTime();
                    if (now - that.queryLastUpdate >= 400) {
                        that.$emit('searchQuery', that.query)
//                        that.query = '';
                    }
                }, 401);
            }
        },
        model: {
            prop: 'selected',
            event: 'change'
        },
        props: {
            width: Number,
            selected: Array,
            loading: {
                type: Boolean,
                default: false
            },
            notFound: {
                type: Boolean,
                default: false
            },
            maxSelect: 0
        },
        data() {
            return {
                selectedResults: [],
                query: '',
                resultListVisible: false,
                queryLastUpdate: (new Date()).getTime()
            }
        },
        methods: {
            clear() {
                this.selectedResults = [];
            },
            handleOpen() {
                this.resultListVisible = true;
                this.$refs.input.focus();
            },
            handleClose() {
                this.resultListVisible = false;
            },
            removeTag(index) {
                var result = this.selectedResults[index];
                this.selectedResults.splice(index, 1);
                this.selected.splice(index, 1);
                for (var i in this.$children) {
                    var child = this.$children[i];
                    if (child.$options._componentTag != 'search-result') continue;
                    child.selectStateChanged(result, false);
                }
            },
            resultSelectChanged: function (value) {
                if (value.selected && this.selected.indexOf(value.id) < 0) {
                    this.selected.push(value.id);
                    this.selectedResults.push(value);
                }
                if (!value.selected && this.selected.indexOf(value.id) >= 0) {
                    this.removeTag(this.selected.indexOf(value.id));
                }
            }
        },
    }
</script>
