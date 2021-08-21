<!-- Created by Tanking. -->
<!-- 配置人员信息 -->
<template>
  <div class="container">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$router.go(-1)"
      @click-right="showSearch = true"
    >
      <template #right>
        <van-icon name="bm-systemSearch" class="icon-size-20" />
      </template>
    </van-nav-bar>
    <div class="container-main padding-all">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-l">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-l" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-collapse v-model="activeNames">
            <van-collapse-item
              v-for="item in list"
              :key="item.userId"
              :name="item.userId"
              class="list-item margin-bottom border-radius"
            >
              <template #value>
                <div class="clearfix">
                  <div class="avatar-border border-radius-circular left">
                    <van-image :src="getUserAvatar(item.image)" fit="cover" width="100%" height="100%">
                      <template v-slot:error>
                        <van-icon name="bm-defaultAvatar" class="icon-size-64 color-text-auxiliary" />
                      </template>
                    </van-image>
                  </div>
                  <div class="left margin-left-16">
                    <div v-if="item.name" class="font-size-ml font-weight">{{ item.name }}</div>
                    <div v-if="item.safetyLeaderName" class="color-text-secondary safetyLeader">
                      {{ '安全责任领导：' + item.safetyLeaderName }}
                    </div>
                    <div v-if="item.safetyJobNames" class="color-text-secondary safetyJob">
                      {{ '安全责任岗位：' + arrJoinStr(item.safetyJobNames, '/') }}
                    </div>
                  </div>
                </div>
              </template>
              <div class="font-size-sm color-text-secondary">
                <div v-if="item.code" class="details-item">{{ '员工号：' + item.code }}</div>
                <div v-if="item.orgName" class="details-item">{{ '部门：' + item.orgName }}</div>
                <div v-if="item.jobs" class="details-item">{{ '岗位：' + arrJoinStr(item.jobs, '/', 'jobName') }}</div>
                <div v-if="item.managerName" class="details-item">{{ '直属领导：' + item.managerName }}</div>
                <div v-if="item.directorUserName" class="details-item">{{ '部门领导：' + item.directorUserName }}</div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="Staffing" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getTemplateUsers } from '@/api/safetyDuty'
import { arrJoinStr, getUserAvatar } from '@/utils'

export default {
  name: 'Staffing',
  props: {},
  data() {
    return {
      list: [], // 显示的人
      activeNames: [],
      limit: 10,
      offset: 0,
      isEmpty: false,
      loading: false,
      finished: false,
      refreshing: false,
      showSearch: false,
      name: ''
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
    onChange() {
      this.list = []
      this.offset = 0
      this.onLoad()
    },
    // 查人
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        id: this.id,
        key: this.name
      }
      getTemplateUsers(this.id, req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }

          this.list = this.list.concat(data.rows || [])
          this.total = data.total
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
      this.name = value
      this.onChange()
    }
  },
  created() {},
  computed: {
    id() {
      return this.$route.query.id
    },
    arrJoinStr() {
      return arrJoinStr
    },
    getUserAvatar() {
      return getUserAvatar
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  .container-main {
    ::v-deep .van-cell {
      padding: 10px 12px;
      align-items: center;
      box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.05);
      &::after {
        border-bottom: 0;
      }
    }
    .list-item {
      overflow: hidden;
      box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.03);
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
      .details-item {
        margin-bottom: 8px;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
