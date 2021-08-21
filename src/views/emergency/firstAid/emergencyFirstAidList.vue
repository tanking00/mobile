<!-- 急救物资信息 -list-->
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
        <van-dropdown-item v-model="eType" title="物资类型" :options="eTypes" @change="onChange" />
        <van-dropdown-item v-model="eState" title="物资状态" :options="eStates" @change="onChange" />
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
                path: '/emergency/emergencyFirstAidDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-250">{{ item.suppliesName }}</span>
                <span
                  class="right"
                  :class="{
                    'color-blue': judgeHasClass(item.status, '10'),
                    'color-red': judgeHasClass(item.status, '20'),
                    'color-gray': judgeHasClass(item.status, '30')
                  }"
                  >{{ firstAidMaterialsStatus[item.status] }}</span
                >
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left">数量：{{ item.suppliesNum }}</span>
                <span class="right">类型：{{ item.typeName }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="EmergencyFirstAidList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getEmergencyFirstAid } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getDropdownDataOfCode, judgeHasClass } from '@/utils'
import { firstAidMaterialsStatus } from '@/utils/enum'

export default {
  name: 'EmergencyFirstAidList',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      eType: '', // 物资类型
      eTypes: [],
      eState: '', // 物资状态
      eStates: [
        { text: '全部', value: '' },
        { text: '正常', value: 10 },
        { text: '临近过期', value: 20 },
        { text: '已过期', value: 30 }
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
    getList() {
      const params = {
        limit: this.limit,
        offset: this.offset,
        suppliesName: this.name,
        typeId: this.eType,
        status: this.eState,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getEmergencyFirstAid(params)
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
    },
    // 时间选择回调
    onTimeChange(startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.onChange()
    }
  },
  async created() {
    // this.deps = await getDropdownDataOfCode('duty_safety_job')
    this.eTypes = await getDropdownDataOfCode('emergency_type')
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    firstAidMaterialsStatus() {
      return firstAidMaterialsStatus
    }
  }
}
</script>
