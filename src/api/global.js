import request from '@/utils/request'

// 获取所有组织架构
export function getAllOrg() {
  return request({
    url: '/org',
    method: 'get',
    cache: true
  })
}

// 获取所有角色
export function getAllRole() {
  return request({
    url: '/role/all',
    method: 'get'
  })
}

// 获取所有岗位
export function getAllJob() {
  return request({
    url: '/job/all',
    method: 'get'
  })
}

// 获取某字典列表
export function getDictOfCode(code) {
  const data = { code: code, enable: 1, deleted: 0 }
  return request({
    url: '/dict/list',
    method: 'get',
    params: data,
    cache: true
  })
}

// 获取某字典列表带已删除
export function getDictOfCodeHasDelete(code) {
  const data = { code: code }
  return request({
    url: '/dict/list',
    method: 'get',
    params: data,
    cache: true
  })
}

// 上传
export function uploadFile(data) {
  return request({
    url: '/files/upload',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

// 用户模糊搜索
export function getLikeUsersPage(data) {
  return request({
    url: '/user/likeUsersPage',
    method: 'get',
    params: data
  })
}

// jssdk
export function jssdk(url) {
  return request({
    url: '/cp/jssdk',
    method: 'get',
    params: { url }
  })
}

// 获取流程编号
export function getProcessCode(moduleCode) {
  return request({
    url: '/process_code',
    method: 'get',
    params: { moduleCode }
  })
}

// 通过ID获取文件信息
export function getFilesOfId(id) {
  return request({
    url: '/files/' + id,
    method: 'get'
  })
}

// 计划未完成数量
export function getPlanCount() {
  return request({
    url: '/planManagement/undone/count',
    method: 'get'
  })
}
