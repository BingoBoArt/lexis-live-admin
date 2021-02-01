<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 一级列表 -->
    <el-form inline>
      <el-form-item prop="semester">
        <SchoolSemester @school-select="item=>this.$set(liveInfo,'schoolId',item)" @semester-select="item2=>this.$set(liveInfo,'semester',item2)"></SchoolSemester>
      </el-form-item>
    </el-form>
    <el-row>
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
      <el-button @click="isPushLive" class="back top-btn">上传</el-button>
    </el-row>
    <el-row class="my-row">
      <div class="live-card-list">
        <live-card v-for="(liveCard ,index) in liveInfoList" :key="index" :liveCard="liveCard" :recordId="liveInfo.recordId" :compTitle="liveInfo.compTitle" @recordId-value="selectLiveId"></live-card>
      </div>
    </el-row>
    <el-row>
      <div class="page-box">
        <el-pagination @current-change="handlePageChange" layout="total, prev, pager, next, jumper" :page-size="page.rows" :total="page.total" :current-page="page.page" background>
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>
<script>
import SchoolSemester from '@/components/Coms/SchoolSemester'
import Breadcrumb from '@/components/Common/Breadcrumb'
import CommonTable from '@/components/Coms/CommonTable'
import LiveCard from '@/components/Coms/LiveCard'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      url: '',
      fatherPage: '',
      page: { page: 1, rows: 6 },
      compTitle: '',
      liveInfoList: [],
      liveInfo: { tableId: '', recordId: '' }
    }
  },
  created() {
    // this.liveInfo.tableId = this.$route.query.tableId || null;
    // this.liveInfo.recordId = this.$route.query.recordId || null;
    // this.liveInfo.compTitle = this.$route.query.compTitle || null;
    // this.liveInfo.semester = this.$route.query.semester || null;
    this.liveInfo = this.$route.params || null
    this.liveInfo.fatherPage = this.$route.params.page || null;
    this.query()
  },
  watch: {
    liveInfo: {
      handler: function(value){
        this.query()
      },
      deep: true
    }
  },
  methods: {
    goBack() {
      // let url = '/dashboard/Record/Table'
      let name = 'Table'
      this.$router.push({ name: name, params: this.liveInfo })
    },
    watchLive(url) {
      if (!url) {
        this.$message({
          type: 'error',
          message: '视频资源为空',
          showClose: true
        })
      } else {
        window.open(url)
      }
    },
    isPushLive(row) {
      this.$confirm('确定推荐该视频吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pushLive()
      })
    },
    /* xiugai  */
    pushLive() {
      Request({
        url: 'live/pushRecord',
        type: 'post',
        data: { recordId: this.liveInfo.recordId, tableId: this.liveInfo.tableId }
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '推荐成功!'
          });
          this.query()
        }
      })
    },
    selectLiveId(val) {
      this.liveInfo.recordId = val.recordId
    },
    /* 查询 */
    handlePageChange(val) {
      this.page.page = val
      this.query()
    },
    query() {
      let that = this
      Request({
        url: 'live/getLiveByTable',
        type: 'post',
        data: { ...this.liveInfo, ...this.page }
      }).then(res => {
        console.log("返回的数据", res)
        this.liveInfoList = res.data.liveInfoList
        that.page.total = res.data.totalResultSize || res.data.total
        that.page.count = res.data.totalPage
      })
      console.log("query")
    }
  },
  filters: {
    getIsRecord: function (val) {
      if (val === 1) {
        return "已处理"
      } else if (val === 2) {
        return "录制失败"
      } else {
        return "未处理"
      }
    }
  },
  components: {
    Breadcrumb,
    CommonTable,
    SchoolSemester,
    LiveCard
  }
}
</script>
<style scoped>
.my-row {
  display: list-item;
}
</style>

