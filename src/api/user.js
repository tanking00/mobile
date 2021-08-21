import request from '@/utils/request'

// 账号密码登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 企业微信登录
export function loginCp(data) {
  return request({
    url: '/auth/login/cp',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/token',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/login/out',
    method: 'post'
  })
}

export function getRouters() {
  return request({
    url: '/menu/router',
    method: 'get'
  })
}
