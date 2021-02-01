import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import permissionLists from '@/mock/permissionList'
import { jumpToNoPermission } from '@/utils/recursion-router'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // console.log("扎心", store.state.permission.permissionList)
      // if (store.getters.roles.length === 0) {
      if (!store.state.permission.permissionList) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息,拉取用户权限等,暂时不做权限限制
          // let buttonPermission = permissionLists.data.access_control.permissions
          // let perMissionList = permissionLists.data.access_control.menuList //左侧菜单的权限
          let perMissionList = res.data.access_control.menuList
          let buttonPermission = res.data.access_control.permissions
          let allPermission = { buttonPermission, perMissionList }
          store.dispatch('permission/FETCH_PERMISSION', allPermission).then(() => {
            next({ path: to.path })
          })
        }).catch((res) => {
          // alert(res)
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        let finallyRouters = store.state.permission.finallyRouter
        // let finallyRouters = store.state.permission.initialRoute
        console.log("过滤后的路由表", finallyRouters)  //过滤后的路由表
        // console.log("", to.name)
        if(to.name != undefined) {
          // console.log("hahahahahahahhaaha", jumpToNoPermission(to.name, finallyRouters))
          if(!jumpToNoPermission(to.name, finallyRouters)) {
            console.log("去401页面的路径", to)
            // alert(to.name)
            next({path: '/401'})
            // }
          }
          // console.log("toooooooname", to.path)
          // next({path: to.path})
            //把from的name和过滤后的路由表对比，如果过滤后的表里没有from的name值，跳转到401
        }
        next({})
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to, from, next) => {
  console.log('舒00000000000000心', to.meta, to)
  store.commit('permission/SET_CURRENT_MENU', to.meta.name)
})
