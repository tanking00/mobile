<!-- 奖励标准库 -->
<template>
  <div class="container default-container-list">
    <van-nav-bar left-arrow fixed @click-left="$router.go(-1)" @click-right="rightItemClik">
      <template #right>
        <van-icon name="bm-systemSearch" class="icon-size-20" />
      </template>
      <template #title>
        <van-tabs
          v-model="tabActive"
          line-width="60px"
          line-height="3px"
          background="unset"
          color="#00B9EF"
          title-inactive-color="white"
          title-active-color="white"
        >
          <van-tab title="奖励标准"> </van-tab>
          <van-tab title="处罚标准"> </van-tab>
        </van-tabs>
      </template>
    </van-nav-bar>
    <RewardStandardList v-model="showSearch" v-if="tabActive == 0"></RewardStandardList>
    <PunishmentStandardList v-model="showSearch" v-else-if="tabActive == 1"></PunishmentStandardList>
  </div>
</template>

<script>
import { PunishmentStandardList, RewardStandardList } from './components'

export default {
  name: 'RewardsPunishmentsLibrary',
  components: { PunishmentStandardList, RewardStandardList },
  props: {},
  data() {
    return {
      tabActive: 0,
      showSearch: false // 是否显示搜索面板
    }
  },
  methods: {
    rightItemClik() {
      this.showSearch = true
    }
  },
  async created() {},

  computed: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.list-item {
  .title {
    max-width: 248px;
  }
}
::v-deep .van-tab__text--ellipsis {
  font-size: 15px;
}
</style>
