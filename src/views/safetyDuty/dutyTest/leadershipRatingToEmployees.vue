<!-- 领导给单个员工评分 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="责任人信息" disabled>
          <template #right-icon>
            <van-icon />
          </template>
          <div class="label">责任人员</div>
          <div class="value1">{{ details.dutyPersonnelName }}</div>
          <div class="label">责任岗位</div>
          <div class="value1">{{ details.safetyJobName }}</div>
        </van-collapse-item>
        <van-collapse-item name="1" title="评分信息" disabled>
          <template #right-icon>
            <span class="color-auxiliary" @click="pushMemberReference">员工评分参考依据</span>
            <van-icon name="bm-systemRightarrow" class="color-auxiliary margin-left-5" />
          </template>
          <van-collapse v-model="giveAmarkActives" class="embedded-collapse" :border="false">
            <van-collapse-item
              :border="false"
              v-for="(item, index) in details.grades"
              :key="index"
              :name="index"
              :title="'一级指标：' + item.indexOneName"
              :icon="item.testScore != null && item.testScore.length != 0 ? 'checked' : 'bm-systemVersionabout'"
              :class="item.testScore != null && item.testScore.length > 0 ? 'evaluated' : 'notEvaluated'"
            >
              <div class="label">二级指标：{{ item.indexTwo }}</div>
              <div class="label">目标：{{ item.target }}</div>
              <div class="label">总分：{{ item.grade }}</div>
              <div class="label">评分方法：{{ item.selfRatingExplain }}</div>
              <van-form scroll-to-error show-error ref="form1" @submit="onClickSubmit" :show-error-message="false">
                <div class="form-label">自评分：{{ item.selfRating }}</div>
                <div class="form-label">自评分说明：{{ item.selfRatingExplain }}</div>
                <div class="form-label-required">领导评分</div>
                <van-field
                  v-model="item.testScore"
                  maxlength="3"
                  placeholder="请填写评分"
                  type="number"
                  :formatter="$event => formatter($event, item.grade)"
                  :rules="[{ required: true, message: '请填写评分' }]"
                  show-word-limit
                  class="form-textarea"
                  :border="false"
                />
                <van-field
                  v-model="item.testScoreExplain"
                  rows="4"
                  type="textarea"
                  maxlength="50"
                  placeholder="请填写评分说明"
                  show-word-limit
                  class="form-textarea"
                />
              </van-form>
            </van-collapse-item>
          </van-collapse>
        </van-collapse-item>
      </van-collapse>
    </div>
    <SubmitButton @click="onClickSubmit" position="fixed" text="提交"></SubmitButton>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { staffGradeDetail, leaderScore } from '@/api/safetyDuty'
import { getDropdownDataOfCode } from '@/utils'

export default {
  name: 'LeadershipRatingToEmployees',
  data() {
    return {
      activeNames: ['1'],
      giveAmarkActives: [],
      details: {},
      typeOption: []
    }
  },
  methods: {
    formatter(value, grade) {
      if (value < 0) {
        return '0'
      }
      if (value > grade) {
        Toast('评分不能大于总分')
        return grade
      }
      return value
    },
    async getInfoDetail() {
      const req = {
        assessId: this.$route.query.assessId
      }
      const res = await staffGradeDetail(req)
      this.details = res.data
      for (const index in this.details.grades) {
        this.giveAmarkActives.push(parseInt(index))
      }
      this.updateIndexOneName()
    },
    onClickSubmit() {
      for (const item of this.details.grades) {
        if (item.testScore == null || item.testScore.length === 0) {
          Toast('请填写必填项')
          return
        }
      }
      Dialog.confirm({
        message: '确认提交评分？'
      })
        .then(() => {
          const gradeSubmits = []
          this.details.grades.forEach(item => {
            gradeSubmits.push({
              id: item.id,
              testScore: Number(item.testScore),
              testScoreExplain: item.testScoreExplain
            })
          })
          leaderScore(gradeSubmits)
            .then(() => {
              Toast('评分提交成功！')
              this.$router.go(-1)
            })
            .catch(() => {})
        })
        .catch(() => {
          // on cancel
        })
    },
    updateIndexOneName() {
      if (!this.typeOption) {
        return
      }
      if (!this.details.grades) {
        return
      }
      this.details.grades.forEach(item => {
        item.indexOneName = ''
        this.typeOption.forEach(typeItem => {
          if (item.indexOne === typeItem.value) {
            item.indexOneName = typeItem.text
          }
        })
      })
    },
    // 跳转员工评分依据
    pushMemberReference() {
      var userIds = [this.memberId]
      console.log('userIds=', userIds)
      this.$router.push({
        path: '/safetyDuty/dutyTest/dutyScoreDescribe',
        query: { userIds: userIds }
      })
    }
  },
  async created() {
    this.getInfoDetail()
    this.typeOption = await getDropdownDataOfCode('duty_target_first')
    this.updateIndexOneName()
  },
  computed: {
    memberId() {
      return this.$route.query.dutyPersonnelId
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
::v-deep .van-field__value {
  background-color: white;
}
.van-form {
  ::v-deep .van-cell {
    background-color: unset;
  }
}
</style>
