<meta name="HandheldFriendly" content="true" />
<meta name="MobileOptimized" content="320" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<template>
    <div id="da-wrapper" class="fluid">
        <!-- Content -->
        <div id="da-content">
            <!-- Container -->
            <div class="da-container clearfix">
                <div id="da-error-wrapper">
                    <div id="da-error-pin"></div>
                    <div id="da-error-code">
                        error <span>404</span>
                    </div>
                </div>
            </div>
            <div style="text-align: center;margin-top:50px;">
                <h1 class="da-error-heading" style="color:red">页面不存在！</h1>
                <a href="/" style="font-size: 15px;">点击进入首页</a>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "errorinfo"
    }
</script>

<style scoped>
    @import "../../static/css/dandelion.css";
</style>