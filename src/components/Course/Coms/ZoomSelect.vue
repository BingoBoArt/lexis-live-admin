<template>
  <div class="wrapper">
    <div class="imgSelect">
      <ImgSelect class="imgSelect" v-model="currentValue.img"></ImgSelect>
      <div v-if="currentValue.img && currentValue.img.content" class="imgArea" :style="initStyle" @mousedown="beginSelect" @mousemove="select" @mouseup="endSelect">
        <img ref='image' :src="currentValue.img.content" alt="" srcset="" @load="init" :style="initStyle">
        <div class="selectArea" @mousedown="beginMove" @mousemove="moving" @mouseup="moveEnd" :style="selectStyle">
          <input v-if="selectStyle.width && selectStyle.height" class="info" type="text" placeholder="请输入标签" v-model="selectInfo">
          <i class='op-btn close el-icon-close' @click="clear" v-if="selectStyle.width && selectStyle.height" />
          <i class='op-btn ok el-icon-check' @click="confirmArea" v-if="selectStyle.width && selectStyle.height"/>
        </div>
        <div v-if="previewSelect.width && previewSelect.height" class="selectArea preview" :style="previewSelect">{{previewText || '请输入标签'}}
          <i class='close' @click="clear" />
        </div>
      </div>
    </div>
    <div class="list">
      <ul>
        <li v-for="(it,index) in currentValue.keyword" :key='index'>
          <label>标签:</label>
          <input placeholder="请输入标签" v-model="it.text" width='200px' />
          <span class="area-info">{{`( x:${it.x}, y:${it.y}, w:${it.w}, h:${it.h}) `}}</span>
          <el-button class='pre' type="primary" size='mini' plain @click="preview(index)">查看选区</el-button>
          <el-button class='del' type="danger" size='mini' plain @click="deleteLabel(index)">删除</el-button>
        </li>
        <li v-if="currentValue.img && currentValue.img.content && (!currentValue.keyword || !currentValue.keyword.length)" style="color: #e86363">提示：可以在图片上框选区域，并填写关键字</li>
      </ul>
    </div>
  </div>
</template>

<script>
import ImgSelect from "@/components/Coms/ImgSelect";
import ComUtil from "@/common/util.js";
export default {
  components: {
    ImgSelect
  },
  props: {
    value: {
      type: Object,
      default: {
      }
    }
  },
  data() {
    return {
      img: "",
      selectInfo: "",
      previewSelect: {},
      previewText: "",
      selectStyle: {
        height: "",
        width: "",
        top: "",
        left: ""
      },
      beginPoint: {
        //开始绘制的点
        isBegin: false,
        isExist: false,
        x: "",
        y: ""
      },
      dragPoint: {
        //拖拽的点
        isDrag: false,
        pointY: "",
        pointX: ""
      },
      initStyle: {
        width: "",
        height: ""
      },
      scaleKey: "",
      list: []
    };
  },
  watch: {
    img: function(o, n) {
      if (n !== o) {
        this.currentValue.keyword = []; //切换图片时清空标签list
        this.clear();
      }
    }
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    beginSelect(e) {
      // console.log("beginSelect");
      // e.preventDefault();
      // e.stopPropagation();
      this.clear();
      if (!this.beginPoint.isBegin && !this.beginPoint.isExist) {
        this.beginPoint.isBegin = true;
        this.selectStyle.width = "0px";
        this.selectStyle.height = "0px";

        let offSetY = e.offsetY;
        let offSetX = e.offsetX;
        this.beginPoint.x = offSetX;
        this.beginPoint.y = offSetY;
        this.selectStyle.top = `${offSetY}px`;
        this.selectStyle.left = `${offSetX}px`;
      } else {
      }
    },
    preview(index) {
      this.clear();
      let { x, y, w, h, text } = this.currentValue.keyword[index];
      this.previewText = text;
      let width = parseInt(this.initStyle.width),
        height = parseInt(this.initStyle.height);
      let pWidth = width * w / 100,
        pHeight = height * h / 100,
        pLeft = (width * x / 100 - pWidth / 2),
        pTop = height * y / 100 - pHeight / 2;
      // console.log(pLeft, pTop, pWidth, pHeight);
      this.previewSelect = {
        top: pTop + "px",
        left: pLeft + "px",
        width: pWidth + "px",
        height: pHeight + "px"
      };
    },
    getImg(val) {
      // console.log("val: ", val);
      this.img = val.content;
    },
    deleteLabel(index) {
      this.currentValue.keyword.splice(index, 1);
      // this.$emit("getImgArea", this.list); //发送list
      this.clear();
    },
    select(e) {
      e.preventDefault();
      // e.stopPropagation();
      let { x, y } = this.beginPoint;
      if (this.beginPoint.isBegin && !this.beginPoint.isExist) {
        if (
          e.target.className !== "selectArea" &&
          e.target.className !== "close" &&
          e.target.className !== "ok"
        ) {
          this.selectStyle.width = `${e.offsetX - x}px`;
          this.selectStyle.height = `${e.offsetY - y}px`;
        } else if (e.target.className == "selectArea") {
          this.selectStyle.width = `${e.offsetX}px`;
          this.selectStyle.height = `${e.offsetY}px`;
        }
      }
    },
    endSelect(e) {
      let { width, height } = this.selectStyle;
      if (e.target.className !== "info") {
        if (parseInt(width) > 15 && parseInt(height) > 15) {
          //防止误操作
          this.beginPoint.isBegin = false;
          this.beginPoint.isExist = true;
          console.log("end");
        } else {
          this.clear();
        }
      }
    },
    clear(e) {
      if (e) {
        e.stopPropagation();
      }
      this.beginPoint.isExist = false;
      this.beginPoint.isBegin = false;
      this.selectInfo = "";
      this.selectStyle = {
        height: "",
        width: "",
        top: "",
        left: ""
      };
      this.beginPoint = {
        //开始绘制的点
        isBegin: false,
        isExist: false,
        x: "",
        y: ""
      };
      this.previewSelect = {};
      this.previewText = "";
    },
    beginMove(e) {
      e.stopPropagation();
      // e.preventDefault();
      if (e.target.className !== "info") {
        this.dragPoint.isDrag = true;
        let pointY = e.offsetY,
          pointX = e.offsetX;
        this.dragPoint.pointY = pointY;
        this.dragPoint.pointX = pointX;
      }
    },
    moving(e) {
      e.preventDefault();
      if (e.target.className !== "info") {
        if (this.dragPoint.isDrag) {
          let { pointY, pointX } = this.dragPoint;
          let addY = e.offsetY - pointY,
            addX = e.offsetX - pointX,
            initY = this.selectStyle.top,
            initX = this.selectStyle.left;
          let { width, height } = this.selectStyle;
          //限制移动只能在选图内
          let maxTop = parseInt(this.initStyle.height) - parseInt(height),
            maxLeft = parseInt(this.initStyle.width) - parseInt(width),
            curTop =
              parseInt(initY.slice(0, initY.length - 2)) + parseInt(addY),
            curLeft =
              parseInt(initX.slice(0, initX.length - 2)) + parseInt(addX);
          this.selectStyle.top = `${
            (curTop > maxTop ? maxTop : curTop) < 0
              ? 0
              : curTop > maxTop ? maxTop : curTop
          }px`;
          this.selectStyle.left = `${
            (curLeft > maxLeft ? maxLeft : curLeft) < 0
              ? 0
              : curLeft > maxLeft ? maxLeft : curLeft
          }px`;
        }
      }
    },
    init() {
      // console.log("init");
      let realX = this.$refs.image.naturalWidth,
        realY = this.$refs.image.naturalHeight,
        scaleX,
        scaleY;
      //根据真实大小缩放比例
      if (realX > 800) {
        scaleX = 800 / realX;
      } else {
        scaleX = 1;
      }
      if (realY > 600) {
        scaleY = 600 / realY;
      } else {
        scaleY = 1;
      }
      if (scaleX < scaleY) {
        this.scaleKey = scaleX;
      } else {
        this.scaleKey = scaleY;
      }
      this.initStyle.width = `${realX * this.scaleKey}px`;
      this.initStyle.height = `${realY * this.scaleKey}px`;
    },
    moveEnd(e) {
      e.preventDefault();
      if (e.target.className !== "info") {
        // console.log("moveEnd");
        this.dragPoint.isDrag = false;
      }
    },
    confirmArea(e) {
      if(!this.selectInfo){
        this.$message({
          type: "error",
          message: "请输入关键字"
        });
        return;
      }
      e.stopPropagation();
      let { top, left, height, width } = this.selectStyle;
      let iWidth = this.initStyle.width;
      let iHeight = this.initStyle.height;
      let fixNum = (a, b) => {
        a = parseInt(a) * 100;
        b = parseInt(b);
        return Number(a / b).toFixed(3);
      };
      // console.log("top, left, height, width, iHeight, iWidth", top, left, height, width, iHeight, iWidth)
      let newL = {
        text: this.selectInfo,
        x: fixNum((parseInt(left) + parseInt(width) / 2), iWidth),
        y: fixNum((parseInt(top) + parseInt(height) / 2), iHeight),
        w: fixNum(width, iWidth),
        h: fixNum(height, iHeight)
      };
      // console.log("newL", newL)
      this.currentValue.keyword.push(newL);
      // this.$emit("getImgArea", this.list); //发送list
      this.selectInfo = "";
      this.selectStyle = {
        height: "",
        width: "",
        top: "",
        left: ""
      };
      this.beginPoint = {
        //开始绘制的点
        isBegin: false,
        isExist: false,
        x: "",
        y: ""
      };
    }
  },
  created() {},
  mounted() {
    if(ComUtil.isEmpty(this.currentValue)){
      this.currentValue = {
         img: {},
         keyword: []
      }
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  position: relative;
  min-height: 200px;
  .list {
  }
  .imgSelect {
    overflow: hidden;
  }
  li {
    padding: 2px 0;
    color: #868686;
    .del {
      margin-left: 15px;
      display: inline-block;
    }
    .pre {
    }
    .area-info{
      width: 290px;
      display: inline-block;
      margin: 0 10px;
    }
  }
  input {
    color: black;
    margin-left: 20px;
    height: 30px;
    line-height: 30px;
    border: none;
    border-bottom: 1px solid;
    outline: medium;
    background: transparent;
    width: 130px;
    color: #868686;
  }
  input::-webkit-input-placeholder {
    color: black;
  }
  .imgArea {
    position: relative;
    img {
      position: absolute;
      // width: 100%;
      // height: 100%;
    }
    .selectArea {
      position: absolute;
      border: 1px dashed grey;
      background: rgba(255, 255, 255, 0.7);
      .op-btn{
        text-align: center;
        position: absolute;
        display: inline-block;
        width: 20px;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
      }
      .close {
        top: 5px;
        right: 5px;
        color: white;
        background: #f75d5d;
        border-radius: 50px;
      }
      .info {
        position: absolute;
        left: 0;
        bottom: 15px;
        color: #06c;
        width: 80px;
      }
      .ok {
        bottom: 5px;
        right: 5px;
        color: white;
        background: #67c23a;
        border-radius: 50px;
      }
    }
    .preview {
      background: rgba(37, 178, 238, 0.79);
      text-align: center;
      line-height: 100px;
      color: white;
      font-size: 20px;
    }
  }
}
</style>