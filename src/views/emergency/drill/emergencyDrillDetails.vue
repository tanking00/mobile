<!-- 应急演练详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <DrillDetailScollapse
        :activeNames="activeNames"
        :planInfo="detailsData.planInfo"
        :implemenInfo="detailsData.implemenInfo"
        :auditList="detailsData.auditList"
        :reviewInfo="detailsData.reviewInfo"
      />
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton v-if="beRead" @click="onRead" position="fixed" text="已阅"></SubmitButton>
  </div>
</template>

<script>
import { getEmergencyDrillDetails, getEmergencyAuditLogging, readTask } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { DrillDetailScollapse } from '../components'
import { safetyCheckOperation } from '@/utils/enum'
import { emergencySetupProcess } from '@/utils'

export default {
  name: 'EmergencyDrillDetails',
  components: { DrillDetailScollapse },

  props: {},
  data() {
    return {
      activeNames: [],
      processCode: '',
      steps: [],
      stepActive: 0,
      details: {},
      detailsData: {
        planInfo: {
          // 应急演练计划信息
        },
        implemenInfo: {
          // 实施方案信息
        },
        auditList: [], // 审批数据
        reviewInfo: {
          // 实施情况综述
        }
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
    // 已阅
    async onRead() {
      await readTask({ taskId: this.taskId })
      // Toast('提交成功')
      this.$router.go(-1)
    }
  },
  created() {
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
    beRead() {
      return this.$route.query.toBeRead
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
