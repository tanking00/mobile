<!-- Created by Tanking. -->
<!-- 管理制度 -->
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
        <van-dropdown-item v-model="type" title="制度类别" :options="typeOption" @change="onChange" />
        <van-dropdown-item v-model="apply" title="适用对象" :options="applyOption" @change="onChange" />
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/laws/system/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-230">{{ item.regimeName }}</span>
                <span class="right font-size-sm color-text-secondary">{{ item.publishTime }}</span>
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left ellipsis max-width-160">{{
                  `制度类别：${getDictText(typeOption, item.regimeType)}`
                }}</span>
                <span class="right ellipsis max-width-160">{{ `适用对象：${joinControlObj(item.controlObj)}` }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="LawsSystemList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getRegimeList } from '@/api/laws'
import { getDropdownDataOfCode, getDictText } from '@/utils'

export default {
  name: 'LawsSystemList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      type: '', // 制度类型
      typeOption: [],
      apply: '', // 适用对象
      applyOption: [],
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
    onChange(value) {
      this.list = []
      this.offset = 0
      this.onLoad()
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        regimeName: this.name,
        regimeType: this.type,
        controlObj: this.apply
      }
      getRegimeList(req)
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
    joinControlObj(data) {
      if (data.indexOf(',') > -1) {
        const list = data.split(',')
        let res = ''
        list.forEach((item, index) => {
          if (index > 0) {
            res += ','
          }
          res += getDictText(this.applyOption, item)
        })
        return res
      } else {
        return getDictText(this.applyOption, data)
      }
    }
  },
  async created() {
    this.typeOption = await getDropdownDataOfCode('laws_regime_type')
    this.applyOption = await getDropdownDataOfCode('laws_regime_obj')
  },
  computed: {
    getDictText() {
      return getDictText
    }
  }
}
</script>
