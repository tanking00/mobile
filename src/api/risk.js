import request from '@/utils/request'

// 危险源辨识库
export function getSourceDataList(data) {
  return request({
    url: '/sourceData/page',
    method: 'get',
    params: data
  })
}

export function getSourceDataDetails(data) {
  return request({
    url: '/sourceData/' + data,
    method: 'get'
  })
}

// 根据风险类型id查询
export function getSourceQueryList(riskTypeId) {
  return request({
    url: '/sourceData/query',
    method: 'get',
    params: { riskTypeId }
  })
}

// 危险源评价
export function getSourceEvaluateList(data) {
  return request({
    url: '/dangerSourceEvaluate/page',
    method: 'get',
    params: data
  })
}

export function getSourceEvaluateDetails(id) {
  return request({
    url: '/dangerSourceEvaluate/queryInfo',
    method: 'get',
    params: { id }
  })
}

// 危险源辨识评价
export function getIdentifyList(data) {
  return request({
    url: '/identify/page',
    method: 'get',
    params: data
  })
}

export function getIdentifyDetails(data) {
  return request({
    url: '/identify/' + data,
    method: 'get'
  })
}

// 危险评价通过id查询详情
export function getRiskEvaluate(id) {
  return request({
    url: '/evaluate/info',
    method: 'get',
    params: { id }
  })
}

// 删除危险评价
export function delRiskEvaluate(id) {
  return request({
    url: '/evaluate/delete',
    method: 'delete',
    loading: true,
    message: true,
    params: { id }
  })
}

// 添加危险评价
export function addRiskEvaluate(data) {
  return request({
    url: '/evaluate/save',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 编辑危险评价
export function editRiskEvaluate(data) {
  return request({
    url: '/evaluate/update',
    method: 'put',
    loading: true,
    message: true,
    data
  })
}

// 获取应急预案列表
export function getReservePlanList(data) {
  return request({
    url: '/kskEmergencyContingencyPlan',
    method: 'get',
    params: data
  })
}

// 危险源辨识提交
export function submitIdentifySource(data) {
  return request({
    url: '/identify/source/submit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 部门经理审核
export function deptAuditIdentify(data) {
  return request({
    url: '/identify/deptAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 安全部审核
export function safetyDeptAuditIdentify(data) {
  return request({
    url: '/identify/safetyDeptAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 获取所有管理制度
export function getAllLawsRegime() {
  return request({
    url: '/lawsRegime/all',
    method: 'get'
  })
}

// 获取所有应急预案
export function getAllPlan() {
  return request({
    url: '/kskEmergencyContingencyPlan/getAllPlan',
    method: 'get'
  })
}
