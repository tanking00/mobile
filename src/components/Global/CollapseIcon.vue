<!-- Created by Tanking. -->
<!-- 展开面板按钮 -->
<template>
  <div class="container-collapseIcon">
    <span class="color-text-secondary font-size-m">{{ isOpen ? '收起' : '展开' }}</span>
    <van-icon :name="isOpen ? 'bm-systemUnfold' : 'bm-systemFold'" class="color-auxiliary margin-left-8" />
  </div>
</template>

<script>
export default {
  name: 'CollapseIcon',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
