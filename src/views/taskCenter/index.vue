<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" fixed @click-right="$router.push({ path: '/newsCenter' })">
      <template #right>
        <MessageButton></MessageButton>
      </template>
    </van-nav-bar>
    <div class="container-screen">
      <ul class="type-wrapper background-color-white">
        <li
          v-for="(item, index) in types"
          :key="index"
          class="type-item"
          :class="{ active: typeActive == index }"
          @click="onClickType(index, item)"
        >
          <i class="type-item-seat"></i>
          <p class="type-item-title">{{ item.title }}</p>
          <i class="type-item-bar"></i>
        </li>
        <li class="type-bar"></li>
      </ul>
      <ul class="category-wrapper">
        <li
          v-for="(item, index) in categorys"
          :key="index"
          class="category-item"
          :class="{ active: categoryActive == index }"
          @click="onClickCategory(index, item)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div class="container-list padding-left-right">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-xs">
        <EmptyList v-if="isEmpty" description="暂无任务" class="refresh-min-height-xs" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div
            v-for="item in list"
            :key="item.id"
            class="list-item background-color-white border-radius"
            @click="onClickItem(item)"
          >
            <div class="clearfix item-top">
              <span class="name left font-size-ml font-weight ellipsis">{{ item.procDefName }}</span>
              <span
                class="right margin-left-16"
                :class="{
                  'color-blue': judgeHasClass(item.status, ['待处理', '待阅']),
                  'color-red': judgeHasClass(item.status, ['已超期', '已超时']),
                  'color-gray': judgeHasClass(item.status, ['已处理', '已完成', '超期处理'])
                }"
              >
                {{ item.status }}
              </span>
              <span class="right color-text-secondary">{{ item.name }}</span>
            </div>
            <div class="clearfix color-text-secondary">
              <span class="left processTitle ellipsis">{{ item.processVariables.processTitle || '' }}</span>
              <span class="right font-size-sm color-text-secondary">{{ formatTime(item.startTime, 3) }}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SosButton></SosButton>
    <Footer></Footer>
  </div>
</template>

<script>
import { Footer, SosButton, MessageButton } from '@/components'
import { judgeHasClass } from '@/utils'
import { formatTime } from '@/utils/timeFormat'
import { getTaskList, getTaskCount } from '@/api/task'
import { processJump } from './processJump'

export default {
  name: 'TaskCenter',
  components: {
    Footer,
    SosButton,
    MessageButton
  },
  data() {
    return {
      limit: 10,
      offset: 0,
      typeActive: 0,
      type: 'upcoming',
      types: [
        {
          title: '待办',
          type: 'upcoming'
        },
        {
          title: '待阅',
          type: 'toBeRead'
        },
        {
          title: '已处理',
          type: 'processed'
        },
        {
          title: '已完成',
          type: 'completed'
        }
      ],
      categoryActive: 0,
      category: '',
      categorys: [
        {
          title: '全部',
          category: ''
        },
        {
          title: '隐患排查治理',
          category: 'hazard'
        },
        {
          title: '安全检查',
          category: 'security'
        },
        {
          title: '安全奖惩',
          category: 'reward'
        },
        {
          title: '安全责任制',
          category: 'duty'
        },
        {
          title: '设备设施管理',
          category: 'maintenance-yearcheck'
        },
        {
          title: '安全生产风险管理',
          category: 'source_danger'
        },
        {
          title: '应急管理',
          category: 'product_safe'
        }
      ],
      list: [],
      isEmpty: false, // 无数据
      loading: false, // 加载中
      finished: false, // 加载完成
      refreshing: false // 刷新
    }
  },
  created() {
    if (this.$route.query && this.$route.query.typeActive) {
      this.typeActive = this.$route.query.typeActive
      this.type = this.types[this.typeActive].type
    }
    this.getTaskCount()
  },
  methods: {
    onLoad() {
      this.getList()
    },
    onRefresh() {
      this.finished = false
      this.offset = 0
      this.loading = true
      this.onLoad()
      this.getTaskCount()
    },
    onChange() {
      this.list = []
      this.offset = 0
      this.onLoad()
    },
    onClickType(index, data) {
      this.typeActive = index
      this.type = data.type
      this.onChange()
    },
    onClickCategory(index, data) {
      this.categoryActive = index
      this.category = data.category
      this.onChange()
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        type: this.type,
        category: this.category
      }
      if (this.type === 'upcoming') {
        req.taskType = 'taskTypeUpcoming'
      }
      getTaskList(req)
        .then(res => {
          const { data } = res
          const rows = data.rows || []
          const total = data.total || 0
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }

          this.list = this.list.concat(rows)
          this.loading = false

          if (rows.length < this.limit || total <= this.limit) {
            this.finished = true
          } else {
            this.finished = false
          }
          if (total === 0) {
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
    // 点击任务
    onClickItem(data) {
      // 加入缓存
      // this.$store.dispatch('settings/setCachedView', 'TaskCenter')
      processJump(data, this.type)
    },
    // 获取任务数量
    getTaskCount() {
      getTaskCount()
        .then(res => {
          const { data } = res
          this.types[0].title = '待办（' + data.toBeUpcoming + '）'
          this.types[1].title = '待阅（' + data.toBeRead + '）'
          this.types[2].title = '已处理（' + data.processed + '）'
          this.types[3].title = '已完成（' + data.completed + '）'
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  activated() {
    // this.refreshing = true
    // this.onRefresh()
    // // 清除缓存
    // this.$store.dispatch('settings/setCachedView', 'Null')
  },
  computed: {
    judgeHasClass() {
      return judgeHasClass
    },
    formatTime() {
      return formatTime
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  padding-top: $navbar-height + 47px+50px;
  .container-screen {
    position: fixed;
    left: 0;
    width: 100%;
    height: 100px;
    top: $navbar-height;
    z-index: 10;
    .type-wrapper {
      height: 47px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: relative;
      .type-item {
        width: 25%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .type-item-seat {
          width: 100%;
          height: 2px;
        }
        .type-item-bar {
          width: 40px;
          height: 2px;
          z-index: 1;
          background-color: $color-bg;
        }
        &.active .type-item-bar {
          background: $color-primary;
        }
      }
      .type-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: $color-bg;
        z-index: 0;
      }
    }
    .category-wrapper {
      height: 50px;
      width: 100%;
      padding-left: 10px;
      background-color: $color-bg;
      white-space: nowrap;
      overflow-y: hidden;
      overflow-x: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .category-item {
        display: inline-block;
        font-size: $font-size-sm;
        height: 30px;
        padding: 0 14px;
        background-color: $color-white;
        border-radius: 30px;
        line-height: 30px;
        margin: 10px 8px 0 0;
        min-width: 66px;
        text-align: center;
        color: $color-text-secondary;
        &.active {
          color: $color-primary;
        }
      }
    }
  }
  .container-list {
    .list-item {
      box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.03);
      padding: 10px 12px;
      margin-top: $space-vertical;
      &:first-of-type {
        margin-top: 0;
      }
      .item-top {
        line-height: 24px;
        margin-bottom: 12px;
        .name {
          max-width: 150px;
        }
      }
      .processTitle {
        max-width: 180px;
      }
    }
  }
}
</style>
