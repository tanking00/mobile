const safetyRewardRouter = [
  {
    path: '/safetyReward',
    name: 'SafetyReward',
    component: () => import('@/views/safetyReward/index'),
    meta: { title: '安全奖惩', key: '', clearAlive: true }
  },
  {
    path: '/safetyReward/library',
    name: 'RewardsPunishmentsLibrary',
    component: () => import('@/views/safetyReward/library/rewardsPunishmentsLibrary'),
    meta: { title: '奖惩库', key: '', keepAlive: true }
  },
  {
    path: '/safetyReward/library/rewardStandardDetails',
    name: 'RewardStandardDetails',
    component: () => import('@/views/safetyReward/library/rewardStandardDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/library/punishmentStandardDetails',
    name: 'PunishmentStandardDetails',
    component: () => import('@/views/safetyReward/library/punishmentStandardDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/library/rewardSubmitList',
    name: 'RewardSubmitList',
    component: () => import('@/views/safetyReward/rewardSubmit/rewardSubmitList'),
    meta: { title: '安全奖励提报', key: '', keepAlive: true }
  },
  {
    path: '/safetyReward/library/rewardSubmitDetails',
    name: 'RewardSubmitDetails',
    component: () => import('@/views/safetyReward/rewardSubmit/rewardSubmitDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/library/rewardSubmitAdd',
    name: 'RewardSubmitAdd',
    component: () => import('@/views/safetyReward/rewardSubmit/rewardSubmitAdd'),
    meta: { title: '奖励提报', key: '', clearAlive: true }
  },
  {
    path: '/safetyReward/library/rewardSubmitInitiate',
    name: 'RewardSubmitInitiate',
    component: () => import('@/views/safetyReward/rewardSubmit/rewardSubmitInitiate'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/library/rewardSubmitTrialApproval',
    name: 'RewardSubmitTrialApproval',
    component: () => import('@/views/safetyReward/rewardSubmit/rewardSubmitTrialApproval'),
    meta: { title: '详情', key: '', clearAlive: true }
  },
  {
    path: '/safetyReward/library/rewardSubmitConfirmApproval',
    name: 'RewardSubmitConfirmApproval',
    component: () => import('@/views/safetyReward/rewardSubmit/rewardSubmitConfirmApproval'),
    meta: { title: '详情', key: '', clearAlive: true }
  },
  {
    path: '/safetyReward/appraiseElect/rewardsAppraiseElect',
    name: 'RewardsAppraiseElect',
    component: () => import('@/views/safetyReward/appraiseElect/rewardsAppraiseElect'),
    meta: { title: '安全奖励评选', key: '', keepAlive: true }
  },
  {
    path: '/safetyReward/appraiseElect/rewardAppraiseElectDetails',
    name: 'RewardAppraiseElectDetails',
    component: () => import('@/views/safetyReward/appraiseElect/rewardAppraiseElectDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/appraiseElect/rewardAppraiseElectSubDetails',
    name: 'RewardAppraiseElectSubDetails',
    component: () => import('@/views/safetyReward/appraiseElect/rewardAppraiseElectSubDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/appraiseElect/rewardApplyDetails',
    name: 'RewardApplyDetails',
    component: () => import('@/views/safetyReward/appraiseElect/rewardApplyDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/appraiseElect/rewardApplyAudit',
    name: 'RewardApplyAudit',
    component: () => import('@/views/safetyReward/appraiseElect/rewardApplyAudit'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/appraiseElect/rewardProcessForSelection',
    name: 'RewardProcessForSelection',
    component: () => import('@/views/safetyReward/appraiseElect/rewardProcessForSelection'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/appraiseElect/rewardProcessForSelectionScore',
    name: 'RewardProcessForSelectionScore',
    component: () => import('@/views/safetyReward/appraiseElect/rewardProcessForSelectionScore'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/appraiseElect/rewardProcessForSelectionConfirm',
    name: 'RewardProcessForSelectionConfirm',
    component: () => import('@/views/safetyReward/appraiseElect/rewardProcessForSelectionConfirm'),
    meta: { title: '详情', key: '' }
  },

  {
    path: '/safetyReward/punishesCases/punishesCasesList',
    name: 'PunishesCasesList',
    component: () => import('@/views/safetyReward/punishesCases/punishesCasesList'),
    meta: { title: '违规处罚信息', key: '' }
  },
  {
    path: '/safetyReward/punishesCases/punishesCasesDetails',
    name: 'PunishesCasesDetails',
    component: () => import('@/views/safetyReward/punishesCases/punishesCasesDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/punishesCases/punishesCasesAudit',
    name: 'PunishesCasesAudit',
    component: () => import('@/views/safetyReward/punishesCases/punishesCasesAudit'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/punishesCases/punishesCasesMembersConfirm',
    name: 'PunishesCasesMembersConfirm',
    component: () => import('@/views/safetyReward/punishesCases/punishesCasesMembersConfirm'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/punishesCases/punishesCasesApproval',
    name: 'PunishesCasesApproval',
    component: () => import('@/views/safetyReward/punishesCases/punishesCasesApproval'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/punishesCases/punishesCasesCountersign',
    name: 'PunishesCasesCountersign',
    component: () => import('@/views/safetyReward/punishesCases/punishesCasesCountersign'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyReward/punishesCases/punishesCasesReSubmit',
    name: 'PunishesCasesReSubmit',
    component: () => import('@/views/safetyReward/punishesCases/punishesCasesReSubmit'),
    meta: { title: '详情', key: '' }
  },

  {
    path: '/safetyReward/overdueManage',
    name: 'OverdueManage',
    component: () => import('@/views/safetyReward/overdueManage/overdueManage'),
    meta: { title: '工作逾期信息', key: '' }
  }
]
export default safetyRewardRouter
