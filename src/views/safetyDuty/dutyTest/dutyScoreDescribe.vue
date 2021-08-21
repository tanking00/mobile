<!-- 员工评分参考依据 -->
<template>
  <div class="container default-container-list2">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
      @click-right="showSearch = true"
    >
    </van-nav-bar>
    <div>
      <van-tabs v-model="tabActive" line-height="2px" :sticky="!showSearch" offset-top="50">
        <van-tab title="任务逾期信息">
          <TaskOverdueList v-model="showSearch" :userIds="userIds" ref="shortlisted"></TaskOverdueList>
        </van-tab>
        <van-tab title="计划逾期信息">
          <PlanOverdueList v-model="showSearch" :userIds="userIds"></PlanOverdueList>
        </van-tab>
        <van-tab title="违规处罚信息">
          <ViolationsList v-model="showSearch" :userIds="userIds"></ViolationsList>
        </van-tab>
      </van-tabs>
    </div>
    <!-- <div class="default-filterbar">
      <van-tabs v-model="tabActive" @click="tabClik">
        <van-tab title="任务逾期信息">
        </van-tab>
        <van-tab title="计划逾期信息">
        </van-tab>
        <van-tab title="违规处罚信息">
          <div class="default-list">
            <van-pull-refresh
              v-model="refreshing"
              @refresh="onRefresh"
              success-text="刷新成功"
              class="refresh-min-height-m"
            >
              <EmptyList
                v-if="isEmpty"
                :description="name ? '未搜到相关结果' : '暂无数据'"
                class="refresh-min-height-m"
              />
              <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <div v-for="item in list" :key="item.id" class="list-item">
                  <router-link to="">
                    <div class="clearfix item-top">
                      <span class="title left font-size-ml font-weight ellipsis">WGTB+年月日+4位编号</span>
                    </div>
                    <div class="label">责任人员：姓名（工号）</div>
                    <div class="label">违规分类：类型一</div>
                  </router-link>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div> -->
  </div>
</template>

<script>
import { TaskOverdueList, PlanOverdueList, ViolationsList } from './components'

export default {
  name: 'DutyScoreDescribe',
  components: { TaskOverdueList, PlanOverdueList, ViolationsList },

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

  computed: {
    userIds() {
      return this.$route.query.userIds
    }
  }
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
