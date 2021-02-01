<template>
  <div>
    <breadcrumb></breadcrumb>
    <div name="search">
      <el-form label-position="left" inline>
        <el-form-item>
          <SchoolSemester @school-select="item=>this.$set(BannerObject.searchParam, 'schoolId', item)" @semester-select="item2=>this.$set(BannerObject.searchParam, 'semester',item2)"></SchoolSemester>
        </el-form-item>
        <el-form-item label="连接类型">
          <el-select v-model.trim="BannerObject.searchParam.type" clearable>
            <el-option v-for="(type, index) in types" :key="index" :value="type.value" :label="type.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支持设备">
          <el-checkbox v-model="BannerObject.searchParam.isSupportH5" true-label="1">H5</el-checkbox>
          <el-checkbox v-model="BannerObject.searchParam.isSupportIos" true-label="1">Ios</el-checkbox>
          <el-checkbox v-model="BannerObject.searchParam.isSupportAndroid" true-label="1">Android</el-checkbox>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model.trim="BannerObject.searchParam.status" clearable>
            <el-option v-for="(status, index) in statuz" :key="index" :value="status.value" :label="status.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div name="data">
      <common-table :dataObject="BannerObject">
        <el-table-column label="支持设备" width="270px">
          <template slot-scope="{row}">
            <el-button v-if="row.isSupportH5" size="mini" type="success">H5</el-button>
            <el-button v-if="row.isSupportIos" size="mini" type="success">Ios</el-button>
            <el-button v-if="row.isSupportAndroid" size="mini" type="success">Android</el-button>
          </template>
        </el-table-column>
        <el-table-column label="banner图片" width="120px">
          <template slot-scope="{row}">
            <img v-if="row.imgUrl" :src="row.imgUrl" class="bannerImg">
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80px">
          <template slot-scope="{row}">
            <span v-if="row.status == 3" style="color:red">已下架</span>
            <span v-else style="color:green">已上架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="{row}">
            <el-button size="mini" @click="updateBanner(row)">修改</el-button>
            <el-button size="mini" type="success" @click="updateStatus(row)" v-if="row.status == 3">上架</el-button>
            <el-button size="mini" type="warning" @click="updateStatus(row)" v-else>下架</el-button>
          </template>
        </el-table-column>
      </common-table>
    </div>
  </div>
</template>
<script>
import SchoolSemester from '@/components/Coms/SchoolSemester'
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      BannerObject: {
        index: false,
        dataKey: 'records',
        idKey: 'bannerId',
        searchUrl: 'banner/getBannerList',
        searchParam: {},
        columns: [
          {
            prop: 'groupName',
            label: '组别'
          },
          {
            prop: 'schoolName',
            label: '校区'
          },
          {
            prop: 'semesterName',
            label: '班级'
          },
          {
            prop: 'text',
            label: '文字内容'
          },
          {
            prop: 'href',
            label: '链接地址'
          },
          {
            prop: 'type',
            label: '链接类型'
          },
          {
            prop: 'seq',
            label: '排序'
          },
          {
            prop: 'startTime',
            label: '开始时间',
            width: 160
          },
          {
            prop: 'expireTime',
            label: '过期时间',
            width: 160
          }
        ]
      },
      types: [
        {
          value: 'H5',
          label: 'H5'
        },
        {
          value: 'Void',
          label: 'Void'
        }
      ],
      statuz: [
        {
          value: '1',
          label: '上架'
        },
        {
          value: '2',
          label: '下架'
        }
      ]
    }
  },
  methods: {
    updateBanner(row) {
      let url = '/dashboard/library/Banner/AddBanner'
      this.$router.push({ path: url, query: { [this.BannerObject.idKey]: row[this.BannerObject.idKey] } })
    },
    updateStatus(row) {
      let url = 'banner/updateStatus'
      Request({
        url: url,
        type: 'post',
        data: { bannerId: row.bannerId, status: (row.status + 2) % 4 }
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("更新成功")
          this.query()
        } else { this.$message.error(res.msg) }
      })
    },
    query() {
      this.BannerObject.searchParam = { ...this.BannerObject.searchParam }
    }
  },
  components: {
    CommonTable, Breadcrumb, Request, SchoolSemester
  }
}
</script>
<style scoped>
.bannerImg {
  width: 60px;
}
</style>
