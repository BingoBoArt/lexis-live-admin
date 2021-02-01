
<template>
  <div>
    <breadcrumb></breadcrumb>
    <div name="serchList">
      <el-form inline>

        <el-form-item label="请输入老师名称：">
          <el-input v-model="teacherOb.searchParam.nickname"></el-input>
        </el-form-item>
        <el-form-item label="请输入老师邮箱：">
          <el-input v-model="teacherOb.searchParam.email"></el-input>
        </el-form-item>

      </el-form>
    </div>
    <div>
      <common-table :dataObject="teacherOb">
        <el-table-column prop="" label="Active" :width="80">
          <template slot-scope="{row}">
            <el-button @click="selectTeachLog(row.userId)">Search</el-button>
          </template>
        </el-table-column>
      </common-table>
    </div>
    <!-- teachLog -->
    <div v-if="showList" name="teachLog">
      <el-form inline>
        <el-form-item label="时间线：">
          <el-select v-model="teachLogOb.searchParam.semester" clearable placeholder="请选择时间线">
            <el-option v-for="item in semesterList" :key="item.scheduleId" :label="item.title" :value="item.scheduleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份：" prop="">
          <el-date-picker type="month" v-model="teachLogOb.searchParam.month" value-format="yyyy-MM" format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Done">
          <span>{{this.done}}</span>
        </el-form-item>
        <el-form-item label="noShow">
          <span>{{this.noShow}}</span>
        </el-form-item>
      </el-form>
      <el-table :data="resultList">
        <el-table-column :width="column.width" :prop="column.prop" :label="column.label" v-for="(column,index) in teachLogOb.columns" :key="index">
        </el-table-column>
        <el-table-column prop="isShow" label="Status" :width="80">
          <template slot-scope="{row}">
            <span v-if="row.isShow == 1" style="color: green">Done</span>
            <span v-if="row.isShow == 0" style="color: red">No Show</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
// <script>
// import Breadcrumb from '@/components/Common/Breadcrumb'
// import CommonTable from '@/components/Coms/CommonTable'
// import Request from '@/common/request.js'
// export default {
//   data() {
//     return {
//       showList: false,
//       done: '',
//       noShow: '',
//       teacher: {},
//       semesterList: [],
//       semester: '',
//       teachLogOb: {
//         dataKey: 'list',
//         // idKey: 'lessonNo',
//         searchUrl: 'teach/log',
//         searchParam: { semester: 1, month: '' },
//         columns: [
//           {
//             prop: 'level',
//             label: '等级'
//           },
//           {
//             prop: 'title',
//             label: 'Title'
//           },
//           {
//             prop: 'time',
//             label: 'Time'
//           }
//         ]
//       },
//       teacherOb: {
//         dataKey: 'records',
//         idKey: 'userId',
//         pageSize: 3,
//         searchUrl: 'user/getLiveTeacher',
//         searchParam: { nickname: '', email: '', userId: '' },
//         columns: [
//           {
//             prop: 'nickname',
//             label: '姓名'
//           },
//           {
//             prop: 'level',
//             label: '等级'
//           },
//           {
//             prop: 'email',
//             label: '邮件'
//           },
//           {
//             prop: 'country',
//             label: '国家'
//           }
//         ]
//       }
//     }
//   },
//   components: {
//     Breadcrumb,
//     CommonTable
//   },
//   mounted() {
//     this.init()
//     this.getSemesterList()
//   },
//   watch: {
//     "teachLogOb.searchParam": {
//       handler: function (value) {
//         this.query()
//       },
//       deep: true
//     }
//   },
//   methods: {
//     init() {
//       //初始化时间
//       let time = new Date()
//       let year = time.getFullYear()
//       let month = time.getMonth()
//       this.teachLogOb.searchParam.month = year + '-' + month
//     },
//     getSemesterList() {
//       Request({
//         url: 'schedule/getOnSemester',
//         type: 'get'
//       }).then(res => {
//         this.semesterList = res.data
//       })
//     },
//     selectTeachLog(userId) {
//       this.$set(this.teachLogOb.searchParam, 'userId', userId)
//       this.showList = true
//     },
//     query() {
//       if (!this.teachLogOb.searchParam.userId ||
//         !this.teachLogOb.searchParam.semester ||
//         !this.teachLogOb.searchParam.month) {
//         return null;
//       }
//       Request({
//         url: this.teachLogOb.searchUrl,
//         type: 'post',
//         data: { ...this.teachLogOb.searchParam }
//       }).then(res => {
//         if (res.data) {
//           this.resultList = res.data[this.teachLogOb.dataKey]
//           this.done = res.data.showCount
//           this.noShow = res.data.noShowCount
//         }
//       })
//     }
//   }
// }
// </script>
