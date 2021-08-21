<!-- Created by Tanking. -->
<!-- 危险源辨识评价 -->
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
        <van-dropdown-item v-model="state" title="流程状态" :options="stateOption" @change="onChange" />
        <DateRangeDropdownPicker title="发起时间" @change="onTimeChange"></DateRangeDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/risk/identification/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight">{{ `评价部门：${item.evaluationDep}` }}</span>
                <span
                  class="right"
                  :class="{
                    'color-blue': judgeHasClass(item.processState, [1, 3]),
                    'color-gray': judgeHasClass(item.processState, 2)
                  }"
                  >{{ item.processState === 2 ? '已完成' : '进行中' }}</span
                >
              </div>
              <div class="color-text-secondary">
                {{ `完成期限：${formatTimeStamp(item.completionTime, 5)}` }}
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="RiskIdentificationList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getIdentifyList } from '@/api/risk'
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass, getDropdownDataOfCode } from '@/utils'
import { hazardAssessmentStatus } from '@/utils/enum'

export default {
  name: 'RiskIdentificationList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      state: '',
      stateOption: [
        { text: '全部', value: '' },
        { text: '进行中', value: 1 },
        { text: '已完成', value: 2 }
        // { text: '已超期', value: 3 }
      ],
      startTime: '',
      endTime: '',
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showSearch: false
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
    onChange() {
      this.list = []
      this.offset = 0
      this.onLoad()
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        evaluationDep: this.name,
        processState: this.state || null,
        startTime: this.startTime || null,
        endTime: this.endTime || null
      }
      getIdentifyList(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }

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
        })
        .catch(err => {
          console.log(err)
          if (this.refreshing) {
            this.refreshing = false
          }
        })
    },
    // 时间选择回调
    onTimeChange(startTime, endTime) {
      console.log(startTime)
      console.log(endTime)
      this.startTime = startTime
      this.endTime = endTime
      this.onChange()
    },
    onSearch(value) {
      this.name = value
      this.onChange()
    }
  },
  async created() {
    this.typeOption = await getDropdownDataOfCode('duty_safety_job')
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    hazardAssessmentStatus() {
      return hazardAssessmentStatus
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
