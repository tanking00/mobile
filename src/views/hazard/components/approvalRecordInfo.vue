<!-- Created by Tanking. -->
<!-- 审批记录信息 -->
<template>
  <div class="examineInfo-wrapper">
    <div v-for="(item, index) in recordList" :key="item.id" class="item-wrapper">
      <div v-if="item.nodeName" class="value1">{{ `流程节点：${item.nodeName}` }}</div>
      <div v-if="item.presentHandler" class="value1">{{ `审核人：${item.presentHandler}` }}</div>
      <div v-if="item.createdTime" class="value1">{{ `审核时间：${formatTimeStamp(item.createdTime, 6)}` }}</div>
      <div v-if="item.operationDesc" class="value1">{{ `审核结果：${safetyCheckOperation[item.operationDesc]}` }}</div>
      <div v-if="item.recipient" class="value1">
        {{ `接收人：${joinNameAndCode(item.recipient, item.recipientId)}` }}
      </div>
      <div v-if="item.opinion" class="label">意见说明</div>
      <div v-if="item.opinion" class="value1">{{ item.opinion }}</div>
      <van-divider v-if="index !== recordList.length - 1" class="divider" />
    </div>
  </div>
</template>

<script>
import { safetyCheckOperation } from '@/utils/enum'
import { formatTimeStamp } from '@/utils/timeFormat'
import { joinNameAndCode } from '@/utils'

export default {
  name: 'ApprovalRecordInfo',
  components: {},
  props: {
    recordList: {
      type: Array,
      default() {
        return []
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
    safetyCheckOperation() {
      return safetyCheckOperation
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    joinNameAndCode() {
      return joinNameAndCode
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.divider {
  margin-top: 21px !important;
}
</style>
