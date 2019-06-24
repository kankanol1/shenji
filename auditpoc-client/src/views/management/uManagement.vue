<style>
</style>
<template>
    <div class="layout">
        <div class="layout-content" style="padding:20px 40px;">
            <management-config></management-config>
        </div>

    </div>
</template>
<script>
    import copy from '../copy.vue';
    import Util from '../../libs/util';
    import management from '../management.vue';

    export default {
        components: {
            'layout-copy': copy,
            'management-config': management,
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
            that.$http.post("/api/user/info", that.querystring.stringify({})).then(response => {
                if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                    that.basicInfo = response.data.data;
                }
            });
        },
        methods: {
            submitInfo() {
                var that = this;
                that.$http.post("/api/user/info/save", that.querystring.stringify(this.basicInfo)).then(response => {
                    if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                        that.$message({type: 'info', message: response.data.msg});
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