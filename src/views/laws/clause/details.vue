<!-- Created by Tanking. -->
<!-- 适用条款详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="法规信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <LawInfo :id="regulationsId"></LawInfo>
        </van-collapse-item>
        <van-collapse-item name="2" title="条款信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <ClauseInfo :id="id"></ClauseInfo>
        </van-collapse-item>
        <van-collapse-item v-if="assessmentStatus === '0' || assessmentStatus === '1'" name="3" title="企业自我评估">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <EvaluateInfo :id="id"></EvaluateInfo>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { LawInfo, ClauseInfo, EvaluateInfo } from '../components'

export default {
  name: 'LawsClauseDetails',
  components: { LawInfo, ClauseInfo, EvaluateInfo },
  data() {
    return {
      activeNames: ['2']
    }
  },
  methods: {},
  created() {},
  computed: {
    id() {
      return this.$route.query.id
    },
    regulationsId() {
      return this.$route.query.regulationsId
    },
    assessmentStatus() {
      return this.$route.query.assessmentStatus
    }
  }
}
</script>
