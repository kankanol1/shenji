<template>
        <Row>
            <Col span="7">
            <span style="float: right;">{{display}}：</span>
            </Col>
            <Col span="17">
            <el-date-picker ref="datePicker" v-model="filter.filter" :disabled="!enableAll" size="mini"
                            type="daterange" placement="top" style="width: 100%"
            ></el-date-picker>
            </Col>
        </Row>
</template>
<script>

    export default {
        props: ['property', 'display'],
        data() {
            return {
                enableAll: true,
                filter: {
                    type: 'date',
                    filter: [],
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
                        filter: [],
                    });
            },
            isEnabled(){
                return this.enableAll;
            },
            getData() {
                if (!this.enableAll) return [];
                var filter = [];
                if (this.filter.filter[0])
                    filter.push({
                        key: this.property,
                        value: this.filter.filter[0].getTime(),
                        operator: 'gte'
                    })
                if (this.filter.filter[1])
                    filter.push({
                        key: this.property,
                        value: this.filter.filter[1].getTime(),
                        operator: 'lte'
                    })
                return filter;
            }
        }

    };
</script>