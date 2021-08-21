const safetyDutyRouter = [
  {
    path: '/safetyDuty',
    name: 'SafetyDuty',
    component: () => import('@/views/safetyDuty/index'),
    meta: { title: '安全责任制', key: 'basic:duty', clearAlive: true }
  },
  {
    path: '/safetyDuty/templateList',
    name: 'TemplateList',
    component: () => import('@/views/safetyDuty/sign/templateList'),
    meta: { title: '责任书签署模板', key: 'basic:duty:template', keepAlive: true }
  },
  {
    path: '/safetyDuty/templateDetails',
    name: 'TemplateDetails',
    component: () => import('@/views/safetyDuty/sign/templateDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyDuty/staffing',
    name: 'Staffing',
    component: () => import('@/views/safetyDuty/sign/staffing'),
    meta: { title: '配置人员信息', key: '' }
  },
  {
    path: '/safetyDuty/dutySignList',
    name: 'DutySignList',
    component: () => import('@/views/safetyDuty/sign/dutySignList'),
    meta: { title: '责任书签署列表', key: 'basic:duty:sign', keepAlive: true }
  },
  {
    path: '/safetyDuty/dutySignDetails',
    name: 'DutySignDetails',
    component: () => import('@/views/safetyDuty/sign/dutySignDetails'),
    meta: { title: '详情', key: '' }
  },
  // 责任制考核
  {
    path: '/safetyDuty/dutyTest/dutyTestList',
    name: 'DutyTestList',
    component: () => import('@/views/safetyDuty/dutyTest/dutyTestList'),
    meta: { title: '责任制考核', key: 'basic:duty:assessSign', keepAlive: true }
  },
  {
    path: '/safetyDuty/dutyTest/dutyTestDetails',
    name: 'DutyTestDetails',
    component: () => import('@/views/safetyDuty/dutyTest/dutyTestDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyDuty/dutyTest/dutyTestTemplateList',
    name: 'DutyTestTemplateList',
    component: () => import('@/views/safetyDuty/dutyTest/dutyTestTemplateList'),
    meta: { title: '责任制考核模板', key: 'basic:duty:assess', keepAlive: true }
  },
  {
    path: '/safetyDuty/dutyTest/dutyTestTemplateDetails',
    name: 'DutyTestTemplateDetails',
    component: () => import('@/views/safetyDuty/dutyTest/dutyTestTemplateDetails'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyDuty/dutyTest/employeesSelfAssessmentBegin',
    name: 'EmployeesSelfAssessmentBegin',
    component: () => import('@/views/safetyDuty/dutyTest/employeesSelfAssessmentBegin'),
    meta: { title: '详情', key: '' }
  },
  {
    path: '/safetyDuty/dutyTest/employeesSelfAssessment',
    name: 'EmployeesSelfAssessment',
    component: () => import('@/views/safetyDuty/dutyTest/employeesSelfAssessment'),
    meta: { title: '考核评分', key: '', clearAlive: true }
  },
  {
    path: '/safetyDuty/dutyTest/leadershipRating',
    name: 'LeadershipRating',
    component: () => import('@/views/safetyDuty/dutyTest/leadershipRating'),
    meta: { title: '考核评分', key: '' }
  },
  {
    path: '/safetyDuty/dutyTest/dutyScoreDescribe',
    name: 'DutyScoreDescribe',
    component: () => import('@/views/safetyDuty/dutyTest/dutyScoreDescribe'),
    meta: { title: '员工评分参考依据', key: '' }
  },
  {
    path: '/safetyDuty/dutyTest/leadershipRatingToEmployees',
    name: 'LeadershipRatingToEmployees',
    component: () => import('@/views/safetyDuty/dutyTest/leadershipRatingToEmployees'),
    meta: { title: '考核评分', key: '', keepAlive: true }
  }
]
export default safetyDutyRouter
