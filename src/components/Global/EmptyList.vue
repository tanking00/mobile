<!-- Created by Tanking. -->
<!-- 空列表 -->
<template>
  <div class="container-emptyList">
    <div class="wrapper">
      <div class="icon-wrapper border-radius-circular flex-center">
        <van-icon name="bm-systemEmpty" class="color-text-auxiliary" />
      </div>
      <div class="description color-text-secondary center">{{ description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyList',
  props: {
    description: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-emptyList {
  .wrapper {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    .icon-wrapper {
      width: 140px;
      height: 140px;
      background: #f9fafd;
      font-size: 80px;
      margin: 0 auto;
    }
    .description {
      margin-top: 20px;
    }
  }
}
</style>
