
<template>
    <div class="left-box">
        <div class="clearfix logo-wrapper">
            <div class="logo-pic"></div>
        </div>
        <el-menu class="sidebar" :unique-opened="false" :default-active="currentPagePath" @open="handleOpen" :router="true" background-color="#324157" text-color="#bfcbd9" active-text-color="#409EFF" @close="handleClose">
            <el-menu-item index="/dashboard">
                <i class="icon iconfont icon-home"></i>
                <span>后台主页</span>
            </el-menu-item>
            <DynamicMenu :menuList="sidebarMenu"></DynamicMenu>
        </el-menu>
    </div>
</template>
<script>
import DynamicMenu from './dynamic-menu'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            currentPagePath: "",
        };
    },
    computed: {
        ...mapState('permission', ['sidebarMenu', 'currentMenu'])
    },
    components: {
        DynamicMenu
    },
    created() {
        // console.log("侧边栏", this.$store.state.permission.sidebarMenu)
    },
    methods: {
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        },
        hasOwn() { }
    },
    mounted() {
        //设置侧边栏的高亮
        this.currentPagePath = this.$route.name
    }
};
</script>
<style scoped>
.First {
    color: red;
}
</style>
