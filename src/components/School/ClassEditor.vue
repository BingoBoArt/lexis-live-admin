<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="content-main" v-loading="loading">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
        <el-form class="form-wrap" :model="ruleForms" ref="ruleForms" label-position="right" label-width="120px">
            <el-row>
            <el-col :span="12">
                <el-form-item label="班级名称:"  prop="className">
                    <el-input class="lessonNo-lesson" v-model.trim="ruleForms.className" placeholder="请输入校区名称" prop="levelName" clearable></el-input>
                </el-form-item>
                <el-form-item label="代理商:"  prop="agentId">
                    <el-input class="lessonNo-lesson" :disabled="true" v-model.Number="ruleForms.agentId" placeholder="博时" clearable></el-input>
                </el-form-item>
                
                <el-form-item label="时间线:"  prop="semester">
                    <el-select v-model="ruleForms.semester" clearable placeholder="请选择时间线">
                        <el-option v-for="(item,index) in semesterList" :label="item.title" :value="item.semesterId" :key="index" ></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="学校:"  prop="shcoolId">
                    <el-select v-model="ruleForms.schoolId" :disabled="kaka" @change="levelChange(ruleForms.schoolId)" clearable placeholder="请选择学校">
                        <el-option v-for="(item,index) in SchoolSemesterList" :label="item.schoolName" :value="item.schoolId" :key="index" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="师生比:"  prop="shcoolId">
                    <el-select v-model="ruleForms.studentRatio" clearable placeholder="请选择师生比">
                        <el-option v-for="(item,index) in studentRatio" :label="item.label" :value="item.label" :key="index" ></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="level:"  prop="level">
                    <el-select v-model="ruleForms.level" @visible-change="$forceUpdate()" @change="levelattimeChange(ruleForms.title)" placeholder="请选择level">
                        <el-option v-for="(item,index) in level" :label="item.title" :value="item.level" :key="index" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="原价:" :rules="rules.InterNum" prop="originalPrice">
                    <el-input class="title-lesson lalla" ref='moneyw' @input="inputmoney" placeholder="请输入原价" v-model.trim="ruleForms.originalPrice" clearable>
                    <i class="price" slot="append">{{ruleForms.originalPrice | moneyoriginal | nonan}}</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="折扣价:" :rules="rules.InterNum" prop="discountPrice" >
                    <el-input class="title-lesson" placeholder="请输入折扣价" v-model.trim="ruleForms.discountPrice" clearable>
                      <i class="price" slot="append">{{ruleForms.discountPrice | moneyoriginal | nonan}}</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="单节课原价:"   prop="lessonOriginalPrice" >
                    <el-input class="title-lesson" :disabled="true" placeholder="请输入单节课原价" v-model.trim="ruleForms.lessonOriginalPrice" clearable>

                    <i class="price" slot="append">{{ruleForms.lessonOriginalPrice | moneyoriginal | nonan}}</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="单节课折扣价格:"  prop="lessonDiscountPrice" >
                    <el-input class="title-lesson" :disabled="true"  placeholder="请输入单节课折扣价格" v-model.trim="ruleForms.lessonDiscountPrice" clearable>

                    <i class="price" slot="append">{{ruleForms.lessonDiscountPrice | moneyoriginal | nonan}}</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="付费类型:"  prop="isOfficial">
                    <el-radio v-model="ruleForms.payType" :label="1">付费</el-radio>
                    <el-radio v-model="ruleForms.payType" :label="2">免费</el-radio>
                </el-form-item>
            </el-col>
            </el-row>
        </el-form>
        <div class="edit-item submit-wrapper">
            <el-button type="primary" icon="el-icon-upload" @click="submitEdit(ruleForms)" :loading="save_loading">提交班级</el-button>
        </div>
    </div>
  </div>
</template>
<script>
import ImgSelect from "@/components/Coms/ImgSelect";
import Request from "@/common/request.js"
import ComUtil from '@/common/util.js'
import Breadcrumb from '@/components/Common/Breadcrumb'
import rules from '@/common/validator'
export default {
  created() {
    if(this.$route.query.classId) {
      this.kaka = true
      let classId = this.$route.query.classId
      this.getClass(classId)
    }else {
      this.kaka = false
    }
    Request({
        url: 'school/tob/list',
        type: 'get'
      }).then(res => {
        if(res.code == '0000' ){
            this.SchoolSemesterList = res.data
        }
        })
    Request({
    url: 'schedule/tob/semester/list',
    type: 'get'
    }).then(res => {
    if(res.code == '0000' ){
        this.semesterList = res.data
    }
    })
  },
  data() {
    return {
        nununu: 2,
        money: "",
        rules,
        ruleForms: {
          lessonOriginalPrice: '',
          originalPrice: '',
          discountPrice: ''
        },
        semesterList: [],
        SchoolSemesterList: [],
        studentRatio: [ { label: '12', value: '1' }, { label: '25', value: '2' }],
        level: [ { label: '等级1', value: '1' }, { label: '等级2', value: '2' }],
        semester: [ { label: 'lexislive', value: '1' }, { label: 'asd', value: '2' }],
        loading: false,
        save_loading: false,
    }
  },
  components: {
    Breadcrumb,
    ImgSelect
  },
  computed: {
    timeLine: {
      get: function() {
        return this.ruleForms.semester
      }
    },
    lessonDiscountPrice: {
      get:function() {
        return this.ruleForms.discountPrice
      }
    },
    lessonOriginalPrice: {
      get:function() {
        return this.ruleForms.originalPrice
      }
    }
  },
  watch: {
    nununu(newval, oldval) {
      // console.log(newval)
      // console.log(Number(this.ruleForms.originalPrice))

      // console.log(this.ruleForms)
      let originalPrice = Number(this.ruleForms.originalPrice)
      let discountPrice = Number(this.ruleForms.discountPrice)
      // console.log(this.ruleForms.lessonOriginalPrice)
      this.ruleForms.lessonOriginalPrice = parseInt(originalPrice/newval)
      this.ruleForms.lessonDiscountPrice = parseInt(discountPrice/newval)
    },
    timeLine(newval, oldval) {
      this.shijianxian(newval, oldval)
    },
    lessonOriginalPrice(newval, oldval) {
      this.ruleForms.lessonOriginalPrice = parseInt(newval/this.nununu)
    },
    lessonDiscountPrice(newval, oldval) {
        this.ruleForms.lessonDiscountPrice = parseInt(newval/this.nununu)
    },
  },
  filters: {
    moneyoriginal: function(val) {
      if(val) {
        return (Number(val)/100).toLocaleString('en-US') + '元'
      }else {
        return ''
      }
    },
    nonan: function(val) {
      if(val == 'NaN元') {
        return "请输入金额"
      }else{
        return val
      }
    },
  },
  methods: {
    shijianxian(newval, oldval) {
      this.semesterList.forEach((item, index) => {
        if(item.semester == newval) {
          this.nununu = item.totalLessonNum
        }
      })
    },
    //获取班级详细数据
    getClass(val) {
       Request({
            url: '/class/info',
            type: 'post',
            data: {
                classId: val
            }
        }).then(res => {
             if(res.code == '0000' ){
              this.ruleForms = res.data.classInfo
              this.ruleForms.title = res.data.level.title
              console.log(res.data.classInfo.schoolId)
              let lec = res.data.level.title
              console.log('lev11111eeeeeee', lec)
              let schoooool = res.data.classInfo.schoolId
              this.levelChange(schoooool)
              // console.log(lec)
              // this.ruleForms.title = lec
            }
        })
    },
    levelChange(val) {
      // console.log(val)
      console.log(133123, this.ruleForms.title)
        Request({
            url: 'level/school/list',
            type: 'post',
            data: {
                schoolId: val
            }
        }).then(res => {
            if(res.code == '0000' ){
                this.level = res.data
                if(this.ruleForms.title){
                }else {
                  this.ruleForms.title = res.data[-1] && res.data[-1].title || "选择等级"
                }
            }
        })
    },
    levelattimeChange(val) {
        this.level.forEach((element, index) => {
          // console.log(111, val, element)
            if(element.levelId == val) {
                return element.title
            }
        });
    },
   
    goBack() {
      this.$router.go(-1)
    },
    submitEdit(ruleForms) {
      const self = this;
      console.log(10002121, this.level)
      console.log(13131, ruleForms)
    //   this.$refs[formname].validate((valid) => {
        // if (valid) {
          // console.log(343434, this.$route.query.classId)
          let urls
          if(this.$route.query.classId) {
            urls = '/class/update'
          }else {
            urls = '/class/create'
          }
          this.save_loading = true;
          this.ruleForms.agentId = 1
          // if(ruleForms.title) {
          //   console.log(88888, ruleForms.title)
          //   ruleForms.level = ruleForms.title
          // }
          Request({
            type: 'post',
            url: urls,
            // headers: {
            //   'Content-Type': 'application/json'
            // },
            data: this.ruleForms
          }).then((res) => {
            if(res.code == '0000') {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              setTimeout(() => {
              this.goBack();
            }, 500);
            }
          }).catch(() => {
            // 错误处理
          }).always(() => {
            self.save_loading = false;
          });
        // } else {
        //   return false;
        // }
    //   });
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.price {
  line-height: normal;
  color: red;
  float: right;
  font-size: 10px;
}
.breadcrumb {
  margin: 10px 0px;
  .separator {
    display: inline-block;
    padding: 0 5px;
  }
}
.main-wrap {
  min-width: 800px;
}
.back {
  margin-left: 10px;
  float: right;
  margin-top: -30px;
}
.title-lesson,
.lessonNo-lesson {
  display: block;
  min-width: 240px;
  max-width: 400px;
}
.select-lesson-wrap {
  min-width: 600px;
}
.form-wrap {
  padding: 10px;
  /* box-shadow: 0 0 4px #eaeaea; */
}
ul.layer-wrap {
  margin: 10px -10px;
  min-height: 100px;
  margin: 40px 0px;
  min-height: 100px;
  padding: 10px;
  box-shadow: 0 0 4px #eaeaea;
}
ul.layer-wrap li {
  margin: 10px;
  float: left;
}
ul.layer-wrap li .layout-top-wrap {
  width: 150px;
  height: 150px;
  border: 1px solid #dcdfe6;
  position: relative;
  overflow: hidden;
}
.layer-pop-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
}
.layer-pop {
  display: inline-block;
  // transform: translateY(25%);
  margin-top: 10px;
}
ul.layer-wrap .iconfont {
  font-size: 12px;
}
.layer-pop button {
  margin: 5px 5px;
}
.layer-pop .jump-wrapper {
  margin-top: 6px;
  .input {
    width: 42px;
    height: 32px;
    border: 0;
    padding: 0;
    text-align: center;
    outline: none;
  }
  button {
    width: 40px;
    height: 32px;
    border-radius: 0 3px 3px 0;
    margin: 0;
    padding: 0;
  }
}
.se-num {
  /*background-color: #f56c6c;*/
  // border: 1px solid #b1b1b1;
  // border-radius: 10px;
  // color: #b1b1b1;
  // display: inline-block;
  font-size: 12px;
  // height: 18px;
  line-height: 18px;
  // padding: 0 6px;
  // text-align: center;
  // white-space: nowrap;
}
.layout-bot-wrap {
  text-align: left;
  margin-top: 4px;
  font-size: 12px;
  line-height: 18px;
  color: #b1b1b1;
}
.select-lesson-wrap .el-select {
  display: block;
}
.select-lesson-wrap .el-select:nth-of-type(1),
.select-lesson-wrap .el-input:nth-of-type(1) {
  margin-bottom: 10px;
}
.layout-add {
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 150px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
}
ul.layer-wrap .layout-add .iconfont {
  font-size: 80px;
  color: #dcdfe6;
}

.template-show {
  text-align: center;
  font-size: 12px;
  .title {
    height: 20px;
    margin-top: 14px;
  }
  .tag {
    margin: 4px;
    max-width: 140px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tag--primary {
    background: rgba(64, 158, 255, 0.7);
    color: white;
  }
  .el-tag--warning {
    background: rgba(230, 162, 60, 0.7);
    color: white;
  }
}
.story-show,
.rankpage-show {
  img {
    height: 70px;
    max-width: 100%;
  }
  .text {
    height: 40px;
    position: absolute;
    bottom: 0px;
    text-align: center;
    width: 100%;
  }
  .tag-list {
    position: absolute;
    top: 35px;
    width: 100%;
    height: 70px;
    overflow: hidden;
    left: 0;
  }
}
.wordbank-show,
.flashcard-show,
.story-show {
  .tag-list {
    padding: 4px;
    text-align: left;
    box-sizing: border-box;
  }
}
.select-lesson-wrap .el-col {
  margin-right: 20px;
}
.select-lesson-wrap .el-col {
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>
