// import { fetchPermission } from '@/api/permission'
// import router, { DynamicRoutes } from '@/router/index'
import { recursionRouter, setDefaultRoute } from '@/utils/recursion-router'
import router, { dynamicRoutes, DynamicRoutes } from '@/router'

export default {
    namespaced: true,
    state: {
        permissionList: null, /** 所有路由 */
        sidebarMenu: [], /** 导航菜单 */
        currentMenu: '', /** 当前active导航菜单 */
        finallyRouter: [], //最后用来对比，没有的url跳401
        initialRoute: [],  //初始路由
        btnPermissions: []  //按钮级权限
    },
    getters: {},
    mutations: {
        //设置按钮级权限
        SET_BTNALLPERMISSION(state, btnPermission) {
            state.btnPermissions = btnPermission
        },
        SET_ALLROUTERS(state, initialRoutes) {
            state.initialRoute = initialRoutes
        },
        SET_FINALLYROUTER(state, finallyRouters) {
            state.finallyRouter = finallyRouters
        },
        SET_PERMISSION(state, routes) {
            state.permissionList = routes
        },
        CLEAR_PERMISSION(state) {
            state.permissionList = null
        },
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
        CLEAR_MENU(state) {
            state.sidebarMenu = []
        },
        SET_CURRENT_MENU(state, currentMenus) {
            state.currentMenu = currentMenus
        }
    },
    actions: {
        async FETCH_PERMISSION({ commit, state }, allPermission) {
            // let permissionList = permissionList
            let btnPermission = allPermission.buttonPermission
            let permissionList = allPermission.perMissionList
            // console.log("菜单级权限", permissionList)
            // console.log("按钮级权限", btnPermission)
            // console.log("所有的路由", dynamicRoutes)
            /*  根据权限筛选出我们设置好的路由并加入到path=''的children */
            let routes = recursionRouter(permissionList, dynamicRoutes) //筛选后的函数还没处理，是这个函数recursionRouter
            // console.log("赛选后的路由", routes)
            // console.log("开始的基础路由", DynamicRoutes)
            let MainContainer = DynamicRoutes.find(v => v.path === '/dashboard')
            let children = MainContainer.children
            // console.log("找到添加路由的地方", children)
            children.push(...routes)
            // console.log("TCL: FETCH_PERMISSION -> children", children)

            commit('SET_FINALLYROUTER', routes)
            // /* 生成左侧导航菜单 */
            commit('SET_MENU', children)
            // console.log(this._modules.root._children.permission.state.sidebarMenu)
            /*
                为所有有children的菜单路由设置第一个children为默认路由
                主要是供面包屑用，防止点击面包屑后进入某个路由下的 '' 路由,比如/manage/
                而我们的路由是
                [
                    /manage/menu1,
                    /manage/menu2
                ]
            */
            setDefaultRoute([MainContainer])
            /** 存储按钮级权限 */
            commit('SET_BTNALLPERMISSION', btnPermission)
            /*  初始路由 */
            let initialRoutes = router.options.routes
                // console.log("初始路由", initialRoutes)
            // /*  动态添加路由 */
            router.addRoutes(DynamicRoutes)
            commit('SET_ALLROUTERS', initialRoutes)
            // /* 完整的路由表 */
            commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        }
    }
}
