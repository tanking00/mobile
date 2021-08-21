/**
 * Created by Tanking.
 * 公用枚举
 */

//  性别
export const enumGender = {
  0: '未知',
  1: '男',
  2: '女'
}
// 登录类型
export const loginType = {
  PASSWORD: '密码登录',
  WE_CHAT: '微信登录',
  WE_CHAT_CP: '企业微信',
  DING: '钉钉登录',
  AD: 'AD域控'
}
// 责任书签署状态
export const dutySignStatus = {
  '0': '签署中',
  '1': '已签署'
}
// 应急物资状态
export const emergencyMaterialsStatus = {
  '0': '在用',
  '1': '维修中',
  '2': '报废'
}
// 急救物资状态
export const firstAidMaterialsStatus = {
  '10': '正常',
  '20': '临近过期',
  '30': '已过期'
}
// 应急演练状态
export const drillStatus = {
  '10': '进行中',
  '20': '已完成',
  '30': '已超期'
}

// 应急演练问题整改状态
export const issueCorrectiveStatus = {
  '10': '整改中',
  '20': '已超期',
  '30': '已完成'
}

// 责任书考核状态
export const dutyTestStatus = {
  '0': '考核中',
  '1': '已考核'
}
// 法律法规状态
export const lawsStatus = {
  '0': '作废',
  '1': '在用'
}
// 适用条款符合性
export const clauseCompliance = {
  '0': '不符合',
  '1': '符合',
  '2': '未评估'
}
// 安全检查审核结果、应急管理审核结果
export const safetyCheckOperation = {
  '1': '提交',
  '2': '同意',
  '3': '退回',
  '4': '转办',
  '5': '结束',
  '6': '系统自动转办'
}
// 物资状态
export const materialStatus = {
  '0': '在用',
  '1': '维修中',
  '2': '报废'
}
// 危险源辨识评价状态
export const hazardAssessmentStatus = {
  1: '进行中',
  2: '已完成',
  3: '已超期'
}
// 隐患状态
export const hazardStatus = {
  '0': '进行中',
  '1': '已完成',
  '2': '已作废'
}
// 维保隐患状态
export const sbwbHazardStatus = {
  '0': '整改中',
  '1': '已完成',
  '2': '已作废',
  '3': '未发起'
}
// 安全检查流程状态
export const safetyCheckStatus = {
  '1': '进行中',
  '2': '已完成',
  '3': '进行中', // 已超期
  '4': '已作废'
}
// 计划状态
export const planStatus = {
  '1': '未完成',
  '2': '已完成',
  '3': '逾期'
}
