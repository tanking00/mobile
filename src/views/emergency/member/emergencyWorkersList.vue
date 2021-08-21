<!-- 应急人员信息 -list-->
<template>
  <div class="container default-container-list">
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
    <div class="default-filterbar">
      <van-dropdown-menu>
        <DeptDropdownPicker title="人员所在部门" @change="onChangeDept"></DeptDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/emergency/emergencyWorkerDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix">
                <div class="avatar-border border-radius-circular left">
                  <van-image :src="getUserAvatar(item.image)" fit="cover" width="100%" height="100%">
                    <template v-slot:error>
                      <van-icon name="bm-defaultAvatar" class="icon-size-64 color-text-auxiliary" />
                    </template>
                  </van-image>
                </div>
                <div class="left margin-left-16">
                  <div class="font-size-ml font-weight">{{ item.realName }}{{ item.userCode }}</div>
                  <div class="color-text-secondary safetyLeader">部门：{{ item.deptName }}</div>
                  <div class="color-text-secondary safetyJob">应急预案：{{ item.planNameStr }}</div>
                </div>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="EmergencyWorkersList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { getEmergencyMembers } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getDropdownDataOfCode, getUserAvatar } from '@/utils'

export default {
  name: 'EmergencyWorkersList',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '',
      depName: '', // 人员所在部门
      deps: [],
      startTime: null,
      endTime: null,
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showSearch: false // 是否显示搜索面板
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
    onChangeDept(val) {
      this.depName = val.id
      this.onChange()
    },
    getList() {
      const req = {
        limit: this.limit,
        offset: this.offset,
        realName: this.name,
        deptName: this.depName,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getEmergencyMembers(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }
          data.rows.forEach(item => {
            const planName = item.planName
            var planList = JSON.parse(planName)
            var nameStr = ''
            console.log('planList=', planList)
            planList.forEach(planItem => {
              if (nameStr.length === 0) {
                nameStr = planItem.item.label
              } else {
                nameStr = nameStr + '/' + planItem.item.label
              }
            })
            item.planNameStr = nameStr
          })
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
      this.name = value
      this.onChange()
    }
  },
  async created() {
    this.deps = await getDropdownDataOfCode('duty_safety_job')
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
</style>
