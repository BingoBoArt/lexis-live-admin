<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="content-main">
      <LessonFilter v-model="selectItem" :needKeyword="false" :releaseLesson="true">
      </LessonFilter>
      <el-form label-width="100px" :inline="true" :model="live" ref="liveForm" :rules="rules">

        <el-row>
          <el-form-item label="课程类型:" :prop="live.mold == 2?'semester':null">
            <!-- <el-radio v-model="live.mold" label="1" border>测试课件</el-radio> -->
            <el-radio v-model="live.mold" label="2" border>正式课件</el-radio>
            <el-radio v-model="live.mold" label="4" border>交互录播课</el-radio>
            <el-tooltip class="item" effect="dark" content="选择学期" placement="top" v-if="live.mold == 2">
              {{live.semesterStatus = 2}}
              <!-- <el-select v-model="live.semester" placeholder="请选择学期" size="small">
                <el-option v-for="(semester, index) in semesters" :key="index" :value="semester.scheduleId" :label="semester.title"></el-option>
              </el-select> -->
            </el-tooltip>
          </el-form-item>
        </el-row>


        <el-form-item label="请选择：">
          <el-form class="lesson-filter-wrapper" :inline="true">
            {{selectComp}}
            <el-form-item class="content-nav-level" style="width: 110px">
              <el-select @change="updateSelect(row)" v-model="currentValue.level" ref="level" clearable placeholder="选择等级">
                <el-option v-for="item in levels" :key="item.level" :label="`Level${item.level}`" :value="item.level">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="content-nav-source" style="width: 130px">
              <el-select @change="updateSelect(row)" v-model="currentValue.lessonType" ref="lessonType" clearable placeholder="选择课程类型">
                <el-option v-for="item in lessonTypes" :key="item.lessonType" :label="item.lessonTypeEn" :value="item.lessonType">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="content-nav-unit" style="width: 120px">
              <el-select @change="updateSelect(row)" v-model="currentValue.unitId" ref="unit" placeholder="选择单元" clearable>
                <el-option v-for="item in units" :key="item.unitId" :label="item.nameEn" :value="item.unitId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="content-nav-lesson" style="width: 160px">
              <el-select @change="updateSelect(row)" v-model="currentValue.lessonNo" clearable filterable placeholder="选择课件">
                <el-option v-for="item in lessons" :key="item.lessonNo" :label="item.titleCh" :value="item.lessonNo">
                </el-option>
              </el-select>
            </el-form-item>
<!-- 添加老师的选项 -->
            <!-- {{selecttch}} -->
            <el-form-item v-if="disable" class="content-nav-unit" style="width: 120px">
              <el-select @change="updateSelect(row)" v-model="currentValue.interactiveId" clearable placeholder="请选择老师">
                <el-option v-for="(item, index) in tchName" :key="index"  :label="item.tchNickname" :value="item.interactiveId">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </el-form-item>
        <el-row>
          <el-form-item label="选择老师" inline prop="teacherName">
            <el-input v-model="live.teacherName" placeholder="请选择老师" disabled style="width: 220px"></el-input>
          </el-form-item>
          <el-form-item style="heigh:100px">
            <el-button @click="openteacher" :disabled="disable" type="success">选择老师</el-button>
          </el-form-item>
          <el-form-item>
            <img v-if="live.cover" :src="live.cover" style="width: 50px; margin-left:10px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开始日期:" prop="startDate">
            <template>
              <el-date-picker class="date-picker" v-model="live.startDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
              </el-date-picker>
            </template>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开始时间:" prop="startTime">
            <el-time-picker v-model="live.startTime" placeholder="任意时间点" value-format="HH:mm:ss">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间:" prop="endTime">
            <el-time-picker v-model="live.endTime" placeholder="任意时间点" value-format="HH:mm:ss">
            </el-time-picker>
          </el-form-item>
        </el-row>
        <el-form-item label="课堂布局" prop="onLiveLayout">
          <el-select v-model="live.onLiveLayout" :disabled="disable" clearable placeholder="选择课堂布局">
            <el-option v-for="(item,index) in onLiveLayouts" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <div v-if="live.onLiveLayout == 1" class="fendui"></div>
          <div v-if="live.onLiveLayout == 2" class="yugan"></div>
        </el-form-item>
        <!-- <el-row>
          <el-form-item label="学校：" prop="onLiveLayout">
            <el-select v-model="live.schoolId" placeholder="请选择学校" size="small">
              <el-option v-for="(item, index) in school" :key="index" :value="item.schoolId" :label="item.schoolName"></el-option>
            </el-select>
          </el-form-item>
        </el-row> -->

        
        <el-row>
          <el-form-item label="请选择班级:">
            <MyTransfer :dataList="SchoolSemesterList" @result-list="getResultList"></MyTransfer>
          </el-form-item>
        </el-row>
        <el-form-item label="" style="margin: 30px 0 0 100px">
          <el-button type="primary" @click="saveOrderLive" icon="el-icon-upload">Submit</el-button>
        </el-form-item>

      </el-form>
      <el-dialog title="选择老师" :visible.sync="teacherFormVisible" width="80%">
        <TeacherPage :userType="userTypeTea" :multiple=false @emit-teacher="chooseteacher"></TeacherPage>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import TeacherPage from './Coms/TeacherPage'
import MyTransfer from '@/components/Coms/MyTransfer'
import Request from '@/common/request.js'
import SchoolSemester from '@/components/Coms/SchoolSemester'

export default {
  data() {
    return {
      disable:false,
      schoolSelect: '',
      semesterSelect: '',
      currentValue: { level: '', lessonType: '', unitId: '', lessonNo: '', interactiveId: '' },
      onLiveLayouts: [{ label: '正课', value: 1 }, { label: '语感课', value: 2 }],
      school: [],
      teacherFormVisible: false,
      SchoolSemesterList: [],
      SchoolSemesterSelectList: [],
      semesters: [],
      releaseLesson: true,
      rules: {
        'nickname': [{ required: true, message: '请选择老师', trigger: 'blur' }],
        'startDate': [{ required: true, message: '请您选择日期', trigger: 'blur' }],
        'startTime': [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        'endTime': [{ required: true, message: '请选择停止时间', trigger: 'blur' }],
        'onLiveLayout': [{ required: true, message: '请选择课堂布局', trigger: 'blur' }]
      },
      tchName: [],
      levels: [],
      units: [],
      lessonTypes: [],
      lessons: [],
      live: {
        startDate: '',
        startTime: '',
        mold: '2',
        semesterList: [],
        forceMiss: false,
        forceHad: false,
        forceLayout: false
      },
      userTypeTea: 2,
      teacher: {},

      pickerOptions1: {
        disabledDate(time) {
          const date = new Date()
          const yesday = date.setTime(date.getTime() - 3600 * 1000 * 24);
          return time.getTime() < yesday
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      }
    };
  },
  components: {
    TeacherPage,
    MyTransfer,
    SchoolSemester,
    Breadcrumb
  },
  mounted() {
    this.getLevelList()
    this.getLessonTypeList()
    this.getLessonList()
    this.getSemester()
    this.getSchool()
    this.getSchoolSemesterList()
  },
  watch: {
    'live.mold': function (val) {
      if (val == 1) {
        delete (this.live.semester)
        delete (this.live.semesterStatus)
      }else if(val == 2) {
        this.disable = false
        this.rules.onLiveLayout[0].required = true
      }else if(val == 4) {
        this.disable = true
        // this.rules.onLiveLayout
        this.rules.onLiveLayout[0].required = false
        console.log("有你真好", this.rules.onLiveLayout[0].required)
      }

    }
  },
  computed: {
    selectComp: function () {
      if (this.currentValue.level) {
        this.currentValue.lessonNo = ''
        this.currentValue.unitId = ''
        this.getUnitList()
      }
    },
  },
  methods: {
    //查询所有的老师
    getTeachByinfo() {
      this.loading = true
      let that = this
      if(!that.currentValue.lessonType) {
        that.currentValue.lessonType = 1
      }
      Request({
        url: 'orderlive/interactiveList',
        type: 'post',
        data: that.currentValue
      }).then(res => {
        if ( res.code == 0 ) {
          that.tchName = res.data.passLive
          res.data.passLive.forEach((val) => {
            // that.live.interactiveId = val.interactiveId
          })
          console.log(that.tchName)
          console.log(78787878)
        }
      })
    },
    // 获取所有的学校
    getSchool() {
      Request({
        url: 'school/list',
        type: 'get'
      }).then(res => {
        if (res.code == 0) {
          this.school = res.data
        }
      })
    },
    // 获取学校整体
    getSchoolSemesterList() {
      Request({
        url: 'schedule/school/semester',
        type: 'get'
      }).then(res => {
        if (res.code == 0) {
          this.SchoolSemesterList = res.data
        }
      })
    },
    // 获取 所有等级
    getLevelList() {
      let that = this
      Request({
        url: '/lesson/getLevelList',
        type: 'get'
      }).then(res => {
        that.levels = res.data
      })
    },
    // 获取 所有单元
    getUnitList() {
      this.loading = true
      let that = this
      Request({
        url: '/lesson/getUnitListByLevel',
        data: { level: this.currentValue.level },
        type: 'post'
      }).then(res => {
        // console.log(res.data)
        that.units = res.data
      })
    },
    // 获取 所有课程类型
    getLessonTypeList() {
      this.loading = true
      let that = this
      Request({
        url: '/lesson/getLessonTypeList',
        type: 'get'
      }).then(res => {
        // console.log(res.data)
        that.lessonTypes = res.data
				// console.log("TCL: getLessonTypeList -> res.data", res.data)
      })
    },
    // 获取 所有课件
    async getLessonList() {
      this.loading = true
      let that = this
      if (!(this.currentValue.level && this.currentValue.lessonType && this.currentValue.unitId)) {
        this.currentValue.lessonNo = ''
        return;
      }
      await Request({
        url: that.releaseLesson ? '/lesson/getLessonReleaseList' : '/lesson/getLessonList', // 全部使用发布版本
        type: 'get',
        data: this.currentValue
      }).then(res => {
        // console.log(res.data)
        that.lessons = res.data
      })
    },





    isAllParamNotNull() {
      if (this.currentValue.level && this.currentValue.lessonType && this.currentValue.unitId) {
        return true
      } else {
        this.currentValue.lessonNo = ''
        return false
      }
    },
    /* 更新数据 */
    updateSelect(row) {
      this.getLessonList()
      this.getTeachByinfo()
      // alert("oo")
      // console.log("看看这是啥东西", row)
      // console.log("iddidididi", this.live.interactiveId)
      // console.log("老师的名", this.currentValue.teachersName)
    },
    getImages(val) {
      let resource = {
        ...this.currentValue,
        type: 1 //图片
      }
      this.param = resource
    },
    getSemester() {
      Request({
        type: 'get',
        url: "schedule/getOnSemester"
      }).then(res => {
        this.semesters = res.data
      })
    },
    openteacher() {
      this.teacherFormVisible = true
    },
    chooseteacher(teacher) {
      this.live.teacherName = teacher.nickname
      this.live.teacherId = teacher.userId
      this.live.tchNickname = teacher.nickname
      this.live.cover = teacher.cover
      this.teacherFormVisible = false
    },
    saveOrderLive(force) {
      this.$refs['liveForm'].validate((val) => {
        if (val) {
          let url = 'ook'
          if (force === 'forceMiss') {
            this.live.forceMiss = true
          }
          let resource = this.currentValue
          // let interactiveId = this.interactiveId
          // console.log("这个是mold的值", this.live.mold)
          if(this.live.mold == 2) {
            url = '/orderlive/simpOrder'
          }else if(this.live.mold == 4) {
            url = '/orderlive/simpInteractiveOrder'
          }
          Request({
            type: 'post',
            url: url,
            data: { ...resource, ...this.live, release: 2, 'schoolSemesterList': this.SchoolSemesterSelectList },
            headers: { 'Content-Type': 'application/json' }
          })
            .then(res => {
              if (res.code == '0000') {
                this.$message({
                  showClose: true,
                  message: "约课成功",
                  type: "success"
                })
              } else if (res.code == '8805') {
                // 弹框询问
                this.$confirm(res.msg, '缺少预约是否继续预约 ?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.live.forceMiss = true
                  this.saveOrderLive()
                  this.live.forceMiss = false
                })
              } else if (res.code == '8806') {
                // 弹框询问
                this.$confirm(res.msg, '预约重复是否继续预约 ?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.live.forceHad = true
                  this.saveOrderLive('forceMiss')
                  this.live.forceHad = false
                })
              } else if (res.code == '8809') {
                // 弹框询问
                this.$confirm(res.msg, '是否继续预约 ?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.live.forceLayout = true
                  this.saveOrderLive()
                  this.live.forceLayout = false
                })
              }
            })
        } else {
          this.$message.error('校验未通过');
        }
      })
    },
    // 获取资源
    getResultList(value) {
      this.SchoolSemesterSelectList = value
    }
  }
}
</script>
<style scoped>
.yugan,
.fendui {
  width: 220px;
  height: 140px;
}
.fendui {
  background: url(~@/assets/images/orderlive/fendui.jpg) center center no-repeat;
  background-size: contain;
}
.yugan {
  background: url(~@/assets/images/orderlive/yugan.jpg) center center no-repeat;
  background-size: contain;
}
</style>
