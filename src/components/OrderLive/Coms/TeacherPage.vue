<template>
  <div class="grid">
    <el-form label-position="right" :inline="true" label-width="60px">
      <el-form-item label="用户类型" v-if="userType==null">
        <el-input v-model="requestQuery.userType" placeholder="输入用户类型 1为学生,2为老师"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="requestQuery.nickname" placeholder="输入老师名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="requestQuery.email" placeholder="输入邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitFilter" style="" icon="el-icon-search">查询</el-button>
        <span v-if="userType === 2">
          <el-button type="primary" @click="makeTeacher" style="">确定</el-button>
        </span>
        <span v-else-if="userType === 1">
          <el-button type="success" @click="makeStudent" style="">确定</el-button>
        </span>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="resultList" style="width: 100%" border highlight-current-row @current-change="handleCurrentChange">
      <!-- <smart-grid :selectable="true" :data="resultList" :multiple="multiple" :loading="loading" @select="handleCheck"  @pagination-change="query" @reload="query"> -->
      <el-table-column :prop="column.prop" :label="column.label" v-for="(column,index) in columns" :key="index">
      </el-table-column>
      <el-table-column prop="头像" label="头像">
        <template slot-scope="{row}">
          <img :class="(selectIndex==index && row.userId==userId)?'select':''" :src="img" @click="selectImg(index,img)" v-for="(img ,index) in row.coverImgUrl" :key="index" style="margin-right:10px;width:50px;" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page-box">
      <el-pagination 
        @current-change="handlePageChange" 
        layout="total, prev, pager, next, jumper" 
        :page-size="page.size" 
        :total="page.total" 
        :current-page="page.page">
      </el-pagination>
    </div>
    <show-dialog :prop="dialog"></show-dialog>
  </div>

</template>
<script>
import showDialog from './showDialog'
import Request from '@/common/request.js'
export default {
  props: {
    userType: {
      require: true,
      type: Number
    },
    multiple: {
      require: true,
      type: Boolean
    }
  },
  data() {
    return {
      selectIndex: 0,
      userId: '',
      loading: false,
      resultList: [],
      updateTable: false,
      requestQuery: {},
      description: '',
      chooseTeacherOne: {},
      chooseStudent: [],
      chooseStudentId: [],
      dialog: {
        visible: false,
        msg: 'test',
        fn: {},
        modal: false
      },
      page: {
        size: 4,
        current: 1
      },
      columns: [
        {
          prop: 'nickname',
          label: '名称'
        },
        {
          prop: 'email',
          label: '邮箱'
        }
      ]
    }
  },
  created() {
    this.query()
  },
  methods: {
    handlePageChange(val) {
      this.page.current = val
      this.query()
    },
    selectImg(index, img) {
      this.selectIndex = index
      if (img) {
        this.chooseTeacherOne.cover = img
      }
    },
    onSubmitFilter() {
      this.page.current = 1;
      this.query();
    },
    async query() {
      this.loading = true
      let that = this
      if (this.userType !== undefined) {
        this.requestQuery.userType = this.userType
      }
      try {
        await Request({
          url: '/user/getAppointmentLiveTeacher',
          data: { ...that.page, ...that.requestQuery },
          type: 'post'
        }).then(res => {
          that.resultList = res.data.records
          that.page.total = res.data.total
          that.page.current = res.data.current
        })
      } finally {
        this.loading = false
      }
    },
    handleCurrentChange(row) {
      this.selectIndex = 0
      this.userId = row.userId
      this.chooseTeacherOne = row
      // console.log("这是row")
      // console.log(row)
      this.chooseTeacherOne.cover = row.coverImgUrl[0]
    },
    makeTeacher() {
      this.$emit('emit-teacher', this.chooseTeacherOne)
    },
    async handleCheck(rowData, checked) {
      if (this.userType === 2) {
        if (checked === true) {
          this.chooseTeacherOne = {}
          // 判断老师是否被录用
          /* 暂时不做了 */
          let teacher = await getTeacherById({ userId: rowData.userId })
          let that = this;
          // console.log(teacher)
          if (teacher.data.employment !== 1) {
            this.dialog.msg = '该老师未被录用，请问是否继续'
            this.dialog.fn = () => {
              that.chooseTeacherOne.nickname = rowData.nickname
              that.chooseTeacherOne.userId = rowData.userId
              that.dialog.visible = false
            }
            this.dialog.visible = true
          } else {
            this.chooseTeacherOne.nickname = rowData.nickname
            this.chooseTeacherOne.userId = rowData.userId
          }
        }
      } else {
        let user = {}
        user.stuId = rowData.userId
        user.stuNickname = rowData.nickname
        const index = this.chooseStudentId.indexOf(rowData.id)
        if (checked && index === -1) {
          this.chooseStudent.push(user)
          this.chooseStudentId.push(rowData.id)
        } else if (!checked && index !== -1) {
          this.chooseStudent.splice(index, 1)
          this.chooseStudentId.splice(index, 1)
        }
      }
    },
    makeStudent() {
      if (this.chooseStudent.length > 4) {
        this.$message({
          type: 'error',
          showClose: true,
          message: '最多只能选择四个学生!'
        })
      } else {
        this.$emit('emit-student', this.chooseStudent)
      }
    }
  },
  components: {
    showDialog
  }
}
</script>

<style lang="less" scoped>
.select {
  border: 2px salmon solid;
}
</style>
