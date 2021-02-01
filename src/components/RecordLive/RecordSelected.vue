<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="content-main">
      <div class="filter-box clearfix">
        <el-form inline>
         
        </el-form>
        <LessonFilter v-model="orderObject.searchParam" :needKeyword="false" :releaseLesson="true" :title="''">
        </LessonFilter>
      </div>
      <div class="content-list main form-table-box">
        <CommonTable :dataObject="orderObject" :showAction="false" @change-page="updatePage">

          
          
        </CommonTable>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolSemester from '@/components/Coms/SchoolSemester'
import Breadcrumb from '@/components/Common/Breadcrumb'
import LessonFilter from '@/components/Coms/LessonFilter'
import CommonTable from './NewVideo'
import Request from '@/common/request.js'
import Util from '@/common/util.js'
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
        searchUrl: 'orderlive/interactiveListPass',
        // editUrl: '/dashboard/Orderlive/Add', //编辑页面名称
        searchParam: { day: "", level: '', lessonType: '', unitId: '', lessonNo: '', semester: '', status: 0 },
        columns: [
          {
            prop: 'liveId',
            label: '房间号',
            // width: 60
          },
          // {
          //   prop: 'blockNo',
          //   label: 'blockNo'
          // },
          // {
          //   prop: 'blockNoName',
          //   label: 'blockNoName'
          // },
          {
            prop: 'lessonNo',
            label: 'lessonNo'
          },
          {
            prop: 'createdTime',
            label: '审核时间'
          },
          {
            prop: 'lessonNoName',
            label: 'lessonNoName'
          },
          {
            prop: 'lessonVersion',
            label: '版本号'
          },
          {
            prop: 'lessonTypeCh',
            label: '课件类型'
          },
          // {
          //   prop: 'schoolName',
          //   label: '学校名称'
          // },
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
    updateSelect(val) {
      this.query()
    },
    updatePage(page) {
      // console.log("listpage" + page)
      this.page = page
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