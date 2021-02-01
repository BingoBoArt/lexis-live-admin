<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-row style="margin-bottom: 10px">
      <block-select v-model="selectItem" :disabled="this.$route.query.userId"></block-select>
      <el-button v-if="this.$route.query.userId" type="primary" @click="goBack" icon="el-icon-arrow-left" class="back btn">返回</el-button>
    </el-row>
    <!-- 增加老师 -->
    <el-form name="teacherLive" label-width="120px" ref="teacherForm" :model="teacher" :rules="rules">
      <el-form-item v-model="teacher" label="昵称：" prop="nickname">
        <el-input v-model="teacher.nickname"></el-input>
      </el-form-item>
      <!-- 增加学校 -->
      <el-form-item label="学校：" prop="channel">
        <el-select v-model="teacher.schoolId" clearable placeholder="请选择学校">
          <el-option v-for="(item,index) in SchoolSemesterList" :label="item.name" :value="item.schoolId" :key="index" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="teacher.email"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="!this.$route.query.userId">
        <el-input v-model="teacher.password"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-radio v-model="teacher.gender" :label="1">男</el-radio>
        <el-radio v-model="teacher.gender" :label="0">女</el-radio>
      </el-form-item>
      <el-form-item label="国家：" prop="country">
        <el-select v-model="teacher.country" placeholder="请选择国家">
          <el-option v-for="(country,index) in countrys" :key="index" :label="country.label" :value="country.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="等级：" prop="level">
        <el-select v-model="teacher.level" placeholder="请选择等级">
          <el-option v-for="(level,index) in levels" :key="index" :label="level.label" :value="level.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="头像：" prop="imgUrl">
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="handleUpload">
          <img v-if="teacher.imgUrl" :src="teacher.imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>(300*300)</span>
      </el-form-item>
      <el-form-item label="封面：" prop="coverImgUrl">
        <div v-for="(item,index) in teacher.coverImgUrl" :key="index" class="coverImgDiv">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :data="index" :http-request="handleUploadCover">
            <img v-if="teacher.coverImgUrl[index]" @click="coverImgUrlIndex = index" :src="teacher.coverImgUrl[index]" class="avatar">
            <i v-else @click="coverImgUrlIndex = index" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span v-if="index == 0">(1030*583)(默认)</span>
          <span v-else>(1030*583)</span>
        </div>
        <div>
          <el-button @click="addCoverImg">add</el-button>
          <el-button @click="deleteCoverImg">delete</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitTeacher" v-if="!this.$route.query.userId">新增</el-button>
        <el-button @click="submitTeacher('update')" v-else>修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      coverImgUrlIndex: '',
      SchoolSemesterList: {},
      schools: [{ label: 'lexislive', value: '1' }, { label: 'boshi', value: '2' }, { label: '智博汇晶', value: '3' }],
      teacher: { imgUrl: '', coverImgUrl: [""], country: 'zh', gender: 1, schoolId: "",schoolName: "" },
      countrys: [{ label: '中国', value: 'zh' }, { label: '美国', value: 'us' }, { label: '澳大利亚', value: 'au' }, { label: '英国', value: 'uk' }, { label: '意大利', value: 'ita' }],
      levels: [{ label: '一级', value: '1' }, { label: '二级', value: '2' }, { label: '三级', value: '3' }, { label: '四级', value: '4' }, { label: '五级', value: '5' }],
      rules: {
        'nickname': [{ required: true, trigger: 'blur' }],
        'mobile': [{ required: true, trigger: 'blur' }],
        'email': [{ required: true, trigger: 'blur' }],
        'password': [{ required: true, trigger: 'blur' }],
        'gender': [{ required: true, trigger: 'blur' }],
        'country': [{ required: true, trigger: 'blur' }],
        'schoolId': [{ required: true, trigger: 'blur' }],
        'imgUrl': [{ required: true, trigger: 'blur' }],
        'level': [{ required: true, trigger: 'blur' }],
        'coverImgUrl': [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    let userId = this.$route.query.userId || null
    let schoolId = this.$route.query.schoolId || null
    if (userId) {
      Request({
        url: 'user/getLiveTeacherById',
        type: 'post',
        data: { userId: userId, schoolId: schoolId }
      }).then(res => {
        this.teacher = res.data
      })
    }
    Request({
      url: 'schedule/school/semester',
      type: 'get'
    }).then(res => {
      if(res.code == 0 ){
        this.SchoolSemesterList = res.data
      }
    })
  },
  watch: {
    '$route.query.userId': {
      handler: function (val) {
        if(!val){
          this.teacher = { imgUrl: '', coverImgUrl: [""], country: 'zh', gender: 1 }
        }
      },
      deep: true
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.split("/").shift() === 'image';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    /* 上传内容 */
    handleUpload(val) {
      let formdata = new FormData();
      formdata.append('file', val.file);
      formdata.append('path', 'user/img/');
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          this.teacher.imgUrl = res.data.httpUrl
          this.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      })
    },
    handleUploadCover(val) {
      let formdata = new FormData();
      formdata.append('file', val.file);
      formdata.append('path', 'user/img/');
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          // this.teacher.coverImgUrl = res.data.httpUrl
          this.$set(this.teacher.coverImgUrl, this.coverImgUrlIndex, res.data.httpUrl)
          this.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      })
    },
    submitTeacher(type) {
      this.$refs['teacherForm'].validate((val) => {
        if (val) {
          // console.log(this.teacher)
          let data = { ...this.teacher }
          let url
          if (type == 'update') {
            url = 'user/updateLiveTeacher'
            // this.changeSchoolId(data)
          } else {
            url = 'user/addLiveTeacher'
            // this.changeSchoolId(data)
          }
          Request({
            type: 'post',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: data
          }).then(res => {
            if (res.code == 0) {
              this.$message.success('提交成功')
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          this.$message.error('校验未通过')
        }
      })
    },
    // 新增覆盖面图片
    addCoverImg() {
      let max = 3;
      if (this.teacher.coverImgUrl.length >= max + 1) {
        this.$message.error("备用封面超过上限" + max)
      } else {
        this.teacher.coverImgUrl.push("")
      }
    },
    deleteCoverImg() {
      if (this.teacher.coverImgUrl.length <= 1) {
        this.$message.error("至少有一个默认 封面")
      } else {
        this.teacher.coverImgUrl.pop()
      }
    }
  },
  components: {
    Breadcrumb,
    'button-counter': {
      data: function () {
        return {
          count: 0
        }
      },
      template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
    }
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
  width: 178px;
  height: 178px;
  display: block;
}
.videoSize {
  width: 240px;
  height: 120px;
}
.coverImgDiv {
  display: inline-block;
  margin-right: 20px;
}
</style>
