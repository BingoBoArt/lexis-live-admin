
<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="content-main">
      <div class="filter-box clearfix">
        <el-form inline>
          <el-form-item>
            <SchoolSemester @school-select="item=>this.$set(orderObject.searchParam, 'schoolId', item)" @semester-select="item2=>this.$set(orderObject.searchParam, 'semester', item2)"></SchoolSemester>
          </el-form-item>
        </el-form>
        <LessonFilter v-model="orderObject.searchParam" :needKeyword="false" :releaseLesson="true" :title="''">
          <!-- <el-select v-model="orderObject.searchParam.semester" clearable placeholder="请选择时间线">
            <el-option v-for="item in semesterList" :key="item.scheduleId" :label="item.title" :value="item.scheduleId">
            </el-option>
          </el-select> -->
          <el-date-picker v-model="orderObject.searchParam.day" type="date" placeholder="选择日期" :default-value="today" value-format="yyyy-MM-dd"></el-date-picker>
          
          <!-- 选择课堂布局 -->
          <el-select v-model="orderObject.searchParam.onLiveLayout" clearable placeholder="请选择课堂布局">
            <el-option v-for="(item,index) in onLiveLayouts" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!--  选择交互录播课 -->
          <el-select v-model="orderObject.searchParam.mold" clearable placeholder="请选择课堂类型名称">
            <el-option v-for="(item,index) in molds" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!--  -->
          <el-select v-model="orderObject.searchParam.status" clearable placeholder="请选择状态">
            <el-option v-for="(item,index) in statuz" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button> -->
          <span style="float:right;color:red;size:12px;font-size:12px;line-height:5;">温馨提示： 请在课程开始前5分钟以上进行“取消预约”操作。</span>
        </LessonFilter>
      </div>
      <div class="content-list main form-table-box">
        <CommonTable :dataObject="orderObject" @change-page="updatePage">

          <el-table-column label="课件类型名称" width="100px" align="center">
            <template slot-scope="{row}">
              <span v-if="row.mold == 2" style="color: #070c02">正课</span>
              <span v-if="row.mold == 4" style="color: #f111b6">交互录播课</span>
            </template>
          </el-table-column>

          <el-table-column label="课堂布局" width="100px" align="center">
            <template slot-scope="{row}">
              <span v-if="row.onLiveLayout == 1" style="color: #070c02">正课</span>
              <span v-if="row.onLiveLayout == 2" style="color: #f111b6">语感课</span>
            </template>
          </el-table-column>
          <el-table-column label="课程状态" width="100px" align="center">
            <template slot-scope="{row}">
              <span v-if="row.status == 1" style="color: #070c02">等待上课</span>
              <span v-if="row.status == 2" style="color: #7de40c">授课完成</span>
              <span v-if="row.status == 3" style="color: #f111b6">已取消约课</span>
            </template>
          </el-table-column>
          <el-table-column label="班级状态" width="100px" align="center">
            <template slot-scope="{row}">
              <span v-if="row.liveSemesterStatus == 1" style="color: #070c02">正常</span>
              <span v-if="row.liveSemesterStatus == 3" style="color: #f111b6">已取消约课</span>
            </template>
          </el-table-column>
          <el-table-column label="revoke" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.liveSemesterStatus !=  3" type="primary" size="mini" icon="el-icon-refresh" @click="revokeOrderSingle(scope.row)">取消预约</el-button>
              <el-button v-else type="warning" size="mini" disabled icon="el-icon-close">无法取消</el-button>
            </template>
          </el-table-column>
        </CommonTable>
      </div>
      <!-- 弹出框形式 -->
      <!-- <el-dialog title="约课详细信息" :visible.sync="detailDialog" width="30%" :before-close="handleClose">
        <CommonTable ref="myTable" :dataObject="orderDetailObject" @change-page="updatePage">
          <el-table-column label="revoke" width="120px" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status != 3 && scope.row.status != 2" type="primary" size="mini" icon="el-icon-refresh" @click="revokeOrderSingle(scope.row)">取消预约</el-button>
            </template>
          </el-table-column>
        </CommonTable>
        <span slot="footer" class="dialog-footer">
          <el-button @click="detailDialog = false">取 消</el-button>
        </span>
      </el-dialog> -->
    </div>
  </div>
</template>

<script>
import SchoolSemester from '@/components/Coms/SchoolSemester'
import Breadcrumb from '@/components/Common/Breadcrumb'
import LessonFilter from '@/components/Coms/LessonFilter'
import CommonTable from '@/components/Coms/CommonTable'
import Request from '@/common/request.js'
import Util from '@/common/util.js'
export default {
  data() {
    return {
      page: 1,
      firstRow: "",
      molds: [{ label: '正课', value: 2}, { label: '交互录播课', value: 4}],
      onLiveLayouts: [{ label: '正课', value: 1 }, { label: '语感课', value: 2 }],
      statuz: [{ label: '全部状态', value: '' }, { label: '等待上课或已完成', value: 0 }, { label: '等待上课', value: 1 }, { label: '授课完成', value: 2 }, { label: '已取消约课', value: 3 }],
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '' },
      semesterList: [],
      orderDetail: [],
      detailDialog: false,
      // semester: '',
      orderObject: {
        dataKey: 'data',
        idKey: 'liveId',
        searchUrl: 'orderlive/orderList',
        // editUrl: '/dashboard/Orderlive/Add', //编辑页面名称
        searchParam: { day: "", level: '', lessonType: '', unitId: '', lessonNo: '', semester: '', status: 0 },
        tableRowClassName: this.tableRowClassName,
        expandChange: this.getOrderDetail,
        columns: [
          {
            prop: 'liveId',
            label: 'ID',
            width: 60
          },
          {
            prop: 'lessonNoName',
            label: '课件编号',
            width: 120
          },
          {
            prop: 'lessonTitleEn',
            label: '课件英文名称'
          },
          {
            prop: 'tchNickname',
            label: '教师名称',
            width: 140
          },
          {
            prop: 'lessonTypeCh',
            label: '课程类型',
            width: 80
          },
          {
            prop: 'unitNameCh',
            label: '单元',
            width: 100
          },
          {
            prop: 'lessonVersion',
            label: '版本',
            width: 60
          },
          {
            prop: 'startTime',
            label: '开始时间',
            width: 160
          },
          {
            prop: 'endTime',
            label: '结束时间',
            width: 160
          },
          {
            prop: 'schoolName',
            label: '学校名称'
          },
          {
            prop: 'semesterName',
            label: '时间线（班级）',
            width: 160
          }
        ]
      },
      orderDetailObject: {
        noPage: true,
        dataKey: '',
        idKey: 'recordId',
        searchUrl: 'orderlive/detail/list',
        searchParam: { liveId: '' },
        columns: [
          {
            prop: 'recordId',
            label: '资源ID',
            width: 120
          },
          {
            prop: 'schoolName',
            label: '学校名称',
            width: 120
          },
          {
            prop: 'semesterName',
            label: '时间线'
          }
        ]
      }
    }
  },
  components: {
    LessonFilter,
    CommonTable,
    Breadcrumb,
    SchoolSemester,
    Util
  },
  created() {
    this.getSemesterList()
    this.init()
  },
  methods: {
    init() {
      // 设置时间
      let date = new Date()
      let today2 = Util.formatDate(date)
      this.orderObject.searchParam.day = today2
    },
    query() {
      this.orderObject.searchParam = { ...this.orderObject.searchParam }
    },
    getSemesterList() {
      Request({
        url: 'schedule/getOnSemester',
        type: 'get'
      }).then(res => {
        this.semesterList = res.data
      })
    },
    getOrderDetail(row) {
      this.orderDetailObject.searchParam.liveId = row.liveId
    },
    updateSelect(val) {
      this.query()
    },
    updatePage(page) {
      console.log("listpage" + page)
      this.page = page
    },
    revokeOrder(row) {
      this.$confirm('确定取消预约吗？')
        .then(_ => {
          Request({
            url: 'orderlive/revokeOrder',
            data: { liveId: row.liveId },
            type: 'post'
          }).then(res => {
            if (res.code == 0) {
              this.$message.success("撤回成功")
            } else {
              this.$message.error('撤回失败')
            }
            this.query()
          })
        })
        .catch(_ => { });
    },
    revokeOrderSingle(row) {
      this.$confirm('确定取消班级预约吗？')
        .then(_ => {
          Request({
            url: 'orderlive/revoke/single',
            data: { liveId: row.liveId, recordId: row.recordId },
            type: 'post'
          }).then(res => {
            if (res.code == 0) {
              this.$message.success("撤回成功")
              this.orderObject.searchParam = { ...this.orderObject.searchParam }
            } else {
              this.$message.error(res.msg)
            }
            this.query()
          })
        })
        .catch(_ => { });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 3) {
        if (row.onLiveLayout === 2) {
          return 'reback-row success-row'
        } else {
          return 'reback-row'
        }
      } else if (row.onLiveLayout === 2) {
        return 'success-row';
      }
      return '';
    }
  }
}
</script>
<style>
.el-table .success-row {
  background: oldlace;
}
.el-table .reback-row {
  /* background:  */
  text-decoration: line-through;
}
</style>
