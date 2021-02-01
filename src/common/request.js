/**
 * Created by aweakcoder on 16/10/09.
 */
import ComConfig from '@/common/config.js'
import Api from '@/common/api.js'
import ComUtil from '@/common/util.js'
import Host from '@/common/host.js'
import Axios from 'axios'
import store from '../store'
import qs from 'qs'
import {
  Message
} from 'element-ui'
import {
  getToken,
  getEmail,
  getName
} from '@/utils/auth'

//配置接口信息
// let token = localStorage.getItem('token') || ''
//配置接口信息
Axios.defaults.baseURL = Api.domain
Axios.defaults.credentials = 'include'
Axios.defaults.headers['Accept'] = 'application/json'
let handleRes = res => {
  if (res.code == 0) {
    // 返回正常
    return res
  } else if (res.code == 401 || res.code == 9996) {
    // 未登录
    ComUtil.goToLoginPage()
  } else {
    if(res.code == 9999 && res.msg == '余额不足'){
      return res
    }
    console.log(res)
    Message.error(String(res.msg ? res.msg : '未知错误')).showClose = true
    return res
  }
}

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    //在发送请求之前做某件事
    if (config.url.indexOf(Host.resAdminHost) < 0) {
      // 游戏接口不增加header
      let token = localStorage.getItem(ComConfig.token_key) || ''
      // 用户信息
      if (store.getters.token) {
        config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        config.headers['email'] = getEmail() // 让每个请求携带自己的账号
        config.headers['name'] = getName() // 让每个请求携带自己的账号
      }
      if (token) {
        config.data.token = token
      }
    }
    if (config.headers['Content-Type'] == 'application/json') {
      config.data = JSON.stringify(config.data)
    } else if (config.method === 'post' && (config.headers['Content-Type'] === undefined || config.headers['Content-Type'] === '')) {
      config.data = qs.stringify(config.data);
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    //  _.toast("错误的传参", 'fail');
    return Promise.reject(error);
  }
)
Axios.interceptors.response.use(response => {
  // console.log("interceptors", response);
  return handleRes(response.data)
}, error => {
  console.log(error)
  return false;
})

let request = function (config) {
  let _req = null
  if (config.mock) {
    console.log('mock params', config.data)
    console.log('mock result', config.mock)
    _req = new Promise((resolve, reject) => {
      setTimeout(function () {
        console.log('handleRes(config.mock): ', handleRes(config.mock));
        resolve(handleRes(config.mock))
      }, 2000)
    })
  } else if (config.type && config.type == 'post') {
    _req = Axios.post(config.url || '', config.data, config.headers && {
      headers: config.headers
    } || {})
  } else {
    _req = Axios.get(config.url || '', {
      params: config.data
    })
  }
  return _req
}
export default request
