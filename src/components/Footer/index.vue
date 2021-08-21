<!-- Created by Tanking. -->
<!-- 底部菜单 -->
<template>
  <van-tabbar v-model="active" placeholder>
    <van-tabbar-item replace to="/" name="Home" icon="bm-bottomnavHome">首页</van-tabbar-item>
    <van-tabbar-item replace to="/taskCenter" name="TaskCenter" icon="bm-bottomnavTask">任务</van-tabbar-item>
    <van-tabbar-item replace to="/workbench" name="Workbench" icon="bm-bottomnavWorkdock">工作台</van-tabbar-item>
    <van-tabbar-item replace to="/statistics" name="Statistics" icon="bm-bottomnavDatecenter">数据中心</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      active: 'Home'
    }
  },
  methods: {},
  created: function() {
    this.active = this.$route.name
  }
}
</script>
