<!-- 奖励评选流程-评选--->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <ApplyTopInfoView :details="details"></ApplyTopInfoView>
        <van-collapse-item name="2" title="奖励入围信息">
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
                    path: '/safetyReward/appraiseElect/rewardProcessForSelectionScore',
                    query: { appraiseId: id, submissionId: item.id }
                  }"
                >
                  <span class="color-auxiliary">评分</span>
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
    <SubmitButton>
      <SubmitButtonItem @click="showPanel2 = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel3 = true">同意</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showPanel2" title="审批意见" buttonText="确认转办" @submit="onClickForm2">
      <van-form ref="form2" @failed="onFailedForm2" @submit="onSubmitForm2" :show-error-message="false">
        <van-field
          v-model="form2.nextUserName"
          name="转办处理人"
          label="转办处理人"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="onClickField"
          :rules="[{ required: true, message: '请选择转办处理人' }]"
        />
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="form2.opinion"
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
    <SubmitPanel v-model="showPanel3" title="审批意见" buttonText="确认同意" @submit="onClickForm3">
      <van-form ref="form3" @failed="onFailedForm3" @submit="onSubmitForm3" :show-error-message="false">
        <div class="form-label">意见说明</div>
        <van-field
          v-model="form3.opinion"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
    <PeopleSearchPanel v-model="showPeopleSearchPanel" @select="onSelect"></PeopleSearchPanel>
  </div>
</template>

<script>
import { getLastNodeTimeString } from '../components'
import { getAppraiseDetails, appraiseEvaluateSubmit } from '@/api/safetyReward'
import { getDictLabelOfCode } from '@/utils'
import { ApplyTopInfoView } from './components'
import { Toast, Dialog } from 'vant'
import { joinNameAndCode } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
import { safetyCheckOperation } from '@/utils/enum'
export default {
  name: 'RewardProcessForSelection',
  components: { ApplyTopInfoView },
  data() {
    return {
      activeNames: ['1', '2'],
      infoActives: [0, 1, 2],
      details: {},
      stepData: {
        stepActive: 1,
        processCode: '',
        steps: [
          { title: '发起', time: '' },
          { title: '评选', time: '' },
          { title: '安委会确认', time: '' },
          { title: '结束', time: '' }
        ]
      },
      showPanel2: false,
      showPanel3: false,
      showPeopleSearchPanel: false,
      form2: {
        opinion: '',
        nextUserName: '',
        nextUserId: ''
      },
      form3: {
        opinion: ''
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
    },
    onClickField() {
      this.showPeopleSearchPanel = true
    },
    // 转交提交
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      this.approval('确认要转办审批？', '4', this.form2)
    },
    // 同意提交
    onClickForm3() {
      this.$refs['form3'].submit()
    },
    onFailedForm3(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm3() {
      this.approval('确认要同意审批？', '2', this.form3)
    },
    // 选择转交人回调
    onSelect(data) {
      this.form2.nextUserName = data.name
      this.form2.nextUserId = data.id
    },
    approval(tips, operation, data) {
      Dialog.confirm({
        message: tips
      })
        .then(async () => {
          var params = {
            id: this.id,
            taskId: this.taskId,
            operation: operation, // 操作：2、同意3、退回4、转办5、结束
            processCode: this.processCode
          }
          params = Object.assign(params, data)
          await appraiseEvaluateSubmit(params)
          Toast('提交成功')
          this.$router.go(-1)
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.appraiseId
    },
    taskId() {
      return this.$route.query.taskId
    },
    processCode() {
      return this.$route.query.processCode
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
