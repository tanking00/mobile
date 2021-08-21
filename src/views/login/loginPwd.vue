<template>
  <div class="container">
    <div class="container-title">
      登 录
    </div>
    <van-form validate-first @submit="handleLogin" @failed="handleFailed">
      <van-field
        v-model="loginForm.userCode"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="loginForm.password"
        :type="passwordType"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 20px 16px">
        <van-button :loading="loading" round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <van-overlay :show="showLoading">
      <div class="lodingBg flex-center">
        <van-loading vertical>正在登录中...</van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { validCode, validPassword } from '@/utils/validate'
import { jssdk } from '@/api/global'

export default {
  name: 'LoginPwd',
  data() {
    const validateCode = (rule, value, callback) => {
      if (!validCode(value)) {
        callback(new Error('工号不符合校验规则'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码不符合校验规则'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userCode: '',
        password: '',
        type: 'PASSWORD'
      },
      loginRules: {
        userCode: [{ required: true, trigger: 'blur', validator: validateCode }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      showLoading: false,
      pcUrl: process.env.VUE_APP_PC_URL
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleFailed() {},
    handleLogin() {
      this.loading = true
      this.$store
        .dispatch('user/login', this.loginForm)
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
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
              this.loading = false
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.loading = false
        })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  .container-title {
    padding: 30px 0 20px 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-b;
    text-align: center;
  }
}
</style>
