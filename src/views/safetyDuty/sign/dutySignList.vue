<!-- Created by Tanking. -->
<!-- 责任书签署列表 -->
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
        <van-dropdown-item ref="yearDropdown" v-model="year" title="签署年度">
          <van-picker
            ref="yearPicker"
            show-toolbar
            toolbar-position="bottom"
            cancel-button-text="重置"
            :default-index="yearDefaultIndex"
            :columns="yearOption"
            @confirm="onConfirmYear"
            @cancel="onCancelYear"
          />
        </van-dropdown-item>
        <van-dropdown-item v-model="status" title="流程状态" :options="statusOption" @change="onChange" />
        <DateRangeDropdownPicker @change="onTimeChange"></DateRangeDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/safetyDuty/dutySignDetails',
                query: {
                  id: item.id,
                  type: '3'
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-250">{{
                  item.annual + '年' + item.dutyName
                }}</span>
                <span
                  class="right"
                  :class="{
                    'color-blue': judgeHasClass(item.status, '0'),
                    'color-gray': judgeHasClass(item.status, '1')
                  }"
                  >{{ dutySignStatus[item.status] }}</span
                >
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left">{{ '责任领导：' + item.dutyLeaderName }}</span>
                <span class="right">{{ '责任人：' + item.dutyPersonnelName }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="DutySignList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getDutySignList } from '@/api/safetyDuty'
import { dutySignStatus } from '@/utils/enum'
import { judgeHasClass } from '@/utils'

export default {
  name: 'DutySignList',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      status: '', // 状态
      statusOption: [
        { text: '全部', value: '' },
        { text: '签署中', value: '0' },
        { text: '已签署', value: '1' }
      ],
      year: '', // 年度
      yearOption: [],
      yearDefaultIndex: 100, // 年份选择默认index
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
    // 初始化年
    initYear() {
      this.yearOption = []
      const year = new Date().getFullYear()
      const start = year + 100
      const end = year - 100
      for (let i = start; i > end; i--) {
        this.yearOption.push(i)
      }
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        annual: this.year,
        dutyName: this.name,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status
      }
      getDutySignList(req)
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
    onConfirmYear(value) {
      this.year = value
      this.$refs['yearDropdown'].toggle()
      this.onChange()
    },
    onCancelYear() {
      this.year = ''
      this.$refs['yearDropdown'].toggle()
      this.$refs['yearPicker'].setIndexes([this.yearDefaultIndex])
      this.onChange()
    },
    // 时间选择回调
    onTimeChange(startTime, endTime) {
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
    this.initYear()
  },
  computed: {
    dutySignStatus() {
      return dutySignStatus
    },
    judgeHasClass() {
      return judgeHasClass
    }
  }
}
</script>
