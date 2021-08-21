<!-- Created by Tanking. -->
<!-- 安全检查信息 -->
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
        <van-dropdown-item v-model="type" title="检查类型" :options="typeOption" @change="onChange" />
        <van-dropdown-item v-model="isTrouble" title="是否隐患" :options="isTroubleOption" @change="onChange" />
        <DateRangeDropdownPicker title="检查日期" @change="onTimeChange"></DateRangeDropdownPicker>
        <van-dropdown-item v-model="status" title="流程状态" :options="statusOption" @change="onChange" />
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/safetyCheck/check/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-275">{{ item.checkName }}</span>
                <span
                  class="right margin-left-8"
                  :class="{
                    'color-red': judgeHasClass(item.status, ['1', '3']),
                    'color-green': judgeHasClass(item.status, '2'),
                    'color-orange': judgeHasClass(item.status, '4')
                  }"
                  >{{ safetyCheckStatus[item.status] }}</span
                >
                <span v-if="item.isTrouble === '1'" class="right color-blue">隐患</span>
              </div>
              <div class="color-text-secondary clearfix item-center">
                <span v-if="item.dutyPersonnelName" class="left ellipsis max-width-160">{{
                  `责任人：${item.dutyPersonnelName}`
                }}</span>
                <span v-if="item.dutyDeptName" class="right ellipsis max-width-160">{{
                  `责任部门：${item.dutyDeptName}`
                }}</span>
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left ellipsis max-width-160">{{
                  `检查类型：${getDictText(typeOption, item.checkType)}`
                }}</span>
                <span v-if="item.checkDate" class="right">{{ `检查日期：${formatTimeStamp(item.checkDate, 5)}` }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="SafetyCheckCheckList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getSafetyCheckList } from '@/api/safetyCheck'
import { getDropdownDataOfCode, getDictText, judgeHasClass } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
import { safetyCheckStatus } from '@/utils/enum'

export default {
  name: 'SafetyCheckCheckList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      type: '',
      typeOption: [],
      isTrouble: '',
      isTroubleOption: [
        { text: '全部', value: '' },
        { text: '是', value: '1' },
        { text: '否', value: '0' }
      ],
      status: '',
      statusOption: [
        { text: '全部', value: '' },
        { text: '进行中', value: '1' },
        { text: '已完成', value: '2' },
        { text: '已作废', value: '4' }
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
        checkName: this.name,
        checkType: this.type,
        isTrouble: this.isTrouble,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status
      }
      getSafetyCheckList(req)
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
    this.typeOption = await getDropdownDataOfCode('security_check_type')
  },
  computed: {
    getDictText() {
      return getDictText
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    safetyCheckStatus() {
      return safetyCheckStatus
    },
    judgeHasClass() {
      return judgeHasClass
    }
  }
}
</script>
