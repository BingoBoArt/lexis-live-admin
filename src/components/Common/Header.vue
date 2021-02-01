<template>
  <div class="header">
    <a href="javascript:void(0);" @click="logout" class="log-out">
      <i aria-hidden="true" class="icon iconfont icon-logout"></i>
      退出系统
    </a>
  </div>
</template>

<script>
import ComUtil from '@/common/util.js'
import Config from '@/common/config.js'
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$confirm('是否要退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // localStorage.removeItem(Config.token_key);
        this.$store.dispatch('LogOut')
        this.$store.dispatch('FedLogOut').then(() => {
          this.loading = false
          this.$router.push({ path: '/login' })
        }).catch(() => {
          this.loading = false
        })
        // ComUtil.goToLoginPage();
      });
    }
  }
}

</script>

<style scoped>
.header {
  background: #324157;
  height: 50px;
  line-height: 50px;
  display: block;
  overflow: hidden;
  position: relative;
  .log-out {
    display: block;
    position: absolute;
    right: 30px;
    top: 0;
    color: #bdbdbd;
  }
}

.navbar {
  height: 60px;
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
}

.navbar .menu {
  flex: 1;
  margin-top: 15px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
}

.navbar .menu-item {
  margin: 0 15px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  color: #fff;
}
</style>
