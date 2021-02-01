<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="content-main">
      <el-form label-width="100px" :inline="true" :model="live" :rules="rules">
        <!-- 选择课程(唯一性) -->
        <el-form-item label="请选择课程:">
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
          </el-form>
        </el-form-item>
        <el-form-item label="请选择时间线:" style="width: 600px">
          <el-select v-model="smester" multiple clearable placeholder="选择时间线">
            <el-option v-for="(item, index) in smesters" :key="index" :label="item.title" :value="item.semesterId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 显示添加老师的弹框（老师多选） -->
        <el-row>
          <el-form-item style="heigh:100px">
            <el-button @click="openteacher" type="success">选择老师</el-button>
          </el-form-item>
        </el-row>
        <!-- 选择的老师列表 -->
      
        <el-table max-height="350" :data="teacherLists"  border highlight-current-row>
          <el-table-column :prop="column.prop" :label="column.label" v-for="(column,index) in teaccolumn" :key="index"></el-table-column>
          <!--  -->
          <el-table-column prop="头像" label="头像">
            <template slot-scope="{row}">
              <img :src="img" v-for="(img ,index) in row.coverImgUrl" :key="index" style="margin-right:10px;width:50px;" />
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column prop="" label="Action">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, teacherLists)" type="danger" icon="el-icon-delete" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
     
        <!-- 选择的老师列表 -->
        <!--  日期多选 -->
        <el-row style="margin-top: 30px">
           <el-form-item label="">
            <el-button type="success" @click="addTimegroup()">添加时间</el-button>
          </el-form-item>
          <el-form-item label="开始时间:" prop="startTime">
            <el-date-picker @change="rewritetiem()" v-model="live.startTime" type="datetime" value-format='yyyy-MM-dd HH:mm' placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:" prop="endTime">
            <el-date-picker v-model="live.endTime" type="datetime" value-format='yyyy-MM-dd HH:mm' placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-button type="success" @click="addTimegroup()">添加.时间</el-button>
          </el-form-item> -->
          <!-- 时间组列表 -->
          <el-table max-height='350' :data="batchTime"  border highlight-current-row>
            <el-table-column :prop="column.prop" :label="column.label" v-for="(column,index) in times" :key="index"></el-table-column>
            <el-table-column prop="" label="Action">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteTimegroup(scope.$index, batchTime)" type="danger" icon="el-icon-delete" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 时间组列表 -->
          <el-form-item label="" style="margin-top: 20px">
            <el-button type="success" @click="saveOrderLive">约课列表</el-button>
          </el-form-item>
        </el-row>
      </el-form>

      <!-- 选择教师的弹框 -->
      <el-dialog title="选择老师" :visible.sync="teacherFormVisible" width="80%">
        <BatchTeachers :teacherLists='teacherLists'  @emit-teacher="chooseteacher"></BatchTeachers>
      </el-dialog>

      <!-- table渲染表 -->

      <el-table max-height='400' :data="list"  border highlight-current-row>
        <el-table-column :prop="column.prop" :label="column.label" v-for="(column,index) in columns" :key="index"></el-table-column>
        <el-table-column prop="" label="Action">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, list)" type="danger" icon="el-icon-delete" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item label="" style="margin-top: 20px">
            <el-button type="success" :disabled="canuse" @click="commitData">提交约课</el-button>
          </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import BatchTeachers from './Coms/BatchTeachers'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      canuse: false,
      teacherLists: [], //emit返回选择的老师
      teaccolumn: [
        {
          prop: 'nickname',
          label: '昵称'
        },
        {
          prop: 'mobile',
          label: '电话'
        },
        {
          prop: 'email',
          label: '邮箱'
        }
      ],//老师列表表头
      times: [
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'endTime',
          label: '结束时间'
        }
      ],//时间组列表
      columns: [
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'endTime',
          label: '结束时间'
        },
        {
          prop: 'lessonNo',
          label: '课程编号'
        },
        {
          prop: 'nickname',
          label: '教师名'
        }
      ],//约课列表表头
      list: [],//最后渲染到下面的数据，提交也是这个
      batchTime: [], //时间组
      endTime: '',
      live: {
        startTime: '',
        endTime: ''
      },
      currentValue: { level: '', lessonType: '', unitId: '', lessonNo: ''},  //选择的课件信息
      teacherFormVisible: false,   //显示选择教师table
      levels: [],
      units: [],
      lessonTypes: [],
      lessons: [],
      smester: '',
      smesters: [],
    };
  },
  watch: {
    list: {
      handler(newvalue) {
        if(newvalue.length == 0) {
          this.canuse = true
        }else{
          this.canuse = false
        }
      }
    }
      
  },
  methods: {
    // 重写方法，自定义格式化日期
    rewritetiem() {
      this.endTime = new Date(this.live.startTime).getTime() + 300000
      Date.prototype.toLocaleString = function() {
        function addZero(num) {
            if(num<10)
                return "0" + num;
            return num;
        }
        // 按自定义拼接格式返回
        return this.getFullYear() + "-" + addZero(this.getMonth() + 1) + "-" + addZero(this.getDate()) + " " +
            addZero(this.getHours()) + ":" + addZero(this.getMinutes()) + ":" + addZero(this.getSeconds());
      };
      // 根据毫秒数构建 Date 对象
      var date = new Date(this.endTime);
      // 按重写的自定义格式，格式化日期
      this.live.endTime = date.toLocaleString()
    },
    openteacher() {
      this.teacherFormVisible = true
      console.log(111, this.teacherLists)
    },
    chooseteacher(teacher) {
      // console.log('dialog返回的选择的老师信息', teacher)
      teacher.forEach(item => {
        this.teacherLists.push(item)
      })
      this.teacherLists = this.deletea(this.teacherLists)
      // console.log('最后的教师列表', this.teacherLists)

      this.teacherFormVisible = false
    },
    deletea(val) { //教师列表去重
      const hasha = {}
      this.teacherLists = val.reduce((obj, next) => {
        const hashId = `${next.nickname}_${next.email}_${next.mobile}`;
        if (!hasha[hashId]) {
          hasha[`${next.nickname}_${next.email}_${next.mobile}`] = true;
          obj.push(next);
        }
        return obj;
      }, [])
      return this.teacherLists
    },
    saveOrderLive() {
      this.list = []
      let resource = this.currentValue //选择的课件信息
      let batchTime = this.batchTime  //选择好的时间分组
      let smester = this.smester  
      let teacherLists = this.teacherLists
      let list = this.testformate()
      this.list = list
      // console.log(77777, this.list)
    },
    
    testformate() { //生成列表
      let that = this
      this.teacherLists.forEach(itemteach => {
        this.batchTime.forEach(itemtime => {
          let semesters = this.smester
          let allList = { ...itemteach, ...itemtime, semesters, ...this.currentValue}
          this.list.push(allList)
        })
      });
      //防止多次添加，list去重
      const hash = {};
      this.list = this.list.reduce((obj, next) => {
        const hashId = `${next.nickname}_${next.startTime}_${next.endTime}`;
        if (!hash[hashId]) {
          hash[`${next.nickname}_${next.startTime}_${next.endTime}`] = true;
          obj.push(next);
        }
        return obj;
      }, []);
      return this.list
    },
    commitData() {
      Request({
        url: '/schedule/class/multi/tob',
        type: 'post',
        data: {
          list: this.list
        },
        headers:{'Content-Type': 'application/json'}
      }).then(res => {
        if (res.code == '0000') {
          this.$message({
            showClose: true,
            message: "批量约课成功",
            type: "success"
          })
        } else {

        }
      })
    },//提交数据
    addTimegroup(){
      this.batchTime.push({
        endTime: this.live.endTime,
        startTime: this.live.startTime
      })
    },//添加时间组
    deleteTimegroup(index, rows) {
      rows.splice(index, 1);
    },//删除时间组
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },//删除行
    getSmester() {
      Request({
        url: '/schedule/tob/semester/list',
        type: 'get'
      }).then(res => {
        this.smesters = res.data
      })
    },//获取 时间线
    getLevelList() {
      let that = this
      Request({
        url: '/lesson/getLevelList',
        type: 'get'
      }).then(res => {
        that.levels = res.data
      })
    },// 获取 所有等级
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
    },// 获取 所有单元
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
    },// 获取 所有课程类型
    async getLessonList() {
      this.loading = true
      let that = this
      if (!(this.currentValue.level && this.currentValue.lessonType && this.currentValue.unitId)) {
        this.currentValue.lessonNo = ''
        return;
      }
      await Request({
        url: '/lesson/getLessonReleaseList', 
        type: 'get',
        data: this.currentValue
      }).then(res => {
        that.lessons = res.data
      })
    },// 获取 所有课件
    /* 更新数据 */
    updateSelect(row) {
      this.getLessonList()
    },
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
  created() {
    if(this.list.length == 0) {
      this.canuse = true
    }else{
      this.canuse = false
    }
  },
  mounted() {
    this.getLevelList()
    this.getLessonTypeList()
    this.getLessonList()
    this.getSmester()
  },
  components: {
    BatchTeachers,
    Breadcrumb
  },
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
