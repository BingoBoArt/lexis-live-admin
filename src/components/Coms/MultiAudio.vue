<template>
  <div class="muti-audio-card">
    <div class="card-img">
      <ImgSelect :selectItemProp="selectItem" v-model="currentValue.cover"></ImgSelect>
    </div>
    <div class="card-audio">
      <AudioSelect :selectItemProp="selectItem" v-model="currentValue.audio"></AudioSelect>
    </div>
  </div>
</template>

<script>
import ImgSelect from "@/components/Coms/ImgSelect";
import AudioSelect from "@/components/Coms/AudioSelect";
export default {
  props: {
    value: {
      type: Object
    },
    selectItem: {
      type: Object,
      requird: true
    }
  },
  components: {
    ImgSelect,
    AudioSelect
  },
  data() {
    return {
    }
  },
  computed: {
    currentValue: {
      get: function () {
        // console.log(this.value)
        return this.value
      },
      set: function (value) {
        this.$emit("input", this.audioGroup)
      }
    }
  }
}
</script>

<style>
.muti-audio-card{
  width: 340px;
  display: block;
  float: left;
}
.card-img{
  margin: 20%;
}
</style>
