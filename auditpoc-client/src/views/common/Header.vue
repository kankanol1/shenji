<template>
    <div class="header" style="background: rgb(86,153,229);">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo"><strong>智能审计分析平台</strong></div>
        <div class="header-right">
            <div class="header-user-con">
                <i class="el-icon-lx-peoplefill"></i>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{userInfo.realname?userInfo.realname:userInfo.name}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <a @click="go2logout">
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </a>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: '',
                message: 2,
                userInfo:{
                    realname:'',
                    name:''
                },
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            getUserInfo() {
                var that = this;
                this.$http.post('/api/user/info',{}).then(function (response) {
                    if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                        that.userInfo = response.data.data||{};
                        sessionStorage.setItem("userInfo",JSON.stringify(that.userInfo));
                    }
                });
            },
            go2logout(){
                var that = this;
                that.$http.post("/api/self/logout",{}).then(function (response) {
                    if(!!response && response.status === 200 && (response.data.status & 1) === 1){
                        sessionStorage.clear();
                        that.$router.push('/audit/login');
                    }else{
                        sessionStorage.clear();
                        that.$router.push('/audit/login');
                    }

                }).catch(function(response){
                    sessionStorage.clear();
                    that.$router.push('/audit/login');
                });
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                var that = this;
                if(command == 'logout'){
                    //localStorage.removeItem('ms_username')
                    that.post("/api/self/logout",{}).then(function (response) {
                        if(response.status === 200 && (response.data.status & 1) === 1){
                            that.$router.push('/login');
                        }else{
                            that.$router.push('/login');
                        }

                    }).catch(function(response){
                        that.$router.push('/login');
                    });

                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
        },
        mounted(){
            //console.log(document.body.clientWidth);
            // if(document.body.clientWidth < 1500){
            //     this.collapseChage();
            // }
            this.getUserInfo();
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 60px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 60px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 60px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
