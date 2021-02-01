<template>
  <div v-loading="loading">
    <breadcrumb></breadcrumb>
    <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
    <div class="content-main">
      <el-row>
        <LessonFilter v-model="selectItem" :needKeyword="false" :disabled="disabled"></LessonFilter>
      </el-row>
      <el-button type="primary" v-for="(item,index) in templateOrder" :key="index" @click="changeTemplate(item)">{{item | changeItem}}</el-button>
      <!--<h3 class="title">选择Question</h3>-->
      <!--<el-tabs v-model="activeName2" type="card" @tab-click="handleSort">-->
      <!--<el-tab-pane v-for="(val, key, index) in question_list" :key="key" :label="val.text" :id="key" ></el-tab-pane>-->
      <!--</el-tabs>-->
      <div class="edit-wrapper">
        <swiper class="layout-swiper" :options="swiperOption" style="width: 100%; height: 100%; max-width: 1000px; margin-left: 0;">
          <swiper-slide v-for="(item, key) in cur_question" :key="key">
            <a href="javascript:void(0);" @click="question_checked= key" :class="{'active': question_checked==key}">
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
      <el-form :rules="rules" class="form-wrap" :model="questionForm" ref="questionForm" label-width="120px">
        <el-form-item label="标题" v-question:text='question_template' prop="stem.text">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="" placeholder="请输入问题" v-model.trim="questionForm.stem.text" clearable></el-input>
        </el-form-item>
        <!-- 新加的字母表 -->
        <el-form-item label="输入英文字母" v-question:letter='question_template' prop="stem.letter">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="" placeholder="请输入字母" v-model.trim="questionForm.stem.letter" clearable></el-input>
        </el-form-item>
        <el-form-item label="副标题" v-question:topic='question_template' prop="stem.topic" v-if="!vote">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="" placeholder="请输入课题" v-model.trim="questionForm.stem.topic" clearable></el-input>
        </el-form-item>
        <el-form-item label="关键字" v-question:isKeyword="question_template">
          <el-input class="ques-keyword" v-for="(item, index) in questionForm.keyword" :key="index" v-model="questionForm.keyword[index]" :placeholder="'请输入第'+(index+1)+'个关键字'"></el-input>
          <el-button icon="el-icon-plus" circle @click="addKeyword()"></el-button>
          <el-button icon="el-icon-minus" circle @click="deleteKeyword()"></el-button>
        </el-form-item>
        <!-- 音频内容 -->
        <el-form-item label="语音文件" v-question:isAudio="question_template" prop="correctVoiceUrl">
          <div v-for="(item, index) in questionForm.correctVoiceUrl" :key='index' @click="changeAudioIndex(index)">
            <el-upload class="avatar-uploader" action="" :http-request="audioUpload">
              <audio v-if="item.url" :id="'audio'+index" :src="item.url" controls="controls" style="width:500px; max-height:40px; background:#ccc"></audio>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button v-if="key>1" class="audio-del" size="mini" type="danger" icon="el-icon-close" circle plain @click="delAudio(index)"></el-button>
          </div>
          <!-- <el-button v-question:isChangeAudio='question_template' plain type="" icon="el-icon-plus" style="margin-left: 0px;" @click="addAudio">添加选项
          </el-button>
          <el-button v-question:isChangeAudio='question_template' plain type="" icon="el-icon-minus" style="margin-left: 0px;" @click="delAudio">删除选项
          </el-button> -->
        </el-form-item>
        <!--  -->
        <el-form-item label="答题时间" v-question:ansDuration="question_template">
          <el-input v-model="questionForm.ansDuration"></el-input>
        </el-form-item>
        <el-form-item label="上传问题" v-question:question_img='question_template' prop="img">
          <ImgSelect :selectItemProp="questionForm.selectItem" :question_class="true" v-model="questionForm.stem.img"></ImgSelect>
        </el-form-item>
        <el-form-item label="类型选择：" v-question:switch='question_template' >
          <el-button size="mini" @click="questionForm.optionType = 1">文字</el-button>
          <!-- <el-button size="mini" @click="questionForm.optionType = 2">图片</el-button> -->
        </el-form-item>
        <el-form-item :label="item.item" v-question:option_text='question_template'  v-for="(item, key) in questionForm.option || []" :key="key" :prop="'option.'+key+'.text'" :rules="rules.option">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="" placeholder="请输入option" v-model.trim="item.text" clearable></el-input>
          <el-button v-if="key>1" class="btn-del" size="mini" type="danger" icon="el-icon-close" circle plain @click="delAnswer(key)"></el-button>
          <AudioSelect v-question:optionAudio='question_template' :selectItemProp="questionForm.selectItem" v-model="item.audio"></AudioSelect>

        </el-form-item>
        <el-form-item label="上传选项" v-question:option_img='question_template' >
          <el-form-item class="upload-wrap" v-for="(item, key) in questionForm.option_img || []" :key="key" :show-message="false" :prop="'option_img.'+key+'.img.resId'" :rules="rules.option_img">
            <div class="upload-wrap">
              <el-button v-if="key>1" class="btn-img-del" size="mini" type="danger" icon="el-icon-close" circle plain @click="delAnswer(key)"></el-button>
              <ImgSelect :selectItemProp="questionForm.selectItem" v-model="item.img"></ImgSelect>
              <AudioSelect v-question:optionAudio='question_template' :selectItemProp="questionForm.selectItem" v-model="item.audio"></AudioSelect>
              <span class="choice">{{item.item}}</span>
            </div>
          </el-form-item>
        </el-form-item>
        <el-form-item label="正确选项" v-question:answer='question_template' v-if="!vote" prop="question">
          <el-select v-model="questionForm.question[0]" placeholder="请选择">
            <el-option v-for="(item, index) in questionForm.option  || []" :key="index" :label="item.item" :value="item.item">
            </el-option>
          </el-select>
          <el-button v-question:isChange='question_template' plain type="" icon="el-icon-plus" style="margin-left: 80px;" @click="addAnswer">添加选项</el-button>
        </el-form-item>

        <el-form-item label="正确选项" v-question:answerList='question_template' v-if="!vote" prop="question">
          <el-checkbox-group v-model="questionForm.question" placeholder="请选择">
            <el-checkbox v-for="(item, index) in questionForm.option  || []" :key="index" :label="item.item">{{item.item}}</el-checkbox>
            <!-- <el-checkbox v-if="!isChange" v-for="(item, index) in questionForm.option_img  || []" :key="index" :label="item.item" :value="item.item"></el-checkbox> -->
            <el-button v-question:isChange='question_template' plain type="" icon="el-icon-plus" style="margin-left: 80px;" @click="addAnswer">添加选项</el-button>
          </el-checkbox-group>
        </el-form-item>
        <!--分值-->
        <el-form-item v-question:score='question_template' label="设置分值" prop="score">
          <el-input-number style="width: 194px;" :precision="0" :step="1" :controls="false" v-model="questionForm.score" controls-position="right" :min="1" :max="3"></el-input-number>
          <!--<el-input type="number" class="" placeholder="请输入分值" v-model="questionForm.score" clearable ></el-input>-->
        </el-form-item>
        <!--isVoice-->
        <!-- <el-form-item label="语音答题" v-question:isVoice='question_template' prop="question.isVoice">
          <el-select v-model="questionForm.isVoice" placeholder="请选择">
            <el-option v-for="(item, index) in voiceOption" :key="index" :label="item.lable" :value="item.value">{{item.lable}}</el-option>
          </el-select>
        </el-form-item> -->

      <!-- 确定保存取消按钮 -->
        <div class="edit-item submit-wrapper">
          <el-form-item>
            <el-button type="primary" @click="submitQuestion" icon="el-icon-upload" :loading="save_loading">
              确定保存.
            </el-button>
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
import QuestionConfig from "@/common/question_config.js";
import ImgSelect from '@/components/Coms/ImgSelect'
import LessonFilter from '@/components/Coms/LessonFilter'
import Breadcrumb from '@/components/Common/Breadcrumb'
import AudioSelect from "@/components/Coms/AudioSelect";

import Request from '@/common/request.js'
import Vue from 'vue'
const COURSE_QUESTION = QuestionConfig.qustion;
function handle(el, binding, vnode) {
  el.style.display = 'none'
  const args = binding.value.split("-")
  //console.log(args)   //["template1", "5"]
  const type = binding.arg;
  //console.log(type)   //isAudio
  const template = args[0];
  const question_key = parseInt(args[1]); //5
  if (COURSE_QUESTION[template] && COURSE_QUESTION[template].item[question_key] && COURSE_QUESTION[template].item[question_key][type]) {
    el.style.display = ''
  }
}
//自定义指令 配置文件有相应的key则显示
Vue.directive('question', {
  update(...args) {
    handle(...args)
  },
  bind(...args) {
    handle(...args)
  }
});
export default {
  components: {
    Breadcrumb,
    AudioSelect,
    LessonFilter,
    swiper,
    swiperSlide,
    ImgSelect
  },
  filters: {
    changeItem (value) {
      if (value == "template1") {
        return "普通模式"
      }
      if (value == "template4") {
        return "writingGame"
      }
    }
  },
  data() {
    var checkCorrectVoiceUrl = (rule, value, callback) => {
      if (this.questionForm.type == '1-7') {
        if (this.questionForm.correctVoiceUrl) {
          this.questionForm.correctVoiceUrl.forEach(item => {
            if (!item.url) {
              return callback(new Error('语音文件不能为空'));
            }
            return callback()
          })
        } else {
          return callback(new Error('语音文件不能为空'))
        }
      }
      return callback();
    }
    return {
      templateOrder: ['template1','template4'],
      audioIndex: '',
      rules: {
        "correctVoiceUrl": [{ required: true, validator: checkCorrectVoiceUrl, trigger: 'blur' }],
        'stem.topic': [
          { required: false, message: '副标题不能为空', trigger: 'blur' }
        ],
        'stem.text': [
          { required: false, message: '标题不能为空', trigger: 'blur' }
        ],
        'ansDuration': [
          { required: true, message: '语音时长不能为空', trigger: 'blur' }
        ],
        'question': [
          { required: true, message: '正确选项至少一个', trigger: 'change' }
        ]
        // 'option': [
        //   { required: false, message: '选项内容不能为空', trigger: 'blur' }
        //   {
        //     validator: function (rule, value, callback) {
        //       let res1 = value.match(/[\uFF00-\uFFEF]/mg) // 中文标点
        //       let res2 = value.match(/[\u4E00-\u9FA5\uF900-\uFA2D]/mg) // 中文汉字，日文，韩文
        //       if (res1) {
        //         callback(new Error(`选项中含有中文标点(${res1[0]})`));
        //       } else if ((/[\u4E00-\u9FA5\uF900-\uFA2D]/mg).test(value)) {
        //         callback(new Error(`选项中含有汉字(${res2[0]})`));
        //       } else {
        //         callback();
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        // ],
        // 'option_img': [
        //   { required: false, message: '选项图片不能为空', trigger: '' }
        // ]
      },
      voiceOption: [{ lable: '是', value: 1 }, { lable: '否', value: 0 }],
      questionForm: {
        keyword: ['', ''],
        ansDuration: 6,
        optionType: '',
        score: '',
        stem: {
          topic: '',
          text: '',
          //新加的字母
          letter: "",
          //
          img: {
            resId: '',
          }
        },
        question: [],
        option: [
          { "item": "A", "text": "", audio: {} },
          { "item": "B", "text": "", audio: {} }
        ],
        correctVoiceUrl: [{ url: '', duration: '' }],
        option_img: [
          {
            "item": "A",
            "img": {
              'resId': '',
              'content': ''
            },
            audio: {}
          },
          {
            "item": "B",
            "img": {
              'resId': '',
              'content': ''
            },
            audio: {}
          }
        ],
        type: '',
        isVoice: 0
      },
      option_text_init: [],
      question_stem: {},
      vote: false,
      isChange: true,
      question_list: QuestionConfig.qustion,//这个是整个模版数据对象
      template_checked: '',
      question_checked: -1,
      item_checked: '',
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      save_loading: false,
      loading: false,
      quesId: '',
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '' }
    }
  },
  watch: {

    question_stem: function (newVal, oldVal) {
      this.questionForm.stem.img.resId = newVal.resId;
    },
    question_checked: function (newChecked, oldChecked) {
      if (newChecked != oldChecked) {
        this.$refs['questionForm'].clearValidate()
      }
      this.questionForm.question = [];
      // this.questionForm.question.answer = [];
      this.questionForm.option_img = [];
      this.questionForm.option = [];
      //防止 切换到template4时，checked = -1，报错 
      if ( this.question_checked == -1 ) return
      const item = this.question_list[this.template_checked].item[this.question_checked];
      // console.log(this.template_checked)   //template1
      // console.log(item)
      // console.log(888888)
      this.cur_question_item = item;
      this.questionForm.type = this.template_checked.charAt(this.template_checked.length - 1) + '-' + item.type;
      // console.log(this.template_checked.charAt(this.template_checked.length - 1)) //1
      // console.log(this.questionForm.type)  //1-1
      if((this.questionForm.type == '4-1' || this.questionForm.type == '1-7') && !this.$route.query.quesId) {
        this.questionForm.ansDuration = 20
      }else if(this.questionForm.type == '1-8' && !this.$route.query.quesId) {
        this.questionForm.ansDuration = 6
      }
      item.vote ? this.vote = true : this.vote = false;
      console.log("这是不对的")
          if (this.questionForm.type == "4-1") {
            // console.log("都好了👌")
            this.vote = true
            // console.log(this.vote)
          }
      // console.log(this.vote)
      ////////////////
      // item.destroyanswer ? this.destroyanswer = true : this.destroyanswer = false
      this.option_num = item.option_num;
      item.option_img ? this.isChange = false : this.isChange = true;
      //封装正确选项下拉框里的字母选项
      const first_letter = 'A';
      for (let i = 0; i < this.option_num; i++) {
        const cur_str = String.fromCharCode(parseInt(first_letter.charCodeAt()) + i);
        this.questionForm.option_img.push({
          "item": cur_str,
          "img": {
            'resId': '',
            'content': ''
          },
          audio: {}
        });
        this.questionForm.option.push(
          { "item": cur_str, "text": "", audio: {} }
        );
      }
      if (this.template_checked == this.template_checked_init && this.question_checked == this.question_checked_init) {
        this.questionForm.question = this.answer_init;
        this.questionForm.option_img = this.option_img_init;
        // this.questionForm.option = [...this.option_text_init];
        // this.questionForm.option = this.option_text_init;
        this.$set(this.questionForm, 'option', this.option_text_init)
      }
      // if (this.vote) {
      //   this.rules.option[0].required = false;
      //   this.rules.option_img[0].required = false;
      // } else {
      //   if (this.questionForm.type == '1-1' || this.questionForm.type == '1-2') {
      //     this.rules.option[0].required = true;
      //     this.rules.option_img[0].required = false;
      //   } else if (this.questionForm.type == '1-3' || this.questionForm.type == '1-8') {
      //     this.rules.option[0].required = false;
      //     // if (this.questionForm.optionType == 2) {
      //     //   this.rules.option[0].required = false;
      //     //   this.rules.option_img[0].required = false;
      //     // } else if (this.questionForm.optionType == 1) {
      //     //   this.rules.option_img[0].required = false;
      //     //   this.rules.option[0].required = false;
      //     // }
      //   }
      // }
    },
    // switch选项卡的图片文字类型选择
    'questionForm.optionType': function (newVal, oldVal) {
      if (this.questionForm.optionType == 1) {
        this.cur_question_item.option_img = false
        this.cur_question_item.option_text = 1
      } else if (this.questionForm.optionType == 2) {
        this.cur_question_item.option_img = true
        this.cur_question_item.option_text = 0
      }
    }
  },
  computed: {
    question_template() {
      console.log(111111111) //template4-0
      console.log(`${this.template_checked}-${this.question_checked}`)
      return `${this.template_checked}-${this.question_checked}`;
    },
    cur_question: function () {
      if (this.template_checked) {
        return this.question_list[this.template_checked].item
      } else {
        return '';
      }
    }
  },
  methods: {
    changeTemplate(item){
      if(item == "template4") {
        this.question_checked = -1
      }
      this.template_checked = item;
    },
    goBack() {
      this.$router.go(-1)
    },
    //增加选项  初始化数据的时候option个数应该和option_num对应
    addAnswer() {
      const first_letter = 'A';
      const self = this;
      if (self.option_num >= 4) {
        this.$message({
          type: 'warning',
          message: '选项最多为4个'
        });
        return;
      }
      const cur_str = String.fromCharCode(parseInt(first_letter.charCodeAt()) + self.option_num);
      // self.answer.push(cur_str)
      self.questionForm.option.push({
        "item": cur_str, "text": "", audio: {}
      });
      self.questionForm.option_img.push({
        "item": cur_str,
        "img": {
          'resId': '',
          'content': ''
        },
        audio: {}
      });
      ++self.option_num;
    },
    addAudio() {
      const self = this;
      if (self.audio_num >= 4) {
        this.$message({
          type: 'warning',
          message: '选项最多为4个'
        });
        return;
      }
      self.questionForm.correctVoiceUrl.push({
        url: '', duration: ''
      });
      ++self.questionForm.audio_num
    },
    //删除选项
    delAnswer(key) {
      const self = this;
      --self.option_num;
      let option = self.questionForm.option;
      let optionImg = self.questionForm.option_img;
      option.splice(key, 1);
      optionImg.splice(key, 1);
      option.forEach(function (value, index, array) {
        if (index >= key) {
          array[index].item = String.fromCharCode(parseInt(array[index].item.charCodeAt()) - 1);
        }
      });
      optionImg.forEach(function (value, index, array) {
        if (index >= key) {
          array[index].item = String.fromCharCode(parseInt(array[index].item.charCodeAt()) - 1);
        }
      });
      self.questionForm.question = [];
    },
    delAudio(index) {
      const self = this;
      --self.audio_num;
      let option = self.questionForm.correctVoiceUrl;
      option.splice(index, 1);
    },
    //选择问题分类
    handleSort(item) {
      this.template_checked = item.$attrs.id;
    },
    // audio上传内容
    audioUpload(val) {
      let index = this.audioIndex
      let formdata = new FormData();
      formdata.append('file', val.file);
      formdata.append('path', 'resource/audio/');
      Request({
        url: '/upload/file',
        type: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.code == 0) {
          this.$set(this.questionForm.correctVoiceUrl[index], 'url', res.data.httpUrl)
          console.log("郁闷")
          console.log(this.$store)
          console.log(this.questionForm.correctVoiceUrl[index])
          // 开始加载
          this.$message({
            type: 'success',
            showClose: true,
            message: '上传成功'
          })
        }
      })
    },
    getval() {
      let audioObList = this.questionForm.correctVoiceUrl
      for (let i = 0; i < audioObList.length; i++) {
        if (!this.updateAudioDuration(i)) {
          return false
        }
      }
      return true
    },
    // 更新对应的音频 持续时间
    updateAudioDuration(index) {
      this.questionForm.correctVoiceUrl[index].duration = ''
      let audioOb = document.getElementById('audio' + index)
      if (!audioOb) {
        this.$message.error("请上传音频")
        return false
      }
      if (audioOb.duration != null && typeof audioOb.duration != "undefined" && audioOb.duration && !isNaN(audioOb.duration)) {
        this.questionForm.correctVoiceUrl[index].duration = audioOb.duration
        return true
      } else {
        this.$message.warning('音频还未加载完成，请稍等重试')
        return false
      }
    },
    //问题详情显示
    showQuestion(res) {
      const self = this;
      if (res.isVoice) {
        self.questionForm.isVoice = res.isVoice;
      }
      console.log("返回的查询结果")
      console.log(res)
      self.selectItem.lessonNo = res.lessonNo;
      self.selectItem.level = res.level;
      self.selectItem.unitId = res.unitId;
      self.selectItem.lessonType = res.typeId;
      console.log(self.selectItem.lessonNo, self.selectItem.level, self.selectItem.unitId, self.selectItem.lessonType)
      //输出   1,"1",1,1
      // 音频内容
      const backToFront = {
        '1-1': ['1-0'],
        '1-2': ['1-1'],
        '1-3': ['1-2', '1-3'],
        '1-5': ['1-4'], //vote
        '1-7': ['1-5'],
        '1-8': ['1-6'],
        '2-1': ['2-0'],
        '4-1': ['4-0']
      };
      console.log(res.type, res.option.length, res.mold)
      let frontType = '';
      // 选项为图片
      // console.log(res.type)
      // console.log(210)这里加console.log会停止程序
      (res.type == '1-3' && res.option.length == 2) ? frontType = backToFront[res.type][0] : frontType = backToFront[res.type][1];
      //vote
      if (res.mold == 2) {
        frontType = backToFront['1-5'][0];
      } else if (!(res.type == '1-3') && res.mold == 1) {
        frontType = backToFront[res.type][0];
      }
      console.log(90900)
      console.log(frontType) //1-2
      const question_key = frontType.split('-');
      console.log('question_key', question_key)
      self.template_checked = 'template' + question_key[0];
      self.question_checked = question_key[1];
      self.questionForm.stem = res.stem;
      self.questionForm.score = res.score;
      self.questionForm.correctVoiceUrl = res.correctVoiceUrl;
      self.questionForm.ansDuration = res.ansDuration
      // self.questionForm.question = this.questionFormQuestionUn(res.question)
      if (res.type == '1-1' || res.type == '1-2' || res.type == '1-3' || res.type == '1-7') {
        // self.option_text_init = [...res.option];
        self.option_text_init = res.option;
      }
      res.type == '1-3' ? (self.questionForm.option_img = res.option, self.option_img_init = res.option) : self.questionForm.option = res.option;
      console.log("这是1-3时给self.questionForm.option_img赋值")
      console.log(self.questionForm.option_img)
      res.type == '1-8' ? (self.option_text_init = self.questionForm.option_img = res.option, self.option_img_init = res.option) : self.questionForm.option = res.option;
      if (res.mold != 2) {
        self.option_num = res.option.length;
      }
      if (res.mold == 1 && ((res.type == '1-1') || (res.type == '1-7') || (res.type == '1-8'))) {
        self.question_list.template1.item[0].option_num = res.option.length;
      }
      if (res.type != '1-7' && res.type != '1-8') {
        self.questionForm.correctVoiceUrl = [{ url: '', duration: '' }]
        self.questionForm.ansDuration = 20
      } else {
        if(res.type == '1-8'){
          self.questionForm.optionType = res.optionType
        }
        if (!self.questionForm.correctVoiceUrl) {
          self.questionForm.correctVoiceUrl = [{ url: '', duration: '' }]
        }
        // self.questionForm.keyword = res.keyword
        if (res.keyword) {
          self.questionForm.keyword = res.keyword
        } else {
          self.questionForm.keyword = ['', '']
        }
      }
      if (res.type == "4-1"){
        self.questionForm.ansDuration = res.ansDuration
      }
      // self.questionForm.question.answer = res.question[0].answer;
      // self.questionForm.question = res.question;
      self.questionForm.stem.resId = res.stem.resId;
      self.template_checked_init = 'template' + question_key[0];
      self.question_checked_init = question_key[1];
      // self.answer_init = res.question[0].answer;
      self.answer_init = this.questionFormQuestionUn(res.question);
      this.$set(this.questionForm, 'question', this.questionFormQuestionUn(res.question))
      this.$set(this, 'answer_init', this.questionFormQuestionUn(res.question))
      console.log("显示的真确选项的内容option", self.questionForm.option)
    },

    /* 查询问题 */
    getQuestionByQuesId(questionId) {
      this.loading = true;
      console.log("这是编辑跳的问题编号" + questionId)
      Request({
        url: '/question/getQuestionByQuesId',
        // mock: require('@/mock/question.js').default,
        type: 'post',
        data: {
          questionId: questionId
        }
      }).then((res) => {
        console.log("根据id查询的数据")
        console.log(res)
        this.showQuestion(res.data);
        if (res.code == 0) {
        } else {
          this.$message.error('未知错误');
        }
      }).always(() => {
        this.loading = false;
      })
    },


    // 点击确认保存
    submitQuestion() {
      let self = this
      //element-form表单的验证methods:validate
      this.$refs['questionForm'].validate((valid, obj) => {
        // console.log(78787)
        // console.log(valid)
        // console.log(obj);
        if (valid) {
          this.save_loading = true;
          const questionForm = this.questionForm;
          console.log("表单提交验证--questionForm")
          console.log(questionForm)
          const cur_question_item = this.cur_question_item;//当前提交的题目类型
          let mold = 1;
          let option = questionForm.option;
          let stem_param = {};
          console.log(questionForm.type) //4-1
          questionForm.type == '1-3' || (questionForm.type == '1-8' && cur_question_item.option_img == true) ? option = questionForm.option_img : '';
          if (cur_question_item.question_img) {
            stem_param.imgUrl = questionForm.imgUrl;
          }
          if (cur_question_item.topic) {
            stem_param.topic = questionForm.topic;
          }
          // console.log("这是vote");
          // console.log(this.vote); //true
          (this.vote == true && questionForm.type != "4-1") ? mold = 2 : mold = 1;
          // this.vote ? mold = 2 : mold = 1;
          let data = {
            "lessonNo": this.selectItem.lessonNo,
            "level": this.selectItem.level,
            "unitId": this.selectItem.unitId,
            "typeId": this.selectItem.lessonType,
            "score": questionForm.score,
            "stem": questionForm.stem,
            "type": questionForm.type,
            "mold": mold,
            "isVoice": cur_question_item.isVoice ? 1 : 0,
            "question": this.questionFormQuestionCom(questionForm.question),
            "optionType": questionForm.optionType,
            "option": option,
            "correctVoiceUrl": questionForm.correctVoiceUrl,
            "ansDuration": questionForm.ansDuration
          };
          // console.log("最开始的data数据")
          // console.log(data.question)
          // console.log(data)
          if (questionForm.type == '1-3') {
            questionForm.option_img.forEach(function (val, key) {
              if (val.item == questionForm.question.answer) {
                // data.question[0].img.resId = val.img.resId
              }
            });
          } else {
            // delete data.question[0].img;
          }
          if (questionForm.type != '1-2') {
            delete data.stem.resId;
          }
          if (mold == 2) {
            delete data.stem.topic;
            delete data.stem.img;
            // data.question[0].answer = '';
          }
          if (this.quesId) {
            data.quesId = this.quesId;
          }
          if (questionForm.type == '1-7' || questionForm.type == '1-8') {
            data.keyword = questionForm.keyword
            if (!self.getval()) {
              return;
            }
            if (questionForm.type == '1-8') {
              if (this.questionForm.optionType == 1) {
                data.option.map(item => {
                  delete item.img
                })
              } else if (this.questionForm.optionType == 2) {
                data.option.map(item => {
                  delete item.text
                })
              }
            }
          } else {
            delete data.correctVoiceUrl
            delete data.ansDuration
          }
          // console.log("最后一yi哆嗦")
          // console.log(questionForm.type)
          if (questionForm.type == "4-1") {
            data.question.push({answer:"A"})
            data.ansDuration = Number(questionForm.ansDuration)
            data.option = []
            // data.question = []
            delete data.stem.img
            delete data.stem.topic
            delete data.optionType
          }
          if (data.type == "1-1" && data.mold == 2) {
            data.question.push({answer:"A"})
            // console.log("改的投票属性")
          }
          Request({
            url: '/question/editQuestion',
            type: 'post',
            data: data,
            headers: { 'Content-Type': 'application/json' }
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                showClose: true,
                message: '操作成功'
              })
              this.goBack();
            } else {
              this.$message.error(res.msg);
            }
          }).always(() => {
            this.save_loading = false;
          });
        } else {
          console.log(obj)
          return false;
        }
      })
    },
    questionFormQuestionCom(val) {
      let answerList = new Array(0)
      val.map(item => {
        answerList.push({ answer: item })
      })
      console.log("这是answerlist")
      console.log(answerList)
      return answerList
    },
    questionFormQuestionUn(val) {
      let answerList = new Array(0)
      val.map(item => {
        answerList.push(item.answer)
      })
      return answerList
    },
    test(val) {
      console.log("123123")
      console.log(val)
    },
    /* 增加选项 */
    addChoice() {
      if (this.choicesLast.length > 0) {
        let newObject = {}
        this.question.option.push(newObject)
        this.choices.push(this.choicesLast.shift())
      }
    },
    /* 删除选项 */
    deleteChoice() {
      if (this.choices.length > 0) {
        this.choicesLast.unshift(this.choices.pop())
        this.question.option.pop()
      }
    },
    // 改变音频
    changeAudioIndex(index) {
      this.audioIndex = index
    },
    // 新增活修改关键字数量
    addKeyword() {
      let max = 5;
      if (this.questionForm.keyword.length < max) {
        this.questionForm.keyword.push("")
      } else {
        this.$message.error("超过关键字最大数量" + max)
      }
    },
    deleteKeyword() {
      if (this.questionForm.keyword.length > 0) {
        this.questionForm.keyword.pop()
      }
    }
  },
  created() {
    this.template_checked = 'template1';
    this.quesId = this.$route.query.quesId || null;
    if (this.quesId) {
      this.disabled = true;
      this.getQuestionByQuesId(this.quesId);
    } else {
      this.option_num = 2;
      this.disabled = false;
      this.question_checked = 0;
    }
  }
}
</script>
<style scoped>
.el-input__inner .form-wrap {
  min-width: 600px;
}
.ques-keyword {
  margin-right: 20px;
  width: 190px;
}
.edit-wrapper {
  margin-bottom: 20px;
}

.el-my-upload {
  width: 160px;
  height: 200px;
}

.upload-wrap:last-child {
  margin-right: 0;
}

.upload-wrap {
  display: inline-block;
  margin-right: 10px;

  .choice {
    display: block;
    text-align: center;
    line-height: 28px;
    color: #979797;
  }
}
.el-my-upload image {
}

.btn-del {
  position: relative;
  top: -10px;
  left: -20px;
  vertical-align: top;
}
.btn-img-del {
  position: absolute;
  top: -10px;
  left: 163px;
  vertical-align: top;
  z-index: 2;
}
.audio-del {
  position: relative;
  top: -10px;
  left: -20px;
  vertical-align: top;
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
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  width: 40%;

  a {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;

    & :hover {
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
</style>
