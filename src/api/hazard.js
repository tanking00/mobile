import request from '@/utils/request'

// 隐患列表
export function getHazardList(data) {
  return request({
    url: '/hazard/getHazardList',
    method: 'get',
    params: data
  })
}

// 根据隐患大类id查询相关细类及等级
export function getTypeAndLevelById(id) {
  return request({
    url: '/hazard/type/getTypeAndLevelById',
    method: 'get',
    params: { id }
  })
}

// 获取隐患流程编号
export function getHiddenDangerNum() {
  return request({
    url: '/hazard/getHiddenDangerNum',
    method: 'get'
  })
}

// 获取隐患详情
export function getHazardById(id) {
  return request({
    url: '/hazard/getHazardById/' + id,
    method: 'get',
    loading: true
  })
}

// 查询部门领导
export function getUserOrg(orgid) {
  return request({
    url: '/user/getUserOrg',
    method: 'get',
    params: { orgid }
  })
}

// 隐患提报
export function hazardCommit(data) {
  return request({
    url: '/hazard/commit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 提报部门审核
export function commitAssignDep(data) {
  return request({
    url: '/hazard/commitAssignDep',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// --------------------一般隐患--------------------
// 获取一般隐患子详情
export function getHazardGeneralDetails(data) {
  return request({
    url: '/hazardGeneral/getOneById',
    method: 'get',
    params: data,
    loading: true
  })
}

// 一般隐患-整改责任部门审核
export function deptAudit(data) {
  return request({
    url: '/hazardGeneral/deptAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 一般隐患-制定整改方案
export function generalEnactScheme(data) {
  return request({
    url: '/hazardGeneral/generalEnactScheme',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 一般隐患-安全部门审核
export function generalSafedeptAudit(data) {
  return request({
    url: '/hazardGeneral/generalSafedeptAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 一般隐患-隐患整改执行
export function abarbeitungExecute(data) {
  return request({
    url: '/hazardGeneral/abarbeitungExecute',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 一般隐患-整改验收
export function generalAbarbeitungCheck(data) {
  return request({
    url: '/hazardGeneral/generalAbarbeitungCheck',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// --------------------重大隐患--------------------

// 重大隐患-流程中-详情
export function getHazardMajorDetails(hazardId, hazardSubId) {
  return request({
    url: '/hazard/major/getHazardMajorDetails/' + hazardId,
    method: 'get',
    params: { hazardSubId },
    loading: true
  })
}

// // 重大隐患-审核-提报部门审核
// export function commitAssignDep(data) {
//   return request({
//     url: '/hazard/major/commitAssignDep',
//     method: 'post',
//     loading: true,
//     message: true,
//     data
//   })
// }

// 重大隐患-审核-整改责任部门审核
export function commitDeptAudit(data) {
  return request({
    url: '/hazard/major/commitDeptAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-制定整改方案
export function commitEnactScheme(data) {
  return request({
    url: '/hazard/major/commitEnactScheme',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-督办总监审核
export function commitDirectorAudit(data) {
  return request({
    url: '/hazard/major/commitDirectorAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-安全部门审核
export function commitSafetyDepartmentAudit(data) {
  return request({
    url: '/hazard/major/commitSafetyDepartmentAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-首席安全官审核
export function commitChiefSecurityOfficerAudit(data) {
  return request({
    url: '/hazard/major/commitChiefSecurityOfficerAudit',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-隐患整改执行
export function commitImplementationRectification(data) {
  return request({
    url: '/hazard/major/commitImplementationRectification',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-督办总监确认
export function commitDirectorConfirm(data) {
  return request({
    url: '/hazard/major/commitDirectorConfirm',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-验收人验收
export function commitAcceptanceAcceptor(data) {
  return request({
    url: '/hazard/major/commitAcceptanceAcceptor',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-首席安全官确认
export function commitChiefSecurityOfficerConfirm(data) {
  return request({
    url: '/hazard/major/commitChiefSecurityOfficerConfirm',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 重大隐患-审核-CEO待阅
export function commitCeoConsult(data) {
  return request({
    url: '/hazard/major/commitCeoConsult',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}
