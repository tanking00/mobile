const planRouter = [
  {
    path: '/plan/list',
    name: 'PlanList',
    component: () => import('@/views/plan/list'),
    meta: { title: '计划管理', key: 'business:planManList', keepAlive: true }
  },
  {
    path: '/plan/details',
    name: 'PlanDetails',
    component: () => import('@/views/plan/details'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/plan/edit',
    name: 'PlanEdit',
    component: () => import('@/views/plan/edit'),
    meta: { title: '编辑', key: '' }
  },
  {
    path: '/plan/implement',
    name: 'PlanImplement',
    component: () => import('@/views/plan/implement'),
    meta: { title: '计划实施详情', key: '' }
  }
]
export default planRouter
