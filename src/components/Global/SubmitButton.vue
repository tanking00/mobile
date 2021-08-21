<!-- Created by Tanking. -->
<!-- 提交按钮 -->
<template>
  <div
    :class="{
      'container-submitButton-relative': position === 'relative',
      'container-submitButton-absolute': position === 'absolute',
      'container-submitButton-fixed': position === 'fixed',
      'container-supports': position === 'fixed'
    }"
  >
    <div v-if="text" class="button-wrapper">
      <van-button round :type="type" :disabled="disabled" @click="onClick">{{ text }}</van-button>
    </div>
    <div v-else class="buttons-wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    // 位置显示方式：可选relative(不固定)、fixed（固定页面底部）、absolute（固定容器底部）
    position: {
      type: String,
      default: 'fixed'
    },
    // 按钮类型文字，单个按钮需要传
    text: {
      type: String,
      default: ''
    },
    // 按钮类型，控制颜色的
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
.container-submitButton-relative {
  width: 100%;
  .button-wrapper {
    padding: 10px 20px 20px 20px;
  }
  .buttons-wrapper {
    padding: 9px 12px 20px 12px;
  }
}
.container-submitButton-absolute {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.03);
  background-color: $color-white;
  .button-wrapper {
    padding: 9px 20px 9px 20px;
  }
  .buttons-wrapper {
    padding: 9px 12px 9px 12px;
  }
}
.container-submitButton-fixed {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.03);
  background-color: $color-white;
  .button-wrapper {
    padding: 9px 20px 9px 20px;
  }
  .buttons-wrapper {
    padding: 9px 12px 9px 12px;
  }
}
.button-wrapper {
  width: 100%;
  .van-button {
    width: 100%;
    font-size: $font-size-ml;
  }
}
.buttons-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
