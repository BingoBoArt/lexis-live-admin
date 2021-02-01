<template>
  <div class="img-select-wrapepr">
    <div class="image-uploader img-upload-wrap" @click="onSelect(item, index)" v-for="(item, index) in currentImgList" :key="index">
      <img v-if="getUrl && item" :src="item" class="image-show">
      <img v-else-if="item && item.content" :src="item.content" class="image-show">
      <img v-else-if="item && item[0] && !item.content" :src="item" class="image-show">
      <i v-else class="icon iconfont icon-plus"></i>
      <!--<i v-show="question_class" class="icon iconfont icon-plus"></i>-->
    </div>
    <el-dialog :visible.sync="dialogShow" :width="'80%'" append-to-body>

      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline" label-width="100px">
          <LessonFilter v-model="selectItem" :title="''">
            <el-button type="primary" icon="el-icon-search" @click="onSubmitFilter">查询</el-button>
            <el-button type="success" @click="onConfirm">确定选择</el-button>
          </LessonFilter>
        </el-form>
      </div>

      <div class="form-table-box clearfix" v-loading="loading">
        <div class="img-list" v-for="(img, index) in imgList" :key="index" @click="checked=index" :class="{'active': checked==index}">
          <!-- <image-card :imgInfo="img" @data-update="afterDelete"></image-card> -->
          <div >
            <img :src="img.content">
            <p>尺寸：{{img.size}}</p>
            <p>名称：{{img.fileName}}</p>
          </div>
          <div class="mask"></div>
          <i class="el-icon-check check"></i>
        </div>
        <div class="no-data" v-if="!loading && (!imgList || !imgList.length)">没有数据</div>
      </div>
      <div class="page-box">
        <el-pagination @current-change="handlePageChange" :current-page="page.page" :page-size="page.rows" layout="total, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
      <!-- 
          <div class="submit-wrapper">
            <el-button type="primary" @click="onConfirm">确定</el-button>
            <el-button type="default" @click="show=false">取消</el-button>
          </div> 
        -->
    </el-dialog>
  </div>
</template>
<script>
import Request from '@/common/request.js'
import LessonFilter from '@/components/Coms/LessonFilter'

export default {
  data() {
    return {
      checked: -1,
      loading: true,
      dialogShow: false,
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', keyword: '', referCount: '' },
      imgList: [],
      checkedList: [],
      checkedIndex: 0,
      page: {
        total: 0,
        rows: 14,
        page: 1
      }
    }
  },
  props: {
    value: {
      type: Object
    },
    multi: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 1
    },
    initShow: {
      type: Boolean,
      default: false
    },
    lessonNo: {
      default: false
    },
    selectItemProp: {
      default: false
    },
    getUrl: { // 是否只获取url（item.content）
      default: false
    }
  },
  components: {
    LessonFilter
  },
  created: function () {
    if (this.selectItemProp) {
      this.selectItem = { ...this.selectItemProp }
    }
    if (this.initShow) {
      this.onSelect(this.currentImgList[0], 0)
    }
  },
  mounted() {
  },
  watch: {
    initShow: function (newValue) {
      if (newValue) {
        this.onSelect(this.currentImgList[0], 0)
      }
    },
    count: function (newValue) {
      this.checkedList = this.currentValue
      let dis = this.count - this.checkedList.length
      if (dis) {
        for (var i = 0; i < dis; i++) {
          this.checkedList.push({})
        }
      }
    },
    dialogShow: function (val) {
      if (val) {
        this.selectItem = { ...this.selectItemProp }
        this.getImgList()
      }
    }
  },

  computed: {
    currentImgList: function () {
      let origin_list = []
      if (this.currentValue) {
        if (this.currentValue.constructor == Array) {
          origin_list = this.currentValue
        } else {
          origin_list = [this.currentValue]
        }
      }
      if (!this.multi) {
        this.count = 1;
      }
      let dis = this.count - origin_list.length
      if (dis > 0) {
        for (var i = 0; i < dis; i++) {
          if (this.getUrl) {
            origin_list.push("")
          } else {
            origin_list.push({})
          }
        }
      }
      // console.log("currentImgList", origin_list)
      return origin_list
    },
    currentValue: {
      // 动态计算currentValue的值
      // 动态计算currentValue的值
      get: function () {
        let final_value = this.handleArrObj(this.value)
        /*
        if(this.getUrl && final_value){
          if(!this.multi){
            final_value = final_value.content;
          }else{
            final_value = final_value.map((item) => {
              return item.content;
            })
          }
        }
        */
        return final_value;
      },
      set: function (val) {
        let final_value = this.handleArrObj(val)
        if (this.getUrl) {
          if (!this.multi) {
            final_value = final_value.content;
          } else {
            final_value = final_value.map((item) => {
              return item.content;
            })
          }
        }
        this.$emit('input', final_value);
      }
    }
  },
  methods: {
    handleArrObj(val) {
      let final_value = null;
      if (!this.multi && val) {
        final_value = val.constructor == Array ? val[0] : val
      } else {
        final_value = val
      }
      return final_value;
    },
    onSelect(item, index) {
      this.dialogShow = true;
      this.checkedIndex = index;
      this.page.page = 1
      // this.getImgList()
    },
    onSubmitFilter() {
      this.page.page = 1
      this.getImgList()
    },
    beforeUpload(files) {
    },
    handPreview(files) {
    },
    handleSelect(img, index) {
      // this.currentValue = img;
      this.checked = index
    },
    onConfirm() {
      if (!this.multi) {
        this.checkedList = this.imgList[this.checked];
      } else {
        this.checkedList[this.checkedIndex] = this.imgList[this.checked];
      }
      this.currentValue = this.checkedList;
      this.$set(this, 'currentValue', this.checkedList);
      // console.log('this.currentValue: ', this.currentValue);
      this.dialogShow = false;
      this.checked = -1;
    },
    handlePageChange(val) {
      this.page.page = val
      this.getImgList()
    },
    /* 获取所有图片 */
    getImgList() {
      this.loading = true;
      let select = this.selectItem
      let param = { ...select, ...this.page, type: 1 }
      Request({
        url: '/resource/getResourceList',
        type: 'post',
        data: param
      }).then(res => {
        this.page.total = res.data.totalResultSize
        // this.page.count = res.data.totalPage
        this.params = param
        this.imgList = res.data.resourceList
        // 处理图片尺寸
        if (this.imgList) {
          for (let i = 0; i < this.imgList.length; i++) {
            this.getImgSize(this.imgList, i)
          }
        }
      }).always(res => {
        this.loading = false
      })
    },
    getImgSize(list, i) {
      var image = new Image();
      let that = this
      let element = list[i]
      image.src = element.content
      image.onload = function () {
        that.$set(that.imgList[i], 'size', this.width + '*' + this.height)
      }
    }
  }
}
</script>
<style scoped>
.img-list {
  display: inline-flex;
}
.el-dialog {
  width: 80%;
}
.image-uploader {
  height: 105px;
  border: 1px solid #e6e6e6;
  width: auto;
  max-width: 196px;
  width: 140px;
  float: left;
  margin-right: 4px;
}
.img-list {
  float: left;
  width: 170px;
  height: 220px;
  margin: 0.5%;
  position: relative;
  &:hover {
    .mask {
      display: block;
    }
  }
  img {
    width: 160px;
    height: 170px;
  }
  p {
    position: relative;
    width: 160px;
    line-height: 20px;
    max-height: 40px;
    overflow: hidden;
  }
  p::after {
    content: "...";
    position: absolute;
    bottom: 0;
    right: 0;
    padding-left: 40px;
  }
  .over_span {
    overflow: hidden;
  }
  .check {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 30px;
    color: white;
    display: none;
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
  &.active {
    .check,
    .mask {
      display: block;
    }
  }
}
/* 图片修正 */

/*编辑问题*/
.img-upload-wrap {
  width: 180px;
  height: 200px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #d9d9d9;
  overflow: hidden;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-height: 200px;
    margin: 0;
  }
  .icon-plus {
    color: #d9d9d9;
    line-height: 200px;
    font-size: 80px;
  }
}
.img-upload-wrap:hover {
  border-color: #409eff;
  color: #409eff;
  .icon-plus {
    color: #409eff;
  }
}
</style>