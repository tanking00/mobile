<!-- Created by Tanking. -->
<!-- 关于 -->
<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="$router.go(-1)" :border="false" fixed placeholder />
    <div class="container-image">
      <div class="image-wrapper">
        <vue-qr
          :logoSrc="require('@/assets/about_images/qr_icon.png')"
          :text="url"
          :size="size"
          :margin="8"
          :logoCornerRadius="3"
        ></vue-qr>
      </div>
    </div>
    <div>
      <van-cell title="当前版本" :value="'Version' + version" size="large" />
      <van-cell title="隐私协议" is-link to="agreement" size="large" />
    </div>
  </div>
</template>

<script>
import config from '../../../package.json'
import vueQr from 'vue-qr'
import { pxTransform } from '@/utils'
export default {
  name: 'About',
  components: { vueQr },
  data() {
    return {
      url: window.location.origin + '/h5'
    }
  },
  computed: {
    version() {
      return config.version
    },
    size() {
      return pxTransform(180)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  .container-image {
    padding: 40px 0;
    .image-wrapper {
      width: 180px;
      height: 180px;
      margin: 0 auto;
    }
  }
}
</style>
