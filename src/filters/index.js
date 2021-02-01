/**
 * 按需全局化过滤器
 * 您还可以在组件定义时的 filters 属性中按需引入
 */
import Vue from 'vue'

Vue.filter('dateFormat', require('./dateFormat').default)
Vue.filter('handleUploadDomain', require('./handleUploadDomain').default)
Vue.filter('handleWebSite', require('./handleWebSite').default)
Vue.filter('handleDataKey', require('./handleDataKey').default)
