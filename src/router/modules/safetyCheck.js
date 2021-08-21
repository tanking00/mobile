const safetyCheckRouter = [
  {
    path: '/safetyCheck',
    name: 'SafetyCheck',
    component: () => import('@/views/safetyCheck/index'),
    meta: { title: '安全检查', key: 'basic:check', clearAlive: true }
  },
  // 检查项信息库
  {
    path: '/safetyCheck/library/list',
    name: 'SafetyCheckLibraryList',
    component: () => import('@/views/safetyCheck/library/list'),
    meta: { title: '检查项信息库', key: 'basic:check:items', keepAlive: true }
  },
  {
    path: '/safetyCheck/library/details',
    name: 'SafetyCheckLibraryDetails',
    component: () => import('@/views/safetyCheck/library/details'),
    meta: { title: '详情', key: '' }
  },
  // 安全检查信息
  {
    path: '/safetyCheck/check/list',
    name: 'SafetyCheckCheckList',
    component: () => import('@/views/safetyCheck/check/list'),
    meta: { title: '安全检查信息', key: 'basic:check:info', keepAlive: true }
  },
  {
    path: '/safetyCheck/check/details',
    name: 'SafetyCheckCheckDetails',
    component: () => import('@/views/safetyCheck/check/details'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyCheck/check/resultEntry',
    name: 'SafetyCheckCheckResultEntry',
    component: () => import('@/views/safetyCheck/check/resultEntry'),
    meta: { title: '检查结果录入', key: '' }
  }
]
export default safetyCheckRouter
