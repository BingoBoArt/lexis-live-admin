<template>
  <div>
    <!-- 试题 -->
    <div>
      <div>
        <breadcrumb></breadcrumb>
        <el-row style="margin-bottom: 10px" v-if="this.$route.query.quesId || this.$route.query.show">
          <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back btn">返回</el-button>
        </el-row>
      </div>
      <el-form label-width="100px" label-position="right" ref="exeForm" :rules="rules" :model="exe">
        <el-form-item label="标题：" prop="quesTitle">
          <el-input v-model="exe.quesTitle" type="textarea" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="题目等级：" prop="level">
          <el-select v-model="exe.level">
            <el-option label="等级一" value="1"></el-option>
            <el-option label="等级二" value="2"></el-option>
            <el-option label="等级三" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件：" prop="title">
          <el-radio-group v-model="exe.titleType" size="mini">
            <el-radio-button :label="1">文本</el-radio-button>
            <el-radio-button :label="2">图片</el-radio-button>
            <el-radio-button :label="3">语音</el-radio-button>
            <el-radio-button :label="4">视频</el-radio-button>
          </el-radio-group>
          <el-row>
            <el-input v-model="exe.text" v-if="exe.titleType == 1" type="textarea" placeholder="请输入文本信息"></el-input>
            <!-- 上传的资源，包括：视频、音频、图片 -->
            <el-upload v-if="exe.titleType!=1" action="" :show-file-list="false" :http-request="handleUpload">
              <div v-if="(exe.titleType === 2 && exe.imageUrl) ||
            (exe.titleType === 3 && exe.audioUrl) || 
            (exe.titleType === 4 && exe.videoUrl)" width="100%">
                <div v-if="exe.titleType === 2 ">
                  <img :src="exe.imageUrl" class="ques-title-image">
                </div>
                <div v-else-if="exe.titleType == 3">
                  <audio controls class="my-audio" :src="exe.audioUrl">
                  </audio>
                </div>
                <div v-else-if="exe.titleType == 4">
                  <!-- <Video :url="exe.videoUrl" width="320" height="240" controls></Video> -->
                  <video controls :src="exe.videoUrl" width="320" height="240">
                    <source :src="exe.videoUrl" type="video/mp4">
                    <source :src="exe.videoUrl" type="video/ogg">
                    <source :src="exe.videoUrl" type="video/webm">
                    <object :data="exe.videoUrl">
                      <embed :src="exe.videoUrl">
                    </object>
                  </video>
                </div>
              </div>

              <div width="100%" v-else>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或
                  <em>点击上传</em>
                </div>
              </div>
            </el-upload>
          </el-row>
        </el-form-item>
        <!-- 选项内容 -->
        <el-form-item label="选项：" prop="optionList">
          <!-- 选项类别 -->
          <el-radio-group v-model="exe.optionType" size="mini">
            <el-radio-button :label="1">文本</el-radio-button>
            <el-radio-button :label="2">图片</el-radio-button>
          </el-radio-group>
          <div>
            <!-- 具体的选项 -->
            <div v-for="(item,index) in exe.optionList" :key="index" :prop="exe.optionList[index].text||exe.optionList[index].imageUrl">
              <!-- <el-form-item :label="item.item+' :'"> -->
              <el-row style="margin-top: 10px;margin-left: -20px">
                <span>{{item.item+' :'}}</span>
                <el-input v-if="exe.optionType == 1" v-model="exe.optionList[index].text" placeholder="请输入文本"></el-input>
                <el-upload v-if="exe.optionType == 2" action="" :show-file-list="false" :http-request="handleUploadOption">
                  <div v-if="item.imageUrl">
                    <img @click="optionIndex = index" :src="item.imageUrl" class="ques-option-image">
                  </div>
                  <div width="100%" @click="optionIndex = index" v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                  </div>
                </el-upload>
              </el-row>
              <!-- </el-form-item> -->
            </div>
            <!-- 选项控制操作 -->
            <div style="margin-top: 20px">
              <el-button @click="addOption" type="warning" icon="el-icon-plus" circle></el-button>
              <el-button @click="deleteOption" type="danger" icon="el-icon-delete" circle></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="正确答案：" prop="correct">
          <el-select v-model="correct" @change="changeoption(correct)">
            <el-option v-for="(item,index) in exe.optionList" :key="index"  :label="item.item" :value="item.item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分值：" prop="score">
          <el-input v-model="exe.score" placeholder="请输入分值"></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button @click="checkData" v-if="!this.exe.id">保存</el-button>
            <el-button @click="checkData" v-else>保存</el-button>
            <el-button @click="appendExe" v-if="append">继续新增</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import Request from "@/common/request.js"
import Breadcrumb from '@/components/Common/Breadcrumb'
export default {
  data() {
    var checkOptionList = (rule, value, callback) => {
      if (value) {
        if (this.exe.optionType === 1) {
          this.exe.optionList.forEach(element => {
            if (!element.text) {
              return callback(new Error("数据为空"))
            }
          });
          return callback()
        } else if (this.exe.optionType === 2) {
          this.exe.optionList.forEach(element => {
            if (!element.imageUrl) {
              return callback(new Error("数据为空"))
            }
          });
          return callback()
        }
      } else {
        return callback(new Error("数据不能为空"))
      }
    }
    /* var checkTitle = (rule, value, callback) => {
      if (this.exe.titleType == 1) {
        if (!this.exe.text) {
          return callback(new Error('副标题不能为空'))
        } else {
          return callback()
        }
      }
      if (this.exe.titleType == 2) {
        if (!this.exe.imageUrl) {
          return callback(new Error('副标题图片不能为空'))
        } else {
          return callback()
        }
      }
      if (this.exe.titleType == 3) {
        if (!this.exe.audioUrl) {
          return callback(new Error('副标题语音不能为空'))
        } else {
          return callback()
        }
      }
      if (this.exe.titleType == 4) {
        if (!this.exe.videoUrl) {
          return callback(new Error('副标题视频不能为空'))
        } else {
          return callback()
        }
      }
    } */
    return {
      append: 0,
      optionIndex: '',
      group: { groupName: "" },
      correct: '',
      exe: {
        titleType: 1,
        optionType: 1,
        optionList: [
          { "item": "A", "text": "" }, { "item": "B", "text": "" }
        ],
        score: 5
      },
      /* 自定义校验 */
      rules: {
        "quesTitle": [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        "level": [{ required: true, message: '未选择等级', trigger: 'blur' }],
        // "title": [{ required: true, validator: checkTitle, trigger: 'blur' }],
        "optionList": [{ required: true, validator: checkOptionList, trigger: 'blur' }],
        "correct": [{ required: true, message: '正确答案不能为空', trigger: 'blur' }],
        "score": [{ required: true, message: '分值不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'exe.optionList': {
      handler: function (value) {
        this.$refs['exeForm'].clearValidate();
      },
      deep: true
    },
    correct: {
      handler: function(newValue,oldValue) {
        console.log("666", newValue, oldValue)
        this.exe.correct = newValue
      } ,
      deep: true
    },
       
  },
  mounted() {
    this.init()
  },
  methods: {
    changeoption(val) {
      // console.log(val)
    },
    init() {
      /* 获取数据 */
      let quesId = this.$route.query.quesId
      let groupId = this.$route.query.groupId
      if (quesId) {
        this.getQuestionInfo(quesId)
      }
      if (groupId) {
        this.group.id = groupId
      } else {
        this.$message.error("没有题组可以确认")
      }
    },
    /* 返回 */
    goBack() {
      this.$router.push({ path: '/dashboard/Issue/ExeQuesGroup', query: { groupId: this.group.id } })
    },
    /* 获取当前问题 */
    getQuestionInfo(quesId) {
      Request({
        url: 'exe/question/info',
        type: 'post',
        data: { id: quesId }
      }).then(res => {
        if (res.code == 0) {
          this.exe = res.data
          this.exe.id = res.data.quesId
          let correctOb = this.exe.optionList.filter(item => {
            return item.isCorrect == 1
          })
          this.correct = correctOb[0].item
        }
      })
    },
    /* 上传 资源 */
    handleUpload(val) {
      let formdata = new FormData();
      formdata.append('file', val.file);
      /* 校验 */
      // let imageSize = 500 * 1024 * 1024; // 500M
      let type = val.file.type.split('/').shift();
      // console.log(this.type)
      if (this.exe.titleType == 4) { // 视频
        if (type != 'video') {
          this.$message({
            showClose: true,
            message: "该文件不属于视频类型",
            type: 'error'
          });
          return;
        }
        formdata.append('path', 'resource/video');
      }
      if (this.exe.titleType == 3) { // 音频
        if (type != 'audio') {
          this.$message({
            showClose: true,
            message: "该文件不属于音频类型",
            type: 'error'
          });
          return;
        }
        formdata.append('path', 'resource/audio/');
      }
      if (this.exe.titleType == 2) { // 图片
        if (type != 'image') {
          this.$message({
            showClose: true,
            message: "该文件不属于图片类型",
            type: 'error'
          });
          return;
        }
        formdata.append('path', 'resource/image');
      }

      // if (this.type == 'image' && type != 'image') {
      //   this.$message({
      //     showClose: true,
      //     message: "该文件不属于图片类型",
      //     type: 'error'
      //   });
      //   return;
      // }
      // if (this.type == 'video' && type != 'video') {
      //   this.$message({
      //     showClose: true,
      //     message: "该文件不属于视频类型",
      //     type: 'error'
      //   });
      //   return;
      // }
      // if (this.type == 'audio' && type != 'audio') {
      //   this.$message({
      //     showClose: true,
      //     message: "该文件不属于音频类型",
      //     type: 'error'
      //   });
      //   return;
      // }
      // if (imageSize < val.file.size) {
      //   this.$message({
      //     showClose: true,
      //     message: "图片大小超过 500kb",
      //     type: 'error'
      //   });
      //   return;
      // }
      /* 开始上传 */
      let that = this
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        let url = res.data.httpUrl
        if (res.code == 0) {
          switch (that.exe.titleType) {
            case 2:
              that.$set(that.exe, 'imageUrl', url)
              break;
            case 3:
              that.$set(that.exe, 'audioUrl', url)
              break;
            case 4:
              that.$set(that.exe, 'videoUrl', url)
              break;
          }
          that.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      }).catch(error => {
        that.$message({
          type: 'error',
          showClose: true,
          message: '上传失败'
        })
      })
    },
    handleUploadOption(val) {
      let formdata = new FormData();
      formdata.append('file', val.file);
      /* 校验 */
      let type = val.file.type.split('/').shift();
      if (this.exe.titleType == 2) { // 图片
        if (type != 'image') {
          this.$message({
            showClose: true,
            message: "该文件不属于图片类型",
            type: 'error'
          });
          return;
        }
        formdata.append('path', 'resource/image');
      }
      /* 开始上传 */
      let that = this
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          let url = res.data.httpUrl
          that.$set(that.exe.optionList[that.optionIndex], 'imageUrl', url)
          that.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      }).catch(error => {
        that.$message({
          type: 'error',
          showClose: true,
          message: '上传失败'
        })
      })
    },
    /* 选项操作 */
    addOption() {
      if (this.exe.optionList.length < 4) {
        const cur_str = String.fromCharCode(parseInt('A'.charCodeAt()) + this.exe.optionList.length);
        let item = {
          item: cur_str
        }
        this.exe.optionList.push(item)
        this.$refs['exeForm'].clearValidate();
      }
    },
    deleteOption() {
      if (this.exe.optionList.length > 2) {
        this.exe.optionList.pop()
      }
    },
    /* 继续新增 */
    appendExe() {
      this.exe = {
        titleType: 1,
        optionType: 1,
        optionList: [
          { "item": "A", "text": "" }, { "item": "B", "text": "" }
        ],
        score: 5
      }
      this.append = 0
    },
    checkData() {
      this.$refs['exeForm'].validate((valid) => {
        if (valid) {
          this.saveOrUpdate()
        } else {
          this.$message.error("校验未通过")
        }
      })
    },
    /* 保存或者编辑 */
    saveOrUpdate() {
      let data = this.compData()
      let url = "exe/question/edit"
      Request({
        url: url,
        data: data,
        type: 'post',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        if (res.code == 0) {
          this.append = 1
          this.$message.success("操作成功")
        }
      })
    },
    /* 操作数据 */
    compData() {
      // 清洗数据 副标题
      let title2 = {};
      if (this.exe.titleType == 1) {
        title2.text = this.exe.text
      }
      if (this.exe.titleType == 2) {
        title2.imageUrl = this.exe.imageUrl
      }
      if (this.exe.titleType == 3) {
        title2.audioUrl = this.exe.audioUrl
      }
      if (this.exe.titleType == 4) {
        title2.videoUrl = this.exe.videoUrl
      }
      return {
        ...title2,
        quesId: this.exe.id ? this.exe.id : null,
        quesTitle: this.exe.quesTitle,
        titleType: this.exe.titleType,
        optionType: this.exe.optionType,
        optionList: this.exe.optionList,
        correct: this.exe.correct,
        score: this.exe.score,
        groupId: this.group.id,
        level: this.exe.level,
        status: 1 // 默认1
      }
    }
  },
  compontent: {
    Request, Breadcrumb
  }
}
</script>

<style scoped>
/* 上传布局 */
.el-my-upload {
  width: 260px;
  height: 120px;
  /* padding: 5px; */
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-my-upload:hover {
  border-color: #409eff;
}
.el-upload {
  display: grid;
}
.ques-title-image {
  width: 240px;
}
.ques-option-image {
  width: 200px;
}

/* 扩展 */
.ext-image {
  height: 260px;
}
.ext-video {
  height: 180px;
}
.el-upload-dragger,
.el-icon-upload {
  font-size: 40px;
  color: #c0c4cc;
  margin: 10px 0 0px;
  line-height: 50px;
}
.el-upload-dragger,
.el-upload__text {
  color: #606266;
  font-size: 14px;
  text-align: center;
}
/* 地址连接 */
.el-my-upload-fileurl-out {
  height: 18px;
  width: 330px;
  margin: 10px 0;
  overflow-x: hidden;
  overflow-y: hidden;
}
.el-my-upload-fileurl {
  text-align: left;
  overflow: scroll;
  font-size: 12px;
  margin-top: 2px;
  white-space: nowrap;
  color: #0daed6;
  overflow-x: scroll;
  overflow-y: hidden;
}
/* 音频样式 */
.my-audio {
  height: 88px;
  width: 240px;
}
</style>
