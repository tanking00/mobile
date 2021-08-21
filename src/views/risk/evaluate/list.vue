<!-- Created by Tanking. -->
<!-- 危险源评价 -->
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
        <van-dropdown-item v-model="type" title="风险类型" :options="typeOption" @change="onChange" />
        <van-dropdown-item v-model="grade" title="风险等级" :options="gradeOption" @change="onChange" />
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/risk/evaluate/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-255">
                  {{ item.sourceDanger }}
                </span>
                <span
                  class="right"
                  :class="{
                    'color-red': judgeHasClass(item.grade, '1级风险'),
                    'color-orange': judgeHasClass(item.grade, '2级风险'),
                    'color-yellow': judgeHasClass(item.grade, '3级风险'),
                    'color-blue': judgeHasClass(item.grade, '4级风险')
                  }"
                  >{{ item.grade }}</span
                >
              </div>
              <div class="item-center ellipsis color-text-secondary">
                {{ `风险类型：${item.riskType}` }}
              </div>
              <div class="ellipsis color-text-secondary">
                {{ `事故后果：${item.accidentConsequence}` }}
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="RiskEvaluateList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getSourceEvaluateList } from '@/api/risk'
import { formatTimeStamp, formatTime } from '@/utils/timeFormat'
import { judgeHasClass } from '@/utils'
import { lawsStatus } from '@/utils/enum'
import { getDictOfCode } from '@/api/global'

export default {
  name: 'RiskEvaluateList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      type: '',
      typeOption: [],
      grade: '',
      gradeOption: [
        { text: '全部', value: '' },
        { text: '1级风险', value: '1级风险' },
        { text: '2级风险', value: '2级风险' },
        { text: '3级风险', value: '3级风险' },
        { text: '4级风险', value: '4级风险' }
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
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        sourceDanger: this.name || null,
        riskType: this.type || null,
        grade: this.grade || null
      }
      getSourceEvaluateList(req)
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
    },
    // 获取风险类型
    getDictOfCode() {
      getDictOfCode('hzd_risk_type')
        .then(res => {
          const { data } = res
          this.typeOption = []
          data.forEach(item => {
            this.typeOption.push({ text: item.label, value: item.label })
          })
          this.typeOption.unshift({ text: '全部', value: '' })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created() {
    // this.typeOption = await getDropdownDataOfCode('hzd_risk_type')
    this.getDictOfCode()
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    formatTime() {
      return formatTime
    },
    judgeHasClass() {
      return judgeHasClass
    },
    lawsStatus() {
      return lawsStatus
    }
  }
}
</script>
