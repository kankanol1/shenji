<style scoped>
    .content-box>.content{
        background-color: #f5f7f9;
    }
</style>
<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <el-menu router style="display: none;">
            <el-menu-item :index="item.index" :key="item.index" ref="item">
                <span slot="title">{{ item.title }}</span>
            </el-menu-item>
        </el-menu>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <!--<v-tags></v-tags>-->
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
        <layout-copy :collapse="{'collapse':collapse}"></layout-copy>
    </div>
</template>

<script>
    import copy from '../copy.vue';
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    /*import vTags from './Tags.vue';*/
    import bus from './bus';
    export default {
        data(){
            return {
                tagsList: [],
                maxMessage: 5,
                item:{
                    index: 'explore?_t='+new Date().getTime(),
                    title: '测试'
                },
                collapse: false
            }
        },
        mounted(){
            var show = sessionStorage.getItem('show');
            if (show === "1") {
                return;
            } else {
                this.queryDoubts('/api/graph/findKinshipHavePaymentList?size=' + this.maxMessage, '亲属与公职人员单位发生贸易往来', 'findKinshipHavePaymentDetail');
                this.queryDoubts('/api/graph/newCompanyGetPaymentList?size=' + this.maxMessage, '新办企业获得财政补贴', 'newCompanyGetPaymentDetail');
                sessionStorage.setItem('show', '1')
            }
        },
        methods:{
            go2NewRouter(fullPath) {
                this.item.index = fullPath;
                var that = this;
                setTimeout(function(){
                    that.$refs.item.$el.click();
                },200);

            },
            queryDoubts(url, title, type) {
                var h = this.$createElement;
                var that = this;
                /*$.post(url, function (data) {
                     var elements = [];
                     for (let i in data.data) {
                         var item = data.data[i];
                         elements.push(
                             h('li', {
                                 style:{
                                     padding: '2px 0'
                                 }
                             }, [
                                 h('span', {
                                     style:{
                                         display:'block',
                                         width:'160px',
                                         overflow:'hidden',
                                         textOverflow:'ellipsis',
                                         whiteSpace:'nowrap',
                                         float:'left',
                                     },
                                     domProps: {
                                         title: item.name,
                                     },
                                     props: {
                                         type: 'text',
                                         size: 'small'
                                     },
                                 }, item.name + ' '),
                                 h('a', {
                                     style:{
                                         display:'block',
                                         float:'left',
                                     },
                                     on: {
                                         click: () => {
                                             that.go2NewRouter('/explore?type=' + type + '&pathId=' + item.id+'&name=' + item.name)
                                         }
                                     }
                                 }, ' 查看详情>>')
                             ])
                         );
                     }
                     if(!data || !data.data || data.data.length==0){
                         return;
                     }
                     that.$notify({
                         title: title,
                         message: h('ul', null, elements),
                         type: 'warning',
                         duration: 4500
                     });
                 });*/
                that.$http.post(url,that.querystring.stringify({}))
                    .then(function (response){
                        var elements = [];
                        for(let i in response.data.data){
                            var item = response.data.data[i];
                            elements.push(
                                h('li',{
                                    style:{
                                        padding: '2px 0'
                                    }
                                },[
                                    h('span',{
                                        style:{
                                            display:'block',
                                            width:'160px',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis',
                                            whiteSpace:'nowrap',
                                            float:'left',
                                        },
                                        domProps:{
                                            title: item.name,
                                        },
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                    },item.name + ''),
                                    h('a',{
                                        style:{
                                            display:'block',
                                            float:'left',
                                        },
                                        on: {
                                            click: () => {
                                                that.go2NewRouter('/explore?type=' + type + '&pathId=' + item.id+'&name=' + item.name)
                                            }
                                        }
                                    },' 查看详情>>')
                                ])
                            );
                        }
                        if(!response.data || !response.data.data || response.data.data.length==0){
                            return;
                        }
                        that.$notify({
                            title: title,
                            message: h('ul', null, elements),
                            type: 'warning',
                            duration: 4500
                        });
                    })
            }
        },
        components:{
            vHead,
            vSidebar,
            //vTags,
            'layout-copy':copy,
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            })
        }
    }
</script>
