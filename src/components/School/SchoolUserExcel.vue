
<template>
  <div>
    <el-form inline :rules="rules" ref="UserObFrom" :model="UserOb">
      <el-form-item>
        <el-upload class="upload-demo" ref="upload" action="/jidaadm/class/parse/user/excel" :file-list="fileList" :auto-upload="true" :on-success="pushData">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button> -->
        </el-upload>
      </el-form-item>
      <el-row>
        <el-form-item prop="semester">
          <!-- <SchoolSemester @school-select="item=>UserOb.schoolId = item" @change="getClass(item)" @semester-select="item2=>UserOb.semesterId = item2"></!-->
          <el-form-item label="学校:"  prop="shcoolId">
              <el-select v-model="UserOb.schoolId" @change="levelChange(UserOb.schoolId)" clearable placeholder="请选择学校">
                  <el-option v-for="(item,index) in SchoolSemesterList" :label="item.schoolName" :value="item.schoolId" :key="index" ></el-option>
              </el-select>
          </el-form-item>
          <!--  -->
          <el-form-item label="班级:"  prop="levelobj">
              <el-select v-model="UserOb.classId" placeholder="请选择班级" clearable>
                  <el-option v-for="(item,index) in level" :label="item.className" :value="item.classId" :key="index" ></el-option>
              </el-select>
          </el-form-item>
          <!--  -->
        </el-form-item>
        <el-form-item label="代理商：" prop="merchant">
          <el-input v-model="UserOb.merchant" :disabled="true" placeholder="请输入代理商：" maxlength="10" width="120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="searchActivity(UserOb.users)">激活用户</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div name="data">
      <el-table v-if="UserOb" :data="UserOb.users" style="width: 100%" :row-class-name="filterColumn">
        <el-table-column type="index" width="50">
        </el-table-column>
          <el-table-column v-for="(item,index) in user.columns" :key="index" :prop="item.prop" :label="item.label">
      </el-table-column>
      <el-table-column label="性别">
          <template slot-scope="{row}">
            {{row.gender | changGender}}
          </template>
      </el-table-column>
        <el-table-column  label="激活状态">
          <template  slot-scope="{row}">
            {{row.poa}}
          </template>
      </el-table-column>
      <el-table-column label="账户状态">
          <template slot-scope="{row}">
            {{row.mes}}
          </template>
      </el-table-column>
      <!-- <el-table-column label="调班">
          <template slot-scope="{row}">
            <el-button style="margin-left: 10px;" size="small" type="success" @click="changeClass(row)">调班</el-button>
            <el-dialog title="调班" :visible.sync="showChangeClass">
            <el-form :model="form">
              
              <el-form-item label="选择班级" >
                <el-input v-model="goClass"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="showChangeClass = false">取 消</el-button>
              <el-button type="primary" @click="commitChangeClass(row)">确 定</el-button>
            </div>
          </el-dialog>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>

import SchoolSemester from '@/components/Coms/SchoolSemester'
import Request from '@/common/request.js'
const uuidv4 = require('uuid/v4');

export default {
  data() {
    var semesterCheck = (rule, value, callback) => {
      if (this.UserOb.schoolId === '') {
        callback(new Error('选择学校'));
      } else if (this.UserOb.semesterId === '') {
        callback(new Error('选择班级！'));
      } else {
        callback();
      }
    };
    return {
      sequnum: 0,
      allList: '',
      level: '',
      // schoolId: '',
      SchoolSemesterList: '',
      //要调到这个班级
      goClass: '',
      showChangeClass: false,
      UserOb: {
          users: [],
          classId: '',
          schoolId: '',
       },
        user: {
          columns: [
            {
              prop: 'mobile',
              label: '用户手机号',
              width: 120
            },
            {
              prop: 'nickname',
              label: "昵称"
            },
            {
              prop: 'zhName',
              label: '中文名'
            },
            {
              prop: 'grade',
              label: '年级'
            },
            {
              prop: 'birthday',
              label: '生日'
            },
            {
              prop: 'contactName',
              label: '联系人姓名'
            },
            {
              prop: 'contactMobile',
              label: '联系手机号'
            },
            {
              prop: 'entityClass',
              label: '实体班'
            }
          ]
        },
        rules: {
          expireTime: [
            { required: true, message: '请输入过期时间', trigger: 'blur' }
          ],
          semester: [
            { validator: semesterCheck, required: true, trigger: 'blur' }
          ]
        }
       }
  },
  filters: {
    changGender(val) {
      if(val == 1) {
        return '男'
      }else{
        return '女'
      }
    }
  },
  created() {
    Request({
        url: 'school/tob/list',
        type: 'get'
      }).then(res => {
        if(res.code == '0000' ){
            this.SchoolSemesterList = res.data
        }
        })
  },
   components: { SchoolSemester, Request },
  watch: {
    'Userob.users': {
      handler (newvalue, oldvalue) {
        // alert(3)
      },
      // immediate: true,
      // deep: true
    }
  },
   methods: {
    //根据schoolid获取班级信息
    levelChange(val) {
        Request({
            url: '/class/list/for/school',
            type: 'post',
            data: {
                schoolId: val
            }
        }).then(res => {
            if(res.code == '0000' ){
                this.level = res.data
            }
            console.log(this.level)
        })
    },
    //提交调班的数据
    commitChangeClass(row) {
      // console.log('提交调班该同学的信息', this.selectStudent)
      Request({
        url: 'level/all/list',
        type: 'post',
        data: {
          studentInfo: this.selectStudent,
          class: this.goClass
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        if(res.code == '0000') {
          this.showChangeClass = false
          this.goClass = ''
        }
      })
    },
    //调班
    changeClass(row) {
      this.showChangeClass = true
      // console.log('调班', row)
      this.selectStudent = row
    },
    //查询用户激活
    searchActivity(val) {
        this.allList = this.UserOb.users
        
        // console.log(val[this.sequnum])
        let datas = {
          transId: uuidv4().replace(/[-]/g,""), //请求编号
          activateDayNum: '365',   // 激活时间 默认265
          classId: this.UserOb.classId,
          schoolId: this.UserOb.schoolId,
          ...val[this.sequnum]
          /**
           * nickname: val[this.sequnum].nickname,
           * mobile: val[this.sequnum].mobile,
           * zhName: val[this.sequnum].zhName,
           * gender: val[this.sequnum].gender,
           * grade: val[this.sequnum].grade,
           * birthday: val[this.sequnum].birthday,
           * contactName: val[this.sequnum].contactName,
           * contactMobile: val[this.sequnum].contactMobile,
           * entityClass: val[this.sequnum].entityClass,
           * contactMobile: val[this.sequnum].contactMobile,
           * contactMobile: val[this.sequnum].contactMobile,
          */
        }
        Request({
          url: '/class/activate/user',
          data: datas,
          type: 'post',
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
            if(this.sequnum < this.allList.length) {
              // alert(2)
              if(res.code == '0000') {
                val[this.sequnum].poa = '已激活'
                val[this.sequnum].mes = res.msg
                // Vue.set(val,[this.sequnum],val[this.sequnum].poa)
                // this.$message.success('激活成功')
              }else {
                val[this.sequnum].poa = '未激活'
                val[this.sequnum].mes = res.msg
                // this.$message.error(res.msg)
              }
              this.sequnum++
              if(this.sequnum == this.allList.length){
                return
              }
              console.log(this.sequnum, this.allList[this.sequnum])
              this.searchActivity(this.allList)
            }else {

            }
        })
        /** this.UserOb.users.forEach( item => {
          let datas = {
            transId: uuidv4().replace(/[-]/g,""), //请求编号
            activateDayNum: '365',   // 激活时间 默认265
            classId: this.UserOb.classId,
            schoolId: this.UserOb.schoolId,
            ...item 
          }
          Request({
              url: '/class/activate/user',
              data: datas,
              type: 'post',
              headers: {
                "Content-Type": "application/json"
              }
            }).then(res => {
              if (res.code == 0) {
                item.poa = '已激活'
                item.mes = res.msg
                this.$message.success('激活成功')
              } else {
                item.poa = '未激活'
                item.mes = res.msg
                this.$message.error(res.msg)
              }
            })
        });*/
    },

      submitUpload() {
        this.$refs.upload.submit();
      },
      pushData(response, file, fileList) {
        this.UserOb.users = response.data
      },
      filterColumn({ row, rowIndex }) {
        if (!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(row.mobile.trim()))) {
          return 'success-row'
        }
        if (row.gender != 1 && row.gender != 0) {
          return 'fail-fender'
        }
        return ''
      }
    }
}
</script> 

<style>
.el-table .success-row {
  background: rgb(238, 224, 27);
}
.el-table .fail-fender {
  /* background:  */
  text-decoration: line-through;
  background: rgb(24, 165, 201);
}
.el-table .reback-row {
  /* background:  */
  text-decoration: line-through;
}
</style>
