<!-- Created by Tanking. -->
<!-- 责任书信息 -->
<template>
  <div>
    <div class="label">一级指标</div>
    <div class="value1">{{ details.indexOneName }}</div>
    <div class="label">二级指标</div>
    <div class="value1 pre-wrap">{{ details.indexTwo }}</div>
    <div class="label">考核内容</div>
    <div class="value1 targets">
      <table>
        <thead>
          <tr>
            <td>安全责任岗位</td>
            <td>目标</td>
            <td>评分</td>
            <td>评分方法</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in details.contents" :key="index">
            <td>{{ item.safetyJobName }}</td>
            <td>{{ item.target }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.gradeWay }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="label">备注</div>
    <div class="value1 pre-wrap">{{ details.remark }}</div>
  </div>
</template>

<script>
export default {
  name: 'DutyTestInfo',
  components: {},
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    },
    hasYear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.targets {
  table {
    border-radius: 4px;
    width: 100%;
    padding: 0;
    border-collapse: collapse;
    thead {
      tr {
        background: #f8f9fc;
      }
    }
    tbody {
      tr {
        background: $color-white;
        font-size: $font-size-sm;
        color: #666666;
      }
    }
    tr {
      text-align: center;
      width: 100%;
      line-height: 20px;
      vertical-align: middle;
      td {
        border: 1px solid #e8e8e8;
        text-align: center;
        min-height: 32px;
        padding: 6px 12px;
        &:nth-of-type(1) {
          width: 25%;
        }
        &:nth-of-type(2) {
          width: 25%;
        }
        &:nth-of-type(3) {
          width: 25%;
        }
        &:nth-of-type(4) {
          width: 25%;
        }
      }
    }
  }
}
.indexContent {
  font-size: $font-size-sm !important;
  line-height: 20px !important;
}
</style>
