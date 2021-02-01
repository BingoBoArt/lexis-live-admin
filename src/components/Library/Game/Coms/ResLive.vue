<template>
  <div class="wrap">
    <div class='editImg'>
      <!-- <image-card :ableSelect='false' class="resImg" v-bind="resInfo" /> -->
      <!-- <el-upload class="upload" :before-upload="beforeUpload" :action="uploadUrl" :on-success='handleSuccess'>
        <el-button class="uploadBtn" size='mini' type="info">点击上传</el-button>
      </el-upload> -->
      <ImgSelect v-model="resInfo"></ImgSelect>
      <!-- <el-button class="chooseBtn" type="primary" plain icon="el-icon-edit" size='mini' @click='showSelect'>选择图片</el-button> -->
    </div>
    <div class="info">
      <div class="item">
        <span class="label">
          图片:
        </span>
        <span class="resInfo" :title='resInfo.content'>
          {{resInfo.fileName}}
        </span>
      </div>
      <!-- <div class="item">
        <span class="label">
          音频资源:
        </span>
        <span class="details">
          <span class="text">当前音频</span>
          <el-button type="primary" size='mini'>上传</el-button>
          <el-button type="primary" size='mini' @click='showSelect'>选择</el-button>
        </span>
      </div> -->
      <div class="item">
        <span class="label">
          选项信息:
        </span>
        <span class="details">
          <el-input width='120' placeholder="输入选项信息(若无则不填)"></el-input>
        </span>
      </div>
      <div class="item" v-if="!sym">
        <span class="label">
          正误值:
        </span>
        <span class="details">
          <el-radio-group v-model="questionAnswerInfo.right"  @change="updQuestionAnswerInfo({
              quesId:id, ansId:index, key:'right',value:questionAnswerInfo.right,gameType:gameInfo.gameType,gameId:gameInfo.gameId
            })">
            <el-radio :label="1">正确</el-radio>
            <el-radio :label="0">错误</el-radio>
          </el-radio-group>
          </span>
      </div>
    </div>
    
    <!-- <res-select-page @toggleDialog='toggleDialog' @repalceRes='repalceRes' :isShow='isShow'></res-select-page> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mapGetters, mapActions, mapMutations } from "vuex";
import ImageCard from "./ImageCard";
import resAdminHost from "@/common/host";
import ResSelectPage from "./ResSelectPage";
import ImgSelect from '@/components/Coms/ImgSelect'
import Request from "@/common/request.js";
export default {
  props: ["id", "index", "gameInfo", "imgName", "outerShow"],
  data() {
    return {
      questionAnswerInfo: {},
      isShow: false,
      initFile: '',
      resInfo: {
        content: "",
        fileName: "",
        resId: ""
      },
      sym: false
    };
  },
  computed: {
    ...mapGetters(["toReplaceImg", "gameData", "tempEdit"])
  },
  methods: {
    showSelect() {
      this.isShow = true;
    },
    /*
    repalceRes(params) {
      console.log("resInfo: ", params);
      let initFile = this.resInfo.fileName;
      this.resInfo = { ...params };
      let resKey = this.resInfo.fileName.split(".")[0];
      this.$store.dispatch("tempEdit", {
        quesId: this.id,
        ansId: this.index,
        key: this.sym || "img",
        value: resKey,
        resUrl: this.resInfo.content,
        initFile:initFile
      });
    },
    */
    async handleSuccess(res, file) {
      let initFile = this.resInfo.fileName;
      console.log("res:", res, "file:", file);
      console.log("handleSuccess: ");
      this.resInfo.fileName = file.name;
      this.imgName = file.name.split(".")[0];
      await this.init();
      this.$store.dispatch("tempEdit", {
        quesId: this.id,
        ansId: this.index,
        key: this.sym || 'img',
        value: file.name.split(".")[0],
        resUrl: this.resInfo.content,
        isUpload: true,
        initFile:initFile
      });
      this.$message.success("上传成功!");
    },
    ...mapActions({
      updQuestionAnswerInfo: "updQuestionAnswerInfo"
    }),
    toggleDialog() {
      this.isShow = false;
      // this.$store.dispatch("selectImg", "");
    },
    beforeUpload(file) {
      // console.log('file: ', file);
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG && PNG格式!");
      }
      return isJPG;
    },
    setQuestionAnswerInfo() {
      if (this.index == "img" || this.index == "img2") {
        console.log('index: ', this.index);
        this.sym = this.index;
        this.questionAnswerInfo = this.$store.getters.singleGameAnswerRes(
          this.id
        )[this.sym];
      } else {
        this.sym = false;
        this.questionAnswerInfo = this.$store.getters.singleGameAnswerRes(
          this.id
        ).answer[this.index];
      }
    },
    async init() {
      return new Promise((resolve, reject) => {
        Request({
          url: `${resAdminHost.resAdminHost}/staticResUrl`,
          type: "post",
          data: {
            gameType: this.gameInfo.gameType,
            gameId: this.gameInfo.gameId,
            resKey: "images",
            resName: this.imgName
          }
        }).then(res => {
          console.log("res.data: ", res.data);
          this.resInfo.content = `${resAdminHost.staticResHost}/editRes/${
            res.data.staticUrl
          }`;
          this.resInfo.fileName = res.data.resName;


          // let resInfo = n;
          let resKey = this.resInfo.fileName.split(".")[0];
          let initFile = this.resInfo.fileName;
          this.initFile = initFile;
          this.$store.dispatch("tempEdit", {
            quesId: this.id,
            ansId: this.index,
            key: this.sym || "img",
            value: resKey,
            resUrl: this.resInfo.content,
            initFile: initFile
          });
          resolve();
        });
      });
    }
  },
  computed: {
    uploadUrl() {
      return `${resAdminHost.resAdminHost}/resReplace?gameType=${
        this.gameInfo.gameType
      }&gameId=${this.gameInfo.gameId}`;
    }
  },
  watch: {
    id(n, o) {
      this.setQuestionAnswerInfo();
      this.init();
    },
    index(n, o) {
      this.setQuestionAnswerInfo();
      this.init();
    },
    outerShow(n, o) {
      this.init();
    },
    resInfo(n, o) {
      // this.resInfo = { ...params };
      let resInfo = n;
      let resKey = resInfo.fileName.split(".")[0];
      this.$store.dispatch("tempEdit", {
        quesId: this.id,
        ansId: this.index,
        key: this.sym || "img",
        value: resKey,
        resUrl: this.resInfo.content,
        initFile: this.initFile
      });


      this.$store.dispatch("selectImg", resInfo);
    }
  },
  created: function() {
    this.setQuestionAnswerInfo();
    console.log("this.questionAnswerInfo:", this.questionAnswerInfo,this.sym);
    this.init();
  },
  components: {
    ImgSelect,
    ImageCard
  }
};
</script>
<style lang="less" scoped>
.wrap {
  height: 400px;
  display: flex;
  .editImg {
    width: 250px;
    height: 300px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 60px 40px 0 40px;
  }
  .resImg {
    width: 240px;
    height: 240px;
    overflow: hidden;
  }
  .upload {
    height: 28px;
    overflow: hidden;
    width: 100px;
  }
  .chooseBtn {
    margin-left: 10px;
  }
  .info {
    .label {
      display: inline-block;
      width: 120px;
      font-size: 20px;
      font-weight: 400;
    }
    .el-button {
      margin-left: 30px;
    }
    .el-input {
      width: 200px;
    }
    .el-select {
      width: 110px;
    }
    margin: 60px 0 0 20px;
    .resInfo {
      display: inline-block;
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 40px;
    }
    .item {
      width: 400px;
      height: 60px;
      line-height: 60px;
    }
  }
}
</style>
