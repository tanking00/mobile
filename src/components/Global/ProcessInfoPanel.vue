<!-- Created by Tanking. -->
<!-- 流程信息面板 -->
<template>
  <div class="default-steps">
    <div class="title clearfix">
      <span class="left">{{ title }}</span>
      <span class="right">{{ processCode }}</span>
    </div>
    <div class="content">
      <van-steps direction="vertical" :active="stepActive">
        <van-step v-for="(item, index) in steps" :key="index">
          <div class="stpe-text">{{ item.title }}</div>
          <div class="stpe-text">{{ item.time }}</div>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessInfoPanel',
  props: {
    title: {
      type: String,
      default: '流程信息'
    },
    processCode: {
      type: String,
      default: ''
    },
    steps: {
      type: Array,
      default() {
        return []
      }
    },
    stepActive: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>

<style lang="scss">
// .van-nav-bar--fixed {
//   z-index: 1;
// }
// .van-step--vertical .van-step__circle-container {
//   z-index: 1;
// }
// .van-step--vertical .van-step__line {
//   z-index: 0;
// }
.van-step--vertical:first-child::before {
  z-index: 0;
}
</style>
