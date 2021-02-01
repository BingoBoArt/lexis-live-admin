<template>
  <div class="content-page">
    <div class="content-main">
      <div class="form-table-box">
        <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="infoForm.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="infoForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitInfo" :loading="save_loading">确定保存</el-button>
            <el-button @click="goBackPage">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Request from '@/common/request.js'

export default {
  data () {
    return {
      save_loading: false,
      infoForm: {
      }
    }
  },
  methods: {
    onSubmitInfo () {
      // let _infoForm = this.infoForm;
      this.$refs['infoForm'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.save_loading = true;
        Request({
          url: '',
          type: 'post',
          data: {

          }
        }).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
          }
        }).always(() => {
          this.save_loading = false;
        })
      })
    },
    getInfo () {
      //加载详情
      let that = this
      Request({
        url: '/live/user/info',
        data: {
          userId: 'xxx'
        }
      }).then((res) => {
        let resInfo = res.data;
        that.infoForm = resInfo;
      })
    }
  },
  components: {
  },
  mounted () {
    this.getInfo();
  }
}

</script>

<style scoped>
</style>
