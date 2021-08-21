<template>
  <transition name="fade">
    <div v-show="show" class="container-searchPanel background-color-bg">
      <van-nav-bar title="奖项编辑" left-arrow placeholder @click-left="onCancelClick" />
      <van-form @submit="onSubmit" ref="form">
        <van-field
          required
          v-model="rewardName"
          name="奖项"
          label="奖项"
          placeholder="请输入"
          input-align="right"
          size="large"
          maxlength="50"
          :rules="[{ required: true }]"
        />
      </van-form>
      <SubmitButton>
        <SubmitButtonItem @click="onCancelClick" type="gray">取消</SubmitButtonItem>
        <SubmitButtonItem @click="onSubmitClik">提交</SubmitButtonItem>
      </SubmitButton>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AwardEditingPanel',
  components: {},
  model: {
    prop: 'showSearch',
    event: 'change'
  },
  props: {
    showSearch: {
      type: Boolean,
      default: false
    },
    award: {
      type: String
    }
  },
  data() {
    return {
      show: false,
      rewardName: ''
    }
  },
  methods: {
    onCancelClick() {
      this.$emit('change', false)
    },
    onSubmitClik() {
      this.$refs['form'].submit()
    },
    onSubmit() {
      this.$emit('editIngDone', this.rewardName)
      this.$emit('change', false)
    }
  },
  created() {
    console.log('aaaaaaaa=', this.award)
    if (this.award) {
      this.rewardName = this.award
    }
  },

  watch: {
    showSearch(val, old) {
      if (val !== old && val !== this.show) {
        this.show = val
      }
    },
    award(val, old) {
      console.log('bbbbbbbbbb=', val)
      this.rewardName = val
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-searchPanel {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  // .container-list {
  //   padding: 0 12px 10px 12px;
  //   width: 100%;
  //   overflow-x: hidden;
  //   overflow-y: auto !important;
  //   -webkit-overflow-scrolling: touch;
  //   .container-list-item {
  //     height: 66px;
  //     display: flex;
  //     align-items: center;
  //     .avatar-border {
  //       width: 42px;
  //       height: 42px;
  //       overflow: hidden;
  //       margin-right: 12px;
  //     }
  //     .name {
  //       color: $color-text-primary;
  //       font-size: $font-size-m;
  //       span {
  //         color: $color-auxiliary;
  //       }
  //     }
  //     .code {
  //       color: $color-text-secondary;
  //       font-size: $font-size-sm;
  //       margin-top: 2px;
  //     }
  //   }
  // }
}
// .empty-min-height {
//   height: calc(100vh - 56px);
//   height: calc(100vh - constant(safe-area-inset-bottom) - 56px);
//   height: calc(100vh - env(safe-area-inset-bottom) - 56px);
// }
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
