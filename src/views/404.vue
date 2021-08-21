<template>
  <div class="container container-page404">
    <van-empty image="error" description="404错误，找不到网页！">
      <van-button round type="danger" class="bottom-button" @click="$router.go(-1)">返回上一页</van-button>
      <router-link to="/">
        <div class="center margin-top color-primary">回到首页</div>
      </router-link>
    </van-empty>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>
