<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-row style="margin-bottom: 10px" v-if="this.$route.query.configId">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back btn">返回</el-button>
    </el-row>
    <!-- 查询列表 -->
    <el-form ref="configFrom" :model="config" :rules="configRules" inline>
      <!-- <el-form-item prop="semester">
        <SchoolSemester @school-select="item=>config.schoolId = item" @semester-select="item2=>config.semesterId = item2"></SchoolSemester>
      </el-form-item> -->
      <el-form-item label="选择位置：" prop="position">
        <el-select v-model="config.position" :disabled="this.$route.query.id">
          <el-option v-for="(position, index) in positions" :key="index" :value="position.value" :label="position.label"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-form-item label="请上传资源：">
          <div v-if="config.position === 1000 || config.position === 1001 || config.position === 1003 ">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="handleUpload">
              <div v-if="config.position === 1000">
                <img v-if="config.imgUrl" :src="config.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
              <div v-if="config.position === 1003 || config.position === 1001 ">
                <video controls :src="config.videoUrl" v-if="config.videoUrl" class="videoSize">
                  <source :src="config.videoUrl" type="video/mp4">
                  <source :src="config.videoUrl" type="video/ogg">
                  <source :src="config.videoUrl" type="video/webm">
                  <object :data="config.videoUrl">
                    <embed :src="config.videoUrl">
                  </object>
                </video>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-row>
          <el-form-item label="组名称：" prop="groupName" v-if="!this.$route.query.configId">
            <el-input v-model.trim="config.groupName"></el-input>
          </el-form-item>
          <el-form-item v-else label="组名称：">
            <p>{{config.groupName?config.groupName:''}}</p>
          </el-form-item>
          <el-form-item label="请选择班级:" v-if="!this.$route.query.configId">
            <MyTransfer :dataList="schoolSemesterListData" @result-list=" item=> this.config.schoolSemesterList = item"></MyTransfer>
          </el-form-item>
          <el-form-item v-else label="班级为：">
            <p>{{config.schoolSemesterList?config.schoolSemesterList[0].name:''}}</p>
          </el-form-item>
        </el-row>
      </el-row>
    </el-form>

    <!-- Form开始 -->
    <!-- 1000 -->
    <div name="1000" v-if="config.position === 1000">
      <!-- imgurl,type, href -->
      <el-form :label-width="labelWidth" ref="form1000" :rules="rules1000" :model="config">
        <el-form-item label="type:" prop="type">
          <el-select v-model.trim="config.type">
            <el-option v-for="(type, index) in types" :key="index" :value="type.value" :label="type.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="href:" prop="href" v-if="config.type!='Void'">
          <el-input v-model.trim="config.href"></el-input>
        </el-form-item>
        <el-form-item label="Device" prop="device">
          <el-checkbox-group v-model="config.device" min="1" :disabled="this.$route.query.id">
            <el-checkbox v-for="device in devices" :label="device" :key="device">{{device}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 1001 启动页视频 -->
    <div name="1001" v-if="config.position === 1001">
      <el-form :label-width="labelWidth" ref="form1001" :rules="rules1001" :model="config">
        <!--  <el-form-item label="videoUrl:">
          <el-input v-model="config.videoUrl"></el-input>
        </el-form-item> -->
        <el-form-item label="Device:" prop="device">
          <el-checkbox-group v-model="config.device" min="1" :disabled="this.$route.query.id">
            <el-checkbox v-for="device in devices" :label="device" :key="device">{{device}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 1003 直播课随机视频-->
    <div name="1003" v-if="config.position === 1003">
      <el-form :label-width="labelWidth" ref="form1003" :rules="rules1003" :model="config">
        <!-- <el-form-item label="videoUrl:">
          <el-input v-model="config.videoUrl"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
    <!-- 1004 -->
    <div name="1004" v-if="config.position === 1004">
      <el-form :label-width="labelWidth" ref="form1004" :rules="rules1004" :model="config">
        <el-form-item label="title:" prop="title">
          <el-input v-model.trim="config.title"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 公共部分seq 和 remark 过期时间 -->
    <el-form :label-width="labelWidth">
      <el-form-item label="remark:" v-show="false">
        <el-input v-model.trim="config.remark"></el-input>
      </el-form-item>
      <el-form-item label="seq:" v-show="false">
        <el-input v-model="config.seq"></el-input>
      </el-form-item>
      <el-form-item label="失效时间:">
        <el-date-picker v-model="config.expireTime" type="datetime"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-button @click="submitConfigAdd" v-if="this.$route.query.configId">修改</el-button>
    <el-button @click="submitConfigAdd" v-else>新增</el-button>
  </div>
</template>
<script>
import SchoolSemester from '@/components/Coms/SchoolSemester'
import CommonTable from '@/components/Coms/CommonTable'
import MyTransfer from '@/components/Coms/MyTransfer'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    var semesterCheck = (rule, value, callback) => {
      if (this.config.schoolId === '') {
        callback(new Error('选择  学校'));
      } else if (this.config.semesterId === '') {
        callback(new Error('选择  班级！'));
      } else {
        callback();
      }
    };
    return {
      schoolSemesterListData: [],
      labelWidth: '80px',
      selectItem: { level: '', unitId: '', deep: 2 },
      config: { position: 1001, imgUrl: '', videoUrl: '', device: [], expireTime: '', remark: '首页Banner', seq: 99, schoolSemesterList: [], groupName: '' },
      devices: ['iphone', 'android', 'h5', 'apad', 'ipad'],
      rules1000: {
        "type": [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        "device": [{ required: true, message: '设备不能为空', trigger: 'blur' }],
        "href": [{ required: true, message: '链接地址不能为空', trigger: 'blur' }]
      },
      rules1001: {
        "device": [{ required: true, message: '设备不能为空', trigger: 'blur' }]
      },
      rules1003: {
      },
      rules1004: {
        "title": [{ required: true, message: 'title不能为空', trigger: 'blur' }]
      },
      configRules: {
        'position': [
          { required: true, message: '选择定位', trigger: 'blur' }
        ],
        'semester': [
          { validator: semesterCheck, required: true, trigger: 'blur' }
        ],
        'groupName': [
          { required: true, message: '缺少组别名称', trigger: 'blur' }
        ]
      },
      positions: [
        // {
        //   value: 1000,
        //   label: '1000-首页Banner'
        // },
        {
          value: 1001,
          label: '1001-启动页视频'
        },
        // {
        //   value: 1002,
        //   label: '1002-老师端测速连接,不用'
        // },
        {
          value: 1003,
          label: '1003-直播课随机视频'
        }
        // {
        //   value: 1004,
        //   label: '1004-随机视频提示语'
        // }
      ],
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
    let id = this.$route.query.configId || null
    if (id) {
      Request({
        url: 'config/getConfigById?',
        data: { id: id },
        type: 'post'
      }).then(res => {
        console.log(res.data)
        this.config.configId = id
        this.unCompDate(res.data)
      })
    }
    this.getSchoolSemesterList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.split("/").shift() === 'image';
      const isVideo = file.type.split("/").shift() === 'video';
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (this.config.position == 1000 && !isJPG) {
        this.$message.error('上传头像图片格式!');
        return false
      }
      if (this.config.position == 1000 && !isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false
      }
      if ((this.config.position == 1001 || this.config.position == 1003) && !isVideo) {
        this.$message.error('上传视频格式,不对!');
        return false
      }
      if ((this.config.position == 1001 || this.config.position == 1003) && !isLt20M) {
        this.$message.error('上传视频大小不能超过 20MB!');
        return false
      }
      return (isJPG && isLt2M) || (isVideo && isLt20M);
    },
    /* 上传内容 */
    handleUpload(val) {
      let formdata = new FormData();
      formdata.append('file', val.file);
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          if (this.config.position === 1000) {
            this.config.imgUrl = res.data.httpUrl
          } else if (this.config.position === 1001 || this.config.position === 1003) {
            this.config.videoUrl = res.data.httpUrl
          }
          this.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      })
    },
    submitConfig() {
      switch (this.config.position) {
        case 1000:
          return this.valideForm('form1000');
        case 1001:
          return this.valideForm('form1001');
        case 1003:
          return this.valideForm('form1003');
        case 1004:
          return this.valideForm('form1004');
        default:
        // return false;
      }
      return this.valideForm("configFrom");
    },
    compData() {
      let text = {}
      switch (this.config.position) {
        case 1000:
          text = {
            type: this.config.type,
            href: this.config.href,
            device: this.config.device,
            imgUrl: this.config.imgUrl
          }
          break;
        case 1001:
          text = {
            device: this.config.device,
            videoUrl: this.config.videoUrl
          }
          break;
        case 1003:
          text = {
            videoUrl: this.config.videoUrl
          }
          break;
        case 1004:
          text = {
            title: this.config.title
          }
          break;
      }
      return {
        text,
        remark: this.config.remark,
        seq: this.config.seq, // 排序有用吗
        expireTime: this.config.expireTime,
        position: this.config.position,
        configId: this.config.configId ? this.config.configId : null,
        schoolSemesterList: this.config.schoolSemesterList,
        groupName: this.config.groupName
      }
    },
    unCompDate(data) {
      this.config.remark = data.remark
      this.config.seq = data.seq
      this.config.position = data.position
      this.config.expireTime = data.expireTime ? new Date(data.expireTime) : ''
      this.config.schoolSemesterList = data.schoolSemesterList
      this.config.groupName = data.groupName
      let text = JSON.parse(data.text)
      switch (data.position) {
        case 1000:
          this.config.type = text.type
          this.config.href = text.href
          this.config.imgUrl = text.imgUrl
          // this.config.device.push(data.device)
          this.addDecive(data)
          break
        case 1001:
        case 1003:
          this.config.videoUrl = text.videoUrl
          this.addDecive(data)
          // this.config.device.push(data.device)
          break
        case 1004:
          this.title = text.title
          this.addDecive(data)
          break
      }
    },
    addDecive(data) {
      if (data.isSupportH5) {
        this.config.device.push('h5')
      }
      if (data.isSupportAndroid) {
        this.config.device.push('android')
      }
      if (data.isSupportIphone) {
        this.config.device.push('iphone')
      }
      if (data.isSupportApad) {
        this.config.device.push('apad')
      }
      if (data.isSupportIpad) {
        this.config.device.push('ipad')
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
    submitConfigAdd() {
      if (!this.submitConfig()) {
        this.$message.error("校验未通过")
        return
      }
      let data = {
        ...this.compData()
      }
      // console.log(data)
      Request({
        url: 'config/addOrUpdateConfig',
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
    },
    // 获取学校整体
    getSchoolSemesterList() {
      Request({
        url: 'schedule/school/semester',
        type: 'get'
      }).then(res => {
        if (res.code == 0) {
          this.schoolSemesterListData = res.data
        }
      })
    }
  },
  watch: {
    'config.position': function (val) {
      // console.log('aaa')
      let position = this.positions.filter(position => {
        return position.value == val
      })
      this.config.remark = position[0].label.split("-")[1]
    }
  },
  components: {
    CommonTable,
    Breadcrumb,
    SchoolSemester,
    MyTransfer,
    Request
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
</style>
