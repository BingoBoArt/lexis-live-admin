<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 查询列表 -->
    <el-form label-width="130" inline>
      <el-form-item label="请输入老师名称：">
        <el-input v-model="dataObject.searchParam.nickname"></el-input>
      </el-form-item>
      
      <el-form-item label="请输入学校：">
        <el-select v-model="dataObject.searchParam.schoolId">
          <el-option v-for="(item,index) in SchoolSemesterList" :label="item.name" :value="item.schoolId" :key="index" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请输入老师邮箱：">
        <el-input v-model="dataObject.searchParam.email"></el-input>
      </el-form-item>
      <el-button @click="addTeacher">新增老师</el-button>
      
    </el-form>
    <!-- block列表 -->
    <common-table :dataObject="dataObject">
      <el-table-column prop="" label="Active" :width="100">
        <template slot-scope="{row}">
          <el-button @click="show = true,userId = row.userId">open</el-button>
        </template>
      </el-table-column>
    </common-table>
    <active :show.sync="show" :userId="userId"></active>

    <!-- 分页 -->
  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
import Active from './Active'
export default {
  data() {
    return {
      SchoolSemesterList: {},
      mp3Url: '',
      userId: '',
      show: false,
      dataObject: {
        index: false,
        dataKey: 'records',
        idKey: 'userId',
        searchUrl: 'user/getLiveTeacher',
        editUrl: '/dashboard/Teacher/AddTeacher', //编辑页面名称
        searchParam: { nickname: '', 
                       email: '',
                       schoolName: '' ,
                       schoolId: ''
                      },
        columns: [
          {
            prop: 'nickname',
            label: '姓名'
          },
          {
            prop: 'level',
            label: '等级'
          },
          {
            prop: 'email',
            label: '邮箱'
          },
          {
            prop: 'country',
            label: '国家'
          },
          {
            prop: 'schoolName',
            label: '学校'
          }
        ]
      }
    }
  },
  created(){
    // console.log(666)
    Request({
      url: 'schedule/school/semester',
      type: 'get'
    }).then(res => {
      if(res.code == 0 ){
        this.SchoolSemesterList = res.data
      }
    })
  },
  mounted() {
    this.query()
  },
  methods: {
    addTeacher() {
      this.$router.push({ path: '/dashboard/Teacher/AddTeacher', query: { ...this.dataObject.searchParam } })
    },
    editDateTow(row) {
      let url = '/dashboard/library/Config/AddConfig'
      // 页面跳转
      this.$router.push({ path: url, query: { [this.dataObject.idKey]: row[this.dataObject.idKey] } })
      // this.$router.push({ name: 'Example/Add', query: { id: row.id } })
    },
    query() {
      let data = { position: this.dataObject.searchParam.position, status: this.dataObject.searchParam.status }
      this.dataObject.searchParam = data
    },
    beginUpload(val) {
      // console.log(val)
      let formdata = new FormData();
      formdata.append('file', val.file);
      formdata.append('path', 'resource/audio/');
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          this.mp3Url = res.data.httpUrl
          this.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      })
    },
    begin() {
      let _audio = document.getElementById("audio")
      // console.log('audio', _audio);
      _audio.load();
    },
    showTime(){
      let _audio = document.getElementById("audio")
      var time = _audio.duration;
      // console.log("时间", time)
    },
    checkOpsition(val) {
      return val >= 18;
    }
  },
  components: {
    CommonTable,
    Breadcrumb,
    Active
  }
}
</script>
