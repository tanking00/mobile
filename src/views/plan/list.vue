<!-- Created by Tanking. -->
<!-- 计划管理 -->
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
        <van-dropdown-item v-model="type" title="计划类型" :options="typeOption" @change="onChange" />
        <DeptDropdownPicker title="责任部门" @change="onChangeDept"></DeptDropdownPicker>
        <DateDropdownPicker title="计划年月" type="year-month" @change="onChangeMonth"></DateDropdownPicker>
        <van-dropdown-item v-model="status" title="计划状态" :options="statusOption" @change="onChange" />
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/plan/details',
                query: {
                  id: item.id,
                  planType: item.planType
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-270">{{ item.planName }}</span>
                <span
                  class="right margin-left-8"
                  :class="{
                    'color-orange': judgeHasClass(item.status, '1'),
                    'color-green': judgeHasClass(item.status, '2'),
                    'color-red': judgeHasClass(item.status, '3')
                  }"
                  >{{ planStatus[item.status] }}</span
                >
                <span class="right color-blue">{{ item.planType }}</span>
              </div>
              <div class="color-text-secondary clearfix">
                <span v-if="item.personLiable" class="left ellipsis max-width-160">{{
                  `责任人员：${item.personLiable}`
                }}</span>
                <span v-if="item.liableDept" class="right ellipsis max-width-160">{{
                  `责任部门：${item.liableDept}`
                }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="PlanList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getPlanList } from '@/api/plan'
import { planStatus } from '@/utils/enum'
import { judgeHasClass } from '@/utils'
import { formatTime } from '@/utils/timeFormat'

export default {
  name: 'PlanList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '', // 计划名称
      type: '', // 计划类型
      typeOption: [
        { text: '全部', value: '' },
        { text: '应急演练', value: '应急演练' },
        { text: '安全检查', value: '安全检查' },
        { text: '设备维保', value: '设备维保' },
        { text: '设备年度检查', value: '设备年度检查' },
        { text: '设备点检', value: '设备点检' }
      ],
      status: '',
      statusOption: [
        { text: '全部', value: '' },
        { text: '未完成', value: '1' },
        { text: '已完成', value: '2' },
        { text: '逾期', value: '3' }
      ],
      executeDate: '', // 计划时间
      liableDeptId: '', // 责任部门ID
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
        planName: this.name,
        planType: this.type || null,
        executeDate: this.executeDate || null,
        liableDeptId: this.liableDeptId || null,
        status: this.status || null
      }
      getPlanList(req)
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
    onChangeDept(data) {
      this.liableDeptId = data.id
      this.onChange()
    },
    onChangeMonth(value) {
      this.executeDate = value
      this.onChange()
    },
    onSearch(value) {
      this.name = value
      this.onChange()
    }
  },
  created() {
    if (this.$route.query.status) {
      this.status = this.$route.query.status
    }
    if (this.$route.query.nowDate) {
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1
      this.executeDate = formatTime(year + '-' + month, 1)
    }
  },
  computed: {
    planStatus() {
      return planStatus
    },
    judgeHasClass() {
      return judgeHasClass
    }
  }
}
</script>
