<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
      <el-row style="margin-bottom: 10px" v-if="this.$route.query.issueId || this.$route.query.show">
        <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back btn">返回</el-button>
      </el-row>
    </div>
    <el-form label-width="120px" label-position="right" ref="issueForm" :rules="rules" :model="issue">
      <el-form-item label="时间线：" prop="semester" >
        <el-select v-model="issue.semester" :disabled="this.$route.query.issueId">
          <el-option v-for="(item,index) in semesterList" :key="index" :label="item.title" :value="item.scheduleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择试题组：" prop="groupId">
        <el-select v-model="issue.groupId" :disabled="editGroupId" clearable>
          <el-option v-for="(item,index) in groupList" :key="index" :label="item.groupName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="期名：" prop="issueName">
        <el-input v-model="issue.issueName" placeholder="请输入期名：">
        </el-input>
      </el-form-item>
      <el-form-item label="起止日期：" prop="startTime">
        <el-date-picker type="date" v-model="issue.startTime" value-format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker>
        <el-date-picker type="date" v-model="issue.endTime" value-format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="editIssue()" v-if="this.$route.query.issueId">修改</el-button>
        <el-button @click="publish()" v-else>上架</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Request from '@/common/request.js'
export default {
  data() {
    return {
      semesterList: [],
      editGroupId: '',
      groupList: [],
      issue: { groupId: '', issueId: '', endTime: '' },
      rules: {
        "semester": [{ required: true, message: '时间线不能为空', trigger: 'blur' }],
        "issueName": [{ required: true, message: '卷名不能为空', trigger: 'blur' }],
        "startTime": [{ required: true, message: '开始时间不能为空', trigger: 'blur' }]
      }
    }
  },
  components: {
    Request
  },
  mounted() {
    this.init()
  },
  watch: {
    'issue.startTime': {
      handler: function (value) {
        if (this.issue.startTime) {
          const date = new Date(this.issue.startTime);
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 6);
          this.issue.endTime = date
        } else {
          this.issue.endTime = ''
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.getGroupList()
      this.checkGroup()
      this.getSemesterList()
      this.issueInfo()
    },
    /* 返回上一级 */
    goBack() {
      this.$router.go(-1)
    },
    checkGroup() {
      this.editGroupId = this.$route.query.groupId
      if (this.editGroupId) {
        this.issue.groupId = this.editGroupId
      }
    },
    getSemesterList() {
      Request({
        url: 'schedule/getOnSemester',
        type: 'get'
      }).then(res => {
        this.semesterList = res.data
      })
    },
    getGroupList() {
      let url = "exe/question/group/all"
      Request({
        url: url,
        type: "post"
      }).then(res => {
        if (res.code == 0) {
          this.groupList = res.data
        } else {
          this.$message.error("获取试题组出错")
        }
      })
    },
    issueInfo() {
      let issueId = this.$route.query.issueId
      if (issueId) {
        this.getIssueInfo(issueId)
      }
    },
    /* 获取issue */
    getIssueInfo(issueId) {
      Request({
        url: 'exe/issue/info',
        type: 'post',
        data: { issueId: issueId }
      }).then(res => {
        if (res.code == 0) {
          this.issue = res.data
        } else {
          this.$message.error("数据获取错误")
        }
      })
    },
    /* 发布 */
    publish() {
      this.$refs['issueForm'].validate((valid) => {
        if (valid) {
          Request({
            url: 'exe/issue/add',
            type: 'post',
            data: this.issue
          }).then(res => {
            if (res.code == 0) {
              this.$message.success("发布成功")
              // this.goBack()
              this.$router.push({ path: "/dashboard/Issue/ExeIssueList" })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error("校验未通过")
        }
      })
    },
    /* 修改 */
    editIssue() {
      this.$refs['issueForm'].validate((valid) => {
        if (valid) {
          Request({
            url: 'exe/issue/update',
            type: 'post',
            data: this.issue
          }).then(res => {
            if (res.code == 0) {
              this.$message.success("修改成功")
            } else {
              this.$message.error("修改失败")
            }
          })
        } else {
          this.$message.error("校验未通过")
        }
      })
    }
  }
}
</script>
