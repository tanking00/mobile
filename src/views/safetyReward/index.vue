<!-- Created by Tanking. -->
<!-- 安全奖惩 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="default-function-list">
      <router-link :to="{ path: '/safetyReward/library' }">
        <div v-if="$checkPermission('basic:security:library')" class="item-wrapper">
          <van-icon name="bm-biaozhunku" />
          <span class="title">奖惩标准库</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyReward/library/rewardSubmitList' }">
        <div v-if="$checkPermission('basic:security:submission')" class="item-wrapper">
          <van-icon name="bm-jianglitibao" />
          <span class="title">安全奖励提报</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyReward/appraiseElect/rewardsAppraiseElect' }">
        <div v-if="$checkPermission('basic:security:selection')" class="item-wrapper">
          <van-icon name="bm-jianglipingxuan" />
          <span class="title">安全奖励评选</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyReward/punishesCases/punishesCasesList' }">
        <div v-if="$checkPermission('basic:security:violation')" class="item-wrapper">
          <van-icon name="bm-jianglipingxuan" />
          <span class="title">违规处罚信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyReward/overdueManage' }">
        <div v-if="$checkPermission('basic:security:overdue')" class="item-wrapper">
          <van-icon name="bm-jianglipingxuan" />
          <span class="title">工作逾期信息</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SafetyReward'
}
</script>
