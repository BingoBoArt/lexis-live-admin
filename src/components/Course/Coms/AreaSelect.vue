<template>
    <div class="area-wrapper">
      <div class="area-content"><input type="text" placeholder="keyword"></input></div>
      <div class="area-operate" style="display: block;">
          <div style="">
              <div class="border-line"></div>
              <div class="border-line dashed"></div>
              <div class="dot scale-nw dot-nw"></div>
              <div class="dot scale-n dot-n"></div>
              <div class="dot scale-ne dot-ne"></div>
              <div class="dot scale-e dot-e"></div>
              <div class="dot scale-se dot-se"></div>
              <div class="dot scale-s dot-s"></div>
              <div class="dot scale-sw dot-sw"></div>
              <div class="dot scale-w dot-w"></div>
          </div>
      </div>
    </div>
</template>
<script>
var origin_x = 0,
    origin_y = 0,
    current_x = 0,
    current_y = 0,
    origin_left = 0,
    origin_top = 0,
    origin_width = 0,
    origin_height = 0;

var $target_element = null,
    $operate_element = null;

var is_down = false;
var is_inside = false;

export default {
  props: {
    "wrapper": {
      type: ''
    },
    "value": {
      type: Object
    }
  },
  data() {
    return {
    };
  },
  watch: {
  },
  computed: {
    currentValue: {
        // 动态计算currentValue的值
        get: function() {
            return this.value;
        },
        set: function(val) {
            this.$emit('input', val);
        }
    }
  },
  mounted() {
    /**
     * 拖动修改位置、大小
     * @type {Number}
     */
    let self = this;
    $(document).on("mousedown", ".area-operate .rotate-btn, .area-operate .dot", function(event){
        origin_x = event.pageX;
        origin_y = event.pageY;
        $operate_element = $(this);
        $target_element = $(this).closest(".area-wrapper");
        origin_left = parseInt($target_element.css("left"));
        origin_top = parseInt($target_element.css("top"));
        origin_width = $target_element.width();
        origin_height = $target_element.height();

        is_down = true;
        // console.log("is_down")
    }).on("mousedown", '.area-operate', function(event){
        //拖动组件前提判断
        origin_x = event.pageX;
        origin_y = event.pageY;
        $target_element = $(this).closest(".area-wrapper");

        origin_left = parseInt($target_element.css("left"));
        origin_top = parseInt($target_element.css("top"));
        origin_width = $target_element.width();
        origin_height = $target_element.height();
        let $event_target = $(event.target);
        if($event_target.hasClass("dot") || $event_target.hasClass("rotate-btn")){
          is_inside = false;
        }else{
          is_inside = true;
        }
    }).on("mousemove", function(event){
        current_x = event.pageX;
        current_y = event.pageY;

        if(is_inside){
            $(".area-wrapper").css({left: origin_left+(current_x-origin_x), top: origin_top+(current_y-origin_y)})
            return;
        }
        if(!is_down){
          return false;
        }
        // console.log("is_down", is_down)
        var $wrapper = $operate_element.closest(".area-wrapper"),
            $operate = $operate_element.closest(".area-operate");

        if($operate_element.hasClass("rotate-btn")||is_inside){
            //拖动位置
            $wrapper.css({left: origin_left+(current_x-origin_x), top: origin_top+(current_y-origin_y)})
        }else if($operate_element.hasClass("scale-nw")){
            //左上角拖动
            $wrapper.css({
                left: origin_left + (current_x-origin_x),
                top: origin_top + (current_y-origin_y),
                width: origin_width - (current_x-origin_x),
                height: origin_height - (current_y-origin_y)
            })
        }else if($operate_element.hasClass("scale-ne")){
            //右上角拖动
            $wrapper.css({
                //left: origin_left+(current_x-origin_x),
                top: origin_top + (current_y-origin_y),
                width: origin_width + (current_x-origin_x),
                height: origin_height - (current_y-origin_y)
            })
        }else if($operate_element.hasClass("scale-sw")){
            //左下角拖动
            $wrapper.css({
                left: origin_left + (current_x-origin_x),
                //top: origin_top+(current_y-origin_y),
                width: origin_width - (current_x-origin_x),
                height: origin_height + (current_y-origin_y)
            })
        }else if($operate_element.hasClass("scale-se")){
            //右下角拖动
            $wrapper.css({
                //left: origin_left + (current_x-origin_x),
                //top: origin_top+(current_y-origin_y),
                width: origin_width + (current_x-origin_x),
                height: origin_height + (current_y-origin_y)
            })
        }else if($operate_element.hasClass("scale-w")){
            //左边拖动
            $wrapper.css({
                left: origin_left + (current_x-origin_x),
                //top: origin_top+(current_y-origin_y),
                width: origin_width - (current_x-origin_x),
                //height: origin_height - (current_y-origin_y)
            })
        }else if($operate_element.hasClass("scale-e")){
            //右边拖动
            $wrapper.css({
                //left: origin_left+(current_x-origin_x),
                //top: origin_top+(current_y-origin_y),
                width: origin_width + (current_x-origin_x),
                //height: origin_height - (current_y-origin_y)
            })
        }else if($operate_element.hasClass("scale-n")){
            //上边拖动
            $wrapper.css({
                //left: origin_left+(current_x-origin_x),
                top: origin_top + (current_y-origin_y),
                //width: origin_width + (current_x-origin_x),
                height: origin_height - (current_y-origin_y)
            })
        }else if($operate_element.hasClass("scale-s")){
            //下边拖动
            $wrapper.css({
                //left: origin_left+(current_x-origin_x),
                //top: origin_top + (current_y-origin_y),
                //width: origin_width + (current_x-origin_x),
                height: origin_height + (current_y-origin_y)
            })
        }
    }).on("mouseup", function(){
        is_down = false;
        is_inside = false;
        // console.log("is_down", is_down)
    })
  }
};
</script>
<style lang="less" scoped>
.area-wrapper{
  width: 100px;
  height: 60px;
  position: relative;
}
.area-operate {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 99;
  width: 100%;
  height: 100%;
  -webkit-transform-origin: center center;
          -ms-transform-origin: center center;
      transform-origin: center center;
}
.area-operate.hover:hover,
.area-operate.multi-selected {
  outline: 1px solid rgba(0,0,0,0.5);
}
.area-operate .operate-mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
}
.area-operate .operate-mask .mask-group {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}
.area-operate .area-operate-mask .mask-group .mask-text {
  color: #fff;
  font-size: 0.625rem;
  margin-bottom: 0.46875rem;
}
.area-operate .area-operate-mask .mask-group button {
  cursor: pointer;
  outline: none;
  border: none;
  background-color: #18ccc0;
  color: #fff;
  font-size: 0.4375rem;
  height: 0.9375rem;
  line-height: 0.9375rem;
  width: 2.78125rem;
}
.area-operate .rotate-btn {
  position: absolute;
  top: -30px;
  left: 50%;
  width: 22px;
  height: 22px;
  margin-left: -11px;
  cursor: pointer;
  border-radius: 50%;
  background-color: #000;
}
.area-operate .rotate-btn .icon-xuanzhuang-css {
  position: absolute;
  left: 50%;
  font-size: 12px;
  top: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
          transform: translate3d(-50%, -50%, 0);
  color: #fff;
}
.area-operate .border-line {
  position: absolute;
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  margin: -1px 0 0 -1px;
  border: 1px solid #fff;
}
.area-operate .border-line.dashed {
  border: 1px dashed #000;
}
.area-operate .dot {
  position: absolute;
  background-color: #fff;
  width: 5px;
  height: 5px;
  border: 1px solid #4a4a4a;
}
.area-operate .dot.dot-sw,
.area-operate .dot.dot-se,
.area-operate .dot.dot-nw,
.area-operate .dot.dot-ne {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.area-operate .dot-nw {
  top: -5px;
  left: -5px;
}
.area-operate .dot-ne {
  top: -5px;
  right: -5px;
}
.area-operate .dot-sw {
  bottom: -5px;
  left: -5px;
}
.area-operate .dot-se {
  bottom: -5px;
  right: -5px;
}
.area-operate .dot-n {
  left: 50%;
  top: -4px;
  margin-left: -4px;
}
.area-operate .dot-e {
  top: 50%;
  right: -4px;
  margin-top: -4px;
}
.area-operate .dot-s {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}
.area-operate .dot-w {
  top: 50%;
  left: -4px;
  margin-top: -4px;
}
.area-operate .scale-nw {
  cursor: nw-resize;
}
.area-operate .scale-n {
  cursor: n-resize;
}
.area-operate .scale-ne {
  cursor: ne-resize;
}
.area-operate .scale-e {
  cursor: e-resize;
}
.area-operate .scale-se {
  cursor: se-resize;
}
.area-operate .scale-s {
  cursor: s-resize;
}
.area-operate .scale-w {
  cursor: w-resize;
}
.area-operate .scale-sw {
  cursor: sw-resize;
}
</style>
