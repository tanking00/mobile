import request from '@/utils/request'

// 检查表库
export function getCheckLibraryList(data) {
  return request({
    url: '/inspect',
    method: 'get',
    params: data
  })
}

export function getCheckLibraryDetails(id) {
  return request({
    url: '/inspect/getById',
    method: 'get',
    params: { id }
  })
}

// 消防设施信息
export function getFireControlList(data) {
  return request({
    url: '/specialEquipment',
    method: 'get',
    params: data
  })
}

export function getFireControlDetails(data) {
  return request({
    url: '/specialEquipment/getById',
    method: 'get',
    params: data
  })
}

// 点检信息
export function getSpotCheckList(data) {
  return request({
    url: '/checkInfo',
    method: 'get',
    params: data
  })
}

export function getSpotCheckDetails(id) {
  return request({
    url: '/checkInfo/getById',
    method: 'get',
    params: { id }
  })
}

// 维保信息
export function getMaintenanceList(data) {
  return request({
    url: '/maintenanceCheck',
    method: 'get',
    params: data
  })
}

export function getMaintenanceDetails(id) {
  return request({
    url: '/maintenanceCheck/getById',
    method: 'get',
    params: { id }
  })
}

// 扫码点检

// 获取点位基本信息
export function getMaterialDetails(id) {
  return request({
    url: '/specialEquipment/getSpecialEquipmentDes',
    method: 'get',
    params: { id }
  })
}

// 新增点检信息
export function addPointCheck(data) {
  return request({
    url: '/checkInfo',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 实施
// 实施方案制定
export function submitImplement(data) {
  return request({
    url: '/maintenanceCheckPlan/executeSolution',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 获取审批记录
export function getApprovalRecord(code) {
  return request({
    url: '/maintenanceCheckPlan/getRecordsByCode',
    method: 'get',
    params: { code }
  })
}

// 生成流程编号
export function getProcessNumber(type) {
  return request({
    url: '/maintenanceCheckPlan/getmaintenanceNum',
    method: 'get',
    params: { type }
  })
}

// 设备设施模糊搜索
export function getLikeEquipmentPage(data) {
  return request({
    url: '/specialEquipment/getFacilityList',
    method: 'get',
    params: data
  })
}
