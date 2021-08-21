<template>
  <transition name="fade">
    <div v-show="show" class="container-searchPanel background-color-bg">
      <form action="/">
        <van-search
          v-model="name"
          show-action
          autofocus
          placeholder="请输入关键字搜索"
          shape="round"
          @search="onSearch"
          @cancel="onCancel"
        >
          <template #left-icon>
            <van-icon name="bm-systemSearch" class="icon-size-16 color-text-secondary" @click="onSearch(name)" />
          </template>
        </van-search>
      </form>
      <div class="container-list empty-min-height">
        <EmptyList v-if="isEmpty" class="empty-min-height" />
        <van-list v-else>
          <div v-for="item in list" :key="item.id" class="list-item" @click="cellClik(item)">
            <div class="clearfix item-top">
              <span class="left font-size-ml font-weight ellipsis max-width-250">{{ item.planName }}</span>
              <!-- <span
                class="right ellipsis max-width-180"
                :class="{
                  'color-blue': true
                }"
                >{{ item.siteString }}</span
              > -->
            </div>
            <!-- <div class="color-text-secondary clearfix">
              <span class="left">分类：{{ item.planCategoryName }}</span>
              <span class="right">编制部门：{{ item.deptName }}</span>
            </div> -->
          </div>
        </van-list>
      </div>
    </div>
  </transition>
</template>

<script>
import { getEmergencyPrePlanListForClassify } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getUserAvatar } from '@/utils'

export default {
  name: 'PrePlanListPanel',
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
    planCategory: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      limit: 10,
      offset: 0,
      name: '', // 预案名称
      depId: '',
      startTime: null,
      endTime: null,
      isEmpty: false,
      list: [],
      selectItem: ''
    }
  },
  methods: {
    onLoad() {
      this.getList()
    },
    onCancel() {
      this.$emit('change', false)
    },
    onRefresh() {
      this.offset = 0
      this.onLoad()
    },
    onChange() {
      this.list = []
      this.offset = 0
      this.onLoad()
    },
    onChangeDept(val) {
      this.depId = val
      this.onChange()
    },
    getList() {
      const params = {
        name: this.name
      }
      getEmergencyPrePlanListForClassify(params, this.planCategory)
        .then(res => {
          const { data } = res
          this.list = []
          this.list = this.list.concat(data || [])

          if (this.list.length === 0) {
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
      this.name = value
      this.onChange()
    },

    cellClik(item) {
      this.$emit('select', item)
      this.$emit('change', false)
    }
  },

  watch: {
    showSearch(val, old) {
      if (val !== old && val !== this.show) {
        this.show = val
      }
    },
    planCategory(val, old) {
      if (val !== old) {
        this.getList()
      }
    }
  },
  created() {
    this.onChange()
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    getUserAvatar() {
      return getUserAvatar
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';

.avatar-border {
  width: 64px;
  height: 64px;
  overflow: hidden;
}
.safetyLeader {
  margin-top: 3px;
}
.safetyJob {
  margin-top: 3px;
  max-width: 218px;
}

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
    .list-item {
      box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.03);
      padding: 10px 12px;
      border-radius: $border-radius;
      background-color: $color-white;
      margin-top: $space-vertical;
      .item-top {
        line-height: 23px;
        margin-bottom: 6px;
      }
      .item-center {
        margin-bottom: 6px;
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
