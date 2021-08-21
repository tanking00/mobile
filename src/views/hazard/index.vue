<!-- Created by Tanking. -->
<!-- 隐患排查 -->
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
        <!-- <van-icon name="bm-systemSearch" class="icon-size-20" /> -->
      </template>
    </van-nav-bar>
    <div class="default-filterbar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="type" title="隐患分类" :options="typeOption" @change="onChangeType" />
        <van-dropdown-item v-model="source" title="隐患来源" :options="sourceOption" @change="onChange" />
        <van-dropdown-item v-model="level" title="隐患等级" :options="levelOption" @change="onChange" />
        <van-dropdown-item v-model="status" title="隐患状态" :options="statusOption" @change="onChange" />
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item" @click="onClickItem(item)">
            <div class="clearfix item-top">
              <span class="left font-size-ml font-weight ellipsis max-width-270">{{ item.source }}</span>
              <span
                class="right"
                :class="{
                  'color-red': judgeHasClass(item.isMajor, '1'),
                  'color-yellow': judgeHasClass(item.isMajor, '0')
                }"
                >{{ item.level }}</span
              >
            </div>
            <div class="color-text-secondary clearfix">
              <span class="left">{{ `隐患分类：${item.type}` }}</span>
              <span class="right">{{ `隐患状态：${hazardStatus[item.status]}` }}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="Hazard" @search="onSearch"></SearchPanel>
    <FloatButton
      v-if="$checkPermission('basic:dangercatalog:dangerCheckList:addInfo')"
      bgColorClass="background-color-auxiliary"
      @click="onClickAdd"
    ></FloatButton>
  </div>
</template>

<script>
import { getHazardList, getTypeAndLevelById } from '@/api/hazard'
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass, getDropdownDataOfCode, getDictText } from '@/utils'
import { hazardStatus } from '@/utils/enum'
import { FloatButton } from '@/components'
import { getDictOfCode } from '@/api/global'

export default {
  name: 'Hazard',
  components: {
    FloatButton
  },
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '', //
      type: '', // 隐患分类
      typeOption: [
        { text: '全部', value: '' },
        { text: '生产安全', value: '1' },
        { text: '系统安全', value: '2' }
      ],
      source: '', // 隐患来源
      sourceOption: [],
      level: '', // 隐患等级
      levelOption: [{ text: '全部', value: '' }],
      status: '', // 隐患状态
      statusOption: [
        { text: '全部', value: '' },
        { text: '进行中', value: '0' },
        { text: '已完成', value: '1' },
        { text: '已作废', value: '2' }
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
    onChangeType() {
      this.level = ''
      this.getHazardLevel(this.type)
      this.onChange()
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        levelId: this.level || null,
        source: this.source || null,
        classifyId: this.type || null,
        status: this.status || null
      }
      getHazardList(req)
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
    onClickAdd() {
      this.$store.dispatch('settings/setCachedView', 'Null')
      this.$router.push({
        path: '/hazard/add'
      })
    },
    // 查询隐患等级
    getHazardLevel(id) {
      getTypeAndLevelById(id)
        .then(res => {
          const { data } = res
          console.log(data)
          this.levelOption = []
          data.forEach(item => {
            if (item.type === '2') {
              this.levelOption.push({ text: item.name, value: item.id })
            }
          })
          this.levelOption.unshift({ text: '全部', value: '' })
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickItem(data) {
      if (data.isMajor === '0') {
        this.$router.push({
          path: '/hazard/general/details',
          query: {
            hazardId: data.id
          }
        })
      }
      if (data.isMajor === '1') {
        this.$router.push({
          path: '/hazard/major/details',
          query: {
            hazardId: data.id
          }
        })
      }
    },
    // 查询隐患来源
    getHazardSource() {
      getDictOfCode('hazard_Sources')
        .then(res => {
          const { data } = res
          console.log(data)
          this.sourceOption = []
          data.forEach(item => {
            this.sourceOption.push({ text: item.label, value: item.label })
          })
          this.sourceOption.unshift({ text: '全部', value: '' })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created() {
    this.getHazardSource()
    this.typeOption = await getDropdownDataOfCode('hazard_type')
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    hazardStatus() {
      return hazardStatus
    },
    getDictText() {
      return getDictText
    }
  }
}
</script>
