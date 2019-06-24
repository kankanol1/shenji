<style>
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
                                <Input v-model="basicInfo.realname"
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
                                <Tag v-model="basicInfo.role" type="border" color="blue">{{basicInfo.role}}</Tag>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="所属科室">
                        <Row>
                            <Col span="20">
                                <Tag v-model="basicInfo.office.officename" type="border" color="blue">{{basicInfo.office.officename}}</Tag>
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
                basicInfo: {
                    name: '',
                    realname: '',
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
                this.$http.post("/api/user/info/save", this.querystring.stringify(this.basicInfo)).then(response => {
                    if (!!response && response.status === 200 && (response.data.status & 1) === 1) {
                        this.$message({showClose:true,type: 'success', message: response.data.msg});
                    }
                }).catch(response=>{
                    this.$message({showClose:true,type: 'error', message: '网络异常，请重试'});
                });
            },
        }
    }
</script>