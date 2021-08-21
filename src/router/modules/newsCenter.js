const newsCenterRouter = [
  {
    path: '/newsCenter',
    name: 'NewsCenter',
    component: () => import('@/views/newsCenter/index'),
    meta: { title: '消息中心', key: '' }
  },
  {
    path: '/newsCenter/details',
    name: 'NewsCenterDetails',
    component: () => import('@/views/newsCenter/details'),
    meta: { title: '详情', key: '' }
  }
]
export default newsCenterRouter
