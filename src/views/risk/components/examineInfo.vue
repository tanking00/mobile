<!-- Created by Tanking. -->
<!-- 责任方审核信息 -->
<template>
  <div>
    <div v-for="(item, index) in records" :key="item.id">
      <div v-if="item.nodeName" class="value1">{{ `流程节点：${item.nodeName}` }}</div>
      <div v-if="item.approverName" class="value1">{{ `审核人：${item.approverName}` }}</div>
      <div v-if="item.approvalTime" class="value1">{{ `审核时间：${formatTimeStamp(item.approvalTime, 6)}` }}</div>
      <div v-if="item.operation" class="value1">{{ `审核结果：${safetyCheckOperation[item.operation]}` }}</div>
      <div v-if="item.receiverName" class="value1">
        {{ `接收人：${joinNameAndCode(item.receiverName, item.receiverId)}` }}
      </div>
      <div v-if="item.opinion" class="label">意见说明</div>
      <div v-if="item.opinion" class="value1">{{ item.opinion }}</div>
      <van-divider v-if="index !== records.length - 1" />
    </div>
  </div>
</template>

<script>
import { safetyCheckOperation } from '@/utils/enum'
import { formatTimeStamp } from '@/utils/timeFormat'
import { joinNameAndCode } from '@/utils'

export default {
  name: 'ExamineInfo',
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
    records() {
      return this.details.records || []
    },
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
