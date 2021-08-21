import Vue from 'vue'

// 引入同目录下的全部组件
const requireCommon = require.context('.', false, /\.vue$/)
registerComponent(requireCommon)
// 注册组件
function registerComponent(requireCom) {
  // 依次进行注册
  requireCom.keys().forEach(key => {
    // 获取单个组件内容
    const _component = requireCom(key)
    // 获取组件名称
    const _componentName = key.replace(/^\.\//, '').replace(/\.\w+$/, '')
    // 注册在vue上
    Vue.component(_componentName, _component.default || _component)
  })
}
