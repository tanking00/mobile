<!-- Created by Tanking. -->
<!-- 提交面板 -->
<template>
  <van-action-sheet v-model="show" :title="title" @cancel="onCancel" @click-overlay="onCancel">
    <div class="container-submitPanel" :class="{ isLarge: isLarge }">
      <div class="content van-hairline--top">
        <slot></slot>
      </div>
      <SubmitButton @click="onSubmit" position="absolute" :text="buttonText"></SubmitButton>
    </div>
  </van-action-sheet>
</template>

<script>
export default {
  name: 'SubmitPanel',
  components: {},
  model: {
    prop: 'showPanel',
    event: 'change'
  },
  props: {
    showPanel: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: '确认'
    },
    isLarge: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    onCancel() {
      this.$emit('change', false)
    },
    onSubmit() {
      this.$emit('submit')
    }
  },
  created() {},
  watch: {
    showPanel(val, old) {
      if (val !== old && val !== this.show) {
        this.show = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-submitPanel {
  position: relative;
  padding-bottom: $submit-button-height;
  .content {
    height: 50vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 8px 0 8px;
  }
  &.isLarge {
    .content {
      height: 60vh;
    }
  }
}
.van-action-sheet__header {
  color: $color-text-primary;
  text-align: left;
  font-size: $font-size-l;
  padding-left: 12px;
  .van-icon {
    color: $color-text-auxiliary;
  }
}
</style>
