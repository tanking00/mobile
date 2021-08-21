<!-- Created by Tanking. -->
<!-- 签署详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="安全责任书信息" :disabled="isTrue(taskId)">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <DutyBookInfo :details="details" hasYear></DutyBookInfo>
        </van-collapse-item>
        <van-collapse-item v-if="schedule > 1" name="2" title="责任领导签署" :disabled="isTrue(taskId)">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="dutyLeaderJob" class="value2">{{ dutyLeaderJob }}</div>
            <div v-if="dutyLeaderSignature" class="value2">{{ '姓名：' + dutyLeaderSignature }}</div>
            <div v-if="dutyLeaderSignatureDate" class="value2">{{ '日期：' + dutyLeaderSignatureDate }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item
          v-if="schedule > 2 && dutyPersonnelSignature"
          name="3"
          title="责任人签署"
          :disabled="isTrue(taskId)"
        >
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="dutyPersonnelJob" class="value2">{{ dutyPersonnelJob }}</div>
            <div v-if="dutyPersonnelSignature" class="value2">{{ '姓名：' + dutyPersonnelSignature }}</div>
            <div v-if="dutyPersonnelSignatureDate" class="value2">{{ '日期：' + dutyPersonnelSignatureDate }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item v-if="personJobAndName" name="4" title="责任人签署" :disabled="isTrue(taskId)">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('4') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="value2">
              {{ personJobAndName.join('、') }}
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton v-if="taskId" @click="onClickSubmit" position="relative" text="签署"></SubmitButton>
  </div>
</template>

<script>
import { getDutySignDetails, dutyLeaderSign, dutyPersonnelSign } from '@/api/safetyDuty'
import { Dialog, Toast } from 'vant'
import { formatTimeStamp } from '@/utils/timeFormat'
import { isTrue } from '@/utils'
import { DutyBookInfo } from '../components'

export default {
  name: 'DutySignDetails',
  components: { DutyBookInfo },
  data() {
    return {
      place: '无',
      taskId: '',
      activeNames: ['1', '2', '3', '4'],
      stepActive: 0,
      steps: [
        { title: '责任领导签署（签署中）', time: '' },
        { title: '责任人签署', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      details: {},
      schedule: '',
      dutyLeaderSignature: '',
      dutyLeaderJob: '',
      dutyLeaderSignatureDate: '',
      dutyPersonnelSignature: '',
      dutyPersonnelJob: '',
      dutyPersonnelSignatureDate: '',
      personJobAndName: ''
    }
  },
  methods: {
    getDetails() {
      getDutySignDetails(this.id, this.type)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processCode || ''
          this.schedule = data.schedule || '1'
          if (this.schedule === '3') {
            this.taskId = ''
          }
          this.dutyLeaderSignature = data.dutyLeaderSignature || ''
          this.dutyLeaderJob = data.dutyLeaderJob || ''
          this.dutyLeaderSignatureDate = data.dutyLeaderSignatureDate
            ? formatTimeStamp(data.dutyLeaderSignatureDate, 6)
            : ''
          this.dutyPersonnelSignature = data.dutyPersonnelSignature || ''
          this.dutyPersonnelJob = data.dutyPersonnelJob || ''
          this.dutyPersonnelSignatureDate = data.dutyPersonnelSignatureDate
            ? formatTimeStamp(data.dutyPersonnelSignatureDate, 6)
            : ''
          this.personJobAndName = data.personJobAndName
          switch (this.schedule) {
            case '1':
              this.stepActive = 0
              break
            case '2':
              this.steps[0].title = '责任领导签署（已签署）'
              this.steps[0].time = this.dutyLeaderSignatureDate
              this.steps[1].title = '责任人签署（签署中）'
              this.stepActive = 1
              break
            case '3':
              this.steps[0].title = '责任领导签署（已签署）'
              this.steps[0].time = this.dutyLeaderSignatureDate
              this.steps[1].title = '责任人签署（已签署）'
              this.steps[1].time = this.dutyPersonnelSignatureDate
              this.stepActive = 3
              break
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickSubmit() {
      Dialog.confirm({
        message: '确认要签署该责任书？'
      })
        .then(() => {
          // on confirm
          const req = {
            sequenceNo: this.id,
            taskId: this.taskId
          }
          if (this.schedule === '1') {
            dutyLeaderSign(req)
              .then(res => {
                this.taskId = ''
                this.getDetails()
              })
              .catch(err => {
                console.log(err)
              })
          } else if (this.schedule === '2') {
            dutyPersonnelSign(req)
              .then(res => {
                this.taskId = ''
                this.getDetails()
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            Toast('流程状态异常')
          }
        })
        .catch(() => {
          // on cancel
        })
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
    },
    type() {
      return this.$route.query.type
    },
    isTrue() {
      return isTrue
    }
  }
}
</script>
