<!-- 员工自评-开始 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="安全责任书信息" :disabled="false">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <DutyBookInfo :details="details.signDetail" hasYear></DutyBookInfo>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <router-link :to="{ path: '/safetyDuty/dutyTest/employeesSelfAssessment', query: $route.query }">
      <SubmitButton position="fixed" text="开始自评"></SubmitButton>
    </router-link>
  </div>
</template>

<script>
import { dutyAssessInfo } from '@/api/safetyDuty'
import { DutyBookInfo } from '../components'

export default {
  name: 'EmployeesSelfAssessmentBegin',
  components: { DutyBookInfo },
  data() {
    return {
      activeNames: [],
      stepActive: 0,
      steps: [
        { title: '员工自评(进行中)', time: '' },
        { title: '领导评分', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      details: {}
    }
  },
  methods: {
    onClickSubmit() {},
    getDetails() {
      const params = {
        assessId: this.id
      }
      dutyAssessInfo(params)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processCode || ''
          this.schedule = data.schedule || '1'
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
      return this.$route.query.assessId
    }
  }
}
</script>
