const safetyCaseRouter = [
  {
    path: '/safetyCase',
    name: 'SafetyCase',
    component: () => import('@/views/safetyCase/index'),
    meta: { title: '国内外安全事件事故', key: 'business:accidentCase', keepAlive: true }
  },
  {
    path: '/safetyCase/details',
    name: 'SafetyCaseDetails',
    component: () => import('@/views/safetyCase/details'),
    meta: { title: '详情', key: '' }
  }
]
export default safetyCaseRouter
