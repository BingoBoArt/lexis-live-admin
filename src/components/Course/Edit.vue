<template>
  <div>
    <breadcrumb v-if="!lessonAdd"></breadcrumb>
    <el-breadcrumb v-if="lessonAdd" class="breadcrumb" separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>课件创建</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button v-if="!lessonAdd" type="primary" @click="goBack" icon="el-icon-arrow-left" class="back">返回</el-button>
    <div class="content-main" v-loading="loading">
      <el-form class="form-wrap" :model="ruleForm" ref="ruleForm" label-position="right" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="课件编号" :rules="rules.normal" prop="lessonNoName">
              <el-input class="lessonNo-lesson" v-model.trim="ruleForm.lessonNoName" placeholder="请输入课件编号" prop="lessonNoName" clearable></el-input>
            </el-form-item>

            <el-form-item label="课件排序" :rules="rules.checkInterNumLimit" prop="seq">
              <el-input class="lessonNo-lesson" v-model="ruleForm.seq" placeholder="课件排序(数字)" clearable></el-input>
            </el-form-item>

            <el-form-item label="英文名称" :rules="rules.normal" prop="titleEn">
              <el-input class="title-lesson" placeholder="请输入课件英文名称" v-model.trim="ruleForm.titleEn" clearable></el-input>
            </el-form-item>

            <el-form-item label="中文名称" :rules="rules.normal" prop="titleCh" >
              <el-input class="title-lesson" placeholder="请输入课件中文名称" v-model.trim="ruleForm.titleCh" clearable></el-input>
            </el-form-item>
            <el-form-item label="重点描述" :rules="rules.normal" prop="keyContent">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="1000" show-word-limit v-model="ruleForm.keyContent" 
                        wrap="hard" class="title-lesson" placeholder="请输入课件重点(注意数量不要超过1000)" clearable></el-input>
            </el-form-item>
            <el-form-item label="课件描述" :rules="rules.normal" prop="intro">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="240" show-word-limit v-model.trim="ruleForm.intro" 
                        class="lessonNo-lesson" placeholder="对课件的描述(注意数量不要超过240)" clearable ></el-input>
            </el-form-item>
            <el-form-item label="课件付费" :rules="rules.normal" prop="payType">
              <el-select v-model="ruleForm.payType" clearable placeholder="选择支付类型">
                <el-option v-for="(item,index) in payTypes" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图缩略图：">
            <ImgSelect :selectItemProp="selectItem" v-model="ruleForm.cover"></ImgSelect>
          </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="课件属性">
          <el-row class="row-bg select-lesson-wrap">
            <el-col :span="4">
              <div class="se-level">
                <el-form-item label="" :rules="rules.normal" prop="selectLevel">
                  <el-select :disabled="!lessonAdd" v-model="ruleForm.selectLevel" placeholder="level" @change="levelChange">
                    <el-option v-for="(item, index) in selectItems" :key="index" :label="'level' + item.level" :value="index">
                    </el-option>
                  </el-select>
                  <el-select :disabled="!lessonAdd" v-model="ruleForm.selectLevel" placeholder="等级" @change="levelChange">
                    <el-option v-for="(item, index) in selectItems" :key="index" :label="'等级' + item.level" :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="se-type">
                <el-form-item label="" :rules="rules.normal" prop="selectUnit">
                  <el-select :disabled="!lessonAdd" v-model='ruleForm.selectUnit' placeholder="请选择Unit" @change="unitChange">
                    <el-option v-for="(item, index) in selectUnits || []" :key="index" :label="item.nameEn" :value="index">
                    </el-option>
                  </el-select>
                  <el-select :disabled="!lessonAdd" v-model='ruleForm.selectUnit' placeholder="请选择Unit" @change="unitChange">
                    <el-option v-for="(item, index) in selectUnits || []" :key="index" :label="item.nameCh" :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="se-unit">
                <el-form-item label="" :rules="rules.normal" prop="selectBlock">
                  <el-select :disabled="!lessonAdd" v-model='ruleForm.selectBlock' placeholder="请选择block" @change="blockChange">
                    <el-option v-for="(item, index) in selectBlocks || []" :key="index" :label="'block:'+item.blockNoName" :value="index">
                    </el-option>
                  </el-select>
                  <el-select :disabled="!lessonAdd" v-model='ruleForm.selectBlock' placeholder="请选择block" @change="blockChange">
                    <el-option v-for="(item, index) in selectBlocks || []" :key="index" :label="item.targetTitle" :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="se-lesson">
                <el-form-item label="" :rules="rules.normal" prop="selectLesson">
                  <el-select :disabled="!lessonAdd" v-model="ruleForm.selectLesson" placeholder="请选择lesson" @change="lessonChange">
                    <el-option v-for="(item, index) in selectLessons || []" :key="index" :label="item.lesson" :value="index" :disabled="item.status==2?true:false">
                    </el-option>
                  </el-select>
                  <el-select :disabled="!lessonAdd" v-model="ruleForm.selectLesson" prop="lessonNo" placeholder="请选择lesson" @change="lessonChange">
                    <el-option v-for="(item, index) in selectLessons || []" :key="index" :label="item.lesson" :value="index" :disabled="item.status==2?true:false">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="se-lesson">
                <el-form-item label="" :rules="rules.normal" prop="selectLessonType">
                  <el-select :disabled="!lessonAdd" v-model="ruleForm.selectLessonType" placeholder="单词课">
                    <el-option v-for="(item, index) in lessonTypes" :key="index" :label="item.lessonTypeEn" :value="item.lessonType">{{item.lessonTypeEn}}
                    </el-option>
                  </el-select>
                  <el-select :disabled="!lessonAdd" v-model="ruleForm.selectLessonType" placeholder="单词课">
                    <el-option v-for="(item, index) in lessonTypes" :key="index" :label="item.lessonTypeCh" :value="item.lessonType">{{item.lessonTypeCh}}
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <!-- 显示模版 -->
      <ul class="layer-wrap clearfix" v-show="!lessonAdd">
        <li v-for="(item, index) in lessonSceneList" :key="index" @mouseover="handleMouseover(index)" @mouseout="activeIndex=-1">
          <div class="layout-top-wrap">
            <!-- story -->
            <div class="template-show story-show" v-if="item.story && (item.story.title || item.story.img || item.story.text)">
              <p class="title textOverflow">{{item.story.title || (item.story.keyword && item.story.keyword.length ? 'ZoomIn & ZoomOut' : '')}}</p>
              <img v-if="item.story.img && item.story.img.content" :src="item.story.img && item.story.img.content">
              <!-- story 内部 flashcard -->
              <div class="tag-list" v-if="item.story.flashcard && item.story.flashcard.length">
                <el-tag size="mini" class="tag" type="warning" v-for="(inner_item, inner_index) in item.story.flashcard" :key="inner_index">
                  {{inner_item.word}}
                </el-tag>
              </div>
              <!-- story 内部 zoom(keyword) -->
              <div class="tag-list" v-if="item.story.keyword && item.story.keyword.length">
                <el-tag size="mini" class="tag" type="primary" v-for="(inner_item, inner_index) in item.story.keyword" :key="inner_index">
                  {{inner_item.text}}
                </el-tag>
              </div>
              <!-- story + question -->
              <div class="tag-list" v-if="item.question && item.question.quesId">
                <el-tag size="mini" class="tag" type="primary">
                  {{item.question.stem.text || ""}}
                </el-tag>
              </div>

              <p class="text textOverflow" v-html="item.story.text || ''"></p>
            </div>
            <!-- wordbank -->
            <div class="template-show wordbank-show" v-else-if="item.wordbank && item.wordbank.wordbanks && item.wordbank.wordbanks.length">
              <p class="title">WordBank</p>
              <div class="tag-list">
                <el-tag size="mini" class="tag" type="warning" v-for="(inner_item, inner_index) in item.wordbank.wordbanks" :key="inner_index">
                  {{inner_item.flashcard.word}}
                </el-tag>
              </div>
            </div>
            <!-- flashcard -->
            <div class="template-show flashcard-show" v-else-if="item.flashcard && item.flashcard.fcId">
              <p class="title">Flashcard</p>
              <el-tag size="mini" class="tag" type="warning">
                {{item.flashcard.word}}
              </el-tag>
            </div>
            <!-- video -->
            <div class="template-show video-show" v-else-if="item.video && item.video.video">
              <p class="title">Video</p>
              <Video :url="item.video.video.content" style="width: 100%; height: 50%;"></Video>
            </div>
            <!-- audio -->
            <div class="template-show video-show" v-else-if="item.audio && item.audio.cover">
              <p class="title">Audio</p>
              <img :src="item.audio.cover.content" style="width: 100%; height: 50%;" />
            </div>
            <!-- Pop -->
            <div class="template-show video-show" v-else-if="item.pop && item.pop.list.length > 0">
              <p class="title">{{item.pop.title}}</p>
              <el-tag v-for="(one, index) in item.pop.list" :key="index" size="mini" class="tag" type="warning">
                {{one.stem.text}}
              </el-tag>
            </div>
            <!-- audio -->
            <!-- MultiAudio -->
            <div class="template-show video-show" v-else-if="item.multiAudio">
              <p class="title">MultiAudio</p>
              <img v-for="(model,index) in item.multiAudio.list" :src="model.cover.content" :key="index" style="width: 33%; height: 10%; margin:2px" />
            </div>
            <!-- multiImage -->
            <div class="template-show video-show" v-else-if="item.multiImage && item.multiImage.list && item.multiImage.title">
              <p class="title">MultiImage</p>
              <img :src="img.content" v-for="(img, index) in item.multiImage.list" :key="index" style="width: 22%; height: 30%; margin: 5px 1px;" />
            </div>
            <!-- question -->
            <div class="template-show question-show" v-else-if="item.question && item.question.quesId">
              <!-- {{item.question.quesId}} -->
              <p class="title">question</p>
              <div class="tag-list">
                <el-tag size="mini" class="tag" type="primary">
                  {{item.question.stem.text || ""}}
                </el-tag>
              </div>
            </div>
            <!-- game -->
            <div class="template-show game-show" v-else-if="item.game && item.game.title">
              <p class="title">Game</p>
              <div class="tag-list">
                <el-tag size="mini" class="tag" type="primary">
                  {{item.game.title}}
                </el-tag>
              </div>
            </div>

            <!-- rankpage -->
            <div class="template-show rankpage-show" v-if="item.layout == 5 && item.type == 12">
              <p class="title textOverflow">Praise  Page</p>
              <img src="~@/assets/images/layout/layout5-6.png">
            </div>

            <transition name="el-zoom-in-center">
              <div class="layer-pop-wrap" v-show="activeIndex === index">
                <div class="transition-box layer-pop">
                  <el-button size="small" type="primary" icon="el-icon-edit" @click="toLayoutAdd(item.sceneId, index)" circle></el-button>
                  <el-button size="small" type="danger" icon="el-icon-delete" circle @click="delLayoutDialog(index)"></el-button>
                  <el-button size="small" type="success" icon="el-icon-document" circle @click="copyScence(index)"></el-button><br />
                  <el-button @click="layoutExchange(index,index-1)" v-show="index>0" size="small" type="warning" circle><i class="icon iconfont icon-cc-arrow-left"></i></el-button>
                  <el-button @click="layoutExchange(index,index+1)" v-show="index<(lessonSceneList.length-1)" size="small" type="warning" circle><i class="icon iconfont icon-cc-arrow-right"></i></el-button>

                  <div class="jump-wrapper">
                    <input type="number" class="input" v-model="jumpIndex">
                    <el-button @click="layoutJump(index)" size="small" type="success" circle>Jump</el-button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <p class="layout-bot-wrap">
            <span class="se-num">{{index+1}}、</span>
            <span v-if="item.story && (item.story.title || item.story.img) && item.question">Story + Question</span>
            <span v-else-if="item.story && item.story.keyword && item.story.keyword.length">ZoomIn & ZoomOut</span>
            <span v-else-if="item.story && (item.story.img || item.story.title || item.story.text)">Story</span>
            <span v-else-if="item.question && item.question.quesId">question</span>
            <span v-else-if="item.game && item.game.gameUrl">Game</span>
            <span v-else-if="item.wordbank && item.wordbank.wordbanks && item.wordbank.wordbanks.length">WordBank!</span>
            <span v-else-if="item.flashcard && item.flashcard.fcId">FlashCard</span>
            <span v-else-if="item.video && item.video.video">Video</span>
            <span v-else-if="item.audio && item.audio.audio">Audio</span>
            <span v-else-if="item.pop">Pop</span>
            <span v-else-if="item.multiImage && item.multiImage.list">MultiImage</span>
            <span v-else-if="item.multiAudio">multiAudio</span>
            <span v-else-if="item.layout == 5 && item.type == 12">Praise Page</span>
          </p>
        </li>
        <li>
          <div class="layout-add" @click="toLayoutAdd(false)">
            <i class="icon iconfont icon-plus"></i>
          </div>
        </li>
      </ul>
      <el-dialog title="提示" :visible.sync="layoutDelDialog" width="30%" center>
        <span>确定删除该page？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="layoutDelDialog = false">取 消</el-button>
          <el-button type="primary" @click="delLayout">确 定</el-button>
        </span>
      </el-dialog>
      <div class="edit-item submit-wrapper">
        <el-button type="primary" icon="el-icon-upload" @click="submitEdit('ruleForm')" :loading="save_loading">确定保存</el-button>
        <el-button @click="goBack" v-if="!lessonAdd">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import CourseTemplate from "./Coms/CourseTemplate.js"
import DefaultLessonCover from "./Coms/DefaultLessonCover.js"
import ImgSelect from "@/components/Coms/ImgSelect";
import Request from "@/common/request.js"
import ComUtil from '@/common/util.js'
import rules from '@/common/validator.js'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Video from '@/components/Coms/Video'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      rules,
      // CourseTemplate: CourseTemplateTest,
      CourseTemplate: CourseTemplate,
      payTypes: [{ label: "需要vip", value: 1 }, { label: "需要单独购买", value: 2 }],
      curLessonNo: '',
      needUpdate: true,
      addTemplate: true,
      loading: true,
      save_loading: false,
      submitParam: {},
      scenesIdArr: [],
      layoutDelDialog: false,
      selectUnits: [],
      selectBlocks: [],
      activeIndex: -1,
      layoutDelId: '',
      lessonAdd: true,
      jumpIndex: '', // 跳转页面
    }
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  watch: {
    '$route'(to, from) {
      // console.log("监听", to, from)
      /** 从edit编辑 直接跳转edit创建，不会刷新页面，watch $route解决问题 **/
        if (ComUtil.isEmpty(to.query)) {
          //这里进入edit页面执行强刷页面，很鲁莽，但很好用
          location.reload()
          this.lessonAdd = true;
          this.$store.commit('setRuleForm', {
            payType: 1,
            titleEn: '',
            titleCh: '',
            seq: '',
            intro: '',
            lessonNo: '',
            selectLevel: '',
            selectUnit: '',
            selectBlock: '',
            selectLesson: '',
            selectLessonType: '',
            keyContent: '',
            lessonNoName: '',
            cover: DefaultLessonCover
          });
          this.$store.commit('setLessonSceneList', []);
          this.$store.commit('lessonNo', '');
          this.$store.commit('selectItems', []);
          this.$store.commit('lessonTypes', []);
        } else {
          console.log("watch-else")
          // this.fuck = false
          // this.$nextTick(() => {
          //   this.fuck = true
          // })
          this.lessonAdd = false;
          this.curLessonNo = to.query.lessonNo;
          this.getSelectInfo();
        }
    }
  },
  computed: {
    ...mapGetters([
      "lessonNo",
      "lessonSceneList",
      "selectItems",
      "lessonTypes",
      "ruleForm"
    ])
  },
  components: {
    Breadcrumb,
    CourseTemplate,
    DefaultLessonCover,
    ImgSelect,
    Video
  },
  methods: {
    lessonInfoReset() {
      this.$store.commit('setRuleForm', {
        titleEn: '',
        titleCh: '',
        seq: '',
        lessonNo: '',
        intro: '',
        selectLevel: '',
        selectUnit: '',
        selectBlock: '',
        selectLesson: '',
        selectLessonType: '',
        keyContent: '',
        payType: 1,
        lessonNoName: '',
        cover: DefaultLessonCover
      });
      this.$store.commit('setLessonSceneList', []);
      this.$store.commit('lessonNo', '');
      this.$store.commit('selectItems', []);
      this.$store.commit('lessonTypes', []);
      this.$store.commit('lessonTypes', []);
    },
    goBack() {
      this.$router.go(-1);
    },
    toLayoutAdd(sceneId, index) {
      const lessonNo = this.curLessonNo;
      let queryobj = {
        page: index,
        lessonNo: lessonNo,
        ...this.ruleForm.selectItem
      };
      if (sceneId) {
        queryobj = {
          page: index,
          lessonNo: lessonNo,
          sceneId: sceneId,
          ...this.ruleForm.selectItem
        }
      }
      this.$router.push({
        path: 'AddLayout',
        name: 'AddLayout',
        params: queryobj,
        query: { ...queryobj }
      })
    },
    selectAssign() {
      const self = this;
      const selectLevelIndex = this.ruleForm.selectLevel;
      const selectUnitIndex = this.ruleForm.selectUnit;
      const selectBlockIndex = this.ruleForm.selectBlock;
      const selectLessonIndex = this.ruleForm.selectLesson;
      // if( typeof(selectLevelIndex) != 'number' && this.curLessonNo != ''){
      //     this.getSelectInfo();
      // }
      if (typeof (selectLevelIndex) == 'number' && this.curLessonNo) {
        self.levelChange(self.ruleForm.selectLevel);
        self.ruleForm.selectUnit = selectUnitIndex;
        self.unitChange(selectUnitIndex);
        self.ruleForm.selectBlock = selectBlockIndex;
        self.blockChange(selectBlockIndex);
        self.ruleForm.selectLesson = selectLessonIndex;
        const ruleForm = self.ruleForm;
        self.$store.commit('setRuleForm', ruleForm);
      }

      this.loading = false;
    },
    // 活取详细信息
    getLessonDetail() {
      if (!this.curLessonNo) {
        this.loading = false;
        return;
      }
      if (!this.needUpdate) {
        this.loading = false;
        return;
      }
      const self = this;
      const lessonNo = self.curLessonNo;
      this.$store.commit('setLessonNo', lessonNo);
      let ruleForm = {};
      let lessonSceneList = []
      this.loading = true;
      Request({
        url: '/story/getStoryList',
        data: {
          lessonNo: this.curLessonNo
        }
      }).then((res) => {
        const self = this;
        ruleForm.titleEn = res.data.lesson.titleEn;
        ruleForm.titleCh = res.data.lesson.titleCh;
        ruleForm.seq = res.data.lesson.seq;
        ruleForm.lessonNoName = res.data.lesson.lessonNoName;
        ruleForm.selectLessonType = res.data.lesson.lessonType;
        ruleForm.payType = res.data.lesson.payType
        ruleForm.cover = res.data.lesson.cover
        if (res.data.lesson.intro) {
          let str = res.data.lesson.intro
          str = str.replace(/\\n/g, "\n")
          ruleForm.intro = str
        }
        ruleForm.keyContent = res.data.lesson.keyContent ? res.data.lesson.keyContent.replace(/\\n/g, "\n") : ''
        lessonSceneList = res.data.sceneList;
        self.selectItems.forEach(function (value, key, arr) {
          if (value.level == res.data.lesson.level) {
            ruleForm.selectLevel = key;
            self.levelChange(key);
            value.units.forEach(function (value, key, arr) {
              if (value.unitId == res.data.lesson.unitId) {
                ruleForm.selectUnit = key;
                self.unitChange(key);
                value.blocks.forEach(function (value, key, arr) {
                  if (value.blockNo == res.data.lesson.blockNo) {
                    ruleForm.selectBlock = key;
                    self.blockChange(key);
                    value.blockLessons.forEach(function (value, key, arr) {
                      if (value.lessonId == res.data.lesson.lessonId) {
                        ruleForm.selectLesson = key;
                        self.lessonChange(key);
                      }
                    })
                  }
                })
              }
            });
          }
        });
        // 设置当前查询 内容
        ruleForm.selectItem = {
          level: res.data.lesson.level,
          lessonType: res.data.lesson.lessonType,
          unitId: res.data.lesson.unitId,
          lessonNo: res.data.lesson.lessonNo
        }
        ruleForm.lessonNo = this.curLessonNo;
        this.$store.commit('setRuleForm', ruleForm);
        this.$store.commit('setLessonSceneList', lessonSceneList);
      }).catch(e => {
        console.log(e)
      }).always(() => {
        self.loading = false;
      });
    },
    handleMouseover(index) {
      this.activeIndex = index;
    },
    layoutExchange(index, changeindex) {
      let lessonSceneList = this.lessonSceneList;
      const tempScenes = lessonSceneList[index];
      lessonSceneList[index] = lessonSceneList[changeindex];
      lessonSceneList[changeindex] = tempScenes;
      this.activeIndex = -1;
      this.$store.commit('setLessonSceneList', lessonSceneList);
      this.commidata(lessonSceneList)
    },
    layoutJump(index) {
      if (!this.jumpIndex) {
        this.$message({
          type: 'error',
          message: '请输入序号'
        });
        return;
      }
      let changeindex = this.jumpIndex;
      let lessonSceneList = this.lessonSceneList;

      if (changeindex < 1) {
        changeindex = 1
      }
      if (changeindex > lessonSceneList.length) {
        changeindex = lessonSceneList.length
      }
      changeindex = changeindex - 1;
      const tempScenes = lessonSceneList[index];
      lessonSceneList.splice(index, 1);
      lessonSceneList.splice(changeindex, 0, tempScenes);

      this.activeIndex = -1;
      this.jumpIndex = '';
      this.$store.commit('setLessonSceneList', lessonSceneList);
      // console.log("''''''''.......''''''''lessonSceneList", ...lessonSceneList)
      this.commidata(lessonSceneList)
    },
    commidata(dat) {
      const self = this
      Request({
            type: 'post',
            url: '/lesson/change/seq',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              lesson: {
                lessonNo: self.ruleForm.lessonNo ? self.ruleForm.lessonNo : null,
              },
              scenes: dat
            }
          }).then(res=> {

          })
    },
    
    //删除layout
    delLayoutDialog(index) {
      this.layoutDelId = index;
      this.layoutDelDialog = true;
    },
    
    delLayout() {
      const self = this;
      let lessonSceneList = this.lessonSceneList;
      lessonSceneList.splice(self.layoutDelId, 1);
      this.commidata(lessonSceneList)
      this.layoutDelDialog = false;
      this.$store.commit('setLessonSceneList', lessonSceneList);
    },
    getSelectInfo() {
      Request({
        url: '/lesson/getSelectItems'
      }).then((res) => {
        this.lessonTypes = res.data.lessonTypes;
        const lessonTypes = res.data.lessonTypes;
        this.selectItems = res.data.selectItems;
        const selectItems = res.data.selectItems;
        this.getLessonDetail();
        this.$store.commit('setSelectItems', selectItems);
        this.$store.commit('setLessonTypes', lessonTypes);
      }).catch(() => {
        // 错误处理
      }).always(() => {
        // this.save_loading = false;
      })
    },
    levelChange(index) {
      this.selectUnits = this.selectItems[index].units;
      this.ruleForm.selectUnit = '';
      this.unitChange(0);
    },
    unitChange(index) {
      this.selectBlocks = this.selectUnits[index].blocks;
      this.ruleForm.selectBlock = '';
      this.blockChange(0);
    },
    blockChange(index) {
      this.selectLessons = this.selectBlocks[index].blockLessons;
      this.ruleForm.selectLesson = '';
      this.lessonChange(0);
    },
    lessonChange(index) {
      let selectLessonsInfo = this.selectLessons[index];
      this.submitParam.level = selectLessonsInfo.level;
      this.submitParam.unitId = selectLessonsInfo.unitId;
      this.submitParam.blockNo = selectLessonsInfo.blockNo;
      this.submitParam.lessonId = selectLessonsInfo.lessonId;
    },
    submitEdit(formname) {
      const self = this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.save_loading = true;
          // console.log("aaaaa", self.ruleForm.cover)
          Request({
            type: 'post',
            url: '/lesson/addCompleteLesson',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              create: self.lessonAdd ? 1 : 0,
              lesson: {
                titleCh: self.ruleForm.titleCh,
                titleEn: self.ruleForm.titleEn,
                seq: self.ruleForm.seq,
                lessonNo: self.ruleForm.lessonNo ? self.ruleForm.lessonNo : null,
                lessonNoName: self.ruleForm.lessonNoName,
                keyContent: self.ruleForm.keyContent,
                intro: self.ruleForm.intro,
                lessonType: self.ruleForm.selectLessonType,
                payType: self.ruleForm.payType,
                cover: self.ruleForm.cover,
                ...self.submitParam
              },
              // scenes: this.lessonSceneList
              scenes: this.CourseTemplateDate()
            }
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              if (self.lessonAdd) {
                self.$router.push({
                  path: 'Edit',
                  name: 'Edit',
                  query: {
                    // lessonNo: self.ruleForm.lessonNo
                    lessonNo: res.data
                  }
                })
              }
            }
          }).catch(() => {
            // 错误处理
          }).always(() => {
            self.save_loading = false;
          });
        } else {
          return false;
        }
      });
    },
    CourseTemplateDate() {
      if (!this.curLessonNo && this.lessonSceneList.length == 0 && this.addTemplate) {
        // 新增模板
        // console.log(121212121212121)
        this.CourseTemplate.map(item => {
          this.lessonSceneList.push(item)
        })
      }
      // console.log("3333333333333", this.lessonSceneList)
      return this.lessonSceneList
    },

    computedScene(scene) {
      console.log(scene.sceneId)
      delete scene.sceneId
        // scene.sceneId + 1
      return scene;
    },
    copyScence(index) {
      console.log(index)
      // 1. 获取对应的数据，数据处理 2. 插入列表，3. 排序列表, 4. 保存
      // 1. 解决新增问题（复制后手动保存？自动保存？）
      //这里要赋值，要解构，不能直接赋值（地址的引用会将两条数据绑定到一起----天坑啊，shit）
      let sceneBefore = {...this.lessonSceneList[index]}
      // 数据处理
      // let sceneData = this.computedScene(sceneBefore)
      this.lessonSceneList.splice(index, 0, sceneBefore)
      // console.log(654654456, this.lessonSceneList[index+1].sceneId)
      if(this.lessonSceneList[index+1].sceneId) {
        this.lessonSceneList[index+1].sceneId = undefined
      }
      // this.lessonSceneList.forEach((item, index) => {
        // console.log(item.sceneId, index)
      // })
      // 数据保存，保存方式 直接保存
      this.copyScenceSave()
    },
    copyScenceSave() {
      this.loading = true
      let myData = {
        lessonNo: this.curLessonNo,
        scenes: this.lessonSceneList
      }
      Request({
        url: 'lesson/copy/lesson',
        data: myData,
        type: "post",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.code == 0) {
          // console.log('setLessonSceneList', res.data)
          let dat = res.data
          let arr = []
          // dat.forEach((item, index)=> {
          //   console.log(item.sceneId, index)
          //   arr.push(item.sceneId)
          // })
          this.$store.commit('setLessonSceneList', res.data);
            this.$message.success("复制成功")
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false
      })
    },
     lala(arr) {
        return Array.prototype.filter.call(arr, function(item, index){
            if(arr.indexOf(item) === index){
              return index
            }
        });
      },
  },
 
  beforeDestroy() {
    if (!this.$route.name == "Course/AddLayout") {
      this.lessonInfoReset();
    }
  },
  created() {
    // console.log(6767676767676, this.$store.state.course.lessonSceneList)
    this.$store.dispatch('getSelectItems');
    this.$store.dispatch('getLessonTypes');
    this.$store.dispatch('getRuleForm');
    this.$store.dispatch('getLessonNo');
    this.curLessonNo = this.$route.query.lessonNo;
    if (!this.curLessonNo) {
      this.lessonAdd = true;
      this.lessonInfoReset();
    } else {
      this.lessonAdd = false;
    }
    if (this.lessonNo != this.curLessonNo) {
      this.needUpdate = true;
      this.getSelectInfo();
    } else {
      this.needUpdate = false;
    }
    this.selectAssign();
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.breadcrumb {
  margin: 10px 0px;
  .separator {
    display: inline-block;
    padding: 0 5px;
  }
}
.main-wrap {
  min-width: 800px;
}
.back {
  margin-left: 10px;
  float: right;
  margin-top: -30px;
}
.title-lesson,
.lessonNo-lesson {
  display: block;
  min-width: 240px;
  max-width: 400px;
}
.select-lesson-wrap {
  min-width: 600px;
}
.form-wrap {
  padding: 10px;
  /* box-shadow: 0 0 4px #eaeaea; */
}
ul.layer-wrap {
  margin: 10px -10px;
  min-height: 100px;
  margin: 40px 0px;
  min-height: 100px;
  padding: 10px;
  box-shadow: 0 0 4px #eaeaea;
}
ul.layer-wrap li {
  margin: 10px;
  float: left;
}
ul.layer-wrap li .layout-top-wrap {
  width: 150px;
  height: 150px;
  border: 1px solid #dcdfe6;
  position: relative;
  overflow: hidden;
}
.layer-pop-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
}
.layer-pop {
  display: inline-block;
  // transform: translateY(25%);
  margin-top: 10px;
}
ul.layer-wrap .iconfont {
  font-size: 12px;
}
.layer-pop button {
  margin: 5px 5px;
}
.layer-pop .jump-wrapper {
  margin-top: 6px;
  .input {
    width: 42px;
    height: 32px;
    border: 0;
    padding: 0;
    text-align: center;
    outline: none;
  }
  button {
    width: 40px;
    height: 32px;
    border-radius: 0 3px 3px 0;
    margin: 0;
    padding: 0;
  }
}
.se-num {
  /*background-color: #f56c6c;*/
  // border: 1px solid #b1b1b1;
  // border-radius: 10px;
  // color: #b1b1b1;
  // display: inline-block;
  font-size: 12px;
  // height: 18px;
  line-height: 18px;
  // padding: 0 6px;
  // text-align: center;
  // white-space: nowrap;
}
.layout-bot-wrap {
  text-align: left;
  margin-top: 4px;
  font-size: 12px;
  line-height: 18px;
  color: #b1b1b1;
}
.select-lesson-wrap .el-select {
  display: block;
}
.select-lesson-wrap .el-select:nth-of-type(1),
.select-lesson-wrap .el-input:nth-of-type(1) {
  margin-bottom: 10px;
}
.layout-add {
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 150px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
}
ul.layer-wrap .layout-add .iconfont {
  font-size: 80px;
  color: #dcdfe6;
}

.template-show {
  text-align: center;
  font-size: 12px;
  .title {
    height: 20px;
    margin-top: 14px;
  }
  .tag {
    margin: 4px;
    max-width: 140px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tag--primary {
    background: rgba(64, 158, 255, 0.7);
    color: white;
  }
  .el-tag--warning {
    background: rgba(230, 162, 60, 0.7);
    color: white;
  }
}
.story-show,
.rankpage-show {
  img {
    height: 70px;
    max-width: 100%;
  }
  .text {
    height: 40px;
    position: absolute;
    bottom: 0px;
    text-align: center;
    width: 100%;
  }
  .tag-list {
    position: absolute;
    top: 35px;
    width: 100%;
    height: 70px;
    overflow: hidden;
    left: 0;
  }
}
.wordbank-show,
.flashcard-show,
.story-show {
  .tag-list {
    padding: 4px;
    text-align: left;
    box-sizing: border-box;
  }
}
.select-lesson-wrap .el-col {
  margin-right: 20px;
}
.select-lesson-wrap .el-col {
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>
