<template>
    <div>
        <breadcrumb></breadcrumb>
        <!-- 查询列表 -->
        <el-row style = "margin-bottom: 10px">
            <block-select v-model="BlockObject.searchParam"></block-select>
            <el-button type="success" icon="el-icon-plus" @click="addBlock" style="float:right">新增Block</el-button>
        </el-row>
        <!-- block列表 -->
        <common-table :dataObject="BlockObject"></common-table>
        <!-- 分页 -->
    </div>
</template>
<script>
import BlockSelect from '@/components/Library/Block/BlockSelect'
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
export default {
    data () {
        return {
            BlockObject: {
                index: false,
                dataKey: 'blockList',
                idKey: 'blockNo',
                searchUrl: 'block/getBlockList',
                editUrl: '/dashboard/library/Block/AddBlock', //编辑页面名称
                searchParam: { level: '', unitId: '', deep: 2 },
                columns: [
                    {
                        prop: 'blockNoName',
                        label: 'Block编号',
                        width: 120
                    },
                    {
                        prop: 'level',
                        label: '等级',
                        width: 60
                    },
                    {
                        prop: 'unitNameEn',
                        label: '单元',
                        width: 100
                    },
                    {
                        prop: 'targetTitle',
                        label: 'Block目标标题',
                        width: 130
                    },
                    {
                        prop: 'targetText',
                        label: 'Block目标内容'
                    }
                ]
            }
        }
    },
    methods: {
        addBlock () {
            this.$router.push({ path: '/dashboard/library/Block/AddBlock', query: { ...this.BlockObject.searchParam } })
        }
    },
    components: {
        BlockSelect,
        CommonTable,
        Breadcrumb
    }
}
</script>
