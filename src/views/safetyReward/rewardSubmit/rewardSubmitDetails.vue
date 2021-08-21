<!-- 奖励提报详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <RewardDetailsView :details="details" :stepData="stepData"></RewardDetailsView>
    </div>
  </div>
</template>

<script>
import { RewardDetailsView, getLastNodeTimeString } from '../components'
import { getSubmissionDetails } from '@/api/safetyReward'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'RewardSubmitDetails',
  components: { RewardDetailsView },
  data() {
    return {
      actives: ['1'],
      details: {},
      stepData: {
        stepActive: 0,
        processCode: '',
        steps: [
          { title: '提报', time: '' },
          { title: '安全初审', time: '' },
          { title: '安全确认', time: '' },
          { title: '结束', time: '' }
        ]
      }
    }
  },
  methods: {
    getDetails() {
      getSubmissionDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.stepData.processCode = data.processCode || ''
          this.stepData.stepActive = parseInt(data.schedule) - 1
          const nodes = this.details.records
          this.stepData.steps.forEach((item, index) => {
            if (index < this.stepData.stepActive) {
              item.time = getLastNodeTimeString(item.title, nodes)
              if (this.details.status !== '3') {
                item.title = item.title + '（已完成）'
              }
            } else if (index === this.stepData.stepActive) {
              if (item.title === '结束') {
                this.stepData.stepActive = this.stepData.steps.length + 1
              } else {
                if (this.details.status !== '3') {
                  item.title = item.title + '（进行中）'
                }
              }
            }
          })
          if (this.details.status === '3') {
            this.stepData.steps[0].title = this.stepData.steps[0].title + '（已作废）'
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
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
