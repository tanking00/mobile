<!-- 员工自评 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="评分信息" disabled>
          <template #right-icon>
            <van-icon />
          </template>
          <van-collapse v-model="giveAmarkActives" class="embedded-collapse" :border="false">
            <van-collapse-item
              :border="false"
              v-for="(item, index) in grades"
              :key="index"
              :name="index"
              :title="'一级指标：' + item.indexOneName"
              :icon="item.selfRating != null && item.selfRating.length != 0 ? 'checked' : 'bm-systemVersionabout'"
              :class="item.selfRating != null && item.selfRating.length > 0 ? 'evaluated' : 'notEvaluated'"
            >
              <div class="label">二级指标：{{ item.indexTwo }}</div>
              <div class="label">目标：{{ item.target }}</div>
              <div class="label">总分：{{ item.grade }}</div>
              <div class="label">评分方法：{{ item.gradeWay }}</div>
              <van-form ref="form1" @submit="onClickSubmit" :show-error-message="false">
                <div class="form-label-required">自评分：</div>
                <van-field
                  v-model="item.selfRating"
                  placeholder="请填写评分"
                  type="number"
                  :formatter="$event => formatter($event, item.grade)"
                  @input="scoreChange"
                  :rules="[
                    {
                      required: true,
                      message: '请填写评分'
                    }
                  ]"
                  show-word-limit
                  class="form-textarea"
                />
                <van-field
                  v-model="item.selfRatingExplain"
                  rows="4"
                  type="textarea"
                  maxlength="50"
                  placeholder="请填写自评说明"
                  show-word-limit
                  class="form-textarea"
                />
              </van-form>
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
    </div>
    <SubmitButton @click="onClickSubmit" position="fixed" text="提交"></SubmitButton>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getStaffGradeForUser, staffAssess, staffGrade } from '@/api/safetyDuty'
import { getDropdownDataOfCode } from '@/utils'

export default {
  name: 'EmployeesSelfAssessment',
  data() {
    return {
      activeNames: ['1'],
      giveAmarkActives: [],
      grades: [],
      typeOption: [],
      assessId: '',
      totalPoints: {
        target: 0,
        selfAssessment: 0,
        test: 0
      }
    }
  },
  methods: {
    formatter(value, grade) {
      if (value < 0) {
        return '0'
      }
      if (value > grade) {
        Toast('自评分不能大于总分')
        return grade
      }
      return value
    },
    onClickSubmit() {
      if (!this.assessId) {
        Toast('assessId为空，请返回重试！')
        return
      }
      for (const item of this.grades) {
        if (!item.selfRating || item.selfRating.length === 0) {
          Toast('请填写必填项')
          return
        }
      }

      const grades = []
      this.grades.forEach(item => {
        grades.push({
          id: item.id,
          selfRating: item.selfRating,
          selfRatingExplain: item.selfRatingExplain
        })
      })
      const params = {
        gradeSubmits: grades,
        id: this.assessId,
        processCode: this.$route.query.processCode,
        taskId: this.$route.query.taskId,
        code: this.code
      }
      console.log('params=', params)
      Dialog.confirm({
        message: '确认提交评分？'
      })
        .then(() => {
          staffAssess(params)
            .then(() => {
              Toast('自评成功')
              this.$router.go(-2)
            })
            .catch(() => {
              Toast('提交失败1')
            })
        })
        .catch(() => {
          // on cancel
          Toast('提交失败2')
        })
    },
    getDetails() {
      const params = {
        userId: this.$store.getters.id,
        code: this.code
      }
      getStaffGradeForUser(params)
        .then(res => {
          const data = res.data
          this.assessId = data.id
          this.getStaffGrade(data.id)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStaffGrade(assessId) {
      const params = {
        assessId: assessId
      }
      staffGrade(params)
        .then(res => {
          const data = res.data
          this.grades = data
          this.giveAmarkActives = []
          for (let index = 0; index < this.grades.length; index++) {
            this.giveAmarkActives.push(index)
          }
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
    scoreChange() {
      this.updateScore()
    },
    // 更新总分
    updateScore() {
      // console.log("this.grades=",this.grades);
      if (!this.grades) {
        return
      }
      // 获取目标总分
      var scoreObj = this.grades.reduce(
        (sumSoFar, item) => {
          var selfAssessment = 0
          if (item.selfRating) {
            selfAssessment = parseFloat(item.selfRating)
          }
          return {
            target: sumSoFar.target + item.grade,
            selfAssessment: sumSoFar.selfAssessment + selfAssessment,
            test: sumSoFar.test + item.testScore
          }
        },
        {
          target: 0,
          selfAssessment: 0,
          test: 0
        }
      )
      this.totalPoints = scoreObj
      // console.log('scoreObj=', scoreObj)
    }
  },
  async created() {
    this.typeOption = await getDropdownDataOfCode('duty_target_first')
    this.getDetails()
    this.updateIndexOneName()
  },
  computed: {
    id() {
      return this.$route.query.assessId
    },
    code() {
      return this.$route.query.code
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
