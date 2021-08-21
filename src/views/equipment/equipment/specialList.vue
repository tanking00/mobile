<!-- Created by Tanking. -->
<!-- 特殊设备信息 -->
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
        <van-dropdown-item v-model="type" title="设备类型" :options="typeOption" @change="onChange" />
        <van-dropdown-item v-model="status" title="设备状态" :options="statusOption" @change="onChange" />
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
                path: '/equipment/equipment/details',
                query: {
                  id: item.id,
                  type: '2'
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-260">{{ item.facility }}</span>
                <span
                  class="right font-size-sm"
                  :class="{
                    'color-blue': judgeHasClass(item.materialStatus, '0'),
                    'color-yellow': judgeHasClass(item.materialStatus, '1'),
                    'color-gray': judgeHasClass(item.materialStatus, '2')
                  }"
                >
                  {{ materialStatus[item.materialStatus] }}
                </span>
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left">{{ `设备类型：${item.materialType}` }}</span>
                <span class="right">{{ `数量：${item.quantity}` }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="EquipmentEquipmentSpecialList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getFireControlList } from '@/api/equipment'
import { getDropdownDataOfCode, judgeHasClass } from '@/utils'
import { materialStatus } from '@/utils/enum'

export default {
  name: 'EquipmentEquipmentSpecialList',
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      startTime: '',
      endTime: '',
      status: '', // 状态
      statusOption: [
        { text: '全部', value: '' },
        { text: '在用', value: '0' },
        { text: '维修中', value: '1' },
        { text: '报废', value: '2' }
      ],
      type: '', // 类型
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
        type: '2',
        facility: this.name,
        startTime: this.startTime,
        endTime: this.endTime,
        materialTypeId: this.type,
        materialStatus: this.status
      }
      getFireControlList(req)
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
    this.typeOption = await getDropdownDataOfCode('specialType_Info')
  },
  computed: {
    judgeHasClass() {
      return judgeHasClass
    },
    materialStatus() {
      return materialStatus
    }
  }
}
</script>
