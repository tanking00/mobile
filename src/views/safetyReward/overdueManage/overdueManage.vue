<!-- 工作逾期信息 -->
<template>
  <div class="container default-container-list2">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
      @click-right="showSearch = true"
    >
      <template #right>
        <van-icon name="bm-systemSearch" class="icon-size-20" />
      </template>
    </van-nav-bar>
    <div>
      <van-tabs v-model="tabActive" line-height="2px" :sticky="!showSearch" offset-top="50">
        <van-tab title="任务逾期信息">
          <van-dropdown-menu class="menu">
            <van-dropdown-item v-model="taskProcess" title="任务状态" :options="processStates" @change="onChange" />
          </van-dropdown-menu>
          <TaskOverdueList v-model="showSearch" style="padding-top:48px" ref="shortlisted"></TaskOverdueList>
        </van-tab>
        <van-tab title="计划逾期信息">
          <van-dropdown-menu class="menu">
            <van-dropdown-item v-model="planProcess" title="任务状态" :options="processStates" @change="onChange" />
          </van-dropdown-menu>
          <PlanOverdueList style="padding-top:48px" v-model="showSearch"></PlanOverdueList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { TaskOverdueList, PlanOverdueList } from './components'

export default {
  name: 'RewardsAppraiseElect',
  components: { TaskOverdueList, PlanOverdueList },
  props: {},
  data() {
    return {
      tabActive: 0,
      showSearch: false, // 是否显示搜索面板
      businessCla: '',
      processStates: [
        { text: '全部', value: '' },
        { text: '进行中', value: '0' },
        { text: '已完成', value: '1' }
      ],
      taskProcess: '',
      planProcess: ''
    }
  },
  methods: {
    rightItemClik() {
      this.showSearch = true
    },

    onChange() {
      const params = {
        rewardObj: this.rewardObj,
        businessCla: this.businessCla
      }
      this.$refs.shortlisted.childAcceptValue(params)
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
