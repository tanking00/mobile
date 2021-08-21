<template>
  <div id="app">
    <keep-alive v-if="isRouterAlive" :include="cachedView">
      <router-view />
    </keep-alive>
    <div v-show="pageLoding" class="pageLoding-wrapper">
      <div class="wrapper">
        <van-loading type="spinner" color="#ffffff" />
      </div>
    </div>
  </div>
</template>

<script>
import { isAndroid } from '@/utils/validate'

export default {
  name: 'App',
  provide() {
    // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true, // 控制视图是否显示的变量
      scrollTopNum: 0,
      defaultPhoneHeight: '',
      nowPhoneHeight: ''
    }
  },
  created() {},
  mounted() {
    this.updCachedView()
    if (isAndroid()) {
      this.defaultPhoneHeight = window.innerHeight
      window.onresize = () => {
        this.nowPhoneHeight = window.innerHeight
      }
    }
  },
  destroyed() {
    if (isAndroid()) {
      window.onresize = null
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false // 先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true // 再打开
      })
    },
    updCachedView() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('settings/updCachedView', this.$route)
      }
      return false
    }
  },
  computed: {
    cachedView() {
      return this.$store.state.settings.cachedView
    },
    pageLoding() {
      return this.$store.state.settings.pageLoding
    }
  },
  watch: {
    $route() {
      this.updCachedView()
    },
    nowPhoneHeight: function() {
      if (isAndroid()) {
        if (this.defaultPhoneHeight !== this.nowPhoneHeight) {
          // 手机键盘被唤起了。
          this.scrollTopNum = document.getElementById('app').scrollTop || 0
        } else {
          // 手机键盘被关闭了。
          this.$nextTick(() => {
            document.getElementById('app').scrollTop = this.scrollTopNum
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pageLoding-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .wrapper {
    width: 72px;
    height: 72px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 8px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
