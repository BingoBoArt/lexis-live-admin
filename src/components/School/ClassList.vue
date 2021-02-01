<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 搜索 -->
    <el-form v-model="unit" style="margin-left: 20Px" inline>
      <el-form-item label="师生比:">
        <el-select @change="updateSelect" v-model="dataObject.searchParam.studentRatio" ref="studentRatio" clearable placeholder="选择师生比" width="120px">
          <el-option v-for="item in studentRatio" :key="item.studentRatio" :value="item.studentRatio">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付费类型:">
        <el-select @change="updateSelect" v-model="dataObject.searchParam.payType" ref="payType" clearable placeholder="选择付费类型">
          <el-option v-for="item in payType" :key="item.payType" :label="item.payType" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="校区:">
        <el-select @change="updateSelect" v-model="dataObject.searchParam.schoolId" ref="schoolId" clearable placeholder="选择校区">
          <el-option v-for="item in schoolId" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- block列表 -->
    <common-table :dataObject="dataObject">
      <el-table-column prop="" label="获取班级列表">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="getClassDetial(scope.row)">详细信息</el-button>
        </template>
      </el-table-column>
    </common-table>
  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  created() {
    Request({
        url: 'school/tob/list',
        type: 'get'
      }).then(res => {
        if(res.code == '0000' ){
            this.schoolId = res.data
        }
        })
  },
  data() {
    return {
      payType: [{payType: '付费', value: 1}, {payType: '免费', value: 2}],
      studentRatio: [{studentRatio: '12'}, {studentRatio: '25'}],
      schoolId: [],
      //
      userId: '',
      show: false,
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
            prop: 'className',
            label: '班级名称'
          },
          {
            prop: 'studentRatio',
            label: '师生比'
          }
        ]
      }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    getClassDetial(row) {
      console.log(1001111, row)
      // let datas = {
      //   classId: row.classId
      // }
      // Request({
      //   url: '/class/user/list',
      //   type: 'post',
      //   data: datas
      // }).then(res => {
      //   console.log(res)
        let url = '/dashboard/School/SchoolUserExcelSearch'
        this.$router.push({ path: url, query: { classId: row.classId }})
      // })
    },
    //删除按钮
    handleDelete(row) {
      Request({
        url: '/delLevel',
        type: 'post',
        data: {
          levelId: row.levelId,
        }
      }).then(res => {
        if(res.code == '0000') {
          
        }
      })
    },
    // editDateTow(row) {
    //   let url = '/dashboard/School/ClassEditor'
    //   // 页面跳转
    //   this.$router.push({ path: url, query: { [this.dataObject.idKey]: row[this.dataObject.idKey] } })
    //   // this.$router.push({ name: 'Example/Add', query: { id: row.id } })
    // },
    query() {
      let data = { position: this.dataObject.searchParam.position, status: this.dataObject.searchParam.status }
      this.dataObject.searchParam = data
    }
  },
  components: {
    CommonTable,
    Breadcrumb,
  }
}
</script>
