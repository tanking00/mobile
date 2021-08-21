<template>
  <div class="container container-page401">
    <van-empty image="error" description="没有该页面权限！">
      <van-button round type="danger" class="bottom-button" @click="$router.go(-1)">返回上一页</van-button>
      <router-link to="/">
        <div class="center margin-top color-primary">回到首页</div>
      </router-link>
    </van-empty>
  </div>
</template>

<script>
export default {
  name: 'Page401'
}
</script>
