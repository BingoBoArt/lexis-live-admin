<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" class="back top-btn">返回</el-button>
    <div class="content-main">
      <el-row class="my-row-b">
        <LessonFilter v-model="selectItem" :needKeyword="false" :disabled="card.flashcard && card.flashcard.fcId">
        </LessonFilter>
      </el-row>
      <div class="my-from-main">
        <el-form :rules="infoRules" ref="infoForm" :model="card" v-loading="loading" :inline="true" class="my-from" label-width="100px">
          <div class="content-card-name">
            <el-form-item label="英文名称" prop="flashcard.word">
              <el-input size="medium" placeholder="请输入单词卡名称-英文" v-model.trim="card.flashcard.word" clearable></el-input>
            </el-form-item>
            <el-form-item label="中文名称" prop="flashcard.ch">
              <el-input placeholder="请输入单词卡名称-中文" v-model.trim="card.flashcard.ch" clearable></el-input>
            </el-form-item>
            <el-form-item label="词性" prop="flashcard.classification">
              <el-select v-model="card.flashcard.classificationItem" placeholder="请选择词性" clearable="">
                <el-option v-for="item in classification.data" :key="item.value" :label="item.name" :value="item">
                </el-option>
              </el-select>
              <el-select v-model="card.flashcard.classificationItem" clearable="">
                <el-option v-for="item in classification.data" :key="item.value" :label="item.value" :value="item">
                </el-option>
              </el-select>
            </el-form-item>

          </div>
          <div class="content-multimedia">
            <div class="edit-item">
              <el-form-item label="* front图片" prop="frontImg">
                <ImgSelect :selectItemProp="selectItem" v-model="frontImg"></ImgSelect>
              </el-form-item>
            </div>
            <div class="edit-item">
              <el-form-item label="* behind图片" prop="behindImg">
                <ImgSelect :selectItemProp="selectItem" v-model="behindImg"></ImgSelect>
              </el-form-item>
            </div>
            <!-- 单词的发音 -->
            <div class="edit-item">
              <el-form-item label="音频文件" prop="flashcard.audioUrl">
                <Upload :lessonNo="selectItem.lessonNo" type="audio" v-model="card.flashcard.audioUrl"></Upload>
              </el-form-item>
            </div>
            <div class="edit-item">
              <el-form-item label="sentences">
                <MultiSentence v-model="card.sentences" />
              </el-form-item>
            </div>
            <!-- 新增例句的发音 -->
            <div class="edit-item">
              <el-form-item label="例句发音" prop="flashcard.sent">
                <Upload :lessonNo="selectItem.lessonNo" type="audio" v-model="card.sentenceaudio"></Upload>
              </el-form-item>
            </div>
          </div>

          <div class="edit-item submit-wrapper">
            <el-form-item>
              <el-button type="primary" @click="editFlashcard" icon="el-icon-upload" :loading="save_loading">确定保存</el-button>
              <el-button @click="goBack">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import classification from './classification.js'
import Upload from '@/components/Coms/Upload'
import LessonFilter from '@/components/Coms/LessonFilter'
import Breadcrumb from '@/components/Common/Breadcrumb'
import ImgSelect from '@/components/Coms/ImgSelect'
import MultiSentence from './MultiSentence'
import Request from '@/common/request.js'
import ComUtil from '@/common/util.js'

export default {
  data() {
    return {
      classification: classification,
      loading: true,
      save_loading: false,
      frontImg: {},
      behindImg: {},
      card: {
        sentenceaudio: '',
        flashcard: {
          classificationItem: {}
        },
        sentences: [{}],
        imgs: [{ direct: 'front', imgResId: '', content: "" }, { direct: 'behind', imgResId: '', content: "" }],
      },
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '' },
      classifications: [],
      infoRules: {
        "flashcard.word": [
          { required: true, message: '英文名称不能为空', trigger: 'blur' }
        ],
        "flashcard.ch": [
          { required: true, message: '中文名称不能为空', trigger: 'blur' }
        ],
        // "frontImg": [
        //   { required: true, message: '前图不能为空', trigger: 'blur' }
        // ],
        // "behindImg": [
        //   { required: true, message: '后图不能为空', trigger: 'blur' }
        // ],
        "flashcard.audioUrl": [
          { required: true, message: '音频不能为空', trigger: 'blur' }
        ],
        // "flashcard.sent": [
        //   { required: true, message: '例句音频不能为空', trigger: 'blur' }
        // ]
        // "flashcard.classification": [
        //   { required: true, message: '词性不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  components: {
    Upload,
    LessonFilter,
    Breadcrumb,
    ImgSelect,
    classification,
    MultiSentence
  },
  watch: {
    'card.flashcard.classificationItem': {
      handler: function (value) {
        this.card.flashcard.classification = this.card.flashcard.classificationItem.value
        this.card.flashcard.classificationName = this.card.flashcard.classificationItem.name
      },
      deep: true
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    editFlashcard() {
      console.log(7272727, this.$refs["infoForm"])
      this.$refs["infoForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        const _valid = ComUtil.validate([
          {
            data: this.selectItem.lessonNo,
            message: '请选择课件'
          },
          {
            data: this.frontImg,
            message: '请选择front图片'
          },
          {
            data: this.behindImg,
            message: '请选择behind图片'
          }
        ])

        if (!_valid) {
          return;
        }
        console.log(26262626, this.card)
        let selectItems = this.selectItem
        this.card = {
          ...this.card,
          flashcard: {
            ...this.card.flashcard,
            // ...selectItems,
            type: 'flashcard',
            status: 2
          },
          ...selectItems
        }

        this.card.imgs[0] = {
          ...this.card.imgs[0],
          imgResId: this.frontImg.resId || this.frontImg.imgResId
        }
        this.card.imgs[1] = {
          ...this.card.imgs[1],
          imgResId: this.behindImg.resId || this.behindImg.imgResId
        }

        this.save_loading = true;
        Request({
          url: '/flashcard/editFlashCard',
          data: this.card,
          headers: { 'Content-Type': 'application/json' },
          type: 'post'
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        }).always(res => {
          this.save_loading = false;
        })
      })
    }
  },
  created() {
    let fcId = this.$route.query.fcId || null
    if (fcId != null) {
      Request({
        type: 'get',
        url: '/flashcard/getFlashcard',
        data: {
          fcId
        }
      }).then(res => {
        let param = res.data
        // this.analysisDate(param)
        this.card = param;
        this.frontImg = param.imgs[0]
        this.behindImg = param.imgs[1]

        this.$set(this.card.flashcard, 'classificationItem', {})
        this.card.flashcard.classificationItem.value = param.flashcard.classification
        this.card.flashcard.classificationItem.name = param.flashcard.classificationName

        this.selectItem = {
          level: param.level,
          lessonType: param.lessonType,
          unitId: param.unitId,
          lessonNo: param.lessonNo
        }
      }).always(res => {
        this.loading = false;
      })
    } else {
      this.loading = false;
    }
  }

}
</script>
<style scoped>
/* 表单 */
.my-from {
}
.my-from-main {
  /* border-bottom: 1px dashed #eeb764; */
  min-height: 520px;
}
.content-card-name,
.content-multimedia,
.content-phonemes,
.content-bottom {
}
.content-bottom {
  margin: 20px;
}

.content-card-name {
  width: 100%;
  margin-top: 15px;
}
.content-phonemes {
  height: 10px;
  width: 100%;
}
.content-multimedia {
  width: 100%;
}
/* 图-按钮组合 */

.my-row-b {
  border-bottom: 1px dashed bisque;
}

/* 图片前置 */
.image-per {
  height: 320px;
}
</style>
