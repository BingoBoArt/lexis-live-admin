<template>
    <div>
        <breadcrumb></breadcrumb>
        <!-- <el-row v-if="this.$route.params.data"> -->
        <el-row v-if="this.$route.query">
            <el-button @click="goBack">返回</el-button>
        </el-row>
        <el-row>
            <el-row>
                <span>LessonNo:</span>
            </el-row>
            <el-input-number v-model="lesson.lessonNo" placeholder="请输入课件编号"></el-input-number>
            <el-tooltip class="item" effect="dark" content="新增课件" placement="top">
                <el-input-number v-model="lesson.block" :min="0" :max="100" placeholder="请输入block"></el-input-number>
            </el-tooltip>
            <el-input v-model="lesson.seq" placeholder="请输入排序"></el-input>
        </el-row>
        <el-row>
            <el-row style="display: inline-flex">
                <div class="content-nav-level">
                    <el-select v-model="selectItem.level" ref="level" clearable placeholder="请选择等级">
                        <el-option v-for="item in levels" :key="item.level" :label="item.level" :value="item.level">
                        </el-option>
                    </el-select>
                </div>
                <div class="content-nav-source">
                    <el-select v-model="selectItem.lessonType" ref="lessonType" clearable placeholder="请选择课程类型">
                        <el-option v-for="item in lessonTypes" :key="item.lessonType" :label="item.lessonTypeEn" :value="item.lessonType">
                        </el-option>
                    </el-select>
                </div>
                <div class="content-nav-unit">
                    <el-select v-model="selectItem.unitId" ref="unit" placeholder="请选择单元" clearable>
                        <el-option v-for="item in units" :key="item.unitId" :label="item.nameEn" :value="item.unitId">
                        </el-option>
                    </el-select>
                </div>
            </el-row>
        </el-row>
        <el-row style="display: inline-flex">
            <el-row>
                <span>Title：</span>
            </el-row>
            <el-row>
                <el-input v-model="lesson.titleCh" placeholder="请输入中文标题"></el-input>
                <el-input v-model="lesson.titleEn" placeholder="请输入英文标题"></el-input>
            </el-row>
        </el-row>
        <el-row>
            <el-button @click="submit">提交</el-button>
        </el-row>
    </div>
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
    data () {
        return {
            selectItem: { level: '', lessonType: '', unitId: '' },
            lesson: {
            },
            levels: '',
            lessonTypes: '',
            units: ''
        }
    },
    components: {
        Breadcrumb
    },
    mounted () {
        this.getLevelList()
        this.getLessonTypeList()
        this.getUnitList()
        let params = this.$route.params.data
        if (params != null) {
            let url = "lesson/getLessonById"
            let lessonNo = params.lessonNo
            Request({
              url: url,
              type: 'get',
              data: {'lessonNo': lessonNo}
            }).then(res => {
                let lesson = res.data
                this.lesson = lesson
                this.selectItem.level = lesson.level
                this.selectItem.unitId = lesson.unitId
                this.selectItem.lessonType = lesson.lessonType
            })
        }
    },
    methods: {
        submit () {
            let data = {
                ...this.selectItem,
                ...this.lesson
            }
            Request({
              url: 'lesson/addSimpleLesson',
              type: 'post',
              data: data
            }).then(res => {
                if (res.code == '0000') {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: '操作成功'
                    })
                    this.selectItem.lessonNo = res.data
                    this.closeDialog(this.selectItem);
                }else{
                    this.$message({
                        type: "error",
                        showClose: true,
                        message: res.msg
                    })
                }
            })
        },
        // 获取 所有等级
        getLevelList () {
            this.loading = true
            let that = this
            Request({
              url: '/lesson/getLevelList',
              type: 'get'
            }).then(res => {
                // console.log(res.data)
                that.levels = res.data
            })
        },
        // 获取 所有课程类型
        getLessonTypeList () {
            this.loading = true
            let that = this
            Request({
              url: '/lesson/getLessonTypeList',
              type: 'get'
            }).then(res => {
                // console.log(res.data)
                that.lessonTypes = res.data
            })
        },
        // 获取 所有单元
        getUnitList () {
            this.loading = true
            let that = this
            Request({
              url: '/lesson/getUnitList',
              type: 'get'
            }).then(res => {
                // console.log(res.data)
                that.units = res.data
            })
        },
        closeDialog (value) {
            this.$emit("close-lesson-dialog", value)
        },
        goBack () {
            this.$router.go(-1)
        }
    }
}
</script>
