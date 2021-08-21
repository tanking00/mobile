<!-- Created by Tanking. -->
<!-- 检查表库 -->
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
                path: '/equipment/library/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-200">{{ item.tableName }}</span>
                <span class="right font-size-sm color-text-secondary">{{ formatTimeStamp(item.updatedTime) }}</span>
              </div>
              <div class="color-text-secondary ellipsis-2">
                {{ '检查标准：' + item.itemNum }}
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="EquipmentLibraryList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getCheckLibraryList } from '@/api/equipment'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'EquipmentLibraryList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
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
        tableName: this.name,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getCheckLibraryList(req)
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
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>
