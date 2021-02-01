<template>
    <div class="content-mul-image">
        <div class="content-mul-img">
            <el-upload :class="[commType, extend]" action="" :show-file-list="false" :http-request="handleUpload">
                <div v-if="currentValue" width="100%">
                    <div v-if="type == 'image'">
                        <img :src="currentValue" class="content-mul-img-src">
                    </div>
                    <div v-else-if="type == 'audio'">
                        <audio controls class="my-audio" :src="currentValue">
                        </audio>
                        <!-- <audio :src="value" controls></audio> -->
                    </div>
                    <div v-else-if="type == 'video'">
                        <Video :url="currentValue" width="320" height="240" controls></Video>
                    </div>
                </div>
                <div width="100%" v-else>
                    <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                    <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </div>
            </el-upload>
        </div>
        <!--
        <div class="el-my-upload-fileurl-out" v-show="currentValue">
            <div class="el-my-upload-fileurl">{{currentValue}}</div>
        </div>
        -->
    </div>
</template>
<script>
import Request from '@/common/request.js'
import Video from "@/components/Coms/Video";
export default {
    props: {
        type: {
            type: String,
            required: false
        },
        extend: {
            type: String,
            required: false
        },
        lessonNo: {
            required: false
        },
        value: {
          type: String
        }
    },
    data () {
        return {
            commType: 'el-my-upload'
        }
    },
    components: {
      Video
    },
    computed: {
        currentValue: {
            // 动态计算currentValue的值
            get: function() {
                return this.value;
            },
            set: function(val) {
                this.$emit('input', val);
            }
        }
    },
    methods: {
        handleUpload (val) {
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
                if(res.code == 0){
                  this.currentValue = res.data.httpUrl
                  this.$message({
                      type: 'success',
                      showClose: true,
                      message: '上传成功'
                  })
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    showClose: true,
                    message: '上传失败'
                })
            })
        }
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

/* 图片内容 */
.content-mul-img {
  width: fit-content;
  height: fit-content;
  text-align: center;
  display: block;
  border-radius: 5px;
}
.content-mul-image {
  width: fit-content;
  display: block;
  float: left;
}
.content-mul-img-src {
  width: 100%;
  border-radius: 5px;
}

/* 按钮 */
.content-mul-img-btn {
  margin: 10px 0px;
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
