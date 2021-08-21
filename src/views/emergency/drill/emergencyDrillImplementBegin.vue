<!-- 实施情况综述 -(从任务-进入)-->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <DrillDetailScollapse
        :activeNames="activeNames"
        :planInfo="detailsData.planInfo"
        :implemenInfo="detailsData.implemenInfo"
        :auditList="detailsData.auditList"
      />
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton>
      <SubmitButtonItem @click="showPanel = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="goEnter">实施情况综述</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showPanel" title="审批意见" buttonText="确认转办" @submit="onClickForm1">
      <van-form ref="form1" @failed="onFailedForm1" @submit="onSubmitForm1" :show-error-message="false">
        <van-field
          v-model="form1.nextUserName"
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
          v-model="form1.opinion"
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
import { Dialog, Toast } from 'vant'
import { DrillDetailScollapse } from '../components'
import { getEmergencyDrillDetails, getEmergencyAuditLogging, entryImplement } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { safetyCheckOperation } from '@/utils/enum'
import { emergencySetupProcess } from '@/utils'

export default {
  name: 'DutyTestDetails',
  components: { DrillDetailScollapse },
  data() {
    return {
      activeNames: [],
      stepActive: 0,
      steps: [],
      processCode: '',
      form1: {
        opinion: '',
        nextUserName: ''
      },
      showPanel: false,
      showPeopleSearchPanel: false,
      detailsData: {
        planInfo: {
          // 应急演练计划信息
        },
        implemenInfo: {
          // 实施方案信息
        },
        auditList: []
      }
    }
  },
  methods: {
    getDetails() {
      getEmergencyDrillDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processCode || ''
          this.detailsData.planInfo = this.details
          this.detailsData.implemenInfo = this.details
          this.detailsData.reviewInfo = this.details
          this.getEmergencyAuditList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取审批记录
    getEmergencyAuditList() {
      var params = {
        id: this.id
      }
      getEmergencyAuditLogging(params)
        .then(res => {
          const { data } = res
          this.detailsData.auditList = data
          const isInv = this.details.processId === '1'
          const obj = emergencySetupProcess(data, isInv)
          this.stepActive = obj.stepActive
          this.steps = obj.steps
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickField() {
      this.showPeopleSearchPanel = true
    },
    goEnter() {
      const params = Object.assign(this.$route.query, { exercisePlan: this.details.exercisePlan })
      this.$router.push({
        path: '/emergency/emergencyDrillImplementEnter',
        query: params
      })
    },
    // 转交提交
    onClickForm1() {
      this.$refs['form1'].submit()
    },
    onFailedForm1(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm1() {
      this.approval('确认要转办审批？', '3', this.form1)
    },
    // 选择转交人回调
    onSelect(data) {
      this.form1.nextUserName = data.name
      this.form1.nextUserId = data.id
      this.form2.nextUserName = data.name
      this.form2.nextUserId = data.id
    },
    approval(tips, operation, data) {
      Dialog.confirm({
        message: tips
      })
        .then(() => {
          var params = {
            id: this.id,
            taskId: this.taskId,
            course: operation // 1正常2驳回3转办
          }
          params = Object.assign(params, data)
          params.remark4 = params.opinion
          // console.log('params=', params)
          this.entryImplementReq(params)
        })
        .catch(() => {
          // on cancel
        })
    },
    entryImplementReq(params) {
      entryImplement(params)
        .then(res => {
          this.showPanel = false
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    if (!this.id) {
      Toast('演练ID为空！')
      this.$route.go(-1)
      return
    }
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    safetyCheckOperation() {
      return safetyCheckOperation
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    taskId() {
      return this.$route.query.taskId
    }
  }
}
</script>
