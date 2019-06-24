<template>
    <div class="bannerImg">
        <div class="container">
            <div class="login-form">
                <div class="login-form-body">
                    <h2 class="logintext">智能审计分析平台</h2>
                    <div class="form-group">
                        <label for="username" style="align: right;">账号</label>
                        <input v-model="username" type="text" id="username" name="username" class="form-control"  v-focus="focusIndex === 1" @focus="focusUsername()" @keyup.enter="focusPassword()"/>
                    </div>
                    <div class="form-group">
                        <label for="password">密码</label>
                        <input v-model="password" type="password" id="password" name="password" class="form-control" v-focus="focusIndex === 2" @focus="focusPassword()"  @keyup.enter="login()"
                               style="align: right;"/>
                    </div>




                    <div class="form-group">
                        <button type="submit" class="btn btn-custom btn-block" @click="login()">登录</button>
                    </div>
                </div>
                <div  class="download" style="text-align: center;"><a href="/dist/googel_71.exe">
                    <span style="font-size: 20px;color:#a52a2a;">下载兼容版本浏览器</span>
                </a>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        components: {
        },
        data() {
            return {
                mouseFollow:true,
                parentDomId:'login',
                passwordShow:false,
                loginLoading:false,
                show:true,
                focusIndex:1,
                username:'',
                password:''
            }
        },
       beforeCreate(){
            this.$getUserInfo((response)=>{
                if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                    // this.userInfo = response.data.data||{};
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.data||{}));
                    this.$router.push('/audit/overview');
                }
            })
        },
        mounted() {
            this.focusIndex = 1;
        },
        methods: {
            getUserInfo() {
                this.$getUserInfo((response)=>{
                    if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                        this.userInfo = response.data.data||{};
                        sessionStorage.setItem("userInfo",JSON.stringify(this.userInfo));
                        this.$router.push('/audit/overview');
                    }
                })
            },
            focusUsername(){
                this.focusIndex = 1;
            },
            focusPassword(){
                this.focusIndex = 2;
            },
            showPassword(){
                this.passwordShow = !this.passwordShow;
            },
            login(){
                var that = this;
                this.loginLoading = true;
                if(!this.username){
                    that.$message({
                        showClose: true,
                        message: '请输入用户名！',
                        type: 'warning'
                    });
                    return;
                }
                if(!this.password){
                    that.$message({
                        showClose: true,
                        message: '请输入密码！',
                        type: 'warning'
                    });
                    return;
                }
                that.$http.post("/api/self/logon", that.querystring.stringify({
                    username:that.username,
                    password:that.password
                })).then(response => {
                    if ((response.data.status & 1) == 1) {
                        sessionStorage.clear();
                        this.getUserInfo();
                    } else if ((response.data.status & 1) != 1) {
                        that.$message({
                            showClose: true,
                            message: '用户名/密码错误，请重新登录！',
                            type: 'warning'
                        });
                    }
                    that.loginLoading = false;
                }).catch(response => {
                    debugger
                    that.loginLoading = false;
                    that.$message({
                        showClose: true,
                        message: '登录超时，请重试！',
                        type: 'error'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .container{
        background:none;
    }
    body {
        margin: 0;
    }

    div {
        border: 0;
        margin: 0;
    }

    button {
        border: none;
        cursor:pointer;
    }
    h2{
        display: block;
        font-size: 1.5em;
        -webkit-margin-before: 0.83em;
        -webkit-margin-after: 0.83em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        font-weight: bold;
    }
    .login-form {
        width: 350px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -142px 0 0 -175px;
    }

    .login-form-body {
        border-radius: 5px;
        padding: 20px;
        font-size: 14px;
        background-color: #fff;
        border: 1px solid #d8dee2;
    }

    /*.header {*/
    /*background-color: transparent;*/
    /*text-align: center;*/
    /*border-bottom: 0;*/
    /*font-weight: 500;*/
    /*padding: 80px 0 100px;*/
    /*}*/
    .bannerImg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: url("../../static/img/banner.png") 0 0 no-repeat transparent;
        background-size: 100% 100%;
    }

    .form-group {
        margin-bottom: 26px;
        text-align: center;
    }

    .logintext {
        text-align: center;
    }

    label {
        font-weight: 700;
    }

    input {
        width: 200px;
        height: 26px;
        border-radius: 4px;
        border: none;
        border: 1px #dddee1 solid;
    }

    button[class='btn btn-custom btn-block'] {
        background-color: #2d8cf0;
        width: 235px;
        height: 30px;
        border-radius: 4px;
        color: white;
    }
    .alert{
        color: #8a6d3b;
        background-color: #fcf0a5;
        border-color: #faebcc;
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid transparent;
        border-radius: 4px;
        text-align: center;
    }
    .download{
        margin:80px 0px auto;
        width: 100%;
    }
</style>
