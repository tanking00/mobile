<!-- Created by Tanking. -->
<!-- 危险源详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="危险源信息" disabled>
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">风险类型</div>
            <div class="value">{{ details.riskType }}</div>
            <div class="label">危险源</div>
            <div class="value">{{ details.sourceDanger }}</div>
            <div class="label">事故后果</div>
            <div class="value">{{ details.accidentConsequence }}</div>
            <div class="label">控制现状</div>
            <div class="value">{{ details.controlStatus }}</div>
            <div class="label">危险源适用类型</div>
            <div class="value">{{ details.dangerApplyType === 0 ? '通用' : '特殊' }}</div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getSourceDataDetails } from '@/api/risk'

export default {
  name: 'RiskLibraryDetails',
  components: {},
  data() {
    return {
      activeNames: ['1'],
      details: {}
    }
  },
  methods: {
    getDetails() {
      getSourceDataDetails(this.id)
        .then(res => {
          const { data } = res
          console.log(data)
          this.details = data
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
