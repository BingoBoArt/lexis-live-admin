<template>
    <div>
        <breadcrumb></breadcrumb>
        <!-- 查询列表 -->
        <el-row style="margin-bottom: 10px">
            <block-select v-model="BlockLessonObject.searchParam"></block-select>
            <el-button type="success" icon="el-icon-plus" @click="addBlockLesson" style="float: right">新增BlockLesson</el-button>
        </el-row>
        <!-- block列表 -->
        <common-table :dataObject="BlockLessonObject"></common-table>
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
            BlockLessonObject: {
                index: false,
                dataKey: 'blockLessonList',
                idKey: 'lessonId',
                searchUrl: 'block/getBlockLessonList',
                editUrl: '/dashboard/library/Block/LessonAdd', //编辑页面名称
                searchParam: { level: '', unitId: '', blockNo: '', deep: 3 },
                columns: [
                    {
                        prop: 'lessonId',
                        label: 'Blocklesson ID',
                        width: 80
                    },
                    {
                        prop: 'level',
                        label: '等级',
                        width: 60
                    },
                    {
                        prop: 'unitName',
                        label: '单元',
                        width: 80
                    },
                    {
                        prop: 'blockNoName',
                        label: 'block编号',
                        width: 120
                    },
                    {
                        prop: 'lesson',
                        label: 'Lesson-中文'
                    }
                ]
            }
        }
    },
    methods: {
        addBlockLesson () {
            this.$router.push({ path: '/dashboard/library/Block/LessonAdd', query: { ...this.BlockLessonObject.searchParam } })
        }
    },
    components: {
        BlockSelect,
        CommonTable,
        Breadcrumb
    }
}
</script>
