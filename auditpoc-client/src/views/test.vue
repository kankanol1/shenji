<style scoped="">

</style>
<template>
    <el-table :data="tableData3" style="width: 100%">
        <el-table-column label="配送信息">
            <el-table-column label="地址">
                <el-table-column prop="province" label="省份" width="120"></el-table-column>
                <el-table-column prop="city" label="市区" width="120"></el-table-column>
                <el-table-column prop="address" label="地址" width="300"></el-table-column>
            </el-table-column>
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        mounted() {

        },
        components: {
            'layout-copy': copy,
            'layout-header': head
        },
        data() {
            var that = this;
            return {}
        },
        methods: {

        }
    }
</script>