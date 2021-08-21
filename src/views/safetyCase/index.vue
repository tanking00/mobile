<!-- Created by Tanking. -->
<!-- 国内外安全事件事故 -->
<template>
  <div class="container container-main">
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
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="" class="refresh-min-height-l">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-l" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div
            v-for="(item, index) in list"
            :key="item.id"
            class="list-item margin-top background-color-white border-radius clearfix"
            @click="onClickCase(item)"
          >
            <div class="image-wrapper left">
              <van-image v-if="imageList[index]" :src="imageList[index]" width="100%" height="100%" fit="cover" />
            </div>
            <div class="content-wrapper right">
              <div class="title font-size-ml ellipsis font-weight">
                {{ item.title }}
              </div>
              <div class="content font-size-m ellipsis-2 color-text-secondary">
                {{ item.content }}
              </div>
              <div class="time color-text-secondary font-size-sm">
                {{ formatTimeStamp(item.updatedTime, 8) }}
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="SafetyCase" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getCaseList } from '@/api/safetyCase'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getFilesOfId } from '@/api/global'

export default {
  name: 'SafetyCase',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showSearch: false,
      imageList: []
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
      this.imageList = []
      this.offset = 0
      this.onLoad()
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        title: this.name,
        status: '1'
      }
      getCaseList(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.imageList = []
            this.refreshing = false
          }

          const len = this.list.length
          this.list = this.list.concat(data.rows || [])
          data.rows.forEach((item, index) => {
            if (item.attachmentId) {
              this.getFilesOfId(item.attachmentId, len + index)
            }
          })
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
    },
    onClickCase(data) {
      this.$router.push({
        path: '/safetyCase/details',
        query: {
          id: data.id
        }
      })
    },
    getFilesOfId(id, index) {
      getFilesOfId(id)
        .then(res => {
          // const { data } = res
          this.$set(this.imageList, index, res.url)
        })
        .catch(err => {
          console.log(err)
        })
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
.container-main {
  padding-top: $navbar-height;
  height: 100%;
  .list-item {
    padding: 12px;
    .image-wrapper {
      border-radius: 4px;
      width: 100px;
      height: 100px;
      overflow: hidden;
      background-color: $color-text-auxiliary;
    }
    .content-wrapper {
      width: 215px;
      .content {
        margin-top: 6.5px;
      }
      .time {
        margin-top: 8px;
        line-height: 20px;
        text-align: right;
      }
    }
  }
}
</style>
