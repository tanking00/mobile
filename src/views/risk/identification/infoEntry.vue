<!-- Created by Tanking. -->
<!-- 危险源录入 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="title" left-arrow fixed placeholder @click-left="$router.go(-1)">
      <template #left>
        <van-icon name="bm-guanbi" class="icon-size-20" />
      </template>
    </van-nav-bar>
    <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
      <div class="field-wrapper">
        <van-field
          v-model="riskType"
          name="风险类型"
          label="风险类型"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="id ? false : true"
          size="large"
          @click="!id ? (showPickerType = true) : ''"
          :rules="[{ required: true, message: '请选择风险类型' }]"
        />
        <van-field
          v-if="riskType === '其他'"
          v-model="otherRiskType"
          name="风险类型"
          rows="2"
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写风险类型' }]"
          show-word-limit
        />
      </div>
      <div v-if="riskType && riskType !== '其他'" class="field-wrapper not-margin-bottom">
        <van-field
          v-model="sourceDanger"
          name="危险源"
          label="危险源"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="id ? false : true"
          size="large"
          @click="!id ? (showPickerSourceDanger = true) : ''"
          :rules="[{ required: true, message: '请选择危险源' }]"
        />
      </div>
      <div
        v-if="riskType && riskType !== '其他'"
        class="field-wrapper not-margin-top not-margin-bottom van-hairline--top"
      >
        <van-field
          v-model="accidentConsequence"
          name="事故后果"
          label="事故后果"
          placeholder=""
          readonly
          input-align="right"
          size="large"
          :rules="[{ required: true, message: '请填写事故后果' }]"
        />
      </div>
      <div v-if="riskType && riskType !== '其他'" class="field-wrapper not-margin-top van-hairline--top">
        <van-field
          v-model="controlStatus"
          name="控制现状"
          label="控制现状"
          placeholder=""
          readonly
          input-align="right"
          size="large"
          :rules="[{ required: true, message: '请填写控制现状' }]"
        />
      </div>
      <div v-if="riskType === '其他'" class="field-wrapper">
        <div class="form-label-required">危险源</div>
        <van-field
          v-model="sourceDanger"
          name="危险源"
          rows="2"
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写危险源' }]"
          show-word-limit
        />
      </div>
      <div v-if="riskType === '其他'" class="field-wrapper">
        <div class="form-label-required">事故后果</div>
        <van-field
          v-model="accidentConsequence"
          name="事故后果"
          rows="2"
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写事故后果' }]"
          show-word-limit
        />
      </div>
      <div v-if="riskType === '其他'" class="field-wrapper">
        <div class="form-label-required">控制现状</div>
        <van-field
          v-model="controlStatus"
          name="控制现状"
          rows="2"
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写控制现状' }]"
          show-word-limit
        />
      </div>
      <div class="field-wrapper">
        <van-field name="manageSystem">
          <template #input>
            <div class="default-multipleChoice" @click="showSearchSystemsPanel = true">
              <div class="label">相关管理制度</div>
              <div class="content">
                <div v-if="manageSystemList && manageSystemList.length > 0" class="value">
                  <div v-for="(item, index) in manageSystemList" :key="item.regimeName" class="item">
                    {{ item.regimeName }}
                    <van-icon
                      name="close"
                      class="icon-size-16 color-text-auxiliary margin-left-4"
                      @click.stop="onDelSystem(index)"
                    />
                  </div>
                </div>
                <div v-else class="placeholder">请选择</div>
                <van-icon name="bm-systemRightarrow" class="icon-size-16 color-text-auxiliary" />
              </div>
            </div>
          </template>
        </van-field>
      </div>
      <div class="field-wrapper">
        <van-field name="meetPlan">
          <template #input>
            <div class="default-multipleChoice" @click="showReservePlansPanel = true">
              <div class="label">相关应急预案</div>
              <div class="content">
                <div v-if="meetPlanList && meetPlanList.length > 0" class="value">
                  <div v-for="(item, index) in meetPlanList" :key="item.planName" class="item">
                    {{ item.planName }}
                    <van-icon
                      name="close"
                      class="icon-size-16 color-text-auxiliary margin-left-4"
                      @click.stop="onDelReservePlan(index)"
                    />
                  </div>
                </div>
                <div v-else class="placeholder">请选择</div>
                <van-icon name="bm-systemRightarrow" class="icon-size-16 color-text-auxiliary" />
              </div>
            </div>
          </template>
        </van-field>
      </div>
      <div class="label-score">
        LEC风险评价
        <van-icon name="bm-systemVersionabout" class="icon-size-14 color-text-secondary" @click="showTips = true" />
      </div>
      <div class="field-wrapper not-margin-bottom">
        <van-field
          :label-width="labelWidthL"
          v-model="possibilityText"
          name="L"
          label="事故发生的可能性(L)"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showPickerL = true"
          :rules="[{ required: true, message: '请选择事故发生的可能性(L)' }]"
        />
      </div>
      <div class="field-wrapper not-margin-top not-margin-bottom van-hairline--top">
        <van-field
          :label-width="labelWidthE"
          v-model="oftenText"
          name="E"
          label="暴露的频繁程度(E)"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showPickerE = true"
          :rules="[{ required: true, message: '请选择暴露的频繁程度(E)' }]"
        />
      </div>
      <div class="field-wrapper not-margin-top not-margin-bottom van-hairline--top">
        <van-field
          :label-width="labelWidthC"
          v-model="consequenceText"
          name="C"
          label="发生事故产生的后果(C)"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showPickerC = true"
          :rules="[{ required: true, message: '请选择发生事故产生的后果(C)' }]"
        />
      </div>
      <div v-show="showScore" class="field-wrapper not-margin-top van-hairline--top">
        <div class="wrapper-score">
          <div>{{ scoreLabel }}</div>
          <div>
            风险等级：
            <span
              :class="{
                'color-red': judgeHasClass(scoreText, '1级风险'),
                'color-orange': judgeHasClass(scoreText, '2级风险'),
                'color-yellow': judgeHasClass(scoreText, '3级风险'),
                'color-blue': judgeHasClass(scoreText, '4级风险')
              }"
              >{{ scoreText }}</span
            >
          </div>
        </div>
      </div>
    </van-form>
    <SubmitButton>
      <SubmitButtonItem @click="$router.go(-1)" type="gray">取消</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSubmit">保存</SubmitButtonItem>
    </SubmitButton>
    <SearchSystemsPanel v-model="showSearchSystemsPanel" @select="onSelectSystems"></SearchSystemsPanel>
    <SearchReservePlansPanel v-model="showReservePlansPanel" @select="onSelectReservePlans"></SearchReservePlansPanel>
    <van-dialog v-model="showTips" title="" :showConfirmButton="false" :width="dialogWidth" closeOnClickOverlay>
      <div class="wrapper-tips">
        <div class="cancel-btn">
          <van-icon
            name="bm-systemClose"
            class="icon-size-16 color-text-auxiliary"
            @click="showTips = false"
            close-on-click-overlay
          />
        </div>
        <div class="tips-content">
          LEC评价法是对具有潜在危险性作业环境中的危险源进行半定量的安全评价方法，用于评价操作人员在具有潜在危险性环境中作业时的危险性、危害性。<br /><br />
          该方法用与系统风险有关的三种因素指标值的乘积来评价操作人员伤亡风险大小，这三种因素分别是：L（likelihood，事故发生的可能性）、E（exposure，人员暴露于危险环境中的频繁程度）和C（consequence，一旦发生事故可能造成的后果）。<br /><br />
          给三种因素的不同等级分别确定不同的分值，再以三个分值的乘积D（danger，危险性）来评价作业条件危险性的大小，即：D=L×E×C。<br /><br />
          风险分值D=LEC。D值越大，说明该系统危险性大。<br /><br />
          超过 320 非常高的风险，要停止作业 A <br />
          160 至 320 高风险，需要立即整改 B<br />
          70 至 160 中等风险，需要整改 C<br />
          20 至 70 可能的风险， 需要注意 D<br />
          20 以下 可接受的风险， 容忍 E
        </div>
      </div>
    </van-dialog>
    <van-popup v-model="showPickerType" round position="bottom">
      <van-picker show-toolbar :columns="columnsType" @cancel="showPickerType = false" @confirm="onConfirmType" />
    </van-popup>
    <van-popup v-model="showPickerSourceDanger" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columnsSourceDanger"
        @cancel="showPickerSourceDanger = false"
        @confirm="onConfirmSourceDanger"
      />
    </van-popup>
    <van-popup v-model="showPickerL" round position="bottom">
      <van-picker show-toolbar :columns="columnsL" @cancel="showPickerL = false" @confirm="onConfirmL" />
    </van-popup>
    <van-popup v-model="showPickerE" round position="bottom">
      <van-picker show-toolbar :columns="columnsE" @cancel="showPickerE = false" @confirm="onConfirmE" />
    </van-popup>
    <van-popup v-model="showPickerC" round position="bottom">
      <van-picker show-toolbar :columns="columnsC" @cancel="showPickerC = false" @confirm="onConfirmC" />
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getDictOfCode } from '@/api/global'
import { getSourceQueryList, getRiskEvaluate, addRiskEvaluate, editRiskEvaluate } from '@/api/risk'
import { pxTransform, judgeHasClass, judgeArrHasValue, decimalMultiplication } from '@/utils'
import { SearchSystemsPanel, SearchReservePlansPanel } from '../components'

export default {
  name: 'RiskIdentificationInfoEntry',
  components: { SearchSystemsPanel, SearchReservePlansPanel },
  data() {
    return {
      title: '添加危险源',
      showTips: false,
      // 风险类型
      showPickerType: false,
      columnsType: [],
      riskType: '',
      riskTypeId: '',
      otherRiskType: '',
      // 危险源
      showPickerSourceDanger: false,
      columnsSourceDanger: [],
      sourceDanger: '',
      // 事故后果
      accidentConsequence: '',
      // 控制现状
      controlStatus: '',
      // 相关管理制度
      showSearchSystemsPanel: false,
      manageSystem: '',
      manageSystemList: [],
      // 相关应急预案
      showReservePlansPanel: false,
      meetPlan: '',
      meetPlanList: [],
      // L
      showPickerL: false,
      columnsL: [],
      lscore: '',
      possibility: '',
      possibilityText: '',
      // E
      showPickerE: false,
      columnsE: [],
      escore: '',
      often: '',
      oftenText: '',
      // C
      showPickerC: false,
      columnsC: [],
      cscore: '',
      consequence: '',
      consequenceText: '',
      // D
      showScore: false,
      score: '',
      scoreText: '',
      scoreLabel: ''
    }
  },
  methods: {
    // 获取详情
    getRiskEvaluate() {
      getRiskEvaluate(this.id)
        .then(res => {
          const { data } = res
          this.riskType = data.riskType
          this.sourceDanger = data.sourceDanger
          this.accidentConsequence = data.accidentConsequence
          this.controlStatus = data.controlStatus
          this.manageSystem = data.manageSystem
          if (this.manageSystem) {
            this.manageSystem = this.manageSystem.split(',')
            this.manageSystem.forEach(item => {
              if (!judgeArrHasValue(this.manageSystemList, item, 'regimeName')) {
                this.manageSystemList.push({ regimeName: item })
              }
            })
          }
          this.meetPlan = data.meetPlan
          if (this.meetPlan) {
            this.meetPlan = this.meetPlan.split(',')
            this.meetPlan.forEach(item => {
              if (!judgeArrHasValue(this.meetPlanList, item, 'planName')) {
                this.meetPlanList.push({ planName: item })
              }
            })
          }
          this.lscore = data.lscore || ''
          this.possibility = data.possibility || ''
          if (this.lscore) {
            this.possibilityText = `${data.possibility}(${data.lscore})`
          }
          this.escore = data.escore || ''
          this.often = data.often || ''
          if (this.escore) {
            this.oftenText = `${data.often}(${data.escore})` || ''
          }
          this.cscore = data.cscore || ''
          this.consequence = data.consequence || ''
          if (this.cscore) {
            this.consequenceText = `${data.consequence}(${data.cscore})` || ''
          }
          this.getAllScore()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击提交按钮
    onClickSubmit() {
      this.$refs['form'].submit()
    },
    // 表单错误回调
    onFailedForm(info) {
      Toast(info.errors[0].message)
    },
    // 表单正确回调
    onSubmitForm() {
      Dialog.confirm({
        message: '确认要保存嘛？'
      })
        .then(() => {
          const isOther = this.riskType === '其他' ? 2 : 1

          const manageSystem = []
          this.manageSystemList.forEach(item => {
            manageSystem.push({ id: item.id, name: item.regimeName })
          })
          const meetPlan = []
          this.meetPlanList.forEach(item => {
            meetPlan.push({ id: item.id, name: item.planName })
          })
          const req = {
            manageSystem: JSON.stringify(manageSystem),
            meetPlan: JSON.stringify(meetPlan),
            riskType: isOther === 2 ? this.otherRiskType : this.riskType,
            sourceDanger: this.sourceDanger,
            accidentConsequence: this.accidentConsequence,
            controlStatus: this.controlStatus,
            possibility: this.possibility,
            often: this.often,
            consequence: this.consequence,
            score: this.score,
            grade: this.scoreText,
            isOther: isOther,
            processNumber: this.processNumber,
            depId: this.$store.getters.primaryOrg?.id || '',
            lscore: this.lscore,
            escore: this.escore,
            cscore: this.cscore,
            operatorId: this.$store.getters.id,
            id: this.id || null,
            safeStatus: ''
          }
          if (this.id) {
            this.editEvaluate(req)
          } else {
            this.addEvaluate(req)
          }
        })
        .catch(() => {})
    },
    // 获取风险类型
    getRiskType() {
      getDictOfCode('hzd_risk_type')
        .then(res => {
          const { data } = res
          this.columnsType = []
          data.forEach(item => {
            this.columnsType.push({ text: item.label, value: item.value })
          })
          this.columnsType.push({ text: '其他', value: 'other' })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择风险类型回调
    onConfirmType(data) {
      this.showPickerType = false
      this.riskType = data.text
      if (this.riskType !== '其他') {
        this.getSourceDanger(data.value)
      }
    },
    // 获取危险源
    getSourceDanger(type) {
      getSourceQueryList(type)
        .then(res => {
          const { data } = res
          const list = data
          this.columnsSourceDanger = []
          list.forEach(item => {
            this.columnsSourceDanger.push({
              text: item.sourceDanger,
              id: item.id,
              accidentConsequence: item.accidentConsequence,
              controlStatus: item.controlStatus
            })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择危险源回调
    onConfirmSourceDanger(data) {
      this.showPickerSourceDanger = false
      this.sourceDanger = data.text
      this.accidentConsequence = data.accidentConsequence
      this.controlStatus = data.controlStatus
    },
    // 获取L
    getRiskScoreL() {
      getDictOfCode('hzd_acdt_pbty')
        .then(res => {
          const { data } = res
          this.columnsL = []
          data.forEach(item => {
            this.columnsL.push({ text: item.label, value: item.value, score: item.remark })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择L回调
    onConfirmL(data) {
      this.showPickerL = false
      const score = parseFloat(data.score.split('分')[0])
      this.possibility = data.text
      this.lscore = score
      this.possibilityText = `${data.text}(${score})`
      this.getAllScore()
    },
    // 获取E
    getRiskScoreE() {
      getDictOfCode('hzd_fre_exp')
        .then(res => {
          const { data } = res
          this.columnsE = []
          data.forEach(item => {
            this.columnsE.push({ text: item.label, value: item.value, score: item.remark })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择E回调
    onConfirmE(data) {
      this.showPickerE = false
      const score = parseFloat(data.score.split('分')[0])
      this.often = data.text
      this.escore = score
      this.oftenText = `${data.text}(${score})`
      this.getAllScore()
    },
    // 获取C
    getRiskScoreC() {
      getDictOfCode('hzd_accidt_after')
        .then(res => {
          const { data } = res
          this.columnsC = []
          data.forEach(item => {
            this.columnsC.push({ text: item.label, value: item.value, score: item.remark })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择C回调
    onConfirmC(data) {
      this.showPickerC = false
      const score = parseFloat(data.score.split('分')[0])
      this.consequence = data.text
      this.cscore = score
      this.consequenceText = `${data.text}(${score})`
      this.getAllScore()
    },
    // 获取总分
    getAllScore() {
      if (this.lscore && this.escore && this.cscore) {
        this.showScore = true
        this.score = decimalMultiplication(decimalMultiplication(this.lscore, this.escore), this.cscore)
        this.scoreLabel = `分数值(D)：${this.lscore}*${this.escore}*${this.cscore}=${this.score}`
        if (this.score < 70) {
          this.scoreText = '4级风险'
        } else if (this.score >= 70 && this.score < 160) {
          this.scoreText = '3级风险'
        } else if (this.score >= 160 && this.score < 320) {
          this.scoreText = '2级风险'
        } else {
          this.scoreText = '1级风险'
        }
      } else {
        this.showScore = false
      }
    },
    // 新增
    addEvaluate(req) {
      addRiskEvaluate(req)
        .then(res => {
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑
    editEvaluate(req) {
      editRiskEvaluate(req)
        .then(res => {
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 管理制度回调
    onSelectSystems(data) {
      if (!judgeArrHasValue(this.manageSystemList, data.regimeName, 'regimeName')) {
        this.manageSystemList.push(data)
      }
    },
    // 管理制度删除
    onDelSystem(index) {
      this.manageSystemList.splice(index, 1)
    },
    // 应急预案回调
    onSelectReservePlans(data) {
      if (!judgeArrHasValue(this.meetPlanList, data.planName, 'planName')) {
        this.meetPlanList.push(data)
      }
    },
    // 应急预案删除
    onDelReservePlan(index) {
      this.meetPlanList.splice(index, 1)
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getRiskEvaluate()
    }
    if (this.$route.query.type === 10) {
      this.title = '添加危险源'
    } else if (this.$route.query.type === 20) {
      this.title = '评价危险源'
    } else if (this.$route.query.type === 30) {
      this.title = '编辑危险源'
    }
    this.getRiskType()
    this.getRiskScoreL()
    this.getRiskScoreE()
    this.getRiskScoreC()
  },
  computed: {
    processNumber() {
      return this.$route.query.processNumber
    },
    id() {
      return this.$route.query.id
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    labelWidthL() {
      return pxTransform(140)
    },
    labelWidthE() {
      return pxTransform(125)
    },
    labelWidthC() {
      return pxTransform(155)
    },
    dialogWidth() {
      return pxTransform(350)
    },
    judgeHasClass() {
      return judgeHasClass
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.field-wrapper {
  margin: $space-vertical 0;
  background-color: $color-white;
  .field-label {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 12px;
  }
  .field-label-required {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 24px;
    position: relative;
    &::before {
      position: absolute;
      left: -12px;
      color: #ed3458;
      font-size: $font-size-m;
      content: '*';
    }
  }
}
.item-content {
  padding: 12px 20px 18px 20px;
  .item-content-item {
    .item-label {
      color: $color-text-primary;
      font-size: $font-size-ml;
      position: relative;
      margin-left: 12px;
      margin-bottom: 14px;
      &::before {
        position: absolute;
        left: -12px;
        color: #ed3458;
        font-size: $font-size-m;
        content: '*';
      }
    }
    .van-radio-group {
      margin-bottom: 16px;
      .van-radio {
        margin-right: 24px;
      }
    }
    &:nth-last-of-type(1) {
      .van-radio-group {
        margin-bottom: 0;
      }
    }
  }
}
.form-label-required {
  margin-top: 0;
  padding-top: 10px;
}
.form-label {
  margin-top: 0;
  padding-top: 10px;
}
.field-wrapper {
  &.not-margin-top {
    margin-top: 0;
  }
  &.not-margin-bottom {
    margin-bottom: 0;
  }
}
.wrapper-tips {
  padding: 12px;
  .cancel-btn {
    text-align: right;
  }
  .tips-content {
    padding: 0 14px;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
}
.label-score {
  padding-left: 16px;
  color: $color-text-primary;
  font-size: $font-size-m;
}
.wrapper-score {
  padding: 14px 12px;
  display: flex;
  justify-content: space-between;
}
</style>
