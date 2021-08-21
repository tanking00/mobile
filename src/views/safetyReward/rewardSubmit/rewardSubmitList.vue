<!-- 奖励提报列表 -->
<template>
  <div class="container default-container-list">
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
    <div class="default-filterbar">
      <van-dropdown-menu>
        <DateRangeDropdownPicker @change="onTimeChange"></DateRangeDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/safetyReward/library/rewardSubmitDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="title left font-size-ml font-weight ellipsis"> {{ item.processCode }}</span>
                <span v-if="item.status === '0'" class="right color-blue">进行中</span>
                <span v-else-if="item.status === '1'" class="right color-blue">已完成</span>
              </div>
              <div class="color-gray">提报部门：{{ item.submitDeptName }}</div>
              <div class="color-gray">业务分类：{{ item.categoryName }}</div>
              <div class="color-text-secondary clearfix">
                <span class="info left color-gray ">提报时间：{{ formatTimeStamp(item.createdTime, 1) }}</span>
                <span class="info right color-gray ">奖励对象：{{ item.awardObject }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <router-link
      :to="{
        path: '/safetyReward/library/rewardSubmitAdd'
      }"
    >
      <FloatButton></FloatButton>
    </router-link>

    <SearchPanel v-model="showSearch" name="RewardSubmitList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { FloatButton } from '@/components'
import { getSubmissionList } from '@/api/safetyReward'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getDictLabelOfCode } from '@/utils'
export default {
  name: 'RewardSubmitList',
  props: {},
  components: {
    FloatButton
  },
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      startTime: null,
      endTime: null,
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showSearch: false // 是否显示搜索面板
    }
  },
  methods: {
    onLoad() {
      this.loading = true
      this.getList()
    },
    onRefresh() {
      this.finished = false
      this.offset = 0
      this.onLoad()
    },
    onChange(value) {
      this.list = []
      this.offset = 0
      this.onLoad()
    },

    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        submitDeptName: this.name,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getSubmissionList(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }
          data.rows.forEach(element => {
            element.categoryName = ''
          })
          this.list = this.list.concat(data.rows || [])
          this.loading = false

          if (data.rows.length < this.limit || data.total <= this.limit) {
            this.finished = true
          } else {
            this.finished = false
          }
          if (data.total === 0) {
            this.isEmpty = true
          } else {
            this.isEmpty = false
          }
          this.list.forEach(async element => {
            element.categoryName = await getDictLabelOfCode('security_submission_category', element.category)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    onSearch(value) {
      this.name = value
      this.onChange()
    },
    // 时间选择回调
    onTimeChange(startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.onChange()
    }
  },
  async created() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.info {
  overflow: hidden; /** 隐藏超出的内容 **/
  word-break: break-all;
  text-overflow: ellipsis; /** 多行 **/
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2; /** 显示的行数 **/
}
</style>
