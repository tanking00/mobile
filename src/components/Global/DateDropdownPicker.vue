<!-- Created by Tanking. -->
<!-- 时间下拉选择 -->
<template>
  <van-dropdown-item ref="timeDropdown" :title="title">
    <van-datetime-picker
      v-model="date"
      :type="type"
      title=""
      cancel-button-text="重置"
      :formatter="formatter"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </van-dropdown-item>
</template>

<script>
export default {
  name: 'DateDropdownPicker',
  props: {
    title: {
      type: String,
      default: '时间选择'
    },
    type: {
      type: String,
      default: 'date'
    }
  },
  data() {
    return {
      date: new Date()
    }
  },
  methods: {
    // 确定回调
    onConfirm() {
      this.$refs['timeDropdown'].toggle()
      const date = parseInt(this.date.getTime() / 1000)
      this.$emit('change', date)
    },
    // 重置回调
    onCancel() {
      this.$refs['timeDropdown'].toggle()
      this.date = ''
      this.$emit('change', this.date)
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      }
      return val
    }
  }
}
</script>
