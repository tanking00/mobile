<!-- 应急预案信息 -list-->
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
        <van-dropdown-item
          v-if="pushType != 'select'"
          v-model="planCategory"
          title="预案分类"
          :options="categorys"
          @change="onChange"
        />
        <van-dropdown-item title="适用范围" @open="showSiteSearch = true"> </van-dropdown-item>
        <DeptDropdownPicker title="编制部门" @change="onChangeDept"></DeptDropdownPicker>
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item" @click="cellClik(item)">
            <div class="clearfix item-top">
              <span class="left font-size-ml font-weight ellipsis max-width-250">{{ item.planName }}</span>
              <span
                class="right ellipsis max-width-180"
                :class="{
                  'color-blue': true
                }"
                >{{ item.siteString }}</span
              >
            </div>
            <div class="color-text-secondary clearfix">
              <span class="left">分类：{{ item.planCategoryName }}</span>
              <span class="right">编制部门：{{ item.deptName }}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="emergencyPrePlanList" @search="onSearch"></SearchPanel>
    <SearchPanel v-model="showSiteSearch" name="emergencyPrePlanList-site" @search="onSiteSearch"></SearchPanel>
  </div>
</template>

<script>
import { getEmergencyPrePlanList } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getDropdownDataOfCode, getUserAvatar } from '@/utils'

export default {
  name: 'EmergencyPrePlanList',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '', // 预案名称
      planCategory: '', // 预案分类
      categorys: [],
      site: '', // 适用范围
      deptId: '',
      // siteList: [],
      startTime: null,
      endTime: null,
      isEmpty: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      showSearch: false, // 是否显示搜索面板
      showSiteSearch: false, // 是否显示区域搜索面板
      pushType: this.$route.query.pushType,
      // 'list' //页面跳转类型list：列表，select:选择预案
      selectItem: ''
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
      this.deptId = val.id
      this.onChange()
    },
    getList() {
      if (this.pushType === 'select') {
        this.planCategory = this.$route.query.categoryId
      }
      const req = {
        limit: this.limit,
        offset: this.offset,
        planCategory: this.planCategory,
        planName: this.name,
        site: this.site,
        deptId: this.deptId,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getEmergencyPrePlanList(req)
        .then(res => {
          const { data } = res
          this.offset += this.limit

          if (this.refreshing) {
            this.list = []
            this.refreshing = false
          }
          data.rows.forEach(item => {
            // 处理地点
            if (item.site) {
              var sites = JSON.parse(item.site)
              if (sites.length > 0) {
                var site = sites[0]
                item.siteString = site.item + '/' + site.content + '/' + site.unit
              }
            }
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
          // 处理分类名字
          this.setupPlanCategoryName()
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSearch(value) {
      this.name = value
      this.onChange()
    },
    onSiteSearch(value) {
      this.site = value
      this.onChange()
    },
    setupPlanCategoryName() {
      if (!this.categorys) {
        return
      }
      this.list.forEach(item => {
        if (item.planCategory) {
          for (const category of this.categorys) {
            if (category.value === item.planCategory) {
              item.planCategoryName = category.text
            }
          }
        }
      })
    },
    cellClik(item) {
      if (this.pushType === 'select') {
        this.selectItem = item
        this.$router.go(-1)
        return
      }
      this.$router.push({
        path: '/emergency/emergencyPrePlanDetails',
        query: {
          id: item.id,
          planCategoryName: item.planCategoryName
        }
      })
    }
  },
  async created() {
    this.categorys = await getDropdownDataOfCode('emergency_plan')
    this.setupPlanCategoryName()
  },
  // 返回传值
  beforeRouteLeave(to, from, next) {
    if (to.name === 'EmergencyDrillFormulate') {
      to.query.backData = this.selectItem
    }
    next()
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
