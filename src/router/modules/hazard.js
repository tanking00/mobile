const hazardRouter = [
  // 隐患台账
  {
    path: '/hazard',
    name: 'Hazard',
    component: () => import('@/views/hazard/index'),
    meta: { title: '隐患排查治理', key: 'basic:dangercatalog:dangerCheckList', keepAlive: true }
  },
  // 隐患提报
  {
    path: '/hazard/add',
    name: 'HazardAdd',
    component: () => import('@/views/hazard/add'),
    meta: { title: '隐患提报', key: '' }
  },
  // ----------------------一般隐患-----------------------------
  // 主流程详情
  {
    path: '/hazard/general/details',
    name: 'HazardGeneralDetails',
    component: () => import('@/views/hazard/general/details'),
    meta: { title: '详情', key: '' }
  },
  // 分支详情
  {
    path: '/hazard/general/branchDetails',
    name: 'HazardGeneralBranchDetails',
    component: () => import('@/views/hazard/general/branchDetails'),
    meta: { title: '详情', key: '' }
  },
  // 提报部门审核
  {
    path: '/hazard/general/assignDept',
    name: 'HazardGeneralAssignDept',
    component: () => import('@/views/hazard/general/assignDept'),
    meta: { title: '详情', key: '' }
  },
  // (退回)提报部门审核
  {
    path: '/hazard/general/assignDeptAgain',
    name: 'HazardGeneralAssignDeptAgain',
    component: () => import('@/views/hazard/general/assignDeptAgain'),
    meta: { title: '详情', key: '' }
  },
  // 整改责任部门审核
  {
    path: '/hazard/general/deptAudit',
    name: 'HazardGeneralDeptAudit',
    component: () => import('@/views/hazard/general/deptAudit'),
    meta: { title: '详情', key: '' }
  },
  // 制定整改方案
  {
    path: '/hazard/general/specifyPlan',
    name: 'HazardGeneralSpecifyPlan',
    component: () => import('@/views/hazard/general/specifyPlan'),
    meta: { title: '详情', key: '' }
  },
  // 安全部门审核
  {
    path: '/hazard/general/safeDeptAudit',
    name: 'HazardGeneralSafeDeptAudit',
    component: () => import('@/views/hazard/general/safeDeptAudit'),
    meta: { title: '详情', key: '' }
  },
  // 隐患整改执行
  {
    path: '/hazard/general/execute',
    name: 'HazardGeneralExecute',
    component: () => import('@/views/hazard/general/execute'),
    meta: { title: '详情', key: '' }
  },
  // 整改验收
  {
    path: '/hazard/general/examine',
    name: 'HazardGeneralExamine',
    component: () => import('@/views/hazard/general/examine'),
    meta: { title: '详情', key: '' }
  },
  // ----------------------重大隐患-----------------------------
  // 主流程详情
  {
    path: '/hazard/major/details',
    name: 'HazardMajorDetails',
    component: () => import('@/views/hazard/major/details'),
    meta: { title: '详情', key: '' }
  },
  // 分支详情
  {
    path: '/hazard/major/branchDetails',
    name: 'HazardMajorBranchDetails',
    component: () => import('@/views/hazard/major/branchDetails'),
    meta: { title: '详情', key: '' }
  },
  // 提报部门审核
  {
    path: '/hazard/major/assignDept',
    name: 'HazardMajorAssignDept',
    component: () => import('@/views/hazard/major/assignDept'),
    meta: { title: '详情', key: '' }
  },
  // (退回)提报部门审核
  {
    path: '/hazard/major/assignDeptAgain',
    name: 'HazardMajorAssignDeptAgain',
    component: () => import('@/views/hazard/major/assignDeptAgain'),
    meta: { title: '详情', key: '' }
  },
  // 整改责任部门审核
  {
    path: '/hazard/major/deptAudit',
    name: 'HazardMajorDeptAudit',
    component: () => import('@/views/hazard/major/deptAudit'),
    meta: { title: '详情', key: '' }
  },
  // 制定整改方案
  {
    path: '/hazard/major/specifyPlan',
    name: 'HazardMajorSpecifyPlan',
    component: () => import('@/views/hazard/major/specifyPlan'),
    meta: { title: '详情', key: '' }
  },
  // 督办总监审核
  {
    path: '/hazard/major/directorAudit',
    name: 'HazardMajorDirectorAudit',
    component: () => import('@/views/hazard/major/directorAudit'),
    meta: { title: '详情', key: '' }
  },
  // 安全部门审核
  {
    path: '/hazard/major/safeDeptAudit',
    name: 'HazardMajorSafeDeptAudit',
    component: () => import('@/views/hazard/major/safeDeptAudit'),
    meta: { title: '详情', key: '' }
  },
  // 首席安全官审核
  {
    path: '/hazard/major/csoAudit',
    name: 'HazardMajorCsoAudit',
    component: () => import('@/views/hazard/major/csoAudit'),
    meta: { title: '详情', key: '' }
  },
  // 隐患整改执行
  {
    path: '/hazard/major/execute',
    name: 'HazardMajorExecute',
    component: () => import('@/views/hazard/major/execute'),
    meta: { title: '详情', key: '' }
  },
  // 督办总监确认
  {
    path: '/hazard/major/directorConfirm',
    name: 'HazardMajorDirectorConfirm',
    component: () => import('@/views/hazard/major/directorConfirm'),
    meta: { title: '详情', key: '' }
  },
  // 整改验收
  {
    path: '/hazard/major/examine',
    name: 'HazardMajorExamine',
    component: () => import('@/views/hazard/major/examine'),
    meta: { title: '详情', key: '' }
  },
  // 首席安全官确认
  {
    path: '/hazard/major/csoConfirm',
    name: 'HazardMajorCsoConfirm',
    component: () => import('@/views/hazard/major/csoConfirm'),
    meta: { title: '详情', key: '' }
  }
]
export default hazardRouter
