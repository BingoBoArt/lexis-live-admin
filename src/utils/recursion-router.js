/**
 *
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouter  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */
import store from '@/store'
export function recursionRouter(userRouter = [], allRouter = []) {
    // console.log("要过滤的路由", userRouter, allRouter)
    var realRoutes = []
    // realRoutes = allRouter
    allRouter.forEach((v, i) => {
        // console.log(v.name, i)
        userRouter.forEach((item, index) => {
            // console.log(item.name, index)
            // console.log(v.meta.name)
            if (item.name === v.meta.name) {
                if (!item.childList || item.childList.length >= 0) {
                    v.children = recursionRouter(item.childList, v.children)
                    // console.log("递归遍历子路由", item.children)
                    // realRoutes.push(v.children)
                    // console.log(8787898798798)
                }
                // console.log(5678, item)
                realRoutes.push(v)
            }
        })
    })
    // console.log(910909090909, realRoutes)
    return realRoutes
}

export function jumpToNoPermission(name, finallyRouters) {
    // console.log("需要对比跳转401的页面")
    // console.log('过滤后的路由婊')
    // console.log(name, finallyRouters)
    const arr = ['login', 'dashboard']
    finallyRouters.forEach(val => {
        let tmp = {...val}
        arr.push(tmp.path)
        if(val.children && val.children.length > 0) {
            val.children.forEach(item => {
                const itemp = {...item}
                arr.push(itemp.path)
                if(item.children && item.children.length > 0) {
                    item.children.forEach(itemSon => {
                        const itemson = {...itemSon}
                        arr.push(itemson.path)
                    })
                }
            })
        }
    })
    // console.log("fuck-trump", arr)
    console.log('666666666找出按钮权限', store.state.permission.btnPermissions)
    let hasUrl = arr.find(item => {
        return item == name
    })
    return hasUrl
}

/**
 *
 * @param {Array} routes 用户过滤后的路由
 *
 * 递归为所有有子路由的路由设置第一个children.path为默认路由
 */
export function setDefaultRoute(routes) {
    routes.forEach((v, i) => {
        if (v.children && v.children.length > 0) {
            v.redirect = { name: v.children[0].name }
            setDefaultRoute(v.children)
        }
    })
}
