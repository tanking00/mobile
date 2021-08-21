<!-- Created by Tanking. -->
<!-- 搜索面板 -->
<template>
  <van-overlay :show="show">
    <div class="container-searchPanel background-color-white">
      <form action="/">
        <van-search
          v-model="value"
          show-action
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
      <div class="container-title clearfix">
        <span class="title left font-size-ml font-weight">最近搜索</span>
        <div class="icon-wrapper right border-radius-circular" @click="onClickClear">
          <van-icon name="bm-systemClear" class="icon-size-12 color-text-auxiliary" />
        </div>
      </div>
      <div class="container-list clearfix">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item background-color-bg left color-text-secondary font-size-sm"
          @click="onClickItem(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
import { getSearchRecord, setSearchRecord, removeSearchRecord } from '@/utils/storage'
export default {
  name: 'SearchPanel',
  components: {},
  model: {
    prop: 'showSearch',
    event: 'change'
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      value: '',
      list: []
    }
  },
  methods: {
    onSearch() {
      if (this.value.length > 0) {
        // 搜索不存在添加记录
        if (
          !this.list.some(item => {
            return this.value === item
          })
        ) {
          // 添加最新搜索记录
          this.list.unshift(this.value)
          // 最多十条记录
          if (this.list.length > 10) {
            this.list = this.list.slice(0, 10)
          }
          setSearchRecord(this.name, this.list)
        }
      }
      this.$emit('search', this.value)
      this.$emit('change', false)
    },
    onCancel() {
      this.$emit('search', this.value)
      this.$emit('change', false)
    },
    onClickItem(val) {
      this.value = val
      this.$emit('search', val)
      this.$emit('change', false)
    },
    onClickClear() {
      this.list = []
      removeSearchRecord(this.name)
    }
  },
  created() {
    const list = getSearchRecord(this.name)
    this.list = list || []
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
.container-searchPanel {
  width: 100%;
  height: 100%;
  .container-title {
    padding: 0 12px 0 16px;
    margin-top: 5px;
    margin-bottom: 10px;
    .title {
      line-height: 24px;
    }
    .icon-wrapper {
      width: 24px;
      height: 24px;
      background: #f2f3f6;
      text-align: center;
      vertical-align: middle;
    }
  }
  .container-list {
    padding: 0 16px 16px 16px;
    .item {
      padding: 0 16px;
      border-radius: 15px;
      line-height: 30px;
      margin-right: 8px;
      margin-bottom: 6px;
    }
  }
}
</style>
