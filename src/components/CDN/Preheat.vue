<template>
  <div>
    <breadcrumb></breadcrumb>
    <el-form name="preheat" v-model="preheat">
      <el-form-item label="越热URL">
        <el-input v-model="preheat.url" placeholder="请输入预热URL"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="gopreheat">预热</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Common/Breadcrumb'
import Request from '@/common/request.js'
export default {
  data() {
    return {
      preheat: { url: '' }
    }
  },
  components: {
    Breadcrumb,
    Request
  },
  methods: {
    gopreheat() {
      Request({
        url: 'cdn/preheat',
        type: "post",
        data: { url: this.preheat.url }
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("预热成功")
        }else{
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
