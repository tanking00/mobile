<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" fixed placeholder @click-right="$router.push({ path: '/newsCenter' })">
      <template #right>
        <MessageButton></MessageButton>
      </template>
    </van-nav-bar>
    <van-empty description="模块开发中。。。" />
    <SosButton></SosButton>
    <Footer></Footer>
  </div>
</template>

<script>
import { Footer, SosButton, MessageButton } from '@/components'
export default {
  name: 'Statistics',
  components: {
    Footer,
    SosButton,
    MessageButton
  },
  data() {
    return {
      show: false,
      value: '',
      radio: ''
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  line-height: 40px;
  text-indent: 20px;
}
</style>
