import request from '@/common/request'

export function login(email, password, sf, ff) {
  return request({
    url: '/userAuth/login',
    type: 'post',
    data: {
      email,
      password
    }
  })
  // return this.$ax.get('/user/login', { username, password }, sf, ff)
}

export function getInfo(email, token) {
  return request({
    url: '/userAuth/user/info',
    type: 'post',
    data: { email, token }
  })
}

export function logout(email) {
  return request({
    url: '/userAuth/logout',
    type: 'post',
    data: {email}
  })
}
