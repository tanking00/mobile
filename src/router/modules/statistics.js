const statisticsRouter = {
  path: '/statistics',
  name: 'Statistics',
  component: () => import('@/views/statistics/index'),
  meta: { title: '数据中心', key: '' }
}
export default statisticsRouter
