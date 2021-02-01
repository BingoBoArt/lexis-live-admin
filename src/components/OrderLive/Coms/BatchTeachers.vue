<template>
  <div class="grid">
    <el-form label-position="right" :inline="true" label-width="60px">
      <el-form-item label="名称">
        <el-input v-model="requestQuery.nickname" placeholder="输入老师名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="requestQuery.email" placeholder="输入邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitFilter" style="" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="choice()" style="">确定</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="resultList" style="width: 100%" border highlight-current-row @selection-change="handleSelect" >
      <el-table-column type="selection" width="55"></el-table-column>
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
      <el-pagination  @current-change="handlePageChange"  layout="total, prev, pager, next, jumper"  :page-size="page.size"  :total="page.total"  :current-page="page.page">
      </el-pagination>
    </div>
  </div>

</template>
<script>
import Request from '@/common/request.js'
export default {
  props: {
    teacherLists: {
      require: true,
      type: []
    }
  },
  data() {
    return {
      allteachers: [],
      selectIndex: 0,
      userId: '',
      loading: false,
      resultList: [],
      requestQuery: {},
      chooseTeacherOne: {},
      page: {
        size: 6,
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
  methods: {
    handleSelect(row) {
        this.allteachers = row
    },
    //返回选中的老师的信息
    choice() {
      this.$emit('emit-teacher', this.allteachers)
      this.allteachers = []
    },
    onSubmitFilter() {
      this.page.current = 1;
      this.query();
    },//查询老师
    async query() {
      this.loading = true
      let that = this
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
    selectImg(index, img) {
      this.selectIndex = index
      if (img) {
        this.chooseTeacherOne.cover = img
      }
    },//选择图片
    handlePageChange(val) {
      this.page.current = val
      this.query()
    },//分页查询老师
  },
  created() {
    this.query()
  },
}
</script>

<style lang="less" scoped>
.select {
  border: 2px salmon solid;
}
</style>
