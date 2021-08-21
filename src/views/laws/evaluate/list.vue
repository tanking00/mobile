<!-- Created by Tanking. -->
<!-- 合规性评价记录 -->
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
        <van-dropdown-item v-model="category" title="法规类别" :options="categoryOption" @change="onChange" />
        <van-dropdown-item v-model="compliance" title="合规评价" :options="complianceOption" @change="onChange" />
        <DateRangeDropdownPicker title="时间" @change="onTimeChange"></DateRangeDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/laws/evaluate/details',
                query: {
                  id: item.id,
                  clauseId: item.clauseId,
                  regulationsId: item.regulationsId
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-255">{{ item.regulationName }}</span>
                <span class="right color-blue">{{ clauseCompliance[item.assessmentStatus] }}</span>
              </div>
              <div class="item-center ellipsis-2 color-text-secondary">
                {{ item.content }}
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left">{{ `评审人：${item.userName}` }}</span>
                <span class="right">{{ item.updatedTime }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="LawsEvaluateList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getEvaluateList } from '@/api/laws'
import { formatTimeStamp, formatTime } from '@/utils/timeFormat'
import { judgeHasClass, getDropdownDataOfCode, getDictText } from '@/utils'
import { clauseCompliance } from '@/utils/enum'

export default {
  name: 'LawsEvaluateList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      category: '', // 法规类别
      categoryOption: [
        { text: '全部', value: '' },
        { text: '类别一', value: 'a' },
        { text: '类别二', value: 'b' }
      ],
      compliance: '', // 符合性
      complianceOption: [
        { text: '全部', value: '' },
        { text: '符合', value: '1' },
        { text: '不符合', value: '0' }
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
        regulationName: this.name,
        regulationType: this.category,
        assessmentStatus: this.compliance,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getEvaluateList(req)
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
    // 搜索回调
    onSearch(value) {
      this.name = value
      this.onChange()
    }
  },
  async created() {
    this.categoryOption = await getDropdownDataOfCode('laws_law_type')
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
    clauseCompliance() {
      return clauseCompliance
    },
    getDictText() {
      return getDictText
    }
  }
}
</script>
