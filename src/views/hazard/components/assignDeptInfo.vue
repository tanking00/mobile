<!-- Created by Tanking. -->
<!-- 提报部门审核信息 -->
<template>
  <div>
    <div class="label">整改责任部门</div>
    <div class="value1">{{ details.mainDeptName || details.mainDept }}</div>
    <div class="label">部门经理</div>
    <div class="value1">{{ details.deptManager + '（' + details.deptManagerId + '）' }}</div>
    <div v-if="details.deptSuperviseId && isMajor === '1'" class="label">督办总监</div>
    <div v-if="details.deptSuperviseId && isMajor === '1'" class="value1">
      {{ details.deptSupervise + '（' + details.deptSuperviseId + '）' }}
    </div>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { pxTransform } from '@/utils'

export default {
  name: 'AssignDeptInfo',
  components: {},
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    },
    isMajor: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      showTips: false
    }
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    dialogWidth() {
      return pxTransform(350)
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.wrapper-tips {
  padding: 12px;
  .cancel-btn {
    text-align: right;
  }
  .tips-content {
    padding: 0 12px 10px 12px;
    color: $color-text-primary;
    font-size: $font-size-m;
    line-height: 28px;
    .title {
      font-weight: $font-weight;
      font-size: $font-size-ml;
      margin-top: 12px;
      margin-bottom: 4px;
    }
  }
}
</style>
