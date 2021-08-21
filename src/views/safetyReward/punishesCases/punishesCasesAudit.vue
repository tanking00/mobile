<!-- 违规处罚-审核-->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <PunishesCasesDetailsView :details="details" :stepData="stepData"></PunishesCasesDetailsView>
    </div>
    <SubmitButton>
      <SubmitButtonItem @click="showPanel1 = true" type="danger">退回</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel2 = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel3 = true">同意</SubmitButtonItem>
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
          @click="onClickField(0)"
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
    <SubmitPanel v-model="showPanel3" title="审批意见" buttonText="确认同意" @submit="onClickForm3">
      <van-form ref="form3" @failed="onFailedForm3" @submit="onSubmitForm3" :show-error-message="false">
        <!-- <van-field
          v-model="form3.nextUserName"
          name="审批人员"
          label="审批人员"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="onClickField(1)"
          :rules="[{ required: true, message: '请选择审批人员人' }]"
        />
        <van-field
          v-model="form3.nextUserName2"
          name="会签人员"
          label="会签人员"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="onClickField(2)"
          :rules="[{ required: true, message: '请选择会签人员' }]"
        /> -->
        <div class="form-label">意见说明</div>
        <van-field
          v-model="form3.opinion"
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
import { PunishesCasesDetailsView } from './components'
import { Dialog, Toast } from 'vant'
import { getPunishInfoDetails, punishInfoAudit } from '@/api/safetyReward'
import { getLastNodeTimeString } from '../components'

export default {
  name: 'PunishesCasesAudit',
  components: { PunishesCasesDetailsView },
  data() {
    return {
      actives: ['1'],
      showPanel1: false,
      showPanel2: false,
      showPanel3: false,
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
        opinion: ''
        // nextUserName: '',
        // nextUserId: '',
        // nextUserName2: '',
        // nextUserId2: ''
      },

      details: {},
      stepData: {
        stepActive: 1,
        processCode: '',
        steps: [
          { title: '发起', time: '' },
          { title: '审核', time: '' },
          { title: '人员确认', time: '' },
          { title: '首席安全官批准', time: '' },
          { title: '工会主席批准', time: '' },
          { title: '行政人事总监会签', time: '' },
          { title: '安委会常务副主任会签', time: '' },
          { title: '战略副总裁会签', time: '' },
          { title: '结束', time: '' }
        ]
      },
      currentSelectType: '' // 0 转办人员选择，1 审批人员选择 2 会签人员选择
    }
  },
  methods: {
    getDetails() {
      getPunishInfoDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.stepData.processCode = data.processCode || ''
          this.stepData.stepActive = parseInt(data.schedule) - 1
          const nodes = this.details.records
          this.stepData.steps.forEach((item, index) => {
            if (index < this.stepData.stepActive) {
              item.time = getLastNodeTimeString(item.title, nodes)
              item.title = item.title + '（已完成）'
            } else if (index === this.stepData.stepActive) {
              if (item.title === '结束') {
                this.stepData.stepActive = this.stepData.steps.length + 1
              } else {
                item.title = item.title + '（进行中）'
              }
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickField(index) {
      this.currentSelectType = index
      this.showPeopleSearchPanel = true
    },
    // 退回提交
    onClickForm1() {
      this.$refs['form1'].submit()
    },
    onFailedForm1(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm1() {
      this.approval('确认要退回审批？', '3', this.form1)
    },
    // 转交提交
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      this.approval('确认要转办审批？', '4', this.form2)
    },
    // 同意提交
    onClickForm3() {
      this.$refs['form3'].submit()
    },
    onFailedForm3(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm3() {
      this.approval('确认要同意审批？', '2', this.form3)
    },
    // 选择转交人回调
    onSelect(data) {
      if (this.currentSelectType === 0) {
        this.form2.nextUserName = data.name
        this.form2.nextUserId = data.id
      } else if (this.currentSelectType === 1) {
        this.form3.nextUserName = data.name
        this.form3.nextUserId = data.id
      } else {
        this.form3.nextUserName2 = data.name
        this.form3.nextUserId2 = data.id
      }
    },
    approval(tips, operation, data) {
      Dialog.confirm({
        message: tips
      })
        .then(async () => {
          var params = {
            id: this.id,
            taskId: this.taskId,
            operation: operation, // 2、同意3、退回4、转办5、结束
            processCode: this.processCode,
            illegalStaffId: this.details.illegalStaffId,
            illegalStaffName: this.details.illegalStaffName,
            isRelevance: this.details.isRelevance,
            reportDeptId: this.details.reportDeptId,
            reportDeptName: this.details.reportDeptName,
            reportStaffCode: this.details.reportStaffCode,
            reportStaffId: this.details.reportStaffId,
            reportStaffName: this.details.reportStaffName,
            staffInfo: this.details.staffInfo,
            leaderInfo: this.details.leaderInfo,
            dutyLeaderId: this.details.dutyLeaderId,
            dutyLeaderName: this.details.dutyLeaderName,
            staffViolationLevelId: this.details.staffViolationLevelId,
            staffViolationLevelName: this.details.staffViolationLevelName,
            leaderViolationLevelId: this.details.leaderViolationLevelId,
            leaderViolationLevelName: this.details.leaderViolationLevelName,
            staffForm: this.details.staffForm,
            attachment: this.details.attachment
          }
          params = Object.assign(params, data)
          // console.log('params=', params)
          await punishInfoAudit(params)
          Toast('提交成功')
          this.$router.go(-1)
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.punishId
    },
    taskId() {
      return this.$route.query.taskId
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
