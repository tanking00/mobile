<!-- Created by Tanking. -->
<!-- 责任书信息 -->
<template>
  <div>
    <div class="label">责任书名称</div>
    <div class="value1">{{ hasYear ? details.annual + '年' + details.dutyName : details.dutyName }}</div>
    <div class="label">目的</div>
    <div class="value1 pre-wrap">{{ details.purpose }}</div>
    <div class="label">目标指标</div>
    <div class="value1 targets">
      <table>
        <thead>
          <tr>
            <td>目标</td>
            <td>指标</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in details.targets" :key="index">
            <td>{{ item.target }}</td>
            <td>{{ item.targetData }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="value1 indexContent pre-wrap">{{ details.indexContent }}</div>
    <div class="label">要求</div>
    <div class="value1 pre-wrap">{{ details.claim }}</div>
    <div v-if="details.state" class="label">逾期状态</div>
    <div v-if="details.state" class="value1">{{ details.state === '1' ? '逾期' : '正常' }}</div>
  </div>
</template>

<script>
export default {
  name: 'DutyBookInfo',
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
          width: 68%;
        }
        &:nth-of-type(2) {
          width: 32%;
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
