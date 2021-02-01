<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 查询条件 -->
    <el-form inline>
      <!-- <el-form-item label="请选择时间线：">
        <el-select v-model="schedulTable.searchParam.semester" clearable placeholder="请选择时间线">
          <el-option v-for="item in semesterList" :key="item.scheduleId" :label="item.title" :value="item.scheduleId">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="课件编号:">
        <el-input v-model="schedulTable.searchParam.lessonNoName" placeholder="请输入课件编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-date-picker type="date" v-model="schedulTable.searchParam.startTimeVo" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
    </el-form>

    <!-- 一级列表 -->
    <div class="content-list main form-table-box">
      <CommonTable :dataObject="schedulTable" @page-change="page => current = page">
        <!-- 是否已经上课 -->
        <!-- <el-table-column prop="" label="上课状态" :width="80">
          <template slot-scope="{row}">
            {{row.status | getStatus}}
          </template>
        </el-table-column> -->
        <!-- 是否已经上传 -->
        <el-table-column prop="" label="视频状态" :width="80">
          <template slot-scope="{row}">
            {{row.isRecord | getIsRecord}}
          </template>
        </el-table-column>
        <!-- 查看录播 -->
        <el-table-column prop="" label="Action" :width="130">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDateTow(scope.row)">查看录播</el-button>
          </template>
        </el-table-column>
      </CommonTable>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import CommonTable from '@/components/Coms/CommonTable'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      record: { semester: '' },
      semesterList: [],
      current: '',
      schedulTable: {
        index: true,
        dataKey: 'scheduleTableList',
        idKey: 'tableId',
        searchUrl: 'schedule/getScheduleByItem',
        // editUrl: '/dashboard/Orderlive/Add', //编辑页面名称
        searchParam: {},
        columns: [
          // {
          //   prop: 'semester',
          //   label: '学期',
          //   width: 40
          // },
          {
            prop: 'lessonNo',
            label: '课件ID',
            width: 60
          },
          {
            prop: 'lessonNoName',
            label: '课件编号',
            width: 80
          },
          {
            prop: 'compTitle',
            label: 'level-unit-block 课件英文名'
          },
          // {
          //   prop: 'lessonVersion',
          //   label: '版本',
          //   width: 40
          // },
          {
            prop: 'startTime',
            label: '开始日期',
            width: 160
          }
        ]
      }
    }
  },
  created() {
    this.getSemesterList()
    this.record = this.$route.params.record ? this.$route.params.record : this.record
    this.$set(this.schedulTable, "searchParam", this.record)
  },
  methods: {
    editDateTow(row) {
      this.$router.push({
        name: "Live",
        params: {
          // [this.schedulTable.idKey]: row[this.schedulTable.idKey],
          tableId: row.tableId,
          recordId: row.recordId,
          compTitle: row.compTitle,
          semester: row.semester,
          lessonNo: row.lessonNo,
          record: this.schedulTable.searchParam,
          page: this.current
        }
      })
    },
    getSemesterList() {
      Request({
        url: 'schedule/getOnSemester',
        type: 'get'
      }).then(res => {
        this.semesterList = res.data
      })
    }
  },
  filters: {
    getIsRecord: function (val) {
      if (val === 1) {
        return "已上传"
      } else {
        return "未上传"
      }
    },
    getStatus: function (val) {
      if (val === 2) {
        return "进行中"
      } else if (val === 3) {
        return "已完结"
      } else if (val === 4) {
        return "已下架(取消约课)"
      } else {
        return "等待开始"
      }
    }
  },
  components: {
    Breadcrumb,
    CommonTable
  }
}
</script>
