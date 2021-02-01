<template>
  <div>
    <el-row>
      <el-input type="textarea" :rows="2" placeholder="请输入发送给老师的信息" v-model="message" clearable style="width:80%"></el-input>
      <el-button @click="sendMessage">Send</el-button>
      <el-button @click="resetApp" type="danger">Reset</el-button>
      <el-button @click="overClass" type="danger">EndClass</el-button>
    </el-row>
    <div>
      <el-table :data="messageList" :row-key="row => row.id" @row-dblclick="addMessage">
        <el-table-column label="编号">
          <template slot-scope="{row}">
            常用语编号：{{row.seq}}
          </template>
        </el-table-column>
        <el-table-column label="message" prop="message"></el-table-column>
        <!-- 下拉 -->
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-form label-position="right" label-width="90px" class="demo-table-expand">
              <el-form-item label="NewSeq:">
                <el-input v-model="row.newSeq"></el-input>
              </el-form-item>
              <el-form-item label="NewMessage:">
                <el-input v-model="row.newMessage"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="updateMessage(row)">修改</el-button>
                <el-button @click="deleteMessage(row)">删除</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="Action">
          <template slot-scope="{row}">
            <el-button @click="addMessage(row)">add</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button @click="dialogVisible = true">Add More</el-button>
      </el-row>
      <el-dialog title="Save Message" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" append-to-body>
        <el-form v-model="msg" label-position="right" label-width="90px">
          <el-form-item label="排序:">
            <el-input v-model="msg.seq" placeholder="请输入排序"></el-input>
          </el-form-item>
          <el-form-item label="Message:">
            <el-input v-model="msg.message" placeholder="请输入message"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="saveMessage">Save Message</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Request from '@/common/request.js'

export default {
  props: ['socket', 'roomId'],
  data() {
    return {
      dialogVisible: false,
      msg: {},
      message: '',
      messageList: []
    }
  },
  created() {
    this.getMessageList()
  },
  methods: {
    getMessageList() {
      let url = 'liveMessage/getLiveInfoMessage'
      Request({
        url: url,
        type: "get"
      }).then(res => {
        if (res.code == 0) {
          this.messageList = res.data
        }
      })
    },
    updateMessage(row) {
      let message = row.newMessage
      let url = 'liveMessage/addOrUpdateMessage'
      Request({
        url: url,
        type: 'post',
        data: { id: row.id, status: 1, seq: row.newSeq, message: message }
      }).then(res => {
        if (res.code == 0) {
          this.$message.success('更新成功')
          this.getMessageList()
        }
      })
    },
    deleteMessage(row) {
      let url = 'liveMessage/addOrUpdateMessage'
      Request({
        url: url,
        type: 'post',
        data: { id: row.id, status: 2 }
      }).then(res => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.getMessageList()
        }
      })
    },
    addMessage(row) {
      this.message = this.message + row.message
    },
    saveMessage() {
      let url = 'liveMessage/addOrUpdateMessage'
      Request({
        type: 'post',
        url: url,
        data: { ...this.msg, status: 1 }
      }).then(res => {
        if (res.code == 0) {
          this.$message.success('save success')
          this.getMessageList()
          this.dialogVisible = false
        }
      })
    },
    sendMessage() {
      let msg = {
        userId: 'agent_' + this.$store.state.user.name,
        roomId: this.roomId,
        type: 'text',
        text: this.message
      }
      this.socket.emit('agentMsgTea', msg)
      this.$message.success('发送成功')
    },
    resetApp() {
      let msg = {
        userId: 'agent_123' + this.$store.state.user.name,
        roomId: this.roomId,
        type: 'command',
        text: this.message,
        command: {
          reset: 1
        }
      }
      this.$confirm('确认让老师重连吗？')
        .then(_ => {
          this.socket.emit('agentMsgTea', msg)
          this.$message.success('发送成功')
        })
        .catch(_ => { });
    },
    overClass() {
      let msg = {
        userId: 'agent_123' + this.$store.state.user.name,
        roomId: this.roomId
      }
      this.$confirm('确认让APP直接下课吗？')
        .then(_ => {
          this.socket.emit('agentEndClass', msg)
          this.$message.success('发送成功')
        })
        .catch(_ => { });
    }
  },
  components: {
    Request
  }
}
</script>
