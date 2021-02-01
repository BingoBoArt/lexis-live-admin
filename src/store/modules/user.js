import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  getEmail,
  setEmail,
  removeEmail,
  getName,
  setName,
  removeName
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    email: getEmail(),
    name: getName(),
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  getters: {
    // sidebar: state => state.app.sidebar,
    token: state => state.token,
    avatar: state => state.avatar,
    name: state => state.name,
    roles: state => state.roles
  },
  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const email = userInfo.email.trim()
      console.log(email)
      return new Promise((resolve, reject) => {
        login(email, userInfo.password)
          .then(response => {
            console.log(email, userInfo.password, response)
            const data = response.data
            setToken(data.token)
            setEmail(data.email)
            setName(data.name)
            commit('SET_TOKEN', data.token)
            commit('SET_EMAIL', data.email)
            commit('SET_NAME', data.name)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data
            commit('SET_ROLES', data.roles)
            // commit('SET_NAME', data.name)
            // commit('SET_EMAIL', data.email)
            // commit('SET_AVATAR', data.avatar)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.email)
          .then((res) => {
            // console.log(19191919191, res)
            commit('SET_TOKEN', '')
            commit('SET_EMAIL', '')
            commit('SET_ROLES', [])
            removeToken()
            removeEmail()
            removeName()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_EMAIL', '')
        removeToken()
        removeEmail()
        resolve()
      })
    }
  }
}

export default user
