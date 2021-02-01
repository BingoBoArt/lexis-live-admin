<template>
  <el-dialog title="选择资源" :visible.sync="isShow" width="1100px" :before-close="toggleDialog" append-to-body>
    <el-form :inline='true'>
      <el-form-item label="筛选条件">
        <el-select v-model="selectValue.levelId" size='mini' placeholder="请选择条件等级" @change="setInit">
          <el-option v-for="(item) in levels" :key="item.level" :label="`Level${item.level}`" :value="item.level">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="selectValue.lessonType" size='mini' placeholder="请选择课程类型" @change="setInit">
          <el-option v-for="(item) in lessonTypes" :key="item.lessonType" :label="item.lessonTypeEn" :value="item.lessonType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="selectValue.unitId" size='mini' placeholder="请选择单元" @change="setInit">
          <el-option v-for="(item) in units" :key="item.unitId" :label="item.nameEn" :value="item.unitId">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- </el-form> -->
      <!-- <el-form :inline='true'> -->
      <el-form-item>
        <el-input v-model="selectValue.keyword" size='mini' placeholder="输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='info' size='mini' @click="onSubmitFilter">过滤</el-button>
      </el-form-item>
    </el-form>
    <div id="resList">
      <image-card v-for="(item,index) in imgList" :key='index' v-if="item.content" :content='item.content' :resId='item.resId' :fileName='item.fileName' :label='item.label' />
    </div>
    <div class="block">
      <span class="demonstration">显示总数</span>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageInfo.params.page" :page-size="pageInfo.totalPage" layout="total, prev, pager, next" :total="pageInfo.totalResultSize">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="repalceRes(toRepalceImg)">确 定</el-button>
      <el-button @click="toggleDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ImageCard from "./ImageCard";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Request from "@/common/request.js";
export default {
  props: ["isShow"],
  data() {
    return {
      selectValue: {
        label: null,
        lessonNo: "",
        lessonType: "",
        level: "",
        type: 1,
        unitId: "",
        keyword: ""
      },
      levels: [],
      lessonTypes: [],
      units: [],
      lessons: [],
      pageInfo: {
        params: {
          page: 1,
          rows: 8
        },
        totalResultSize: "",
        totalPage: 8
      },
      filterInfo: {},
      imgList: []
    };
  },
  watch: {
    isShow(n, o) {
      console.log("n: ", n);
      console.log("o: ", o);
    }
  },
  computed: {
    ...mapGetters(["toRepalceImg"])
  },
  methods: {
    toggleDialog() {
      this.$emit("toggleDialog");
    },
    repalceRes(toRepalceImg) {
      this.$emit("repalceRes", toRepalceImg);
      this.toggleDialog();
    },
    onSubmitFilter() {
      console.log("filter");
      this.handleCurrentChange(1);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageInfo.params.page = val;
      console.log(`当前页: ${val}`);
      Request({
        url: "/resource/getResourceList",
        type: "post",
        data: {
          ...this.selectValue,
          ...this.pageInfo.params
        }
      })
        .then(res => {
          console.log("res.data: ", res.data);
          this.pageInfo.totalResultSize = res.data.totalResultSize;
          this.imgList = res.data.resourceList;
        })
        .catch(error => {
          console.log(error);
        })
        .always(res => {
          // this.loading = false;
        });
    },
    // 获取 所有等级
    getLevelList() {
      let that = this;
      Request({
        url: "/lesson/getLevelList",
        type: "get"
      }).then(res => {
        // console.log(res.data)
        that.levels = res.data;
      });
    },
    // 获取 所有课程类型
    getLessonTypeList() {
      let that = this;
      Request({
        url: "/lesson/getLessonTypeList",
        type: "get"
      }).then(res => {
        // console.log(res.data)
        that.lessonTypes = res.data;
      });
    },
    // 获取 所有单元
    getUnitList() {
      let that = this;
      Request({
        url: "/lesson/getUnitList",
        type: "get"
      }).then(res => {
        // console.log(res.data)
        that.units = res.data;
      });
    },
    // 获取 所有课件
    async getLessonList() {
      let that = this;
      if (
        !(
          this.selectValue.level &&
          this.selectValue.lessonType &&
          this.selectValue.unitId
        )
      ) {
        this.selectValue.lessonNo = "";
        return;
      }
      await Request({
        url: that.releaseLesson
          ? "/lesson/getLessonReleaseList"
          : "/lesson/getLessonList",
        type: "get",
        data: this.selectValue
      }).then(res => {
        // console.log(res.data)
        that.lessons = res.data;
      });
    }
  },
  mounted() {
    this.getLevelList();
    this.getLessonTypeList();
    this.getUnitList();
    this.getLessonList();
  },
  components: {
    ImageCard
  },
  created() {
    Request({
      url: "/resource/getResourceList",
      type: "post",
      data: {
        ...this.selectValue,
        ...this.pageInfo.params
      }
    })
      .then(res => {
        console.log("res.data: ", res.data);
        this.pageInfo.totalResultSize = res.data.totalResultSize;
        this.pageInfo.currentPage = res.data.currentPage;
        this.pageInfo.totalPage = res.data.totalPage;
        // this.params = param;
        this.imgList = res.data.resourceList;
      })
      .catch(error => {
        console.log(error);
      })
      .always(res => {
        // this.loading = false;
      });
  }
};
</script>
<style lang="less" scoped>
#resList {
  width: 100%;
  height: 620px;
  overflow: scroll;
  background: rgba(188, 231, 238, 0.5);
  display: flex;
  flex-wrap: wrap;
}
.block {
  margin-top: 15px;
  display: flex;
  align-items: center;
  div {
    display: inline-block;
  }
}
.el-input {
  width: 100px;
}
</style>
