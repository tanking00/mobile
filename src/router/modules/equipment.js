const equipmentRouter = [
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('@/views/equipment/index'),
    meta: { title: '设备设施管理', key: 'productionsafety:equipmentManagement', clearAlive: true }
  },
  // 检查表库
  {
    path: '/equipment/library/list',
    name: 'EquipmentLibraryList',
    component: () => import('@/views/equipment/library/list'),
    meta: { title: '检查表库', key: 'productionsafety:equipmentManagement:tallysheetlibrary', keepAlive: true }
  },
  {
    path: '/equipment/library/details',
    name: 'EquipmentLibraryDetails',
    component: () => import('@/views/equipment/library/details'),
    meta: { title: '详情', key: '' }
  },
  // 消防设施、特殊设备
  {
    path: '/equipment/equipment/fireList',
    name: 'EquipmentEquipmentFireList',
    component: () => import('@/views/equipment/equipment/fireList'),
    meta: {
      title: '消防设施信息',
      key: 'productionsafety:equipmentManagement:FireFightingFacilityList',
      keepAlive: true
    }
  },
  {
    path: '/equipment/equipment/specialList',
    name: 'EquipmentEquipmentSpecialList',
    component: () => import('@/views/equipment/equipment/specialList'),
    meta: {
      title: '特殊设备信息',
      key: 'productionsafety:equipmentManagement:specialequipmentInformationList',
      keepAlive: true
    }
  },
  {
    path: '/equipment/equipment/details',
    name: 'EquipmentEquipmentDetails',
    component: () => import('@/views/equipment/equipment/details'),
    meta: { title: '详情', key: '' }
  },
  // 维保、年度检查
  {
    path: '/equipment/maintenance/maintenanceList',
    name: 'EquipmentMaintenanceMaintenanceList',
    component: () => import('@/views/equipment/maintenance/maintenanceList'),
    meta: {
      title: '维保信息',
      key: 'productionsafety:equipmentManagement:maintenanceinformationList',
      keepAlive: true
    }
  },
  {
    path: '/equipment/maintenance/inspectList',
    name: 'EquipmentMaintenanceInspectList',
    component: () => import('@/views/equipment/maintenance/inspectList'),
    meta: {
      title: '年度检查',
      key: 'productionsafety:equipmentManagement:annualInspection',
      keepAlive: true
    }
  },
  {
    path: '/equipment/maintenance/details',
    name: 'EquipmentMaintenanceDetails',
    component: () => import('@/views/equipment/maintenance/details'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/equipment/maintenance/resultEntry',
    name: 'EquipmentMaintenanceResultEntry',
    component: () => import('@/views/equipment/maintenance/resultEntry'),
    meta: { title: '实施结果录入', key: '' }
  },
  // 点检
  {
    path: '/equipment/check/list',
    name: 'EquipmentCheckList',
    component: () => import('@/views/equipment/check/list'),
    meta: {
      title: '点检信息',
      key: 'productionsafety:equipmentManagement:checktheinformation',
      keepAlive: true
    }
  },
  {
    path: '/equipment/check/details',
    name: 'EquipmentCheckDetails',
    component: () => import('@/views/equipment/check/details'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/equipment/check/pointInfo',
    name: 'EquipmentCheckPointInfo',
    component: () => import('@/views/equipment/check/pointInfo'),
    meta: { title: '点位信息', key: '' }
  },
  {
    path: '/equipment/check/checkList',
    name: 'EquipmentCheckCheckList',
    component: () => import('@/views/equipment/check/checkList'),
    meta: { title: '检查清单', key: '' }
  }
]
export default equipmentRouter
