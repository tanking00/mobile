<!-- 违规处罚信息 -list-->
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
        <van-dropdown-item v-model="category" title="违规类型" :options="categoryList" @change="onChange" />
        <van-dropdown-item v-model="status" title="审批状态" :options="statusList" @change="onChange" />
      </van-dropdown-menu>
    </div>
    <div class="default-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" class="refresh-min-height-m">
        <EmptyList v-if="isEmpty" :description="name ? '未搜到相关结果' : '暂无数据'" class="refresh-min-height-m" />
        <van-list v-else v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="list-item">
            <router-link
              :to="{
                path: '/safetyReward/punishesCases/punishesCasesDetails',
                query: {
                  id: item.id
                }
              }"
            >
              <div class="clearfix item-top">
                <span class="left font-size-ml font-weight ellipsis max-width-250">{{ item.processCode }}</span>
                <span class="right color-gray">{{ formatTimeStamp(item.createdTime, 1) }}</span>
              </div>
              <div class="color-text-secondary clearfix">
                <div class="color-gray">提报部门：{{ item.reportDeptName }}</div>
                <div class="color-text-secondary clearfix">
                  <span class="info left color-gray ">违规类型：{{ item.category }}</span>
                  <span v-if="item.status == '0'" class="info right color-blue">进行中</span>
                  <span v-else class="info right color-gray">已完成</span>
                </div>
              </div>
            </router-link>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchPanel v-model="showSearch" name="PunishesCasesList" @search="onSearch"></SearchPanel>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { getPunishInfoList } from '@/api/safetyReward'
import { getDropdownDataOfCode } from '@/utils'

export default {
  name: 'PunishesCasesList',
  props: {},
  data() {
    return {
      limit: 10,
      offset: 0,
      name: '', // 演练名称
      category: '', // 演练形式
      categoryList: [
        // { text: '全部', value: '' },
        // { text: 'A类违规', value: 'a' },
        // { text: 'B类违规', value: 'b' },
        // { text: 'C类违规', value: 'c' }
      ],
      status: '', // 演练状态
      statusList: [
        { text: '全部', value: '' },
        { text: '进行中', value: 0 },
        { text: '已完成', value: 1 }
      ],
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
    onTimeChange(val) {
      console.log('time=', val)
    },
    getList() {
      const params = {
        limit: this.limit,
        offset: this.offset,
        status: this.status,
        category: this.category
        // startTime: this.startTime,
        // endTime: this.endTime,
      }
      getPunishInfoList(params)
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
          // this.list.forEach(async element => {
          //   for (const cItem of this.categoryList) {
          //     if (element.category.toLowerCase() === cItem.value) {
          //       element.categoryName = cItem.text
          //       break
          //     }
          //   }
          // })
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
    this.categoryList = await getDropdownDataOfCode('safety_illegal_type')
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
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
