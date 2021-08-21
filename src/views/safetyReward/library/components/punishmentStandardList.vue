<!--  处罚标准列表 -->
<template>
  <div class="container">
    <div class="default-filterbar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="type" title="违规类型" :options="types" @change="onChange" />
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
                path: '/safetyReward/library/punishmentStandardDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="title left font-size-ml font-weight ellipsis" style="width:50%">
                  {{ item.form }}
                </span>
                <span class="right color-gray">{{ formatTimeStamp(item.updatedTime, 1) }}</span>
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left color-gray">违规类型： {{ item.typeName }}</span>
              </div>
              <div class="color-text-secondary clearfix">
                <span class="left info color-gray">违规情节：{{ item.description }}</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="show" name="PunishmentStandardList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getPunishmentStandardList } from '@/api/safetyReward'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getDropdownDataOfCode, getDictLabelOfCode } from '@/utils'
export default {
  name: 'PunishmentStandardList',
  model: {
    prop: 'showSearch',
    event: 'change'
  },
  props: {
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      limit: 10,
      offset: 0,
      name: '',
      startTime: null,
      endTime: null,
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      types: [
        // { text: '全部', value: '' },
        // { text: 'A类违规', value: 'a' },
        // { text: 'B类违规', value: 'b' },
        // { text: 'C类违规', value: 'c' }
      ],
      type: ''
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
        form: this.name,
        typeId: this.type,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getPunishmentStandardList(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }

          this.loading = false
          data.rows.forEach(async element => {
            element.typeName = ''
            element.typeName = await getDictLabelOfCode('safety_illegal_type', element.typeId)
          })
          this.list = this.list.concat(data.rows || [])

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
      this.$emit('change', false)
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
    this.types = await getDropdownDataOfCode('safety_illegal_type')
  },

  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  watch: {
    showSearch(val, old) {
      console.log('val=', val)
      if (val !== old && val !== this.show) {
        this.show = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.info {
  overflow: hidden; /** 隐藏超出的内容 **/
  word-break: break-all;
  text-overflow: ellipsis; /** 多行 **/
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2; /** 显示的行数 **/
}
</style>
