<!-- 奖励评选-详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <ApplyTopInfoView :details="details"></ApplyTopInfoView>
        <van-collapse-item name="2" title="奖励评选信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <van-collapse v-model="infoActives" class="embedded-collapse" :border="false">
            <van-collapse-item
              v-for="(item, index) in details.submissionDetail"
              :key="index"
              :title="'信息' + (index + 1)"
              :disabled="true"
            >
              <template #right-icon>
                <router-link
                  :to="{
                    path: '/safetyReward/appraiseElect/rewardAppraiseElectSubDetails',
                    query: { appraiseId: id, submissionId: item.submissionId }
                  }"
                >
                  <span class="color-auxiliary">查看</span>
                </router-link>
              </template>
              <div class="label">提报部门</div>
              <div class="value1">{{ item.submitDeptName }}</div>
              <div class="label">业务分类</div>
              <div class="value1">{{ item.categoryName }}</div>
              <div class="label">奖励对象</div>
              <div class="value1">{{ item.awardObject }}</div>
              <div class="label">事迹标题</div>
              <div class="value1">{{ item.title }}</div>
              <div class="label">评分</div>
              <div class="value1">{{ item.average }}</div>
              <div class="label" v-if="item.award">奖项</div>
              <div class="value1">{{ item.award }}</div>
            </van-collapse-item>
          </van-collapse>
        </van-collapse-item>
        <van-collapse-item v-if="details.records && details.records.length > 0" name="3" title="历史审批信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
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
  </div>
</template>

<script>
import { ApplyTopInfoView } from './components'
import { getLastNodeTimeString } from '../components'
import { getAppraiseDetails } from '@/api/safetyReward'
import { getDictLabelOfCode } from '@/utils'
import { joinNameAndCode } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
import { safetyCheckOperation } from '@/utils/enum'
export default {
  name: 'RewardAppraiseElectDetails',
  components: { ApplyTopInfoView },
  data() {
    return {
      activeNames: ['1', '2'],
      infoActives: [0, 1, 2],
      details: {
        list: [],
        infos: []
      },
      stepData: {
        stepActive: 0,
        processCode: '',
        steps: [
          { title: '发起', time: '' },
          { title: '评选', time: '' },
          { title: '安委会确认', time: '' },
          { title: '结束', time: '' }
        ]
      }
    }
  },
  methods: {
    getDetails() {
      getAppraiseDetails(this.id)
        .then(res => {
          const { data } = res
          data.submissionDetail.forEach(async element => {
            element.categoryName = ''
            element.categoryName = await getDictLabelOfCode('security_submission_category', element.category)
          })
          console.log('data=', data)
          this.details = data
          this.stepData.processCode = data.processCode || ''
          this.stepData.stepActive = parseInt(data.schedule) - 1
          const nodes = this.details.records
          this.stepData.steps.forEach((item, index) => {
            if (index < this.stepData.stepActive) {
              item.time = getLastNodeTimeString(item.title, nodes)
              item.title = item.title + '（已完成）'
            } else if (index === this.stepData.stepActive) {
              if (item.title === '结束') {
                this.stepData.stepActive = this.stepData.steps.length + 1
              } else {
                item.title = item.title + '（进行中）'
              }
            }
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
</style>
