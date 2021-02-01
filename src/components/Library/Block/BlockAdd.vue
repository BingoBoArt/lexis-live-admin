<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 查询列表 -->
    <el-row style="margin-bottom: 10px">
      <block-select v-model="selectItem" :disabled="this.$route.query.blockNo"></block-select>
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back btn">返回</el-button>
    </el-row>
    <!-- add列表 -->
    <el-form ref="blockForm" :rules="rules" :model="blockForm" label-width="120px">
      <el-form-item label="Block编号" prop="blockNoName">
        <el-input v-model="blockForm.blockNoName"></el-input>
      </el-form-item>
      <el-form-item label="Block目标标题" prop="targetTitle">
        <el-input v-model="blockForm.targetTitle" placeholder="Block教学目标标题"></el-input>
      </el-form-item>
      <el-form-item label="Block目标内容" prop="targetText">
        <el-input type="textarea" min="2" v-model="blockForm.targetText" placeholder="Block教学目标详细内容"></el-input>
      </el-form-item>
      <el-form-item label="BlockIcon:">
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="handleUpload">
          <img v-if="blockForm.imgUrl" :src="blockForm.imgUrl" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-button @click="submitBlock('update')" v-if="this.$route.query.blockNo">修改</el-button>
    <el-button @click="submitBlock('add')" v-else>新增</el-button>
    <!-- 分页 -->
  </div>
</template>
<script>
import BlockSelect from '@/components/Library/Block/BlockSelect'
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      selectItem: { level: '', unitId: '', deep: 2 },
      blockForm: { imgUrl: '', targetTitle: '教学目标'},
      rules: {
        blockNoName: [{ required: true, message: '请输入blockNoName', trigger: 'blur' }],
        targetTitle: [{ required: true, message: '请输入targetTitle', trigger: 'blur' }],
        targetText: [{ required: true, message: '请输入targetText', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    let blockNo = this.$route.query.blockNo || null
    if (blockNo) {
      Request({
        url: 'block/getBlockById?' + 'blockNo=' + blockNo,
        type: 'get'
      }).then(res => {
        this.blockForm = res.data
        this.selectItem.level = res.data.level
        this.selectItem.unitId = res.data.unitId
        if (res.data.targetText) {
          this.blockForm.targetText = res.data.targetText.replace(/\\n/g, "\n")
        }
      })
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    beforeAvatarUpload(file) {
      // console.log(111)
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      /* const isSize = new Promise(function (resolve, reject) {
          let width = 60;
          let height = 60;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function () {
              let valid = img.width == width && img.height == height;
              valid ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
      }).then(() => {
          return file;
      }, () => {
          this.$message.error('上传的icon必须是等于60*60!');
          return Promise.reject();
      }); */
      return isJPG && isLt2M;
    },
    /* 上传内容 */
    handleUpload(val) {
      let formdata = new FormData();
      let that = this
      formdata.append('file', val.file);
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          that.blockForm.imgUrl = res.data.httpUrl
          this.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      })
    },
    submitBlock(val) {
      this.$refs['blockForm'].validate((valid) => {
        if (valid) {
          if (val == 'add') {
            this.submitBlockAdd()
          } else if (val == 'update') {
            this.submitBlockUpdate()
          }
        }
      })
    },
    submitBlockAdd() {
      let data = {
        ...this.blockForm,
        ...this.selectItem
      }
      data.targetCh = this.blockForm.blockNoName
      Request({
        url: 'block/addBlock',
        data: data,
        type: 'post'
      }).then(res => {
        if (res.code != '0000') {
          this.$message({
            type: 'error',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: "增加成功"
          })
        }
      })
    },
    submitBlockUpdate() {
      let data = {
        ...this.blockForm,
        ...this.selectItem
      }
      // console.log(data)
      Request({
        url: 'block/updateBlock',
        data: data,
        type: 'post'
      }).then(res => {
        if (res.code != '0000') {
          this.$message({
            type: 'error',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: "修改成功"
          })
        }
      })
    }
  },
  components: {
    BlockSelect,
    CommonTable,
    Breadcrumb,
    Request
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
