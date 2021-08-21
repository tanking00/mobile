<!-- Created by Tanking. -->
<!-- 提交按钮项 -->
<template>
  <div class="van-button-wrapper">
    <van-button round :type="type" :disabled="disabled" @click="onClick">
      <slot />
    </van-button>
  </div>
</template>

<script>
export default {
  name: 'SubmitButtonItem',
  props: {
    // 按钮类型，控制颜色的（primary、info、default、warning、danger、gray）
    type: {
      type: String,
      default: 'info'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.van-button-wrapper {
  width: 100%;
  margin-right: 8px;
  &:nth-last-of-type(1) {
    margin-right: 0;
  }
  .van-button {
    width: 100%;
    font-size: $font-size-ml;
  }
}
</style>
