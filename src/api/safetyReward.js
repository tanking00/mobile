import request from '@/utils/request'
import qs from 'qs'

// 获取奖励标准list
export function getRewardStandardList(data) {
  return request({
    url: '/reward/page',
    method: 'get',
    params: data
  })
}
// 获取奖励标准详情
export function getRewardStandardDetails(data) {
  return request({
    url: '/reward/' + data,
    method: 'get',
    loading: true
  })
}

// 获取处罚标准list
export function getPunishmentStandardList(data) {
  return request({
    url: '/punish/page',
    method: 'get',
    params: data
  })
}
// 获取处罚标准详情
export function getPunishmentStandardDetails(data) {
  return request({
    url: '/punish/' + data,
    method: 'get',
    loading: true
  })
}

// 奖励提报list
export function getSubmissionList(data) {
  return request({
    url: '/submission/page',
    method: 'get',
    params: data
  })
}
// 奖励提报详情
export function getSubmissionDetails(data) {
  return request({
    url: '/submission/' + data,
    method: 'get',
    loading: true
  })
}
// 发起奖励提报
export function addSubmission(data) {
  return request({
    url: '/submission',
    method: 'post',
    data: data,
    loading: true
  })
}

// 奖励提报-作废
export function destroySubmission(data) {
  return request({
    url: '/submission/destroy',
    method: 'post',
    data: data,
    loading: true
  })
}

// 奖励提报-安全初审
export function rewardSubmissionSafetyAudit(data) {
  return request({
    url: '/submission/safetyAudit',
    method: 'post',
    data: data,
    loading: true
  })
}
// 奖励提报-安全确认
export function rewardSubmissionSafetyAffirm(data) {
  return request({
    url: '/submission/safetyAffirm',
    method: 'post',
    data: data,
    loading: true
  })
}

// 发起奖励提报-退回后重新提交
export function addResubmit(data) {
  return request({
    url: '/submission/resubmit',
    method: 'post',
    data: data,
    loading: true
  })
}

// 获取奖励入围list
export function getFinalist(data) {
  return request({
    url: '/finalist/page',
    method: 'get',
    params: data
  })
}

// 获取奖励-评选list
export function getAppraiseList(data) {
  return request({
    url: '/appraise/page',
    method: 'get',
    params: data
  })
}
// 奖励-评选-详情
export function getAppraiseDetails(data) {
  return request({
    url: '/appraise/' + data,
    method: 'get',
    loading: true
  })
}
// 获取-评选-详情-子详情
export function getSubmissionDetail(data) {
  return request({
    url: '/appraise/submission/detail',
    method: 'get',
    params: data
  })
}
// 获取奖励-申请list
export function getApplyList(data) {
  return request({
    url: '/apply/page',
    method: 'get',
    params: data
  })
}
// 奖励-申请Details
export function getApplyDetails(data) {
  return request({
    url: '/apply/' + data,
    method: 'get',
    loading: true
  })
}

// 奖励评选 -个人评分
export function appraiseGrade(data) {
  return request({
    url: '/appraise/grade',
    method: 'post',
    data: data,
    loading: true
  })
}

// 奖励评选-评分-提交
export function appraiseEvaluateSubmit(data) {
  return request({
    url: '/appraise/evaluate',
    method: 'post',
    data: data,
    loading: true
  })
}

// 奖励评选-评分-安委会确认
export function appraiseAffirmSubmit(data) {
  return request({
    url: '/appraise/affirm',
    method: 'post',
    data: data,
    loading: true
  })
}

// 奖励申请：审核、会签、批准
export function applyApprovalSubmit(data) {
  return request({
    url: '/apply/submit',
    method: 'post',
    data: data,
    loading: true
  })
}

// 提报发起详情
export function rewardSubmitsPonsorDetails(data) {
  return request({
    url: '/sponsor/' + data,
    method: 'get',
    loading: true
  })
}
// 计划逾期list
export function getPlanOverdueList(params) {
  return request({
    url: '/planManagement/expired',
    method: 'get',
    params: params,
    paramsSerializer: params => qs.stringify(params)
  })
}
// // 计划逾期详情
// export function getPlanOverdueDetails(data) {
//   return request({
//     url: '/submission/' + data,
//     method: 'get',
//     loading: true
//   })
// }

// 违规处罚list
export function getPunishInfoList(params) {
  return request({
    url: '/punishInfo/page',
    method: 'get',
    params: params,
    paramsSerializer: params => qs.stringify(params)
  })
}
// 违规处罚list-无权限控制
export function getPunishInfoList2(params) {
  return request({
    url: '/punishInfo/page2',
    method: 'get',
    params: params,
    paramsSerializer: params => qs.stringify(params)
  })
}
// 违规处罚Details
export function getPunishInfoDetails(data) {
  return request({
    url: '/punishInfo/' + data,
    method: 'get',
    loading: true
  })
}
// 违规处罚-作废
export function destroyPunish(data) {
  return request({
    url: '/punishInfo/destroy',
    method: 'post',
    data: data,
    loading: true
  })
}
// 违规处罚-审核
export function punishInfoAudit(data) {
  return request({
    url: '/punishInfo/audit',
    method: 'post',
    data: data,
    loading: true
  })
}

// 违规处罚-人员确认
export function punishInfoMemberAffirm(data) {
  return request({
    url: '/punishInfo/leaderAffirm',
    method: 'post',
    data: data,
    loading: true
  })
}
// 违规处罚-首席安全官批准
export function punishInfoSafetyAffirm(data) {
  return request({
    url: '/punishInfo/safetyAffirm',
    method: 'post',
    data: data,
    loading: true
  })
}

// 违规处罚-工会主席批准
export function punishInfoChairmanAffirm(data) {
  return request({
    url: '/punishInfo/chairmanAffirm',
    method: 'post',
    data: data,
    loading: true
  })
}
// 违规处罚-行政人事总监/安委会常任副主任/战略副总裁会签
export function punishInfoCountersign(data) {
  return request({
    url: '/punishInfo/countersign',
    method: 'post',
    data: data,
    loading: true
  })
}

// 违规处罚-驳回后提交
export function punishInfoResubmit(data) {
  return request({
    url: '/punishInfo/resubmit',
    method: 'post',
    data: data,
    loading: true
  })
}

// 违规情节list
export function getPunishDescriptionList() {
  return request({
    url: '/punish/descriptionList',
    method: 'get',
    loading: true
  })
}

// 根据员工id获取责任领导信息
export function getUserDutyLeader(data) {
  return request({
    url: '/user/leader',
    method: 'get',
    params: data,
    loading: true
  })
}

// 提交待阅任务-1
export function readLaunchPropose(taskId) {
  return request({
    url: `/sponsor/read/${taskId}`,
    method: 'put'
  })
}
