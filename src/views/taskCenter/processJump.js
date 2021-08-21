/**
 * Created by Tanking.
 * 流程跳转
 */

import router from '@/router'
import { Toast } from 'vant'
export function processJump(data, type) {
  const procDefId = data.procDefId.split(':')[0]
  console.log('procDefId=', procDefId)
  switch (procDefId) {
    case 'process-duty': // 责任书签署
      jumpProcessDuty(data, type)
      break
    case 'security-check-plan': // 检查计划
      jumpSecurityCheckPlan(data, type)
      break
    case 'maintenance-implement': // 维保实施
      jumpMaintenanceImplement(data, type)
      break
    case 'yearcheck-implement': // 年度检查实施
      jumpYearcheckImplementk(data, type)
      break
    case 'emergency': // 应急管理
      jumpEmergency(data, type)
      break
    case 'source-initiation': // 危险源辨识
      jumpSourceInitiation(data, type)
      break
    case 'duty_assess': // 责任制考核
      jumpDutyAssess(data, type)
      break
    case 'hazard': // 隐患排查
      jumpHazard(data, type)
      break
    case 'reward_submission': // 奖励提报
      jumpRewardSubmission(data, type)
      break
    case 'reward_appraise': // 奖励评选
      jumpRewardAppraise(data, type)
      break
    case 'reward-apply': // 奖励申请
      jumpRewardApply(data, type)
      break
    case 'reward_submit': // 提报发起-确认
      jumpRewardSubmit(data, type)
      break
    case 'reward_punish': // 违规处罚-审核
      jumpRewardPunish(data, type)
      break
  }
  function jumpRewardPunish(data, type) {
    var processVariables = data.processVariables
    processVariables.taskId = data.id
    var taskDefKey = data.taskDefKey
    processVariables.taskDefKey = taskDefKey
    if (type === 'upcoming') {
      if (taskDefKey === 'UserTask-confirrm') {
        // 违规人员确认
        router.push({
          path: '/safetyReward/punishesCases/punishesCasesMembersConfirm',
          query: processVariables
        })
      } else if (taskDefKey === 'UserTask-audit') {
        // 审核
        router.push({
          path: '/safetyReward/punishesCases/punishesCasesAudit',
          query: processVariables
        })
      } else if (taskDefKey === 'UserTask-safety' || taskDefKey === 'UserTask-chairman') {
        // 首席安全官批准/工会主席
        router.push({
          path: '/safetyReward/punishesCases/punishesCasesApproval',
          query: processVariables
        })
      } else if (
        taskDefKey === 'UserTask-hr' ||
        taskDefKey === 'UserTask-director' ||
        taskDefKey === 'UserTask-president'
      ) {
        // 行政人事总监、安委会总监、战略副总裁
        router.push({
          path: '/safetyReward/punishesCases/punishesCasesCountersign',
          query: processVariables
        })
      } else if (taskDefKey === 'UserTask-start') {
        // 退回后-重新发起

        router.push({
          path: '/safetyReward/punishesCases/punishesCasesReSubmit',
          query: processVariables
        })
      }
    } else {
      router.push({
        path: '/safetyReward/punishesCases/punishesCasesDetails',
        query: { id: processVariables.punishId }
      })
    }
  }
  // 提报发起
  function jumpRewardSubmit(data, type) {
    var processVariables = data.processVariables
    processVariables.taskId = data.id
    if (type === 'upcoming') {
      processVariables.isDone = false
    } else {
      processVariables.isDone = true
    }
    if (data.taskVariables.taskType === 'taskTypeToBeRead') {
      processVariables.taskTypeToBeRead = true
    }
    router.push({
      path: '/safetyReward/library/rewardSubmitInitiate',
      query: processVariables
    })
  }

  // 奖励申请
  function jumpRewardApply(data, type) {
    var processVariables = data.processVariables
    var taskDefKey = data.taskDefKey
    if (type === 'upcoming') {
      processVariables.taskId = data.id
      if (taskDefKey === 'UserTask-apply') {
        processVariables.isAuditBack = true // 申请-退回
        router.push({
          path: '/safetyReward/appraiseElect/rewardApplyAudit',
          query: processVariables
        })
      } else {
        router.push({
          path: '/safetyReward/appraiseElect/rewardApplyAudit',
          query: processVariables
        })
      }
    } else {
      router.push({
        path: '/safetyReward/appraiseElect/rewardApplyDetails',
        query: { id: processVariables.applyId }
      })
    }
  }

  // 奖励评选
  function jumpRewardAppraise(data, type) {
    var processVariables = data.processVariables
    var taskDefKey = data.taskDefKey
    if (type === 'upcoming') {
      processVariables.taskId = data.id
      if (taskDefKey === 'UserTask-appraise') {
        // 评选
        router.push({
          path: '/safetyReward/appraiseElect/rewardProcessForSelection',
          query: processVariables
        })
      } else if (taskDefKey === 'UserTask-audit') {
        // 安委会确认
        router.push({
          path: '/safetyReward/appraiseElect/rewardProcessForSelectionConfirm',
          query: processVariables
        })
      }
    } else {
      router.push({
        path: '/safetyReward/appraiseElect/rewardAppraiseElectDetails',
        query: { id: processVariables.appraiseId }
      })
    }
  }
  // 奖励提报
  function jumpRewardSubmission(data, type) {
    var processVariables = data.processVariables
    var taskDefKey = data.taskDefKey
    if (type === 'upcoming') {
      processVariables.taskId = data.id
      if (taskDefKey === 'UserTask-affirm') {
        // 安全确认
        router.push({
          path: '/safetyReward/library/rewardSubmitConfirmApproval',
          query: processVariables
        })
      } else if (taskDefKey === 'UserTask-audit') {
        // 安全初审
        router.push({
          path: '/safetyReward/library/rewardSubmitTrialApproval',
          query: processVariables
        })
      } else if (taskDefKey === 'UserTask-start') {
        // 被退回-提报再次发起
        router.push({
          path: '/safetyReward/library/rewardSubmitAdd',
          query: processVariables
        })
      }
    } else {
      router.push({
        path: '/safetyReward/library/rewardSubmitDetails',
        query: { id: processVariables.rewardId }
      })
    }
  }
  // 责任制考核
  function jumpDutyAssess(data, type) {
    var processVariables = data.processVariables
    var taskDefKey = data.taskDefKey
    if (type === 'upcoming') {
      processVariables.taskId = data.id
      processVariables.processCode = data.taskVariables.processCode
      if (taskDefKey === 'UserTask-employee-assess') {
        // 员工自评
        router.push({
          path: '/safetyDuty/dutyTest/employeesSelfAssessmentBegin',
          query: processVariables
        })
      } else if (taskDefKey === 'UserTask-leader-assess') {
        processVariables.showSyncDialog = false
        // 领导评分
        router.push({
          path: '/safetyDuty/dutyTest/leadershipRating',
          query: processVariables
        })
      }
    } else {
      router.push({
        path: '/safetyDuty/dutyTest/dutyTestDetails',
        query: {
          id: processVariables.assessId,
          code: processVariables.code,
          taskDefKey: taskDefKey
        }
      })
    }
  }
  // 责任书签署
  function jumpProcessDuty(data, type) {
    if (type === 'upcoming') {
      router.push({
        path: '/safetyDuty/dutySignDetails',
        query: {
          id: data.processVariables.sequenceNo || '',
          taskId: data.id,
          type: data.taskDefKey === 'UserTask-leader' ? '1' : '2'
        }
      })
    } else {
      router.push({
        path: '/safetyDuty/dutySignDetails',
        query: {
          id: data.processVariables.sequenceNo || '',
          type: data.taskDefKey === 'UserTask-leader' ? '1' : '2'
        }
      })
    }
  }
  // 检查计划
  function jumpSecurityCheckPlan(data, type) {
    if (type === 'upcoming') {
      router.push({
        path: '/safetyCheck/check/details',
        query: {
          id: data.processVariables.planId || '',
          taskId: data.id
        }
      })
    } else {
      router.push({
        path: '/safetyCheck/check/details',
        query: {
          id: data.processVariables.planId || ''
        }
      })
    }
  }
  // 维保实施
  function jumpMaintenanceImplement(data, type) {
    if (type === 'upcoming') {
      router.push({
        path: '/equipment/maintenance/details',
        query: {
          id: data.processVariables.maintenanceId || '',
          taskId: data.id,
          type: '1'
        }
      })
    } else {
      router.push({
        path: '/equipment/maintenance/details',
        query: {
          id: data.processVariables.maintenanceId || '',
          type: '1'
        }
      })
    }
  }
  // 年度检查实施
  function jumpYearcheckImplementk(data, type) {
    if (type === 'upcoming') {
      router.push({
        path: '/equipment/maintenance/details',
        query: {
          id: data.processVariables.maintenanceId || '',
          taskId: data.id,
          type: '2'
        }
      })
    } else {
      router.push({
        path: '/equipment/maintenance/details',
        query: {
          id: data.processVariables.maintenanceId || '',
          type: '2'
        }
      })
    }
  }
  // 应急管理
  function jumpEmergency(data, type) {
    // console.log("data.name=",data.name);
    if (type === 'upcoming') {
      switch (data.name) {
        case '直属领导审核':
          router.push({
            path: '/emergency/emergencyDrillDepApproval',
            query: {
              id: data.processVariables.planId,
              taskId: data.id,
              name: data.name,
              status: data.status,
              processCode: data.processVariables.processCode
            }
          })
          break
        case '安全部门审核':
          router.push({
            path: '/emergency/emergencyDrillDepApproval',
            query: {
              id: data.processVariables.planId,
              taskId: data.id,
              name: data.name,
              status: data.status,
              others: '',
              processCode: data.processVariables.processCode
            }
          })
          break
        case '实施情况综述':
          router.push({
            path: '/emergency/emergencyDrillImplementBegin',
            query: {
              id: data.processVariables.planId,
              taskId: data.id,
              name: data.name,
              status: data.status,
              others: '',
              processCode: data.processVariables.processCode
            }
          })
          break
        case '实施方案制定':
          router.push({
            path: '/emergency/emergencyDrillFormulateBegin',
            query: {
              id: data.processVariables.planId,
              taskId: data.id,
              name: data.name,
              status: data.status,
              others: ''
            }
          })
          break
        default:
          Toast('未知任务节点')
          break
      }
    } else {
      // console.log("111111111111");
      var params = {
        id: data.processVariables.planId,
        taskId: data.id,
        name: data.name,
        status: data.status,
        others: '1'
      }
      // console.log("2222222");
      if (type === 'toBeRead') {
        params.toBeRead = true
      }
      // console.log("3333");
      router.push({
        path: '/emergency/emergencyDrillDetails',
        query: params
      })
    }
  }
  // 危险源辨识
  function jumpSourceInitiation(data, type) {
    if (type === 'upcoming') {
      router.push({
        path: '/risk/identification/details',
        query: {
          id: data.processVariables.riskId || '',
          taskId: data.id
        }
      })
    } else {
      router.push({
        path: '/risk/identification/details',
        query: {
          id: data.processVariables.riskId || ''
        }
      })
    }
  }
  // 隐患排查
  function jumpHazard(data, type) {
    if (data.processVariables.isMajor === '0') {
      // 一般隐患
      if (type === 'upcoming') {
        let path = ''
        switch (data.taskDefKey) {
          case 'UserTask-Peril-Add': // 隐患提报
            path = '/hazard/add'
            break
          case 'UserTask-Assign-Dept': // 提报部门审核
            path = '/hazard/general/assignDept'
            break
          case 'UserTask-Assign-Dept2': // 提报部门审核(退回)
            path = '/hazard/general/assignDeptAgain'
            break
          case 'UserTask-Dept-Audit': // 整改责任部门审核
            path = '/hazard/general/deptAudit'
            break
          case 'UserTask-Specify-Plan': // 制定整改方案
            path = '/hazard/general/specifyPlan'
            break
          case 'UserTask-SafeDept-Audit': // 安全部门审核
            path = '/hazard/general/safeDeptAudit'
            break
          case 'UserTask-Peril-Execute': // 隐患整改执行
            path = '/hazard/general/execute'
            break
          case 'UserTask-Peril-Examine': // 整改验收
            path = '/hazard/general/examine'
            break
        }
        router.push({
          path: path,
          query: {
            hazardId: data.processVariables.hazardId,
            hazardSubId: data.taskVariables.hazardSubId,
            taskId: data.id
          }
        })
      } else {
        if (data.taskVariables.hazardSubId) {
          router.push({
            path: '/hazard/general/branchDetails',
            query: {
              hazardId: data.processVariables.hazardId,
              hazardSubId: data.taskVariables.hazardSubId
            }
          })
        } else {
          router.push({
            path: '/hazard/general/details',
            query: {
              hazardId: data.processVariables.hazardId
            }
          })
        }
      }
    } else {
      // 重大隐患
      if (type === 'upcoming') {
        let path = ''
        switch (data.name) {
          case '隐患提报': // 隐患提报
            path = '/hazard/add'
            break
          case '提报部门审核': // 提报部门审核
            if (data.taskVariables.reject) {
              path = '/hazard/major/assignDeptAgain'
            } else {
              path = '/hazard/major/assignDept'
            }
            break
          case '整改责任部门审核': // 整改责任部门审核
            path = '/hazard/major/deptAudit'
            break
          case '制定整改方案': // 制定整改方案
            path = '/hazard/major/specifyPlan'
            break
          case '督办总监审核': // 督办总监审核
            path = '/hazard/major/directorAudit'
            break
          case '安全部门审核': // 安全部门审核
            path = '/hazard/major/safeDeptAudit'
            break
          case '首席安全官审核': // 首席安全官审核
            path = '/hazard/major/csoAudit'
            break
          case '隐患整改执行': // 隐患整改执行
            path = '/hazard/major/execute'
            break
          case '督办总监确认': // 督办总监确认
            path = '/hazard/major/directorConfirm'
            break
          case '验收人验收': // 整改验收
            path = '/hazard/major/examine'
            break
          case '首席安全官确认': // 首席安全官确认
            path = '/hazard/major/csoConfirm'
            break
        }
        router.push({
          path: path,
          query: {
            hazardId: data.processVariables.hazardId,
            hazardSubId: data.taskVariables.hazardSubId,
            taskId: data.id
          }
        })
      } else if (type === 'toBeRead') {
        router.push({
          path: '/hazard/major/details',
          query: {
            hazardId: data.processVariables.hazardId,
            taskId: data.id
          }
        })
      } else {
        if (data.taskVariables.hazardSubId) {
          router.push({
            path: '/hazard/major/branchDetails',
            query: {
              hazardId: data.processVariables.hazardId,
              hazardSubId: data.taskVariables.hazardSubId
            }
          })
        } else {
          router.push({
            path: '/hazard/major/details',
            query: {
              hazardId: data.processVariables.hazardId
            }
          })
        }
      }
    }
  }
}
