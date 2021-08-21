<!-- Created by Tanking. -->
<!-- 消息中心 -->
<template>
  <div class="container">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
      @click-right="showSheet = true"
    >
      <template #right>
        <van-icon name="bm-systemDotmore" class="icon-size-20" />
      </template>
    </van-nav-bar>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-l">
        <EmptyList v-if="isEmpty" description="暂无消息" class="refresh-min-height-l" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/newsCenter/details',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <i v-if="'0' === item.isRead" class="dot"></i>
                <span class="left font-size-ml font-weight ellipsis max-width-200">{{ item.title }}</span>
                <span class="right color-gray">{{ formatTimeStamp(item.sendTime) }}</span>
              </div>
              <div v-html="item.context" class="color-text-secondary ellipsis-2"></div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-action-sheet
      v-model="showSheet"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>

<script>
import { getMsgList, readMsg } from '@/api/newsCenter'
import { formatTimeStamp } from '@/utils/timeFormat'
import { Dialog } from 'vant'

export default {
  inject: ['reload'],
  name: 'NewsCenter',
  data() {
    return {
      limit: 10,
      offset: 0,
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showSheet: false,
      actions: [{ name: '全部标记已读', className: 'actionsClass' }]
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
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        userId: this.$store.getters.code
      }
      getMsgList(req)
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
    onSelect(action, index) {
      switch (index) {
        case 0:
          console.log('全部标记已读')
          Dialog.confirm({
            message: '确认要全部标记为已读？'
          })
            .then(() => {
              readMsg({
                userId: this.$store.getters.code
              })
                .then(res => {
                  this.reload()
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(() => {})
          break
      }
    }
  },
  created() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  padding-top: $navbar-height;
  height: 100%;
  .item-top {
    .dot {
      float: left;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: $color-red;
      margin-top: 8px;
      margin-right: 8px;
    }
  }
}
.actionsClass {
  font-size: $font-size-m;
  color: $color-text-primary;
}
.van-action-sheet__cancel {
  color: $color-red;
}
</style>
