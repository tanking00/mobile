<!-- 通用悬浮按钮 -->
<template>
  <div class="container-floatButton">
    <div class="button border-radius-circular flex-center-column color-white" :class="bgColorClass" @click="onClick">
      <van-icon :name="icon" class="icon-size-24" />
      <span v-if="text" class="font-size-xs">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatButton',
  props: {
    // 按钮标题
    text: {
      type: String,
      default: ''
    },
    // 按钮icon
    icon: {
      type: String,
      default: 'plus'
    },
    // 背景颜色class
    bgColorClass: {
      type: String,
      default: 'background-color-primary'
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
.container-floatButton {
  position: fixed;
  bottom: 27px;
  right: 20px;
  z-index: 10;
  .button {
    width: 52px;
    height: 52px;
    span {
      line-height: 12px;
    }
  }
  .content {
    .item {
      padding: 8px 0;
      text-align: center;
      position: relative;
      box-shadow: inset 0 0 0 0 #edeff7;
      .h3 {
        font-size: $font-size-m;
      }
      p {
        font-size: $font-size-sm;
        color: $color-text-secondary;
      }
      .van-icon {
        position: absolute;
        left: 24px;
        top: 50%;
        margin-top: -10px;
      }
    }
  }
  .spacing {
    background: $color-bg;
    height: 10px;
  }
  .cancle {
    text-align: center;
    padding: 14px 0;
    color: $color-primary;
    font-size: $font-size-ml;
  }
}
@supports (bottom: env(safe-area-inset-bottom)) {
  .container-floatButton {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
