<!-- 奖励评选-详情-子详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <RewardDetailsView :details="details"></RewardDetailsView>
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="评选信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="value1 targets">
            <table>
              <thead>
                <tr>
                  <td>评选人员</td>
                  <td>评分</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in details.grades" :key="index">
                  <td>{{ item.user }}</td>
                  <td>{{ item.grade }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { RewardDetailsView } from '../components'
import { getSubmissionDetail } from '@/api/safetyReward'

export default {
  name: 'RewardAppraiseElectSubDetails',
  components: { RewardDetailsView },
  data() {
    return {
      activeNames: ['1'],
      details: {
        list: []
      }
    }
  },
  methods: {
    getDetails() {
      const params = {
        appraiseId: this.appraiseId,
        submissionId: this.submissionId
      }
      getSubmissionDetail(params)
        .then(res => {
          const { data } = res
          this.details = data
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
    appraiseId() {
      return this.$route.query.appraiseId
    },
    submissionId() {
      return this.$route.query.submissionId
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
        // &:nth-of-type(1) {
        //   width: 68%;
        // }
        // &:nth-of-type(2) {
        //   width: 32%;
        // }
      }
    }
  }
}
</style>
