<!-- Created by Tanking. -->
<!--人员多选搜索面板 -->
<template>
  <transition name="fade">
    <div v-show="show" class="container-searchPanel background-color-white">
      <form action="/">
        <van-search
          v-model="value"
          show-action
          autofocus
          placeholder="请输入关键字搜索"
          shape="round"
          @search="onSearch"
          @cancel="onCancel"
        >
          <template #left-icon>
            <van-icon name="bm-systemSearch" class="icon-size-16 color-text-secondary" @click="onSearch" />
          </template>
        </van-search>
      </form>
      <div class="container-list empty-min-height">
        <EmptyList v-if="isEmpty" class="empty-min-height" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="(item, index) in list" :key="index">
            <div
              v-if="!(!chooseOneself && item.id === $store.getters.id)"
              class="container-list-item van-hairline--top-bottom"
              @click="onClickItem(item, index)"
            >
              <div class="container-list-item-left">
                <div class="avatar-border border-radius-circular">
                  <van-image :src="getUserAvatar(item.image)" fit="cover" width="100%" height="100%">
                    <template v-slot:error>
                      <van-icon name="bm-defaultAvatar" class="icon-size-42 color-text-auxiliary" />
                    </template>
                  </van-image>
                </div>
                <div>
                  <div class="name" v-html="getRealName(item.name)"></div>
                  <div class="code" v-html="getRealName(item.code)"></div>
                </div>
              </div>
              <div class="container-list-item-right">
                <van-icon v-if="item.isCheck" name="success" class="icon-size-24 color-primary" />
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <SubmitButton>
        <SubmitButtonItem @click="onSelect" type="primary">确定</SubmitButtonItem>
      </SubmitButton>
    </div>
  </transition>
</template>

<script>
import { getUserAvatar } from '@/utils'
import { getLikeUsersPage } from '@/api/global'

export default {
  name: 'PeoplesSearchPanel',
  components: {},
  model: {
    prop: 'showSearch',
    event: 'change'
  },
  props: {
    showSearch: {
      type: Boolean,
      default: false
    },
    // 是否可以选自己
    chooseOneself: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      value: '',
      limit: 10,
      offset: 0,
      list: [],
      isEmpty: false,
      loading: false,
      finished: false,
      select: []
    }
  },
  methods: {
    onSearch() {
      this.list = []
      this.offset = 0
      this.onLoad()
    },
    onCancel() {
      this.$emit('change', false)
    },
    onClickItem(item, index) {
      if (this.list[index].isCheck) {
        this.$set(this.list[index], 'isCheck', false)
        this.select.forEach((dd, idx) => {
          if (item.id === dd.id) {
            this.select.splice(idx, 1)
          }
        })
      } else {
        this.$set(this.list[index], 'isCheck', true)
        this.select.push(item)
      }
    },
    onSelect() {
      this.$emit('select', this.select)
      this.$emit('change', false)
    },
    parentDelUser(item) {
      console.log(123123)
      // this.$set(this.list[index], 'isCheck', false)
      this.select.forEach((dd, idx) => {
        if (item.id === dd.id) {
          this.select.splice(idx, 1)
        }
      })
      this.list.forEach((dd, index) => {
        if (item.id === dd.id) {
          this.$set(this.list[index], 'isCheck', false)
        }
      })
    },
    getRealName(name) {
      if (this.value) {
        const html = name.replace(this.value, `<span class="color-auxiliary">${this.value}</span>`)
        return html
      } else {
        return name
      }
    },
    onLoad() {
      this.loading = true
      this.getList()
    },
    getList() {
      if (!this.value) {
        return false
      }
      const req = {
        limit: this.limit,
        offset: this.offset,
        name: this.value
      }
      getLikeUsersPage(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

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
    }
  },
  created() {},
  watch: {
    showSearch(val, old) {
      if (val !== old && val !== this.show) {
        this.show = val
      }
    }
  },
  computed: {
    getUserAvatar() {
      return getUserAvatar
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-searchPanel {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  .container-list {
    padding: 0 12px 10px 12px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    .container-list-item {
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .container-list-item-left {
        display: flex;
        align-items: center;
        .avatar-border {
          width: 42px;
          height: 42px;
          overflow: hidden;
          margin-right: 12px;
        }
        .name {
          color: $color-text-primary;
          font-size: $font-size-m;
          span {
            color: $color-auxiliary;
          }
        }
        .code {
          color: $color-text-secondary;
          font-size: $font-size-sm;
          margin-top: 2px;
        }
      }
      .container-list-item-right {
        margin-right: 10px;
      }
    }
  }
}
.empty-min-height {
  height: calc(100vh - 56px);
  height: calc(100vh - constant(safe-area-inset-bottom) - 56px);
  height: calc(100vh - env(safe-area-inset-bottom) - 56px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
