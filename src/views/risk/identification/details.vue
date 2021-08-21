<!-- Created by Tanking. -->
<!-- 危险源辨识评价详情 -->
<template>
  <div class="container" :class="{ 'submit-button-height': taskId, 'container-supports': !taskId }">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="计划信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <PlanInfo :details="details"></PlanInfo>
        </van-collapse-item>
        <van-collapse-item name="2" title="危险源辨识评价信息" class="contain-collapse">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <IdentificationInfo :details="details" :taskId="taskId"></IdentificationInfo>
        </van-collapse-item>
        <van-collapse-item v-if="details.records && details.records.length > 0" name="3" title="历史审批信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <ExamineInfo :details="details"></ExamineInfo>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton v-if="taskId && schedule === '2'">
      <SubmitButtonItem @click="showPanel1 = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSubmit">提交</SubmitButtonItem>
    </SubmitButton>
    <SubmitButton v-if="taskId && schedule !== '2'">
      <SubmitButtonItem type="primary" @click="showPanel2 = true">退回</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel1 = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel3 = true">同意</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showPanel1" title="审批意见" buttonText="确认转办" @submit="onClickForm1">
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
          @click="showPeopleSearchPanel = true"
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
    <SubmitPanel v-model="showPanel2" title="审批意见" buttonText="确认退回" @submit="onClickForm2">
      <van-form ref="form2" @failed="onFailedForm2" @submit="onSubmitForm2" :show-error-message="false">
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="form2.opinion"
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
    <PeopleSearchPanel v-model="showPeopleSearchPanel" @select="onSelectNextUser"></PeopleSearchPanel>
  </div>
</template>

<script>
import { getIdentifyDetails, submitIdentifySource, deptAuditIdentify, safetyDeptAuditIdentify } from '@/api/risk'
import { PlanInfo, IdentificationInfo, ExamineInfo } from '../components'
import { Dialog, Toast } from 'vant'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'RiskIdentificationDetails',
  components: { PlanInfo, IdentificationInfo, ExamineInfo },
  data() {
    return {
      activeNames: [],
      stepActive: 0,
      steps: [
        { title: '计划发起（进行中）', time: '' },
        { title: '危险源辨识评价', time: '' },
        { title: '部门经理审核', time: '' },
        { title: '安全部审核', time: '' },
        { title: '流程结束', time: '' }
      ],
      taskId: '',
      processCode: '',
      schedule: '1',
      details: {},
      showPanel1: false, // 转办
      showPanel2: false, // 退回
      showPanel3: false, // 同意
      form1: {
        nextUserId: '',
        nextUserName: '',
        opinion: ''
      },
      form2: { opinion: '' },
      form3: { opinion: '' },
      showPeopleSearchPanel: false
    }
  },
  methods: {
    getDetails() {
      getIdentifyDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processNumber
          this.schedule = data.approvalStep
          const stepInfo1 = []
          const stepInfo2 = []
          const stepInfo3 = []
          const stepInfo4 = []
          data.records.forEach(item => {
            switch (item.nodeName) {
              case '责任方':
                stepInfo1.push(item)
                break
              case '执行危险源排查':
                stepInfo2.push(item)
                break
              case '部门经理审核':
                stepInfo3.push(item)
                break
              case '安全部门审核':
                stepInfo4.push(item)
                break
            }
          })
          // 责任方
          switch (data.approvalStep) {
            case '1':
              this.steps[0].title = '计划发起（进行中）'
              this.stepActive = 0
              this.activeNames = ['1']
              break
            case '2':
              this.steps[0].title = '计划发起（已完成）'
              if (stepInfo1.length > 0) {
                this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].approvalTime, 6) : ''
              }
              this.steps[1].title = '危险源辨识评价（进行中）'
              this.stepActive = 1
              this.activeNames = ['2']
              break
            case '3':
              this.steps[0].title = '计划发起（已完成）'
              if (stepInfo1.length > 0) {
                this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].approvalTime, 6) : ''
              }
              this.steps[1].title = '危险源辨识评价（已完成）'
              if (stepInfo2.length > 0) {
                this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].approvalTime, 6) : ''
              }
              this.steps[2].title = '部门经理审核（进行中）'
              this.stepActive = 2
              this.activeNames = ['2']
              break
            case '4':
              this.steps[0].title = '计划发起（已完成）'
              if (stepInfo1.length > 0) {
                this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].approvalTime, 6) : ''
              }
              this.steps[1].title = '危险源辨识评价（已完成）'
              if (stepInfo2.length > 0) {
                this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].approvalTime, 6) : ''
              }
              this.steps[2].title = '部门经理审核（已完成）'
              if (stepInfo3.length > 0) {
                this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].approvalTime, 6) : ''
              }
              this.steps[3].title = '安全部审核（进行中）'
              this.stepActive = 3
              this.activeNames = ['2']
              break
            case '5':
              this.steps[0].title = '计划发起（已完成）'
              if (stepInfo1.length > 0) {
                this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].approvalTime, 6) : ''
              }
              this.steps[1].title = '危险源辨识评价（已完成）'
              if (stepInfo2.length > 0) {
                this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].approvalTime, 6) : ''
              }
              this.steps[2].title = '部门经理审核（已完成）'
              if (stepInfo3.length > 0) {
                this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].approvalTime, 6) : ''
              }
              this.steps[3].title = '安全部审核（已完成）'
              if (stepInfo4.length > 0) {
                this.steps[3].time = stepInfo4[0] ? formatTimeStamp(stepInfo4[0].approvalTime, 6) : ''
              }
              this.stepActive = 5
              this.activeNames = ['3']
              break
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 提交辨识评价
    onClickSubmit() {
      let resIdx = ''
      const res = this.details.evaluatesVOS.some((item, index) => {
        if (!item.score) {
          resIdx = index
          return true
        } else {
          return false
        }
      })
      if (res) {
        console.log(resIdx)
        Toast('请进行危险源评价')
      } else {
        Dialog.confirm({
          message: '确认要提交吗？'
        })
          .then(() => {
            // on confirm
            const req = {
              assignee: '',
              assigneeName: '',
              operation: '0',
              operatorId: this.$store.getters.id,
              operatorName: this.$store.getters.name,
              opinion: '',
              processNumber: this.details.processNumber,
              riskId: this.id,
              taskId: this.taskId
            }
            submitIdentifySource(req)
              .then(res => {
                this.$router.go(-1)
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    // 转办
    onClickForm1() {
      this.$refs['form1'].submit()
    },
    onFailedForm1(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm1() {
      Dialog.confirm({
        message: '确认要转办审批？'
      })
        .then(() => {
          // // on confirm
          const req = {
            assignee: this.form1.nextUserId,
            assigneeName: this.form1.nextUserName,
            operation: '3',
            operatorId: this.$store.getters.id,
            operatorName: this.$store.getters.name,
            opinion: this.form1.opinion,
            processNumber: this.details.processNumber,
            riskId: this.id,
            taskId: this.taskId
          }
          console.log(req)
          switch (this.schedule) {
            case '2':
              submitIdentifySource(req)
                .then(res => {
                  this.$router.go(-1)
                })
                .catch(err => {
                  console.log(err)
                })
              break
            case '3':
              deptAuditIdentify(req)
                .then(res => {
                  this.$router.go(-1)
                })
                .catch(err => {
                  console.log(err)
                })
              break
            case '4':
              safetyDeptAuditIdentify(req)
                .then(res => {
                  this.$router.go(-1)
                })
                .catch(err => {
                  console.log(err)
                })
              break
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    // 退回
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      Dialog.confirm({
        message: '确认要退回审批？'
      })
        .then(() => {
          // // on confirm
          let approverId = ''
          let approverName = ''
          this.details.records.some(item => {
            if (item.operation !== '4') {
              approverId = item.approverId
              approverName = item.approverName
              return true
            } else {
              return false
            }
          })
          const req = {
            assignee: '',
            assigneeName: '',
            auditUserId: approverId,
            auditUserName: approverName,
            operation: '2',
            operatorId: this.$store.getters.id,
            operatorName: this.$store.getters.name,
            opinion: this.form2.opinion,
            processNumber: this.details.processNumber,
            riskId: this.id,
            taskId: this.taskId
          }
          console.log(req)
          switch (this.schedule) {
            case '3':
              deptAuditIdentify(req)
                .then(res => {
                  this.$router.go(-1)
                })
                .catch(err => {
                  console.log(err)
                })
              break
            case '4':
              safetyDeptAuditIdentify(req)
                .then(res => {
                  this.$router.go(-1)
                })
                .catch(err => {
                  console.log(err)
                })
              break
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    // 同意
    onClickForm3() {
      this.$refs['form3'].submit()
    },
    onFailedForm3(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm3() {
      Dialog.confirm({
        message: '确认要同意审批？'
      })
        .then(() => {
          // // on confirm
          const req = {
            assignee: '',
            assigneeName: '',
            operation: '1',
            operatorId: this.$store.getters.id,
            operatorName: this.$store.getters.name,
            opinion: this.form3.opinion,
            processNumber: this.details.processNumber,
            riskId: this.id,
            taskId: this.taskId
          }
          console.log(req)
          switch (this.schedule) {
            case '3':
              deptAuditIdentify(req)
                .then(res => {
                  this.$router.go(-1)
                })
                .catch(err => {
                  console.log(err)
                })
              break
            case '4':
              safetyDeptAuditIdentify(req)
                .then(res => {
                  this.$router.go(-1)
                })
                .catch(err => {
                  console.log(err)
                })
              break
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    onSelectNextUser(data) {
      this.form1.nextUserName = data.name
      this.form1.nextUserId = data.id
    }
  },
  created() {
    this.getDetails()
    if (this.$route.query.taskId) {
      this.taskId = this.$route.query.taskId
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.targets {
  table {
    border-radius: 4px;
    width: 100%;
    padding: 0;
    border-collapse: collapse;
    thead {
      tr {
        background: #f8f9fc;
      }
    }
    tbody {
      tr {
        background: $color-white;
        font-size: $font-size-sm;
        color: #666666;
      }
    }
    tr {
      text-align: center;
      width: 100%;
      line-height: 20px;
      vertical-align: middle;
      td {
        border: 1px solid #e8e8e8;
        text-align: center;
        min-height: 32px;
        padding: 6px 12px;
        &:nth-of-type(1) {
          width: 68%;
        }
        &:nth-of-type(2) {
          width: 32%;
        }
      }
    }
  }
}
.indexContent {
  font-size: $font-size-sm !important;
  line-height: 20px !important;
}
</style>
