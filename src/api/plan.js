import request from '@/utils/request'

// 计划管理列表
export function getPlanList(data) {
  return request({
    url: '/planManagement/page',
    method: 'get',
    params: data
  })
}

// 计划详情
export function getPlanDetails(id, type) {
  console.log(type)
  let url = ''
  switch (type) {
    case '安全检查': // 安全检查计划详情
      url = '/planSecurityCheck/'
      break
    case '设备年度检查': // 年度检查计划详情
      url = '/planAnnualInspection/'
      break
    case '应急演练': // 应急演练计划详情
      url = '/planEmergencyExercise/'
      break
    case '设备点检': // 点检计划详情
      url = '/planCheck/'
      break
    case '设备维保': // 维保计划详情
      url = '/planMaintenance/'
      break
  }
  return request({
    url: url + id,
    method: 'get'
  })
}

// 编辑计划管理
export function updatePlan(data) {
  return request({
    url: '/planManagement/update',
    method: 'put',
    loading: true,
    message: true,
    data
  })
}

// 根据计划id拿到演练id
export function getExeByPlanId(id) {
  return request({
    url: '/kskEmergencyExercise/getExeByPlanId',
    method: 'get',
    params: { id }
  })
}

// 根据计划id拿到安全检查信息
export function getCheckByPlanId(id) {
  return request({
    url: '/securityCheckPlan/plan/' + id,
    method: 'get'
  })
}

// 根据计划id查询设备信息
export function getMaintenanceByPlanId(id) {
  return request({
    url: '/maintenanceCheck/getByPlanId',
    method: 'get',
    params: { id }
  })
}
