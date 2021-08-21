<!-- Created by Tanking. -->
<!-- 法律法规库 -->
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
        <van-dropdown-item v-model="region" title="适用区域" :options="regionOption" @change="onChange" />
        <van-dropdown-item v-model="effect" title="法律效力" :options="effectOption" @change="onChange" />
        <van-dropdown-item v-model="state" title="生效状态" :options="stateOption" @change="onChange" />
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/laws/library/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-270">{{ item.regulationName }}</span>
                <span
                  class="right"
                  :class="{
                    'color-blue': judgeHasClass(item.status, '1'),
                    'color-gray': judgeHasClass(item.status, '0')
                  }"
                  >{{ lawsStatus[item.status] }}</span
                >
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left">{{ `类别：${getDictText(categoryOption, item.regulationType)}` }}</span>
                <span class="right">{{ `法律效力：${getDictText(effectOption, item.regulationEffect)}` }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="LawsLibraryList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getLawsList } from '@/api/laws'
import { formatTimeStamp, formatTime } from '@/utils/timeFormat'
import { judgeHasClass, getDropdownDataOfCode, getDictText } from '@/utils'
import { lawsStatus } from '@/utils/enum'

export default {
  name: 'LawsLibraryList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '', // 法规名称
      category: '', // 法规类别
      categoryOption: [],
      region: '', // 适用区域
      regionOption: [],
      effect: '', // 法律效力
      effectOption: [],
      state: '', // 生效状态
      stateOption: [
        { text: '全部', value: '' },
        { text: '在用', value: '1' },
        { text: '作废', value: '0' }
      ],
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showSearch: false,
      total: 0
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
    onChange(value) {
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
        regulationScope: this.region,
        regulationEffect: this.effect,
        status: this.state
      }
      getLawsList(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }

          this.list = this.list.concat(data.rows || [])
          this.total = data.total
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
    this.categoryOption = await getDropdownDataOfCode('laws_law_type')
    this.regionOption = await getDropdownDataOfCode('laws_law_scope')
    this.effectOption = await getDropdownDataOfCode('laws_law_effect')
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
    },
    getDictText() {
      return getDictText
    }
  }
}
</script>
