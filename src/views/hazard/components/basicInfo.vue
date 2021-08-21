<!-- Created by Tanking. -->
<!-- 基础信息 -->
<template>
  <div>
    <div class="label">提报人员</div>
    <div class="value1">{{ `${details.introducerName}(${details.introducerId})` }}</div>
    <div class="label">部门</div>
    <div class="value1">{{ details.deptName }}</div>
    <div v-if="details.overdueStatus" class="label">逾期状态</div>
    <div v-if="details.overdueStatus" class="value1">{{ details.overdueStatus === '1' ? '逾期' : '正常' }}</div>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'BasicInfo',
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
