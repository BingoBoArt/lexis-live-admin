<template>
    <div>
      <p class="game-title">选择游戏：{{gameName}}</p>
      <el-form-item label="游戏编号">
        <el-select v-model="gameId" placeholder="选择游戏编号" filterable>
          <el-option v-for="(item,key) in filterGameList" :key="key" :label="item.gameId" :value="item.gameId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="游戏链接">
          <a v-if='gameId' target="_blank" :href='checkGameLink'>{{checkGameLink}}</a>
          <span v-else>--</span>
      </el-form-item>
      <el-form-item label="游戏标题">
        <el-input v-model="currentValue.title"></el-input>
      </el-form-item>
      <el-form-item label="游戏描述">
        <el-input v-model="currentValue.describe"></el-input>
      </el-form-item>
      <el-form-item label="游戏封面">
        <ImgSelect class="imgSelect" v-model="gameCover" :getUrl="true"></ImgSelect>
        <!-- <img :src="currentValue.coverUrl" class="game-cover"> -->
        <el-button class='del' type="danger" size='mini' plain @click="deleteCover">删除封面</el-button>
      </el-form-item>
    </div>
</template>
<script>
import host from "@/common/host.js";
import Request from "@/common/request.js"
import { mapGetters, mapActions, mapMutations } from "vuex";
import ImgSelect from "@/components/Coms/ImgSelect";
import ComUtil from "@/common/util.js";
import Config from "@/common/config";

const default_value = {
  title: '',
  gameUrl: '',
  describe: '',
  coverUrl: ''
}
export default {
  components: {
    ImgSelect
  },
  props: {
    "gameType": {
      type: String,
      default: ''
    },
    "value": {
      type: Object,
      default: default_value
    }
  },
  data() {
    return {
      gameCover: "",
      gameId: "",
      tempGameInput: {} // 存储用户输入的数据，在各游戏切换时候保存
    };
  },
  watch: {
    gameCover: function(newValue){
      this.currentValue.coverUrl = newValue
    },
    gameId: function(newValue) {
      const game_zone =  Config.global_env == 'pro' ? 'game' : 'game-beta';
      let _gameUrl =  `http://file.lexislive.com.cn/live/${game_zone}/${this.gameType}/index.html?id=${newValue}&from=teacher`;
      this.currentValue.gameUrl = _gameUrl
    },
    value: function(newValue) {
      // 编辑详情，根据gameUrl 生成gameId
      if(!this.gameId && newValue.gameUrl){
        try{
          this.gameId = newValue.gameUrl.match(/id=(\d+)&?/)[1]
          this.tempGameInput[this.gameType] = {
            gameId: this.gameId,
            title: newValue.title,
            describe: newValue.describe,
            coverUrl: newValue.coverUrl
          }
          this.gameCover = newValue.coverUrl
        }catch(e){

        }
      }
    },
    gameType: function(newValue, oldValue) {
        this.tempGameInput[oldValue] = {
          gameId: this.gameId,
          title: this.currentValue.title,
          describe: this.currentValue.describe,
          coverUrl: this.currentValue.coverUrl
        }
        let tempGame = this.tempGameInput[newValue] || {};
        this.gameId = tempGame.gameId || "";
        this.currentValue.title = tempGame.title || Config.gameInfo[newValue]
        // this.currentValue.describe = tempGame.describe || Config.gameInfo[newValue]
        this.currentValue.describe = tempGame.describe || "" // 可为空
        // this.currentValue.coverUrl = tempGame.coverUrl || Config.gameCovers[newValue]
        this.currentValue.coverUrl = tempGame.coverUrl || ""
        this.gameCover = tempGame.coverUrl || ""
    }
  },
  computed: {
    ...mapGetters(["allGameList"]),
    checkGameLink() {
      // 显示https, 预览https。实际提交是http
      let _gameUrl = this.currentValue.gameUrl || "";
      console.log("_gameUrl", _gameUrl)
      if(_gameUrl){
        return _gameUrl.replace("http://", "https://")
      }else{
        return ""
      }
    },
    filterGameList() {
      if (this.allGameList && this.allGameList.length !== 0) {
        return this.allGameList.filter(item => {
          return item.gameType == this.gameType;
        });
      } else {
        return "";
      }
    },
    gameName() {
      return Config.gameInfo[this.gameType] || "--"
    },
    currentValue: {
        // 动态计算currentValue的值
        get: function() {
            return this.value;
        },
        set: function(val) {
            console.log("val", val)
            this.$emit('input', val);
        }
    }
  },
  methods: {
    ...mapActions(["getAllGameList"]),
    deleteCover() {
      this.gameCover = ""
    }
  },
  mounted() {
    this.getAllGameList();
  }
};
</script>
<style lang="less" scoped>
.game-title {
  color: #666;
  line-height: 70px;
  margin-left: 50px;
  font-size: 14px;
}
.game-cover{
  width: 400px;
}
</style>
