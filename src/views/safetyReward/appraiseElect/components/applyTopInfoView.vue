<!-- 奖励评选-详情页顶部：发起信息view(评选页、详情页、审批页都有用到) -->
<template>
  <div>
    <van-collapse v-model="actives" class="default-collapse">
      <van-collapse-item name="1" title="发起信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('1') >= 0"></CollapseIcon>
        </template>
        <div class="label">提报人员</div>
        <div class="value">{{ details.submitterName }}</div>
        <div class="label">提报部门</div>
        <div class="value">{{ details.submitDeptName }}</div>
        <div class="label">奖项设置</div>
        <div class="value1 targets">
          <table>
            <thead>
              <tr>
                <td>奖项</td>
                <td>数量</td>
                <td>标准</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in details.rewards" :key="index">
                <td>{{ item.awards }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.standard }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  name: 'ApplyTopInfoView',
  props: {
    details: {
      type: Object
    }
  },
  data() {
    return {
      actives: ['1']
    }
  },
  methods: {},
  created() {},
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
        // &:nth-of-type(1) {
        //   width: 68%;
        // }
        // &:nth-of-type(2) {
        //   width: 32%;
        // }
      }
    }
  }
}
</style>
