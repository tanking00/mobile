<!-- Created by Tanking. -->
<!-- 计划信息 -->
<template>
  <div>
    <div class="label">制定人员</div>
    <div class="value1">{{ details.enactPerson }}</div>
    <div class="label">制定部门</div>
    <div class="value1">{{ details.enactDept }}</div>
    <div v-if="details.equipmentType" class="label">设施设备名称</div>
    <div v-if="details.equipmentType" class="value1">{{ details.equipmentType }}</div>
    <div v-if="details.planName" class="label">{{ getName(planType) ? getName(planType) : '计划名称' }}</div>
    <div v-if="details.planName" class="value1">{{ details.planName }}</div>
    <div v-if="details.planType" class="label">预案分类</div>
    <div v-if="details.planType" class="value1">{{ details.planType }}</div>
    <div v-if="details.checkType" class="label">检查类型</div>
    <div v-if="details.checkType" class="value1">{{ details.checkType }}</div>
    <div class="label">责任人员</div>
    <div class="value1">{{ details.personLiable }}</div>
    <div class="label">责任部门</div>
    <div class="value1">{{ details.liableDept }}</div>
    <div v-if="details.checkDTOList" class="label">检查表</div>
    <div v-if="details.checkDTOList" class="value items">
      <table>
        <thead>
          <tr>
            <td>检查项目</td>
            <td>检查内容</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in details.checkDTOList" :key="index">
            <td>{{ item.itemName }}</td>
            <td>{{ item.itemContent }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="label">计划完成日期</div>
    <div class="value1">{{ formatTimeStamp(details.executeDate, 7) }}</div>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'PlanInfo',
  components: {},
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    },
    planType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    getName(planType) {
      let res = ''
      switch (planType) {
        case '安全检查':
          res = '检查名称'
          break
        case '设备年度检查':
          res = ''
          break
        case '应急演练':
          res = '演练名称'
          break
        case '设备点检':
          res = ''
          break
        case '设备维保':
          res = ''
          break
      }
      return res
    }
  },
  created() {},
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.items {
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
          width: 50%;
        }
        &:nth-of-type(2) {
          width: 50%;
        }
      }
    }
  }
}
</style>
