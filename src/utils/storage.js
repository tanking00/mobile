/**
 * Created by Tanking.
 * 存储
 */

import Cookies from 'js-cookie'

// 前缀
const prefix = 'casco_mobile_'

// Token
const TokenKey = prefix + 'token'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 搜索记录
const searchKey = prefix + 'search_'
export function getSearchRecord(name) {
  const key = searchKey + name
  let res = Cookies.get(key)
  if (res) {
    res = JSON.parse(res)
  } else {
    res = []
  }
  return res
}
export function setSearchRecord(name, value) {
  const key = searchKey + name
  if (value) {
    value = JSON.stringify(value)
  } else {
    value = ''
  }
  return Cookies.set(key, value)
}
export function removeSearchRecord(name) {
  const key = searchKey + name
  return Cookies.remove(key)
}

// 通用
export function getStorage(name) {
  return Cookies.get(prefix + name)
}
export function setStorage(name, value) {
  return Cookies.set(prefix + name, value)
}
export function removeStorage(name) {
  return Cookies.remove(prefix + name)
}
