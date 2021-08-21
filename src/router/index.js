import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import toolsRouter from './modules/tools' // 工具
import userCenterRouter from './modules/userCenter' // 个人中心
import newsCenterRouter from './modules/newsCenter' // 消息中心
import safetyDutyRouter from './modules/safetyDuty' // 安全责任制
import lawsRouter from './modules/laws' // 法律法规
import riskRouter from './modules/risk' // 安全生产风险管理
import safetyCheckRouter from './modules/safetyCheck' // 安全检查
import equipmentRouter from './modules/equipment' // 设备设施管理
import emergencyRouter from './modules/emergency' // 应急管理
import planRouter from './modules/plan' // 计划管理
import hazardRouter from './modules/hazard' // 隐患排查
import safetyRewardRouter from './modules/safetyReward' // 安全奖惩
import safetyCaseRouter from './modules/safetyCase' // 国内外安全事件事故

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录' }
  },
  {
    path: '/oops',
    name: 'oops',
    component: () => import('@/views/login/oops'),
    meta: { title: '未登录' }
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/404'),
    meta: { title: '404' }
  },
  {
    path: '/401',
    name: 'Page401',
    component: () => import('@/views/401'),
    meta: { title: '401' }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index'),
    meta: { title: '首页', clearAlive: true }
  },
  {
    path: '/taskCenter',
    name: 'TaskCenter',
    component: () => import('@/views/taskCenter/index'),
    meta: { title: '任务中心' }
  },
  {
    path: '/workbench',
    name: 'Workbench',
    component: () => import('@/views/workbench/index'),
    meta: { title: '工作台', clearAlive: true }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/statistics/index'),
    meta: { title: '数据中心', clearAlive: true }
  },
  ...toolsRouter
]

// 根据环境判断是否需要密码登录页面
const loginPwdRouter = {
  path: '/loginPwd',
  name: 'LoginPwd',
  component: () => import('@/views/login/loginPwd'),
  meta: { title: '密码登录' }
}
if (process.env.VUE_APP_ENV !== 'production') {
  constantRoutes.push(loginPwdRouter)
}

export const asyncRoutes = [
  {
    path: '/safetyLibrary',
    name: 'SafetyLibrary',
    component: () => import('@/views/safetyLibrary/index'),
    meta: { title: '安全文库', key: 'security', clearAlive: true }
  },
  ...userCenterRouter,
  ...newsCenterRouter,
  ...safetyDutyRouter,
  ...safetyCaseRouter,
  ...lawsRouter,
  ...riskRouter,
  ...safetyCheckRouter,
  ...equipmentRouter,
  ...emergencyRouter,
  ...safetyRewardRouter,
  ...planRouter,
  ...hazardRouter,
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: { title: '404' }
  }
]

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
