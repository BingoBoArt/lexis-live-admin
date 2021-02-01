<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="content-main" v-loading="loading">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
        <el-form  class="form-wrap" :model="ruleForms" ref="ruleForms" label-position="right" label-width="120px">
            <el-row>
            <el-col :span="12">
                <el-form-item label="代理商:"  prop="agentId">
                    <el-input class="lessonNo-lesson" :disabled="true" v-model.Number="ruleForms.agentId" placeholder="博时" clearable></el-input>
                </el-form-item>
                <el-form-item label="校区名称:" prop="schoolName">
                    <el-input class="lessonNo-lesson" v-model.trim="ruleForms.schoolName" placeholder="请输入校区名称" prop="levelName" clearable></el-input>
                </el-form-item>
                <el-form-item label="校长中文名称:"  prop="rectorNameCh">
                    <el-input class="lessonNo-lesson" v-model.Number="ruleForms.rectorNameCh" placeholder="请输入校长中文名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="校长英文名称:"  prop="rectorNameEn">
                    <el-input class="title-lesson" placeholder="请输入校长英文名称" v-model.trim="ruleForms.rectorNameEn" clearable></el-input>
                </el-form-item>
                <el-form-item label="校长电话:" prop="rectorPhone" >
                    <el-input class="title-lesson" placeholder="请输入校长电话" v-model.trim="ruleForms.rectorPhone" clearable></el-input>
                </el-form-item>
                <el-form-item label="QQ号:" prop="rectorQq" >
                    <el-input class="title-lesson" placeholder="请输入QQ号" v-model.trim="ruleForms.rectorQq" clearable></el-input>
                </el-form-item>
                <el-form-item label="所属城市:" prop="rectorAddress" >
                    <el-input class="title-lesson" placeholder="请输入所属城市" v-model.trim="ruleForms.rectorAddress" clearable></el-input>
                </el-form-item>
                <el-form-item label="校区数量:" prop="schoolNum" >
                    <el-input class="title-lesson" placeholder="请输入校区数量" v-model.trim="ruleForms.schoolNum" clearable></el-input>
                </el-form-item>
                <el-form-item label="学生人数:" prop="studentNum" >
                    <el-input class="title-lesson" placeholder="请输入学生人数" v-model.trim="ruleForms.studentNum" clearable></el-input>
                </el-form-item>
                <el-form-item label="是否为官方:"  prop="isOfficial">
                    <el-radio v-model="ruleForms.isOfficial" :label="1">官方</el-radio>
                    <el-radio v-model="ruleForms.isOfficial" :label="0">非官方</el-radio>
                </el-form-item>
                <div style="width: 900px">
                  
                  <el-form-item label="选择账户:"  prop="account">
                    <el-select v-model="accountarr" multiple placeholder="请选择账户">
                      <el-option v-for="(item) in accounttt" :key="item.nodes" :label="item.nodes" :value="item.nodes"></el-option>
                    </el-select>
                    <el-form-item style="display: inline-block;">
                      <!-- <el-button type="primary" @click="submitForm()">提交</el-button> -->
                      <el-button :disabled="addaccountarr" @click="addDomain(accountarr)">添加账户</el-button>
                    </el-form-item>
                  </el-form-item>
                    
                  <!-- <el-form-item label="分成.比例:" prop="account21" >
                    <el-input v-for="(item,index) in accountarr" v-model="ol[index]" :key="index" placeholder="请输入分成比例"  clearable>
                      <template slot="prepend">{{item}}{{index}}</template>
                    </el-input>
                  </el-form-item> -->

                  <el-form :model="ruleForms" label-width="100px" class="demo-dynamic">
                    <el-form-item
                      v-for="(domain, index) in ruleForms.component" :label="domain.nodes" :key="domain.key" :prop="'component.' + index + '.value'"
                    >
                      <el-input v-if="domain.nodes" v-model="domain.proportion"></el-input><el-button v-if="domain.nodes" @click.prevent="removeDomain(domain)">删除</el-button>
                    </el-form-item>
                  </el-form>

                </div>
            </el-col>
            </el-row>
        </el-form>
        <div class="edit-item submit-wrapper">
            <el-button type="primary" icon="el-icon-upload" @click="submitEdit('ruleForms')" :loading="save_loading">提交学校信息</el-button>
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
    Request({
      url: 'merchant/account/list',
      type: 'post',
    }).then(res => {
      this.accounttt = res.data
    })
    if(this.$route.query.schoolId) {
      // this.addaccountarr = true
      let schoolId = this.$route.query.schoolId
      let urls = "/school/detail/" + schoolId
      Request({
        type: 'get',
        url: urls,
      }).then(res => {
        this.ruleForms = res.data.school
      })
    }
  },
  data() {
    return {
        addaccountarr: false,
        ol: [],
        accountarr: [],
        accounttt:'',
        rules,
        twiceTimeLine: '',  
        ruleForms: {
            component: [
            ],
            studentNum: ''
        },
        schools: [{ label: 'lexislive', value: '1' }, { label: 'boshi', value: '2' }, { label: '智博汇晶', value: '3' }],
        loading: false,
        save_loading: false,
    }
  },
  components: {
    Breadcrumb,
    ImgSelect
  },
  methods: {
    addDomain(val) {
      val.forEach(element => {
        console.log(element)
        this.ruleForms.component.push({
          nodes: element,
          key: Date.now()
        });
      });
        
      },
    submitForm(formName) {
        console.log(this.ruleForms.component)
    },
    removeDomain(item) {
        var index = this.ruleForms.component.indexOf(item)
        if (index !== -1) {
          this.ruleForms.component.splice(index, 1)
        }
      },

    goBack() {
      this.$router.go(-1)
    },
    fofofo(val1, val2) {
      val1.forEach(item1 => {
        val2.forEach(item2 => {
          if(item2.nodes == item1.nodes) {
            item2.merchantAccountId = item1.accountId
          }
        })
      })
    },
    submitEdit(formname) {
      const self = this;
      let urls
      let schoolIId = this.$route.query.schoolId
      urls = schoolIId ? 'school/updSchool' : '/school/addSchool'
      if(schoolIId) {
        this.ruleForms.schoolId = schoolIId
      }

      this.fofofo(this.accounttt, this.ruleForms.component)
      this.ruleForms.agentId = 1
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.save_loading = true;
          // console.log(393939393, this.ruleForms)
          Request({
            type: 'post',
            url: urls,
            headers: {
              'Content-Type': 'application/json'
            },
            data: this.ruleForms
          }).then((res) => {
            if(res.code == '0000') {
              // self.twiceTimeLine.schoolId = res.data.schoolId
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              setTimeout(() => {
              this.goBack();
            }, 1000);
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
  }
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
