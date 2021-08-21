<!-- Created by Tanking. -->
<!-- 计划实施详情 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="计划信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <PlanInfo :details="details" :planType="planType"></PlanInfo>
        </van-collapse-item>
      </van-collapse>
    </div>
    <SubmitButton>
      <SubmitButtonItem @click="showTransfer = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="onClickInput">实施结果录入</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showTransfer" title="审批意见" buttonText="确认转办" @submit="onClickFormTransfer">
      <van-form ref="form" @failed="onFailedFormTransfer" @submit="onSubmitFormTransfer" :show-error-message="false">
        <van-field
          v-model="nextUserName"
          name="转办处理人"
          label="转办处理人"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showSearchPeoplePanel = true"
          :rules="[{ required: true, message: '请选择转办处理人' }]"
        />
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="opinion"
          name="意见说明"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
          :rules="[{ required: true, message: '请填写意见说明' }]"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
    <SearchPeoplePanel v-model="showSearchPeoplePanel" @select="onSelect"></SearchPeoplePanel>
  </div>
</template>

<script>
import { PlanInfo } from './components'
import { getPlanDetails } from '@/api/plan'
import { Dialog, Toast } from 'vant'
import { getProcessNumber, submitImplement } from '@/api/equipment'
import { getProcessCode } from '@/api/global'
import { securityCheckPlanImplTurn } from '@/api/safetyCheck'

export default {
  name: 'PlanImplement',
  components: { PlanInfo },
  data() {
    return {
      activeNames: ['1'],
      details: {},
      showSearchPeoplePanel: false,
      showTransfer: false, // 转办
      processNumber: '', // 流程编号
      nextUserName: '', // 转办人
      nextUserId: '',
      opinion: '' // 意见
    }
  },
  methods: {
    // 生成流程编号
    getProcessNumber(type) {
      getProcessNumber(type)
        .then(res => {
          const { data } = res
          this.processNumber = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getProcessCode(moduleCode) {
      getProcessCode(moduleCode)
        .then(res => {
          const { data } = res
          this.processNumber = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDetails() {
      getPlanDetails(this.id, this.planType)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选人回调
    onSelect(data) {
      this.nextUserName = data.name
      this.nextUserId = data.id
    },
    // 实施
    onClickInput() {
      switch (this.planType) {
        case '设备维保':
          this.$router.push({
            path: '/equipment/maintenance/resultEntry',
            query: {
              planId: this.id,
              type: '1',
              deviceName: this.details.equipmentType,
              deviceId: this.details.deviceId
            }
          })
          break
        case '设备年度检查':
          this.$router.push({
            path: '/equipment/maintenance/resultEntry',
            query: {
              planId: this.id,
              type: '2',
              deviceName: this.details.equipmentType,
              deviceId: this.details.deviceId
            }
          })
          break
        case '安全检查':
          this.$router.push({
            path: '/safetyCheck/check/resultEntry',
            query: {
              planId: this.id
            }
          })
          break
      }
    },
    // 转办
    onClickFormTransfer() {
      this.$refs['form'].submit()
    },
    onFailedFormTransfer(info) {
      Toast(info.errors[0].message)
    },
    onSubmitFormTransfer() {
      Dialog.confirm({
        message: '确认要转办审批？'
      })
        .then(() => {
          switch (this.planType) {
            case '安全检查':
              this.submitSafetyCheck()
              break
            case '设备维保':
              this.submitMaintenance('1')
              break
            case '设备年度检查':
              this.submitMaintenance('2')
              break
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    // 转办维保、年度检查
    submitMaintenance(type) {
      const req = {
        type: type,
        operation: '4',
        nextUserName: this.nextUserName,
        nextUserId: this.nextUserId,
        opinion: this.opinion,
        maintenanceCheckInfo: {
          type: type,
          processCode: this.processNumber,
          planId: this.id
        }
      }
      console.log(req)
      submitImplement(req)
        .then(res => {
          this.$router.go(-2)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 转办安全检查
    submitSafetyCheck() {
      const checkPlanItems = []
      this.details.checkDTOList.forEach(item => {
        const temp = {
          isAccord: '',
          itemContent: item.itemContent,
          itemName: item.itemName,
          problemDescription: '',
          remark: '',
          troubleStatus: ''
        }
        checkPlanItems.push(temp)
      })
      const req = {
        additionalArea: '',
        checkArea: '',
        checkDate: null,
        checkName: this.details.planName,
        checkPlanItems: checkPlanItems,
        checkType: this.details.typeId,
        dutyDeptId: this.details.liableDeptId,
        dutyDeptName: this.details.liableDept,
        dutyPersonnelId: this.details.personLiableId,
        dutyPersonnelName: this.details.personLiable,
        executionTime: this.details.executeDate,
        id: '',
        makeDeptId: this.details.enactDeptId,
        makeDeptName: this.details.enactDept,
        makePersonnelId: this.details.enactPersonId,
        makePersonnelName: this.details.enactPerson,
        nextUserId: this.nextUserId,
        operation: '3',
        opinion: this.opinion,
        planId: this.id,
        processCode: this.processNumber,
        taskId: ''
      }
      console.log(req)
      securityCheckPlanImplTurn(req)
        .then(res => {
          this.$router.go(-2)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getDetails()
    if (this.planType === '设备维保') {
      this.getProcessNumber('0')
    }
    if (this.planType === '设备年度检查') {
      this.getProcessNumber('1')
    }
    if (this.planType === '安全检查') {
      this.getProcessCode('AQJC')
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    planType() {
      return this.$route.query.planType
    }
  }
}
</script>
