 <template>
  <div class="ques-o-border">
    <div class="ques-border">
      <el-row>
        <span>-</span>
        <span>{{ques.quesTitle}}</span>
      </el-row>
      <el-row>
        <span v-if="ques.titleType == 1" class="ques-title">{{ques.text}}</span>
        <img v-if="ques.titleType == 2" class="ques-image" :src="ques.imageUrl">
        <audio v-if="ques.titleType == 3" class="ques-audio" controls :src="ques.audioUrl"></audio>
        <!-- <Video v-if="ques.titleType == 4" class="ques-video" :url="ques.videoUrl" width="240" height="200" controls></Video> -->
        <Video controls v-if="ques.titleType == 4"  class="ques-video" :url="ques.videoUrl" width="240" height="200">
          <source :url="ques.videoUrl" type="video/mp4">
          <source :url="ques.videoUrl" type="video/ogg">
          <source :url="ques.videoUrl" type="video/webm">
          <object :data="ques.videoUrl">
            <embed :url="ques.videoUrl">
          </object>
        </Video>
      </el-row>
      <el-row>
        <div v-for="(item, index) in ques.optionList" :key="index">
          <div v-if="ques.optionType == 1" :class="{'opt-text ':true,'opt-correct':item.isCorrect===1}">
            <span>{{item.item}}: </span>
            <span>{{item.text}}</span>
          </div>
          <div class="opt-image-ob" v-if="ques.optionType == 2">
            <span class="opt-image-item">{{item.item}}: </span>
            <img v-if="ques.optionType == 2" :class="{'opt-image': true,'opt-image-correct':item.isCorrect === 1}" :src="item.imageUrl">
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ques: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
/* 外框 */
.ques-o-border {
  width: 286px;
  height: 400px;
  float: left;
  display: block;
  margin: 10px 10px 20px 10px;
}
.ques-border {
  display: block;
  width: 260px;
  padding: 10px 10px 20px 10px;
  border: 1px solid #bfbfbf;
  box-shadow: 2px 2px 3px #aaaaaa;
}
/* 问题样式 */
.ques-image,
.ques-video,
.ques-audio,
.ques-text {
  width: 240px;
  margin: 10px 5px;
}
.ques-image {
  height: 200px;
}
.ques-text {
  line-height: 20px;
  font-size: 18px;
  margin: 10px;
}
/* 选项样式 */
.opt-text {
  width: 240px;
  line-height: 18px;
  font-size: 16px;
  margin: 10px;
}
.opt-correct {
  color: green;
  background-color: beige;
}
.opt-image-ob {
  width: 124px;
  height: 112px;
  margin: 5px 5px 0 0;
  display: block;
  float: left;
}
.opt-image-item {
  width: 20px;
  line-height: 18px;
  font-size: 16px;
  display: block;
  float: left;
}
.opt-image {
  width: 90px;
  height: 90px;
  display: block;
  float: left;
}
.opt-image-correct {
  border: 4px solid green;
}
</style>
