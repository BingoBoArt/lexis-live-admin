<template>
  <div>
    <el-form>
      <el-form-item label="请选择学校：">
        <el-select v-model="schoolSelect" clearable>
          <el-option v-for="(item,index) in SchoolSemesterList || []" :key="index" :label="item.name" :value="item.schoolId"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择班级：">
        <el-select v-model="semesterSelect" clearable>
          <el-option v-for="(item,index) in semesterList || []" :key="index" :label="item.name" :value="item.semester"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Request from '@/common/request.js'
export default {
  data() {
    return {
      SchoolSemesterList: [],
      schoolSelect: '',
      semesterSelect: ''
    }
  },
  mounted() {
    this.getSchoolSemesterList()
  },
  watch: {
    schoolSelect: function () {
      this.semesterSelect = ''
      this.$emit("school-select", this.schoolSelect)
    },
    semesterSelect: function () {
      this.$emit("semester-select", this.semesterSelect)
    }
  },
  computed: {
    semesterList() {
      if (this.schoolSelect) {
        let schoolOb = this.SchoolSemesterList.filter(item => {
          return item.schoolId === this.schoolSelect
        })
        return schoolOb[0].children
      }
    }
  },
  methods: {
    getSchoolSemesterList() {
      Request({
        url: 'schedule/school/semester',
        type: 'get'
      }).then(res => {
        if (res.code == 0) {
          this.SchoolSemesterList = res.data
        }
      })
    }
  }
}
</script>

<style>
</style>
