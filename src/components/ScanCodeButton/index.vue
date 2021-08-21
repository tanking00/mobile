<!-- Created by Tanking. -->
<!-- 导航栏扫码按钮 -->
<template>
  <div class="container-scanCodeButton flex-center-column color-white">
    <van-icon name="bm-systemScan" class="icon-size-22" />
    <span class="font-size-xs text">扫一扫</span>
  </div>
</template>

<script>
export default {
  name: 'ScanCodeButton',
  data() {
    return {
      hasDot: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-scanCodeButton {
  .text {
    line-height: 15px;
  }
}
</style>
