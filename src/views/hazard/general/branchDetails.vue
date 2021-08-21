<!-- Created by Tanking. -->
<!-- 子流程详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="基础信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <BasicInfo :details="hazardDetailsBO"></BasicInfo>
        </van-collapse-item>
        <van-collapse-item v-if="nodeIndex >= 1" name="2" title="隐患提报">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <ReportInfo :details="hazardDetailsBO"></ReportInfo>
        </van-collapse-item>
        <van-collapse-item v-if="nodeIndex >= 2" name="3" title="提报部门审核">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <AssignDeptInfo :details="generalSubprocessVo" isMajor="0"></AssignDeptInfo>
        </van-collapse-item>
        <van-collapse-item v-if="nodeIndex >= 3" name="4" title="整改责任部门审核">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('4') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">整改负责人</div>
            <div class="value1">{{ principal }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item v-if="nodeIndex >= 4" name="5" title="制定整改方案">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('5') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">整改方案</div>
            <div class="value1">{{ generalSubprocessVo.remediationAction }}</div>
            <div class="label">整改方案完成时间</div>
            <div class="value1">{{ formatTimeStamp(generalSubprocessVo.finishTime, 5) }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item v-if="nodeIndex >= 5" name="6" title="安全部门审核">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('6') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">整改验收人</div>
            <div class="value1">{{ acceptor }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item v-if="nodeIndex >= 6" name="7" title="隐患整改执行">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('7') >= 0"></CollapseIcon>
          </template>
          <ExecuteInfo :details="generalSubprocessVo"></ExecuteInfo>
        </van-collapse-item>
        <van-collapse-item v-if="nodeIndex >= 7" name="8" title="整改验收">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('8') >= 0"></CollapseIcon>
          </template>
          <ExamineInfo :details="generalSubprocessVo"></ExamineInfo>
        </van-collapse-item>
        <van-collapse-item v-if="recordList && recordList.length > 0" name="9" title="历史审批信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('9') >= 0"></CollapseIcon>
          </template>
          <ApprovalRecordInfo :recordList="recordList"></ApprovalRecordInfo>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
  </div>
</template>

<script>
import { getHazardGeneralDetails } from '@/api/hazard'
import { BasicInfo, ReportInfo, ApprovalRecordInfo, AssignDeptInfo, ExecuteInfo, ExamineInfo } from '../components'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'HazardGeneralBranchDetails',
  components: { BasicInfo, ReportInfo, ApprovalRecordInfo, AssignDeptInfo, ExecuteInfo, ExamineInfo },
  data() {
    return {
      activeNames: [],
      stepActive: 0,
      steps: [
        { title: '隐患提报', time: '' },
        { title: '提报部门审核', time: '' },
        { title: '整改责任部门审核', time: '' },
        { title: '制定整改方案', time: '' },
        { title: '安全部门审核', time: '' },
        { title: '隐患整改执行', time: '' },
        { title: '整改验收', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      details: {},
      hazardDetailsBO: {},
      recordList: [],
      generalSubprocessVo: {},
      principal: '', // 整改负责人
      acceptor: '', // 整改验收人
      nodeIndex: 0
    }
  },
  methods: {
    getDetails() {
      const req = {
        hazardId: this.hazardId,
        hazardSubId: this.hazardSubId
      }
      getHazardGeneralDetails(req)
        .then(res => {
          const { data } = res
          this.details = data
          this.recordList = data.recordList
          this.hazardDetailsBO = data.hazardDetailsVo.hazardDetailsBO
          this.processCode = data.hazardDetailsVo.hazardDetailsBO.processCode
          this.generalSubprocessVo = data.generalSubprocessVo
          this.nodeIndex = data.generalSubprocessVo.nodeIndex * 1
          this.principal = data.generalSubprocessVo.principal || ''
          this.acceptor = data.generalSubprocessVo.acceptor || ''
          const stepInfo1 = []
          const stepInfo2 = []
          const stepInfo3 = []
          const stepInfo4 = []
          const stepInfo5 = []
          const stepInfo6 = []
          const stepInfo7 = []
          data.recordList.forEach(item => {
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
            if (item.nodeName === '安全部门审核') {
              stepInfo5.push(item)
            }
            if (item.nodeName === '隐患整改执行') {
              stepInfo6.push(item)
            }
            if (item.nodeName === '整改验收') {
              stepInfo7.push(item)
            }
          })
          switch (data.generalSubprocessVo.nodeIndex) {
            case '0':
              this.activeNames.push('1')
              this.stepActive = 0
              this.steps[0].title = '隐患提报（进行中）'
              break
            case '1':
              this.activeNames.push('2')
              this.stepActive = 1
              this.steps[0].title = '隐患提报（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
              this.steps[1].title = '提报部门审核（进行中）'
              break
            case '2':
              this.activeNames.push('3')
              this.stepActive = 2
              this.steps[0].title = '隐患提报（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
              this.steps[1].title = '提报部门审核（已完成）'
              this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].createdTime, 6) : ''
              this.steps[2].title = '整改责任部门审核（进行中）'
              break
            case '3':
              this.activeNames.push('4')
              this.stepActive = 3
              this.steps[0].title = '隐患提报（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
              this.steps[1].title = '提报部门审核（已完成）'
              this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].createdTime, 6) : ''
              this.steps[2].title = '整改责任部门审核（已完成）'
              this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].createdTime, 6) : ''
              this.steps[3].title = '制定整改方案（进行中）'
              break
            case '4':
              this.activeNames.push('5')
              this.stepActive = 4
              this.steps[0].title = '隐患提报（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
              this.steps[1].title = '提报部门审核（已完成）'
              this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].createdTime, 6) : ''
              this.steps[2].title = '整改责任部门审核（已完成）'
              this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].createdTime, 6) : ''
              this.steps[3].title = '制定整改方案（已完成）'
              this.steps[3].time = stepInfo4[0] ? formatTimeStamp(stepInfo4[0].createdTime, 6) : ''
              this.steps[4].title = '安全部门审核（进行中）'
              break
            case '5':
              this.activeNames.push('6')
              this.stepActive = 5
              this.steps[0].title = '隐患提报（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
              this.steps[1].title = '提报部门审核（已完成）'
              this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].createdTime, 6) : ''
              this.steps[2].title = '整改责任部门审核（已完成）'
              this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].createdTime, 6) : ''
              this.steps[3].title = '制定整改方案（已完成）'
              this.steps[3].time = stepInfo4[0] ? formatTimeStamp(stepInfo4[0].createdTime, 6) : ''
              this.steps[4].title = '安全部门审核（已完成）'
              this.steps[4].time = stepInfo5[0] ? formatTimeStamp(stepInfo5[0].createdTime, 6) : ''
              this.steps[5].title = '隐患整改执行（进行中）'
              break
            case '6':
              this.activeNames.push('7')
              this.stepActive = 6
              this.steps[0].title = '隐患提报（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
              this.steps[1].title = '提报部门审核（已完成）'
              this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].createdTime, 6) : ''
              this.steps[2].title = '整改责任部门审核（已完成）'
              this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].createdTime, 6) : ''
              this.steps[3].title = '制定整改方案（已完成）'
              this.steps[3].time = stepInfo4[0] ? formatTimeStamp(stepInfo4[0].createdTime, 6) : ''
              this.steps[4].title = '安全部门审核（已完成）'
              this.steps[4].time = stepInfo5[0] ? formatTimeStamp(stepInfo5[0].createdTime, 6) : ''
              this.steps[5].title = '隐患整改执行（已完成）'
              this.steps[5].time = stepInfo6[0] ? formatTimeStamp(stepInfo6[0].createdTime, 6) : ''
              this.steps[6].title = '整改验收（进行中）'
              break
            case '7':
              this.activeNames.push('8')
              this.stepActive = 8
              this.steps[0].title = '隐患提报（已完成）'
              this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
              this.steps[1].title = '提报部门审核（已完成）'
              this.steps[1].time = stepInfo2[0] ? formatTimeStamp(stepInfo2[0].createdTime, 6) : ''
              this.steps[2].title = '整改责任部门审核（已完成）'
              this.steps[2].time = stepInfo3[0] ? formatTimeStamp(stepInfo3[0].createdTime, 6) : ''
              this.steps[3].title = '制定整改方案（已完成）'
              this.steps[3].time = stepInfo4[0] ? formatTimeStamp(stepInfo4[0].createdTime, 6) : ''
              this.steps[4].title = '安全部门审核（已完成）'
              this.steps[4].time = stepInfo5[0] ? formatTimeStamp(stepInfo5[0].createdTime, 6) : ''
              this.steps[5].title = '隐患整改执行（已完成）'
              this.steps[5].time = stepInfo6[0] ? formatTimeStamp(stepInfo6[0].createdTime, 6) : ''
              this.steps[6].title = '整改验收（已完成）'
              this.steps[6].time = stepInfo7[0] ? formatTimeStamp(stepInfo7[0].createdTime, 6) : ''
              break
          }
        })
        .catch(err => {
          console.log(err)
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
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
