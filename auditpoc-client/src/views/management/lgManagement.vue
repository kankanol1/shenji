<style>
</style>
<template>
    <div class="layout">
        <div class="layout-content" style="padding: 20px 40px">
            <log-config></log-config>
        </div>

    </div>
</template>
<script>
    import copy from '../copy.vue';
    import Util from '../../libs/util';
    import log from '../log.vue';

    export default {
        components: {
            'layout-copy': copy,
            'log-config': log,
        },
        data() {
            return {
                height: window.screen.availHeight - 150,
                formItem: {
                    primaryPassword: '',
                    newPassword: '',
                    repeatPassword: ''
                },
                basicInfo: {
                    name: '',
                    realName: '',
                    tel: '',
                    mail: '',
                    role: ''
                },
                differentPass: false
            }
        },
        mounted() {
            var that = this;
            that.$http.post("/api/user/info", that.querystring.stringify({})).then(data => {
                if (!!data && data.status === 200) {
                    that.basicInfo = data.data;
                }
            });
        },
        methods: {
            submitInfo() {
                var that = this;
                that.$http.post("/api/user/info/save", that.querystring.stringify(this.basicInfo)).then(data => {
                    if (!!data && data.status === 200) {
                        that.$message({type: 'info', message: data.data});
                    }
                });
            },
            submit() {
                var that = this;
                if (that.formItem.newPassword === that.formItem.repeatPassword) {
                    that.differentPass = false;
                    that.$http.post("/api/user/password", that.querystring.stringify(this.formItem)).then(data => {
                        if (!!data && data.status === 200) {
                            that.$message({type: 'info', message: data.data});
                        }
                    });
                } else {
                    that.differentPass = true;
                }
            }
        }
    }
</script>