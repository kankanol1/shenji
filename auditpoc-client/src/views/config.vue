<style>
</style>
<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px;padding:20px 40px'">
            <Tabs value="management" style="font-weight: bold;">
                <TabPane label="用户管理" name="management">
                    <management-config></management-config>
                </TabPane>
                <TabPane label="日志管理" name="log">
                    <log-config></log-config>
                </TabPane>
                <TabPane label="授权管理" name="authorization">
                    <authorization-config></authorization-config>
                </TabPane>
                <TabPane label="白名单管理" name="blacklist">
                    <blacklist-config></blacklist-config>
                </TabPane>
            </Tabs>
        </div>

    </div>
</template>
<script>
    import copy from './copy.vue';
    import Util from '../libs/util';
    import management from './management.vue';
    import log from './log.vue';
    import blacklist from './blacklist.vue';
    import authorization from './authorization.vue';

    export default {
        components: {
            'layout-copy': copy,
            'management-config': management,
            'log-config': log,
            'blacklist-config': blacklist,
            'authorization-config': authorization
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