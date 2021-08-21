<!-- 奖励评选流程-评选-评分--->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <RewardDetailsView :details="details" :actives="actives"></RewardDetailsView>
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="评分" disabled>
          <template #right-icon>
            <van-icon></van-icon>
          </template>
          <van-form @submit="onSubmit" ref="form" @failed="onFailedForm" :show-error-message="false">
            <van-field
              required
              v-model="score"
              name="评分"
              label="评分"
              placeholder="请输入"
              input-align="right"
              type="number"
              :formatter="formatter"
              size="large"
              :rules="[{ required: true, message: '请输入评分' }]"
            />
          </van-form>
          <van-divider></van-divider>
          <div class="label">说明</div>
          <div class="value">
            一等奖：授予在安全生产和系统安全工作中有重大意义和作用的项目。在理论、观点、流程以及方法上有重大创新，对提高安全生产和系统安全理论及管理水平起到关键作用，取得显著安全效益；或项目十分复杂，技术难度极大，成果转化程度高，得到广泛应用及推广，对推动安全生产技术进步和发展有重大作用；或在隐患排查治理及应急管理工作中，难度极大，取得显著安全效益。
            二等奖：授予在安全生产和系统安全工作中有重要意义和作用的项目。在理论、观点、流程以及方法上有较大创新，对提高安全生产和系统安全理论及管理水平有重要作用，取得较大安全效益；或项目复杂，技术难度大，成果转化程度较高，在较大范围应用及推广，对推动安全生产技术进步和发展有很大作用；或在在隐患排查治理及应急管理工作中，难度大，取得较大安全效益。
            三等奖：授予在安全生产和系统安全工作中有较重要意义和作用的项目。在理论、观点、流程以及方法上有创新，对提高安全生产和系统安全理论及管理水平有较大作用，取得较好安全效益；或项目较复杂，技术难度较大，成果得到转化，并在一定范围内得到应用及推广，对推动安全生产技术进步和发展起到促进作用；或在隐患排查治理及应急管理中，难度较大，取得较好安全效益。
            安全专项奖：授予在其他安全专项工作中做出突出贡献的个人。
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <SubmitButton>
      <SubmitButtonItem @click="onCancelClick" type="gray">取消</SubmitButtonItem>
      <SubmitButtonItem @click="onSubmitClik">提交</SubmitButtonItem>
    </SubmitButton>
  </div>
</template>

<script>
import { RewardDetailsView } from '../components'
import { Toast, Dialog } from 'vant'
import { getSubmissionDetail, appraiseGrade } from '@/api/safetyReward'

export default {
  name: 'RewardProcessForSelectionScore',
  components: { RewardDetailsView },
  data() {
    return {
      actives: [],
      activeNames: ['1'],
      details: {},
      score: ''
    }
  },
  methods: {
    formatter(value) {
      if (value < 0) {
        return '0'
      }
      if (value > 10) {
        Toast('分数最高为10')
        return '10'
      }
      return value
    },
    // 表单错误回调
    onFailedForm(info) {
      Toast(info.errors[0].message)
    },
    getDetails() {
      const params = {
        appraiseId: this.appraiseId,
        submissionId: this.submissionId
      }
      getSubmissionDetail(params)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    onCancelClick() {
      Dialog.confirm({
        message: '确认取消评分吗？'
      })
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {
          // on cancel
        })
    },
    onSubmitClik() {
      this.$refs['form'].submit()
    },
    async onSubmit() {
      const user = this.$store.getters
      var params = {
        appraiseId: this.appraiseId,
        grade: this.score,
        submissionId: this.submissionId,
        userCode: user.code,
        userDeptId: user.primaryOrg.id,
        userId: user.id,
        userName: user.name
      }
      await appraiseGrade(params)
      Toast('评分成功')
      this.$router.go(-1)
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    appraiseId() {
      return this.$route.query.appraiseId
    },
    submissionId() {
      return this.$route.query.submissionId
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
::v-deep .default-collapse .van-collapse-item .van-collapse-item__content .van-divider {
  margin: 1px 1px 10px 1px;
}
</style>
