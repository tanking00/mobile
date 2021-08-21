<!-- 违规处罚-违规人员确认-->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <PunishesCasesDetailsView :details="details" :stepData="stepData"></PunishesCasesDetailsView>
    </div>
    <SubmitButton>
      <SubmitButtonItem @click="showPanel1 = true">申诉</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel2 = true">同意</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showPanel1" title="审批意见" buttonText="确认申诉" @submit="onClickForm1">
      <van-form ref="form1" @failed="onFailedForm1" @submit="onSubmitForm1" :show-error-message="false">
        <div class="form-label-required">申诉说明</div>
        <van-field
          v-model="form1.opinion"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写申诉说明"
          :rules="[{ required: true, message: '请填写申诉说明' }]"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
    <SubmitPanel v-model="showPanel2" title="审批意见" buttonText="确认提交" @submit="onClickForm2">
      <van-form ref="form2" @failed="onFailedForm2" @submit="onSubmitForm2" :show-error-message="false">
        <div class="form-label">意见说明</div>
        <van-field
          v-model="form2.opinion"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
  </div>
</template>

<script>
import { PunishesCasesDetailsView } from './components'
import { Dialog, Toast } from 'vant'
import { getPunishInfoDetails, punishInfoMemberAffirm } from '@/api/safetyReward'
import { getLastNodeTimeString } from '../components'
export default {
  name: 'PunishesCasesMembersConfirm',
  components: { PunishesCasesDetailsView },
  data() {
    return {
      actives: ['1'],
      showPanel1: false,
      showPanel2: false,
      form1: {
        opinion: ''
      },
      form2: {
        opinion: ''
      },
      details: {},
      stepData: {
        stepActive: 2,
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
      }
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
    // 申诉提交
    onClickForm1() {
      this.$refs['form1'].submit()
    },
    onFailedForm1(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm1() {
      this.approval('确认要提交申诉？', '6', this.form1)
    },
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      this.approval('确认要同意审批？', '2', this.form2)
    },
    approval(tips, operation, data) {
      Dialog.confirm({
        message: tips
      })
        .then(async () => {
          var params = {
            id: this.id,
            taskId: this.taskId,
            operation: operation, // 2、同意6、申诉
            processCode: this.processCode
          }
          params = Object.assign(params, data)
          console.log('params=', params)
          await punishInfoMemberAffirm(params)
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
