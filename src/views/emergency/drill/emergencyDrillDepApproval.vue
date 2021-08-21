<!-- 应急演练-部门经理审批 -->
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
      <SubmitButtonItem @click="showPanel1 = true" type="gray">退回</SubmitButtonItem>
      <SubmitButtonItem v-if="$route.query.name === '直属领导审核'" @click="showPanel2 = true">转办</SubmitButtonItem>
      <SubmitButtonItem v-if="$route.query.name === '安全部门审核'" @click="showPanel3 = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel4 = true">同意</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showPanel1" title="审批意见" buttonText="确认退回" @submit="onClickForm1">
      <van-form ref="form1" @failed="onFailedForm1" @submit="onSubmitForm1" :show-error-message="false">
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="form1.opinion"
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
    <SubmitPanel v-model="showPanel2" title="审批意见" buttonText="确认转办" @submit="onClickForm2">
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
    <SubmitPanel v-model="showPanel3" title="审批意见" buttonText="确认转办" @submit="onClickForm3">
      <van-form ref="form3" @failed="onFailedForm3" @submit="onSubmitForm3" :show-error-message="false">
        <van-field
          v-model="form3.nextUserName"
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
          v-model="form3.opinion"
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
    <SubmitPanel v-model="showPanel4" title="审批意见" buttonText="确认同意" @submit="onClickForm4">
      <van-form ref="form4" @failed="onFailedForm4" @submit="onSubmitForm4" :show-error-message="false">
        <div class="form-label">意见说明</div>
        <van-field
          v-model="form4.opinion"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
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
  emergencyManagerApprovak,
  emergencySafeManagerApprovak,
  getEmergencyAuditLogging
} from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { Dialog, Toast } from 'vant'
import { DrillDetailScollapse } from '../components'
import { safetyCheckOperation } from '@/utils/enum'
import { emergencySetupProcess } from '@/utils'

export default {
  name: 'EmergencyDrillDepApproval',
  components: { DrillDetailScollapse },

  props: {},
  data() {
    return {
      showPanel1: false, // 退回
      showPanel2: false, // 部门经理转办
      showPanel3: false, // 安全部转办
      showPanel4: false, // 同意
      showPeopleSearchPanel: false,
      form1: {
        opinion: ''
      },
      form2: {
        opinion: '',
        nextUserName: '',
        nextUserId: ''
      },
      form3: {
        opinion: '',
        nextUserName: '',
        nextUserId: ''
      },
      form4: {
        opinion: ''
      },
      activeNames: [],
      steps: [],
      stepActive: 0,
      details: {},
      detailsData: {
        planInfo: {
          // 应急演练计划信息
        },
        implemenInfo: {
          // 实施方案信息
        }
      },
      taskData: {}
    }
  },
  methods: {
    onClickField() {
      this.showPeopleSearchPanel = true
    },
    getDetails() {
      getEmergencyDrillDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.detailsData.planInfo = data
          this.detailsData.implemenInfo = data
          this.getEmergencyAuditList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取审批记录
    getEmergencyAuditList() {
      const params = {
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
    // 退回提交
    onClickForm1() {
      this.$refs['form1'].submit()
    },
    onFailedForm1(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm1() {
      this.approval('确认要退回审批？', '2', this.form1)
    },
    // 部门转交提交
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      this.approval('确认要转办审批？', '3', this.form2)
    },
    // 安全部转交提交
    onClickForm3() {
      this.$refs['form3'].submit()
    },
    onFailedForm3(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm3() {
      this.approval('确认要转办审批？', '3', this.form3)
    },
    // 同意提交
    onClickForm4() {
      this.$refs['form4'].submit()
    },
    onFailedForm4(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm4() {
      this.approval('确认要同意审批？', '1', this.form4)
    },
    // 选择转交人回调
    onSelect(data) {
      this.form3.nextUserName = data.name
      this.form3.nextUserId = data.id
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
            course: operation, // 1正常2驳回3转办
            processCode: this.processCode
          }
          params = Object.assign(params, data)
          console.log('params=', params)
          var name = this.$route.query.name
          if (name === '直属领导审核') {
            params.remark2 = params.opinion
            this.emergencyDepReq(params)
          } else if (name === '安全部门审核') {
            params.remark3 = params.opinion
            this.emergencySafeReq(params)
          } else {
            this.showPanel1 = false
            this.showPanel2 = false
            this.showPanel3 = false
            this.showPanel4 = false
            Toast('未知审批')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    // 直属领导审核
    emergencyDepReq(params) {
      emergencyManagerApprovak(params)
        .then(res => {
          this.showPanel1 = false
          this.showPanel2 = false
          this.showPanel3 = false
          this.showPanel4 = false
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 安全部主管审核req
    emergencySafeReq(params) {
      emergencySafeManagerApprovak(params)
        .then(res => {
          this.showPanel1 = false
          this.showPanel2 = false
          this.showPanel3 = false
          this.showPanel4 = false
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
    this.taskData = this.$route.query
    console.log('taskData=', this.taskData)
    this.getDetails()
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
    processCode() {
      return this.$route.query.processCode
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
