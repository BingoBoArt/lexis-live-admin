<template>
    <div >
        <breadcrumb></breadcrumb>
        <router-link to="/dashboard/Library/Flashcards/Add" class="add top-btn">
          <el-button type="success" icon="el-icon-plus">新增FlashCard</el-button>
        </router-link>
        <div class="content-main">
          <div class="filter-box clearfix">
            <LessonFilter v-model="filter">
              <el-button type="primary" @click="onSubmitFilter" icon="el-icon-search">查询</el-button>
            </LessonFilter>
          </div>
          <div class="letters" v-loading="loading">
              <el-button size="small" @click="updateFirstLetter(letter.letter)" round v-for="(letter, index) in letters" :key="index">{{letter.letter}}({{letter.fcCount}})</el-button>
          </div>
          <div class="form-table-box" v-loading="loading">
              <el-table v-loading="loading" :data="tableData" style="width: 100%" border stripe highlight-current-row>
                  <el-table-column :width="column.width" :prop="column.prop" :label="column.label" v-for="(column,index) in columns" :key="index">
                  </el-table-column>
                  <el-table-column label="Action" width="220">
                      <template slot-scope="scope">
                          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleRowEdit(scope.row)">Edit</el-button>
                          <!-- <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleRowDelete(scope.row)">Delete</el-button> -->
                      </template>
                  </el-table-column>
              </el-table>
              <div class="page-box">
                  <el-pagination
                      @current-change="handlePageChange"
                      :page-size="page.rows" :total="page.total" :current-page="page.page"
                      background
                      layout="total, prev, pager, next, jumper"
                      >
                  </el-pagination>
              </div>
          </div>
        </div>
    </div>
</template>
<script>
import LessonFilter from '@/components/Coms/LessonFilter'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
    data () {
        return {
            page: {
                rows: 10,
                page: 1
            },
            firstLetter: '',
            filter: {},
            loading: false,
            columns: [
                {
                    prop: 'fcId',
                    label: 'ID'
                },
                {
                    prop: 'word',
                    label: 'Flashcard'
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
                    label: 'Classification'
                },
                {
                    prop: 'classificationName',
                    label: '词性'
                }
            ],
            letters: [],
            letterTypes: ['success'],
            tableData: []
        }
    },
    components: {
        LessonFilter,
        Breadcrumb
    },
    mounted () {
        this.getFlashcardLetter()
    },
    methods: {
        handlePageChange (val) {
            this.page.page = val;
            this.showFlashcardList();
        },
        onSubmitFilter() {
          this.page.page = 1;
          this.getFlashcardLetter();
        },
        // 查询flashcard的所有列表
        getFlashcardLetter () {
            let that = this
            let resource = {
                ...this.filter,
                type: 'flashcard' //flashcard
            }
            this.loading = true;
            Request({
              url: '/flashcard/getFirstLetterList',
              data: resource,
              type: 'post'
            }).then(res => {
              that.letters = res.data
              this.showFlashcardList()
            }).always(() => {
              that.loading = false;
            })
        },
        updateFirstLetter (firstLetter) {
          if(firstLetter == this.firstLetter){
            this.firstLetter = ""
          }else{
            this.firstLetter = firstLetter
          }
          this.page.page = 1;
          this.showFlashcardList();
        },
        showFlashcardList () {
            let that = this
            let params = {
                ...this.filter,
                ...this.page,
                firstLetter: this.firstLetter,
                type: 'flashcard' //flashcard
            }
            Request({
                url: '/flashcard/getFlashCardList',
                data: params
            }).then((res) => {
                that.tableData = res.data.data
                that.page.total = res.data.totalResultSize;
            }).catch(() => {
                // 错误处理
            }).always(() => {
                that.loading = false;
            })
        },
        handleRowEdit (row) {
            // console.log(row)
            this.$router.push({ name: 'Flashcards/Add', query: { fcId: row.fcId } })
        },
        handleRowDelete (rel) {
            let relId = rel.relId
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Request({
                  url: '/flashcard/deleteFlashCard',
                  type: 'get',
                  data: {
                    relId
                  }
                }).then(res => {
                    console.log(res.data)
                }).always(() => {
                    this.showFlashcardList(rel.firstLetter)
                })
            })
        }
    }
}
</script>

<style scoped>
.letters{
  .el-button{
    margin: 4px;
  }
}
.form-table-box{
  margin-top: 20px;
}
</style>
