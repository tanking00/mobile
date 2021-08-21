<!-- 责任制考核模版库 -->
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
        <van-dropdown-item v-model="fistOrderTarget" title="一级指标" :options="typeOption" @change="onChange" />
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
                path: '/safetyDuty/dutyTest/dutyTestTemplateDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="title left font-size-ml font-weight ellipsis">{{ item.indexOneName }}</span>
                <span class="right font-size-sm color-text-secondary">{{
                  formatTimeStamp(item.operationTime, 1)
                }}</span>
              </div>
              <div class="ellipsis-2 color-text-secondary">
                {{ item.indexTwo }}
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="DutyTestTemplateList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getTestTemplateList } from '@/api/safetyDuty'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getDropdownDataOfCode } from '@/utils'
export default {
  name: 'DutyTestTemplateList',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      startTime: null,
      endTime: null,
      isEmpty: false,
      fistOrderTarget: null,
      typeOption: [],
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
      const req = {
        limit: this.limit,
        offset: this.offset,
        name: this.name,
        indexOne: this.fistOrderTarget,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getTestTemplateList(req)
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
          this.updateIndexOneName()
        })
        .catch(err => {
          console.log(err)
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
    },
    updateIndexOneName() {
      if (!this.typeOption) {
        return
      }
      if (!this.list) {
        return
      }
      this.list.forEach(item => {
        item.indexOneName = ''
        this.typeOption.forEach(typeItem => {
          if (item.indexOne === typeItem.value) {
            item.indexOneName = typeItem.text
          }
        })
      })
    }
  },
  async created() {
    this.typeOption = await getDropdownDataOfCode('duty_target_first')
    this.updateIndexOneName()
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.list-item {
  .title {
    max-width: 196px;
  }
}
</style>
