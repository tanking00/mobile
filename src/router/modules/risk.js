const riskRouter = [
  {
    path: '/risk',
    name: 'risk',
    component: () => import('@/views/risk/index'),
    meta: { title: '安全生产风险管理', key: '', clearAlive: true }
  },
  // 危险源辨识库
  {
    path: '/risk/library/list',
    name: 'RiskLibraryList',
    component: () => import('@/views/risk/library/list'),
    meta: { title: '危险源辨识库', key: 'productionsafety:prodSafety:hazardAssessmentBank', keepAlive: true }
  },
  {
    path: '/risk/library/details',
    name: 'RiskLibraryDetails',
    component: () => import('@/views/risk/library/details'),
    meta: { title: '详情', key: '' }
  },
  // 危险源评价
  {
    path: '/risk/evaluate/list',
    name: 'RiskEvaluateList',
    component: () => import('@/views/risk/evaluate/list'),
    meta: { title: '危险源评价与控制', key: 'productionsafety:prodSafety:hazardIdentification', keepAlive: true }
  },
  {
    path: '/risk/evaluate/details',
    name: 'RiskEvaluateDetails',
    component: () => import('@/views/risk/evaluate/details'),
    meta: { title: '详情', key: '' }
  },
  // 危险源辨识评价
  {
    path: '/risk/identification/list',
    name: 'RiskIdentificationList',
    component: () => import('@/views/risk/identification/list'),
    meta: {
      title: '危险源辨识评价',
      key: 'productionsafety:prodSafety:hazardAssessmentIdentification',
      keepAlive: true
    }
  },
  {
    path: '/risk/identification/details',
    name: 'RiskIdentificationDetails',
    component: () => import('@/views/risk/identification/details'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/risk/identification/infoEntry',
    name: 'RiskIdentificationInfoEntry',
    component: () => import('@/views/risk/identification/infoEntry'),
    meta: { title: '详情', key: '' }
  }
]
export default riskRouter
