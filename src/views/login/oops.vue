<template>
  <div class="container">
    <div class="container-main center">
      <div class="icon-wrapper border-radius-circular flex-center">
        <van-icon name="bm-appTipoops" class="color-text-auxiliary" />
      </div>
      <div class="text1 font-size-l font-weight">Oops，登录失败！</div>
      <div class="text2 color-text-secondary">请通过企业微信授权登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Oops',
  data() {
    return {}
  },
  watch: {},
  methods: {},
  created() {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  height: 100%;
  background-color: $color-white;
  .container-main {
    padding-top: 60px;
    .van-icon {
      font-size: 240px;
    }
    .text1 {
      margin-top: 20px;
    }
    .text2 {
      margin-top: 8px;
    }
  }
}
</style>
