<template>
    <div>
        <!-- 位置 -->
        <breadcrumb></breadcrumb>
        <el-button class="top-btn" type="success" icon="el-icon-upload" @click="dialogShow=true">上传音频素材</el-button>
        <el-dialog class="upload-dialog" :visible.sync="dialogShow" title="上传音频素材" :width="'80%'" :height="'80%'">
          <UploadMutil type="audio" />
        </el-dialog>
        <!-- 分类-数据 -->
        <div class="content-main">
            <div class="filter-box">
                <el-form :inline="true" :model="selectItem" class="demo-form-inline" label-width="100px">
                    <LessonFilter v-model="selectItem" :title="''">
                        <el-form-item label="" style="width: 120px">
                            <el-select v-model="selectItem.referCount" placeholder="请选择">
                                <el-option label="全部音频" value=""></el-option>
                                <el-option label="未使用音频" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmitFilter" icon="el-icon-search">查询</el-button>
                        </el-form-item>
                    </LessonFilter>
                </el-form>
            </div>

            <div class="form-table-box clearfix" v-loading="loading">
                <div class="data-list" v-for="(img, index) in imgList" :key="index">
                    <AudioCard :dataInfo="img" @data-update="afterDelete"></AudioCard>
                </div>
                <div class="no-data" v-if="!(imgList && imgList.length)">没有数据</div>
            </div>
            <div class="page-box" v-if="imgList">
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
import AudioCard from '@/components/Coms/AudioCard'
import UploadMutil from '@/components/Coms/UploadMutil'
import Request from '@/common/request.js'
export default {
    data () {
        return {
            loading: false,
            dialogShow: false,
            selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', keyword: '', referCount: '' },
            imgList: [],
            page: {
                rows: 10,
                page: 1
            }
        }
    },
    components: {
        Breadcrumb,
        LessonFilter,
        AudioCard,
        UploadMutil
    },
    mounted () {
        this.getImgList()
    },
    watch: {
        [this.$refs]: function () {
        }
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
        onSubmitFilter () {
            this.imgList = []
            this.page.page = 1
            this.getImgList()
        },
        updateSelect () {
            this.getImgList();
        },
        showDialog () {
            this.dialogVisible = true
        },
        handlePageChange (val) {
            this.page.page = val
            this.getImgList()
        },
        /* 获取所有图片 */
        getImgList () {
            this.loading = true;
            let select = this.selectItem
            let param = { ...select, ...this.page, type: 3, isRefer: select.referCount }
            Request({
                url: '/resource/getResourceList',
                type: 'post',
                data: param
            }).then(res => {
                this.page.total = res.data.totalResultSize
                this.page.count = res.data.totalPage
                this.params = param
                this.imgList = res.data.resourceList
            }).catch(error => {
                console.log(error)
            }).always(res => {
                this.loading = false
            })
        },
        /* 删除后更新 */
        afterDelete () {
            this.getImgList();
        }
    }
}
</script>
<style scoped>
.data-list {
  width: 330px;
  float: left;
  padding: 5px;
  box-sizing: border-box;
  height: 160px;
}
.pager {
  text-align: right;
}
</style>
