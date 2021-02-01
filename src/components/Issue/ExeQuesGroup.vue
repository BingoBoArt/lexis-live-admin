<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 卷 -->
    <div>
      <el-form>
        <el-form-item label="卷名称:">
          <el-input v-model="group.groupName" placeholder="请输入卷名称"></el-input>
          <el-button @click="saveGroup" v-if="group.id">保存</el-button>
          <el-button @click="saveGroup" v-else>保存</el-button>
        </el-form-item>
        <el-form-item label="试题信息:" v-if="group.totalCount!=0 && group.totalCount">
          <el-button type="primary" plain>总数量：{{group.totalCount}}</el-button>
          <el-button type="success" plain>一级数量：{{group.levelOne}}</el-button>
          <el-button type="success" plain>二级数量：{{group.levelTow}}</el-button>
          <el-button type="success" plain>三级数量：{{group.levelThree}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <!-- 试题列表 -->
      <el-button class="ques-btn" icon="el-icon-plus" type="success" @click="newQuestion()">新增习题</el-button>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="问题列表" name="fa">
          <!-- 列表展示 -->
          <el-table :data="resultList" style="width: 100%" border>
            <el-table-column v-for="(column,index) in columnList" :width="column.width" :prop="column.prop" :label="column.label" :key="index">
            </el-table-column>
            <el-table-column label="资源" width="260px">
              <template slot-scope="{row}">
                <div v-if="row.titleType ===1 ">
                  <span>{{row.text}}</span>
                </div>
                <div v-else-if="row.titleType === 2 ">
                  <img :src="row.imageUrl" class="ques-image">
                </div>
                <div v-else-if="row.titleType == 3">
                  <audio controls class="my-audio" :src="row.audioUrl">
                  </audio>
                </div>
                <div v-else-if="row.titleType == 4">
                  <video controls :src="row.videoUrl" width="260" height="180">
                    <source :src="row.videoUrl" type="video/mp4" width="260" height="180">
                    <source :src="row.videoUrl" type="video/ogg" width="260" height="180">
                    <source :src="row.videoUrl" type="video/webm" width="260" height="180">
                    <object :data="row.videoUrl" width="260" height="180">
                      <embed :src="row.videoUrl" width="260" height="180">
                    </object>
                  </video>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="options" min-width="300px">
              <template slot-scope="{row}">
                <ul class="option-list">
                  <li v-for="(item, index) in row.optionList" :key="index" :class="{'right-answer': item.isCorrect === 1}">
                    {{item.item}}.
                    <span v-if="row.optionType == 1">{{item.text}}</span>
                    <span class="img-wrapper" v-if="row.optionType == 2">
                      <img :src="item.imageUrl">
                    </span>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="编辑" width="100px">
              <!-- 问题编辑 -->
              <template slot-scope="{row}">
                <el-button @click="editQues(row.quesId)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="浏览" name="see">
          <div v-for="(ques,index) in resultList" :key="index">
            <ExeQuesView :ques="ques"></ExeQuesView>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from "@/common/request.js"
import CommonTable from '@/components/Coms/CommonTable'
import ExeQuesView from "./ExeQuesView"
export default {
  data() {
    return {
      /* tabs */
      activeName: 'fa',
      group: { groupName: "" },
      resultList: [],
      viewList: [],
      columnList: [
        {
          prop: 'quesId',
          label: 'ID',
          width: 60
        },
        {
          prop: 'level',
          label: '等级',
          width: 50
        },
        {
          prop: 'quesTitle',
          label: '标题'
        },
        {
          prop: 'score',
          label: '分数',
          width: 50
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /* 初始化内容 */
    init() {
      /* 初始化 group */
      let groupId = this.$route.query.groupId
      if (groupId) {
        this.getGroupInfo(groupId)
        this.getQuestionList(groupId)
      }
    },
    /* 获取group */
    getGroupInfo(groupId) {
      let url = "exe/question/group/info"
      Request({
        url: url,
        type: "post",
        data: { groupId: groupId }
      }).then(res => {
        if (res.code == 0) {
          this.group = res.data
        } else {
          this.$message.error("获取试题组出错")
        }
      })
    },
    /* 获取该group下的所有问题 */
    getQuestionList(groupId) {
      Request({
        url: 'exe/question/list',
        data: { groupId: groupId },
        type: 'post'
      }).then(res => {
        if (res.code == 0) {
          this.resultList = res.data
          this.viewList = res.data
        }
      })
    },
    /* save group */
    saveGroup() {
      let url = 'exe/question/group/edit'
      Request({
        url: url,
        type: "post",
        data: this.group
      }).then(res => {
        if (res.code == 0) {
          this.group.id = res.data
          this.$message.success("操作成功")
        } else {
          this.$message.error("操作失败")
        }
      })
    },
    /* 新增问题 */
    newQuestion() {
      if (!this.group.id) {
        this.$message.error("没有试卷")
        return null;
      }
      this.$router.push({ path: '/dashboard/Issue/ExeQuestion', query: { groupId: this.group.id, show: true } })
    },
    /* 编辑问题 */
    editQues(quesId) {
      this.$router.push({ path: '/dashboard/Issue/ExeQuestion', query: { groupId: this.group.id, quesId: quesId } })
    }
  },
  components: {
    Request,
    CommonTable,
    ExeQuesView,
    Breadcrumb
  }
}
</script>

<style scoped>
/* 问题按钮布局 */
.ques-btn {
  display: block;
  position: relative;
  float: right;
  z-index: 100;
}
/* 问题图片样式 */
.ques-image {
  width: 60px;
}
/* 列表样式 */
.option-list {
  li {
    float: left;
    margin: 0 10px;
    .img-wrapper {
      width: 50px;
      height: 50px;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
      }
    }

    &.right-answer {
      .img-wrapper {
        position: relative;
        display: inline-block;
        &:after {
          content: "✓";
          color: white;
          font-size: 30px;
          position: absolute;
          top: 10px;
          right: 10px;
        }
        &:before {
          content: " ";
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.3);
        }
      }
      span {
        color: green;
        &:after {
          content: "✓";
          font-size: 14px;
        }
      }
    }
  }
}
/* 上传布局 */
.el-my-upload {
  width: 260px;
  height: 120px;
  /* padding: 5px; */
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-my-upload:hover {
  border-color: #409eff;
}
.el-upload {
  display: grid;
}

/* 扩展 */
.ext-image {
  height: 260px;
}
.ext-video {
  height: 180px;
}
.el-upload-dragger,
.el-icon-upload {
  font-size: 40px;
  color: #c0c4cc;
  margin: 10px 0 0px;
  line-height: 50px;
}
.el-upload-dragger,
.el-upload__text {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

/* 图片内容 */
.content-mul-img {
  width: fit-content;
  height: fit-content;
  text-align: center;
  display: block;
  border-radius: 5px;
}
.content-mul-image {
  width: fit-content;
  display: block;
  float: left;
}
.content-mul-img-src {
  width: 100%;
  border-radius: 5px;
}

/* 按钮 */
.content-mul-img-btn {
  margin: 10px 0px;
  text-align: center;
}
/* 地址连接 */
.el-my-upload-fileurl-out {
  height: 18px;
  width: 330px;
  margin: 10px 0;
  overflow-x: hidden;
  overflow-y: hidden;
}
.el-my-upload-fileurl {
  text-align: left;
  overflow: scroll;
  font-size: 12px;
  margin-top: 2px;
  white-space: nowrap;
  color: #0daed6;
  overflow-x: scroll;
  overflow-y: hidden;
}
/* 音频样式 */
.my-audio {
  height: 88px;
  width: 240px;
}

.right-answer {
  .img-wrapper {
    position: relative;
    display: inline-block;
    &:after {
      content: "✓";
      color: white;
      font-size: 30px;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    &:before {
      content: " ";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.3);
    }
  }
  span {
    color: green;
    &:after {
      content: "✓";
      font-size: 14px;
    }
  }
}
</style>
