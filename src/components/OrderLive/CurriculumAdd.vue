<template>
  <div>
    <breadcrumb></breadcrumb>
    <div name="top">
      <el-form inline>
        <el-form-item>
          <el-upload class="upload-demo" ref="upload" action="/jidaadm/curriculum/getCurriculumExcelList" 
            :on-preview="handlePreview" 
            :on-remove="handleRemove" 
            :file-list="fileList" 
            :auto-upload="false" 
            :on-success="pushData">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="批次：">
          <el-input v-model="batch" placeholder="请输入批次" maxlength="10" width="120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div name="data">
      <el-table v-if="resultList" :data="resultList" style="width: 100%">
        <el-table-column v-for="(item,index) in CurriculumObject.columns" :key="index" :prop="item.prop" :label="item.label">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope}} -->
            <el-button @click="editCurriculum(scope.$index)" type="primary" size="mini" icon="el-icon-edit">editCurriculum</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div name="dialog">
      <el-dialog title="请对数据进行修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <!-- <span>请对数据进行修改</span> -->
        <el-form label-position="right" label-width="80px">
          <el-form-item v-for="(item,index) in CurriculumObject.columns" :key="index" :label="item.label+':'">
            <el-input :disabled="CurriculumObject.columns.length === index+1?true:false" v-model="curriculum[item.prop]" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false, updateCurriculum">确 定</el-button>
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
      dialogVisible: false,
      index: '',
      batch: '',
      resultList: [],
      curriculum: {},
      CurriculumObject: {
        dataKey: 'data',
        idKey: 'curriculumId',
        // searchUrl: 'orderlive/orderList',
        // editUrl: '/dashboard/Orderlive/Add', //编辑页面名称
        searchParam: {},
        columns: [
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
  components: {
    CommonTable, Request, Breadcrumb
  },
  created() {
      // console.log(123456789)
  },
  methods: {
    
    submitSave() {
      if (!this.batch) {
        this.$message.error('批次不能为空')
      }
      Request({
        url: 'curriculum/addCurriculumList',
        data: { batch: this.batch, curriculumScheduleList: this.resultList },
        type: 'post',
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.code == 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    pushData(response, file, fileList) {
      this.resultList = response.data
    },
    editCurriculum(index) {
      // console.log(index)
      this.index = index
      this.curriculum = this.resultList[index]
      this.dialogVisible = true
    },
    updateCurriculum() {
      // console.log("新增开始")
      this.$set(this.resultList, this.index, this.curriculum)
    }
  }
}
</script>

