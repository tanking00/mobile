<!-- Created by Tanking. -->
<!-- 隐私协议 -->
<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <van-empty description="模块开发中。。。" />
  </div>
</template>

<script>
export default {
  name: 'Agreement',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
