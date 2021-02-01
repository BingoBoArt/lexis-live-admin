<template>
  <div>
    <breadcrumb></breadcrumb>
    <div>
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
      <el-form :model="unit" label-width="120px" label-position="right" :rules="rules" ref="unit">
        <el-form-item label="等级：" prop="level" >
          <el-select @change="updateSelect" v-model="unit.level" ref="level" 
           clearable placeholder="选择等级" width="120px" :disabled="this.$route.query.unitId">
            <el-option v-for="item in levels" :key="item.level" :label="`Level${item.level}`" :value="item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型：" prop="lessonTypeId">
          <el-select @change="updateSelect" v-model="unit.lessonTypeId" ref="lessonType" clearable placeholder="选择课程类型">
            <el-option v-for="item in lessonTypes" :key="item.lessonType" :label="item.lessonTypeEn" :value="item.lessonType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元名称:" prop="nameCh">
          <el-input v-model="unit.nameCh" placeholder="请输入单元名称"></el-input>
        </el-form-item>
        <el-form-item label="UnitName:" prop="nameEn">
          <el-input v-model="unit.nameEn" placeholder="请输入UnitName"></el-input>
        </el-form-item>
        <el-form-item label="标题名称:" prop="titleCh">
          <el-input v-model="unit.titleCh" placeholder="请输入标题名称"></el-input>
        </el-form-item>
        <el-form-item label="TitleName:" prop="titleEn">
          <el-input v-model="unit.titleEn" placeholder="请输入TitleName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="plannedLessons:">
          <el-input v-model.number="unit.plannedLessons" placeholder="请输入plannedLessons"></el-input>
        </el-form-item>
        <el-form-item label="completedLessons:">
          <el-input v-model.number="unit.completedLessons" placeholder="请输入completedLessons"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="saveUnit" v-if="!$route.query.unitId">AddUnit</el-button>
          <el-button @click="updateUnit" v-else>UpdateUnit</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  components: {
    CommonTable,
    Breadcrumb,
    Request
  },
  data() {
    return {
      unit: {},
      levels: [],
      lessonTypes: [],
      rules: {
        level: [
          { required: true, message: '等级不能为空', trigger: 'blur' }
        ],
        lessonTypeId: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        nameCh: [
          { required: true, message: '名称不能为空', trigger: 'change' }
        ],
        nameEn: [
          { required: false, message: '名称英文不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getLevelList();
    this.getLessonTypeList()
    this.init()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    init() {
      if (this.$route.query.unitId) {
        let unitId = this.$route.query.unitId
        Request({
          url: 'unit/info',
          data: {unitId: unitId},
          type: 'post'
        }).then(res => {
          this.unit = res.data
        })
      }
    },
    saveUnit() {
      this.$refs['unit'].validate((valid, obj) => {
        if (valid) {
          let url = 'unit/addUnit'
          Request({
            url: url,
            type: 'post',
            data: this.unit,
            headers: { 'Content-Type': 'application/json' }
          }).then(res => {
            if (res.code == 0) {
              this.$message.success('新增成功')
              this.goBack()
            }
          })
        }
      })
    },
    updateUnit() {
      this.$refs['unit'].validate((valid, obj) => {
        if (valid) {
          let url = 'unit/updateUnit'
          Request({
            url: url,
            type: 'post',
            data: this.unit
            // headers: { 'Content-Type': 'application/json' }
          }).then(res => {
            if (res.code == 0) {
              this.$message.success('修改成功')
              this.goBack()
            }
          })
        }
      })
    },
    // 获取 所有等级
    getLevelList() {
      this.loading = true
      let that = this
      Request({
        url: '/lesson/getLevelList',
        type: 'get'
      }).then(res => {
        that.levels = res.data
      })
    },
    // 获取 所有课程类型
    getLessonTypeList() {
      this.loading = true
      let that = this
      Request({
        url: '/lesson/getLessonTypeList',
        type: 'get'
      }).then(res => {
        // console.log(res.data)
        that.lessonTypes = res.data
      })
    }
  }
}
</script>
