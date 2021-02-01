<template>
  <div class="wrap">
    <breadcrumb></breadcrumb>
    <div class="content-main">
      <el-form :inline="true">
        <el-form-item label="游戏类型">
          <el-select v-model="selectValue.gameType" placeholder="选择游戏类型" @change="setInit">
            <el-option v-for="(item,index) in allGameType" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏编号">
          <el-select v-model="selectValue.gameId" placeholder="选择游戏编号" @change="onSelectGameId(selectValue)" filterable>
            <el-option v-for="(item,key) in filterGameList" :key="key" :label="item.gameId" :value="item.gameId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-button type="info" @click="preGameInfo(selectValue)">确定</el-button> -->
        <el-button type="primary" icon="el-icon-upload" @click="preDeploy(selectValue)">更新部署</el-button>
        <el-button type="success" icon="el-icon-plus" @click="createGame(selectValue)">创建游戏</el-button>
      </el-form>
      <!-- 游戏素材列表 -->
      <div class="table-wrapper" v-loading='tableLoading'>
        <a class="check-link" target="_blank" v-show="checkGameLink" :href="checkGameLink">查看游戏：{{checkGameLink}}</a>
        <el-table :data="[1]" border style="width:100%;margin-bottom: 40px;" v-if="rerenderTable && currentGameConfig.main">
          <el-table-column v-for="(item, index) in currentGameConfig.main" :label="item.label" :key="index" :width="columWidth(item.type)">
            <template slot-scope="scope">
                <div class='answer' v-if="item.type == 'image'">
                  <!-- 提干中的图片一 -->
                  <img class="option-img" :src="ResPathMap[dataJson.main[item.dataKey]] && ResPathMap[dataJson.main[item.dataKey]].url">
                  <span class="picName" >{{dataJson.main[item.dataKey]}}</span>
                  <el-button type="primary" plain icon="el-icon-edit" size='mini' @click="showEdit(scope.row.id, index, dataJson.main[item.dataKey], item.dataKey)"></el-button>
                </div>
                <div class='title' v-if="item.type != 'image' && item.type != 'total_time'">
                  <input type="text" v-model="dataJson.main[item.dataKey]" :placeholder="`${item.default ? ('默认: ' + item.default) : ''}`">
                </div>
                <!-- 中场休息 -->
                <div v-if='item.type == "total_time"'>
                  <input type="number" max='99' v-model="total_time_minutes" :placeholder="`${item.default ? ('默认: ' + item.default) : ''}`">分钟(最大为99)
                </div>
                <div class='select' v-if="item.type == 'select'">
                  <el-select v-model="dataJson.main[item.dataKey]">
                    <el-option
                      v-for="item_inner in item.options"
                      :key="item_inner.value"
                      :label="item_inner.label"
                      :value="item_inner.value"
                      >
                    </el-option>
                  </el-select>
                </div>
            </template>
          </el-table-column>
        </el-table>
        
        <el-table :data="dataJson.question_list" border style="width:100%" v-if="rerenderTable">
          <el-table-column label="index" width="60">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in currentGameConfig.question" :label="item.label" :key="index" :width="columWidth(item.type)">
            <template slot-scope="scope">
              <div class='answer' v-if="item.type == 'image'">
                <!-- 提干中的图片一 -->
                <img class="option-img" :src="ResPathMap[scope.row[item.dataKey || 'img']] && ResPathMap[scope.row[item.dataKey || 'img']].url">
                <span class="picName">{{scope.row[item.dataKey || 'img']}}</span>
                <el-button type="primary" plain icon="el-icon-edit" size='mini' @click="showEdit(scope.row.id, index, scope.row[item.dataKey || 'img'], item.dataKey, 'title')"></el-button>
              </div>
              <div class='title' v-if="item.type == 'title'">
                <input type="text" v-model="scope.row[item.dataKey || 'title']" :readonly="item.readOnly">
              </div>
              <div class='title' v-if="item.type == 'rightAnswer'">
                <input type="text" v-model="scope.row[item.dataKey]" placeholder="正确答案">
              </div>
              <div class='number' v-if="item.type == 'number'">
                <input type="number" v-model="scope.row[item.dataKey]">
              </div>
              <div class='select' v-if="item.type == 'select'">
                <el-select v-model="scope.row[item.dataKey]" @change="handleOptionValueChange(scope.$index)">
                  <el-option
                    v-for="item_inner in item.options"
                    :key="item_inner.value"
                    :label="item_inner.label"
                    :value="item_inner.value"
                    >
                  </el-option>
                </el-select>
              </div>
              <div class='score' v-if="item.type == 'score'">
                <el-select class="aValue" v-model="scope.row.score" placeholder="分值" size='mini'>
                  <el-option :label="1" :value="1" />
                  <el-option :label="2" :value="2" />
                  <el-option :label="3" :value="3" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="选项" v-if="currentGameConfig.option" width="420">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.answer" :key="index" class="clearfix">
                  <div class='left answer' v-if="currentGameConfig.option.type == 'image'">
                    <!-- 选项是图片 -->
                    <img class="option-img" :src="ResPathMap[item.img] && ResPathMap[item.img].url">
                    <span class="picName" :title='item.img'>{{item.img}}</span>
                    <el-button type="primary" plain icon="el-icon-edit" size='mini' @click="showEdit(scope.row.id, index, item.img, currentGameConfig.option.dataKey || 'img', 'option')"></el-button>
                    <!-- <i class="el-icon-close" v-else></i> -->
                    <el-select class="aValue" v-model="item[currentGameConfig.option.rightKey || 'right']" placeholder="正误" size='mini' @change="handleOptionRightChange(scope.$index, item, index)">
                      <el-option label="正确" :value="1" />
                      <el-option label="错误" :value="0" />
                    </el-select>
                    <i class="el-icon-check" v-if="item.right == 1"></i>
                  </div>

                  <div class='left answer' v-if="currentGameConfig.option.type == 'text'">
                    <!-- 选项是文字 -->
                    <input type="text" v-model="item[currentGameConfig.option.dataKey || 'info']" placeholder="答案选项信息" @change="handleOptionValueChange(scope.$index, item, index)">
                    <el-select class="aValue" v-model="item[currentGameConfig.option.rightKey || 'key']" placeholder="正误" size='mini' @change="handleOptionRightChange(scope.$index, item, index)">
                      <el-option label="正确" :value="1" />
                      <el-option label="错误" :value="0" />
                    </el-select>
                  </div>

                  <div class="left op-area" v-if="currentGameConfig.option.canAddOrReduceOption">
                    <a href="javascript:void(0);" class="op-btn" @click="handleOptionsRemove(scope.$index, item, index)">
                      <i class="el-icon-minus"></i>
                    </a>
                    <a href="javascript:void(0);" class="op-btn" @click="handleOptionsAdd(scope.$index, item, index)">
                      <i class="el-icon-plus"></i>
                    </a>
                  </div>
                </div>
                <!-- fillBlank特殊处理 -->
                <div class="clearfix right-options" v-if="selectValue.gameType == 'fillBlank'">
                  <div class="left right-option" v-for="(item_inner, index_inner) in scope.row.answerIndex" :key="index_inner">
                    <el-tag size="mini" type="success">{{scope.row.answer[item_inner][currentGameConfig.option.dataKey || 'info']}}</el-tag>
                  </div>
                </div>
            </template>
          </el-table-column>
          
          <!-- 老虎机 需要多项类似Option的配置 -->
          <el-table-column v-if="currentGameConfig.option_list"  v-for="(option_item, option_index) in currentGameConfig.option_list" :label="option_item.label" :key="option_index" :width="option_item.type == 'text_image' ? 330 : 420">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row[option_item.optionKey]" :key="index" class="clearfix" :class="option_item.type == 'text_image' ? 'text_image_wrapper' : ''">
                  <div class='left answer' v-if="option_item.type == 'image'">
                    <!-- 选项是图片 -->
                    <img class="option-img" :src="ResPathMap[item.img] && ResPathMap[item.img].url">
                    <span class="picName" :title='item.img'>{{item.img}}</span>
                    <el-button type="primary" plain icon="el-icon-edit" size='mini' @click="showEdit(scope.row.id, index, item.img, option_item.dataKey || 'img', 'option', option_item.optionKey)"></el-button>
                    <!-- <i class="el-icon-close" v-else></i> -->
                    <el-select class="aValue" v-model="item[option_item.rightKey || 'right']" placeholder="正误" size='mini'>
                      <el-option label="正确" :value="1" />
                      <el-option label="错误" :value="0" />
                    </el-select>
                    <i class="el-icon-check" v-if="item.right == 1"></i>
                  </div>

                  <div class='left answer' v-if="option_item.type == 'text'">
                    <!-- 选项是文字 -->
                    <input type="text" v-model="item[option_item.dataKey || 'info']" placeholder="答案选项信息">
                    <el-select class="aValue" v-model="item[option_item.rightKey || 'key']" placeholder="正误" size='mini'>
                      <el-option label="正确" :value="1" />
                      <el-option label="错误" :value="0" />
                    </el-select>
                  </div>

                  <div class='left answer text_image_answer' v-if="option_item.type == 'text_image'">
                    <!-- 选项是文字+图片 -->
                    <div class="option_text">
                      <input class="" type="text" v-model="item[option_item.textKey || 'text']" placeholder="答案选项信息">
                    </div>

                    <div class="option_img">
                      <img class="option-img" :src="ResPathMap[item.img] && ResPathMap[item.img].url">
                      <span class="picName" :title='item.img'>{{item.img}}</span>
                      <el-button type="primary" plain icon="el-icon-edit" size='mini' @click="showEdit(scope.row.id, index, item.img, option_item.imageKey || 'img', 'option', option_item.optionKey)"></el-button>
                      <el-button type="warning" plain icon="el-icon-delete" size='mini' @click="deleteImg(scope.row.id, index, item.img, option_item.imageKey || 'img', 'option', option_item.optionKey)"></el-button>
                    </div>

                    <el-select class="aValue option_select" v-model="item[option_item.rightKey || 'key']" placeholder="正误" size='mini'>
                      <el-option label="正确" :value="1" />
                      <el-option label="错误" :value="0" />
                    </el-select>
                  </div>

                  <div class="left op-area" v-if="option_item.canAddOrReduceOption">
                    <a href="javascript:void(0);" class="op-btn" @click="handleOptionsRemove(scope.$index, item, index, option_item.optionKey)">
                      <i class="el-icon-minus"></i>
                    </a>
                    <a href="javascript:void(0);" class="op-btn" @click="handleOptionsAdd(scope.$index, item, index, option_item.optionKey)">
                      <i class="el-icon-plus"></i>
                    </a>
                  </div>
                </div>
                <!-- fillBlank特殊处理 -->
                <div class="clearfix right-options" v-if="selectValue.gameType == 'fillBlank'">
                  <div class="left right-option" v-for="(item_inner, index_inner) in scope.row.answerIndex" :key="index_inner">
                    <el-tag size="mini" type="success">{{scope.row.answer[item_inner][option_item.dataKey || 'info']}}</el-tag>
                  </div>
                </div>
            </template>
          </el-table-column>

          <el-table-column label="Action" width="320" v-if="selectValue.gameType != 'halfTime'">
            <template slot-scope="scope">
              <div class='action'>
                <el-button :disabled="dataJson.question_list && dataJson.question_list.length <= 1" type="danger" plain size='mini' icon="el-icon-delete" @click='deleteQuestion(scope.row.id)'>删除</el-button>
                <UpDownArray :id="scope.row.id" :list="dataJson.question_list" :gameType="selectValue.gameType" :gameId="selectValue.gameId" />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <p class="no-data" v-if="!(this.selectValue.gameType && this.selectValue.gameId)">
          请先选择游戏类型
        </p>
        <div class="addQues" v-if="this.selectValue.gameType && this.selectValue.gameId && rerenderTable && selectValue.gameType != 'halfTime'">
          <el-button type="success" icon="el-icon-plus" @click='onAddQuestion'>添加题目</el-button>
        </div>
      </div>

      <el-dialog title="选项编辑" :visible.sync="dialogVisible" width="80%">
        <ImgSelect v-model="editImg"></ImgSelect>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveEdit()">保 存</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Common/Breadcrumb";
import UpDownArray from "./Coms/UpDownArray";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Request from "@/common/request.js";
import Config from "@/common/config.js";
import host from "@/common/host.js";
import GameConfig from "@/common/game_config.js"
import ImgSelect from './Coms/ImgSelect'

export default {
  data() {
    return {
      imgPath: host.staticResHost,
      dialogVisible: false,
      rerenderTable: false,
      selectValue: {
        gameId: "",
        gameType: ""
      },
      originImg: {},
      editImg: {},
      hasQuery: false,
      ResPathMap: {},
      canShow: true,
      localLoading: false,
      GameConfig: GameConfig,
      newImgs: [],
      TempModels: {
      }
    };
  },
  computed: {
    // 中场休息总时间 total_time单位为ms，total_time_minutes为分钟
    total_time_minutes: {
      set: function(value) {
          this.dataJson.main['total_time'] = value*60*1000;
      },
      get: function() {
          return this.dataJson.main['total_time']/(60*1000);
      }
    },
    ...mapGetters([
      "allGameType",
      "dataJson",
      "tableLoading",
      "allGameList",
      "questionList",
    ]),
    checkGameLink() {
      let _gameUrl = "";
      if(this.selectValue.gameType && this.selectValue.gameId){
        const game_zone =  Config.global_env == 'pro' ? 'game' : 'game-beta';
        _gameUrl =  `https://file.lexislive.com.cn/live/${game_zone}/${this.selectValue.gameType}/index.html?id=${this.selectValue.gameId}&from=teacher`;
      }
      return _gameUrl;
    },
    currentGameConfig() {
      return GameConfig[this.selectValue.gameType];
    },
    filterGameList() {
      if (this.allGameList && this.allGameList.length !== 0) {
        return this.allGameList.filter(item => {
          return item.gameType == this.selectValue.gameType;
        });
      } else {
        return "";
      }
    }
  },
  
  watch: {
    'dataJson': {
      handler: async function(newValue, oldValue) {
        console.log("watch dataJson", newValue)
        let _dataJson = Object.assign({}, newValue);
        let gameId = this.selectValue.gameId;
        // this.canShow = false;
        this.$store.dispatch("toggleLoading", true);
        this.handleDataJsonImgKeys();
        this.$nextTick(() => {
          // this.tableLoading = false;
          this.$store.dispatch("toggleLoading", false);
          // this.canShow = true;
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      init: "getAllGameList",
      toggleLoading: "toggleLoading",
      getGameInfo: "getGameInfo",
      updateQuestionSort: "updateQuestionSort",
      addQuestion: "addQuestion",
      updateDataJson: "updateDataJson"
    }),
    async handleDataJsonImgKeys() {
      let _dataJson = this.dataJson;
      let img_keys = []
      for(var i=0,len=_dataJson.question_list.length; i<len; i++){
        let item = _dataJson.question_list[i]
        let item_str = JSON.stringify(item);
        /**
         * 正则匹配包含img img* 开头的字段，去获取资源路径
         */
        var regx = (/("|')img.*?\1\s*:\s*("|')(.*?)\2/mgi)
        var arr = null;
        var img_list = [];
        while ((arr = regx.exec(item_str)) != null){
          try{
            var file_name = arr[3];
            img_list.push(file_name);
          }catch(e){
            
          }
        }
        for(var k=0,len_k=img_list.length; k<len_k; k++){
          let img = img_list[k];
          img_keys.push(img);
          await this.getStaticPath(img)
        }
      }
      return img_keys;
    },
    // 删除选项
    handleOptionsRemove(question_index, option_item, option_index, optionKey) {
      let question_list = this.dataJson.question_list;
      let question = question_list[question_index]
      question[optionKey || 'answer'].splice(option_index, 1);
      this.$store.dispatch("updateDataJson", this.dataJson);
      this.handleOptionRightChange(question_index, option_item, option_index, "remove", optionKey)
    },
    // 添加选项
    handleOptionsAdd(question_index, option_item, option_index, optionKey) {
      let question_list = this.dataJson.question_list;
      let question = question_list[question_index]
      let new_option = JSON.parse(JSON.stringify(question[optionKey || 'answer'][option_index]));
      delete new_option.right
      delete new_option.key
      question[optionKey || 'answer'].splice(option_index + 1, 0, new_option);
      this.$store.dispatch("updateDataJson", this.dataJson);
    },
    changeFillBlankAnswerTitle(question_index) {
      let question_list = this.dataJson.question_list;
      let question = question_list[question_index]
      var _index = 0 
      question.answerTitle = question.title;
      if(question.isLetter){
        // 字母拼单词类型，比如 this is a # # # #.  (b o o k) 最终需要吧book内部空格去除
        // 把相连的#号之间的空格去除
        question.answerTitle = question.answerTitle.replace(/((#\s+)*)#/mg, function(a,b){return a.replace(/\s+/mg, "")})
      }
      question.answerTitle = question.answerTitle.replace(/#/mg, function(a, b, c){
        let _rightItemIndex = question.answerIndex[_index];
        if(_rightItemIndex !== undefined){
          _index++;
          return question.answer[_rightItemIndex].info;
        }else{
          return "#"
        }
      })
      console.log("question.answerTitle", question.answerTitle)
      this.$store.dispatch("updateDataJson", this.dataJson);
    },
    // input值发生变化，比如直接修改值
    handleOptionValueChange(question_index, option_item, option_index) {
      let question_list = this.dataJson.question_list;
      let question = question_list[question_index]
      if(!this.currentGameConfig.option.showRightOption){
        return;
      }

      switch(this.selectValue.gameType){
        case 'fillBlank':
          // fillBlank填字游戏处理
          // 修改title.answer 字段
          this.changeFillBlankAnswerTitle(question_index);
        break;
      }
    },
    // 处理选项正确、错误改变
    handleOptionRightChange(question_index, option_item, option_index, type="change", optionKey='option') {

      let question_list = this.dataJson.question_list;
      let question = question_list[question_index]
      if(!this.currentGameConfig[optionKey].showRightOption){
        return;
      }

      switch(this.selectValue.gameType){
        case 'fillBlank':
          // fillBlank填字游戏处理

          // 生成answerIndex 字段 如: [3, 2]
          if((option_item.right == 1 || option_item.key == 1) && type == 'change'){
            // 正确
            question.answerIndex.push(option_index);
          }else{
            // 改为“错误” 或者删除
            let _index = question.answerIndex.indexOf(option_index);
            question.answerIndex.splice(_index, 1);
            if(type == 'remove'){
              // 删除情况下，需要更新索引
              question.answerIndex = question.answerIndex.map((item) => {
                if(item > option_index){
                  return item - 1
                }else{
                  return item
                }
              })
            }
          }

          // 修改title.answer 字段
          this.changeFillBlankAnswerTitle(question_index);
        break;
      }
    },
    /**
     * 由于v-model限制，暂只支持一级
     */
    handleDataKey(data, key) {
      if(data && key){
        let keys = key.split(".");
        let data_value = data;
        for(var i=0,len=keys.length; i<len; i++){
          data_value = data_value[keys[i]]
        }
        console.log("handleDataKey", data, key, data_value)
        return data_value;
      }else{
        return ""
      }
    },
    // 获取资源访问路径
    async getStaticPath(key) {
      if(!key){
        return;
      }
      if(this.ResPathMap[key]){
        return new Promise((resolve) => {resolve(this.ResPathMap[key])})
      }
      let gameId = this.selectValue.gameId;
      let res = await Request({
        url: `${host.resAdminHost}/staticResUrl`,
        type: "post",
        data: {
          gameId: gameId,
          resName: key
        }
      })
      if(res && res.code == 0){
        let path = `${host.staticResHost}/editRes/${ res.data.staticUrl }`
        if(res.data.staticUrl){
          // this.ResPathMap[key] = {
          //   url: path,
          //   resName: res.data.resName // 包含后缀
          // }
          // console.log("this.ResPathMap", this.ResPathMap)
          this.$set(this.ResPathMap, key, {
            url: path,
            resName: res.data.resName // 包含后缀
          })
          this.$nextTick(() => {})
        }
        return path
      }else{
        return '';
      }
    },
    // 添加题目
    onAddQuestion() {
      if (
        this.selectValue.gameType &&
        this.selectValue.gameId &&
        this.hasQuery
      ) {
        this.rerenderTable = false;
        this.addQuestion();
        this.$nextTick(() => {
          this.rerenderTable = true;
        });
      } else {
        this.$message.warning("尚未选中游戏！");
      }
    },
    // 创建游戏
    createGame() {
      if (this.selectValue.gameType) {
        this.$confirm("确认创建新游戏吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          this.toggleLoading(true);
          let res = await Request({
            url: `${host.resAdminHost}/createNewGame`,
            type: "post",
            data: { gameType: this.selectValue.gameType, gameId: this.selectValue.gameId}
          });
          let deploy = await Request({
            url: `${host.resAdminHost}/deployLiveGame`,
            type: "post",
            data: {
              gameType: this.selectValue.gameType,
              gameId: res.data.gameId
            }
          });
          if (deploy.data.success) {
            this.$message.success(
              `已成功创建${this.selectValue.gameType}/${res.data.gameId}`
            );
            this.toggleLoading(false);
            this.selectValue.gameId = res.data.gameId;
          }
          this.init();
          this.preGameInfo(this.selectValue);
        });
      } else {
        this.$message.warning("没有选中游戏类型！");
      }
    },
    // 选择游戏编号
    async onSelectGameId(params) {
      this.ResPathMap = {};
      this.canShow = false;
      this.preGameInfo(params)
    },
    async preGameInfo(params) {
      // this.init();
      if (params.gameId && params.gameType) {
        await this.getGameInfo(params);
        this.hasQuery = true;
        this.$nextTick(() => {
          this.rerenderTable = true;
        });
      } else {
        this.$message({
          type: "warning",
          message: "没有选中游戏!"
        });
      }
    },
    // 部署游戏
    preDeploy(params) {
      if (params.gameId && params.gameType && this.hasQuery) {
        this.$confirm("每次部署都可能造成CDN缓存更新，确认部署游戏的修改吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          this.toggleLoading(true);
          await Request({
            type: 'post',
            url: `${host.resAdminHost}/updateGameDataJson`,
            data: {
              dataJson: JSON.stringify(this.dataJson),
              gameType: this.selectValue.gameType,
              gameId: this.selectValue.gameId
            }
          })

          Request({
            url: `${host.resAdminHost}/deployLiveGame`,
            type: "post",
            data: {
              gameType: this.selectValue.gameType,
              gameId: this.selectValue.gameId,
              newImgs: this.newImgs.join("##") // 只有修改后的图片给予预热
            }
          }).then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "部署成功!"
              });
              this.preGameInfo(this.selectValue);
              this.toggleLoading(false);
              this.newImgs = [];
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "没有选中游戏!"
        });
      }
    },
    
    /**
     * 可清除图片
     * type: option(选项中的图片) | title(题干中的图片)
     */
    deleteImg(question_id, option_id, fileName, dataKey, type='option', optionKey="answer") {
      //先清空 toplaceimg和 tempEdit
      let questionList = this.questionList

      if (type == 'title') {
          questionList[question_id - 1][dataKey] = ""
      } else if(type == 'option') {
          questionList[question_id - 1][optionKey][option_id][dataKey] = ""
      }
    },
    /**
     * 显示编辑图片
     * type: option(选项中的图片) | title(题干中的图片)
     */
    showEdit(question_id, option_id, fileName, dataKey, type='option', optionKey="answer") {
      //先清空 toplaceimg和 tempEdit
      this.dialogVisible = true;
      this.selectImg = {
        resName: fileName && this.ResPathMap[fileName] && this.ResPathMap[fileName].resName || "", // 若原数据为空图片，则fileName为空
        question_id: question_id,
        option_id: option_id,
        dataKey: dataKey,
        optionKey: optionKey,
        type: type
      }
      console.log("this.selectImg", this.selectImg)
    },
    ifExists(newFileName) {

    },
    // 保存图片选择， 需要替换图片，生成res.json
    async saveEdit() {
      let editImg = this.editImg || {}
      let questionList = this.questionList
      this.dialogVisible = false;
      
      if(!editImg.content){
        return;
      }

      if(!editImg.fileName){
        // filename不存在 容错
        let arr = editImg.content.split(".");
        editImg.fileName = editImg.resId + "." + arr[arr.length - 1]
      }


      // 修改空格为_
      editImg.fileName = editImg.fileName.replace(/\s+/mg, "_");


      let newFileName = editImg.fileName.split(".")[0]
      if(!(/^[\w\d_-]+$/).test(newFileName)){
        this.$message({
            type: 'warning',
            message: '该图片文件名含有非法字符(正确格式 字母、数字、-、_ )'
        });
        return;
      }


      const changePic = async () => {
        this.ResPathMap[newFileName] = {
          url: editImg.content,
          resName: editImg.fileName // 包含后缀
        }
        console.log("changepic", this.ResPathMap)

        this.newImgs.push(editImg.fileName);

        let params = {
          ...this.selectValue, // gameType, gameId
          resUrl: editImg.content, // resUrl 目标资源的全路径，供下载
          fileName: editImg.fileName, // 目标资源的全路径的文件名，
          gameData: JSON.stringify(questionList), // question_list
          initFile: this.selectImg.resName // 原始文件 xx.jpg
        };

        if(!params.resUrl){
          return;
        }
        
        await Request({
          url: `${host.resAdminHost}/resReplace`,
          type: "get",
          data: params
        });


        let {question_id, option_id, dataKey, type, optionKey} = this.selectImg;
        if (type == 'title') {
            questionList[question_id - 1][dataKey] = newFileName
        } else if(type == 'option') {
            questionList[question_id - 1][optionKey][option_id][dataKey] = newFileName
        }
        this.dataJson.question_list = questionList
        console.log("questionList", questionList)
        this.$store.dispatch("updateDataJson", this.dataJson);
      }

      let imgKeys = await this.handleDataJsonImgKeys();
      if(imgKeys && imgKeys.indexOf(newFileName) > -1){

        /*
        // 已经存在同名图片,将文件名后增加随机(这样即使是老图，也会增加随机，导致不能复用之前的图)
        let f_arr = editImg.fileName.split(".");
        try{
          f_arr[0] = f_arr[0] + "_" + (Math.ceil(Math.random() * 1000));
          editImg.fileName = f_arr.join(".");
        }catch(e){

        }
        // 更新newFileName
        newFileName = editImg.fileName.split(".")[0]
        changePic();
        */

        // 已经存在同名图片，需要提示
        this.$confirm(`已存在同名的图片：${newFileName}，是否替换该图片？`, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(async () => {
          // 点击确定
          changePic();
        }).catch(() => {
          // 点击取消     
        });
      }else{
        changePic();
      }
    },
    setInit() {
      this.selectValue.gameId = "";
      this.rerenderTable = false;
    },
    // 删除一道题
    deleteQuestion(id) {
      this.$confirm("确认删除改题吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let list = [...this.dataJson.question_list];
        list.splice(id - 1, 1);
        this.updateQuestionSort(list);
      });
    },
    // 计算显示宽度
    columWidth(type) {
      const width_maps = {
        id: 60,
        title: 260,
        score: 160,
        action: 280,
        image: 240,
        default: 280
      }
      return width_maps[type] || width_maps['default']
    }
  },
  created: async function() {
    this.init();
  },
  components: {
    Breadcrumb,
    UpDownArray,
    ImgSelect
  }
};
</script>
<style lang='less' scoped>
.table-wrapper{
  min-height: 200px;
}
.wrap {
  width: 100%;
  .allGame {
    margin-top: 80px;
  }
  .answer {
    display: flex;
    flex-wrap: wrap;
    // width: 100%;
    align-items: center;
    align-content: center;
    min-height: 50px;
    .picName {
      display: inline-block;
      width: 115px;
      padding-right: 2px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-button {
      margin-left: 5px;
    }
    .el-icon-check{
        margin-left: 10px;
        color: green;
    }
    .el-icon-close{
        margin-left: 10px;
        color: red;
    }
    .option-img{
      width: 40px;
      height: 40px;
      margin-right: 3px;
    }
  }
  .addQues {
    margin-top: 20px;
  }
  .aValue {
    width: 110px;
    margin-left: 5px;
  }
  .no-data {
    text-align: center;
    margin-top: 50px;
    color: #9a9a9a;
  }
  input {
    height: 30px;
    line-height: 30px;
    border: none;
    border-bottom: 1px solid;
    outline: medium;
    background: transparent;
    width: 160px;
  }
  .op-area{
    height: 50px;
    line-height: 50px;
    .op-btn{
      float: left;
      font-size: 14px;
      color: #a7a7a7;
      margin-left: 10px;
      &:hover{
        color: #409eff;
      }
    }
  }
  .title input{
    width: 80%;
  }
}
.right-options{
  .right-option{
    margin-right: 4px;
  }
}
.check-link{
  color: #333;
  display: block;
  margin: 10px 0;
  text-decoration: underline;
}
.text_image_wrapper{
  .text_image_answer{
    display: block;
    align-items: center;
    margin: 10px 0;
    .option_text{
    }
    .option_img{
      margin-top: 10px;
      display: flex;
      align-items: center;
      img{
        margin-left: 0;
      }
      .picName{
        width: 45px;
      }
    }
    .option_select{
      margin-top: 10px;
      margin-left: 0;
    }
  }
  .op-area{
    margin-top: 60px;
    margin-left: 60px;
  }
}
</style>
