<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 查询列表 -->
    <el-form inline>
      <el-form-item prop="semester">
        <SchoolSemester @school-select="item=>this.$set(dataObject.searchParam,'schoolId',item)" @semester-select="item2=>this.$set(dataObject.searchParam,'semester',item2)"></SchoolSemester>
      </el-form-item>
      <el-form-item label="请输入position：">
        <el-select v-model="dataObject.searchParam.position" clearable>
          <el-option v-for="(position, index) in positions" :key="index" :value="position.value" :label="position.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择状态：">
        <el-select v-model="dataObject.searchParam.status" placeholder="请选择状态" clearable>
          <el-option v-for="(status,index) in statuss" :key="index" :value="status.value" :label="status.title"></el-option>
        </el-select>
      </el-form-item>
        <el-button type="success" icon="el-icon-plus" @click="addConfig" style="float:right">新增Config</el-button>
    </el-form>
    <!-- block列表 -->
    <common-table :dataObject="dataObject">
      <el-table-column label="设备" width="175">
        <template slot-scope="{row}">
          <ul class="ulli">
            <li v-if="row.isSupportH5" size="mini">H5</li>
            <li v-if="row.isSupportAndroid" size="mini">Android</li>
            <li v-if="row.isSupportApad" size="mini">Apad</li>
            <li v-if="row.isSupportIphone" size="mini">Iphone</li>
            <li v-if="row.isSupportIpad" size="mini">Ipad</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="75">
        <template slot-scope="{row}">
          {{row.status | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="Action" width="310">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDateTow(row)">编辑</el-button>
          <el-button type="success" size="mini" icon="el-icon-upload2" @click="onShelf(row,1)" v-if="row.status!=1">上架</el-button>
          <el-button type="danger" size="mini" icon="el-icon-download" @click="onShelf(row,3)" v-if="row.status!=3">下架</el-button>
        </template>
      </el-table-column>
    </common-table>
    <!-- 分页 -->
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
      positions: [
        {
          value: 1000,
          label: '1000-首页Banner'
        },
        {
          value: 1001,
          label: '1001-启动页视频'
        },
        // {
        //   value: 1002,
        //   label: '1002-老师端测速连接,不用'
        // },
        {
          value: 1003,
          label: '1003-直播课随机视频'
        }
        // {
        //   value: 1004,
        //   label: '1004-随机视频提示语'
        // }
      ],
      statuss: [
        {
          value: 1,
          title: '上架'
        },
        {
          value: 2,
          title: '灰度'
        },
        {
          value: 3,
          title: '下架'
        }
      ],
      dataObject: {
        index: false,
        dataKey: 'configList',
        idKey: 'configId',
        searchUrl: 'config/getConfig',
        searchParam: { status: '', position: '' },
        columns: [
          {
            prop: 'configId',
            label: '编号',
            width: 60
          },
          {
            prop: 'remark',
            label: '标记',
            width: 60
          },
          {
            prop: 'groupName',
            label: '组别'
          },
          {
            prop: 'schoolName',
            label: '学校',
            width: 220
          },
          {
            prop: 'semesterName',
            label: '班级',
            width: 220
          },
          {
            prop: 'text',
            label: '内容'
          }
        ]
      }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    addConfig() {
      this.$router.push({ path: '/dashboard/library/Config/AddConfig', query: { ...this.dataObject.searchParam } })
    },
    editDateTow(row) {
      let url = '/dashboard/library/Config/AddConfig'
      // 页面跳转
      this.$router.push({ path: url, query: { [this.dataObject.idKey]: row[this.dataObject.idKey] } })
      // this.$router.push({ name: 'Example/Add', query: { id: row.id } })
    },
    onShelf(row, status) {
      this.$confirm('此操作将' + (status == 1 ? '上架' : '下架') + '该配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url: 'config/onShelf',
          data: { id: row.configId, status: status },
          type: 'post'
        }).then(res => {
          if (res.code == 0) {
            this.query()
            this.$message.success('上架成功')
          }
        })
      })
    },
    query() {
      // let data = { position: this.dataObject.searchParam.position, status: this.dataObject.searchParam.status }
      this.dataObject.searchParam = {...this.dataObject.searchParam}
    },
    checkOpsition(val) {
      return val >= 18;
    }
  },
  filters: {
    statusFilter(val) {
      if (val == 3) {
        return '已下架'
      } else if (val == 1) {
        return '已上架'
      } else {
        return '灰度'
      }
    }
  },
  components: {
    CommonTable,
    Breadcrumb,
    SchoolSemester
  }
}
</script>
<style scoped>
.ulli li {
  /* list-style: none; 将默认的列表符号去掉 */
  padding: 0; /* 将默认的内边距去掉 */
  margin: 5px; /* 将默认的外边距去掉 */
  float: left; /* 往左浮动 */
}
</style>
