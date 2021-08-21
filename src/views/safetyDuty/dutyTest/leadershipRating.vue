<!-- 领导评分 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="安全责任书信息" :disabled="false">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <DutyBookInfo :details="details.signDetail" hasYear></DutyBookInfo>
        </van-collapse-item>
        <van-collapse-item name="2" title="评分信息" disabled>
          <template #right-icon>
            <!-- <router-link :to="{ path: '/safetyDuty/dutyTest/dutyScoreDescribe', query: { id: id } }"> -->
            <span class="color-auxiliary" @click="pushMemberReference">员工评分参考依据</span>
            <!-- </router-link> -->
            <van-icon name="bm-systemRightarrow" class="color-auxiliary margin-left-5" />
          </template>
          <van-collapse v-model="giveAmarkActives" class="embedded-collapse" :border="false">
            <van-collapse-item
              title=" "
              :border="false"
              v-for="(item, index) in memberInfos"
              :key="index"
              :name="index"
            >
              <template #right-icon>
                <router-link :to="{ path: '/safetyDuty/dutyTest/leadershipRatingToEmployees', query: item }">
                  <span class="color-auxiliary">评分</span>
                </router-link>
              </template>
              <div class="label">责任人员</div>
              <div class="value1">{{ item.dutyPersonnelName }}</div>
              <div v-if="item.selfRatingTotal">
                <div class="label">自评分</div>
                <div class="value1">{{ item.selfRatingTotal }}分</div>
              </div>
              <div v-if="item.testScoreTotal">
                <div class="label">考核分</div>
                <div class="value1">{{ item.testScoreTotal }}分</div>
              </div>
            </van-collapse-item>
            <div v-if="!isNaN(totalPoints.target)">
              <div class="label">目标总分</div>
              <div class="value1">{{ totalPoints.target }}</div>
            </div>
            <div v-if="!isNaN(totalPoints.selfAssessment)">
              <div class="label">自评总分</div>
              <div class="value1">{{ totalPoints.selfAssessment }}</div>
            </div>
            <!-- <div v-if="!isNaN(totalPoints.test)">
              <div class="label">考核总分</div>
              <div class="value1">{{ totalPoints.test }}</div>
            </div> -->
          </van-collapse>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton position="fixed">
      <SubmitButtonItem @click="oneClickSync">一键同步评分</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSubmit">提交</SubmitButtonItem>
    </SubmitButton>
    <van-dialog v-model="syncDialog" :show-confirm-button="false" closeOnClickOverlay class="dialog-certificate">
      <div class="content">
        <div class="cancle-wrapper clearfix">
          <van-icon name="bm-systemClose" class="icon-size-16 color-text-auxiliary right" @click="syncDialog = false" />
        </div>
        <p>一键同步评分：</p>
        <p>考核自评分可一键同步为考核分，安全责任领导需对每位安全责任人员考核分进行确认。</p>
        <p>安全责任制落实情况可参考“员工评分参考依据”。</p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { DutyBookInfo } from '../components'
import { Dialog, Toast } from 'vant'
import { dutyAssessInfo, leaderGrade, leaderAssess, syncGrade } from '@/api/safetyDuty'

export default {
  name: 'LeadershipRating',
  components: { DutyBookInfo },
  data() {
    return {
      syncDialog: false,
      activeNames: ['2'],
      stepActive: 1,
      steps: [
        { title: '员工自评', time: '' },
        { title: '领导评分', time: '' },
        { title: '流程结束', time: '' }
      ],
      giveAmarkActives: [],
      memberInfos: [],
      processCode: '',
      details: {},
      schedule: '',
      totalPoints: {
        target: 0,
        selfAssessment: 0,
        test: 0
      }
    }
  },
  methods: {
    onClickSubmit() {
      for (const item of this.memberInfos) {
        if (item.testScoreTotal == null || item.testScoreTotal.length === 0) {
          Toast('请填写必填项')
          return
        }
      }

      Dialog.confirm({
        message: '确认提交评分？'
      })
        .then(() => {
          const req = {
            id: this.id,
            processCode: this.$route.query.processCode,
            taskId: this.$route.query.taskId,
            code: this.$route.query.code
          }
          leaderAssess(req)
            .then(() => {
              Toast('评分提交成功')
              this.$router.go(-1)
            })
            .catch(() => {})
        })
        .catch(() => {
          // on cancel
        })
    },
    // 一键同步
    oneClickSync() {
      Dialog.confirm({
        message: '确认同步评分？'
      })
        .then(() => {
          Toast('评分同步成功')
          const req = {
            code: this.$route.query.code
          }
          syncGrade(req)
            .then(() => {
              Toast('一键同步成功')
              this.gradeInfo()
            })
            .catch(() => {})
        })
        .catch(() => {
          // on cancel
        })
    },
    getDetails() {
      const params = {
        assessId: this.id
      }
      dutyAssessInfo(params)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.processCode || ''
          this.schedule = data.schedule || '1'
          switch (
            this.schedule // 流程进度:1.责任人2.责任领导3.结束
          ) {
            case '1':
              this.stepActive = 0
              break
            case '2':
              this.steps[0].title = '员工自评（已完成）'
              this.steps[1].title = '领导评分（进行中）'
              this.stepActive = 1
              break
            case '3':
              this.steps[0].title = '员工自评（已完成）'
              this.steps[1].title = '领导评分（已完成）'
              this.stepActive = 3
              break
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async gradeInfo() {
      const req = {
        code: this.$route.query.code,
        limit: 10000,
        offset: 0
      }
      const res = await leaderGrade(req)
      this.memberInfos = res.data.rows
      for (const index in this.memberInfos) {
        this.giveAmarkActives.push(parseInt(index))
      }
      this.updateScore()
    },
    // 跳转员工评分依据
    pushMemberReference() {
      var userIds = this.memberInfos.map(item => {
        return item.dutyPersonnelId
      })
      console.log('userIds=', userIds)
      this.$router.push({
        path: '/safetyDuty/dutyTest/dutyScoreDescribe',
        query: { userIds: userIds }
      })
    },
    // 更新总分
    updateScore() {
      if (!this.memberInfos) {
        return
      }
      // 获取目标总分
      var scoreObj = this.memberInfos.reduce(
        (sumSoFar, item) => {
          return {
            target: sumSoFar.target + item.grade,
            selfAssessment: sumSoFar.selfAssessment + item.selfRatingTotal,
            test: sumSoFar.test + item.testScoreTotal
          }
        },
        {
          target: null,
          selfAssessment: null,
          test: null
        }
      )
      this.totalPoints = scoreObj
      // console.log('scoreObj=', scoreObj)
    }
  },
  created() {
    this.getDetails()
    this.gradeInfo()

    if (this.$route.query.showSyncDialog !== 'true') {
      this.syncDialog = true
      const newQuery = JSON.parse(JSON.stringify(this.$route.query))
      newQuery.showSyncDialog = true
      this.$router.replace({
        query: newQuery
      })
    }
  },
  computed: {
    id() {
      return this.$route.query.assessId
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.dialog-certificate {
  width: 350px;
  top: 50%;
  .content {
    padding: 12px 12px 0 26px;
    height: calc(100vh * 0.7);
    // .cancle-wrapper {
    //   margin-bottom: 8.4px;
    // }
    // h4 {
    //   font-size: $font-size-sm;
    //   color: $color-text-auxiliary;
    //   margin-bottom: 4.3px;
    // }
    p {
      font-size: $font-size-m;
      color: $color-text-primary;
      margin-bottom: 20px;
      &.overdue {
        color: $color-red;
      }
    }
  }
}
</style>
