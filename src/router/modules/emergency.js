const emergencyRouter = [
  {
    path: '/emergency',
    name: 'Emergency',
    component: () => import('@/views/emergency/index'),
    meta: { title: '应急管理', key: 'productionsafety:emergencyManage', clearAlive: true }
  },
  // 应急管理
  {
    path: '/emergency/emergencyWorkersList',
    name: 'EmergencyWorkersList',
    component: () => import('@/views/emergency/member/emergencyWorkersList'),
    meta: { title: '应急人员信息', key: 'productionsafety:emergencyManage:peopleList', keepAlive: true }
  },
  {
    path: '/emergency/emergencyWorkerDetails',
    name: 'EmergencyWorkerDetails',
    component: () => import('@/views/emergency/member/emergencyWorkerDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/emergency/emergencyFirstAidList',
    name: 'EmergencyFirstAidList',
    component: () => import('@/views/emergency/firstAid/emergencyFirstAidList'),
    meta: { title: '急救物资信息', key: 'productionsafety:suppliesManage:suppliesList', keepAlive: true }
  },
  {
    path: '/emergency/emergencyFirstAidDetails',
    name: 'EmergencyFirstAidDetails',
    component: () => import('@/views/emergency/firstAid/emergencyFirstAidDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/emergency/emergencyMaterialsList',
    name: 'EmergencyMaterialsList',
    component: () => import('@/views/emergency/materials/emergencyMaterialsList'),
    meta: { title: '应急物资信息', key: 'productionsafety:facilityManage:facilityList', keepAlive: true }
  },
  {
    path: '/emergency/emergencyMaterialsDetails',
    name: 'EmergencyMaterialsDetails',
    component: () => import('@/views/emergency/materials/emergencyMaterialsDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/emergency/emergencyPrePlanList',
    name: 'EmergencyPrePlanList',
    component: () => import('@/views/emergency/prePlan/emergencyPrePlanList'),
    meta: { title: '应急预案信息', key: 'productionsafety:planManage:planList', keepAlive: true }
  },
  {
    path: '/emergency/emergencyPrePlanDetails',
    name: 'EmergencyPrePlanDetails',
    component: () => import('@/views/emergency/prePlan/emergencyPrePlanDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/emergency/emergencyDrillList',
    name: 'EmergencyDrillList',
    component: () => import('@/views/emergency/drill/emergencyDrillList'),
    meta: { title: '应急演练信息', key: 'productionsafety:emergencyExercise:emergencyExerciseList', keepAlive: true }
  },
  {
    path: '/emergency/emergencyDrillDetails',
    name: 'EmergencyDrillDetails',
    component: () => import('@/views/emergency/drill/emergencyDrillDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/emergency/emergencyImplementDetails',
    name: 'EmergencyImplementDetails',
    component: () => import('@/views/emergency/drill/emergencyImplementDetails'),
    meta: { title: '实施情况综述', key: '' }
  },
  {
    path: '/emergency/emergencyDrillFormulateBegin',
    name: 'EmergencyDrillFormulateBegin',
    component: () => import('@/views/emergency/drill/emergencyDrillFormulateBegin'),
    meta: { title: '应急演练方案制定', key: '' }
  },
  {
    path: '/emergency/emergencyDrillFormulate',
    name: 'EmergencyDrillFormulate',
    component: () => import('@/views/emergency/drill/emergencyDrillFormulate'),
    meta: { title: '应急演练方案制定', key: '' }
  },
  {
    path: '/emergency/emergencyDrillDepApproval',
    name: 'EmergencyDrillDepApproval',
    component: () => import('@/views/emergency/drill/emergencyDrillDepApproval'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/emergency/emergencyDrillImplementBegin',
    name: 'EmergencyDrillImplementBegin',
    component: () => import('@/views/emergency/drill/emergencyDrillImplementBegin'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/emergency/emergencyDrillImplementEnter',
    name: 'EmergencyDrillImplementEnter',
    component: () => import('@/views/emergency/drill/emergencyDrillImplementEnter'),
    meta: { title: '实施情况综述', key: '' }
  }
]
export default emergencyRouter
