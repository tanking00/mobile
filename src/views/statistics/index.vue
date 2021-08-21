<template>
  <div class="container">
    <van-nav-bar
      :border="false"
      :title="$route.meta.title"
      fixed
      placeholder
      @click-right="$router.push({ path: '/newsCenter' })"
    >
      <template #right>
        <MessageButton></MessageButton>
      </template>
    </van-nav-bar>
    <CategoryColumn :categoryActive="categoryActive" @onTap="handlerOnTap"></CategoryColumn>
    <ScreenColumn
      @selectYear="onSelectYear"
      @selectReward="selectReward"
      :showReward="categoryActive === '1'"
    ></ScreenColumn>
    <main>
      <!-- 安全奖惩 - 奖励 -->
      <SafetyRewards v-if="categoryActive === '1' && rewardName === '奖励表彰'" :year="year" />
      <!-- 安全奖惩 - 惩罚 -->
      <SafetyPunishments v-if="categoryActive === '1' && rewardName === '违规处罚'" :year="year" />
      <!-- 安全检查 -->
      <SecurityCheck v-if="categoryActive === '2'" :year="year" />
      <!-- 应急管理 -->
      <EmergencyManagement v-if="categoryActive === '3'" :year="year" />
      <!-- 设备设施管理 -->
      <Maintenance v-if="categoryActive === '4'" :year="year" />
      <!-- 责任制签署考核 -->
      <SigningAssessment v-if="categoryActive === '5'" :year="year" />
      <!-- 隐患排查 -->
      <HiddenDanger v-if="categoryActive === '6'" :year="year" />
      <!-- 风险分级管控 -->
      <HierarchicalRiskControl v-if="categoryActive === '7'" :year="year" />
    </main>
    <SosButton></SosButton>
    <Footer></Footer>
  </div>
</template>

<script>
import { Footer, SosButton, MessageButton } from '@/components'
import { CategoryColumn, ScreenColumn } from './components'
import {
  SafetyRewards,
  SafetyPunishments,
  SecurityCheck,
  EmergencyManagement,
  Maintenance,
  SigningAssessment,
  HiddenDanger,
  HierarchicalRiskControl
} from './modules'
export default {
  name: 'Statistics',
  components: {
    Footer,
    SosButton,
    MessageButton,
    CategoryColumn,
    ScreenColumn,
    SafetyRewards,
    SafetyPunishments,
    SecurityCheck,
    EmergencyManagement,
    Maintenance,
    SigningAssessment,
    HiddenDanger,
    HierarchicalRiskControl
  },
  data() {
    return {
      // 当前页下标
      categoryActive: '1',
      // 年份
      year: null,
      rewardName: null
    }
  },
  methods: {
    onSelectYear(value) {
      this.year = value
    },
    selectReward(value) {
      this.rewardName = value
    },
    handlerOnTap(index) {
      this.categoryActive = index
      document.getElementById('app').scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
