<!-- Created by Tanking. -->
<!-- 特殊提交按钮项 -->
<template>
  <div class="van-button-wrapper" @click="onClick">
    <van-icon :name="icon" class="icon-size-20 color-text-auxiliary" />
    <span class="color-text-primary font-size-sm">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'SubmitButtonSpecial',
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 文字
    text: {
      type: String,
      default: '转办指派'
    },
    // 图标
    icon: {
      type: String,
      default: 'bm-turn'
    }
  },
  data() {
    return {}
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return
      }
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.van-button-wrapper {
  flex-shrink: 0;
  padding: 0 8px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  &:nth-last-of-type(1) {
    margin-right: 0;
  }
}
</style>
