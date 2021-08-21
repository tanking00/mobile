<!-- 奖励申请-详情-组件 -->
<template>
  <div>
    <van-collapse v-model="actives" class="default-collapse">
      <van-collapse-item name="1" title="申请信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('1') >= 0"></CollapseIcon>
        </template>
        <div class="label">申请人员</div>
        <div class="value1">{{ details.submitterName }}</div>
        <div class="label">申请部门</div>
        <div class="value1">{{ details.submitDeptName }}</div>
        <div class="label">奖励信息</div>
        <van-collapse v-model="infoActives" class="embedded-collapse" :border="false">
          <van-collapse-item v-for="(item, index) in details.rewards" :key="index" :title="'信息' + (index + 1)">
            <div class="label">奖项名称</div>
            <div class="value1">{{ item.award }}</div>
            <div class="label">事迹标题</div>
            <div class="value1">{{ item.title }}</div>
            <div class="label">获奖者</div>
            <div class="value1">{{ item.userName }}</div>
            <div class="label" v-if="item.userCode">工号</div>
            <div class="value1">{{ item.userCode }}</div>
            <div class="label">部门</div>
            <div class="value1">{{ item.userDeptName }}</div>
            <div class="label">奖励</div>
            <div class="value1">{{ item.reward }}</div>
          </van-collapse-item>
        </van-collapse>
      </van-collapse-item>
      <van-collapse-item v-if="details.records && details.records[0].opinion" name="2" title="审批意见" disabled>
        <template #right-icon>
          <van-icon></van-icon>
        </template>
        <div class="label">意见说明</div>
        <div class="value1">{{ details.records[0].opinion }}</div>
      </van-collapse-item>

      <van-collapse-item v-if="details.records && details.records.length > 0" name="3" title="历史审批信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('3') >= 0"></CollapseIcon>
        </template>
        <div>
          <div v-for="(item, index) in details.records" :key="item.id">
            <div v-if="item.nodeName" class="value1">{{ `流程节点：${item.nodeName}` }}</div>
            <div v-if="item.approverName" class="value1">{{ `审核人：${item.approverName}` }}</div>
            <div v-if="item.approvalTime" class="value1">
              {{ `审核时间：${formatTimeStamp(item.approvalTime, 6)}` }}
            </div>
            <div v-if="item.operation" class="value1">{{ `审核结果：${safetyCheckOperation[item.operation]}` }}</div>
            <div v-if="item.receiverName" class="value1">
              {{ `接收人：${joinNameAndCode(item.receiverName, item.receiverId)}` }}
            </div>
            <div v-if="item.opinion" class="label">意见说明</div>
            <div v-if="item.opinion" class="value1">{{ item.opinion }}</div>
            <van-divider v-if="index !== details.records.length - 1" />
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <ProcessInfoPanel
      v-if="stepData"
      :processCode="stepData.processCode"
      :steps="stepData.steps"
      :stepActive="stepData.stepActive"
    ></ProcessInfoPanel>
  </div>
</template>

<script>
import { joinNameAndCode } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
import { safetyCheckOperation } from '@/utils/enum'
export default {
  name: 'ApplyDetailsView',
  props: {
    details: {
      type: Object
    },
    stepData: {
      type: Object,
      default() {
        return {
          stepActive: 0,
          processCode: '',
          steps: [
            { title: '申请', time: '' },
            { title: '审核', time: '' },
            { title: '会签', time: '' },
            { title: '批准', time: '' },
            { title: '结束', time: '' }
          ]
        }
      }
    }
  },
  data() {
    return {
      actives: ['1', '2'],
      infoActives: []
    }
  },
  methods: {},
  created() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    safetyCheckOperation() {
      return safetyCheckOperation
    },
    joinNameAndCode() {
      return joinNameAndCode
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
