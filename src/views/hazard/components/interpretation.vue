<!-- Created by Tanking. -->
<!-- 重大隐患说明 -->
<template>
  <van-dialog
    v-model="show"
    title=""
    @close="onClickClose"
    :showConfirmButton="false"
    :width="dialogWidth"
    closeOnClickOverlay
  >
    <div class="wrapper-tips">
      <div class="cancel-btn">
        <van-icon
          name="bm-systemClose"
          class="icon-size-16 color-text-auxiliary"
          @click="onClickClose"
          close-on-click-overlay
        />
      </div>
      <div class="tips-content">
        <div class="title">安全生产重大隐患说明（释义）</div>
        <div>
          1、可能引发人员重伤、死亡及火灾事故的隐患 <br />
          2、可能引发职业病事故的隐患 <br />
          3、隐患整改时间大于30天或整改需全部或者局部停产停业 <br />
          4、因外部因素影响致使公司自身难以消除的隐患 <br />
          5、根据风险评价法确定风险值大于70的隐患 满足以上所列情形任意一条，既认定为重大隐患
        </div>
        <div class="title">
          系统安全重大隐患说明（释义）
        </div>
        <div>
          涉及到需求错误、设计缺陷、配置数据异常等会直接引起撞车或脱轨等安全事故的系统性失效/单点失效类的功能安全隐患
        </div>
      </div>
    </div>
  </van-dialog>
</template>

<script>
import { pxTransform } from '@/utils'

export default {
  name: 'Interpretation',
  components: {},
  model: {
    prop: 'showTips',
    event: 'change'
  },
  props: {
    showTips: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    onClickClose() {
      this.$emit('change', false)
    }
  },
  created() {},
  mounted() {},
  computed: {
    dialogWidth() {
      return pxTransform(350)
    }
  },
  watch: {
    showTips(val, old) {
      if (val !== old && val !== this.show) {
        this.show = val
      }
    }
  }
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
