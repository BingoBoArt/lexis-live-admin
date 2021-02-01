<template>
  <div class="upload-multi">
    <LessonFilter v-model="selectItem" :needKeyword="false" :title="'选择课件'">
      <el-form-item class="content-nav-lesson" style="width: 160px">
        <el-input @change="uploadFilter" v-model="selectItem.label" placeholder="请输入标签"></el-input>
      </el-form-item>
    </LessonFilter>
    <div class="size-tip">
      <el-input type="text" v-model="maxSize[type]"></el-input>
      <span>限制{{maxSize[type] > 1000 ? ((maxSize[type] / 1000).toFixed(2) + "M") : (maxSize[type] + "K")}} </span>
    </div>
    <el-upload class="upload-com" :accept="accept" action="/jidaadm/upload/file" :data="{'lessonNo': selectItem.lessonNo}" :disabled="!selectItem.lessonNo" multiple drag :file-list="fileList" :list-type="picture" :on-success="uploadSuccess" :before-upload="beforeUpload">
      <p v-if="!selectItem.lessonNo" class="upload-error-tip">提示：请先选择课件</p>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="disable-mask" v-if="!selectItem.lessonNo" @click="handleDisable"></div>
    </el-upload>
    <ul class="warn-list" v-if="warnList && warnList.length">
      <li v-for="(item, index) in warnList" :key="index">
        <span v-if="item.err_type == 'name_error'">{{item.name}} 文件名有非法字符 (正确文件名为英文、数字、下划线组合)</span>
        <span v-else-if="sourceType == 'image'">{{item.name}} 文件过大，大小为{{item.size > 1000 ? ((item.size / 1000).toFixed(2) + "M") : (item.size + "K")}}，尺寸为{{item.width}}*{{item.height}}{{(item.width > 1500 || item.height > 1500) ? '请压缩图片尺寸' : ''}}</span>
        <span v-else-if="sourceType != 'image'">{{item.name}} 文件过大，大小为{{item.size > 1000 ? ((item.size / 1000).toFixed(2) + "M") : (item.size + "K")}}</span>
      </li>
    </ul>
  </div>
</template> 
<script>
import Request from '@/common/request.js'
import LessonFilter from '@/components/Coms/LessonFilter'
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'image' // image video audio 
    }
  },
  data() {
    return {
      sourceType: '',
      fileList: [],
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', label: '' },
      warnList: [], // 提示图片列表
      maxSize: {
        image: 150, // 150K
        audio: 10000, // 100K
        video: 20000 // 20M
      }
    }
  },
  components: {
    LessonFilter
  },
  computed: {
    accept: function () {
      if (this.type == 'image') {
        return "image/gif, image/jpeg, image/png, image/jpg";
      } if (this.type == 'video') {
        return "video/mp4";
      } if (this.type == 'audio') {
        return "audio/mp3";
      } else {
        return `${this.type}/*`
      }
    }
  },
  methods: {
    handleDisable() {
      this.$message({
        showClose: true,
        message: "请先选择课件",
        type: 'error'
      });
    },
    beforeUpload(file) {
      // console.log("beforeUpload", file)
      let size = (file.size / 1000).toFixed(2)
      let maxSize = this.maxSize[this.type] || 1000000;
      // 判断大小
      let that = this;

      let _file_dot_index = file.name.lastIndexOf(".");
      let _file_name = file.name.slice(0, _file_dot_index);
      if(!(/^[\w\d\s_-]+$/).test(_file_name)){
        // 不满足文件名要求（字母、数字、-、_、空格）
        that.warnList.push({
          err_type: 'name_error',
          name: file.name
        })
        return false;
      }
      if (size > maxSize) {
        let width = 0;
        let height = 0;
        try {
          if (file) {
            // console.log(101010101, file)
            that.sourceType = file.type.split('/').shift();
            if((that.sourceType == 'audio' || 'video') && that.sourceType != 'image' ) {
              that.warnList.push({
                name: file.name,
                size: size
              })
            }
            var reader = new FileReader();
            reader.onload = function (evt) {
              // 创建image对象
              var image = new Image();
              image.src = evt.target.result;
              // 获取图片宽高
              image.onload = function () {
                width = this.width;
                height = this.height;
                if(file.type != 'video/mp4') {
                    that.warnList.push({
                            name: file.name,
                            size: size,
                            width: width,
                            height: height
                          })
                }
                
              }
            };
            reader.readAsDataURL(file);
          }
        } catch (e) {
          that.warnList.push({
            name: file.name,
            size: size,
            width: width,
            height: height
          })
        }
        return false;
      }
    },
    uploadSuccess(response, file, fileList) {
      let file_name = response.data.fileName;
      file_name = file_name.replace(/\s/mg, "_"); // 空格替换为下划线
      this.saveImg(response.data.httpUrl, file_name)
    },
    /* 保存图片 */
    saveImg(imgUrl, fileName) {
      let resTypes = {
        'image': 1,
        'video': 2,
        'audio': 3
      }
      try{
        // 图片名称增加_xxx 避免游戏替换同名文件
        let dotIndex = fileName.lastIndexOf(".");
        let fileTrueName = fileName.slice(0, dotIndex);
        let fileExt = fileName.slice(dotIndex + 1)
        let newName = fileTrueName + "_" + Math.ceil(Math.random() * 1000);
        /*
        if(fileTrueName.length == 1){
          // 单字母 单数字，增加一个下划线，避免游戏资源引用后md5出问题
          fileName = fileName.replace(fileTrueName, fileTrueName + "_")
        };
        */
        fileName = newName + "." + fileExt;
      }catch(e){

      }
      let param = {
        ...this.selectItem,
        content: imgUrl,
        fileName: fileName,
        resType: resTypes[this.type]
      }
      Request({
        type: 'post',
        url: 'resource/editResourceRelation',
        data: param,
        headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        // let ob = res.data
        /* 刷新界面，不采用增加 */
        // this.getImgList()
      })
    },
    handleUpload(val) {
      // 使用自己的request， 就没有进度条
      let formdata = new FormData();
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      formdata.append('file', val.file);
      formdata.append('lessonNo', this.lessonNo);
      /* 校验 */
      let imageSize = 500 * 1024 * 1024; // 500M
      let type = val.file.type.split('/').shift();
      // console.log(this.type)
      if (this.type == 'image' && type != 'image') {
        this.$message({
          showClose: true,
          message: "该文件不属于图片类型",
          type: 'error'
        });
        return;
      }
      if (this.type == 'video' && type != 'video') {
        this.$message({
          showClose: true,
          message: "该文件不属于视频类型",
          type: 'error'
        });
        return;
      }
      if (this.type == 'audio' && type != 'audio') {
        this.$message({
          showClose: true,
          message: "该文件不属于音频类型",
          type: 'error'
        });
        return;
      }
      if (imageSize < val.file.size) {
        this.$message({
          showClose: true,
          message: "图片大小超过 500kb",
          type: 'error'
        });
        return;
      }
      /* 开始上传 */
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
      }).catch(error => {
      })
    }
  }
}
</script>

<style>
.upload-multi {
  .upload-com {
    margin: 0 auto 20px;
    text-align: center;
    min-height: 260px;
  }
  .upload-error-tip {
    position: absolute;
    bottom: 20px;
    text-align: center;
    width: 100%;
    color: red;
  }
  .el-upload-list {
    text-align: left;
  }
  .disable-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.warn-list {
  background: #e6a23c;
  color: white;
  padding: 10px;
}
.size-tip {
  width: 200px;
  text-align: center;
  position: absolute;
  margin-left: 180px;
  left: 50%;
  top: 210px;
  .el-input {
    width: 80px;
    height: 30px;
    input {
      height: 30px;
      line-height: 30px;
    }
  }
  span {
    font-size: 12px;
    color: #333;
  }
}
</style>
