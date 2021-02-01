<template>
    <div style="min-width: 800px;">
        <breadcrumb></breadcrumb>
        <div class="content-main">
          <div class="filter-box">
              <LessonSelect v-model="selectCon" @update="val=> selectCon = val"  @search="getLessonList">
                  <div class="search-btn">
                    <el-button type="primary" icon="el-icon-search" @click="onSubmitFilter">搜索</el-button>
                    <!-- 
                    <router-link to="/dashboard/Course/Add">
                      <el-button type="primary" icon="el-icon-plus" @click="getLessonList">创建课件</el-button>
                    </router-link> 
                    -->
                  </div>
              </LessonSelect>
          </div>
          <div class="form-table-box">
              <el-table type="index" v-loading="loading" :data="resultList" style="width: 100%" min-width="100px" border stripe highlight-current-row>
                  <el-table-column header-align="center"  min-width="100px"   :width="column.width" :prop="column.prop" :label="column.label" v-for="(column,index) in lessonObject.columns" :key="index">
                  </el-table-column>
                  <el-table-column align="center"  prop="status" label="Status" width="100">
                      <template slot-scope="scope">
                          <p v-if="scope.row.status == 2">准备上架</p>
                          <p v-else-if="scope.row.status == 1">已发布</p>
                      </template>
                  </el-table-column>
                  <el-table-column align="center"  prop="lessonNo" label="Action" width="190">
                      <template slot-scope="scope" >
                          <el-button type="primary" size="small" icon="el-icon-edit" style="font-weight: 200;" @click="toEditLesson(scope.row)">编辑</el-button>
                          <el-button type="warning" size="small" icon="el-icon-upload" style="font-weight: 200;" v-if="scope.row.status == 2" @click="publishLesson(scope)">发布</el-button>
                          <el-button type="info" size="small" style="font-weight: 200;" disabled v-else-if="scope.row.status == 1">已发布</el-button>
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
import Request from "@/common/request.js"
import LessonSelect from './Coms/LessonSelect'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { mapGetters } from 'vuex'
export default {
    props: {
        lessonNo: {
            type: Number,
            required: false,
            defult: 3
        }
    },
    data () {
        return {
            page: {
                rows: 10,
                total: '',
                page: 1
            },
            level: '',
            selectCon: {},
            loading: false,
            resultList: [],
            selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '' },
            selectItemOb: {},
            lessonObject: {
                columns: [
                    {
                        prop: 'lessonNo',
                        label: '课件Id',
                        width: '80'
                    },
                    {
                        prop: 'seq',
                        label: '排序',
                        width: '80'
                    },
                    {
                        prop: 'lessonNoName',
                        label: '课件编号',
                        width: '120'
                    },
                    {
                        prop: 'titleCh',
                        label: '课件Ch'
                    },
                    {
                        prop: 'titleEn',
                        label: '课件EN'
                    },
                    {
                        prop: 'lessonTypeCh',
                        label: '课程类型'
                    },
                    {
                        prop: 'unitNameCh',
                        label: '单元名称'
                    },
                    {
                        prop: 'level',
                        label: '等级',
                        width: '80'
                    }
                    // ,{
                    //     prop: 'lessonTypeCh',
                    //     label: '标题'
                    // }
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            "lessonNo"
        ])
    },
    components: {
        Breadcrumb,
        LessonSelect
    },
    filters: {
        /* 过滤器，调整时间列表宽度 */
        // ifDateTime: function (value) {
        //     /* endswith函数结尾比对函数 */
        //     if(value.prop.endsWith('Time')){
        //         return '170px'
        //     }else {
        //         return 'auto'
        //     }
        // }
    },
    created (){
        this.$store.dispatch('getLessonNo');
        this.$store.commit('setLessonNo', '');
    },
    mounted() {
        this.getLessonList();
    },
    methods: {
        publishLesson(scope) {
            const index = scope.$index;
            const self = this;
            Request({
                type: 'post',
                url: '/lesson/publishLesson',
                data: {
                    lessonNo: scope.row.lessonNo
                }
            }).then((res) => {
                if(res.code == '0000'){
                    self.resultList[index].status = 1;
                    self.$message({
                        type: 'success',
                        message: '发布成功!'
                    });
                }else {
                    self.$message({
                        type: 'error',
                        message: res.msg || '操作失败!'
                    });
                }
            }).catch(() => {
                // 错误处理
            }).always(() => {
                self.loading = false;
            });
        },
        onSubmitFilter () {
          this.page.page = 1
          this.getLessonList()
        },
        toEditLesson(param) {
            this.$router.push({
                path: 'Edit',
                name: 'Edit',
                query: {
                    lessonNo: param.lessonNo
                }
            })
        },
        handlePageChange (val) {
            this.page.page = val;
            this.getLessonList(this.params);
        },
        getLessonList(){
            // console.log(676868768, this.params)
            this.loading = true;
            let self = this;
            Request({
                url: '/lesson/getLessonByItems',
                data: {
                    ...this.selectCon,
                    page: self.page.page,
                    rows: self.page.rows
                }
            }).then((res) => {
                this.resultList = res.data.lessonList;
                self.page.total = res.data.totalResultSize;
                self.page.count = res.data.totalPage;
            }).catch(() => {
                // 错误处理
            }).always(() => {
                self.loading = false;
            });
        }
    }
}
</script>
