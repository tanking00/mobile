<template>
  <div class="container">
    <div class="container-main flex-center">
      <div class="loading-wrapper flex-center">
        <van-loading vertical>正在登录...</van-loading>
      </div>
    </div>
  </div>
</template>

<script>
import { param2Obj } from '@/utils'
import { jssdk } from '@/api/global'

export default {
  name: 'Login',
  // inject: ['reload'],
  data() {
    return {
      pcUrl: process.env.VUE_APP_PC_URL
    }
  },
  watch: {},
  methods: {},
  created() {
    // 企业微信登录
    const params = param2Obj(window.location.href)
    if (params && params.code && params.state) {
      let redirectUrl = window.location.href.split('?')[0]
      redirectUrl = redirectUrl + '#/login?code=' + params.code
      window.location.replace(redirectUrl)
    } else if (params && params.code && !params.state) {
      const req = {
        userCode: params.code,
        password: '',
        type: 'WE_CHAT_CP'
      }
      this.$store
        .dispatch('user/loginCp', req)
        .then(() => {
          const pcUrl = `${this.pcUrl}?token=${this.$store.getters.token}`
          jssdk(location.href.split('#')[0])
            .then(res => {
              console.log(res)
              const { data } = res
              window.wx.config({
                beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，企业微信的corpID
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                jsApiList: [
                  'scanQRCode',
                  'previewFile',
                  'invoke',
                  'openDefaultBrowser',
                  'closeWindow',
                  'openEnterpriseChat'
                ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
              })
              window.wx.ready(function() {
                // const url = `${location.origin}/#/?token=${token}`
                window.wx.invoke(
                  'openDefaultBrowser',
                  {
                    url: pcUrl
                  },
                  function(res) {
                    if (res.err_msg === 'openDefaultBrowser:ok') {
                      window.wx.closeWindow()
                    }
                  }
                )
              })
              this.$router.push({ path: '/' }).catch(() => {})
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
          this.$router.push({ path: '/oops' }).catch(() => {})
        })
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  width: 100%;
  height: 100%;
  .container-main {
    width: 100%;
    height: 100%;
    background: $color-white;
    .loading-wrapper {
      width: 100px;
      height: 100px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
      ::v-deep .van-loading__text {
        color: #ffffff;
      }
    }
  }
}
</style>
