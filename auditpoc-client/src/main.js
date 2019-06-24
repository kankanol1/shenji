import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';

import Util from './libs/util';
import App from './app.vue';

import ElementUI from 'element-ui';
import promise from 'es6-promise';


import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css'
// import './styles/dark-theme.less';

import '../static/css/icon.css';
import Cookies from 'js-cookie';


Vue.use(VueRouter);
Vue.use(iView);
Vue.use(ElementUI, {size: "mini"});
promise.polyfill();

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el,obj) {  //这是需要页面刚加载就能进行聚焦操作使用的钩子函数,可以省略的，视具体需求而定
        //console.log(obj);
        if(obj.value) { //对值进行判断
            // 聚焦元素
            el.focus()
        }
    },
    // 当指令所在组件的 VNode 及其子 VNode 全部更新后调用
    componentUpdated: function(el,obj) {  //这是每当绑定的值发生改变时触发的钩子函数
        //console.log(obj);  //可以打印看一下
        if(obj.value) {
            el.focus()
        }
    }
})

import Axios from 'axios'
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
Axios.defaults.withCredentials = true
// 路由配置
const RouterConfig = {
    mode:'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);
Axios.interceptors.response.use((rep) =>{
    // 成功
    if(rep.data.status==20002 || rep.data.status==401){
        router.push('/audit/login');
    }
    if(rep.data.status == '20000') {
        if(Vue.$getUserInfo){
            Vue.$getUserInfo(function (response) {
                sessionStorage.setItem("userInfo",JSON.stringify(response.data.data||{}));
                router.push('/audit/overview');
            })

        }
    }
    return rep;
}, (error) => {
    //  失败
    let errorMsg = JSON.stringify(error);
    // 超时
    if(errorMsg.toLowerCase().search('timeout') !== -1){
        router.push('/audit/login');
    }
    // 错误代码
    if(error.response){
        switch(error.response.status)
        {
            case 403:
                break;
            case 404:
                break;
            case 500:
                break;
            case 401:
                router.push('/audit/login');
            default:
        }
    }else{
        iView.Message.error('服务器异常');
    }
    iView.Spin.hide();
    // _.toast("网络异常", 'fail');
    return Promise.reject(error);
});
Vue.prototype.$http = Axios;
/***
 *  获取用户状态
 * @param callback 返回回掉函数
 */
Vue.prototype.$getUserInfo = function(callback){
    Axios.post('/api/user/info',{}).then(function (response) {
        callback(response);
    });
}
Vue.prototype.querystring = require('querystring');
var username ;
var password ;
router.beforeEach((to, from, next) => {
        iView.LoadingBar.start();
        Util.title(to.meta.title);
        username = to.query.username;
        password = to.query.password;
        if (username != undefined && password != undefined) {
            Axios.post("/api/self/logon", require('querystring').stringify({
                username: username,
                password: password
            })).then(response => {
                if ((response.data.status & 1) == 1) {
                    sessionStorage.clear();
                    Axios.post('/api/user/info', {}).then(function (response1) {
                        if (!!response1 && response1.status === 200 && (response1.data.status & 1) === 1) {
                            sessionStorage.setItem("userInfo", JSON.stringify(response1.data.data || {}));
                            //that.$router.push('/overview');
                        }
                    });
                    if(to.path!=''){
                        next({path: to.path});
                    }

                } else if ((response.data.status & 1) != 1) {
                    alert('登录失败，请重新登录！')
                }

            }).catch(response => {
                alert('登录失败，请重新登录！')
            });

        } else {
            if (to.path === '/audit/login') {
                next();
            } else {
                if(sessionStorage.getItem("userInfo")==null){
                    next({path: '/audit/login'});
                }else{
                    next();
                }
                /*Axios.post("/api/self/check", {}).then(function (response) {
                    if (response.status === 200 && (response.data.status & 1) === 1) {
                        next();
                    } else {
                        next({path: '/audit/login'});
                    }

                }).catch(function (response) {
                    console.log('catch')
                    next({path: '/audit/login'});
                });*/
            }
        }
    }
);

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});

Util.theme = 'light';

