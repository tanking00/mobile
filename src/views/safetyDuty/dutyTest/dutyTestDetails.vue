<!-- 责任书考核详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="安全责任书信息" :disabled="false">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <DutyBookInfo :details="details.signDetail" hasYear></DutyBookInfo>
        </van-collapse-item>
        <van-collapse-item name="2" title="评分信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <van-collapse v-if="grades" v-model="giveAmark" class="embedded-collapse" :border="false">
            <div v-if="taskDefKey === 'UserTask-leader-assess'">
              <van-collapse-item
                v-for="(item, index) in grades"
                :key="index"
                :title="'信息' + (index + 1)"
                class="evaluated"
              >
                <div class="label">责任人员</div>
                <div class="value2">{{ item.dutyPersonnelName }}</div>
                <div class="label">自评分</div>
                <div class="value2">{{ item.selfRatingTotal }}</div>
                <div class="label">考核分</div>
                <div class="value2">{{ item.testScoreTotal }}</div>
              </van-collapse-item>
            </div>
            <div v-else>
              <van-collapse-item
                v-for="(item, index) in grades"
                :key="index"
                :title="'一级指标：' + item.indexOneName"
                icon="checked"
                class="evaluated"
              >
                <div class="label">二级指标：{{ item.indexTwo }}</div>
                <div class="label">目标：{{ item.target }}</div>
                <div class="label" v-if="item.grade">总分：{{ item.grade }}</div>
                <div class="label">评分方法：{{ item.gradeWay }}</div>
                <div v-if="item.selfRating">
                  <div class="value2">自评分：{{ item.selfRating }}</div>
                  <div class="value2">自评分说明：{{ item.selfRatingExplain }}</div>
                </div>
                <div v-if="item.testScore">
                  <div class="value2">领导评分：{{ item.testScore }}</div>
                  <div class="value2">领导评分说明：{{ item.testScoreExplain }}</div>
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
              <div v-if="!isNaN(totalPoints.test)">
                <div class="label">考核总分</div>
                <div class="value1">{{ totalPoints.test }}</div>
              </div>
            </div>
          </van-collapse>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
  </div>
</template>

<script>
import { dutyAssessInfo, staffGrade, getStaffGradeForUser, leaderGrade } from '@/api/safetyDuty'
import { isTrue, getDropdownDataOfCode } from '@/utils'
import { DutyBookInfo } from '../components'

export default {
  name: 'DutyTestDetails',
  components: { DutyBookInfo },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      giveAmark: [],
      stepActive: 0,
      steps: [
        { title: '员工自评(进行中)', time: '' },
        { title: '领导评分', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      details: {},
      grades: [],
      schedule: '',
      typeOption: [],
      totalPoints: {
        target: 0,
        selfAssessment: 0,
        test: 0
      }
    }
  },
  methods: {
    getDetails() {
      if (this.taskDefKey === 'UserTask-employee-assess') {
        // 任务中心个人
        const params = {
          code: this.code,
          userId: this.$store.getters.id
        }
        getStaffGradeForUser(params)
          .then(res => {
            const { data } = res
            this.setupReqData(data)
            this.getStaffGrade(data.id)
          })
          .catch(err => {
            console.log(err)
          })
        return
      }
      const params1 = {
        assessId: this.id
      }
      dutyAssessInfo(params1)
        .then(async res => {
          const { data } = res
          this.setupReqData(data)
          if (this.taskDefKey === 'list') {
            this.getStaffGrade(data.id)
          } else {
            // 任务中心领导
            const params2 = {
              code: this.code,
              limit: 10000,
              offset: 0
            }
            const res2 = await leaderGrade(params2)
            this.grades = res2.data.rows
            this.updateScore()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    setupReqData(data) {
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
          // this.steps[0].time = this.dutyLeaderSignatureDate
          this.steps[1].title = '领导评分（进行中）'
          this.stepActive = 1
          break
        case '3':
          this.steps[0].title = '员工自评（已完成）'
          // this.steps[0].time = this.dutyLeaderSignatureDate
          this.steps[1].title = '领导评分（已完成）'
          // this.steps[1].time = this.dutyPersonnelSignatureDate
          this.stepActive = 3
          break
      }
    },
    getStaffGrade(id) {
      const params = {
        assessId: id
      }
      staffGrade(params)
        .then(res => {
          const data = res.data
          this.grades = data
          this.updateIndexOneName()
          this.updateScore()
        })
        .catch(err => {
          console.log(err)
        })
    },

    updateIndexOneName() {
      if (!this.typeOption) {
        return
      }
      if (!this.grades) {
        return
      }
      this.grades.forEach(item => {
        item.indexOneName = ''
        this.typeOption.forEach(typeItem => {
          if (item.indexOne === typeItem.value) {
            item.indexOneName = typeItem.text
          }
        })
      })
    },
    // 更新总分
    updateScore() {
      if (!this.grades) {
        return
      }
      // 获取目标总分
      var scoreObj = this.grades.reduce(
        (sumSoFar, item) => {
          return {
            target: sumSoFar.target + item.grade,
            selfAssessment: sumSoFar.selfAssessment + item.selfRating,
            test: sumSoFar.test + item.testScore
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
  async created() {
    this.typeOption = await getDropdownDataOfCode('duty_target_first')
    this.getDetails()
    // this.updateIndexOneName()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    type() {
      return this.$route.query.type
    },
    isTrue() {
      return isTrue
    },
    code() {
      return this.$route.query.code
    },
    taskDefKey() {
      return this.$route.query.taskDefKey
    }
  }
}
</script>
