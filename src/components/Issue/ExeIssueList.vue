<template>
  <div>
    <!-- 查询 -->
    <div>
      <el-form inline>
        <el-form-item label="卷名：">
          <el-input v-model="issueOb.searchParam.groupName" placeholder="请输入卷名"></el-input>
        </el-form-item>
        <el-form-item label="时间线">
          <el-select v-model="issueOb.searchParam.semester" clearable placeholder="请选择时间线">
            <el-option v-for="(item,index) in semesterList" :key="index" :label="item.title" :value="item.scheduleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="issueOb.searchParam.status" clearable placeholder="请选择状态">
            <el-option label="已上架" value="1">
            </el-option>
            <el-option label="未上架" value="3">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止日期：">
          <el-date-picker type="date" v-model="issueOb.searchParam.startTime" value-format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker>
          <el-date-picker type="date" v-model="issueOb.searchParam.endTime" value-format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <common-table :dataObject="issueOb">
      <el-table-column label="状态" width="270px">
        <template slot-scope="{row}">
          <span>{{row.status == 1?'已上架':'未上架'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑" width="270px">
        <template slot-scope="{row}">
          <el-button @click="editIssue(row.issueId)" size="mini" type="success">编辑</el-button>
          <el-button @click="publishIssue(row.issueId,1)" size="mini" type="success" v-if="row.status == 3">上架</el-button>
          <el-button @click="publishIssue(row.issueId,3)" size="mini" type="warning" v-else>下架</el-button>
        </template>
      </el-table-column>
    </common-table>
  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      semesterList: [],
      issueOb: {
        dataKey: 'records', // data对应的key
        idKey: 'issueId', // id对应的key
        searchUrl: '/exe/issue/list', // 查询接口地址
        pageSize: 10,
        searchParam: {}, // 查询参数
        columns: [ // 表格显示字段
          {
            prop: 'issueId',
            width: '60',
            label: 'ID'
          },
          {
            prop: 'groupName',
            width: '100',
            label: '卷名'
          },
          {
            prop: 'semester',
            label: '时间线',
            width: '80'
          },
          {
            prop: 'startTime',
            label: '开始时间',
            width: '160'
          },
          {
            prop: 'endTime',
            label: '结束时间',
            width: '160'
          },
          {
            prop: 'issueName',
            label: '期名'
          }
        ]
      }
    }
  },
  components: { CommonTable, Breadcrumb, Request },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getSemesterList()
    },
    /* 跳转编辑 */
    editIssue(id) {
      this.$router.push({ path: '/dashboard/Issue/Publish', query: { issueId: id } })
    },
    publishIssue(id, status) {
      let str = ''
      if (status == 1) {
        str = '上架'
      } else {
        str = '下架'
      }
      this.$confirm('确认' + str + '吗').then(res => {
        Request({
          url: 'exe/issue/shelf',
          type: 'post',
          data: { id: id, status: status }
        }).then(res => {
          if (res.code == 0) {
            this.$message.success("修改成功")
            this.query()
          }
        })
      })
    },
    /* 获取时间线 */
    getSemesterList() {
      Request({
        url: 'schedule/getOnSemester',
        type: 'get'
      }).then(res => {
        this.semesterList = res.data
      })
    },
    query() {
      this.issueOb.searchParam = { ...this.issueOb.searchParam }
    }
  }
}
</script>

<style>
</style>
