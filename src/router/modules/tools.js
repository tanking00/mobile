const toolsRouter = [
  {
    path: '/tools/pdf',
    name: 'Pdf',
    component: () => import('@/views/tools/pdf'),
    meta: { title: 'PDF预览' }
  },
  {
    path: '/tools/word',
    name: 'Word',
    component: () => import('@/views/tools/word'),
    meta: { title: 'Word预览' }
  },
  {
    path: '/tools/excel',
    name: 'Excel',
    component: () => import('@/views/tools/excel'),
    meta: { title: 'Excel预览' }
  }
]
export default toolsRouter
