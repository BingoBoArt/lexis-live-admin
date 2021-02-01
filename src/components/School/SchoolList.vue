<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- block列表 -->
    <common-table :dataObject="dataObject">
      <el-table-column  prop="" label="充值" >
        <template slot-scope="scope">
           <!-- 充值 -->
          <el-button type="primary" size="mini" @click="showdialog(scope.row)">充值</el-button>
          <el-dialog title="充值" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="充值金额" >
                <el-input v-model.trim="amount">
                  <i class="price" slot="append">{{amount | moneyoriginal | nonan}}</i>
                </el-input>
              </el-form-item>
              <el-form-item label="赠送金额" >
                <el-input v-model.trim="giftAmount" autocomplete="off">
                  <i class="price" slot="append">{{giftAmount | moneyoriginal | nonan}}</i>
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="incharge(scope.row)">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
 <!-- 配置level权限 -->
      <el-table-column  prop="" label="配置level">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showlevel(scope.row)">配置</el-button>
          <el-dialog title="配置level权限" :visible.sync="levelPermissShow">
            <el-form :model="form">
              <!-- 选择level -->
              <el-form-item label="选择level" >
                <el-select v-model="levelPmissionSSS"  @change="getLevel(levelPmissionSSS)" placeholder="请选择level">
                    <el-option v-for="(item, index) in levelPmission"  :key="index" :label="item.title" :value="item.level"></el-option>
                </el-select>
              </el-form-item>
              <!-- 选择unit -->
              <el-form-item label="选择unit" >
                <el-select v-model="unitPmissionSSS" style="width: 100%" multiple placeholder="请选择unit">
                    <el-option v-for="(item, index) in unitPmission"  :key="index" :label="item.nameCh" :value="item.nameCh"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="levelPermissShow = false">取 消</el-button>
              <el-button type="primary" @click="commitpermissleve(scope.row)">确. 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </common-table>
  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
const uuidv4 = require('uuid/v4');
export default {
  data() {
    return {
      opqr: [],
      levelAndUnit: [
      ],
      unitPmissionSSS: [],
      unitPmission: '',
      levelPmissionSSS: '',
      levelPmission: '',
      inchargeschoolid: '',
      dialogFormVisible: false,
      levelPermissShow: false,
      giftAmount: '',
      amount: '',
      userId: '',
      show: false,
      dataObject: {
        isOfficial: 'isOfficial',
        index: false,
        dataKey: 'records',
        idKey: 'userId',
        searchUrl: 'school/list/page',
        editUrl: '/dashboard/School/SchoolEditor', //编辑页面名称
        searchParam: { nickname: '', 
                       email: '',
                       schoolName: '' ,
                       schoolId: ''
                      },
        columns: [
          {
            prop: 'schoolId',
            label: '学校编号'
          },
          {
            prop: 'schoolName',
            label: '学校名字'
          },
          {
            prop: 'schoolNum',
            label: "学校数量"
          },
          {
            prop: 'studentNum',
            label: '学生数量'
          }
        ]
      }
    }
  },
  
  mounted() {
    this.query()
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
  created() {
    
  },
  watch: {
    levelPermissShow(newvalue) {
      if(newvalue == false) {
        this.levelPmissionSSS = ''
          this.unitPmissionSSS = []
      }
    },
    levelPmissionSSS(newvalue, oldvalue) {
      this.levleChange('newvalue', newvalue,'oldvalue', oldvalue)
    },
    unitPmissionSSS(newvalue, oldvalue) {
      console.log('多选unit', newvalue)
      this.filterUnit(newvalue)
      console.log(this.levelAndUnit)
      this.deleunit(this.levelAndUnit)
      let opq = []
      this.levelAndUnit.forEach(item1 => {
        newvalue.forEach(item2 => {
          if(item1.nameCh == item2) {
            opq.push(item1)
          }
        })
      })
      this.opqr = opq
      console.log(101101010101, this.opqr)
    }
  },
  methods: {
    //改变level时添加到新的值中
    levleChange(newvalue) {
      console.log(newvalue)
    },
    //根据unit选出unit对应的对象
    filterUnit(newvalue) {
      newvalue.forEach(item1 => {
        this.unitPmission.forEach(item2 => {
          if(item1 == item2.nameCh) {
            this.levelAndUnit.push(item2)
          }
        })
      })
    },
    
    //根据level获取相应的unit
    getLevel(val) {
      console.log(10000003, val)
      Request({
        url: 'level/unit/list',
        type: 'post',
        data: {
          level: val
        }
      }).then(res => {
        this.unitPmission = res.data
        console.log(911111110, this.unitPmission)
      })
    },
    //显示配置level权限
    showlevel(row) {
      this.levelPermissShow = true
      this.inchargeschoolid = row.schoolId
      Request({
        url: 'level/all/list',
        type: 'get'
      }).then(res => {
        this.levelPmission = res.data
      })
      Request({
        url: '/school/levelunit/config',
        type: 'post',
        data: {
          schoolId: row.schoolId
        }
      }).then(res => {
        console.log(res.data.units)
        let fina = res.data.units
        fina.forEach(item => {
          this.unitPmission = fina
          this.unitPmissionSSS.push(item.nameCh)
        })
      })
    },
    //this.levelAndUnit最后得到的数组去重
    deleunit(person) {
      let obj = {}
      let peon = person.reduce((cur,next) => {
          obj[next.nameCh] ? "" : obj[next.nameCh] = true && cur.push(next);
          return cur;
      },[])
      this.levelAndUnit = peon
      // console.log('去重后的数组', peon);
    },
    //提交编辑好的level权限
    commitpermissleve(row) {
      this.levelPermissShow = false
      // this.deleunit(this.levelAndUnit)
      Request({
        url: '/school/edit/levelunit',
        type: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
             schoolId: this.inchargeschoolid,
             levelAndUnit: this.opqr
        }
      }).then(res => {
        if(res.code == '0000'){
          this.levelPmissionSSS = ''
          this.unitPmissionSSS = []
        }
      })
    },
    //显示出充值弹框
    showdialog(row) {
      console.log('showdialogr', row)
      this.inchargeschoolid = row.schoolId
      this.dialogFormVisible = true
      console.log(this.inchargeschoolid)
    },
    //充值
    incharge(row) { 
      this.dialogFormVisible = false
      Request({
        url: '/school/recharge',
        type: 'post',
        data: {
          transId: uuidv4().replace(/[-]/g,""), //请求编号
          schoolId: this.inchargeschoolid, // 学校编号
          amount: this.amount,       //充值金额
          giftAmount: this.giftAmount  //赠送金额
        }
      }).then(res => {
        if(res.code == '0000') {
          this.$message({
          type: 'success',
          message: '充值成功',
          showClose: true
        })
        return;
        }
      })
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
    editDateTow(row) {
      let url = '/dashboard/library/Config/AddConfig'
      // 页面跳转
      this.$router.push({ path: url, query: { [this.dataObject.idKey]: row[this.dataObject.idKey] } })
      // this.$router.push({ name: 'Example/Add', query: { id: row.id } })
    },
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
<style rel="stylesheet/scss" lang="scss" scoped>
.price {
  color: red
}

</style>