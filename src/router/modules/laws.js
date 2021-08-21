const lawsRouter = [
  {
    path: '/laws',
    name: 'laws',
    component: () => import('@/views/laws/index'),
    meta: { title: '法规与制度管理', key: 'security:law', clearAlive: true }
  },
  // 法律法规库
  {
    path: '/laws/library/list',
    name: 'LawsLibraryList',
    component: () => import('@/views/laws/library/list'),
    meta: { title: '法律法规库', key: 'security:law:statute', keepAlive: true }
  },
  {
    path: '/laws/library/details',
    name: 'LawsLibraryDetails',
    component: () => import('@/views/laws/library/details'),
    meta: { title: '详情', key: '' }
  },
  // 管理制度
  {
    path: '/laws/system/list',
    name: 'LawsSystemList',
    component: () => import('@/views/laws/system/list'),
    meta: { title: '管理制度', key: 'security:law:regime', keepAlive: true }
  },
  {
    path: '/laws/system/details',
    name: 'LawsSystemDetails',
    component: () => import('@/views/laws/system/details'),
    meta: { title: '详情', key: '' }
  },
  // 适用条款
  {
    path: '/laws/clause/list',
    name: 'LawsClauseList',
    component: () => import('@/views/laws/clause/list'),
    meta: { title: '适用条款', key: 'security:law:provision', keepAlive: true }
  },
  {
    path: '/laws/clause/details',
    name: 'LawsClauseDetails',
    component: () => import('@/views/laws/clause/details'),
    meta: { title: '详情', key: '' }
  },
  // 合规性评价记录
  {
    path: '/laws/evaluate/list',
    name: 'LawsEvaluateList',
    component: () => import('@/views/laws/evaluate/list'),
    meta: { title: '合规性评价记录', key: 'security:law:evaluationRecords', keepAlive: true }
  },
  {
    path: '/laws/evaluate/details',
    name: 'LawsEvaluateDetails',
    component: () => import('@/views/laws/evaluate/details'),
    meta: { title: '详情', key: '' }
  }
]
export default lawsRouter
