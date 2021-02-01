<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
    <el-form v-model="unit" style="margin-left: 20Px" inline>
      <el-form-item label="手机号:">
        <el-input v-model="telephone"></el-input>
      </el-form-item>
      <el-form-item label="昵称:">
        <el-input v-model="nickname"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="searchStudent()" type="primary" size="mini" icon="el-icon-search">搜索学生</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="redat" border >
      <el-table-column label="代理商">
        <template slot-scope="{row}">
          {{row.agentId | changeagentId}}
        </template>
      </el-table-column>
    <el-table-column :prop="column.prop" :label="column.label" v-for="(column,index) in columns" :key="index">
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="{row}">
          {{row.gender | changegender}}
        </template>
      </el-table-column>

      <el-table-column label="退款">
          <template slot-scope="{row}">
            <el-button style="margin-left: 10px;" size="small" type="success" @click="refund(row)">退款</el-button>
            <el-dialog  title="退款" :visible.sync="showChangeClass">
            <el-table border :data="forms">
              <el-table-column property="balance" label="当前余额" ></el-table-column>
              <el-table-column property="discountAmount" label="补齐折扣金额" ></el-table-column>
              <el-table-column property="refundAmount" label="可退金额"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="showChangeClass = false">取消</el-button>
              <el-button type="primary"  :disabled="cansure" @click="sureRefund(row)">确认退款</el-button>
            </div>
          </el-dialog>
          </template>
        </el-table-column>

  </el-table>
  <div class="page-box">
      <el-pagination @current-change="handlePageChange" layout="total, prev, pager, next, jumper" :page-size="page.rows" :total="page.totalResultSize" :current-page="page.page" background>
      </el-pagination>
    </div>
  </div>
  
</template>

<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
const uuidv4 = require('uuid/v4');
  export default {
    data() {
      return {
        cansure: false,
        rowss: {},
        forms: [],
        showChangeClass: false,
        page: {
          rows: 10,
          page: 1,
          size: 10,
          current: 1,
          count: '',
          totalResultSize: ''
        },
        telephone: '',
        nickname: '',
        redat: [],
        columns: [
          {
            prop: 'birthday',
            label: '生日'
          },
          {
            prop: 'nickname',
            label: '英文名'
          },
          {
            prop: 'entityClass',
            label: '线下实体班'
          },
          {
            prop: 'grade',
            label: '年级'
          },
          {
            prop: 'mobile',
            label: '电话'
          }
        ]
      }
    },
    methods: {
      //退款
      refund(row) {
        this.showChangeClass = true

        this.rowss = {...row}
        Request({
          url: '/class/user/refund/trial',
          type: 'post',
          data: {
            ...row,
            transId: uuidv4().replace(/[-]/g,""), //请求编号
          }
        }).then(res => {
          console.log(res)
          this.forms = [{
            // ...res.data
            balance: res.data.balance/100,
            discountAmount: res.data.discountAmount/100,
            refundAmount: res.data.refundAmount/100
          }]
          if(res.data.refundAmount <= 0) {
            this.cansure = true
          }else{
            this.cansure = false
          }
        })
      },
      //确认扣款
      sureRefund(row) {
        this.cansure = true
        // console.log(row)
        Request({
          url: '/class/user/refund',
          type: 'post',
          data: {
            ...this.rowss,
            transId: uuidv4().replace(/[-]/g,""), //请求编号
          }
        }).then(res => {
          this.showChangeClass = false
          this.cansure = true
          let dats = {
            classId: this.$route.query.classId
          }
          this.findStudents(dats)
        })
      },
      //
      searchStudent() {
        let dats = {
          classId: this.$route.query.classId,
          nickname: this.nickname,
          mobile: this.telephone,
          page: this.page.page,
          rows: this.page.rows
        }
        this.findStudents(dats)
      },
      findStudents(dat) {
        Request({
        url: '/class/user/list',
        type: 'post',
        data: dat
      }).then(res => {
        this.redat = res.data.data
        this.page.count = res.data.totalPage
        this.page.totalResultSize = res.data.totalResultSize
      })
      },
      handlePageChange(val) {
        this.page.page = val
        this.searchStudent()
      },
      goBack() {
        this.$router.go(-1)
      },
    },
    created() {
      let datas = {
        classId: this.$route.query.classId || 76
      }
      this.findStudents(datas)
    },
    filters: {
      changegender(val) {
        if(val == 1) {
          return '男'
        }else {
          return '女'
        }
      },
      changeagentId(val) {
        if(val == 1) {
          return '博识'
        }else {
          return ''
        }
      }
    },
    components: {
      Breadcrumb,
      Request
    }
  }
</script>