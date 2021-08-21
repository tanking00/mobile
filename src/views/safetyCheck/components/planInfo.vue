<!-- Created by Tanking. -->
<!-- 安全检查计划信息 -->
<template>
  <div>
    <div v-if="details.makePersonnel" class="label">制定人员</div>
    <div v-if="details.makePersonnel" class="value1">{{ details.makePersonnel }}</div>
    <div v-if="details.makeDept" class="label">制定部门</div>
    <div v-if="details.makeDept" class="value1">{{ details.makeDept }}</div>
    <div v-if="details.checkName" class="label">检查名称</div>
    <div v-if="details.checkName" class="value1">{{ details.checkName }}</div>
    <div v-if="details.checkType" class="label">检查类型</div>
    <div v-if="details.checkType" class="value1">{{ getDictLabel(itemTypes, details.checkType) }}</div>
    <div v-if="details.dutyPersonnelName" class="label">责任人员</div>
    <div v-if="details.dutyPersonnelName" class="value1">{{ details.dutyPersonnelName }}</div>
    <div v-if="details.dutyDeptName" class="label">责任部门</div>
    <div v-if="details.dutyDeptName" class="value1">{{ details.dutyDeptName }}</div>
    <div v-if="details.executionTime" class="label">计划完成日期</div>
    <div v-if="details.executionTime" class="value1">{{ formatTimeStamp(details.executionTime, 7) }}</div>
    <div class="label">流程状态</div>
    <div class="value1">{{ safetyCheckStatus[details.status] }}</div>
  </div>
</template>

<script>
import { getDictDataOfCode, getDictLabel } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
import { safetyCheckStatus } from '@/utils/enum'

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
    return {
      itemTypes: []
    }
  },
  methods: {},
  async created() {
    this.itemTypes = await getDictDataOfCode('security_check_type')
  },
  mounted() {},
  computed: {
    getDictLabel() {
      return getDictLabel
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    safetyCheckStatus() {
      return safetyCheckStatus
    }
  },
  watch: {}
}
</script>
