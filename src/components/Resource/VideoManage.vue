<template>
    <div>
        <!-- 位置 -->
        <breadcrumb></breadcrumb>
        <el-button class="top-btn" type="success" icon="el-icon-upload" @click="dialogShow=true">上传视频素材</el-button>
        <el-dialog class="upload-dialog" :visible.sync="dialogShow" title="上传视频素材" :width="'80%'" :height="'80%'">
          <UploadMutil type="video" />
        </el-dialog>
        <!-- 分类-数据 -->
        <div class="content-main">
          <div class="filter-box">
            <el-form :inline="true" :model="selectItem" class="demo-form-inline" label-width="100px">
              <LessonFilter v-model="selectItem" :title="''">
                <el-form-item label="" style="width: 120px">
                  <el-select v-model="selectItem.referCount" placeholder="请选择">
                    <el-option label="全部视频" value=""></el-option>
                    <el-option label="未使用视频" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitFilter" icon="el-icon-search">查询</el-button>
                </el-form-item>
              </LessonFilter>
            </el-form>
          </div>

          <div class="form-table-box clearfix" v-loading="loading">
              <div class="data-list" v-for="(video, index) in videoList" :key="index">
                  <VideoCard :dataInfo="video" @data-update="afterDelete"></VideoCard>
              </div>
              <div class="no-data" v-if="!(videoList && videoList.length)">没有数据</div>
          </div>
          <div class="page-box" v-if="videoList">
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
</template>
<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import LessonFilter from '@/components/Coms/LessonFilter'
import VideoCard from '@/components/Coms/VideoCard'
import UploadMutil from '@/components/Coms/UploadMutil'
import Request from '@/common/request.js'
export default {
    data () {
        return {
            loading: false,
            dialogShow: false,
            selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', keyword: '', referCount: ''},
            videoList: [],
            page: {
                rows: 10,
                page: 1
            }
        }
    },
    components: {
        Breadcrumb,
        LessonFilter,
        VideoCard,
        UploadMutil
    },
    mounted () {
        this.getVideoList()
    },
    computed: {
        show: function () {
            if (this.showItem) {
                return {
                    display: 'flex'
                }
            }
        }
    },
    methods: {
        onSubmitFilter() {
          this.page.page = 1
          this.getVideoList()
        },
        updateSelect () {
            this.getVideoList();
        },
        showDialog () {
            this.dialogVisible = true
        },
        handlePageChange (val) {
            this.page.page = val
            this.getVideoList()
        },
        /* 获取所有视频 */
        getVideoList () {
            this.loading = true;
            let param = { ...this.selectItem, type: 2}
            Request({
              type: 'post',
              url: '/resource/getResourceList',
              data: { ...param, ...this.page}
            }).then(res => {
                this.page.total = res.data.totalResultSize
                this.page.count = res.data.totalPage
                this.params = param
                this.videoList = res.data.resourceList
            }).catch(error => {
                console.log(error)
            }).always(res => {
                this.loading = false
            })
        },
        /* 删除后更新 */
        afterDelete () {
            this.getVideoList();
        },
        /* 过滤视频数据 */
        imgFilterUse (val) {
            return val.referCount > 0
        },
        imgFilterNoUse (val) {
            return val.referCount <= 0
        }
    }
}
</script>
<style scoped>
.data-list {
  width: 25%;
  height: 260px;
  float: left;
  padding: 6px;
  box-sizing: border-box;
}
.pager{
  text-align: right;
}
</style>
