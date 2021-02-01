<template>
    <div class="img-select-wrapepr">
        <div class="filter-box">
          <el-form :inline="true" :model="filterForm" class="demo-form-inline" label-width="100px">
            <LessonFilter v-model="selectItem" :title="''">
              <el-button type="primary" icon="el-icon-search" @click="onSubmitFilter">查询</el-button>
            </LessonFilter>
          </el-form>
        </div>

        <div class="form-table-box clearfix" v-loading="loading">
            <div class="img-list" v-for="(img, index) in imgList" :key="index" @click="onCheck(index)" :class="{'active': checked==index}">
                <!-- <image-card :imgInfo="img" @data-update="afterDelete"></image-card> -->
                <img :src="img.content">
                <div class="mask"></div>
                <i class="el-icon-check check"></i>
            </div>
            <div class="no-data" v-if="!loading && (!imgList || !imgList.length)">没有数据</div>
        </div>
        <div class="page-box">
          <el-pagination @current-change="handlePageChange" :current-page="page.page" :page-size="page.rows" layout="total, prev, pager, next, jumper" :total="page.total">
          </el-pagination>
        </div>
        <!-- 
          <div class="submit-wrapper">
            <el-button type="primary" @click="onConfirm">确定</el-button>
            <el-button type="default" @click="show=false">取消</el-button>
          </div> 
        -->
    </div>
</template>
<script>
import Request from '@/common/request.js'
import LessonFilter from '@/components/Coms/LessonFilter'

export default {
    data () {
        return {
            checked: -1,
            loading: true,
            selectItem: { level: '', lessonType: '', unitId: '', lessonNo: '', keyword: '', referCount: ''},
            imgList: [],
            checkedList: [],
            checkedIndex: 0,
            page: {
                total: 0,
                rows: 14,
                page: 1
            }
        }
    },
    props: {
      value: {
        type: Object
      },
      multi: {
          type: Boolean,
          default: false
      },
      count: {
          type: Number,
          default: 1
      }
    },
    components: {
        LessonFilter
    },
    mounted () {
    },
    watch: {
    },
    computed: {
        currentValue: {
            // 动态计算currentValue的值
            // 动态计算currentValue的值
            get: function() {
                let final_value = this.handleArrObj(this.value)
                return final_value;
            },
            set: function(val) {
                let final_value = this.handleArrObj(val)
                this.$emit('input', final_value);
            }
        }
    },
    methods: {
        handleArrObj(val) {
          let final_value = null;
          if(!this.multi && val){
            final_value =  val.constructor == Array ? val[0] : val
          }else{
            final_value = val
          }
          return final_value;
        },
        onSubmitFilter() {
          this.page.page = 1
          this.getImgList()
        },
        onCheck(index) {
          this.checked = index;
          if (!this.multi) {
            this.checkedList = this.imgList[this.checked];
          } else {
            this.checkedList[this.checkedIndex] = this.imgList[this.checked];
          }
          this.currentValue = this.checkedList;
        },
        handlePageChange (val) {
            this.page.page = val
            this.getImgList()
        },
        /* 获取所有图片 */
        getImgList () {
            this.loading = true;
            let select = this.selectItem
            let param = { ...select, ...this.page, type: 1}
            Request({
              url: '/resource/getResourceList',
              type: 'post',
              data: param
            }).then(res => {
                this.page.total = res.data.totalResultSize
                // this.page.count = res.data.totalPage
                this.params = param
                this.imgList = res.data.resourceList
            }).always(res => {
                this.loading = false
                this.checked = -1;
            })
        }
    },
    created: function() {
      this.page.page = 1
      this.getImgList()
    }
}
</script>
<style scoped>
.img-list {
  display: inline-flex;
}
.el-dialog{
  width: 80%;
}
.image-uploader {
    height: 105px;
    border: 1px solid #e6e6e6;
    width: auto;
    max-width: 196px;
    width: 140px;
    float: left;
    margin-right: 4px;
}
.img-list{
  float: left;
  width: 13%;
  height: 150px;
  margin: 0.5%;
  position: relative;
  &:hover{
    .mask{
      display: block;
    }
  }
  img{
    width: 100%;
    height: 100%;
  }
  .check{
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 30px;
    color: white;
    display: none;
  }
  .mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: none;
  }
  &.active{
    .check, .mask{
      display: block;
    }
  }
}
/*编辑问题*/
.img-upload-wrap{
    width: 180px;
    height: 200px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    color: #d9d9d9;
    overflow: hidden;
    position: relative;
    img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        min-height: 200px;
        margin: 0;
    }
    .icon-plus{
        color: #d9d9d9;
        line-height: 200px;
        font-size: 80px;
    }
}
.img-upload-wrap:hover {
    border-color: #409eff;
    color: #409eff;
    .icon-plus{
        color: #409eff;
    }
}

</style>