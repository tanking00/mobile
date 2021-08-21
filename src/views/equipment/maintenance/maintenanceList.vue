<!-- Created by Tanking. -->
<!-- 维保信息 -->
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
        <van-dropdown-item v-model="result" title="维保结果" :options="resultOption" @change="onChange" />
        <DateRangeDropdownPicker title="维保日期" @change="onTimeChange"></DateRangeDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/equipment/maintenance/details',
                query: {
                  id: item.id,
                  type: '1'
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-260">{{ item.facility }}</span>
                <span
                  class="right font-size-sm"
                  :class="{
                    'color-blue': judgeHasClass(item.result, '0'),
                    'color-red': judgeHasClass(item.result, '1')
                  }"
                >
                  {{ '1' === item.result ? '不合格' : '合格' }}
                </span>
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left ellipsis max-width-150">{{ `责任人员：${item.principal || ''}` }}</span>
                <span class="right">{{ `维保日期：${formatTimeStamp(item.date, 5)}` }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="EquipmentMaintenanceMaintenanceList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getMaintenanceList } from '@/api/equipment'
import { getDictText } from '@/utils'
import { judgeHasClass } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'EquipmentMaintenanceMaintenanceList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      startTime: '',
      endTime: '',
      result: '', // 状态
      resultOption: [
        { text: '全部', value: '' },
        { text: '合格', value: '0' },
        { text: '不合格', value: '1' }
      ],
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
    // 时间选择回调
    onTimeChange(startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.onChange()
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        type: '1',
        facility: this.name,
        result: this.result,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getMaintenanceList(req)
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
    onSearch(value) {
      this.name = value
      this.onChange()
    }
  },
  async created() {},
  computed: {
    getDictText() {
      return getDictText
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    }
  }
}
</script>
