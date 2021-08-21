const userCenterRouter = [
  {
    path: '/userCenter',
    component: () => import('@/views/userCenter/index'),
    name: 'UserCenter',
    meta: { title: '个人中心', key: '' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/userCenter/about'),
    meta: { title: '关于', key: '' }
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('@/views/userCenter/agreement'),
    meta: { title: '隐私协议', key: '' }
  },
  {
    path: '/userCenter/qualifications',
    name: 'UserCenterQualifications',
    component: () => import('@/views/userCenter/qualifications'),
    meta: { title: '安全资质', key: '' }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/userCenter/test'),
    meta: { title: '调试', key: '' }
  },
  {
    path: '/testDetails',
    name: 'TestDetails',
    component: () => import('@/views/userCenter/testDetails'),
    meta: { title: '调试详情', key: '' }
  }
]
export default userCenterRouter
