
<template>
  <div>
    <breadcrumb></breadcrumb>
    <div name="serchList">
      <el-form inline>
        <el-form-item label="请输入老师名称：">
          <el-input v-model="teacherOb.searchParam.userName"></el-input>
        </el-form-item>
        <el-form-item label="请输入老师邮箱：">
          <el-input v-model="teacherOb.searchParam.email"></el-input>
        </el-form-item>
        <el-form-item label="月份：" prop="">
          <el-date-picker type="month" v-model="teacherOb.searchParam.month" value-format="yyyy-MM" format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <common-table :dataObject="teacherOb">
        <el-table-column prop="" label="Active" :width="80">
          <template slot-scope="{row}">
            <el-button @click="selectTeachLog(row)">Detail</el-button>
          </template>
        </el-table-column>
      </common-table>
    </div>
    <!-- teachLog -->
    <el-dialog title="详情" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <div v-if="dialogVisible" name="teachLog">
        <el-form inline>
          <el-form-item label="教师：">
            <span>{{this.teacherName}}</span>
          </el-form-item>
          <el-form-item label="Done：">
            <span>{{this.totalDone}}</span>
          </el-form-item>
          <el-form-item label="NoShow：">
            <span>{{this.totalNoShow}}</span>
          </el-form-item>
          <el-form-item label="总时长：">
            <span>{{this.totalMinute}}</span>
          </el-form-item>
        </el-form>
        <!-- <el-row>
          <ul>
            <li v-for="(value,key) in levelMap" :key="key">{{key}}:{{value}}</li>
          </ul>
        </el-row> -->
      </div>
      <common-table :dataObject="teachLogOb">
        <el-table-column prop="isShow" label="Status" :width="80">
          <template slot-scope="{row}">
            <span v-if="row.isShow == 1" style="color: green">Done</span>
            <span v-if="row.isShow == 0" style="color: red">No Show</span>
          </template>
        </el-table-column>
      </common-table>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import CommonTable from '@/components/Coms/CommonTable'
import Request from '@/common/request.js'
import Util from '@/common/util.js'
export default {
  data() {
    return {
      dialogVisible: false,
      totalDone: '',
      totalNoShow: '',
      teacherName: {},
      teacher: {},
      teacherCourseCount: {},
      courseCount: {},
      semesterList: [],
      dynaColumns: [],
      totalMinute: '',
      semester: '',
      teacherOb: {
        dataKey: 'data',
        idKey: 'tchId',
        pageSize: 10,
        searchUrl: 'teach/count',
        searchParam: { userName: '', userId: '', month: '2019-03' },
        columns: [
          {
            prop: 'tchNickname',
            label: '姓名'
          },
          {
            prop: 'email',
            label: '邮箱'
          },
          {
            prop: 'totalMinute',
            label: '总时长（分钟）'
          },
          {
            prop: 'totalCount',
            label: 'TotalCount'
          },
          {
            prop: 'done',
            label: 'Done'
          },
          {
            prop: 'noShow',
            label: 'NoShow'
          }
        ]
      },
      teachLogOb: {
        dataKey: 'list',
        // idKey: 'lessonNo',
        noPage: true,
        searchUrl: 'teach/log',
        searchParam: { semester: '', month: '', userId: '' },
        columns: [
          {
            prop: 'level',
            label: '等级'
          },
          // {
          //   prop: 'semester',
          //   label: '时间线'
          // },
          {
            prop: 'title',
            label: 'Title'
          },
          {
            prop: 'time',
            label: '开始时间'
          },
          {
            prop: 'endTime',
            label: '结束时间'
          },
          {
            prop: 'minute',
            label: '时长(分钟)'
          }
        ]
      }
    }
  },
  components: {
    Breadcrumb,
    CommonTable,
    Util
  },
  mounted() {
    // this.getSemesterList()
    this.init()
  },
  methods: {
    init() {
      //初始化时间
      let time = new Date()
      let today = Util.formatDate(time, "yyyy-MM")
      this.teacherOb.searchParam.month = today
    },
    // 动态表头
    getSemesterList() {
      Request({
        url: 'schedule/getOnSemester',
        type: 'get'
      }).then(res => {
        this.semesterList = res.data
        // 动态表头
        this.dynaColumn()
      })
    },
    dynaColumn() {
      // 动态表头
      this.dynaColumns = this.teacherOb.columns
      // 增加等级总数量
      let levelCount = {
        prop: 'courseCount',
        label: '总有效课时量'
      }
      this.dynaColumns.splice(2, 0, levelCount)
      for (let index = this.semesterList.length - 0; index > 0; index--) {
        const element = this.semesterList[index];
        // let propPre =
        let column = {
          prop: 'semesterCount.' + element.title,
          label: element.title
        }
        this.dynaColumns.splice(3, 0, column)
      }
    },
    selectTeachLog(row) {
      this.teachLogOb.searchParam.month = this.teacherOb.searchParam.month
      this.teachLogOb.searchParam.userId = row.tchId
      this.teachLogOb.searchParam.semester = 2
      this.totalDone = row.done
      this.totalNoShow = row.noShow
      this.teacherName = row.tchNickname
      this.totalMinute = row.totalMinute
      // this.$set(this.teachLogOb.searchParam, 'userId', userId)
      // this.$set(this.teachLogOb.searchParam, 'month', this.teacherOb.searchParam.month)
      this.dialogVisible = true
      // this.query()
    }
    /* 统计题目数量 */
    // getTeacherCourseCount() {
    //   Request({
    //     url:'teacher/course/count'
    //     data: {}
    //   })
    // }
  }
}
</script>
