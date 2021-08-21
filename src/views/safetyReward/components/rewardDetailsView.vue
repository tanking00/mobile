<!-- 奖励标准列表 -->
<template>
  <div>
    <van-collapse v-model="actives" class="default-collapse">
      <van-collapse-item name="1" title="提报信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('1') >= 0"></CollapseIcon>
        </template>
        <div class="label">提报人员</div>
        <div class="value1">{{ details.submitterName }}</div>
        <div class="label">提报部门</div>
        <div class="value1">{{ details.submitDeptName }}</div>
        <div class="label">业务分类</div>
        <div class="value1">{{ details.category }}</div>
        <div class="label">奖项名称</div>
        <div class="value1">{{ details.awardsName }}</div>
        <div class="label">奖励对象</div>
        <div class="value1">{{ details.awardObject }}</div>
        <div class="label">奖项人员（{{ details.awardObject }}）</div>
        <div class="value1">{{ memberString }}</div>
        <div class="label">事迹标题</div>
        <div class="value1">{{ details.title }}</div>
        <div class="label">事迹详述</div>
        <div class="value1">{{ details.detail }}</div>
        <div v-if="details.file">
          <van-divider>附件</van-divider>
          <div class="flie-list">
            <div @click="$filePreviewFun(details.file)" class="file-item flex-center-column">
              <van-icon name="bm-otherPdf" class="icon-size-60" />
              <p class="name ellipsis">{{ details.file.name }}</p>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item v-if="details.records && details.records.length > 0" name="2" title="历史审批信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('2') >= 0"></CollapseIcon>
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
import { formatTimeStamp } from '@/utils/timeFormat'
import { joinNameAndCode } from '@/utils'
import { safetyCheckOperation } from '@/utils/enum'

export default {
  name: 'RewardDetailsView',
  props: {
    actives: {
      type: Array,
      default: () => ['1']
    },
    details: {
      type: Object
    },
    stepData: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {},
  async created() {},
  computed: {
    memberString() {
      if (this.details.users === undefined) {
        return '暂无'
      }
      var list = this.details.users.map(function(item, index, ary) {
        return item.userName + `（${item.userId}）`
      })
      var str = list.join('、')
      return str
    },
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
.info {
  overflow: hidden; /** 隐藏超出的内容 **/
  word-break: break-all;
  text-overflow: ellipsis; /** 多行 **/
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2; /** 显示的行数 **/
}
</style>
