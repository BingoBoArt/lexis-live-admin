<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- block列表 -->
    <common-table :dataObject="dataObject">
      <!-- <el-table-column prop="" label="删除" :width="100">
        <template slot-scope="{row}">
          <el-button @click="handleDelete(row)" size="mini" type="danger">delete</el-button>
        </template>
      </el-table-column> -->
    </common-table>

  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      
      userId: '',
      show: false,
      dataObject: {
        coursetype: 'coursetype',
        lineop: 'lineop',
        index: false,
        dataKey: 'records',
        idKey: 'userId',
        // deleteUrl: 'delLevel',
        searchUrl: 'levels',
        editUrl: '/dashboard/Library/Level/EditLevel', //编辑页面名称
        searchParam: { nickname: '', 
                       email: '',
                       schoolName: '' ,
                       schoolId: ''
                      },
        columns: [
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'lessonSort',
            label: '课程体系'
          },
          {
            prop: 'level',
            label: '等级'
          },
          {
            prop: 'recommend',
            label: '说明'
          },
          // {
          //   prop: 'levelId',
          //   label: 'levelId'
          // }
        ]
      }
    }
  },
  created(){
  },
  mounted() {
    this.query()
  },
  methods: {
    handleDelete(row) {
      console.log(6666666, row)
      Request({
        url: '/delLevel',
        type: 'post',
        data: {
          levelId: row.levelId,
        }
      }).then(res => {
        console.log(1213123123123, res)
        if(res.code == '0000') {
          this.$message({
              type: 'success',
              message: '删除成功!'
            });
        } else {
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
    addTeacher() {
      this.$router.push({ path: '/dashboard/Teacher/AddTeacher', query: { ...this.dataObject.searchParam } })
    },
    editDateTow(row) {
      let url = '/dashboard/library/Config/AddConfig'
      // 页面跳转
      this.$router.push({ path: url, query: { [this.dataObject.idKey]: row[this.dataObject.idKey] } })
      // this.$router.push({ name: 'Example/Add', query: { id: row.id } })
    },
    query() {
      let data = { position: this.dataObject.searchParam.position, status: this.dataObject.searchParam.status }
      this.dataObject.searchParam = data
    }
  },
  components: {
    CommonTable,
    Breadcrumb,
  }
}
</script>
