<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="content-main" v-loading="loading">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
      <el-form  class="form-wrap" :model="ruleForms" ref="ruleForms" label-position="right" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="等级名称:" :rules="rules.normal" prop="level">
              <el-input class="lessonNo-lesson" :disabled='disab' v-model.trim="ruleForms.level" placeholder="请输入等级名称" prop="level" clearable></el-input>
            </el-form-item>
            <el-form-item label="课程数量:" :rules="rules.normal" prop="totalLessonNum">
              <el-input class="lessonNo-lesson" v-model.trim="ruleForms.totalLessonNum" placeholder="请输入课程数量" prop="totalLessonNum" clearable></el-input>
            </el-form-item>
            <el-form-item label="推荐年龄:"  :rules="rules.normal" prop="recommend">
              <el-input class="lessonNo-lesson" v-model.trim="ruleForms.recommend" placeholder="推荐年龄(数字)" clearable></el-input>
            </el-form-item>
            <el-form-item label="等级标题:" :rules="rules.normal" prop="title">
              <el-input class="title-lesson" placeholder="请输入等级 标题" v-model.trim="ruleForms.title" clearable></el-input>
            </el-form-item>
            <el-form-item label="课件描述" :rules="rules.normal" prop="intro">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="240" show-word-limit v-model.trim="ruleForms.intro" 
                        class="lessonNo-lesson" placeholder="对课件的描述(注意数量不要超过240)" clearable ></el-input>
            </el-form-item>
            <el-form-item label="前景色:"  prop="font_color">
              <el-input class="title-lesson" placeholder="请输入前景色" v-model.trim="ruleForms.color.font_color" clearable></el-input>
            </el-form-item>
            <el-form-item label="背景色:"  prop="background_color">
              <el-input class="title-lesson" placeholder="请输入背景色" v-model.trim="ruleForms.color.background_color" clearable></el-input>
            </el-form-item>
             <el-form-item label="课程体系:" :rules="rules.normal" prop="lessonSort" >
              <el-select v-model="ruleForms.lessonSort" clearable placeholder="请选择课程体系">
                    <el-option v-for="(item,index) in lessonSorts" :label="item.label" :value="item.label" :key= "index"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="课程难度:" :rules="rules.normal" prop="lessonHard" >
              <el-input class="title-lesson" placeholder="请输入课程难度" v-model.trim="ruleForms.lessonHard" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="app端显示:" :rules="rules.normal" prop="appSort">
                <el-switch  v-model="ruleForms.appSort" active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </el-form-item> -->
            <el-form-item label="app显示:"  :rules="rules.normal">
                  <el-radio v-model="ruleForms.appSort" :label='1'>是</el-radio>
                  <el-radio v-model="ruleForms.appSort" :label='0'>.否</el-radio>
            </el-form-item>
            <el-form-item label="是否有录播课:"  :rules="rules.normal" prop="hasRecordVideo">
                    <el-radio v-model="ruleForms.hasRecordVideo" :label="1">是</el-radio>
                    <el-radio v-model="ruleForms.hasRecordVideo" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="课程类别:" :rules="rules.normal" prop="courseType">
                <el-radio v-model="ruleForms.courseType" :label="1">正课</el-radio>
                <el-radio v-model="ruleForms.courseType" :label="2">节日课</el-radio>
            </el-form-item>
            <el-form-item label="线上or线下:" :rules="rules.normal" prop="line">
                <el-radio v-model="ruleForms.line" :label="1">线上</el-radio>
                <el-radio v-model="ruleForms.line" :label="0">线下</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色图片:" :rules="rules.normal" prop="roleImgUrl">
            <ImgSelect :selectItemProp="selectItem" v-model="ruleForms.roleImgUrl"></ImgSelect>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="背景图片:"  :rules="rules.normal" prop="bgImgUrl">
            <ImgSelect :selectItemProp="selectItem" v-model="ruleForms.bgImgUrl"></ImgSelect>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <div class="edit-item submit-wrapper">
        <el-button type="primary" icon="el-icon-upload" @click="submitEdit('ruleForms')" :loading="save_loading">提交level</el-button>
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
      // console.log(this.ruleForms.recommend)
      if(this.$route.query.levelId) {
        this.disab = true
        let leveId = this.$route.query.levelId
        console.log(leveId)
        Request({
          type: 'get',
          url: 'level/detail/' + leveId
        }).then(res => {
          if(res.code == '0000') {
            let lala = res.data.level.color
            this.ruleForms = res.data.level
            this.ruleForms.color = JSON.parse(lala)
            if(this.ruleForms.appSort == 'true') {
              this.ruleForms.appSort = 1
            }else{
              this.ruleForms.appSort = 0
            }
            console.log(1111111111229202, this.ruleForms)
          }
        }).catch(() => {
          //错误处理
        }).always(() => {
           self.save_loading = false;
        })
      }else {
        this.disab = false
      }
  },
  data() {
    return {
      disab: false,
      // SchoolSemesterList: {},
      rules,
      ruleForms: {
          color: {
            font_color: '',
            background_color: ''
          },
          recommend: ''
      },
      lessonSorts: [{ label: '剑桥体系', value: '1' }, { label: '博识伴读体系', value: '2' }],
      loading: false,
      save_loading: false,
    }
  },
  components: {
    Breadcrumb,
    ImgSelect
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    submitEdit(formname) {
      const self = this;
      let urls = '/level/create'
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.save_loading = true;
          let datas = {...this.ruleForms}
          if(this.ruleForms.roleImgUrl) {
              datas.roleImgUrl = this.ruleForms.roleImgUrl.content
          }
          if(this.ruleForms.bgImgUrl) {
              datas.bgImgUrl = this.ruleForms.bgImgUrl.content
          }
          if(self.$route.query.levelId) {
            urls = 'level/update'
          }
          if(this.ruleForms.appSort == 1) {
            datas.appSort = 'true'
          }else {
            datas.appSort = 'false'
          }
          Request({
            type: 'post',
            url: urls,
            headers: {
                'Content-Type': 'application/json'
            },
            data: datas
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
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
        } else {
          return false;
        }
      });
    },
  },
  
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
