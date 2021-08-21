<!-- Created by Tanking. -->
<!--  -->
<template>
  <div :style="{ zIndex: zIndex }">
    <div class="screen-item" @click="showPicker = true">
      <div>{{ text }}</div>
      <van-icon name="bm-shaixuan" class="icon-size-12 color-auxiliary" />
    </div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker show-toolbar :columns="options" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    valueKey: {
      //  	选项对象中，文字对应的 key
      type: String,
      default: 'text'
    },
    value: {
      // 选中的对象的文字
      type: [String, Number]
    }
  },
  data() {
    return {
      text: '',
      showPicker: false,
      zIndex: 0
    }
  },
  methods: {
    onConfirm(obj) {
      this.showPicker = false
      this.text = obj[this.valueKey]
      this.$emit('select', obj)
    }
  },
  watch: {
    showPicker(v) {
      if (v) {
        this.zIndex = 3
      } else {
        setTimeout(() => {
          this.zIndex = 0
        }, 300)
      }
    },
    value: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return
        const data = this.options.filter(item => {
          return item.value === newValue
        })
        if (data.length) {
          this.onConfirm(data[0])
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.screen-item {
  width: 110px;
  height: 32px;
  background-color: #f1f3f7;
  padding: 0px;
  font-size: $font-size-sm;
  border-radius: 32px;
  line-height: 32px;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
