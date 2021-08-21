<!-- 违规处罚-详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <PunishesCasesDetailsView :details="details" :stepData="stepData"></PunishesCasesDetailsView>
    </div>
  </div>
</template>

<script>
import { PunishesCasesDetailsView } from './components'
import { getPunishInfoDetails } from '@/api/safetyReward'
import { getLastNodeTimeString } from '../components'

export default {
  name: 'RewardApplyDetails',
  components: { PunishesCasesDetailsView },
  data() {
    return {
      actives: ['1'],
      details: {},
      stepData: {
        stepActive: 0,
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
