<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-row style="margin-bottom: 10px" v-if="this.$route.query.bannerId">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back btn">返回</el-button>
    </el-row>
    <div>
      <!-- imgurl,type, href -->
      <el-form label-width="100px" ref="form1000" :rules="rules1000" :model="banner">
        <el-form-item label="img:" prop="imgUrl">
          <!-- 上传 -->
          <div>
            <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="handleUpload">
              <img v-if="banner.imgUrl" :src="banner.imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            （900*518）
          </div>
        </el-form-item>
        <el-form-item label="type:" prop="type">
          <el-select v-model.trim="banner.type">
            <el-option v-for="(type, index) in types" :key="index" :value="type.value" :label="type.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="href:" prop="href" v-if="banner.type!='Void'">
          <el-input v-model.trim="banner.href"></el-input>
        </el-form-item>
        <el-form-item label="text:" prop="text">
          <el-input v-model.trim="banner.text" placeholder="建议输入13个字符"></el-input>
        </el-form-item>
        <el-form-item label="Device" prop="device">
          <el-checkbox-group v-model="banner.device" min="1">
            <el-checkbox v-for="device in devices" :label="device" :key="device">{{device}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="remark:">
          <el-input v-model.trim="banner.remark"></el-input>
        </el-form-item>
        <el-form-item label="seq:" v-show="true">
          <el-input v-model.number="banner.seq"></el-input>
        </el-form-item>
        <el-form-item label="开始时间:">
          <el-date-picker v-model="banner.startTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间:">
          <el-date-picker v-model="banner.expireTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="组名称：" prop="groupName" v-if="!this.$route.query.bannerId">
          <el-input v-model.trim="banner.groupName"></el-input>
        </el-form-item>
        <el-form-item v-else label="组名称：" >
            <p>{{banner.groupName?banner.groupName:''}}</p>
          </el-form-item>
        <el-form-item label="请选择班级:" v-if="!this.$route.query.bannerId">
          <MyTransfer :dataList="schoolSemesterList" @result-list=" item=> this.schoolSemesterSelectList = item"></MyTransfer>
        </el-form-item>
        <el-form-item v-else label="班级为：">
          <p>{{banner.schoolSemesterList?banner.schoolSemesterList[0].name:''}}</p>
        </el-form-item>
      </el-form>
      <el-button @click="submitBannerAdd(2)" v-if="this.$route.query.bannerId">修改</el-button>
      <el-button @click="submitBannerAdd(1)" v-else>新增</el-button>
    </div>
  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import MyTransfer from '@/components/Coms/MyTransfer'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      schoolSemesterList: [],
      schoolSemesterSelectList: [],
      banner: { imgUrl: '', device: [] },
      rules1000: {
        "imgUrl": [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        "type": [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        "device": [{ required: true, message: '设备不能为空', trigger: 'blur' }],
        "groupName": [{ required: true, message: '组名不能为空', trigger: 'blur' }],
        "href": [{ required: true, message: '链接地址不能为空', trigger: 'blur' }]
      },
      devices: ['H5', 'ios', 'android'],
      types: [
        {
          value: 'H5',
          label: 'H5'
        },
        {
          value: 'Void',
          label: 'Void'
        }
      ]
    }
  },
  mounted() {
    let bannerId = this.$route.query.bannerId || null;
    // console.log(bannerId)
    if (bannerId) {
      Request({
        url: 'banner/getBannerById',
        type: 'post',
        data: { bannerId: bannerId }
      }).then(res => {
        if (res.code == 0) {
          this.unCompDate(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
    this.getSchoolSemesterList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 获取学校整体
    getSchoolSemesterList() {
      Request({
        url: 'schedule/school/semester',
        type: 'get'
      }).then(res => {
        if (res.code == 0) {
          this.schoolSemesterList = res.data
        }
      })
    },
    beforeAvatarUpload(file) {
      // console.log(22)
      const isJPG = file.type.split("/").shift() === 'image';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG && isLt2M);
    },
    /* 上传内容 */
    handleUpload(val) {
      // console.log(11)
      let formdata = new FormData();
      formdata.append('file', val.file);
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          this.banner.imgUrl = res.data.httpUrl
          this.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      })
    },
    submitBanner() {
      return this.valideForm('form1000')
    },
    compData() {
      let text = {}
      text = {
        type: this.banner.type,
        href: this.banner.href,
        device: this.banner.device,
        imgUrl: this.banner.imgUrl,
        text: this.banner.text
      }
      return {
        ...text,
        remark: this.banner.remark,
        seq: this.banner.seq, // 排序有用吗
        expireTime: this.banner.expireTime,
        startTime: this.banner.startTime,
        position: this.banner.position,
        schoolSemesterList: this.schoolSemesterSelectList,
        groupName: this.banner.groupName,
        bannerId: this.banner.bannerId ? this.banner.bannerId : null
      }
    },
    unCompDate(data) {
      this.banner = data
      if (this.banner.expireTime) {
        this.banner.expireTime = new Date(data.expireTime)
      }
      if (this.banner.startTime) {
        this.banner.startTime = new Date(data.startTime)
      }
    },
    valideForm(formName) {
      let bool
      this.$refs[formName].validate((valid) => {
        if (valid) {
          bool = true
        } else {
          bool = false
        }
      })
      return bool
    },
    submitBannerAdd(type) {
      if (!this.submitBanner()) {
        this.$message.error("校验未通过")
        return
      }
      let data = {
        ...this.compData()
      }
      let url;
      if (type === 1) {
        url = 'banner/addBanner'
      } else if (type === 2) {
        url = 'banner/updateBanner'
      }
      Request({
        url: url,
        data: data,
        headers: { 'Content-Type': 'application/json' },
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
            message: "操作成功"
          })
        }
      })
    }
  },
  components: {
    CommonTable, Breadcrumb, Request, MyTransfer
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 10px 80px;
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
  width: 450px;
  height: 240px;
  display: block;
}
.videoSize {
  width: 240px;
  height: 120px;
}
</style>
