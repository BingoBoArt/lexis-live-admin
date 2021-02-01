<template>
  <div>
    <el-dialog width="80%" class="dialog-item" :visible.sync="dialogShow">
      <LessonFilter v-model="selectItem" :title="''" :needKeyword="false">
        <el-radio-group v-model="type">
          <el-radio v-if="selectList.length>1" v-for="(item,index) in selectList" :key="index" :label="item"></el-radio>
          <div v-show="false" v-else>{{type = selectList[0]}}</div>
        </el-radio-group>
        <el-button type="primary" icon="el-icon-search" @click="onSubmitFilter">搜索</el-button>
        <el-button type="success" @click="choice()">确定选择</el-button>
      </LessonFilter>
      <div>
        <!--选择列表-->
        <CommonTable :dataObject="tableObject" @select="handleSelect" @select-all="handleSelect" @page-change="radioModel=''">
          <el-table-column label="options">
            <template slot-scope="scope">
              <span style="display: none">{{answers = (scope.row.question.map((item) => {return `#${item.answer}#`}).join(""))}}</span>
              <ul class="option-list">
                <li v-for="(item, index) in scope.row.option" :key="index" :class="{'right-answer': answers.indexOf(`${item.item}#`) > -1}">
                  <span v-if="item.text">{{item.item}}. {{item.text}}</span>
                  <span class="img-wrapper" v-if="item.img">
                    <img :src="item.img.content">
                  </span>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column width="150" label="Action" v-if="!multi">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radioModel" :label="scope.$index" @change.native="handleSelect(scope.row)" :disabled="optionCount ? (scope.row.option && scope.row.option.length == optionCount ? false : true) : false">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column v-else type="selection" width="80" label="Action">
          </el-table-column>
        </CommonTable>
      </div>
    </el-dialog>

    <div v-for="(checkedData, index) in currentCheckedList" :key="index" class="checked-list">
      <el-tag size="" type='warning' closable v-if="currentCheckedList[index].stem" @close="deleteChoice(index)">
        {{currentCheckedList[index].stem.text || currentCheckedList[index].stem.topic || "没有内容"}}
      </el-tag>
    </div>
    <el-button type="primary" @click="addChoice" plain icon="el-icon-plus" size="small">选择</el-button>
    <!-- <el-popover trigger="hover" placement="top"> -->
      <el-button style="margin-left: 30px" trigger="hover"  v-if="type != '1-8'" :disabled="canEdit" type="warning" @click="editQuestion" plain icon="el-icon-edit" size="small">编辑</el-button>
      <h3 style="color: red" v-if="type != '1-8' && canEdit">{{mintitle}}</h3>
    <!-- </el-popover> -->
  </div>
</template>
<script>
import LessonFilter from '@/components/Coms/LessonFilter'
import CommonTable from '@/components/Coms/CommonTable'
import Request from '@/common/request.js'
export default {
  props: {
    multi: { // 是否可多选
      type: Boolean,
      default: true,
      requried: true
    },
    selectList: { // 1-1 1-3 ...
      type: Array,
      default: '',
      requried: true
    },
    mold: { // mold=2 代表 vote
      type: String,
      default: 1,
      requried: false
    },
    optionCount: { // 补丁。 选项个数，type='1-3'情况下，需要区分2选项还是4选项， 0为无限制
      type: Number,
      requried: false
    },
    value: {
      type: Object
    },
    selectItemProp: {
      default: false
    }
  },
  data() {
    return {
      mintitle: '请先保存当前内容,再进行编辑',
      canEdit: false,
      type: '',
      chosen: [],
      dialogShow: false, //弹框可用
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', keyword: '' },
      radioModel: '',
      tableObject: {
        dataKey: 'questionList', // data对应的key
        idKey: 'quesId', // id对应的key
        searchUrl: 'question/getQuestionList', // 查询接口地址
        searchParam: {}, // 查询参数
        pageSize: 5,
        columns: [ // 表格显示字段
          {
            prop: 'quesId',
            width: '100',
            label: 'ID'
          },
          {
            prop: 'type',
            label: 'Type',
            width: 100,
          },
          {
            prop: 'stem',
            label: 'Question Text',
            width: 200,
          }
        ]
      }
    }
  },
  computed: {
    currentCheckedList: function () {
      if (!this.currentValue) {
        return []
      }
      if (this.currentValue.constructor == Array) {
        return this.currentValue
      } else {
        return [this.currentValue]
      }
    },
    
    currentCheckedIds: function () {
      if (!this.currentValue) {
        return ""
      }
      let ids = "";
      if (this.multi) {
        this.currentValue.map((item) => {
          ids += `#${item.quesId}#`
        })
      } else {
        ids = `#${this.currentValue.quesId}#`
      }
      return ids;
    },
    currentValue: {
      // 动态计算currentValue的值
      get: function () {
        console.log('dong太value', this.value)
        let final_value = this.handleArrObj(this.value)
        return final_value;
      },
      set: function (val) {
        let final_value = this.handleArrObj(val)
        console.log("final_value", final_value)
        this.$emit('input', final_value);
      }
    }
  },
  created() {
      if(this.$route.query.page || this.$route.query.page === 0) {
        this.canEdit = false
      }else {
        this.canEdit = true
      }
  },
  mounted() {
    this.tableObject.searchParam = { ...this.tableObject.searchParam, mold: this.mold }
    if (this.selectItemProp) {
      this.selectItem = { ...this.selectItemProp }
    }
  },
  watch: {
    type: function (newValue) {
      this.tableObject.searchParam = { ...this.tableObject.searchParam, type: newValue }
    },
    mold: function (newValue) {
      this.tableObject.searchParam = { ...this.tableObject.searchParam, mold: newValue }
    },
    dialogShow: function (val) {
      this.type = this.selectList[0]
      if (val) {
        this.selectItem = { ...this.selectItemProp }
        this.onSubmitFilter()
      }
    }
  },
  components: {
    LessonFilter,
    CommonTable
  },
  methods: {
    /* 取值 */
    handleSelect(row) {
      this.chosen = row
      console.log(40001, this.chosen)
    },
    /* 关闭dialog */
    choice() {
      if (!this.chosen) {
        this.$message({
          type: "error",
          showClose: true,
          message: 'please choose the data'
        })
      } else {
        this.closeDialog(this.chosen)
      }
    },
    /* 查询列表 */
    onSubmitFilter() {
      this.tableObject.searchParam = { type: this.type, mold: this.mold, ...this.selectItem }
    },
    handleArrObj(val) {
      let final_value = null;
      if (!this.multi) {
        final_value = val.constructor == Array ? val[0] : val
      } else {
        final_value = val
      }
      return final_value;
    },
    /* 打开dialog */
    openFlashcard(a) {
      // this.dialogShow.splice(a, 1, true)
      this.dialogShow = true
    },
    /* 关闭dialog 返回数据 */
    closeDialog(data) {
      let self = this;
      if (this.multi) {
        data = data || []
        data.forEach(function (value, key, arr) {
          console.log("这是value", value)
          if (self.currentCheckedIds.indexOf(value.quesId) == -1) {
            if (!self.multi) {
              self.currentValue = [
                {
                  quesId: value.quesId,
                  stem: value.stem
                }
              ]
            } else {
              self.currentValue.push({
                quesId: value.quesId,
                stem: value.stem
              });
            }
          }
        })
      } else {
        self.currentValue = [data];
      }
      this.dialogShow = false
    },
    /* 增加选项 */
    addChoice() {
      this.dialogShow = true
    },
    /* 删除选项 */
    deleteChoice(index) {
      if (!this.multi) {
        this.currentValue = {}
      } else {
        this.currentValue.splice(index, 1)
      }
    },
    /* 编辑question */
    editQuestion(row) {
      // 页面跳转
      let currentCheckedList = this.currentCheckedList;
      let question = currentCheckedList && currentCheckedList.length && currentCheckedList[0] || {};
      if (question.quesId) {
        this.$router.push({ path: "/dashboard/Library/Question/AddQuestion", query: { quesId: question.quesId } })
      }
    }
  }
}
</script>
<style scoped>
.checked-list {
  display: inline;
}
.checked-list .el-tag {
  margin-right: 10px;
}
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
</style>
