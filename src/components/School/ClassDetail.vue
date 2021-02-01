<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-form inline :model="UserOb">
      <el-row>
        <el-form-item prop="semester">
          <el-form-item label="学./校:"  prop="shcoolId">
              <el-select v-model="schoolId" @change="levelChange(schoolId)" clearable placeholder="请选择学校">
                  <el-option v-for="(item,index) in SchoolSemesterList" :label="item.schoolName" :value="item.schoolId" :key="index" ></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="班级:"  prop="levelobj">
              <el-select v-model="classId" placeholder="请选择班级" clearable>
                  <el-option v-for="(item,index) in level" :label="item.className" :value="item.classId" :key="index" ></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="电话号码:"  prop="telnum">
              <el-input v-model.trim="telNum" placeholder="输入手机号"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitSave">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    
    <common-table :dataObject="dataObject">
      
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
    </common-table>
  </div>
</template>

<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      UserOb: '',
      telNum: '',
      classId: '',
      level:'',
      SchoolSemesterList: '',
      schoolId: '',
      //要调到这个班级
      goClass: '',
      // showChangeClass: true,
      dataObject: {
        levelInfo: 'levelInfo',
        originalPrice: 'originalPrice',
        discountPrice: 'discountPrice',
        scheduleSemester: 'scheduleSemester',
        payType: 'payType',
        index: false,
        dataKey: 'classlist',
        idKey: 'userId',
        searchUrl: '/class/list',
        editUrl: '/dashboard/School/ClassEditor', //编辑页面名称
        searchParam: { 
            nickname: '', 
            email: '',
            schoolName: '' ,
            schoolId: ''
        },
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
    }),
    Request({
      url: '/class/user/list',
      type: 'post',
      data: {
        classId: this.$route.query.classId
      }
    }).then(res => {
      console.log('班级信息', res)
      this.dataObject = res.data.data
      console.log(this.dataObject)
    })
  },
  methods: {
    getClassDetial(val) {
    },
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
    levelChange(val){
      console.log(val)
    },
    //提交调班的数据
    commitChangeClass(row) {
      console.log('提交调班该同学的信息', this.selectStudent)
      //这个接口暂时没有，侯哥周一给我
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
      console.log('调班', row)
      this.selectStudent = row
    },
  },
   components: { 
      Request,
      CommonTable,
      Breadcrumb,  
   },
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
