<style scoped>
    .form {
        width: 500px;
        display: block;
        margin: 60px auto;
    }

    .passText {
        text-align: center;
        margin-top: 40px;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-content" :style="'height:'+height+'px;padding:20px'">
            <Tabs value="info" style="font-weight: bold;">
                <TabPane label="个人信息" name="info">
                    <h3 class="passText" style="font-weight: bold;">个人信息</h3>
                    <div class="form">
                        <Form ref="formInline" :label-width="80">
                            <FormItem label="用户名">
                                <Row>
                                    <Col span="20">
                                        <Input v-model="basicInfo.name" disabled></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="真实姓名">
                                <Row>
                                    <Col span="20">
                                        <Input v-model="basicInfo.realName"
                                               disabled></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="电话">
                                <Row>
                                    <Col span="20">
                                        <Input v-model="basicInfo.tel" placeholder="电话"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="邮箱">
                                <Row>
                                    <Col span="20">
                                        <Input v-model="basicInfo.mail" placeholder="邮箱"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="角色">
                                <Row>
                                    <Col span="20">
                                        <Tag v-model="basicInfo.tel" type="border" color="blue">{{basicInfo.role}}</Tag>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span="20">
                                        <Button type="primary" long @click="submitInfo">提交</Button>
                                    </Col>
                                </Row>
                            </FormItem>

                        </Form>
                    </div>
                </TabPane>
                <TabPane label="密码修改" name="pass">
                    <h3 class="passText" style="font-weight: bold;">密码修改</h3>
                    <div class="form">
                        <Form ref="formInline" :label-width="80">
                            <FormItem label="旧密码">
                                <Row>
                                    <Col span="20">
                                        <Input v-model="formItem.primaryPassword" placeholder="旧密码"
                                               type="password"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="新密码">
                                <Row>
                                    <Col span="20">
                                        <Input v-model="formItem.newPassword" placeholder="密码" type="password"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="密码确认">
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
                                        <Button type="primary" long @click="submit">提交</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>

        </div>

    </div>
</template>
<script>
    import copy from './copy.vue';
    import Util from '../libs/util'

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
                    this.differentPass = true;
                }
            }
        }
    }
</script>