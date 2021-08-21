<!-- Created by Tanking. -->
<!--管理制度搜索选择面板 -->
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
          <van-cell
            v-for="item in list"
            clickable
            :key="item.id"
            :title="item.regimeName"
            @click="onClickItem(item)"
          ></van-cell>
        </van-list>
      </div>
    </div>
  </transition>
</template>

<script>
import { getRegimeList } from '@/api/laws'

export default {
  name: 'SearchSystemsPanel',
  components: {},
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
      value: '',
      limit: 10,
      offset: 0,
      list: [],
      isEmpty: false,
      loading: false,
      finished: false
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
    onLoad() {
      this.loading = true
      this.getList()
    },
    onClickItem(data) {
      this.$emit('select', data)
      this.$emit('change', false)
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        regimeName: this.value
      }
      getRegimeList(req)
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
  created() {
    this.onLoad()
  },
  watch: {
    showSearch(val, old) {
      if (val !== old && val !== this.show) {
        this.show = val
      }
    }
  },
  computed: {}
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
