<!-- 奖励评选 -->
<template>
  <div class="container default-container-list2">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
      @click-right="showSearch = true"
    >
      <template v-if="tabActive == 0" #right>
        <van-icon name="bm-systemSearch" class="icon-size-20" />
      </template>
    </van-nav-bar>
    <div>
      <van-tabs v-model="tabActive" line-height="2px" :sticky="!showSearch" offset-top="50">
        <van-tab title="奖励入围信息">
          <van-dropdown-menu class="menu">
            <van-dropdown-item v-model="businessCla" title="业务分类" :options="businessClasss" @change="onChange" />
            <van-dropdown-item v-model="rewardObj" title="奖励对象" :options="rewardObjects" @change="onChange" />
          </van-dropdown-menu>
          <RewardShortlistedList
            style="padding-top:48px"
            ref="shortlisted"
            v-model="showSearch"
          ></RewardShortlistedList>
        </van-tab>
        <van-tab title="奖励评选信息">
          <van-dropdown-menu class="menu">
            <van-dropdown-item v-model="process1" title="流程状态" :options="processStates" @change="onChange" />
          </van-dropdown-menu>
          <RewardAppraiseElectList
            style="padding-top:48px"
            ref="appraise"
            v-model="showSearch"
          ></RewardAppraiseElectList>
        </van-tab>
        <van-tab title="奖励申请信息">
          <van-dropdown-menu class="menu">
            <van-dropdown-item v-model="process2" title="流程状态" :options="processStates" @change="onChange" />
          </van-dropdown-menu>
          <RewardApplyList style="padding-top:48px" ref="apply" v-model="showSearch"></RewardApplyList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { RewardAppraiseElectList, RewardShortlistedList, RewardApplyList } from './components'
import { getDropdownDataOfCode } from '@/utils'

export default {
  name: 'RewardsAppraiseElect',
  components: { RewardAppraiseElectList, RewardShortlistedList, RewardApplyList },
  props: {},
  data() {
    return {
      tabActive: 0,
      showSearch: false, // 是否显示搜索面板
      rewardObjects: [
        { text: '全部', value: '' },
        { text: '个人', value: '个人' },
        { text: '团体', value: '团体' }
      ],
      rewardObj: '',
      businessClasss: [],
      businessCla: '',
      processStates: [
        { text: '全部', value: '' },
        { text: '进行中', value: '0' },
        { text: '已完成', value: '1' }
      ],
      process1: '',
      process2: ''
    }
  },
  methods: {
    rightItemClik() {
      this.showSearch = true
    },

    onChange() {
      if (this.tabActive === 0) {
        const params = {
          awardObject: this.rewardObj,
          category: this.businessCla
        }
        this.$refs.shortlisted.childAcceptValue(params)
      } else if (this.tabActive === 1) {
        const params = {
          status: this.process1
        }
        this.$refs.appraise.childAcceptValue(params)
      } else if (this.tabActive === 2) {
        const params = {
          status: this.process2
        }
        this.$refs.apply.childAcceptValue(params)
      }
    }
  },
  async created() {
    this.businessClasss = await getDropdownDataOfCode('security_submission_category', true)
  },

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

.default-container-list2 {
  padding-top: $navbar-height;
  height: 100%;
}

.default-container-list2 {
  padding-top: $navbar-height;
  height: 100%;
}
.menu {
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
