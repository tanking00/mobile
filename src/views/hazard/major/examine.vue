<!-- Created by Tanking. -->
<!-- 整改验收 -->
<template>
  <div class="container" :class="{ 'submit-button-height': taskId, 'container-supports': !taskId }">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="基础信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <BasicInfo :details="details"></BasicInfo>
        </van-collapse-item>
        <van-collapse-item name="2" title="隐患提报">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <ReportInfo :details="details"></ReportInfo>
        </van-collapse-item>
        <van-collapse-item name="3" title="提报部门审核">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <AssignDeptInfo :details="hazardMajorSub"></AssignDeptInfo>
        </van-collapse-item>
        <van-collapse-item name="4" title="整改责任部门审核">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('4') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">整改负责人</div>
            <div class="value1">{{ principal }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item name="5" title="制定整改方案">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('5') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">临时整改措施（重大隐患）</div>
            <div class="value1">{{ details.temporaryAction }}</div>
            <div class="label">临时整改措施完成时间</div>
            <div class="value1">{{ formatTimeStamp(details.temporaryFinishTime, 5) }}</div>
            <div class="label">整改方案</div>
            <div class="value1">{{ details.remediationAction }}</div>
            <div class="label">整改方案完成时间</div>
            <div class="value1">{{ formatTimeStamp(details.finishTime, 5) }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item name="6" title="安全部门审核">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('6') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">整改验收人</div>
            <div class="value1">{{ acceptor }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item name="7" title="隐患整改执行">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('7') >= 0"></CollapseIcon>
          </template>
          <ExecuteInfo :details="details"></ExecuteInfo>
        </van-collapse-item>
        <van-collapse-item v-if="recordList && recordList.length > 0" name="8" title="历史审批信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('8') >= 0"></CollapseIcon>
          </template>
          <ApprovalRecordInfo :recordList="recordList"></ApprovalRecordInfo>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton v-if="taskId">
      <SubmitButtonItem @click="showPanel1 = true" type="primary">退回</SubmitButtonItem>
      <!-- <SubmitButtonItem @click="showPanel2 = true">转办</SubmitButtonItem> -->
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
          @click="showPeopleSearchPanel = true"
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
    <SubmitPanel v-model="showPanel3" title="审批意见" buttonText="确认提交" :isLarge="true" @submit="onClickForm3">
      <van-form ref="form3" @failed="onFailedForm3" @submit="onSubmitForm3" :show-error-message="false">
        <van-field
          v-model="acceptor"
          name="整改验收人"
          label="整改验收人"
          placeholder="请选择"
          readonly
          input-align="right"
          size="large"
        />
        <div class="form-label-required">验收结果</div>
        <van-field
          v-model="form3.inspectResult"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写整改结果"
          show-word-limit
          class="form-textarea"
        />
        <div class="form-label">附件</div>
        <van-field name="images">
          <template #input>
            <UploadFile
              v-model="fileList"
              :maxCount="10"
              :maxSize="50"
              :accepts="['pdf', 'png', 'jpg']"
              tips="支持格式：png、jpg，pdf，50M以内"
            ></UploadFile>
          </template>
        </van-field>
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
import { getHazardMajorDetails, commitAcceptanceAcceptor } from '@/api/hazard'
import { BasicInfo, ReportInfo, ApprovalRecordInfo, AssignDeptInfo, ExecuteInfo } from '../components'
import { formatTimeStamp } from '@/utils/timeFormat'
import { Dialog, Toast } from 'vant'

export default {
  name: 'HazardMajorExamine',
  components: { BasicInfo, ReportInfo, ApprovalRecordInfo, AssignDeptInfo, ExecuteInfo },
  data() {
    return {
      activeNames: ['8'],
      stepActive: 9,
      steps: [
        { title: '隐患提报（已完成）', time: '' },
        { title: '提报部门审核（进行中）', time: '' },
        { title: '整改责任部门审核', time: '' },
        { title: '制定整改方案', time: '' },
        { title: '督办总监审核', time: '' },
        { title: '安全部门审核', time: '' },
        { title: '首席安全官审核', time: '' },
        { title: '隐患整改执行', time: '' },
        { title: '督办总监确认', time: '' },
        { title: '整改验收', time: '' },
        { title: '首席安全官确认', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      details: {},
      recordList: [],
      showPanel1: false, // 退回
      showPanel2: false, // 转办
      showPanel3: false, // 同意
      form1: { opinion: '' },
      form2: {
        nextUserId: '',
        nextUserName: '',
        opinion: ''
      },
      form3: {
        opinion: '',
        inspectResult: ''
      },
      fileList: [],
      showPeopleSearchPanel: false,
      principal: '', // 整改负责人
      acceptor: '', // 整改验收人
      hazardMajorSub: {} // 提报部门信息
    }
  },
  methods: {
    getDetails() {
      getHazardMajorDetails(this.hazardId, this.hazardSubId)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processCode
          this.recordList = data.hazardRecords
          this.principal = data.principal || ''
          this.acceptor = data.acceptor || ''
          data.hazardMajorSub.forEach(item => {
            if (item.id === this.hazardSubId) {
              this.hazardMajorSub = item
            }
          })
          const stepInfo1 = []
          const stepInfo2 = []
          const stepInfo3 = []
          const stepInfo4 = []
          const stepInfo5 = []
          const stepInfo6 = []
          const stepInfo7 = []
          const stepInfo8 = []
          const stepInfo9 = []
          data.hazardRecords.forEach(item => {
            if (item.nodeName === '隐患提报') {
              stepInfo1.push(item)
            }
            if (item.nodeName === '提报部门审核') {
              stepInfo2.push(item)
            }
            if (item.nodeName === '整改责任部门审核') {
              stepInfo3.push(item)
            }
            if (item.nodeName === '制定整改方案') {
              stepInfo4.push(item)
            }
            if (item.nodeName === '督办总监审核') {
              stepInfo5.push(item)
            }
            if (item.nodeName === '安全部门审核') {
              stepInfo6.push(item)
            }
            if (item.nodeName === '首席安全官审核') {
              stepInfo7.push(item)
            }
            if (item.nodeName === '隐患整改执行') {
              stepInfo8.push(item)
            }
            if (item.nodeName === '督办总监确认') {
              stepInfo9.push(item)
            }
          })
          this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
          this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].createdTime, 6) : ''
          this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].createdTime, 6) : ''
          this.steps[3].time = stepInfo4[0] ? formatTimeStamp(stepInfo4[0].createdTime, 6) : ''
          this.steps[4].time = stepInfo5[0] ? formatTimeStamp(stepInfo5[0].createdTime, 6) : ''
          this.steps[5].time = stepInfo6[0] ? formatTimeStamp(stepInfo6[0].createdTime, 6) : ''
          this.steps[6].time = stepInfo7[0] ? formatTimeStamp(stepInfo7[0].createdTime, 6) : ''
          this.steps[7].time = stepInfo8[0] ? formatTimeStamp(stepInfo8[0].createdTime, 6) : ''
          this.steps[8].time = stepInfo9[0] ? formatTimeStamp(stepInfo9[0].createdTime, 6) : ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选中转办人
    onSelect(data) {
      this.form2.nextUserName = data.name
      this.form2.nextUserId = data.id
    },
    // 退回
    onClickForm1() {
      this.$refs['form1'].submit()
    },
    onFailedForm1(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm1() {
      Dialog.confirm({
        message: '确认要退回审批？'
      })
        .then(() => {
          // on confirm
          const req = {
            action: 'SUBMIT_REJECT',
            hazardId: this.hazardId,
            hazardSubId: this.hazardSubId,
            taskId: this.taskId,
            opinion: this.form1.opinion,
            nextUserId: '',
            nextUserName: '',
            inspectResult: '',
            inspectFile: ''
          }
          commitAcceptanceAcceptor(req)
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
    // 转办
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      Dialog.confirm({
        message: '确认要转办审批？'
      })
        .then(() => {
          // on confirm
          const req = {
            action: 'SUBMIT_DELIVER',
            hazardId: this.hazardId,
            hazardSubId: this.hazardSubId,
            taskId: this.taskId,
            opinion: this.form2.opinion,
            nextUserId: this.form2.nextUserId,
            nextUserName: this.form2.nextUserName,
            inspectResult: '',
            inspectFile: ''
          }
          commitAcceptanceAcceptor(req)
            .then(res => {
              this.showPanel2 = false
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
          // on confirm
          const req = {
            action: 'SUBMIT_PASS',
            hazardId: this.hazardId,
            hazardSubId: this.hazardSubId,
            taskId: this.taskId,
            opinion: this.form3.opinion,
            nextUserId: '',
            nextUserName: '',
            inspectResult: this.form3.inspectResult,
            inspectFile: this.fileList.join(',')
          }
          commitAcceptanceAcceptor(req)
            .then(res => {
              this.showPanel3 = false
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
  },
  computed: {
    hazardId() {
      return this.$route.query.hazardId
    },
    hazardSubId() {
      return this.$route.query.hazardSubId
    },
    taskId() {
      return this.$route.query.taskId
    },
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
