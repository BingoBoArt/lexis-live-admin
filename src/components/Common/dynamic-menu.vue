<template>
    <div class="menu-container">
        <template v-for="v in menuList">
            <el-submenu :index="v.path" v-if="v.children&&v.children.length>0" :key="v.name">
                <template slot="title">
                    <i class="icon iconfont" :class="v.meta.icon"></i>
                    <span>{{v.meta.name}}</span>
                </template>
                <el-menu-item-group>
                    <my-nav :menuList="v.children"></my-nav>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item :key="v.name" :index="v.path" @click="gotoRoute(v, v.name)" v-else-if="!noShowItem(v.meta.name)">
                <i class="icon iconfont" :class="v.meta.icon"></i>
                <span slot="title">{{v.meta.name}}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
export default {
    name: 'my-nav',
    data(){
        return{
            //路由有，但是不显示的   子级  侧边栏添加到这里 ,添加的是meta.name
            'noShow': ['录播列表', '查询用户', '班级信息', 'Flashcard编辑', 'Question管理',"Question", 'Publish','Unit增加', '编辑Layout', '试题组', 'ExeQuestion列表', '录播列表', 'Block增加', 'BlockLesson增加'],
            // 'noShow': []
        }
    },
    props: {
        menuList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    created() {
        // console.log('设置刷新后当前菜单高亮', this.menuActivity)
    },
    methods: {
        noShowItem(name) {
           return this.noShow.includes(name)
        },
        gotoRoute(v, name) {
            // console.log("点击跳转到的路由", name)
            // console.log("路由", this.$route)
            this.$router.push({ name })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
