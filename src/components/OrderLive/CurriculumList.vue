<template>
  <div>
    <breadcrumb></breadcrumb>
    <div name="select">
      <el-form v-model="CurriculumObject.searchParam" inline>
        <el-form-item label="批次：">
          <el-select v-model="CurriculumObject.searchParam.batch" placeholder="请选择批次" clearable="true">
            <el-option v-for="(item,index) in batchList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间线：">
          <el-input v-model="CurriculumObject.searchParam.semester" placeholder="请输入时间线" clearable="true" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="betweenTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="onShelf()" type="success" icon="el-icon-edit">上架</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <common-table :dataObject="CurriculumObject">
        <el-table-column label="状态" width="90px" align="centont">
          <template slot-scope="{row}">
            <el-button v-if="row.status == 1" size="mini" disabled type="success">已上架 </el-button>
            <el-button v-else size="mini" disabled type="warning">灰度</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="{row}">
            <el-button v-if="row.status == 1" @click="unShelf(row.curriculumId)" type="success" size="mini" icon="el-icon-edit">下架</el-button>
            <el-button v-if="row.status == 2" @click="getCurriculum(row.curriculumId), dialogVisible=true" type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </template>
        </el-table-column>
      </common-table>
    </div>
    <div name="dialog">
      <el-dialog title="请对数据进行修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <!-- <span>请对数据进行修改</span> -->
        <el-form label-position="right" label-width="80px">
          <el-form-item v-for="(item,index) in CurriculumObject.columns" :key="index" :label="item.label+':'">
            <el-input :disabled="(CurriculumObject.columns.length === index+1 || index === 0 )?true:false" v-model="Curriculum[item.prop]" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateCurriculum()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import CommonTable from '@/components/Coms/CommonTable'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      Curriculum: {},
      betweenTime: [],
      curriculumId: '',
      batchList: [],
      dialogVisible: false,
      CurriculumObject: {
        dataKey: 'records',
        idKey: 'curriculumId',
        searchUrl: 'curriculum/getCurriculumList',
        // editUrl: '/dashboard/Orderlive/Add', //编辑页面名称
        searchParam: {},
        columns: [
          {
            prop: 'batch',
            label: '批次',
            width: 120
          },
          {
            prop: 'unitTitleEn',
            label: '单元名称',
            width: 120
          },
          {
            prop: 'lessonTitleEn',
            label: '课件名称'
          },
          {
            prop: 'recommend',
            label: '课程简介'
          },
          {
            prop: 'startTime',
            label: '开始时间',
            width: 160
          },
          {
            prop: 'endTime',
            label: '结束时间',
            width: 160
          },
          {
            prop: 'level',
            label: '等级',
            width: 80
          },
          {
            prop: 'semester',
            label: '时间线',
            width: 80
          }
        ]
      }
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    betweenTime: function () {
      if (this.betweenTime) {
        this.$set(this.CurriculumObject.searchParam, 'startTime', this.betweenTime[0])
        this.$set(this.CurriculumObject.searchParam, 'endTime', this.betweenTime[1])
      } else {
        this.$set(this.CurriculumObject.searchParam, 'startTime', "")
        this.$set(this.CurriculumObject.searchParam, 'endTime', "")
      }
    }
  },
  methods: {
    init() {
      // 初始化批次列表
      let url = 'curriculum/batch'
      Request({
        url: url,
        type: 'post',
        data: null
      }).then(res => {
        this.batchList = res.data
      })
    },
    getCurriculum(id) {
      this.curriculumId = id
      Request({
        url: 'curriculum/getCurriculumById',
        type: 'post',
        data: { curriculumId: id }
      }).then(res => {
        if (res.code == 0) {
          this.Curriculum = res.data
        }
      })
    },
    updateCurriculum() {
      this.$confirm('是否要修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url: 'curriculum/updateCurriculum',
          type: "post",
          data: this.Curriculum
        }).then(res => {
          this.dialogVisible = false
          if (res.code == 0) {
            this.$message.success("更新成功")
            this.query()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    onShelf() {
      this.$confirm('是否要上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url: 'curriculum/onShelf',
          type: 'post',
          data: { batch: this.CurriculumObject.searchParam.batch }
        }).then(res => {
          if (res.code == 0) {
            this.$message.success("上架成功")
            this.query()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    unShelf(id) {
      this.$confirm('是否要下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url: 'curriculum/unShelf',
          type: 'post',
          data: { curriculumId: id }
        }).then(res => {
          if (res.code == 0) {
            this.$message.success("下架成功")
            this.query()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    query() {
      this.CurriculumObject.searchParam = { ...this.CurriculumObject.searchParam }
    }
  },
  components: {
    CommonTable,
    Request,
    Breadcrumb
  }
}
</script>
