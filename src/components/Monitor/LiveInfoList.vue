
<template>
  <div>
    <breadcrumb></breadcrumb>
    <div name="serchList">
      <el-form inline>
        <!-- <el-select @change="updateSelect(1)" v-model="liveInfoObject.searchParam.semester" clearable placeholder="请选择时间线">
          <el-option v-for="item in semesterList" :key="item.scheduleId" :label="item.title" :value="item.scheduleId">
          </el-option>
        </el-select> -->
        <el-form-item>
          <el-input v-model="liveInfoObject.searchParam.tchNickname" placeholder="请输入老师简称" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dataList" highlight-current-row style="width: 100%">
      <el-table-column v-for="(colum,index) in liveInfoObject.columns" :key="index" :label="colum.label" :prop="colum.prop" :width="colum.width"></el-table-column>
      <el-table-column label="Action">
        <template slot-scope="{row}">
          <el-button v-if="row.online" @click="initSocket(row.liveId);dialogVisible=true">message</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-dialog title="发送消息" width="550px" :visible.sync="dialogVisible" :before-close="handleClose">
        <message-info :socket="socket" :roomId="roomId"></message-info>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import MessageInfo from '@/components/Monitor/MessageInfo'
import Request from '@/common/request.js'
import Host from "@/common/host.js";
import io from 'socket.io-client'
export default {
  data() {
    return {
      socket: null,
      roomId: '',
      dialogVisible: false,
      interval: '',
      semesterList: [],
      semester: '',
      dataList: [],
      liveInfoObject: {
        dataKey: 'data',
        idKey: 'lessonNo',
        searchUrl: 'live/getLiveInfoMonitorList',
        searchParam: {},
        columns: [
          {
            prop: 'lessonNo',
            label: '课件ID',
            width: 100
          },
          {
            prop: 'lessonNoName',
            label: '课件编号',
            width: 100
          },
          {
            prop: 'lessonTitleEn',
            label: '课件英文名称',
            width: 120
          },
          {
            prop: 'startTime',
            label: 'Start Time'
          },
          {
            prop: 'endTime',
            label: 'End Time'
          },
          {
            prop: 'tchNickname',
            label: '教师名称',
            width: 140
          },
          {
            prop: 'schoolName',
            label: '学校',
            width: 140
          },
          {
            prop: 'semesterName',
            label: '时间线名称',
            width: 140
          }
        ]
      }
    }
  },
  components: {
    Breadcrumb,
    MessageInfo
  },
  mounted() {
    this.getSemesterList()
    this.query()
    this.interval = setInterval(() => {
      this.query()
    }, 1000 * 5)
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    'liveInfoObject.searchParam.tchNickname': function () {
      this.query()
    }
  },
  methods: {
    getLiveInfoList() {
      let url = this.liveInfoObject.searchUrl;
      Request({
        url: url,
        type: "post",
        data: this.liveInfoObject.searchParam
      }).then(res => {
        if (res.code == 0) {
          this.dataList = res.data
        }
      })
    },
    getSemesterList() {
      Request({
        url: 'schedule/getOnSemester',
        type: 'get'
      }).then(res => {
        this.semesterList = res.data
      })
    },
    handleClose() {
      this.$confirm('确认关闭吗').then(res => {
        this.finalSocket()
        this.dialogVisible = false
      })
    },
    updateSelect(val) {
      this.query()
    },
    query() {
      // console.log("select")
      this.getLiveInfoList()
    },
    // socket处理
    initSocket(roomId) {
      this.roomId = roomId
      if (roomId) { this.$message.error('没有传入房间号') }
      this.socket = io(Host.socketHost + '/?room=' + roomId, { transports: ['websocket'] })
      this.socket.on('connect', () => {
        if (this.socket.connected) {
          this.$message.success('房间链接成功 roomId：' + roomId)
        } else {
          // 改进为重复链接
          let that = this
          this.socket.on('disconnect', () => {
            setTimeout(function () {
              that.socket.open()
            }, 5000)
          });
        }
      })
      this.socket.on('__agentJoin', (data) => {
        console.log(data)
      })
      this.socket.on('__error', (data) => {
        if (data.code == "1004") {
          this.$message.error("老师不在房间")
        } else if (data.code == "1000") {
          this.$message.error("操作失败")
        }
      })
    },
    // 结束链接
    finalSocket() {
      if (this.socket) {
        if (this.socket.connected) {
          this.$message.success('现在关闭链接')
          this.socket.disconnect()
        }
      }
    }
  }
}
</script>
