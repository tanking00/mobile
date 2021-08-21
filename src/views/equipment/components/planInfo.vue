<!-- Created by Tanking. -->
<!-- 计划信息 -->
<template>
  <div>
    <div class="label">制定人员</div>
    <div class="value1">{{ details.enactPerson }}</div>
    <div class="label">制定部门</div>
    <div class="value1">{{ details.enactDept }}</div>
    <div v-if="details.equipmentType" class="label">设施设备类型</div>
    <div v-if="details.equipmentType" class="value1">{{ details.equipmentType }}</div>
    <div class="label">责任人员</div>
    <div class="value1">{{ details.personLiable }}</div>
    <div class="label">责任部门</div>
    <div class="value1">{{ details.liableDept }}</div>
    <div class="label">计划完成日期</div>
    <div class="value1">{{ formatTimeStamp(details.executeDate, 7) }}</div>
  </div>
</template>

<script>
import { getPlanDetails } from '@/api/plan'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'PlanInfo',
  components: {},
  props: {
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      details: {}
    }
  },
  methods: {
    getDetails() {
      const type = this.type === '1' ? '设备维保' : '设备年度检查'
      getPlanDetails(this.id, type)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getDetails()
  },
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  watch: {}
}
</script>
