<template>
    <div id="app">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
            <!-- 这里是会被缓存的视图组件，比如 Home！ -->
        </router-view>
      </keep-alive>
      <transition name="router-fade" mode="out-in" appear>
          <router-view v-if="!$route.meta.keepAlive">
              <!-- 这里是会被缓存的视图组件，比如 Home！ -->
          </router-view>
      </transition>
    </div>
</template>

<script>
    export default {
        name: 'live-admin'
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    html,
    body,
    #app {
        height: 100%;
        width: 100%;
        background: #f5f7f9;
        font-family: Lato, Helvetica, sans-serif;
    }
    ul{
      list-style: none;
    }
    a, a:hover {
        text-decoration: none;
    }
    .textOverflow{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    body {
      background: #f5f7fa;
      display: block;
    }

    .container {
      height: 100%;
      width: 100%;
    }

    .content {
      height: fit-content;
      background: white;
      box-sizing: border-box;
      padding: 10px 10px 10px 250px;
      min-height: 900px;
      overflow: auto;
    }

    .content-main {
      height: fit-content;
      padding: 30px 10px;
      background: #ffffff;
    }
    .top-btn{
        margin-left: 10px;
        float: right;
        margin-top: -30px;
    }

    .footer {
      margin-top: 10px;
      text-align: center;
      line-height: 30px;
      color: #999;
      display: block;
    }
    .content-nav {
        height: 40px;
        background: #f5f7fa;
        margin: 0 0 10px 0;
        display: flex;
    }

    .content-nav .breadcrumb {
        height: 40px;
        line-height: 40px;
        flex: 1;
        color: #8492A6;
    }

    .content-nav .operation-nav {
        width: auto;
        display: flex;
        align-items: center;
    }

    .filter-box {
        height: auto;
        overflow: hidden;
    }

    .page-box {
        margin-top: 30px;
        text-align: right;
    }
    .el-form .el-input{
        max-width: 400px;
    }
    .el-input__inner {
    }

    .el-form .el-textarea {
        width: 400px;
    }
    .el-dialog__body{
      padding: 20px;
    }
    .router-fade-enter-active,
    .router-fade-leave-active {
        transition: opacity .2s;
    }

    .router-fade-enter,
    .router-fade-leave-active {
        opacity: 0;
    }
    .form-table-box{
      min-height: 200px;

      .no-data{
        text-align: center;
        padding: 40px 0;
        color: #8e8e8e;
        font-size: 14px;
      }
    }
    .form-table-box .el-form {
        margin-top: 40px;
    }

    .form-tip{
        color: #888;
        font-size: 12px;
        line-height: 30px;
    }
    .com-icon{
        font-size: 20px;
        color: #8492a6;
    }

    .left{
        float:left;
    }
    .right{
        float:right;
    }
    .clearfix:after {
        content:".";
        display:block;
        height:0;
        visibility:hidden;
        clear:both;
    }
    .clearfix {
        *zoom:1;
    }
    .image-uploader{
        height: 105px;
    }
    .image-uploader .el-upload {
        border: 1px solid #d9d9d9;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .image-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .image-uploader .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader .image-show {
        max-width: 180px;
        height: 95px;
        display: block;
        text-align: center;
        margin: 5px auto;
    }

    .image-uploader.new-image-uploader {
        font-size: 28px;
        color: #8c939d;
        width: 165px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader.new-image-uploader .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 165px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader.new-image-uploader .image-show {
        width: 165px;
        height: 105px;
        display: block;
    }
    .el-menu{
      border-right: none;
    }
    .el-menu-item .iconfont, .el-submenu .iconfont{
      width: 20px;
      height: 100%;
      display: inline-block;
      margin-right: 8px;
    }
    .left-box >.el-menu >.el-submenu >.el-submenu__title .iconfont, .el-menu-item .iconfont.icon-home{
      margin-right: 8px;
    }
    .el-submenu .iconfont{
      margin-right: 2px;
    }
    .el-submenu .el-menu-item{
      padding-left: 80px;
    }
    .el-menu-item i, .el-submenu__title i{
      color: #dae1f1;
    }
    .submit-wrapper{
        text-align: center;
        margin-top: 70px;
        margin-bottom: 30px;
        .el-button{
          margin-left: 60px;
        }
        .el-button:first-child{
          margin-left: 0;
        }
    }
    &.el-dialog__wrapper .submit-wrapper{
        margin-top: 40px;
        margin-bottom: 10px;
    }
    .el-dialog__headerbtn{
        top: 10px;
        right: 10px;
    }
    .el-dialog__headerbtn .el-dialog__close {
        font-size: 28px;
    }
    .submit-wrapper{
      .el-button{
        min-width: 100px;
      }
    }
    .left-box {
      width: 240px;
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 5;
      height: 100%;
      float: left;
      flex-direction: column;
      background: #324157;

      .logo-wrapper {
        font-size: 12px;
        line-height: 18px;
        padding: 8px 0 6px;
        margin-top: 10px;
        .logo-pic {
          width: 122px;
          height: 34px;
          margin-left: 19px;
          background: url(~@/assets/images/logo.png) center center no-repeat;
          background-size: contain;
        }
        .info {
          color: #bfcbd9;
          margin-top: 10px;
          .phone {
            margin-left: 25px;
          }
          .logout {
            margin-left: 30px;
            cursor: pointer;
          }
          p,
          a {
            margin: 10px 0;
            i {
              margin-right: 5px;
              vertical-align: bottom;
            }
          }
        }
      }
    }

    .left-box .sidebar {
      flex: 1;
      border-radius: 0;
      background: #324157;
      overflow-y: auto;
      &::-webkit-scrollbar {
        background: rgba(0, 0, 0, 0);
        height: 0;
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background: black;
        border-radius: 7px;
      }
    }

    .left-box .fa {
      margin-right: 10px;
      font-size: 18px;
    }

    .left-box .el-submenu .el-menu-item .fa {
      margin-right: 10px;
      font-size: 10px;
    }
    .iconfont.icon-circle{
      font-size: 12px;
    }
    .el-menu-item .iconfont, .el-submenu .iconfont.icon-circle{
      width: 18px;
    }

    /** 左侧菜单宽度适配 **/
    @media (max-width: 1300px){
      .left-box{
        width: 200px;
      }
      .content{
        padding-left: 210px;
      }
      .el-submenu .el-menu-item{
        width: 200px;
        padding: 0 30px;
        text-align: left;
        text-indent: -3px;
      }
      .el-menu-item .iconfont, .el-submenu .iconfont{
        margin-right: -5px;
        margin-left: -8px;
      }
      .left-box .logo-wrapper .logo-pic{
        height: 26px;
        margin: 13px 0;
        margin-left: 10px;
      }
    }
</style>
