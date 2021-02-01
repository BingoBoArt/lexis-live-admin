<template>
  <div class="wrap" @click="toggleSelect">
    <div class="img">
      <img v-show="!loading" :src="content" alt="" @load="loaded">
      <vue-loading class='loading' v-if="loading" type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
    </div>
    <p>{{label}}</p>
    <el-button v-if="isSelected(resId) && (ableSelect!==false)" type="success" icon="el-icon-check" circle></el-button>
  </div>
</template>
<script>
import { VueLoading } from "vue-loading-template";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["ableSelect", "content", "fileName", "resId", "label"],
  data() {
    return {
      loading: true
    };
  },
  methods: {
    toggleSelect() {
      if (this.ableSelect !== false) {
        this.$store.dispatch("selectImg", {
          content: this.content,
          fileName: this.fileName,
          resId: this.resId
        });
      }
    },
    loaded() {
      this.loading = false;
      // console.log("l");
    }
  },
  computed: {
    ...mapGetters(["isSelected"])
  },
  watch: {
    content(o, n) {
      this.loading = true;
    }
  },
  created: function() {
    console.log("resInfo", this.content, this.resId, this.fileName);
  },
  components: {
    VueLoading
  }
};
</script>
<style lang="less" scoped>
.wrap {
  display: inline-block;
  width: 200px;
  padding: 6px;
  // background: rgba(255, 153, 0, 0.7);
  position: relative;
  margin: 15px;
  border-radius: 15px;
  align-self: center;
  // box-shadow: 6px 6px 3px #888888;
  p {
    height: 20px;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .img {
    width: 200px;
    // overflow: scroll;
    min-height: 200px;
    img {
      width: 200px;
    }
    .loading {
      margin-top: 85px;
    }
  }
  .el-button {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}
</style>
