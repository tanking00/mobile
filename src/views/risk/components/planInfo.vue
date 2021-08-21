<!-- Created by Tanking. -->
<!-- 计划信息 -->
<template>
  <div>
    <div class="label">制定人员</div>
    <div class="value1">{{ details.initiateName }}</div>
    <div class="label">制定部门</div>
    <div class="value1">{{ details.initiateDeptName }}</div>
    <div class="label">评价部门</div>
    <div class="value1">{{ details.receivedDepName }}</div>
    <div class="label">完成期限</div>
    <div class="value1">{{ formatTimeStamp(details.completionTime, 5) }}</div>
    <div v-if="details.processState" class="label">逾期状态</div>
    <div v-if="details.processState" class="value1">{{ details.processState === 3 ? '逾期' : '正常' }}</div>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'PlanInfo',
  components: {},
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  watch: {}
}
</script>
