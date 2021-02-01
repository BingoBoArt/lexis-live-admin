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
          <el-date-picker v-model="orderObject.searchParam.day" type="date" placeholder="选择日期" :default-value="today" value-format="yyyy-MM-dd"></el-date-picker>
        </LessonFilter>
      </div>
      <div class="content-list main form-table-box">
        <CommonTable :dataObject="orderObject" :showAction="true" @change-page="updatePage">
         
        </CommonTable>
      </div>
      
    </div>
  </div>
</template>

<script>
import SchoolSemester from '@/components/Coms/SchoolSemester'
import Breadcrumb from '@/components/Common/Breadcrumb'
import LessonFilter from '@/components/Coms/LessonFilter'
// import CommonTable from '@/components/Coms/CommonTable'
import CommonTable from './NewVideo'
import Request from '@/common/request.js'
import Util from '@/common/util.js'
import Video from '@/components/Coms/Video'
export default {
  data() {
    return {
      page: 1,
      firstRow: "",
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '' },
      semesterList: [],
      orderDetail: [],
      detailDialog: false,
      // semester: '',
      orderObject: {
        dataKey: 'data',
        idKey: 'liveId',
        searchUrl: 'orderlive/interactiveOrderList',
        // editUrl: '/dashboard/Orderlive/Add', //编辑页面名称
        searchParam: { day: "", level: '', lessonType: '', unitId: '', lessonNo: '', semester: '', status: 0 },
        columns: [
          {
            prop: 'liveId',
            label: 'ID',
            // width: 60
          },
          // {
          //   prop: 'blockNo',
          //   label: 'blockNo'
          // },
          // {
          //   prop: 'blockNoName',
          //   label: 'blockName'
          // },
          {
            prop: 'startTime',
            label: 'startTime'
          },
          {
            prop: 'tchNickname',
            label: '教师名字'
          },
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
    Util,
    Video
  },
  created() {
    // this.getSemesterList()
    this.init()
  },
  methods: {
    showVideo(row){
      this.$confirm("你丫的想👀视频吗？")
      .then(() => {
        Request({
            url: 'orderlive/interactiveOrderList',
            data: { liveId: row.liveId },
            // data: { rows: 10 }
            type: 'post'
          }).then(res => {
						console.log("TCL: showVideo -> res", res)
            if (res.code == 0) {
              this.$message.success("撤回成功")
            } else {
              this.$message.error('撤回失败')
            }
            this.query()
          })
      })
      .catch(() => {
        console.log("不想看啦？")
      })
    },

    selectVideo(row) {
      this.$confirm("你丫的是要选择这个视频吗？")
      console.log(row)
    },


    init() {
      // 设置时间
      let date = new Date()
      let today2 = Util.formatDate(date)
      this.orderObject.searchParam.day = today2
    },
    query() {
      this.orderObject.searchParam = { ...this.orderObject.searchParam }
    },
    // getSemesterList() {
    //   Request({
    //     url: 'schedule/getOnSemester',
    //     type: 'get'
    //   }).then(res => {
		// 		console.log("TCL: getSemesterList -> res", res)
    //     this.semesterList = res.data
    //   })
    // },
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
    // revokeOrder(row) {
    //   this.$confirm('确定取消预约吗？')
    //     .then(_ => {
    //       Request({
    //         url: 'orderlive/revokeOrder',
    //         data: { liveId: row.liveId },
    //         type: 'post'
    //       }).then(res => {
    //         if (res.code == 0) {
    //           this.$message.success("撤回成功")
    //         } else {
    //           this.$message.error('撤回失败')
    //         }
    //         this.query()
    //       })
    //     })
    //     .catch(_ => { });
    // },
    // revokeOrderSingle(row) {
    //   this.$confirm('是要查看视频吗？')
    //     .then(_ => {
    //       Request({
    //         url: 'orderlive/revoke/single',
    //         data: { liveId: row.liveId, recordId: row.recordId },
    //         type: 'post'
    //       }).then(res => {
    //         if (res.code == 0) {
    //           this.$message.success("撤回成功")
    //           this.orderObject.searchParam = { ...this.orderObject.searchParam }
    //         } else {
    //           this.$message.error(res.msg)
    //         }
    //         this.query()
    //       })
    //     })
    //     .catch(_ => { });
    // },
    // tableRowClassName({ row, rowIndex }) {
    //   if (row.status === 3) {
    //     if (row.onLiveLayout === 2) {
    //       return 'reback-row success-row'
    //     } else {
    //       return 'reback-row'
    //     }
    //   } else if (row.onLiveLayout === 2) {
    //     return 'success-row';
    //   }
    //   return '';
    // }
  }
}
</script>
<style>
.videoo {
  height:200px;
  width:300px
}
.el-table .success-row {
  background: oldlace;
}
.el-table .reback-row {
  /* background:  */
  text-decoration: line-through;
}
</style>