<template>
    <div>
        <!-- 外框 -->
        <div class="live-card">
            <!-- 图片 -->
            <div class="live-card-img" @click="watchLive(liveCard.url)">
                <!-- 开始按钮 -->
                <div class="video-start">
                    <i class="el-icon-caret-right video-start-icon"></i>
                </div>
                <!-- 选中效果 -->
                <div class="video-selected" :class="{'show-select':recordId==liveCard.recordId}">
                    <p>已选择</p>
                </div>
                <img class="live-card-img-img" :src="liveCard.lessonCoverImgUrl">
                <p>{{compTitle}}</p>
            </div>
            <!-- 文字 -->
            <div class="live-card-info">
                <!--  -->
                <el-row>
                    <span>LiveId:</span>
                    <span>{{liveCard.liveId}}</span>
                    <!-- <span>{{liveCard.compTitle}}</span> -->
                </el-row>
                <el-row>
                    <span>Title:</span>
                    <span>{{liveCard.lessonTitleCh}}</span>
                    <!-- <span>{{liveCard.compTitle}}</span> -->
                </el-row>
                <el-row>
                    <span>Teacher:</span>
                    <span>{{liveCard.tchNickname}}</span>
                </el-row>
                <el-row>
                    <span>上课时间:</span>
                    <span>{{liveCard.startTime}}</span>
                </el-row>
                <el-row>
                    <span>视频创建:</span>
                    <span>{{liveCard.created}}</span>
                </el-row>
            </div>
            <!-- 按键 -->
            <div class="live-card-action">
                <el-button class="live-card-action-btn " @click="selectLive">选择</el-button>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    props: {
        liveCard: {
            type: Object,
            required: true
        },
        recordId: {
            type: String
        },
        compTitle: {
            type: String
        }
    },
    data () {
        return {
            active: false
        }
    },
    methods: {
        watchLive (url) {
            if (!url) {
                this.$message({
                    type: 'error',
                    message: '视频资源为空',
                    showClose: true
                })
            } else {
                window.open(url)
            }
        },
        selectLive () {
            this.$emit('recordId-value', {recordId: this.liveCard.recordId})
        }
    }
}
</script>
<style scoped>
.live-card {
  width: 460px;
  height: fit-content;
  padding: 10px;
  display: block;
  float: left;
  margin-left: 10px;
}
.live-card-btn,
.live-card-img,
.live-card-info {
  width: 90%;
  margin: auto;
}
.live-card-img {
  position: relative;
  text-align: center;
  cursor: pointer;

  &:hover {
    .video-start {
      background: #34ec6a94;
      color: #4dc4ec;
    }
  }
}
/* 开始效果 */
.video-start {
  position: absolute;
  left: 165px;
  top: 35%;
  width: 60px;
  height: 60px;
  border-radius: 90px;
  padding: 10px;
  z-index: 10;
  display: block;
  opacity: 0.8;
  background: #6b6565;
  color: #ffffff;
}
/* 选择效果 */
.video-selected {
  position: absolute;
  left: 45px;
  top: 0;
  width: 305px;
  height: 12px;
  padding: 12px;
  z-index: 10;
  font-size: 12px;
  line-height: 12px;
  opacity: 0.6;
  display: none;
  background: #9add78;
  color: #ecea63;
}
.show-select {
  display: block;
}
.video-start-icon {
  position: relative;
  font-size: 60px;
}
.live-card-img-img {
  width: 100%;
}
.live-card-info {
  text-align: left;
  .el-row {
    margin: 10px 2px;
  }
}
.live-card-action {
  text-align: center;
}
.live-card-action-btn {
  width: 62%;
  background: #13a1c7;
  color: #ffffff;
  &:hover {
    width: 60%;
    background: #0d49cc;
    color: #ffffff;
  }
}
</style>

