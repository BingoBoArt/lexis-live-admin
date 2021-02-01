import Vue from 'vue'
// import ElementUI from 'element-ui'
import store from './store'
import ELEMENT from 'element-ui'
Vue.use(ELEMENT)
var App = require('./App.vue')
import router from './router'
import '@/filters/' // 注册过滤器
import '@/directives/' // 注册指令
import '@/permission'
import {
  getToken
} from '@/utils/auth'
require("es6-promise-always")

// const whiteList = ['/login'] // 不重定向白名单
// router.beforeEach((to, from, next) => {
//   if (getToken()) {
//     next()
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next('/login')
//     }
//   }
// })
// /* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
