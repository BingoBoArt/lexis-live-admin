<template>
  <ul class="multi-text-wrapper">
    <li v-for="(item, index) in currentValue" :key="index" class="clearfix multi-textarea">
      <textarea v-model="currentValue[index].en" placeholder="请输入英文" maxlength="127"/>
      <textarea v-model="currentValue[index].ch" placeholder="请输入中文" maxlength="127"/>
      <!-- <a href="javascript:void(0);" class="op-btn" @click="handleRemove(item, index)">
        <i class="el-icon-minus"></i>
      </a> -->
      <!-- <a href="javascript:void(0);" class="op-btn" @click="handleAdd(item, index)">
        <i class="el-icon-plus"></i>
      </a> -->
    </li>
  </ul>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: {
          value: {
            type: Array, 
            default: [{ch: "", en: ""}]
          }
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
        methods: {
          handleRemove(item, index){
            if(this.currentValue.length > 1){
              this.currentValue.splice(index, 1)
            }
          },
          handleAdd(item, index){
            this.currentValue.splice(index + 1, 0, {ch: "", en: ""})
          }
        },
        created() {
        }
    }

</script>
<style scoped>
.multi-text-wrapper{
  li{
    margin-bottom: 5px;
  }
  input, textarea{
    float: left;
    outline: none;
    border: 1px solid rgb(212, 212, 212);
  }
  input{
    width: 398px;
    font-size: 14px;
    text-indent: 4px;
    height: 34px;
  }
  textarea{
    width: 248px;
    height: 50px;
    padding: 4px;
    font-size: 14px;
    margin: 0px 10px 0 0;
    resize: none;
  }
  .op-btn{
    float: left;
    font-size: 26px;
    color: #a7a7a7;
    margin-left: 10px;
    line-height: 34px;
    &:hover{
      color: #409eff;
    }
  }
  textarea:focus, input:focus {
      border-color: #409EFF;
  }
  .multi-textarea{
    .op-btn{
      line-height: 60px;
    }
  }
}
</style>