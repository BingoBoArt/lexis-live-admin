<template>
  <div>
    <!-- 查询列表 -->
    <div>
      <el-form inline>
        <el-form-item label="名称关键字:">
          <el-input v-model="ExeQuesGroupObject.searchParam.groupName" placeholder="请输入名称关键字" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="newGroup">新增卷</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!-- 列表内容 -->
    <common-table :dataObject="ExeQuesGroupObject">
      <el-table-column label="编辑" width="270px">
        <template slot-scope="{row}">
          <el-button @click="editGroup(row.id)" size="mini" type="success">编辑</el-button>
          <el-button @click="publishGroup(row.id)" size="mini" type="warning">发布</el-button>
        </template>
      </el-table-column>
    </common-table>
    <!-- 必要弹框 -->

  </div>
</template>
<script>
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      ExeQuesGroupObject: {
        index: false,
        dataKey: 'records',
        idKey: 'id',
        searchUrl: 'exe/question/group/list',
        searchParam: {},
        columns: [
          {
            prop: 'id',
            width: '60',
            label: 'ID'
          },
          {
            prop: 'groupName',
            label: '卷名'
          },
          {
            prop: 'levelOne',
            label: '等级一数量'
          },
          {
            prop: 'levelTow',
            label: '等级二数量'
          },
          {
            prop: 'levelThree',
            label: '等级三数量'
          },
          {
            prop: 'totalCount',
            label: '总题数量',
            width: 80
          },
          {
            prop: 'createdTime',
            label: '创建时间',
            width: 160
          }
        ]
      }
    }
  },
  methods: {
    /* 重新编辑 group */
    editGroup(groupId) {
      this.$router.push({ path: '/dashboard/Issue/ExeQuesGroup', query: { groupId: groupId } })
    },
    /* 新增题组 */
    newGroup() {
      this.$router.push({ path: '/dashboard/Issue/ExeQuesGroup' })
    },
    publishGroup(groupId) {
      this.$router.push({ path: '/dashboard/Issue/Publish', query: { groupId: groupId, show: true } })
    }
  },
  components: {
    CommonTable, Breadcrumb, Request
  }
}

</script>
