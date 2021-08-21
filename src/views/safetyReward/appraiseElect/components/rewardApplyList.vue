<!-- 奖励评选申请列表 -->
<template>
  <div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/safetyReward/appraiseElect/rewardApplyDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="title left font-size-ml font-weight ellipsis"> {{ item.processCode }}</span>
                <span class="right color-blue">查看</span>
              </div>
              <div class="color-text-secondary clearfix">
                <span class="info left color-gray ">发起时间：{{ formatTimeStamp(item.createdTime, 1) }}</span>
                <span v-if="item.status === '0'" class="info right color-blue ">进行中</span>
                <span v-if="item.status === '1'" class="info right color-gray ">已完成</span>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="show" name="RewardApplyList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getApplyList } from '@/api/safetyReward'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'RewardApplyList',
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
      otherParams: {}
    }
  },
  methods: {
    childAcceptValue(params) {
      this.otherParams = params
      this.onChange()
    },
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
      let params = {
        limit: this.limit,
        offset: this.offset
      }
      params = Object.assign(params, this.otherParams)
      getApplyList(params)
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
        })
    },
    onSearch(value) {
      this.$emit('change', false)
      this.name = value
      this.onChange()
    }
  },
  async created() {},

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
