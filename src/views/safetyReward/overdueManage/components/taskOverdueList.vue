<!-- 任务逾期信息列表 -->
<template>
  <div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item" @click="onClickItem(item)">
            <div class="clearfix item-top">
              <span v-if="item.taskVariables" class="title left font-size-ml font-weight ellipsis">
                {{ item.taskVariables.processCode || '' }}</span
              >
              <span class="right color-blue">查看</span>
            </div>
            <div class="color-gray">任务名称：{{ item.name }}</div>
            <div class="color-gray">当前流程节点：{{ item.procDefName }}</div>
            <div class="color-text-secondary clearfix">
              <span class="info left color-gray ">处理人员信息：{{ item.userName }}</span>
              <!-- <span
                class="info right color-gray "
                :class="{
                  'color-blue': judgeHasClass(item.status, ['待处理', '待阅']),
                  'color-red': judgeHasClass(item.status, ['已超期', '已超时']),
                  'color-gray': judgeHasClass(item.status, ['已处理', '已完成', '超期处理'])
                }"
                >{{ item.status }}</span
              > -->
              <span v-if="!item.endTime" class="info right color-blue">
                进行中
              </span>
              <span v-else class="info right color-gray ">
                已完成
              </span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="show" name="TaskOverdueList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getTaskForExpired } from '@/api/task'
import { judgeHasClass } from '@/utils'
import { processJump } from '../../../taskCenter/processJump'

export default {
  name: 'TaskOverdueList',
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
      refreshing: false
    }
  },
  methods: {
    // 点击任务
    onClickItem(data) {
      processJump(data, this.type)
    },
    childAcceptValue(params) {
      console.log('params=', params)
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
      const req = {
        limit: this.limit,
        offset: this.offset,
        taskStatus: 4,
        type: 'upcoming',
        procDefName: this.name
      }
      getTaskForExpired(req)
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
    judgeHasClass() {
      return judgeHasClass
    }
  },
  watch: {
    showSearch(val, old) {
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
