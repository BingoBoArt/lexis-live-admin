<template>
  <div>
    <div v-for="(item, index) in questionForm.AudioOptions" :key='index'>
      <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <audio :src="item.audioUrl"></audio>
      <span>{{item.duration}}</span>
      <el-button v-if="key>1" class="audio-del" size="mini" type="danger" icon="el-icon-close" circle plain @click="delAudio(index)"></el-button>
    </div>
  </div>
</template>
<style scoped>
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

