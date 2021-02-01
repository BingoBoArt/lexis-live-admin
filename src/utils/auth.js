import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const EmailKey = 'Admin-Email'
const NameKey = 'Admin-Name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setEmail(email) {
  return Cookies.set(EmailKey, email)
}
export function getEmail(email) {
  return Cookies.get(EmailKey)
}
export function removeEmail(email) {
  return Cookies.remove(EmailKey)
}

export function setName(name) {
  return Cookies.set(NameKey, name)
}
export function getName(email) {
  return Cookies.get(NameKey)
}
export function removeName(email) {
  return Cookies.remove(NameKey)
}
