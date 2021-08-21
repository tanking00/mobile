<!-- Created by Tanking. -->
<!-- 日期范围下拉选择 -->
<template>
  <van-dropdown-item ref="timeDropdown" :title="title">
    <van-datetime-picker
      v-show="showStartTime"
      v-model="tempStartTime"
      type="date"
      title="选择开始日期"
      cancel-button-text="重置"
      :max-date="maxTime"
      :min-date="minTime"
      :formatter="formatter"
      @confirm="onConfirmStartTime"
      @cancel="onCancelTime"
    />
    <van-datetime-picker
      v-show="!showStartTime"
      v-model="tempEndTime"
      type="date"
      title="选择结束日期"
      cancel-button-text="重置"
      :min-date="tempStartTime"
      :max-date="maxTime"
      :formatter="formatter"
      @confirm="onConfirmEndTime"
      @cancel="onCancelTime"
    />
  </van-dropdown-item>
</template>

<script>
export default {
  name: 'DateRangeDropdownPicker',
  props: {
    title: {
      type: String,
      default: '操作时间'
    },
    maxTime: {
      type: Date,
      default() {
        return new Date()
      }
    },
    minTime: {
      type: Date
      // default: new Date()
    }
  },
  data() {
    return {
      startTime: '',
      tempStartTime: new Date(), // 临时开始时间
      endTime: '',
      tempEndTime: '', // 临时结束时间
      showStartTime: true // 显示开始时间选择器
      // maxTime: new Date() // 最大可选择时间
    }
  },
  methods: {
    // 开始时间确定回调
    onConfirmStartTime() {
      this.showStartTime = false
    },
    // 结束时间确定回调
    onConfirmEndTime() {
      this.$refs['timeDropdown'].toggle()
      this.showStartTime = true
      this.startTime = parseInt(this.tempStartTime.getTime() / 1000)
      this.endTime = parseInt(this.tempEndTime.getTime() / 1000 + 86399)
      this.$emit('change', this.startTime, this.endTime)
    },
    // 时间选择取消回调
    onCancelTime() {
      this.$refs['timeDropdown'].toggle()
      this.showStartTime = true
      this.startTime = ''
      this.endTime = ''
      this.$emit('change', this.startTime, this.endTime)
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
