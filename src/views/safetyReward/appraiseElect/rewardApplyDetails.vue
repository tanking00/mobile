<!-- 奖励申请-详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <ApplyDetailsView :details="details" :stepData="stepData"></ApplyDetailsView>
    </div>
  </div>
</template>

<script>
import { ApplyDetailsView } from './components'
import { getApplyDetails } from '@/api/safetyReward'
import { getLastNodeTimeString } from '../components'

export default {
  name: 'RewardApplyDetails',
  components: { ApplyDetailsView },
  data() {
    return {
      actives: ['1'],
      details: {},
      stepData: {
        stepActive: 0,
        processCode: '',
        steps: [
          { title: '申请', time: '' },
          { title: '审核', time: '' },
          { title: '会签', time: '' },
          { title: '批准', time: '' },
          { title: '结束', time: '' }
        ]
      }
    }
  },
  methods: {
    getDetails() {
      getApplyDetails(this.id)
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
    }
  },
  created() {
    this.getDetails()
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
</style>
