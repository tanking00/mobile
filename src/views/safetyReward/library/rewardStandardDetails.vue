<!-- 奖励标准详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="奖项信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">奖项名称</div>
          <div class="value1">{{ details.name }}</div>
          <div class="label">奖励标准</div>
          <div class="value1">
            {{ details.description }}
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getRewardStandardDetails } from '@/api/safetyReward'
import { formatTimeStamp } from '@/utils/timeFormat'
export default {
  name: 'RewardStandardDetails',
  props: {},
  data() {
    return {
      activeNames: ['1'],
      details: {}
    }
  },
  methods: {
    getDetails() {
      getRewardStandardDetails(this.id)
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
