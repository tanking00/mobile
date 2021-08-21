<!-- Created by Tanking. -->
<!-- 模板详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="安全责任书信息" disabled>
          <template #right-icon>
            <router-link :to="{ path: '/safetyDuty/staffing', query: { id: id } }">
              <span class="color-auxiliary">{{ '配置人员' + peopleCount + '人' }}</span>
            </router-link>
            <van-icon name="bm-systemRightarrow" class="color-auxiliary margin-left-5" />
          </template>
          <DutyBookInfo :details="details"></DutyBookInfo>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getTemplateDetails, getTemplateUsers } from '@/api/safetyDuty'
import { DutyBookInfo } from '../components'

export default {
  name: 'TemplateDetails',
  components: { DutyBookInfo },
  props: {},
  data() {
    return {
      activeNames: ['1'],
      peopleCount: 0,
      details: {}
    }
  },
  methods: {
    getDetails() {
      getTemplateDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查人
    getTemplateUsers() {
      const req = {
        limit: 1,
        offset: 0,
        id: this.id
      }
      getTemplateUsers(this.id, req)
        .then(res => {
          const { data } = res
          this.peopleCount = data.total || 0
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getDetails()
    this.getTemplateUsers()
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  }
}
</script>
