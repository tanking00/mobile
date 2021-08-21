import request from '@/utils/request'

// 获取应急人员列表
export function getEmergencyMembers(data) {
  return request({
    url: '/kskEmergencyPersonnel',
    method: 'get',
    params: data
  })
}

// 获取应急人员详情
export function getEmergencyMemberDetails(data) {
  return request({
    url: '/kskEmergencyPersonnel/' + data,
    method: 'get'
  })
}

// 获取急救物资列表
export function getEmergencyFirstAid(data) {
  return request({
    url: '/kskEmergencySupplies',
    method: 'get',
    params: data
  })
}

// 获取急救物资详情
export function getEmergencyFirstAidDetails(data) {
  return request({
    url: '/kskEmergencySupplies/' + data,
    method: 'get'
  })
}
// 获取急救物资变更记录
export function getEmergencyFirstAidHistory(data) {
  return request({
    url: '/kskEmergencySuppliesChanged',
    method: 'get',
    params: data
  })
}

// 获取应急预案列表
export function getEmergencyPrePlanList(data) {
  return request({
    url: '/kskEmergencyContingencyPlan',
    method: 'get',
    params: data
  })
}
// 获取应急预案-根据预案分类和名称
export function getEmergencyPrePlanListForClassify(data, planCategory) {
  return request({
    url: '/kskEmergencyContingencyPlan/getAllPlan/' + planCategory,
    method: 'get',
    params: data
  })
}
// 获取应急预案详情
export function getEmergencyPrePlanDetails(data) {
  return request({
    url: '/kskEmergencyContingencyPlan/' + data,
    method: 'get'
  })
}

// 获取应急演练列表
export function getEmergencyDrillList(data) {
  return request({
    url: '/kskEmergencyExercise',
    method: 'get',
    params: data
  })
}
// 获取应急演练详情
export function getEmergencyDrillDetails(data) {
  return request({
    url: '/kskEmergencyExercise/' + data,
    method: 'get'
  })
}

// 获取应急物资列表
export function getEmergencyMaterialsList(data) {
  return request({
    url: '/specialEquipment/getMeetEmergencies',
    method: 'get',
    params: data
  })
}
// 应急物资-获取消防设施、特殊设备类型集合
export function getEmergencyMaterialTypes() {
  return request({
    url: '/specialEquipment/getTypeList',
    method: 'get'
  })
}

// 获取应急物资详情
export function getEmergencyMaterialsDetails(data) {
  return request({
    url: '/specialEquipment/getMeetEmergenciesById',
    method: 'get',
    params: data
  })
}
// 根据id获取所有审核记录
export function getEmergencyAuditLogging(data) {
  return request({
    url: '/kskEmergencyExercise/getApprovalByPlanId',
    method: 'get',
    params: data
  })
}
// 上报应急演练
export function uploadEmergencyPlan(data) {
  return request({
    url: '/kskEmergencyExercise',
    method: 'post',
    data,
    loading: true
  })
}
// 实施情况综述
export function entryImplement(data) {
  return request({
    url: '/kskEmergencyExercise/end',
    method: 'post',
    data,
    loading: true
  })
}
// 直属领导审核
export function emergencyManagerApprovak(data) {
  return request({
    url: '/kskEmergencyExercise/managerApprovak',
    method: 'post',
    data,
    loading: true
  })
}
// 安全经理审核
export function emergencySafeManagerApprovak(data) {
  return request({
    url: '/kskEmergencyExercise/safeManagerApprovak',
    method: 'post',
    data,
    loading: true
  })
}
// 根据预案ID查询人员
export function getPersonByPlanId(data) {
  return request({
    url: '/kskEmergencyExercise/getPersonByPlanId',
    method: 'get',
    params: data
  })
}

// 应急演练-待阅任务处理
export function readTask(data) {
  return request({
    url: '/kskEmergencyExercise/readTask',
    method: 'post',
    data: data,
    loading: true
  })
}
// 应急演练作废
export function cancellationEmergency(data) {
  return request({
    url: '/kskEmergencyExercise/cancellation',
    method: 'post',
    data: data,
    loading: true
  })
}
