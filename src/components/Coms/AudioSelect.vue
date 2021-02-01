<template>
  <div class="video-select-wrapper">
    <div class="upload-wrap" @click="showDialog">
      <!-- <Video v-if="currentValue && currentValue.content" :url="currentValue.content" class="image-show"></Video> -->
      <!-- <audio  v-if="currentValue" controls>
        <source :src="currentValue.content" type="audio/mpeg" />
      </audio> -->
      <AudioSelectCard v-if="currentValue.content" :dataInfo="currentValue"></AudioSelectCard>
      <i v-else class="icon iconfont icon-plus wrap"></i>
    </div>
    <el-button v-if="currentValue && currentValue.content" type="primary" @click="showDialog" plain icon="el-icon-edit" size="small" style="display: inline-block; margin-left: 10px; vertical-align: top;">更换音频</el-button>

    <el-dialog :visible.sync="dialogShow" :width="'80%'">
      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline" label-width="100px">
          <LessonFilter v-model="selectItem" :title="''">
            <el-button type="primary" icon="el-icon-search" @click="onSubmitFilter">查询</el-button>
            <el-button type="success" @click="onConfirm">确定选择</el-button>
          </LessonFilter>
        </el-form>
      </div>

      <div class="form-table-box clearfix" v-loading="loading">
        <div class="data-list" v-for="(data, index) in dataList" :key="index" @click="checked=index" :class="{'active': checked==index}">
          <!-- <Audio :url="data.content"></Audio> -->
          <AudioSelectCard v-if="data" :dataInfo="data"></AudioSelectCard>
          <div class="mask"></div>
          <i class="el-icon-check check"></i>
        </div>
        <div class="no-data" v-if="!loading && (!dataList || !dataList.length)">没有数据</div>
      </div>
      <div class="page-box">
        <el-pagination @current-change="handlePageChange" :current-page="page.page" :page-size="page.rows" layout="total, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Request from '@/common/request.js'
import LessonFilter from '@/components/Coms/LessonFilter'
import Audio from "@/components/Coms/Audio";
import AudioSelectCard from "@/components/Coms/AudioSelectCard";

export default {
  props: {
    value: {
      type: Object,
      default: {}
    },
    selectItemProp: {
      type: Object
    }
  },
  data() {
    return {
      // currentValue: {},
      checked: -1,
      loading: true,
      dialogShow: false,
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', keyword: '', referCount: '' },
      dataList: [],
      page: {
        rows: 10,
        page: 1
      }
    }
  },
  components: {
    LessonFilter,
    Audio,
    AudioSelectCard
  },
  created() {
    if (this.selectItemProp) {
      this.selectItem = { ...this.selectItemProp }
    }
  },
  watch: {
    dialogShow: function (val) {
      if (val) {
        this.selectItem = { ...this.selectItemProp }
        // this.getImgList()
        this.getDataList()
      }
    }
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      // 动态计算currentValue的值
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    onSubmitFilter() {
      this.page.page = 1
      this.getDataList()
    },
    onConfirm() {
      this.currentValue = this.dataList[this.checked];
      this.dialogShow = false;
    },
    handlePageChange(val) {
      this.page.page = val
      this.getDataList()
    },
    showDialog() {
      this.dialogShow = true;
      this.page.page = 1;
      this.getDataList()
    },
    /* 获取所有素材 */
    getDataList() {
      this.loading = true;
      let select = this.selectItem
      let param = { ...select, ...this.page, type: 3 }
      Request({
        url: '/resource/getResourceList',
        type: 'post',
        data: param
      }).then(res => {
        this.page.total = res.data.totalResultSize
        this.page.count = res.data.totalPage
        this.params = param
        this.dataList = res.data.resourceList
        // console.log(4545)
      }).always(res => {
        this.loading = false
      })
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
.data-list {
  padding: 10px;
  float: left;
  width: 340px;
  height: 150px;
  position: relative;
  box-sizing: border-box;
  &:hover {
    .mask {
      display: block;
    }
  }
  video {
    width: 100%;
    height: 100%;
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

.upload-wrap {
  width: 360px;
  height: 130px;
  background-color: #fff;
  /* border: 1px solid #d9d9d9; */
  border-radius: 5px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
  color: #d9d9d9;
  /* overflow: hidden; */
  position: relative;
  display: inline-block;
  video {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }
  .icon-plus {
    color: #d9d9d9;
    line-height: 140px;
    font-size: 80px;
  }
}
.upload-wrap:hover {
  border-color: #409eff;
  color: #409eff;
  .icon-plus {
    color: #409eff;
  }
}
.wrap {
  border: 1px solid #d9d9d9;
  width: 360px;
  height: 130px;
  background-color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
  color: #d9d9d9;
  /* overflow: hidden; */
  position: relative;
  display: inline-block;
}
</style>
