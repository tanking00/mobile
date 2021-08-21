<!-- Created by Tanking. -->
<!-- 时间选择面板 -->
<template>
  <van-action-sheet v-model="show" title="" @cancel="onCancel" @click-overlay="onCancel">
    <van-datetime-picker
      v-model="time"
      :type="type"
      title=""
      :min-date="minDate"
      :max-date="maxDate"
      cancel-button-text=""
      :formatter="formatter"
      @confirm="onConfirmTime"
      @cancel="onCancel"
    />
  </van-action-sheet>
</template>

<script>
export default {
  name: 'DatePickerSheet',
  model: {
    prop: 'showSheet',
    event: 'change'
  },
  props: {
    showSheet: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'date'
    },
    minDate: {
      type: Date
    },
    maxDate: {
      type: Date
    }
  },
  data() {
    return {
      show: false,
      time: new Date()
    }
  },
  watch: {
    showSheet(val, old) {
      if (val !== old && val !== this.show) {
        this.show = val
      }
    }
  },
  methods: {
    onConfirmTime() {
      const timeStamp = parseInt(this.time.getTime() / 1000)
      this.$emit('change', false)
      this.$emit('select', timeStamp)
    },
    // 时间选择取消回调
    onCancel() {
      this.$emit('change', false)
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
