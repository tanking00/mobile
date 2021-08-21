<!-- Created by Tanking. -->
<!-- 模板详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="安全责任制考核信息" disabled>
          <template #right-icon>
            <van-icon />
          </template>
          <DutyTestInfo :details="details"></DutyTestInfo>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getTestTemplateDetails } from '@/api/safetyDuty'
import { DutyTestInfo } from '../components'
import { getDictLabelOfCode } from '@/utils'

export default {
  name: 'DutyTestTemplateDetails',
  components: { DutyTestInfo },
  props: {},
  data() {
    return {
      activeNames: ['1'],
      details: {}
    }
  },
  methods: {
    getDetails() {
      getTestTemplateDetails(this.id)
        .then(async res => {
          const { data } = res
          data.contents.forEach(element => {
            element.safetyJobName = ''
          })
          this.details = data
          this.details.indexOneName = await getDictLabelOfCode('duty_target_first', this.details.indexOne)
          this.details.contents.forEach(async element => {
            element.safetyJobName = await getDictLabelOfCode('duty_safety_job', element.safetyJobId)
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  }
}
</script>
