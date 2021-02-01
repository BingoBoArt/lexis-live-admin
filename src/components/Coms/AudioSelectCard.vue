<template>
  <!-- 图片样式 -->
  <div class="audio-card">
    <div class="audio-card-main">
      <div class="audio-card-audio">
        <audio ref="player" controls v-if="dataInfo.content" :src="dataInfo.content" type="audio/mpeg">
        </audio>
        <div class="card-info">
          <div class="card-text textOverflow">🖨️{{dataInfo.fileName}}</div>
          <div class="card-text textOverflow">🌟{{dataInfo.label}}</div>
        </div>
      </div>
    </div>
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
  watch:{
    dataInfo(){
      // console.log(this.dataInfo)
      return this.dataInfo
    }
  },
  data() {
    return {
      show: false,
      showDeleteDialog: false,
      showEditDialog: false,
      newLabel: ''
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
    },
    //获取audio的音频时长
          // addEventListeners: function () {
          //   const self = this;
          //   self.$refs.player.addEventListener('timeupdate', self._currentTime),
          //   self.$refs.player.addEventListener('canplay', self._durationTime)
          // },
          // removeEventListeners: function () {
          //   const self = this;
          //   self.$refs.player.removeEventListener('timeupdate', self._currentTime)
          //   self.$refs.player.removeEventListener('canplay', self._durationTime)
          // },
          // _currentTime: function () {
          //   const self = this;
          //   self.timeNow = parseInt(self.$refs.player.currentTime)
          // },
          // _durationTime: function () {
          //   const self = this;
          //   self.timeDuration = parseInt(self.$refs.player.duration)
          //   console.log("这是时间长度")
          //   console.log(self.$refs)
          //   console.log(self.timeDuration)
          // },
     //获取 audio的音频时长  
  },
  mounted() {
    // 获取audio的时长
    // this.addEventListeners()
  },
  beforeDestroyed() {
    // 获取audio的时长
    // this.removeEventListeners()
  },
}
</script>

<style scoped>
.audio-card {
  position: relative;
  width: 320px;
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
  margin: 10px 5px;
  width: 300px;
  /* background-size: cover; */
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
  text-align: left;
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
