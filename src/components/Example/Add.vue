<template>
  <div class="content-page">
    <div class="content-nav">
      <div class="operation-nav">
        <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-form v-loading="loading" ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">

          <el-form-item label="名称" prop="title">
            <el-input v-model="infoForm.title"></el-input>
          </el-form-item>

          <el-form-item label="上架" prop="status">
            <el-switch v-model="infoForm.status" on-text="" :on-value="1" :off-value="0" off-text=""></el-switch>
          </el-form-item>

          <el-form-item label="所属分类" prop="c_id">
            <el-select v-model="infoForm.c_id" placeholder="请选择分类">
              <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="产品图片" prop="logo">
            <el-upload class="image-uploader" name="xinhao_pic" :data="{'type': 'project_pic'}" :action="'/live/upload/index' | handleUploadDomain" :show-file-list="false" :on-success="handleUploadImageSuccess">
              <img v-if="infoForm.logo" :src="infoForm.logo" class="image-show">
              <i v-else class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
            <div class="form-tip">图片尺寸：750*420</div>
          </el-form-item>

          <el-form-item label="推荐类型">
            <el-checkbox-group v-model="infoForm.type">
              <el-checkbox label="1">新品</el-checkbox>
              <el-checkbox label="2">人气</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="排序">
            <el-input-number v-model="infoForm.sort" :min="1" :max="1000"></el-input-number>
          </el-form-item>

          <el-form-item label="递交方式" prop="mode">
            <el-radio-group v-model="infoForm.mode">
              <el-radio :label="1" value="1">方式1</el-radio>
              <el-radio :label="2" value="2">方式2</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="产品简介" prop="simple_desc">
            <el-input class="large-textarea" type="textarea" v-model="infoForm.desc" :rows="10"></el-input>
            <div class="form-tip"></div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmitInfo" :loading="save_loading" icon="submit">确定保存</el-button>
            <el-button @click="goBackPage">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/request.js"
export default {
  data () {
    return {
      loading: false,
      save_loading: false,
      infoForm: {
        id: 0
      },
      category: [
        { id: '1', name: '分类1' },
        { id: '2', name: '分类2' }
      ],
      infoRules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    goBackPage () {
      this.$router.go(-1);
    },
    onSubmitInfo () {
      let _infoForm = this.infoForm;
      this.$refs['infoForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.save_loading = true;
        Request({
          url: '/xxx',
          // mock: require('@/mock/operate.js').default,
          data: {
            ...this.infoForm
          }
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
          }
        }).catch(() => {
          // 错误处理
        }).always(() => {
          this.save_loading = false;
        })
      })
    },
    getInfo () {
      if (this.infoForm.id <= 0) {
        return false
      }
      this.loading = true;
      Request({
        url: '/xxx',
        // mock: require('@/mock/detail.js').default,
        data: {
          id: this.infoForm.id
        }
      }).then((res) => {
        this.infoForm = res.data
      }).catch(() => {
        // 错误处理
      }).always(() => {
        this.loading = false;
      })
    },
    handleUploadImageSuccess () { }
  },
  components: {
  },
  mounted () {
    this.infoForm.id = this.$route.query.id || 0;
    this.getInfo();
  }
}

</script>

<style scoped>

</style>
