<style scoped>
    .layout-copyright {
        border-top: 1px solid #ddd;
        text-align: center;
        color: #fff;
        height: 40px;
        line-height: 40px;
        position: absolute;
        bottom: 0;
        left:180px;
        width: auto;
        right:0;
        background:rgb(86, 153, 229);
    }
</style>
<template>
    <div class="layout-copyright" :style="'left:'+(collapse.collapse==true?'64':'210')+'px'">
        <!--<a href="http://www.gl-data.com/" target="_blank">-->
        <a href="http://www.gl-data.com/">
            济南观澜数据技术有限公司 &copy 2017
        </a>
    </div>
</template>
<script>
    export default {
        props:{
            collapse: {
                type: Object
            },
        },
    }
</script>