<template>
  <el-form class="lesson-filter-wrapper" :inline="true" :disabled="disabled">
    <span class="title" v-if="title">{{title}}</span>
    <el-form-item class="content-nav-level" style="width: 110px">
      <el-select @change="updateSelect" v-model="currentValue.level" ref="level" clearable placeholder="选择等级">
        <el-option v-for="item in levels" :key="item.level" :label="`Level${item.level}`" :value="item.level">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="content-nav-source" style="width: 130px">
      <el-select @change="updateSelect" v-model="currentValue.lessonType" ref="lessonType" clearable placeholder="选择课程类型">
        <el-option v-for="item in lessonTypes" :key="item.lessonType" :label="item.lessonTypeEn" :value="item.lessonType">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="content-nav-unit" style="width: 120px">
      <el-select @change="updateSelect" v-model="currentValue.unitId" ref="unit" placeholder="选择单元" clearable>
        <el-option v-for="item in units" :key="item.unitId" :label="item.nameEn" :value="item.unitId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="content-nav-lesson" style="width: 160px">
      <el-select @change="updateSelect" v-model="currentValue.lessonNo" clearable filterable placeholder="选择课件">
        <el-option v-for="item in lessons" :key="item.lessonNo" :label="item.lessonNoName+'-'+item.titleCh" :value="item.lessonNo">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="content-nav-lesson" style="width: 140px" v-if="needKeyword">
      <el-input v-model="currentValue.keyword" placeholder="请输入关键字"></el-input>
    </el-form-item>
    <slot></slot>
  </el-form>
</template>
<script>
import Request from "@/common/request.js"
export default {
  props: {
    releaseLesson: {
      type: Boolean,
      requried: false,
      default: false
    },
    disabled: {
      type: Boolean,
      requried: false,
      default: false
    },
    needKeyword: {
      type: Boolean,
      requried: false,
      default: true
    },
    title: {
      type: String,
      requried: false,
      default: '选择课件'
    },
    value: {
      type: Object,
      requried: false,
      default: {}
    }
  },
  data() {
    return {
      levels: '',
      lessonTypes: '',
      units: '',
      lessons: ''
    }
  },
  watch: {
    value: function (newValue) {
      this.getLessonList();
    },
    currentValue: {
      handler: function (val) {
        if (val.level) {
          this.getUnitList()
        } else {
          this.currentValue.unitId = ''
        }
        if (val.unitId) {
          this.getLessonList()
        } else {
          this.currentValue.lessonNo = ''
        }
      },
      deep: true
    }
    // 'currentValue.level': {
    //   handler: function (val) {
    //     if (val) {
    //       this.getUnitList()
    //     } else {
    //       this.currentValue.unitId = ''
    //     }
    //   },
    //   deep: true
    // },
    // 'currentValue.unitId': {
    //   function(val) {
    //     if (val) {
    //       this.getLessonList()
    //     } else {
    //       this.currentValue.lessonNo = ''
    //     }
    //   },
    //   deep: true
    // }
  },
  mounted() {
    this.getLevelList()
    this.getUnitList()
    this.getLessonList();
    this.getLessonTypeList()
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    // 获取 所有等级
    getLevelList() {
      this.loading = true
      let that = this
      let changeUrl = ''
      // console.log(56764576456544565, that.$route.name)
      if(that.$route.name == 'Image' || that.$route.name == 'Audio' || that.$route.name == 'Video') {
        changeUrl = 'lesson/resource/getLevelList'
      }else {
        changeUrl = '/lesson/getLevelList'
      }
      Request({
        url: changeUrl,
        type: 'get'
      }).then(res => {
        // console.log(res.data)
        that.levels = res.data
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
      })
    },
    // 获取 所有单元
    getUnitList() {
      this.loading = true
      let that = this
      if (!that.currentValue.level) {
        return null;
      }
      Request({
        url: '/lesson/getUnitListByLevel',
        type: 'post',
        data: { level: that.currentValue.level }
      }).then(res => {
        // console.log(res.data)
        that.units = res.data
        if (this.currentValue.level && that.units && this.currentValue.unitId) {
          let list = that.units.filter(item => {
            return item.unitId == that.currentValue.unitId
          })
          if (list.length == 0) {
            this.currentValue.unitId = ''
          }
        }
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
        url: that.releaseLesson ? '/lesson/getLessonReleaseList' : '/lesson/getLessonList',
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
    updateSelect() {
      this.getLessonList()
    }
  }
}
</script>
<style>
.lesson-filter-wrapper {
  padding-bottom: 20px;
  .el-form-item {
    margin-right: 5px;
    margin-top: 3px;
    margin-bottom: 0;
    width: 140px;
  }
  > button {
    margin-left: 0;
    margin-right: 5px;
    margin-top: 3px;
  }
  /** reset **/
  .el-button + .el-button {
    margin-left: 0;
  }
  .title {
    font-size: 14px;
    width: 100px;
    color: rgb(96, 98, 102);
    line-height: 40px;
    text-align: right;
    padding-right: 12px;
    box-sizing: border-box;
    display: inline-block;
  }
}
</style>