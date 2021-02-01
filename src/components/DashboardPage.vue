<style scoped>
</style>
<template>
    <div class="container">
        <sidebar></sidebar>
        <Header></Header>
        <div class="content">
            <transition name="router-fade" mode="out-in">
                <router-view>
                </router-view>
            </transition>
            <!-- <p class="footer">兰思英语直播管理系统</p> -->
        </div>
    </div>
</template>
<script>
import Sidebar from './Common/Sidebar';
import Header from './Common/Header';

export default {
    data () {
        return {
            dialogVisible: false
        }
    },
    components: {
        Sidebar,
        Header
    },
    methods: {
        handleOpen (key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose (key, keyPath) {
            console.log(key, keyPath);
        }
    }
}

</script>
