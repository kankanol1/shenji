<style scoped>
    .form {
        width: 500px;
        display: block;
        margin: 20px auto;
    }

    .passText {
        text-align: center;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px;padding:20px'">
            <h3 class="passText" style="font-weight: bold;">密码修改</h3>
            <div class="form">
                <Form ref="formItem" :model="formItem"  :rules='ruleValidate' :label-width="80">
                    <FormItem label="旧密码" prop="primaryPassword">
                        <Row>
                            <Col span="20">
                                <Input v-model="formItem.primaryPassword" placeholder="旧密码"
                                       type="password"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="新密码" prop="newPassword">
                        <Row>
                            <Col span="20">
                                <Input v-model="formItem.newPassword" placeholder="密码" type="password"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="密码确认" prop="repeatPassword">
                        <Row>
                            <Col span="20">
                                <Input v-model="formItem.repeatPassword" placeholder="密码确认"
                                       type="password"></Input>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="20">
                                <h6 style="color: red;" v-if="differentPass">两次密码输入不一致</h6>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="20">
                                <Button type="primary" long @click="submit('formItem')">提交</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </div>
        </div>

    </div>
</template>
<script>
    import copy from '../copy.vue';
    import Util from '../../libs/util'

    export default {
        components: {
            'layout-copy': copy,
        },
        data() {
            return {
                height: window.screen.availHeight - 150,
                formItem: {
                    primaryPassword: '',
                    newPassword: '',
                    repeatPassword: ''
                },
                differentPass: false,
                ruleValidate: {
                    primaryPassword: [
                        {required: true, message: '旧密码不能为空', trigger: 'blur'},
                    ],
                    newPassword: [
                        {required: true, message: '新密码不能为空',trigger: 'blur'}
                    ],
                    repeatPassword: [
                        {required: true, message: '密码确认不能为空',trigger: 'blur'}
                    ]
                },
            }
        },
        mounted() {
        },
        methods: {
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.formItem){
                            if (!this.formItem.primaryPassword || !this.formItem.newPassword || !this.formItem.repeatPassword) {
                                this.$message({
                                    showClose: true,
                                    message: '密码格式不正确!',
                                    type: 'warning'
                                });
                                return;
                            }
                            if (this.formItem.newPassword === this.formItem.repeatPassword) {
                                this.differentPass = false;
                                this.$http.post("/api/user/password", this.querystring.stringify(this.formItem)).then(response => {
                                    if (!!response && response.status === 200) {
                                        if ((response.data.status & 1) === 1) {
                                            this.$message({
                                                type: 'success',
                                                message: response.data.msg
                                            });
                                        } else {
                                            this.$message({
                                                type: 'warning',
                                                message: response.data.msg
                                            });
                                        }
                                    }
                                });
                            } else {
                                this.differentPass = true;
                            }
                        }
                    }
                })
            }
        }
    }
</script>