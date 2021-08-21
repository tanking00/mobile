import request from '@/utils/request'

export function getTemplateList(data) {
  return request({
    url: '/duty/page',
    method: 'get',
    params: data
  })
}

export function getTemplateDetails(data) {
  return request({
    url: '/duty/' + data,
    method: 'get'
  })
}

// 根据模板Id查询配置人员详情
export function getTemplateUsers(id, data) {
  return request({
    url: '/duty/template/' + id,
    method: 'get',
    params: data
  })
}

export function getDutySignList(data) {
  return request({
    url: '/duty/sign/page',
    method: 'get',
    params: data
  })
}

export function getDutySignDetails(data, type) {
  console.log(type)
  let url = ''
  if (type === '1') {
    url = '/duty/sign/leader/'
  }
  if (type === '2') {
    url = '/duty/sign/person/'
  }
  if (type === '3') {
    url = '/duty/sign/'
  }
  return request({
    url: url + data,
    method: 'get'
  })
}

export function dutyLeaderSign(data) {
  return request({
    url: '/duty/sign/leader',
    method: 'post',
    message: true,
    loading: true,
    data
  })
}

export function dutyPersonnelSign(data) {
  return request({
    url: '/duty/sign/personnel',
    method: 'post',
    message: true,
    loading: true,
    data
  })
}

export function getTestTemplateList(data) {
  return request({
    url: '/assess-template/page',
    method: 'get',
    params: data
  })
}

export function getTestTemplateDetails(data) {
  return request({
    url: '/assess-template/' + data,
    method: 'get',
    params: data
  })
}

// 责任书考核台账
export function dutyAssessSignPage(params) {
  return request({
    url: `/assess/page`,
    method: 'get',
    params: params
  })
}

// 根据考核id和责任签署ID查询详情
export function dutyAssessInfo(params) {
  return request({
    url: `/assess`,
    method: 'get',
    params: params
  })
}

// 责任人分数详情
export function staffGrade(params) {
  return request({
    url: `/assess/personnel/grade`,
    method: 'get',
    params: params
  })
}
// 根据当前员工查询自评信息
export function getStaffGradeForUser(params) {
  return request({
    url: `/assess/emp/detail`,
    method: 'get',
    params: params
  })
}

// 责任人自评
export function staffAssess(data) {
  return request({
    url: `/assess/personnel`,
    method: 'post',
    data: data,
    loading: true
  })
}
// 责任领导评分
export function leaderAssess(data) {
  return request({
    url: `/assess/leader`,
    method: 'post',
    data: data,
    loading: true
  })
}
// 责任领导页面分数详情
export function leaderGrade(params) {
  return request({
    url: `/assess/leader/grade`,
    method: 'get',
    params: params,
    loading: true
  })
}
// 一键同步分数 /assess/sync
export function syncGrade(data) {
  return request({
    url: `/assess/sync`,
    method: 'post',
    data: data,
    loading: true
  })
}
// 责任领导查看员工分数详情
export function staffGradeDetail(params) {
  return request({
    url: `/assess/assess/grade`,
    method: 'get',
    params: params
  })
}
// 责任领导给单个员工评分
export function leaderScore(data) {
  return request({
    url: `/assess`,
    method: 'put',
    data: data,
    loading: true
  })
}
