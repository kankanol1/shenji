<style scoped>
    .entity-filter {
        border-bottom: 1px solid #dddee1;;
    }

    .entity-filter .filter-item {
        margin-bottom: 5px;
    }
</style>
<template>
    <div class="entity-filter">
        <Card :padding="8" :bordered="false">
            <Checkbox v-model="check">
                <strong>&nbsp;&nbsp;{{entity.display}}</strong>
            </Checkbox>
            <Row v-for="filter in entity.filters" :key="filter.property" class="filter-item">
                <contains-filter-item
                        v-if="filter.type=='contains'"
                        :display="filter.display"
                        :property="filter.property"
                        :ref="filter.property">
                </contains-filter-item>
                <value-filter-item
                        v-if="filter.type=='value'"
                        :display="filter.display"
                        :property="filter.property"
                        :ref="filter.property">
                </value-filter-item>
                <date-filter-item
                        v-if="filter.type=='date'"
                        :display="filter.display"
                        :property="filter.property"
                        :ref="filter.property">
                </date-filter-item>
            </Row>
        </Card>
    </div>
</template>

<script>
    import containsFilterItem from './filterItem/containsFilterItem.vue';
    import valueFilterItem from './filterItem/valueFilterItem.vue'
    import dateFilterItem from './filterItem/dateFilterItem.vue'

    export default {
        props: ['entity'],
        watch: {
            check: function (curVal) {
                for (var itemName in this.$refs) {
                    curVal ? this.$refs[itemName][0].enable() : this.$refs[itemName][0].disable();
                }
            }
        },
        components: {
            'contains-filter-item': containsFilterItem,
            'value-filter-item': valueFilterItem,
            'date-filter-item': dateFilterItem
        },
        methods: {
            getData() {
                var data = [];
                for (var itemName in this.$refs) {
                    data = data.concat(this.$refs[itemName][0].getData());
                }
                return data;
            },
            reset() {
                for (var itemName in this.$refs) {
                    this.check = true;
                    this.$refs[itemName][0].reset();
                }
            },
            isEnabled(){
                return this.check;
            }

        },
        data() {
            return {
                check: true
            };
        }
    };
</script>