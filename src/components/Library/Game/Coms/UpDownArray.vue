<template>
  <div class="awrap">
    <el-button type="primary" size="mini" plain icon="el-icon-sort-down" @click='moveDown' :disabled="id == list.length">下移</el-button>
    <el-button type="primary" size="mini" plain icon="el-icon-sort-up" @click='moveTop' :disabled="id == 1">上移</el-button>
    <!--
    <el-tooltip v-if="id !== 1" class="item" effect="dark" content="上移" placement="top-start">
      <i class="el-icon-sort-up arrow" @click='moveTop'></i>
    </el-tooltip>
    <el-tooltip v-if="id !== list.length" class="item" effect="dark" content="下移" placement="top-start">
      <i class="el-icon-sort-down arrow" @click='moveDown'></i>
    </el-tooltip>
    -->
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  props: ["list", "id", "gameType", "gameId"],
  methods: {
    moveTop() {
      let id = this.id;
      let temp = this.list[id - 2];
      this.list[id - 2] = this.list[id - 1];
      this.list[id - 2].id = id - 1; //改id
      this.list[id - 1] = temp;
      this.list[id - 1].id = temp.id + 1;
      //   this.$emit("update", this.list);//emit传值方式
      this.updateQuestionSort(this.list); //vuex更新
      this.updQuestionAnswerInfo({
        gameType: this.gameType,
        gameId: this.gameId
      });
    },
    moveDown() {
      let id = this.id;
      let temp = this.list[id];
      this.list[id] = this.list[id - 1];
      this.list[id].id = id + 1;
      this.list[id - 1] = temp;
      this.list[id - 1].id = temp.id - 1;
      //   this.$emit("update", this.list);
      this.updateQuestionSort(this.list);
      this.updQuestionAnswerInfo({
        gameType: this.gameType,
        gameId: this.gameId
      });
    },
    ...mapActions({
      updateQuestionSort: "updateQuestionSort",
      updQuestionAnswerInfo: "updQuestionAnswerInfo"
    })
  }
};
</script>
<style lang="less" scoped>
.awrap {
  margin-left: 10px;
  text-align: center;
  display: inline-block;
  .arrow {
    display: inline-block;
    cursor: pointer;
    width: 30px;
    text-align: center;
    font-size: 20px;
  }
}
</style>
