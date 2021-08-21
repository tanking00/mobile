<!-- 应急演练信息 -list-->
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
        <van-dropdown-item v-model="exerciseType" title="演练形式" :options="exerciseTypeList" @change="onChange" />
        <van-dropdown-item v-model="status" title="演练状态" :options="statusList" @change="onChange" />
        <DateRangeDropdownPicker
          title="演练日期"
          @change="onTimeChange"
          :maxTime="beginMaxDate"
        ></DateRangeDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/emergency/emergencyDrillDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-250">{{ item.exercisePlan }}</span>
                <span
                  class="right"
                  :class="{
                    'color-blue': judgeHasClass(item.status, '10'),
                    'color-gray': judgeHasClass(item.status, '20'),
                    'color-red': judgeHasClass(item.status, '30'),
                    'color-gray': judgeHasClass(item.processId, '1')
                  }"
                  >{{ item.processId === '1' ? '已作废' : drillStatus[item.status] }}</span
                >
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left">演练形式：{{ item.exerciseType }}</span>
                <span class="right">演练日期：{{ formatTimeStamp(item.exerciseTime, 5) }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="emergencyDrillList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getEmergencyDrillList } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass } from '@/utils'
import { drillStatus } from '@/utils/enum'

export default {
  name: 'EmergencyDrillList',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '', // 演练名称
      exerciseType: '', // 演练形式
      beginMaxDate: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      exerciseTypeList: [
        { text: '全部', value: '' },
        { text: '桌面', value: '桌面' },
        { text: '实际', value: '实际' }
      ],
      status: '', // 演练状态
      statusList: [
        { text: '全部', value: '' },
        { text: '进行中', value: 10 },
        { text: '已完成', value: 20 },
        { text: '已超期', value: 30 }
      ],
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
    onChange() {
      this.list = []
      this.offset = 0
      this.onLoad()
    },
    onTimeChange(val) {},
    getList() {
      const params = {
        limit: this.limit,
        offset: this.offset,
        status: this.status,
        exerciseType: this.exerciseType,
        exercisePlan: this.name,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getEmergencyDrillList(params)
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
        })
    },
    onSearch(value) {
      this.name = value
      this.onChange()
    }
  },
  async created() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    drillStatus() {
      return drillStatus
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.avatar-border {
  width: 64px;
  height: 64px;
  overflow: hidden;
}
.safetyLeader {
  margin-top: 3px;
}
.safetyJob {
  margin-top: 3px;
  max-width: 218px;
}
</style>
