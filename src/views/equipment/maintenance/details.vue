<!-- Created by Tanking. -->
<!-- 维保信息详情/年度检查详情 -->
<template>
  <div class="container" :class="{ 'submit-button-height': showBtn, 'container-supports': !showBtn }">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item v-if="this.planId" name="1" title="计划信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <PlanInfo :id="planId" :type="type"></PlanInfo>
        </van-collapse-item>
        <van-collapse-item
          v-if="(planId && '1' === this.flowStatus) || !planId"
          name="2"
          :title="type === '1' ? '维保信息' : '检查信息'"
        >
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.facility" class="label">设备设施</div>
            <div v-if="details.facility" class="value">{{ details.facility }}</div>
            <div v-if="details.date" class="label">{{ type === '1' ? '维保日期' : '检查日期' }}</div>
            <div v-if="details.date" class="value">{{ formatTimeStamp(details.date, 5) }}</div>
            <div class="label">{{ type === '1' ? '维保结论' : '检查结论' }}</div>
            <div class="value">{{ details.result === '1' ? '不合格' : '合格' }}</div>
            <div v-if="concernsList && concernsList.length > 0" class="value concernsList">
              <div v-for="(item, index) in concernsList" :key="item.concernsId" class="concerns">
                <div class="clearfix top">
                  <div class="left">{{ `问题${toChinesNum(index + 1)}` }}</div>
                  <span
                    class="right"
                    :class="{
                      'color-blue': judgeHasClass(item.isInitiate, '0'),
                      'color-red': judgeHasClass(item.isInitiate, '2'),
                      'color-gray': judgeHasClass(item.isInitiate, ['1', '3'])
                    }"
                    @click="onClickHazard(item.concernsId)"
                  >
                    {{ sbwbHazardStatus[item.isInitiate] }}
                  </span>
                </div>
                <div class="bot">
                  {{ item.issueDescribe }}
                </div>
              </div>
            </div>
            <van-divider v-if="files.length > 0">附件</van-divider>
            <div v-if="files.length > 0" class="flie-list">
              <div
                v-for="(item, index) in files"
                :key="index"
                class="file-item flex-center-column"
                @click="$filePreviewFun(item)"
              >
                <van-icon name="bm-otherPdf" class="icon-size-60" />
                <p class="name ellipsis">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </van-collapse-item>
        <van-collapse-item v-if="planId && records.length > 0" name="3" title="历史审批信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-for="(item, index) in records" :key="item.id">
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
              <van-divider v-if="index !== records.length - 1" />
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel
        v-if="planId"
        :processCode="processCode"
        :steps="steps"
        :stepActive="stepActive"
      ></ProcessInfoPanel>
    </div>
    <SubmitButton v-if="showBtn">
      <SubmitButtonItem @click="showTransfer = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="onClickInput">实施结果录入</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showTransfer" title="审批意见" buttonText="确认转办" @submit="onClickFormTransfer">
      <van-form ref="form" @failed="onFailedFormTransfer" @submit="onSubmitFormTransfer" :show-error-message="false">
        <van-field
          v-model="nextUserName"
          name="转办处理人"
          label="转办处理人"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showSearchPeoplePanel = true"
          :rules="[{ required: true, message: '请选择转办处理人' }]"
        />
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="opinion"
          name="意见说明"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
          :rules="[{ required: true, message: '请填写意见说明' }]"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
    <SearchPeoplePanel v-model="showSearchPeoplePanel" @select="onSelect"></SearchPeoplePanel>
  </div>
</template>

<script>
import { getMaintenanceDetails, getApprovalRecord, submitImplement } from '@/api/equipment'
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass, toChinesNum, joinNameAndCode } from '@/utils'
import { safetyCheckOperation } from '@/utils/enum'
import { PlanInfo } from '../components'
import { Dialog, Toast } from 'vant'
import { getPlanDetails } from '@/api/plan'
import { sbwbHazardStatus } from '@/utils/enum'
import { getHazardById } from '@/api/hazard'

export default {
  name: 'EquipmentMaintenanceDetails',
  components: { PlanInfo },
  data() {
    return {
      activeNames: [],
      details: {},
      concernsList: [],
      stepActive: 1,
      steps: [
        { title: this.type === '1' ? '维保结果录入（进行中）' : '检查结果录入（进行中）', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      planId: '',
      flowStatus: '', // 流程状态
      records: [], // 审批记录
      showBtn: false,
      showTransfer: false,
      showSearchPeoplePanel: false,
      nextUserName: '', // 转办人
      nextUserId: '',
      opinion: '', // 意见
      materialTypeId: '', // 设备实施类型
      files: []
    }
  },
  methods: {
    getDetails() {
      getMaintenanceDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processCode
          this.planId = data.planId
          this.flowStatus = data.flowStatus
          this.concernsList = data.concernsList
          this.materialTypeId = data.materialTypeId
          if (data.file) {
            this.files.push(data.file)
          }
          if (data.planId) {
            this.getPlanDetails(data.planId)
            this.getApprovalRecord(data.processCode)
          } else {
            this.activeNames = ['2']
          }
          if (data.planId && this.flowStatus !== '1' && this.taskId) {
            this.showBtn = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取审批记录
    getApprovalRecord(code) {
      getApprovalRecord(code)
        .then(res => {
          const { data } = res
          this.records = data
          if (this.flowStatus === '1') {
            this.steps[0].title = this.type === '1' ? '维保结果录入（已完成）' : '检查结果录入（已完成）'
            this.stepActive = 2
            this.activeNames = ['2']
            if (data && data.length > 0) {
              this.steps[0].time = formatTimeStamp(data[0].approvalTime, 6)
            } else {
              this.steps[0].time = formatTimeStamp(this.details.updatedTime, 6)
            }
          } else {
            this.activeNames = ['1']
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取计划信息
    getPlanDetails(planId) {
      const type = this.type === '1' ? '设备维保' : '设备年度检查'
      getPlanDetails(planId, type)
        .then(res => {
          const { data } = res
          this.materialTypeId = data.typeId
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选人回调
    onSelect(data) {
      this.nextUserName = data.name
      this.nextUserId = data.id
    },
    onClickInput() {
      this.$router.push({
        path: '/equipment/maintenance/resultEntry',
        query: {
          id: this.id,
          taskId: this.taskId,
          type: this.type,
          planId: this.planId,
          processCode: this.processCode,
          materialTypeId: this.materialTypeId
        }
      })
    },
    // 转办
    onClickFormTransfer() {
      this.$refs['form'].submit()
    },
    onFailedFormTransfer(info) {
      Toast(info.errors[0].message)
    },
    onSubmitFormTransfer() {
      Dialog.confirm({
        message: '确认要转办审批？'
      })
        .then(() => {
          const req = {
            taskId: this.taskId,
            type: this.type,
            operation: '4',
            nextUserName: this.nextUserName,
            nextUserId: this.nextUserId,
            opinion: this.opinion,
            maintenanceCheckInfo: {
              id: this.id,
              type: this.type,
              processCode: this.processCode,
              planId: this.planId
            }
          }
          submitImplement(req)
            .then(res => {
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    // 点击隐患
    onClickHazard(id) {
      if (!id) return
      getHazardById(id)
        .then(res => {
          const { data } = res
          if (data.hazardDetailsBO) {
            // 一般
            this.$router.push({
              path: '/hazard/general/details',
              query: {
                hazardId: id
              }
            })
          } else {
            // 重大
            this.$router.push({
              path: '/hazard/major/details',
              query: {
                hazardId: id
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    type() {
      return this.$route.query.type
    },
    taskId() {
      return this.$route.query.taskId
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    safetyCheckOperation() {
      return safetyCheckOperation
    },
    toChinesNum() {
      return toChinesNum
    },
    joinNameAndCode() {
      return joinNameAndCode
    },
    sbwbHazardStatus() {
      return sbwbHazardStatus
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.concernsList {
  .concerns {
    background: #f6fafb;
    border-radius: $border-radius;
    margin-bottom: 12px;
    padding: 10px 12px 12px 12px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    .top {
      line-height: 24px;
      .left {
        font-weight: $font-weight;
        font-size: $font-size-ml;
        color: $color-text-primary;
      }
      .right {
        font-size: $font-size-m;
      }
    }
    .bot {
      margin-top: 6px;
      font-size: $font-size-m;
      color: $color-text-secondary;
    }
  }
}
</style>
