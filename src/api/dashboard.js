import request from '@/utils/request'
// 获取某字典列表
export function getDictOfCode(code) {
  const data = { code: code, deleted: 0 }
  return request({
    url: '/dict/list',
    method: 'get',
    params: data,
    cache: true
  })
}
/* ---------------------风险分级管控 --------------------------- */
export function getDataMapRiskGrade(time) {
  // 大区看板获取获取风险等级
  return request({
    url: `/dataMapRiskGrade`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapRiskGradePoint(time) {
  // 根据点位获取风险等级
  return request({
    url: `/dataMapRiskGrade/point`,
    method: 'get',
    params: { time },
    loading: true
  })
}
/* ---------------------隐患排查 --------------------------- */
export function getDataMapHazard(type, year) {
  // 获取隐患数量
  return request({
    url: `/dataMapHazard`,
    method: 'get',
    params: { type, year },
    loading: true
  })
}
export function getDataMapHazardArea(year) {
  // 隐患区域分布
  return request({
    url: `/dataMapHazard/area`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapHazardClose(year) {
  // 获取隐患关闭率
  return request({
    url: `/dataMapHazard/close`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapHazardRectify(type, year) {
  // 隐患整改统计
  return request({
    url: `/dataMapHazard/rectify`,
    method: 'get',
    params: { type, year },
    loading: true
  })
}
export function getDataMapHazardType(type, year) {
  // 安全隐患分类
  return request({
    url: `/dataMapHazard/type`,
    method: 'get',
    params: { type, year },
    loading: true
  })
}
/* ---------------------责任制考核 --------------------------- */
export function getDataMapDuty(time) {
  // 未按时完成责任书签署统计
  return request({
    url: `/dataMapDuty`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapDutyAssess(time) {
  // 未按时完成责任制考核统计
  return request({
    url: `/dataMapDuty/assess`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapDutAverages(time) {
  // 考核总体平均得分统计
  return request({
    url: `/dataMapDuty/average`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapDutBranchCount(time, type) {
  // 各部门考核平均得分统计
  return request({
    url: `/dataMapDuty/branch/count`,
    method: 'get',
    params: { time, type },
    loading: true
  })
}
export function getDataMapDutIndividualEventCount(time, value) {
  // 各考核单项失分占比统计
  return request({
    url: `/dataMapDuty/individualEvent/count`,
    method: 'get',
    params: { time, value },
    loading: true
  })
}
export function getDataMapDutLosePoint(time) {
  // 考核总体失分占比统计
  return request({
    url: `/dataMapDuty/losePoint`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapDutPersonnelCount(time, type) {
  // 各人员层级考核失分占比统计
  return request({
    url: `/dataMapDuty/personnel/count`,
    method: 'get',
    params: { time, type },
    loading: true
  })
}
/* ---------------------设备设施 --------------------------- */
export function getDataMapEquipmentInUseRate(time) {
  // 获取在用率
  return request({
    url: `/dataMapEquipment/inUseRate`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapEquipmentType(time) {
  // 获取设备分类
  return request({
    url: `/dataMapEquipment`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapEquipmentRecord(time) {
  // 获取未点检记录
  return request({
    url: `/dataMapEquipment/record`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapEquipmentFireCount(time) {
  // 消防设施数量统计
  return request({
    url: `/dataMapEquipment/Fire/count`,
    method: 'get',
    params: { time },
    loading: true
  })
}
/* ---------------------应急模块 --------------------------- */
export function getEmergencyPersonnelRatio(time) {
  // 获取 应急人员 占比 统计看板
  return request({
    url: `/dataMapEmergency/crew`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getEmergencyMaterialsRatio(time) {
  // 获取 应急物资占比 统计看板
  return request({
    url: `/dataMapEmergency/supplies`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getEmergencyDrillTime(time, sign) {
  // 获取应急演练次数
  return request({
    url: `/dataMapEmergency`,
    method: 'get',
    params: { time, sign },
    loading: true
  })
}
export function getEmergencyPlan(time, sign) {
  // 获获取应急预案 统计看板
  return request({
    url: `/dataMapEmergency/plan`,
    method: 'get',
    params: { time, sign },
    loading: true
  })
}
/* ---------------------安全检查 --------------------------- */
export function getDataMapSecurityCheck(time) {
  // 获取全年安全检查统计
  return request({
    url: `/dataMapSecurityCheck`,
    method: 'get',
    params: { time },
    loading: true
  })
}
export function getDataMapSecurityCheckCount(time, sign) {
  // 获取安全检查统计
  return request({
    url: `/dataMapSecurityCheck/count`,
    method: 'get',
    params: { time, sign },
    loading: true
  })
}
export function getDataMapSecurityCheckWorkArea(time) {
  // 获取工作区域安全检查
  return request({
    url: `/dataMapSecurityCheck/workArea`,
    method: 'get',
    params: { time },
    loading: true
  })
}
/* ---------------------安全奖惩 --------------------------- */
export function getDataMapRewardsAwards(year) {
  // 奖励奖项统计
  return request({
    url: `/dataMapRewards/awards`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapRewardsDepartmentPerson(year) {
  // 部门奖励人次分布
  return request({
    url: `/dataMapRewards/department/person`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapRewardsGrade(year) {
  // 奖励级别统计
  return request({
    url: `/dataMapRewards/grade`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapRewardsPerson(year) {
  // 奖励人次
  return request({
    url: `/dataMapRewards/person`,
    method: 'get',
    params: { year },
    loading: true
  })
}
/* 处罚模块 */
export function getDataMapRewardsViolationDeptLevel(year) {
  // 部门违规级别
  return request({
    url: `/dataMapRewards/violation/dept/level`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapRewardsViolationLevel(year) {
  // 违规级别统计
  return request({
    url: `/dataMapRewards/violation/level`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapRewardsViolationPerson(year) {
  // 违规人次统计
  return request({
    url: `/dataMapRewards/violation/person`,
    method: 'get',
    params: { year },
    loading: true
  })
}
export function getDataMapRewardsViolationType(year) {
  // 违规类型统计
  return request({
    url: `/dataMapRewards/violation/type`,
    method: 'get',
    params: { year },
    loading: true
  })
}
