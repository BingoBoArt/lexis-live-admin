<template>
  <div class="content-page">
    <div class="content-nav">
      <div class="operation-nav">
        <router-link to="/dashboard/Example/Add">
          <el-button type="primary" icon="plus">添加课程</el-button>
        </router-link>
      </div>
    </div>
    <div class="content-main">
        <div class="filter-box">
          <el-form :inline="true" :model="filterForm" class="demo-form-inline">
            <el-form-item label="搜索标题">
              <el-input v-model="filterForm.searchKey" placeholder="标题关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitFilter" icon="search">查询1</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-table-box">
          <el-table v-loading="loading" :data="tableData" style="width: 100%" border stripe highlight-current-row>
            <el-table-column prop="id" label="ID" width="100">
            </el-table-column>
            <el-table-column prop="title" label="标题">
            </el-table-column>
            <el-table-column prop="pic" label="图片" width="200" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.pic" width="100" height="100">
                </template>
            </el-table-column>
            <el-table-column prop="read" label="虚拟阅读数" width="120">
            </el-table-column>
            <el-table-column prop="visit" label="真实阅读数" width="120">
            </el-table-column>
            <el-table-column prop="time" label="发布时间" width="120">
            </el-table-column>
            <el-table-column prop="is_show" label="是否上架" width="80">
                <template slot-scope="scope">
                    {{ scope.row.status == 1 ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="sort_order" label="排序" width="80">
            </el-table-column>
            <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-box">
          <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="size" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>


        <CommonTable :dataObject="questionObject">
          <el-table-column label="Action" width="300">
            <template slot-scope="scope">
                <el-button type="success" size="mini" icon="edit" @click="editDateTow(scope.row)">edit2</el-button>
                <el-button size="mini" type="danger" icon="delete" @click="deleteDate(scope.row)">delete2</el-button>
            </template>
        </el-table-column>
        </CommonTable>
    </div>
    <div>
      <el-button type="error" @click="getTestDate">测试</el-button>
      {{123}} {{returndata}}
    </div>
  </div>
</template>

<script>
import Request from "@/common/request.js"
import CommonTable from '@/components/Coms/CommonTable'
export default {
  data () {
    return {
      page: 1,
      size: 10,
      total: 0,
      loading: true,
      filterForm: {
        searchKey: ''
      },
      tableData: [],
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
      returndata: ''
    }
  },
  methods: {
    handlePageChange (val) {
      this.page = val;
      //保存到localStorage
      localStorage.setItem('Page', this.page)
      localStorage.setItem('FilterForm', JSON.stringify(this.filterForm));
      this.getList()
    },
    handleRowEdit (index, row) {
      this.$router.push({ name: 'Example/Add', query: { id: row.id } })
    },
    handleRowDelete (index, row) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url: '/xxx',
          // mock: require('@/mock/delete.js').default,
          data: {
            id: 'xxx'
          }
        }).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          }
        })
      });
    },
    getTestDate () {
      Request({
        url: '/welcome'
      }).then(res => {
        // console.log(res.data)
        this.returndata = res.data
      })
    },
    onSubmitFilter () {
      this.page = 1
      this.getList()
    },
    getList () {
      this.loading = true;
      Request({
        url: '/xxx',
        // mock: require('@/mock/list.js').default,
        data: {
          page: this.page,
          size: this.size,
          searchKey: this.filterForm.searchKey
        }
      }).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
      }).catch(() => {
        // 错误处理
      }).always(() => {
        this.loading = false;
      })
    }
  },
  components: {

  },
  mounted () {
    this.getList();
  }
}

</script>

