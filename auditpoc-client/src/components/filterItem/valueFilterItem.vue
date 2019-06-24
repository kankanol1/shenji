<template>
    <div>
        <Col span="7">
        <span style="float: right;">{{display}}：</span>
        </Col>
        <Col span="8">
        <Input v-model="filter.filter[0]" :disabled="!enableAll" style="width: 98%" size="small" placeholder="最小值"
               number> </Input  >
        </Col>
        <Col span="9">
        <Input v-model="filter.filter[1]" :disabled="!enableAll" style="width: 100%" size="small" placeholder="最大值"
               number> </Input  >
        </Col>
    </div>
</template>
<script>
    export default {
        props: ['property', 'display'],
        data() {
            return {
                enableAll: true,
                enabled: true,
                show: true,
                filter: {
                    type: 'value',
                    filter: [],
                }
            }
        },
        methods: {
            reset() {
                this.$set(this, 'filter',
                    {
                        type: 'value',
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
                        value: this.filter.filter[0],
                        operator: 'gte'
                    })
                if (this.filter.filter[1])
                    filter.push({
                        key: this.property,
                        value: this.filter.filter[1],
                        operator: 'lte'
                    })
                return filter;
            }
        }

    };
</script>