import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js' // rem适配
import Vant from 'vant'
import 'vant/lib/index.less'
import '@/styles/index.scss' // global css
import '@/permission' // permission control
import '@/components/Global/index' // 引入全局组件
import '@/utils/error-log' // error log
import { checkPermission } from '@/utils/permission' // 权限判断
Vue.prototype.$checkPermission = checkPermission
import 'inobounce/inobounce.js' // 禁止默认滚动
import FastClick from 'fastclick' // 解决移动端300ms的延时
FastClick.attach(document.body)
import { filePreviewFun } from '@/utils' // 文件预览
Vue.prototype.$filePreviewFun = filePreviewFun

// import Vconsole from 'vconsole' // 移动端log
// new Vconsole()

// import AlloyFinger from 'alloyfinger' // 手势
// import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'
// Vue.use(AlloyFingerPlugin, {
//   AlloyFinger
// })

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
