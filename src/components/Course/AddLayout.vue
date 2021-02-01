<template>
  <div class="content-main" v-loading="loading">
    <breadcrumb></breadcrumb>
    <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back">返回</el-button>
    
    <div class="edit-wrapper">
      <h3 class="title">选择Layout</h3>
      <swiper class="layout-swiper" :options="swiperOptionLayout" style="width: 100%; height: 100%; max-width: 1000px; margin-left: 0;">
        <swiper-slide v-for="(item, key) in course_layout" :key="key">
          <a href="javascript:void(0);" @click="onLayoutChecked(key)" :class="{'active': layout_checked==key, 'is-not-edit': !is_edit}">
            <img :src="item.thumb">
            <div class="mask"></div>
            <i class="el-icon-check check"></i>
          </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-next swiper-button-blue" slot="button-next"></div>
        <div class="swiper-button-prev swiper-button-blue" slot="button-prev"></div>
      </swiper>
    </div>

    <div class="edit-wrapper" v-if="hasTemplates">
      <h3 class="title">选择控件组合模版</h3>
      <swiper class="template-swiper" :options="swiperOptionTemplate" style="width: 100%; height: 100%; max-width: 1000px; margin-left: 0;">
        <!-- -------根据某个值显示默认初始时选中的模版  -->
        <swiper-slide v-for="(item, index) in course_layout[layout_checked].templates" :key="index">
          <a href="javascript:void(0);" @click="onTemplateChecked(index)" :class="{'active': tempate_checked==index, 'is-not-edit': !is_edit}">
            <img :src="item.thumb">
            <div class="mask"></div>
            <i class="el-icon-check check"></i>
          </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-next swiper-button-blue" slot="button-next"></div>
        <div class="swiper-button-prev swiper-button-blue" slot="button-prev"></div>
      </swiper>
    </div>
    <div class="edit-wrapper edit-form" v-if="hasTemplates">
      <el-form class="form" ref="infoForm" label-position="right" :model="infoForm" label-width="120px">
        <h3 class="title">编辑控件组合模版</h3>
        <!-- Story标题 -->
        <div class="edit-item" v-layout:story_title="layout_template">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="infoForm.story.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </div>

        <!-- wordbank标题 -->
        <div class="edit-item" v-layout:wordbank_title="layout_template">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="infoForm.wordbank.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </div>

        <!-- Story图片 -->
        <div class="edit-item" v-layout:story_image="layout_template">
          <el-form-item label="选择图片" prop="image">
            <ImgSelect :selectItemProp="selectItem" v-model="infoForm.story.img"></ImgSelect>
          </el-form-item>
        </div>

        <!-- Video封面图片 -->
        <div class="edit-item" v-layout:video_image="layout_template">
          <el-form-item label="选择图片" prop="image">
            <ImgSelect :selectItemProp="selectItem" v-model="infoForm.video.cover"></ImgSelect>
            <span>(1880 * 910)</span>
          </el-form-item>
        </div>

        <!-- Video视频 -->
        <div class="edit-item" v-layout:video="layout_template">
          <el-form-item label="选择视频" prop="video">
            <VideoSelect :selectItemProp="selectItem" v-model="infoForm.video.video"></VideoSelect>
          </el-form-item>
        </div>
        <!-- Audio标题 -->
        <div class="edit-item" v-layout:audio_title="layout_template">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="infoForm.audio.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </div>
        <!-- Multi_Audio_标题 -->
        <div class="edit-item" v-layout:multi_audio_title="layout_template">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="infoForm.multiAudio.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </div>
        <!-- Multi_Audio_group -->
        <div class="edit-item" v-layout:multi_audio_group="layout_template">
          <el-form-item label="图音组合" prop="multiAudio">
            <MultiAudio :selectItemProp="selectItem" v-for="(item,index ) in infoForm.multiAudio.list" :key="index" v-model="infoForm.multiAudio.list[index]">
            </MultiAudio>
          </el-form-item>
          <el-form-item label="操作组合">
            <el-button size="mini" @click="AddMultiAudio()">新增组合</el-button>
            <el-button size="mini" @click="DeleteMultiAudio()">删除组合</el-button>
          </el-form-item>
        </div>
        <!-- Multi_Question_标题 -->
        <div class="edit-item" v-layout:pop_title="layout_template">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="infoForm.pop.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </div>
        <!-- pop_Question_group -->
        <div class="edit-item" v-layout:pop_question_group="layout_template">
          <el-form-item label="图音组合" prop="popGroup">
            <QuestionSelect :selectItemProp="selectItem" :multi="true" v-model="infoForm.pop.list" :selectList="cur_template.question_select" :mold="cur_template.question_mold || 1" :optionCount="cur_template.question_option_count || 0"></QuestionSelect>
          </el-form-item>
        </div>

        <!-- Multi_Image_标题 -->
        <div class="edit-item" v-layout:multi_image_title="layout_template">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="infoForm.multiImage.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </div>
        <!-- Multi_Image_group -->
        <div class="edit-item" v-layout:multi_image_group="layout_template">
          <el-form-item label="插入资源">
            <el-button size="mini" @click="fourMultiImage()">4图模板</el-button>
            <el-button size="mini" @click="sixMultiImage()">6图模板</el-button>
            <el-button size="mini" @click="eightMultiImage()">8图模板</el-button>
          </el-form-item>
          <el-form-item label="图片组" prop="multiAudio">
            <div v-for="(item,index ) in infoForm.multiImage.list" :key="index">
              <ImgSelect v-if="index<imageLine" :selectItemProp="selectItem" v-model="infoForm.multiImage.list[index]">
              </ImgSelect>
            </div>
          </el-form-item>
          <el-form-item>
            <div v-for="(item,index2) in infoForm.multiImage.list" :key="index2">
              <ImgSelect v-if="imageLine<= index2 && imageListMax> index2 " :selectItemProp="selectItem" v-model="infoForm.multiImage.list[index2]">
              </ImgSelect>
            </div>
          </el-form-item>
        </div>
        <!-- Audio封面图片 -->
        <div class="edit-item" v-layout:audio_image="layout_template">
          <el-form-item label="选择图片" prop="image">
            <ImgSelect :selectItemProp="selectItem" v-model="infoForm.audio.cover"></ImgSelect>
            <span>(1880 * 910)</span>
          </el-form-item>
        </div>

         <!-- Story描述文本 -->
        <div class="edit-item" v-layout:story_text="layout_template">
          <el-form-item label="描述文本" prop="text">
            <RichContent v-model="infoForm.story.text" style="width: 500px" />
          </el-form-item>
        </div>

        <!-- Audio音频 -->
        <div class="edit-item" v-layout:audio="layout_template">
          <el-form-item label="选择音频" prop="audio">
            <AudioSelect :selectItemProp="selectItem" v-model="infoForm.audio.audio"></AudioSelect>
          </el-form-item>
        </div>
        <!-- 添加单个FlashCard -->
        <div class="edit-item" v-layout:flashcard="layout_template">
          <el-form-item label="FlashCard." prop="flashcard">
            <FlashcardSelect :selectItemProp="selectItem" v-model="infoForm.flashcard" :multi="false"></FlashcardSelect>
          </el-form-item>
        </div>

        <!-- 添加story FlashCard -->
        <div class="edit-item" v-layout:story_flashcard="layout_template">
          <el-form-item label="FlashCard" prop="flashcard">
            <FlashcardSelect :selectItemProp="selectItem" v-model="infoForm.story.flashcard"></FlashcardSelect>
          </el-form-item>
        </div>

        <!-- 添加story FlashCard -->
        <div class="edit-item" v-layout:wordbank="layout_template">
          <el-form-item label="WordBank" prop="flashcard">
            <FlashcardSelect :selectItemProp="selectItem" v-model="wordbanks.flashcards" @delete-flashcard="onDeleteFlashcard"></FlashcardSelect>
          </el-form-item>
        </div>

        <!-- 多图片，对应wordbank的图片 -->
        <div class="edit-item" v-layout:wordbank_pic="layout_template">
          <el-form-item label="WordBank图片" prop="image">
            <span v-if="!wordbanks.flashcards.length" style="color: #e6a23c">请先选择添加flashcard</span>
            <ImgSelect :selectItemProp="selectItem" v-model="wordbanks.imgs" :multi="true" :count="wordbanks.flashcards.length"></ImgSelect>
          </el-form-item>
        </div>

        <!-- Game -->
        <div class="edit-item" v-layout:game="layout_template">
          <GameSelect v-model="infoForm.game" :gameType="cur_template.gameType"></GameSelect>
        </div>

        <!-- Question -->
        <div class="edit-item" v-layout:question="layout_template">
          <el-form-item label="Question" prop="question">
            <QuestionSelect :selectItemProp="selectItem" :multi="false" :selectList="cur_template.question_select" :mold="cur_template.question_mold || 1" :optionCount="cur_template.question_option_count || 0" v-model="infoForm.question"></QuestionSelect>
          </el-form-item>
        </div>

        <!-- Zoom -->
        <div class="edit-item" v-layout:zoom="layout_template">
          <el-form-item label="Zoom" prop="zoom">
            <ZoomSelect v-model="infoForm.story" />
          </el-form-item>
        </div>

        <!-- 添加note|remark -->
        <div class="edit-item" v-layout:note="layout_template">
          <el-form-item label="课堂备注" prop="remark">
            <!-- <MultiText v-model="infoForm.remark" type="textarea" /> -->
            <RichContentList v-model="infoForm.remark" style="width: 500px" />
          </el-form-item>
        </div>
        <div class="edit-item submit-wrapper">
          <el-form-item>
            <el-button type="primary" @click="onSubmitInfo" icon="el-icon-upload" :loading="save_loading">确定保存</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import Config from "@/common/config.js";
import ComUtil from "@/common/util.js";
import Request from "@/common/request.js";
import Breadcrumb from "@/components/Common/Breadcrumb";
import MultiText from "@/components/Coms/MultiText";
import RichContent from "@/components/Coms/RichContent";
import RichContentList from "@/components/Coms/RichContentList";
import ImgSelect from "@/components/Coms/ImgSelect";
import VideoSelect from "@/components/Coms/VideoSelect";
import AudioSelect from "@/components/Coms/AudioSelect";
import MultiAudio from "@/components/Coms/MultiAudio";
import GameSelect from "./Coms/GameSelect";
import FlashcardSelect from "./Coms/FlashcardSelect";
import QuestionSelect from "./Coms/QuestionSelect";
import ZoomSelect from "./Coms/ZoomSelect";

export default {
  data() {
    return {
      selectItem: {},
      loading: true,
      save_loading: false,
      is_edit: false,
      course_layout: Config.course_layout, // layout-template配置数据
      layout_checked: "layout1", // 选中的layout
      tempate_checked: 0, // 选中的template
      swiperOptionLayout: {
        slidesPerView: 5,
        spaceBetween: 10
      },
      swiperOptionTemplate: {
        slidesPerView: 7,
        spaceBetween: 10
      },
      imageListMax: 4,
      imageLine: 4,
      infoForm: {
        layout: 1,
        remark: [""],
        type: 0,
        story: {
          flashcard: [],
          keyword: [],
        },
        video: {},
        audio: {},
        richText: {},
        multiAudio: {
          title: '',
          list: [{}, {}]
        },
        pop: { title: '', list: [] },
        multiImage: {
          title: '',
          list: [{}, {}, {}, {}]
        },
        wordbank: {},
        flashcard: {},
        game: {},
        question: {}
      },
      wordbanks: {
        flashcards: [],
        imgs: []
      }
    };
  },
  components: {
    Breadcrumb,
    swiper,
    swiperSlide,
    FlashcardSelect,
    QuestionSelect,
    MultiText,
    RichContent,
    RichContentList,
    ImgSelect,
    VideoSelect,
    AudioSelect,
    GameSelect,
    ZoomSelect,
    MultiAudio
  },
  computed: {
    /**
     * 返回layout-templates 如 layout1-0
     */
    layout_template() { //2-6
      return `${this.layout_checked}-${this.tempate_checked}`;
    },
    /**
     * 获取当前template
     */
    cur_template() {
      const course_layout = this.course_layout;
      const layout_checked = this.layout_checked;
      const tempate_checked = this.tempate_checked;
      return (
        (course_layout[layout_checked] &&
          course_layout[layout_checked].templates &&
          course_layout[layout_checked].templates[tempate_checked]) ||
        {}
      );
    },
    /**
     * layout是否有templates
     */
    hasTemplates() {
      const course_layout = this.course_layout;
      const layout_checked = this.layout_checked;
      return (
        course_layout[layout_checked] &&
        course_layout[layout_checked].templates &&
        course_layout[layout_checked].templates.length
      );
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    onLayoutChecked(key) {
      if (this.is_edit) {
        return;
      }
      this.layout_checked = key;
      this.tempate_checked = 0;
    },
    onTemplateChecked(index) {
      if (this.is_edit) {
        return;
      }
      this.tempate_checked = index
    },
    /**
     * 根据服务器字段判断本地的templates
     * 各layout包括的组件，见缩略图
     */
    localTypeForLayout1() {
      let _infoForm = this.infoForm;
      let templates_index = 0;
      if (_infoForm.story && (_infoForm.story.title || _infoForm.story.text || _infoForm.story.img)) {
        const story = _infoForm.story;
        if (story.title && story.img) {
          templates_index = 5;
        } else if (story.text && story.img || story.img) {
          templates_index = 4;
        } else if (story.title && story.text) {
          templates_index = 0;
        } else {
          templates_index = 0;
        }
      } else if (!ComUtil.isEmpty(_infoForm.flashcard)) {
        templates_index = 1;
      } else if (
        _infoForm.wordbank &&
        _infoForm.wordbank.wordbanks &&
        _infoForm.wordbank.wordbanks[0].img
      ) {
        templates_index = 3;
      } else if (!ComUtil.isEmpty(_infoForm.wordbank)) {
        templates_index = 2;
      }
      this.tempate_checked = templates_index;
    },
    localTypeForLayout2() {
      let _infoForm = this.infoForm;
      // console.log("这是localTypeForLayout2函数执行时的_infoform")
      // console.log(_infoForm)
      let templates_index = 0;
      if (!ComUtil.isEmpty(_infoForm.video) && _infoForm.type == 7) {
        templates_index = 1;
      } else if (!ComUtil.isEmpty(_infoForm.audio) && _infoForm.type == 13) {
        templates_index = 2;
      } else if (!ComUtil.isEmpty(_infoForm.multiAudio) && _infoForm.type == 14) {
        templates_index = 3;
      } else if (!ComUtil.isEmpty(_infoForm.multiImage) && _infoForm.type == 15) {
        templates_index = 4;
        // 确定模板类型
        if (_infoForm.multiImage.list) {
          if (_infoForm.multiImage.list.length <= 4) {
            this.fourMultiImage()
          }
          if (_infoForm.multiImage.list.length > 6) {
            this.eightMultiImage()
          }
          if (_infoForm.multiImage.list.length <= 6 && _infoForm.multiImage.list.length > 4) {
            this.sixMultiImage()
          }
        }
      } else if (!ComUtil.isEmpty(_infoForm.pop) && _infoForm.type == 16) {
        templates_index = 5;
      } else if (!ComUtil.isEmpty(_infoForm.question) && _infoForm.type == 4) {
        templates_index = 6;
      } else if (!ComUtil.isEmpty(_infoForm.story)) {
        templates_index = 0;
      }
      this.tempate_checked = templates_index;
    },
    ///执行这里的layout3 ==================================

    localTypeForLayout3() {
      // console.log("这是执行localTypeForLayout3的函数")
      let _infoForm = this.infoForm;
      let templates_index = 0;
      // console.log("这里根据getLessonScene接口返回的story,判断初始时选择的的模版")
      if (!ComUtil.isEmpty(_infoForm.story)) {
        const story = _infoForm.story;
        if (story.title && story.text && story.img) {
          templates_index = 0;
        } else if (story.title && story.text) {
          templates_index = 1;
        } else if (_infoForm.type == 104) {
          // console.log("这是初始显示的layout3模版")
          templates_index = 2;
        }
      }
      // console.log("这是控制初始显示的模版")
      this.tempate_checked = templates_index;
    },

    // =============执行上面的layout3

    localTypeForLayout5() {
      let _infoForm = this.infoForm;
      let templates_index = 0;
      // console.log(25252525, _infoForm)
      if (!ComUtil.isEmpty(_infoForm.question)) {
        // console.log(33333, _infoForm.question)
        const _question = _infoForm.question;
        const layout_tepmates = this.course_layout["layout5"].templates;
        // console.log(77777, layout_tepmates) // 12 4 4 4 4 10
        layout_tepmates.forEach((item, index) => {
          if (_question.type == item.question_type && (_question.mold == (item.mold || 1))) {
            templates_index = index;
          }
        });

        layout_tepmates.forEach((item, index) => {
          if (_question.type == "1-3" && item.question_type == '1-3') {
            // 判断2张图、4张图情况
            if (_question.option.length == item.question_option_count) {
              templates_index = index;
            }
          }
          if (_question.type == "1-7") {
            templates_index = 1
          }
        });


      } else if (_infoForm.type == '12') {
        templates_index = 0;
      }
      this.tempate_checked = templates_index;
    },
    // 游戏生成template_checked, 根据url关键字判断
    localTypeForGame() {
      const layoutH5_tepmates = this.course_layout["layoutH5"].templates;
      let _game = this.infoForm.game;
      let templates_index = 0;
      layoutH5_tepmates.forEach((item, index) => {
        if (_game.gameUrl.indexOf(item.gameType) > -1) {
          templates_index = index;
        }
      });
      this.tempate_checked = templates_index;
    },
    /**
     * 生成本地wordbank: {flashcards: [], imgs: []}
     * flashcard - img 对应数据
     */
    generateLocalWordbanks() {
      let _infoForm = this.infoForm;
      let _wordbanks = this.wordbanks;
      if (_infoForm.wordbank && _infoForm.wordbank.wordbanks) {
        _infoForm.wordbank.wordbanks.map(wordbank => {
          _wordbanks.flashcards.push(wordbank.flashcard);
          if (wordbank.img) {
            _wordbanks.imgs.push(wordbank.img);
          }
        });
      }
    },
    /**
     * 生成需要提交的 wordbank: {wordbanks: [{flashcard: {}, img: {}}]}
     * flashcard - img 对应数据
     */
    generateServerWordbanks(_infoForm) {
      let _wordbanks = this.wordbanks;
      let valid = true;
      if (!ComUtil.isEmpty(_wordbanks.flashcards)) {
        _infoForm.wordbank.wordbanks = [];
        _wordbanks.flashcards.forEach((item, index) => {
          let _wordbank = {
            flashcard: item
          };
          if (this.cur_template.wordbank_pic) {
            _wordbank.img = _wordbanks.imgs[index];
            if (ComUtil.isEmpty(_wordbank.img)) {
              valid = false;
            }
          }
          _infoForm.wordbank.wordbanks.push(_wordbank);
        });
      }
      if (!valid) {
        this.$message({
          type: "error",
          message: "请上传wordbank对应图片!"
        });
      }
      return valid;
    },
    validateZoomData(_infoForm) {
      let _story = _infoForm.story;
      if (ComUtil.isEmpty(_story.img)) {
        this.$message({
          type: "error",
          message: "请选择图片"
        });
        return false;
      }
      // if (!(_story.keyword && _story.keyword.length)) {
      //   this.$message({
      //     type: "error",
      //     message: "请框选图片编辑标签"
      //   });
      //   return false;
      // }
      return true;
    },
    validateData(type, _infoForm) {
      let valid = true;
      // console.log("这是请求的参数")
      // console.log(_infoForm)
      // console.log("这是type")
      // console.log(type)
      switch (type) {
        case 'flashcard':
        case 'question':
        case 'game':
          if (ComUtil.isEmpty(_infoForm[type])) {
            this.$message({
              type: "error",
              message: "请选择" + type
            });
            valid = false
          }
          break;
        case 'video':
          let video = _infoForm.video || {}
          if (ComUtil.isEmpty(video.cover)) {
            this.$message({
              type: "error",
              message: "请选择图片"
            });
            valid = false
          } else if (ComUtil.isEmpty(video.video)) {
            this.$message({
              type: "error",
              message: "请选择视频"
            });
            valid = false
          }
          break;
        case 'audio': // 在这里增加校验
          let audio = _infoForm.audio || {}
          if (ComUtil.isEmpty(audio.cover) && _infoForm.type != 104) {
            this.$message({
              type: "error",
              message: "请您选择图片"
            });
            valid = false
          } else if (ComUtil.isEmpty(audio.audio) && _infoForm.type != 104) {
            this.$message({
              type: "error",
              message: "请您选择一个音频"
            });
            valid = false
          }
          break;
        case 'multiAudio': // 在这里增加校验
          let multiAudio = _infoForm.multiAudio.list || {}
          // console.log("这是mutiaudio的值")
          // console.log(_infoForm.multiAudio)
          // console.log(multiAudio[0])
          if (ComUtil.isEmpty(multiAudio[0].cover)) {
            this.$message({
              type: "error",
              message: "请你选择图片"
            });
            valid = false
          } else if (ComUtil.isEmpty(multiAudio[0].audio)) {
            this.$message({
              type: "error",
              message: "请您选择音频"
            });
            valid = false
          }
          break;
      }
      return valid
    },
    /**
     * 生成需要提交的Story: {text: xx, title: xx, img: xx}
     * 根据template， 删除不必要的数据
     */
    generateServerData(_infoForm) {
      console.log(this.cur_template)
      let valid = true;
      let _story = _infoForm.story;
      if (!this.cur_template.story_title) {
        delete _story.title;
      }
      if (!(this.cur_template.story_image || this.cur_template.zoom_image)) {
        delete _story.img;
      }
      if (!this.cur_template.story_text) {
        delete _story.text;
      } else {
        // 修改富文本颜色格式
        if (_story.text) {
          _story.text = ComUtil.changeColorFormate(_story.text)
          _story.text = ComUtil.changeSpaceFormate(_story.text)
        }
      }

      if (!this.cur_template.zoom) {
        delete _story.keyword;
      } else {
        // 验证zoom数据
        valid = this.validateZoomData(_infoForm)
        if (!valid) {
          return valid
        }
      }

      if (!this.cur_template.story_flashcard) {
        delete _story.flashcard;
      }

      if (!this.cur_template.wordbank) {
        delete _infoForm.wordbank;
      } else {
        valid = this.generateServerWordbanks(_infoForm)
        if (!valid) {
          return valid
        }
      }

      if (!this.cur_template.flashcard) {
        delete _infoForm.flashcard;
      } else {
        // 验证flashcard数据
        valid = this.validateData('flashcard', _infoForm)
        if (!valid) {
          return valid
        }
      }
      ////////////////
      if (!this.cur_template.question) {
        delete _infoForm.question;
      } else {
        valid = this.validateData('question', _infoForm)
        if (!valid) {
          return valid
        }
      }
      /////////////////////
      if (!this.cur_template.game) {
        delete _infoForm.game;
      } else {
        valid = this.validateData('game', _infoForm)
        if (!valid) {
          return valid
        }
      }
      // multiImage 没有图片, 测试前要改成 2-4
      if (this.layout_template == 'layout2-4') {
        if (this.infoForm.multiImage.list) {
          let count = 0;
          for (let i = 0; i < this.infoForm.multiImage.list.length; i++) {
            const element = this.infoForm.multiImage.list[i];
            if (element.resId) {
              count = count + 1
            }
          }
          if (count == 0) {
            this.$message.error('没有图片')
            return false
          }
          return true
        } else {
          this.$message.error('没有图片')
          return false
        }
      }
      // 这里需要对数据清晰，multiAudio

      if (!this.cur_template.video) {
        delete _infoForm.video;
      } else {
        valid = this.validateData('video', _infoForm)
        if (!valid) {
          return valid
        }
      }
      if (!this.cur_template.multiAudio) {
        delete _infoForm.multiAudio
      } else {
        // 语音校验
        valid = this.validateData('multiAudio', _infoForm)
        if (!valid) {
          return valid
        }
      }

      if (!this.cur_template.audio) {
        delete _infoForm.audio;
      } else {
        // 语音校验
        valid = this.validateData('audio', _infoForm)
        if (!valid) {
          return valid
        }
      }

      if (!this.cur_template.note) {
        delete _infoForm.note;
      }
      /*
      if (_infoForm.remark && _infoForm.remark.length) {
        // 增加<p style="color: white">
        // "["<p>adf</p>","<p>adsf<span style=\"color: rgb(255, 255, 0);\">asdfadsf</span></p>"]"
        var start_str = '<div style="color: #ffffff">'
        var end_str = '</div>'
        _infoForm.remark = _infoForm.remark.map((item) => {
          var str = item;
          if(str.startsWith(start_str) && str.endsWith(end_str)){
            return str
          }else{
            return `<div style="color: #ffffff">${str}</div>`
          }
        })
      }
      */

      return true;
    },
    validData() { },
    /**
     * FlashcardSelect删除flashcard 同步删除对应图片
     */
    onDeleteFlashcard(index) {
      let _wordbanks = this.wordbanks;
      _wordbanks.imgs.splice(index, 1);
    },
    /**
     * 获取layout详情
     */
    getDetail() {
      // console.log(41111135435435435, this.$route.query.indexs)
      if (!this.infoForm.lessonNo) {
        this.loading = false;
        return;
      }
      let inde = this.$route.query.page
      let datas = {
          page: inde,
          lessonNo: this.infoForm.lessonNo,
          sceneId: this.infoForm.sceneId
      }
      Request({
        // url: "/story/getLessonScene",
        url:'/story/getLessonScene/v2',
        // mock: require("@/mock/scene.js").default,
        data: datas
        //原来的接口参数
        // data: {
        //   lessonNo: this.infoForm.lessonNo,
        //   sceneId: this.infoForm.sceneId
        // }
      })
        .then(res => {
          // console.log("修改内容时create获取layout详情")
          // console.log(res)
          let remark = JSON.parse(res.data.remark || '[""]');
          // console.log("这是获取layout时返回的remark", remark)
          /*
          // 去除<p style="color: #ffffff"> xxx </p>
          var start_str = '<div style="color: #ffffff">'
          var end_str = '</div>'
          remark = remark.map((item) => {
            var str = item;
            if(str.startsWith(start_str) && str.endsWith(end_str)){
              str = str.slice(start_str.length)
              str = str.slice(0, - (end_str.length))
            }
            console.log("remark item", str)
            return str;
          })
          */
          this.infoForm.story = { ...this.infoForm.story, ...(res.data && res.data.story || {}) }
         
          delete res.data.story; // 否则 ... 后会被res.data.story覆盖，story里的默认值被覆盖，比如keyword
          this.infoForm = {
            ...this.infoForm,
            ...res.data,
            remark
          };
          // console.log(666666666, this.infoForm)
          if (!ComUtil.isEmpty(this.infoForm.game) && this.infoForm.game.gameUrl) {
            this.layout_checked = `layoutH5`; // h5游戏对应服务器的layout: 5
            this.localTypeForGame();
          } else {
            const layout = this.infoForm.layout; //2
            // console.log(layout)
            this.layout_checked = `layout${layout}`; //layout2
            this[`localTypeForLayout${layout}`](); //localTypeForLayout2()函数执行
            this.generateLocalWordbanks();
          }
        })
        .always(() => {
          this.loading = false;
        });
    },
    /**
     * 提交或创建
     */
    onSubmitInfo(params) {
      // console.log(888888, this.cur_template.type)
      // console.log(this.course_layout)
      let that = this;
      var infoForm = JSON.parse(JSON.stringify(that.infoForm)); // 实现深复制

      infoForm.layout = that.layout_checked.replace("layout", "");
      // console.log("当前的layout")
      // console.log(infoForm.layout) //2
      infoForm.layout = infoForm.layout == "H5" ? 5 : infoForm.layout; // h5游戏对应layout: 2
      infoForm.type = this.cur_template.type;
      if(infoForm.type == 104) {
        // alert(1)
        // console.log("104时直接添加音频封面，自己设置固定的")
        //cover这条是在type==104时，满足接口需求添加的假数据，layout3-3的config里就可以不用audio_image参数了
        infoForm.audio.cover = {
          content: "http://file.lexislive.com.cn/live/beta/1992040487/9860d415abdb47339c4b45c09f444f7e.jpg",
          fileName: "little-c_498.jpg",
          label: "",
          resId: 13247,
          size: "600*600"
        }
        // infoForm.richText = {
        //   text: infoForm.story.text,
        //   audioUrl: infoForm.audio.audio.content
        // }
        
        // alert(2)
        console.log(infoForm)
        if(infoForm.audio.audio) {
          infoForm.richText = {
            text: infoForm.story.text,
            audioUrl: infoForm.audio.audio.content
          }
        }else {
          infoForm.richText = {
            text: infoForm.story.text,
          }
        }
        ////
        // alert(3)
      }
      // alert(4)
      // console.log("infoForm", infoForm)
      // console.log("这是请求前最后的修改")
      let valid = this.generateServerData(infoForm);
      if (!valid) {
        return;
      }
      // this.validData();
      // console.log(77777)
      // console.log(infoForm.type);
      
      // return;
      this.save_loading = true;
      Request({
        type: "post",
        url: "/story/editScene",
        data: infoForm,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        // console.log("这是返回的结果")
        // console.log(res.data)
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          let newScene = res.data;
          // console.log(this.infoForm)
          // console.log(this.$store.state.course.lessonSceneList)
          let lessonSceneList = this.$store.state.course.lessonSceneList || [];
          if (newScene) {
            if (!this.infoForm.sceneId) {
              // 创建
              lessonSceneList.push(newScene);
            } else {
              // 编辑
              lessonSceneList.forEach((item, index) => {
                if (newScene.sceneId == item.sceneId) {
                  lessonSceneList[index] = newScene;
                }
              });
            }
            this.$store.commit("setLessonSceneList", lessonSceneList);
          }

          setTimeout(() => {
            this.goBack();
          }, 1000);
        }
      })
        .always(() => {
          this.save_loading = false;
        });
    },
    AddMultiAudio() {
      let max = 4
      if (this.infoForm.multiAudio.list.length < max) {
        this.infoForm.multiAudio.list.push({})
      } else {
        this.$message.error("已经达到最大值")
      }
    },
    DeleteMultiAudio() {
      let min = 1
      if (this.infoForm.multiAudio.list.length > min) {
        this.infoForm.multiAudio.list.pop()
      } else {
        this.$message.error("已经达到最最小值")
      }
    },
    fourMultiImage() {
      this.imageListMax = 4
      this.imageLine = 4
      for (let i = 0; i < this.imageListMax; i++) {
        if (this.infoForm.multiImage.list.length < this.imageListMax) {
          this.infoForm.multiImage.list.push({})
        }
        if (this.infoForm.multiImage.list.length > this.imageListMax) {
          this.infoForm.multiImage.list.pop()
        }
      }
    },
    sixMultiImage() {
      this.imageListMax = 6
      this.imageLine = 3
      for (let i = 4; i < this.imageListMax; i++) {
        if (this.infoForm.multiImage.list.length < this.imageListMax) {
          this.infoForm.multiImage.list.push({})
        }
        if (this.infoForm.multiImage.list.length > this.imageListMax) {
          this.infoForm.multiImage.list.pop()
        }
      }
    },
    eightMultiImage() {
      this.imageListMax = 8
      this.imageLine = 4
      for (let i = 4; i < this.imageListMax; i++) {
        if (this.infoForm.multiImage.list.length < this.imageListMax) {
          this.infoForm.multiImage.list.push({})
        }
        if (this.infoForm.multiImage.list.length > this.imageListMax) {
          this.infoForm.multiImage.list.pop()
        }
      }
    }
  },
  created() {
    // this.infoForm.lessonNo = this.$route.params.lessonNo || 0;
    this.infoForm.lessonNo = this.$route.query.lessonNo || 0;
    // console.log("这是lessonNo", this.infoForm.lessonNo)
    if (this.$route.query.sceneId) {
      this.infoForm.sceneId = this.$route.query.sceneId;
      this.is_edit = true;
    }
    this.$set(this.selectItem, 'level', this.$route.query.level)
    if (this.$route.query.lessonType) {
      this.$set(this.selectItem, 'lessonType', Number(this.$route.query.lessonType))
    }
    if (this.$route.query.unitId) {
      this.$set(this.selectItem, 'unitId', Number(this.$route.query.unitId))
    }
    if (this.$route.query.lessonNo) {
      this.$set(this.selectItem, 'lessonNo', Number(this.$route.query.lessonNo))
    }
    // console.log("这是created时拿到的")
    // console.log(this.selectItem)
    this.getDetail();
  }
};
</script>
<style scoped>
.back {
  margin-left: 10px;
  float: right;
  margin-top: -30px;
}
.content,
.content-main {
  padding: 0;
}
.swiper-container {
  width: 100%;
  height: 100%;
  padding: 12px 40px;
  box-sizing: border-box;
  background: white;
  .swiper-button-next,
  .swiper-button-prev {
    transform: scale(0.8);
  }
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  align-items: center;
  width: 40%;
  a {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    cursor: default;
    &.is-not-edit {
      cursor: pointer;
    }
    &.is-not-edit:hover {
      .mask {
        display: block;
      }
    }
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: none;
  }
  .check {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 40px;
    display: none;
  }
  .active .mask,
  .active .check {
    display: block;
  }
  img {
    width: 100%;
  }
}
.edit-wrapper {
  margin-bottom: 10px;
  background: white;
  padding: 20px 10px;
  border-bottom: 1px dashed #efefef;
  .title {
    font-size: 16px;
    color: #20a0ff;
    font-weight: 500;
    position: relative;
    padding-left: 20px;
    margin: 5px 0 5px 20px;
    &:before {
      content: " ";
      height: 100%;
      width: 2px;
      background: #20a0ff;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.edit-form {
  .form {
  }
  .title {
    margin-bottom: 30px;
  }
}
.edit-item-pannel {
  margin: 50px 0;
}
</style>