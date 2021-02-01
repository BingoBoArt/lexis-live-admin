<template>
  <div class="rich_content_container">
    <!-- <font size="3" color="red">This is some text!</font> -->
    <quill-editor  v-model="currentValue" class="editer" :options="editorOption">
    </quill-editor>
  </div>
</template>

<script>
// https://bingkui.gitbooks.io/quill/content/documentation/modules/toolbar.html
import { quillEditor } from "vue-quill-editor";
import Delta from "quill-delta";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  data() {
    return {
      //文本编辑
      editorOption: {
        theme: 'snow',
        placeholder: "请输入内容...",
        modules: {
          clipboard: {
            matchers: [
              // [Node.ELEMENT_NODE, function (node, delta) {
              //     // 粘贴内容变为纯文本
              //     var plaintext = $ (node).text ();
              //     return new Delta().insert (plaintext);
              // }]
            ]
          },
          toolbar: [
            ['clean'],
            // [{ 'color': [] }],          // 字体颜色，字体背景颜色
            // [{ 'font': [] }],         //字体
            // ["bold"], // toggled buttons
            // [{ header: 1 }, { header: 2 }],
            // [{ indent: "-1" }, { indent: "+1" }],
            // [{ align: [] }],
          ]
        }
      },
    }
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    initColor: {
      default: []
    }
  },
  components: {
    quillEditor
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function () {
        return this.value;
      },
      set: function (val) {
        /*
        // 这里修改会引起富文本输入问题，光标会移动过
        val = val.replace(/rgb\((.*?)\)/mg, function(a, b, c){
          let all_text = a;
          let rgb_text = b;
          var array = rgb_text.split(",");
          if (array.length > 3)
              return "";
          let value = "#";
          for (var i = 0, color; color = array[i++];) {
              color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
              value += color.length == 1 ? "0" + color : color;
          }
          value = value.toUpperCase();
          return value;
        })
        */
        this.$emit('input', val);
      }
    }
  },
  methods: {
  },
  created() {
    this.editorOption.modules.toolbar.push([{ color: this.initColor }])
  }
}

</script>
<style>
.rich_content_container {
  font-size: 16px;
  .ql-editor {
    font-size: 16px;
  }
  .ql-snow .ql-color-picker .ql-picker-label svg,
  .ql-snow .ql-icon-picker .ql-picker-label svg {
    position: absolute;
  }
  .ql-editor {
    min-height: 80px;
    height: 140px;
  }
  .ql-color-picker {
    width: 38px;
    height: 34px;
  }
  .ql-toolbar.ql-snow {
    padding: 2px 8px;
  }
  span {
    outline: none;
  }
  .el-row {
    margin: 10px 0px;
  }
}
</style>