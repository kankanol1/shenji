<template>
    <div id="login">
        <canvas-bg :mouseFollow="mouseFollow" :parentDomId="parentDomId"></canvas-bg>
        <div id="login-content">
            <div class="new-login">
                <div class="top">
                    智能审计分析系统
                    <span class="bg1"></span>
                    <span class="bg2"></span>
                </div>
                <div class="bottom">
                    <div class="center">
                        <div class="item">
                            <span class="icon icon-2"></span>
                            <input v-model="username" type="text" placeholder="请输入账号" maxlength="20">
                        </div>
                        <div class="item">
                            <span class="icon icon-3"></span>
                            <input v-model="password" v-if="!passwordShow" type="password" id="loginPwd" placeholder="请输入密码" maxlength="20">
                            <input v-model="password" v-if="passwordShow" type="text" id="loginPwdText" placeholder="请输入密码" maxlength="20">
                            <span :class="passwordShow?'icon icon-4 icon-5':'icon icon-4'" @click="showPassword()"></span>
                        </div>
                    </div>
                    <div style="text-align:center">
                        <el-button type="primary" :loading="loginLoading" style="height:40px;line-height: 24px;font-size:16px;" @click="login">
                            {{loginLoading?'正在登录':'立即登录'}}
                        </el-button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import canvasBg from '../components/canvasBg.vue';
    export default {
        components: {
            'canvas-bg':canvasBg
        },
        data() {
            return {
                mouseFollow:true,
                parentDomId:'login',
                passwordShow:false,
                loginLoading:false,
                show:true,
                username:'',
                password:''
            }
        },
        mounted() {
        },
        methods: {
            showPassword(){
              this.passwordShow = !this.passwordShow;
            },
            login(){
                this.loginLoading = true;
                var that = this;
                that.$http.post("/api/self/logon", that.querystring.stringify({
                    username:that.username,
                    password:that.password
                })).then(response => {
                    if ((response.data.status & 1) == 1) {
                        that.$router.push('/audit/overview');
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: '用户名/密码错误，请重新登录！',
                            type: 'warning'
                        });
                    }
                    that.loginLoading = false;
                }).catch(response => {
                    that.loginLoading = false;
                    that.$message({
                        showClose: true,
                        message: '登录超时，请重试！',
                        type: 'warning'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    #login{
        position: relative;
        width: 100%;
        height: 100%;
        color: #fff;
        /* box-sizing: border-box; */
        overflow-x: hidden;
        background: rgba(7,17,27,0.95);
    }
    #login-content{
        width: 815px;
        top: 50%;
        left: 50%;
        position: fixed;
        z-index:2;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        overflow: hidden;
    }
    .new-login {
        width: 428px;
        position: relative;
        margin:0 auto;
    }
    .new-login .top {
        width: 428px;
        height: 117px;
        background-color: #0371d1;
        border-radius: 12px 12px 0 0;
        font-family: SourceHanSansCN-Regular;
        font-size: 30px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0;
        color: #fff;
        line-height: 117px;
        text-align: center;
        overflow: hidden;
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    .new-login .top .bg1 {
        display: inline-block;
        width: 74px;
        height: 74px;
        background: #fff;
        opacity: .1;
        border-radius: 0 74px 0 0;
        position: absolute;
        left: 0;
        top: 43px;
    }
    .new-login .top .bg2 {
        display: inline-block;
        width: 94px;
        height: 94px;
        background: #fff;
        opacity: .1;
        border-radius: 50%;
        position: absolute;
        right: -16px;
        top: -16px;
    }
    .new-login .bottom {
        width: 428px;
        background: #fff;
        border-radius: 0 0 12px 12px;
        padding-bottom: 23px;
    }
    .new-login .bottom .center {
        width: 288px;
        margin: 0 auto;
        padding-top: 40px;
        padding-bottom: 15px;
        position: relative;
    }
    .new-login .bottom .center .item {
        width: 288px;
        height: 35px;
        border-bottom: 1px solid #dae1e6;
        margin-bottom: 15px;
    }
    .new-login .bottom .center .item .icon-1 {
        background: url(/static/img/icon-login.png) no-repeat 1px 0;
    }
    .new-login .bottom .center .item .icon-2 {
        background: url(/static/img/icon-login.png) no-repeat -54px 0;
    }
    .new-login .bottom .center .item .icon-3 {
        background: url(/static/img/icon-login.png) no-repeat -106px 0;
    }
    .new-login .bottom .center .item .icon-4 {
        background: url(/static/img/icon-login.png) no-repeat 0 -43px;
        position: absolute;
        right: -10px;
        cursor: pointer;
    }
    .new-login .bottom .center .item .icon-5 {
        background: url(/static/img/icon-login.png) no-repeat -55px -43px;
    }
    .new-login .bottom .center .item .icon {
        display: inline-block;
        width: 33px;
        height: 22px;
    }
    .new-login .bottom .center .item input {
        display: inline-block;
        width: 227px;
        height: 22px;
        padding: 0;
        position: absolute;
        border: 0;
        outline: 0;
        font-size: 14px;
        letter-spacing: 0;
    }
    .hide {
        display: none!important;
    }

</style>