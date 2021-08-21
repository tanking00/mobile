<!-- Created by Tanking. -->
<!-- 安全检查详情 -->
<template>
  <div class="container" :class="{ 'submit-button-height': taskId, 'container-supports': !taskId }">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="安全检查计划信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <PlanInfo :details="details"></PlanInfo>
        </van-collapse-item>
        <van-collapse-item v-if="details.items && details.items.length > 0" name="2" title="安全检查项信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <CheckItemInfo :details="details" :projectName="projectName"></CheckItemInfo>
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
    <!-- <SubmitButton v-if="taskId && schedule === '1'" @click="onClickSubmit" text="检查结果录入"></SubmitButton> -->
    <SubmitButton v-if="taskId && schedule === '1'">
      <SubmitButtonSpecial v-if="planId" @click="showPanel1 = true"></SubmitButtonSpecial>
      <SubmitButtonItem v-if="isCanDelete" @click="onClickDelete" type="gray">作废</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSubmit">检查结果录入</SubmitButtonItem>
    </SubmitButton>
    <SubmitButton v-if="taskId && schedule === '2'">
      <SubmitButtonSpecial @click="showPanel2 = true"></SubmitButtonSpecial>
      <SubmitButtonItem @click="showPanel3 = true" type="gray">退回</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel4 = true">同意</SubmitButtonItem>
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
    <SubmitPanel v-model="showPanel3" title="审批意见" buttonText="确认退回" @submit="onClickForm3">
      <van-form ref="form3" @failed="onFailedForm3" @submit="onSubmitForm3" :show-error-message="false">
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="form3.opinion"
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
  getSafetyCheckDetails,
  securityCheckPlanLeader,
  getProject,
  securityCheckPlanTurn,
  securityCheckPlanEnd
} from '@/api/safetyCheck'
import { getDictDataOfCode, getDictLabel } from '@/utils'
import { PlanInfo, CheckItemInfo, ExamineInfo } from '../components'
import { formatTimeStamp } from '@/utils/timeFormat'
import { Dialog, Toast } from 'vant'

export default {
  name: 'SafetyCheckCheckDetails',
  components: { PlanInfo, CheckItemInfo, ExamineInfo },
  data() {
    return {
      activeNames: [],
      stepActive: 0,
      steps: [
        { title: '检查信息录入（进行中）', time: '' },
        { title: '部门经理审核', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      schedule: 0,
      details: {},
      itemTypes: [],
      showPanel1: false, // 转办
      showPanel2: false, // 转办
      showPanel3: false, // 退回
      showPanel4: false, // 同意
      form1: {
        nextUserId: '',
        nextUserName: '',
        opinion: ''
      },
      form2: {
        nextUserId: '',
        nextUserName: '',
        opinion: ''
      },
      form3: { opinion: '' },
      form4: { opinion: '' },
      showPeopleSearchPanel: false,
      projectName: '', // 项目名称
      planId: '',
      // 是否可以作废
      isCanDelete: false
    }
  },
  methods: {
    getDetails() {
      getSafetyCheckDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processCode
          this.schedule = data.schedule
          this.planId = data.planId
          if (data.checkArea) {
            this.getProject(data.checkArea)
          }
          const stepInfo1 = []
          const stepInfo2 = []
          if (this.details.records && this.details.records.length > 0 && this.details.records[0]) {
            if (this.details.records[0].operation === '3') {
              this.isCanDelete = true
            }
          }
          this.details.records.forEach(item => {
            if (item.nodeName === '检查信息录入') {
              stepInfo1.push(item)
            }
            if (this.planId) {
              if (item.nodeName === '部门经理审核') {
                stepInfo2.push(item)
              }
            } else {
              if (item.nodeName === '部门经理审核') {
                stepInfo2.push(item)
              }
            }
          })
          switch (this.schedule) {
            case '1':
              this.stepActive = 0
              this.activeNames = ['1']
              if (this.planId) {
                this.steps[1].title = '部门经理审核'
              }
              break
            case '2':
              this.steps[0].title = '检查信息录入（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].approvalTime, 6) : ''
              this.steps[1].title = this.planId ? '部门经理审核（审核中）' : '部门经理审核（审核中）'
              this.stepActive = 1
              this.activeNames = ['2']
              break
            case '3':
              this.steps[0].title = '检查信息录入（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].approvalTime, 6) : ''
              this.steps[1].title = this.planId ? '部门经理审核（已完成）' : '部门经理审核（已完成）'
              this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo1[0].approvalTime, 6) : ''
              this.stepActive = 3
              this.activeNames = ['3']
              break
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickSubmit() {
      this.$router.push({
        path: '/safetyCheck/check/resultEntry',
        query: {
          id: this.id,
          taskId: this.taskId
        }
      })
    },
    onClickField() {
      this.showPeopleSearchPanel = true
    },
    onSelect(data) {
      this.form1.nextUserName = data.name
      this.form1.nextUserId = data.id
      this.form2.nextUserName = data.name
      this.form2.nextUserId = data.id
    },
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
          // on confirm
          let req = {
            id: this.id,
            taskId: this.taskId,
            operation: '3'
          }
          req = Object.assign(req, this.form1)
          securityCheckPlanTurn(req)
            .then(res => {
              this.showPanel1 = false
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
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
    onClickForm3() {
      this.$refs['form3'].submit()
    },
    onFailedForm3(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm3() {
      this.approval('确认要退回审批？', '2', this.form3)
    },
    onClickForm4() {
      this.$refs['form4'].submit()
    },
    onFailedForm4(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm4() {
      this.approval('确认要同意审批？', '1', this.form4)
    },
    approval(tips, operation, data) {
      Dialog.confirm({
        message: tips
      })
        .then(() => {
          // on confirm
          let req = {
            id: this.id,
            taskId: this.taskId,
            operation: operation
          }
          req = Object.assign(req, data)
          securityCheckPlanLeader(req)
            .then(res => {
              this.showPanel2 = false
              this.showPanel3 = false
              this.showPanel4 = false
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    getProject(projectNo) {
      if (!projectNo) {
        return
      }
      const req = {
        projectName: '',
        projectNo: projectNo
      }
      getProject(req)
        .then(res => {
          const { data } = res
          if (data && data[0]) {
            this.projectName = data[0].projectName
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 作废
    onClickDelete() {
      Dialog.confirm({
        message: '确认要作废吗？'
      })
        .then(() => {
          // on confirm
          const req = {
            planId: this.id,
            taskId: this.taskId
          }
          securityCheckPlanEnd(req)
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
  async created() {
    this.getDetails()
    this.itemTypes = await getDictDataOfCode('security_check_type')
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    taskId() {
      return this.$route.query.taskId
    },
    getDictLabel() {
      return getDictLabel
    },
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>
