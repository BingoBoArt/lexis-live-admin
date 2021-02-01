<template>
  <div>
    <el-table ref="myTable" v-loading="loading" :data="resultList" style="width: 100%" border highlight-current-row @select="handleSelect" @select-all="handleSelectAll" @expand-change="this.dataObject.expandChange"  :span-method="this.dataObject.spanRow?objectSpanMethod:''" :row-class-name="this.dataObject.tableRowClassName">
      <el-table-column v-if="dataObject.index" label="编号" width="50">
        <template slot-scope="scope">
          {{scope.$index+(page.page-1)*page.rows+1}}
        </template>
      </el-table-column>
      
      <el-table-column :width="column.width" :prop="column.prop" :label="column.label" v-for="(column,index) in dataObject.columns" :key="index">
      </el-table-column>
      <el-table-column v-if="dataObject.isOfficial" label="是否为官方">
        <template slot-scope="{row}">
          {{row.isOfficial | isOffs}}
        </template>
      </el-table-column>

      <el-table-column v-if="dataObject.coursetype" label="课程类型">
        <template slot-scope="{row}">
          {{row.courseType | isCourtype}}
        </template>
      </el-table-column>

      

      <el-table-column v-if="dataObject.levelInfo" label="班级等级">
        <template slot-scope="{row}">
          {{row | levelInfop}}
        </template>
      </el-table-column>

      <el-table-column v-if="dataObject.scheduleSemester" label="时间线">
        <template slot-scope="{row}">
          {{row.scheduleSemester.title}}
        </template>
      </el-table-column>

      <el-table-column v-if="dataObject.originalPrice" label="课程原价(元)">
        <template slot-scope="{row}">
          {{row.originalPrice | originalPricep}}
        </template>
      </el-table-column>

      <el-table-column v-if="dataObject.discountPrice" label="折扣价(元)">
        <template slot-scope="{row}">
          {{row.discountPrice | discountPricep}}
        </template>
      </el-table-column>

      <el-table-column v-if="dataObject.payType" label="付费类型">
        <template slot-scope="{row}">
          {{row.payType | payTypep}}
        </template>
      </el-table-column>

      

      <el-table-column v-if="dataObject.editUrl || dataObject.deleteUrl" prop="" label="Action" :width="(dataObject.editUrl && dataObject.deleteUrl) ? 220 : 120">
        <template slot-scope="scope">
          <el-button v-if="dataObject.editUrl" type="primary" size="mini" icon="el-icon-edit" @click="editDateTow(scope.row)">edit</el-button>
          <el-button v-if="dataObject.deleteUrl" size="mini" type="danger" icon="el-icon-delete" @click="deleteDate(scope.row)">delete</el-button>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <div class="page-box" v-if="!this.dataObject.noPage">
      <el-pagination v-if="this.dataObject.searchUrl" @current-change="handlePageChange" layout="total, prev, pager, next, jumper" :page-size="page.rows" :total="page.total" :current-page="page.page" background>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Request from '@/common/request.js'
export default {
  props: {
    /**
     dataObject举例：
     questionObject: {
        dataKey: 'questionList', // data对应的key
        idKey: 'quesId', // id对应的key
        searchUrl: 'question/getQuestionList', // 查询接口地址
        editUrl: '/dashboard/Library/Question/AddQuestion', // 编辑跳转地址，不传则无编辑按钮
        deleteUrl: 'question/deleteQuestion', // 删除接口地址，不传则无删除按钮
        searchParam: {}, // 查询参数
        columns: [ // 表格显示字段
            {
                prop: 'quesId',
                width: '100',
                label: 'ID'
            },
            {
                prop: 'unitNameCh',
                label: 'Unit'
            },
            {
                prop: 'lessonTitle',
                label: 'Lesson'
            },
            {
                prop: 'type',
                label: 'Type'
            },
            {
                prop: 'stem',
                label: 'Question Text'
            }
        ]
    },
    */
    dataObject: {
      type: Object,
      requried: true,
      columns: []
    }
  },
  created() {
    // console.log("透ge传", this.dataObject)
    // alert(2)
  },
  filters: {
    isCourtype: function(val) {
      if(val == 1) {
        return '正课'
      }else{
        return '节日课'
      }
    },
    isOffs: function(val) {
      // return 
      if(val == 1) {
        return '是'
      }else{
        return '否'
      }
    },
    payTypep: function(val) {
      if(val == 1) {
        return '付费'
      }else {
        return '免费'
      }
    },
    originalPricep: function(val) {
      return val/100
    },
    discountPricep: function(val) {
      return val/100
    },
    levelInfop: function(val) {
      if(val.levelInfo) {
        return val.levelInfo.title
      }else{
        return ''
      }
    }
  },
  data() {
    return {
      mold: '',
      spanArr: [],
      pos: 0,
      loading: true,
      page: {
        rows: 10,
        page: 1,
        size: 10,
        current: 1
      },
      resultList: []
    }
  },
  watch: {
    dataObject: {
      handler: function (new_value, old_value) {
        // this.page.page = 1;
        this.query();
      },
      deep: true
    },
    'dataObject.data': function () {
      if (this.dataObject.data) {
        this.resultList = this.dataObject.data
      }
    },
    'page.page': function () {
      // console.log(this.page.page)
      this.$emit('change-page', this.page.page)
    }
  },
  methods: {
    editDateTow(row) {
      console.log("T2222222CL: editDateTow -> row", row)
      let url = this.dataObject.editUrl
      if(this.$route.name == 'LevelList') {
        this.$router.push({ path: url, query: { levelId: row.levelId} })
      }else if(this.$route.name == 'SchoolList') {
        this.$router.push({ path: url, query: { schoolId: row.schoolId} })
      }else if(this.$route.name == 'ClassList') {
        this.$router.push({ path: url, query: { classId: row.classId} })
      }else {
        // 页面跳转
        this.$router.push({ path: url, query: { [this.dataObject.idKey]: row[this.dataObject.idKey], schoolId: row.schoolId } })
      }
    },
    deleteDate(row) {
      // console.log(row)
      let datas
      if(this.dataObject.deleteUrl == 'delLevel' && this.$route.name == 'LevelList') {
        datas = {levelId: row.levelId}
      }else {
        datas = { [this.dataObject.idKey]: row[this.dataObject.idKey] }
      }
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url: this.dataObject.deleteUrl,
          type: 'post',
          data: datas
          // data: { [this.dataObject.idKey]: row[this.dataObject.idKey] }
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            /* 刷新页面 */
            this.query()
          }
        })
      })
    },
    /* 查询 */
    handlePageChange(val) {
      // alert(val)
      this.page.page = val
      this.query(this.params)
      this.$emit("page-change", val);
    },
    query() {
      let that = this
      let searchParam = this.dataObject.searchParam
      this.loading = true;
      this.page.current = this.page.page
      this.page.size = this.page.rows
      Request({
        url: this.dataObject.searchUrl,
        type: 'post',
        data: { rows: that.page.rows, page: that.page.page, ...searchParam, ...that.page }
      }).then(res => {
        // alert(2)
        // console.log(that.dataObject.searchUrl)
        // console.log(res.data.data)
        if (res.data) {
          this.resultList = this.dataObject.dataKey ? res.data[this.dataObject.dataKey] : res.data
          if(this.dataObject.dataKey == 'classlist') {
            this.resultList = res.data.data
          }
          // console.log(this.resultList)
          if (this.resultList == null) {
            this.resultList = []
          }
          that.page.total = res.data.totalResultSize || res.data.total || res.data.count
          that.page.count = res.data.totalPage || res.data.pages || res.data.maxPage
          // 判断是否合并
          if (this.dataObject.spanRow) {
            this.getSpanArr(this.resultList)
          }
          // 页码锁，防止开始页码过大问题
          if (that.page.count) {
            if (that.page.count < that.page.current) {
              that.page.current = that.page.count
              that.page.page = that.page.current
              this.query()
            }
          }
        }
      })
        .always(() => {
          this.loading = false;
        })
    },
    handleSelect(row) {
      this.$emit('select', row)
    },
    handleSelectAll(row) {
      this.$emit('select-all', row)
    },
    // 可并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === this.dataObject.spanRow) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return { rowspan: _row, colspan: _col }
      }
    },
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1)
          this.pos = 0
        } else {
          if (data[i][this.dataObject.spanRow] === data[i - 1][this.dataObject.spanRow]) {
            // 如果useName相等就累加，并且push 0
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            // 不相等push 1
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    }
  },
  mounted() {
    if (this.dataObject.pageSize) {
      this.page.rows = this.dataObject.pageSize;
    }
    if (this.dataObject.page) {
      this.page.page = this.dataObject.page
    }
    if (this.dataObject.searchUrl) {
      this.query();
    } else {
      this.loading = false
    }
  }
}
</script>
