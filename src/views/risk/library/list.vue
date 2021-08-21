<!-- Created by Tanking. -->
<!-- 危险源辨识库 -->
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
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/risk/library/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="item-top font-size-ml font-weight ellipsis">
                {{ item.sourceDanger }}
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
    <SearchPanel v-model="showSearch" name="RiskLibraryList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getSourceDataList } from '@/api/risk'
import { formatTimeStamp, formatTime } from '@/utils/timeFormat'
import { judgeHasClass, getDropdownDataOfCode } from '@/utils'
import { lawsStatus } from '@/utils/enum'

export default {
  name: 'RiskLibraryList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      type: '',
      typeOption: [],
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
        riskTypeId: this.type || null
      }
      getSourceDataList(req)
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
  async created() {
    this.typeOption = await getDropdownDataOfCode('hzd_risk_type')
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

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
