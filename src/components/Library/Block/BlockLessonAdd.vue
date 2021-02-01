<template>
    <div>
        <breadcrumb></breadcrumb>
        <!-- 查询列表 -->
        <el-row style="margin-bottom: 10px">
            <block-select v-model="selectItem" ></block-select>
            <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back btn">返回</el-button>
        </el-row>
        <!-- add列表 -->
        <el-form ref="blockLessonForm" :model="blockLessonForm" :rules="rules" label-width="120px">
            <el-form-item label="Lesson-中文" prop="lesson">
                <el-input v-model="blockLessonForm.lesson" placeholder="请输入 第 x 课"></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="submitBlock('update')" v-if="this.$route.query.lessonId">修改</el-button>
        <el-button @click="submitBlock('add')" v-else>新增</el-button>
        <!-- 分页 -->
    </div>
</template>
<script>
import BlockSelect from '@/components/Library/Block/BlockSelect'
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
    data () {
        return {
            selectItem: { level: '', unitId: '', blockNo: '', deep: 3 },
            blockLessonForm: {},
            rules: {
                lesson: [{ required: true, message: '请输入BlockLesson', trigger: 'blur' }]
            }
        }
    },
    mounted () {
        let lessonId = this.$route.query.lessonId || null
        if (lessonId) {
            Request({
                url: 'block/getBlockLessonByLessonId?' + 'lessonId=' + lessonId,
                type: 'post'
            }).then(res => {
                this.blockLessonForm = res.data
                this.selectItem.level = res.data.level
                this.selectItem.unitId = res.data.unitId
                this.selectItem.blockNo = res.data.blockNo
            })
        }
    },
    methods: {
        goBack () {
            this.$router.go(-1)
        },
        submitBlock(val) {
             this.$refs['blockLessonForm'].validate((valid) => {
                 if(valid){
                     if(val == 'add'){
                         this.submitBlockLessonAdd()
                     }else if(val == "update"){
                         this.submitBlockLessonUpdate()
                     }
                 }else{
                    //  console.log('error submit!!');
                    return false;
                 }
             })
        },
        submitBlockLessonAdd () {
            let data = {
                ...this.blockLessonForm,
                ...this.selectItem
            }
            // console.log(data)
            Request({
                url: 'block/addBlockLesson',
                data: data,
                type: 'post'
            }).then(res => {
                if (res.code != '0000') {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                } else {
                    this.$message({
                        type: 'success',
                        message: "增加成功"
                    })
                }
            })
        },
        submitBlockLessonUpdate () {
            let data = {
                ...this.blockLessonForm,
                ...this.selectItem
            }
            // console.log(data)
            Request({
                url: 'block/updateBlockLesson',
                data: data,
                type: 'post'
            }).then(res => {
                if (res.code != '0000') {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                } else {
                    this.$message({
                        type: 'success',
                        message: "修改成功"
                    })
                }
            })
        }
    },
    components: {
        BlockSelect,
        CommonTable,
        Breadcrumb,
        Request
    }
}
</script>
