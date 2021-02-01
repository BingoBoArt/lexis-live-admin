<template>
  <div>
    <el-dialog title="提示" :visible.sync="visible" width="70%" @close="$emit('update:show',false)">
      <el-row>
        <span>该教师上一次操作时间:</span>
        <span>{{message}}</span>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Request from '@/common/request.js'
export default {
  props: {
    show: false,
    userId: ''
  },
  data() {
    return {
      message: '',
      myint: '',
      visible: this.show
    }
  },
  watch: {
    visible: function (val) {
      console.log(val)
      if (val) {
        this.getTeacherActive();
        this.myint = setInterval(() => {
          this.getTeacherActive()
        }, 1000 * 5)
      } else {
        this.show = this.visible
        this.$emit('close-dia', false)
        clearInterval(this.myint);
      }
    },
    show() {
      this.visible = this.show
    }
  },
  methods: {
    handleClose() {
      this.visible = false
    },
    getTeacherActive() {
      let url = 'user/getTeacherActive'
      Request({
        url: url,
        data: { teacherId: this.userId },
        type: 'post'
      }).then(res => {
        if (res.code == 0) {
          if (res.data.status == 'OK') {
            this.message = res.data.activeInfo ? res.data.activeInfo : this.message
          } else if (res.data.status == 'FAIL') {
            this.message = '暂无数据'
          }
        }
      })
    }
  }
}
</script>

