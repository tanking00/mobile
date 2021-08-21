import request from '@/utils/request'

// 安全检查项
export function getCheckItemList(data) {
  return request({
    url: '/security-item/page',
    method: 'get',
    params: data
  })
}

export function getCheckItemDetails(data) {
  return request({
    url: '/security-item/' + data,
    method: 'get'
  })
}

// 安全检查信息
export function getSafetyCheckList(data) {
  return request({
    url: '/securityCheckPlan/page',
    method: 'get',
    params: data
  })
}

export function getSafetyCheckDetails(data) {
  return request({
    url: '/securityCheckPlan/' + data,
    method: 'get'
  })
}

// 重新提交检查计划
export function securityCheckPlanResubmit(data) {
  return request({
    url: '/securityCheckPlan/resubmit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 部门领导审批
export function securityCheckPlanLeader(data) {
  return request({
    url: '/securityCheckPlan/leader',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 获取项目
export function getProject(data) {
  return request({
    url: '/user/getProject',
    method: 'get',
    params: data
  })
}

// 计划实施（转办）
export function securityCheckPlanImplTurn(data) {
  return request({
    url: '/securityCheckPlan/impl/turn',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 计划实施（不转办）
export function securityCheckPlanImpl(data) {
  return request({
    url: '/securityCheckPlan/impl',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 检查结果录入（转办）
export function securityCheckPlanTurn(data) {
  return request({
    url: '/securityCheckPlan/turn',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 结束检查计划流程
export function securityCheckPlanEnd(data) {
  return request({
    url: '/securityCheckPlan/process/end',
    method: 'get',
    loading: true,
    message: true,
    params: data
  })
}
