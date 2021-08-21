<!-- Created by Tanking. -->
<!-- 计划编辑 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-top-bottom">
      <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
        <van-field
          v-model="showDate"
          name="执行日期"
          label="执行日期"
          placeholder="请选择"
          readonly
          input-align="right"
          is-link
          size="large"
          @click="onClickField"
          :rules="[{ required: true, message: '请选择执行日期' }]"
        />
      </van-form>
    </div>
    <SubmitButton>
      <SubmitButtonItem @click="onClickCancel">取消</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSave">保存</SubmitButtonItem>
    </SubmitButton>
    <!-- <DatePickerSheet type="year-month" v-model="showMonthPickerSheet" @select="onSelectMonth"></DatePickerSheet> -->
    <van-action-sheet v-model="showMonthPickerSheet" title="" @cancel="onCancel" @click-overlay="onCancel">
      <van-datetime-picker
        v-model="time"
        type="year-month"
        title=""
        :min-date="minDate"
        :max-date="maxDate"
        cancel-button-text=""
        :formatter="formatter"
        @confirm="onConfirmTime"
        @cancel="onCancel"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { updatePlan } from '@/api/plan'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'PlanEdit',
  components: {},
  data() {
    return {
      date: '',
      time: new Date(),
      showDate: '',
      minDate: '',
      maxDate: '',
      showMonthPickerSheet: false
    }
  },
  methods: {
    onFailedForm(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm() {
      Dialog.confirm({
        message: '确定要保存吗？'
      })
        .then(() => {
          // on confirm
          const req = {
            id: this.id,
            executeDate: this.date
          }
          updatePlan(req)
            .then(res => {
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    onClickField() {
      this.showMonthPickerSheet = true
    },
    onClickCancel() {
      this.$router.go(-1)
    },
    onClickSave() {
      this.$refs['form'].submit()
    },
    onSelectMonth(value) {
      this.date = value
      this.showDate = formatTimeStamp(value, 7)
    },
    onConfirmTime() {
      this.showMonthPickerSheet = false
      const timeStamp = parseInt(this.time.getTime() / 1000)
      this.date = timeStamp
      this.showDate = formatTimeStamp(timeStamp, 7)
    },
    // 时间选择取消回调
    onCancel() {
      this.showMonthPickerSheet = false
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
  },
  created() {
    if (this.$route.query.date) {
      this.date = this.$route.query.date
      this.minDate = new Date(this.$route.query.date * 1000)
      const year = this.minDate.getFullYear()
      this.maxDate = new Date(year + '-12')
      this.showDate = formatTimeStamp(this.$route.query.date, 7)
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  }
}
</script>
