<!-- 应急演练方案制定 -从任务计划--进入-->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <DrillDetailScollapse
        :activeNames="activeNames"
        :planInfo="detailsData.planInfo"
        :auditList="detailsData.auditList"
      />
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton>
      <SubmitButtonItem v-if="id && taskId" @click="invalidClik" type="danger">作废</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSubmit">应急演练方案制定</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showPanel" title="审批意见" buttonText="确认转办" @submit="onClickForm2">
      <van-form ref="form2" @failed="onFailedForm2" @submit="onSubmitForm2" :show-error-message="false">
        <van-field
          v-model="form2.nextUserName"
          name="转办处理人"
          label="转办处理人"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="onClickField"
          :rules="[{ required: true, message: '请选择转办处理人' }]"
        />
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="form2.opinion"
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
    <PeopleSearchPanel v-model="showPeopleSearchPanel" @select="onSelect"></PeopleSearchPanel>
  </div>
</template>

<script>
import {
  getEmergencyDrillDetails,
  getEmergencyAuditLogging,
  uploadEmergencyPlan,
  cancellationEmergency
} from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { DrillDetailScollapse } from '../components'
import { emergencySetupProcess } from '@/utils'
import { safetyCheckOperation } from '@/utils/enum'
import { getProcessCode } from '@/api/global'
import { Dialog, Toast } from 'vant'

export default {
  name: 'EmergencyDrillFormulateBegin',
  components: { DrillDetailScollapse },

  props: {},
  data() {
    return {
      form2: {
        opinion: '',
        nextUserName: '',
        nextUserId: ''
      },
      showPeopleSearchPanel: false,
      showPanel: false,
      activeNames: ['1'],
      processCode: '',
      steps: [],
      stepActive: 0,
      details: {},
      detailsData: {
        planInfo: {
          // 应急演练计划信息
        }
      }
    }
  },
  methods: {
    // 作废
    invalidClik() {
      Dialog.confirm({
        message: '确认要作废吗？'
      })
        .then(async () => {
          var params = {
            id: this.id,
            taskId: this.taskId
          }
          await cancellationEmergency(params)
          Toast('提交成功')
          this.$router.go(-1)
        })
        .catch(() => {
          // on cancel
        })
    },
    getDetails() {
      if (!this.id) {
        return
      }
      getEmergencyDrillDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.detailsData.planInfo = data
          this.processCode = this.details.processCode
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取审批记录
    getEmergencyAuditList() {
      if (!this.id) {
        return
      }
      const params = {
        id: this.id
      }
      getEmergencyAuditLogging(params)
        .then(res => {
          const { data } = res
          this.detailsData.auditList = data
          const obj = emergencySetupProcess(data)
          this.stepActive = obj.stepActive
          this.steps = obj.steps
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickSubmit() {
      let params = {}
      if (this.planManageData && this.planManageData.planManageId != null) {
        params = {
          planManageData: this.planManageData
        }
      } else {
        params = {
          details: this.details,
          id: this.id,
          taskId: this.taskId
        }
      }
      this.$router.push({
        path: '/emergency/emergencyDrillFormulate',
        query: params
      })
    },
    onClickField() {
      this.showPeopleSearchPanel = true
    },
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      this.approval('确认要转办审批？', '3', this.form2)
    },
    // 选择转交人回调
    onSelect(data) {
      this.form2.nextUserName = data.name
      this.form2.nextUserId = data.id
    },

    approval(tips, operation, data) {
      Dialog.confirm({
        message: tips
      })
        .then(async () => {
          var params = {
            id: this.id,
            taskId: this.taskId,
            course: operation, // 1正常2驳回3转办
            processCode: this.processCode
          }
          if (this.planManageData) {
            params = Object.assign(params, this.planManageData)
          }
          params = Object.assign(params, data)
          console.log('params=', params)
          // return
          await uploadEmergencyPlan(params)
          this.$router.go(-1)
          this.showPanel = false
          Toast('提交成功')
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  async created() {
    this.getDetails()
    if (this.planManageData && this.planManageData.planManageId) {
      this.steps = [
        { title: '实施方案制定（进行中）', time: '' },
        { title: '直属领导审核', time: '' },
        { title: '安全部审核', time: '' },
        { title: '实施情况综述', time: '' },
        { title: '流程结束', time: '' }
      ]
      this.detailsData.planInfo = this.planManageData
      if (!this.id) {
        const res = await getProcessCode('YJYL')
        this.processCode = res.data
        this.planManageData.processCode = res.data
      }
    } else {
      this.getEmergencyAuditList()
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    taskId() {
      return this.$route.query.taskId
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    safetyCheckOperation() {
      return safetyCheckOperation
    },
    planManageData() {
      const val1 = this.$route.query.planManageData
      if (val1) {
        return JSON.parse(val1)
      }
      return null
    },
    planManageId() {
      // 从计划管理进入
      return this.planManageData.planManageId
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
