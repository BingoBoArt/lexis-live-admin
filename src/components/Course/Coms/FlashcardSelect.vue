<template>
  <div>
    <el-dialog width="80%" class="dialog-item" :visible.sync="dialogShow">
      <LessonFilter v-model="selectItem" :title="''">
        <el-button type="primary" icon="el-icon-search" @click="onSubmitFilter">搜索</el-button>
        <el-button type="success" @click="choice()">确定选择</el-button>
      </LessonFilter>
      <div>
        <!--选择列表-->
        <CommonTable :dataObject="tableObject" @select="handleSelect" @select-all="handleSelect" @page-change="radioModel=''">
          <el-table-column width="150" label="Action" v-if="!multi">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radioModel" :label="scope.$index" @change.native="handleSelect(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column v-else type="selection" width="80" label="Action">
          </el-table-column>
        </CommonTable>
      </div>
    </el-dialog>

    <div v-for="(checkedData, index) in currentCheckedList" :key="index" class="checked-list">
      <el-tag size="" type='warning' closable v-if="currentCheckedList[index].word" @close="deleteChoice(index)">
        {{currentCheckedList[index].word}}
      </el-tag>
    </div>
    <el-button type="primary" @click="addChoice" plain icon="el-icon-plus" size="small">添加</el-button>
  </div>
</template>
<script>
import LessonFilter from '@/components/Coms/LessonFilter'
import CommonTable from '@/components/Coms/CommonTable'
import Request from '@/common/request.js'
export default {
  props: {
    multi: {
      type: Boolean,
      default: true,
      requried: true
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
      chosen: [],
      dialogShow: false, //弹框可用
      selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', keyword: '' },
      radioModel: '',
      tableObject: {
        dataKey: 'data',
        searchParam: { type: 'flashcard' },
        searchUrl: 'flashcard/getFlashCardList',
        pageSize: 6,
        columns: [
          {
            prop: 'relId',
            label: 'ID'
          },
          {
            prop: 'unitNameEn',
            label: 'Unit'
          },
          {
            prop: 'lessonTypeEn',
            label: 'Lesson'
          },
          {
            prop: 'classification',
            label: 'Collection category'
          },
          {
            prop: 'word',
            label: 'word'
          },
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
      let ids = [];
      if (this.multi) {
        this.currentValue.map((item) => {
          // ids += `#${item.fcId}#`
          ids.push(item.fcId)
        })
      } else {
        // ids = `#${this.currentValue.fcId}#`
        ids = this.currentValue.fcId
      }
      return ids;
    },
    currentValue: {
      // 动态计算currentValue的值
      get: function () {
        let final_value = this.handleArrObj(this.value)
        return final_value;
      },
      set: function (val) {
        let final_value = this.handleArrObj(val)
        // console.log("final_value", final_value)
        this.$emit('input', final_value);
      }
    }
  },
  created() {
    // console.log(1422., this.multi)
    if (this.selectItemProp) {
      this.selectItem = { ...this.selectItemProp }
    }
  },
  watch: {
    dialogShow: function (val) {
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
      // console.log(80808080, row)
      
      console.log( row instanceof Array ) //true=>array   false=>object
      // if(!(row instanceof Array)) {
      //   console.log(90909090, row)
      //   this.chosen = [row]
      // }else{
        this.chosen = row
      // }
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
        // console.log(3434344, this.chosen)
        // console.log(1421., this.multi)
        this.closeFlashcard(this.chosen)
      }
    },
    /* 查询列表 */
    onSubmitFilter() {
      this.tableObject.searchParam = ({ ...this.selectItem })
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
    closeFlashcard(data) {
      // console.log(707070707, this.chosen)
      let self = this;
      // console.log(1414., this.multi)
      if (this.multi) {
        // console.log(1415., this.multi)
        // console.log('data', data)
        data = data || []
        data.forEach(function (value, key, arr) {
        // console.log('遍历data', value)
        // console.log('...currentCheckedIds', self.currentCheckedIds) 
          if (self.currentCheckedIds.indexOf(value.fcId) == -1) {
            // console.log(1416., self.multi)
            if (!self.multi) {
              // console.log(1417., self.multi)
              self.currentValue = [
                {
                  fcId: value.fcId,
                  word: value.word
                }
              ]
            } else {
              // console.log(1418., self.multi)
              self.currentValue.push({
                fcId: value.fcId,
                word: value.word
              });
            }
          }
        })
      } else {
        // console.log(1419., self.multi)
        self.currentValue = [data];
      }
      // console.log(1420., this.multi)
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
      this.$emit("delete-flashcard", index);
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
</style>
