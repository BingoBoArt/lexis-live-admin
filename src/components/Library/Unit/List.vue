<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-form v-model="unit" style="margin-left: 20Px" inline>
      <el-form-item label="等级：">
        <el-select @change="updateSelect" v-model="dataObject.searchParam.level" ref="level" clearable placeholder="选择等级" width="120px">
          <el-option v-for="item in levels" :key="item.level" :label="`Level${item.level}`" :value="item.level">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型：">
        <el-select @change="updateSelect" v-model="dataObject.searchParam.lessonTypeId" ref="lessonType" clearable placeholder="选择课程类型">
          <el-option v-for="item in lessonTypes" :key="item.lessonType" :label="item.lessonTypeEn" :value="item.lessonType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <router-link to="/dashboard/Library/Unit/AddUnit">
          <el-button type="success" icon="el-icon-plus" style="margin-left:20px">新增Unit</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <div class="content-main">
      <common-table :dataObject="dataObject"></common-table>
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
    Request,
    Breadcrumb
  },
  data() {
    return {
      levels: [],
      lessonTypes: [],
      unit: {},
      dataObject: {
        index: false,
        dataKey: '',
        idKey: 'unitId',
        spanRow: 'level', // 合并列,
        noPage: true,
        searchUrl: 'unit/getUnitList',
        editUrl: '/dashboard/Library/Unit/AddUnit', // 编辑跳转地址，不传则无编辑按钮
        searchParam: { level: '', lessonTypeId: '' },
        columns: [
          {
            prop: 'level',
            label: 'Level',
            width: 60
          },
          {
            prop: 'unitId',
            label: '编号',
            width: 60
          },
          {
            prop: 'nameEn',
            label: 'Name',
            width: 120
          },
          {
            prop: 'lessonTypeEn',
            label: '课程类型',
            width: 120
          },
          {
            prop: 'nameCh',
            label: '名称'
          },
          {
            prop: 'titleEn',
            label: 'Title'
          },
          {
            prop: 'titleCh',
            label: '标题',
            width: 80
          }
        ]
      }
    }
  },
  mounted() {
    this.getLevelList()
    this.getLessonTypeList()
  },
  // watch: {
  //   'dataObject.searchParam.level': function(val){
  //     if(val){
  //       this.dataObject.searchUrl = 'lesson/getUnitListByLevel'
  //     }else{
  //       this.dataObject.searchUrl = 'lesson/getUnitList'
  //     }
  //   }
  // },
  methods: {
    onSubmitFilter() {
      // this.page.page = 1;
      this.query();
    },
    editDateTow(row) {
      // 页面跳转
      this.$router.push({ path: "/dashboard/Library/Question/AddQuestion", query: { quesId: row.quesId } })
      // this.$router.push({ name: 'Example/Add', query: { id: row.id } })
    },
    query() {
      let data = {
        ...this.unit
      }
      this.dataObject.searchParam = data
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
