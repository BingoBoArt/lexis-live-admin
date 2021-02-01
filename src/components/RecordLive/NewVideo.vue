<template>
  <div>
    <el-table ref="myTable" v-loading="loading" :data="resultList" style="width: 100%" border highlight-current-row @select="handleSelect" @select-all="handleSelectAll" @expand-change="this.dataObject.expandChange"  :span-method="this.dataObject.spanRow?objectSpanMethod:''" :row-class-name="this.dataObject.tableRowClassName">
      <el-table-column v-if="dataObject.index" label="编号" width="50">
        <template slot-scope="scope">
          {{scope.$index+(page.page-1)*page.rows+1}}
        </template>
      </el-table-column>

      <!--  -->
      <el-table-column :width="column.width" :prop="column.prop" :label="column.label" v-for="(column,index) in dataObject.columns" :key="index">
      </el-table-column>
      <!--  -->
      <!-- block信息 -->
      <el-table-column label="blockNo--blockNoName"  align="center">
            <template slot-scope="{row}">
              <span>{{row.blockNo}}--{{row.blockNoName}}</span>
            </template>
          </el-table-column>
     <!-- 视频 -->
      <el-table-column width="220px" height="200px" prop="" label="录播视频" >
          <template slot-scope="scope">
              <Video class="video" :src="scope.row.video || ''"></Video>
          </template>
      </el-table-column>

      <el-table-column v-if="showAction" prop="" label="Action" width="120px">
        <template slot-scope="scope">
            <el-button :disabled="scope.row.isUse" size="mini" type="success" @click="sendDate(scope.$index, scope.row)" style="margin-left:0">选择录播课</el-button>
            <el-button :disabled="scope.row.isUse" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" style="margin-left:0">删除录播课</el-button>
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
import Video from '@/components/Coms/Video'
export default {
  props: {
    showAction: '',
    dataObject: {
      type: Object,
      requried: true,
      columns: []
    }
  },
  components: {
      Video
  },
  created(){
    // console.log(33333333)
    // console.log(this.dataObject)
  },
  data() {
    return {
      disabled: false,
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
    handleDelete(index,row) {
        // console.log("TCL: handleDelete -> row", row)
        this.$confirm("确定删除这个视频吗？")
        .then(_ => {
            Request({
                url: 'orderlive/interactiveNotPass',
                type: 'post',
                data: { liveId: row.liveId },
            }).then(res => {
                if( res.code == 0 ) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    // 刷新页面
                    this.query()
                }
            })
        })
        .catch(_ => { });
    },
    sendDate(index,row) {
        // console.log("TCL: sendData -> row", row)
        Request({
          url: 'orderlive/interactiveIsPass',
          type: 'post',
          data: { liveId: row.liveId},
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            /* 刷新页面 */
            this.query()
          }
        })
    },
    
    
    /* 查询 */
    handlePageChange(val) {
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
        // console.log(8888888888888888)
        if (res.data) {
          this.resultList = this.dataObject.dataKey ? res.data[this.dataObject.dataKey] : res.data
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

<style scoped>
    .video{
        width: 200px;
    }
</style>