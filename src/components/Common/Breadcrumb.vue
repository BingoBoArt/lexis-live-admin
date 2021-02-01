<template>
    <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item v-for="(item,index) in brumblist" :key="index">{{item.meta.breadcrumbName}}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>

export default {
    created () {
        this.getBreadcrumb();
    },
    data () {
        return {
            title: '',  // 页面标题
            brumblist: '' // 路由集合
        }
    },
    props: ['separator'],
    methods: {
        getBreadcrumb () {
            this.brumblist = this.$route.matched;
            this.$route.matched.forEach((item, index) => {
                // 判断父级路由是否为空字符串或者meta是否为首页,直接复写路径到根目录
                // 后面的就是判断路由和当前遍历的项目是否一致,是的话把标题的值给上
                item.meta.breadcrumbName === '首页' ? item.path = '/' : this.$route.path === item.path ? this.title = item.meta.breadcrumbName : '';
            })
        }
    },
    watch: {
        $route () {
            this.getBreadcrumb();
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  clear: both;
  li {
    float: left;
  }
  a {
    text-decoration: none;
    color: #333;
    &:hover {
      color: #20a0ff;
      text-decoration: underline;
    }
  }
}

.separator {
  display: inline-block;
  padding: 0 5px;
}

.title {
  float: right;
  display: inline-block;
  font-weight: 700;
  font-size: 20px;
}

.breadcrumb {
  margin: 10px 0px;
}
</style>
