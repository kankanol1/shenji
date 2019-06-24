<template>
    <Row>
        <Col span="7">
        <span style="float: right;">{{display}}(精确匹配)：</span>
        </Col>
        <!--<Col span="7">-->
        <!--<Select v-model="filter.operator" size="small" :disabled="!enableAll" style="width: 97%;">-->
        <!--<Option v-for="item in operators" :value="item.value" :key="item.value">{{ item.label}}</Option>-->
        <!--</Select>-->
        <!--</Col>-->
        <Col span="17">

        <Input v-model="filter.expression" size="small" placeholder="属性值"
               :disabled="!enableAll" style="width: 100%;"></Input>
        </Col>
    </Row>
</template>
<script>
    export default {
        props: ['property', 'display'],
        data() {
            return {
                operators: [
                    {
                        value: 'textContains',
                        label: '精确匹配'
                    },
//                    {
//                        value: 'notContains',
//                        label: '不包含'
//                    }
                ],
                enableAll: true,
                filter: {
                    type: 'contains',
                    operator: 'textContains',
                    expression: '',
                }
            }
        },
        methods: {
            disable() {
                this.enableAll = false;
            },
            enable() {
                this.enableAll = true;
            },
            reset() {
                this.$set(this, 'filter',
                    {
                        type: 'contains',
                        operator: 'textContains',
                        expression: '',
                    });
            },
            isEnabled(){
                return this.enableAll;
            },
            getData() {
                if (!this.enableAll || !this.filter.expression) return [];
                return [
                    {
                        key: this.property,
                        value: this.filter.expression,
                        operator: this.filter.operator
                    }
                ]
            }
        }

    };
</script>