<template>
  <!-- 图片样式 -->
  <div class="audio-card">
    <div class="audio-card-main">
      <div v-if="tog" class="audio-card-audio">
        <audio controls>
          <source v-if="dataInfo.content" :src="dataInfo.content" type="audio/mpeg" />
        </audio>
      </div>
      <div class="card-info">
        <div class="card-text textOverflow"> 🖨️{{dataInfo.fileName}}</div>
        <div class="card-text textOverflow"> ✨{{dataInfo.label}}</div>
      </div>
    </div>
    <div class="op-box clearfix">
      <div class="edit-item">
        <i class="el-icon-delete"></i>
        <span @click="showDialog">删除</span>
      </div>
      <div class="edit-item">
        <i class="el-icon-edit"></i>
        <span @click="showEditDialog = true">label</span>
      </div>
    </div>
    <el-dialog title="删除操作" :visible.sync="showDeleteDialog">
      <span>确定删除这个图片吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deletImage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改label" :visible.sync="showEditDialog">
      <el-row class="dialog-row">
        <span>原label</span>
        <el-input :disabled="true" v-model="dataInfo.label"></el-input>
      </el-row>
      <el-row class="dialog-row">
        <span>新label</span>
        <el-input :disabled="false" v-model="newLabel" placeholder="请输入新label"></el-input>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editLabel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Request from '@/common/request.js'
export default {
  props: {
    dataInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tog: true,
      show: false,
      showDeleteDialog: false,
      showEditDialog: false,
      newLabel: ''
    }
  },
  watch: {
      dataInfo(newName, oldName) {
        this.tog = false
        this.$nextTick(() => {
                this.tog = true
            })
      }
    },
  methods: {
    showDialog() {
      if (this.dataInfo.referCount > 0) {
        this.$message({
          type: 'error',
          message: '该音频被引用，不能被删除',
          showClose: true
        })
        return;
      }
      this.showDeleteDialog = true
    },
    deletImage() {
      Request({
        url: 'resource/deleteResource',
        type: 'post',
        data: { resId: this.dataInfo.resId }
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            showClose: true,
            message: '删除成功'
          })
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: res.msg
          })
        }
        this.$emit('data-update', true)
      })
      this.showDeleteDialog = false
    },
    editLabel() {
      let url = 'resource/updateLabel'
      Request({
        url: 'resource/updateLabel',
        type: 'post',
        data: { resId: this.dataInfo.resId, label: this.newLabel }
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '标签修改成功',
            showClose: true
          })
          this.$emit('data-update', true)
        }
        this.showEditDialog = false
      })
    }
  }
}
</script>

<style scoped>
.audio-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  box-shadow: 0 0 2px #bbbbbb;
}
.audio-card-back {
  width: 100%;
  height: 130px;
}

.audio-card-main {
  padding: 5px;
}
.audio-card-audio {
  margin: 40px 5px;
  width: 300px;
  background-size: cover;
  /* margin-top: 30px; */
  /* background: #ccc; */
}
.card-info {
  height: 40px;
  line-height: 20px;
  position: absolute;
  bottom: 6px;
  left: 6px;
}
.card-text {
  width: 100%;
  font-size: 12px;
  color: #787b7a;
}
.op-box {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: -23px;
  width: 150px;
  height: auto;
  box-sizing: border-box;
  z-index: 10;
}
.op-box .edit-item {
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 20px;
  background-color: #383838c9;
  text-align: center;
  color: #fff;
  float: left;
  margin: 0 4px;
  height: 16px;
  &:hover {
    background-color: #383838;
  }
}
.dialog-row {
  margin-top: 20px;
  span {
    margin: 5px 0;
    display: inline-block;
  }
}
</style>
