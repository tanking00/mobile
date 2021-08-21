<!-- Created by Tanking. -->
<!-- 实施结果录入 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
      <div class="field-wrapper">
        <!-- <van-field
          v-model="facility.facility"
          name="设备设施"
          label="设备设施"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showSearchEquipmentPanel = true"
          :rules="[{ required: true, message: '请选择设备设施' }]"
        /> -->
        <van-field
          v-model="facility.facility"
          name="设备设施"
          label="设备设施"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          size="large"
        />
      </div>
      <div class="field-wrapper">
        <van-field
          v-model="date.dataText"
          :name="type === '1' ? '维保日期' : '检查日期'"
          :label="type === '1' ? '维保日期' : '检查日期'"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showDatePickerSheet = true"
          :rules="[{ required: true, message: type === '1' ? '请选择维保日期' : '请选择检查日期' }]"
        />
      </div>
      <div class="field-wrapper">
        <van-field
          v-model="result.name"
          :name="type === '1' ? '维保结论' : '检查结论'"
          :label="type === '1' ? '维保结论' : '检查结论'"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showResult = true"
          :rules="[{ required: true, message: type === '1' ? '请选择维保结论' : '请选择检查结论' }]"
        />
        <TextFieldGroup
          v-model="concernsList"
          :required="result.value === '1' ? true : false"
          @startHazard="startHazard"
        ></TextFieldGroup>
      </div>
      <div class="field-wrapper">
        <div class="field-label-required">{{ type === '1' ? '维保报告' : '检查报告' }}</div>
        <van-field
          name="images"
          :rules="[{ required: true, message: type === '1' ? '请上传维保报告' : '请上传检查报告' }]"
        >
          <template #input>
            <UploadFile v-model="fileList" :maxCount="1" :accepts="['pdf']" tips="支持格式：pdf，50M以内"></UploadFile>
          </template>
        </van-field>
      </div>
    </van-form>
    <SubmitButton @click="onClickSubmit" text="提交"></SubmitButton>
    <SearchEquipmentPanel v-model="showSearchEquipmentPanel" @select="onSelectEquipment"></SearchEquipmentPanel>
    <DatePickerSheet v-model="showDatePickerSheet" @select="onSelectDate"></DatePickerSheet>
    <van-action-sheet v-model="showResult" :actions="resultActions" @select="onSelectResult" />
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { formatTimeStamp } from '@/utils/timeFormat'
import { submitImplement } from '@/api/equipment'
import { SearchEquipmentPanel } from '../components'
import { getProcessCode } from '@/api/global'

export default {
  name: 'EquipmentMaintenanceResultEntry',
  components: { SearchEquipmentPanel },
  props: {},
  data() {
    return {
      showSearchEquipmentPanel: false,
      showDatePickerSheet: false,
      showResult: false,
      // 设备
      facility: {
        facility: '',
        facilityId: ''
      },
      // 维保日期
      date: {
        date: '',
        dataText: ''
      },
      // 维保结论（0、合格1、不合格）
      result: {
        name: '',
        value: ''
      },
      resultActions: [
        { name: '合格', value: '0' },
        { name: '不合格', value: '1' }
      ],
      concernsList: [{ content: '', status: '0' }], // 问题描述
      fileList: [], // 文件
      processNumber: '', // 流程编号
      startHazardIndex: 0 // 发起隐患index
    }
  },
  methods: {
    // 生成流程编号
    getProcessNumber() {
      const moduleCode = this.type === '1' ? 'SBWB' : 'NDJC'
      getProcessCode(moduleCode)
        .then(res => {
          const { data } = res
          this.processNumber = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 设备选择回调
    onSelectEquipment(data) {
      console.log(data)
      this.facility = data
    },
    // 选择日期回调
    onSelectDate(value) {
      console.log(value)
      this.date.dataText = this.formatTimeStamp(value, 5)
      this.date.date = value
    },
    // 选择结果回调
    onSelectResult(data) {
      console.log(data)
      this.result = data
      this.showResult = false
    },
    // 提交
    // 点击提交按钮
    onClickSubmit() {
      this.$refs['form'].submit()
    },
    // 表单错误回调
    onFailedForm(info) {
      console.log(info)
      Toast(info.errors[0].message)
    },
    // 表单正确回调
    onSubmitForm() {
      // 判断是否需要发起隐患，是否已经发起隐患
      if (this.result.value === '1') {
        const isHazard = this.concernsList.every(item => {
          if (item.status === '1') {
            return true
          } else {
            return false
          }
        })
        if (!isHazard) {
          Toast('请发起隐患整改！')
          return
        }
      }
      Dialog.confirm({
        message: this.type === '1' ? '确认要提交维保实施结果？' : '确认要提交检查实施结果？'
      })
        .then(() => {
          const concernsList = []
          this.concernsList.forEach(item => {
            if (item.content) {
              concernsList.push({
                issueDescribe: item.content,
                isInitiate: item.status === '1' ? '0' : '3',
                concernsId: item.hazardId || ''
              })
            }
          })
          const req = {
            taskId: this.taskId,
            type: this.type,
            operation: '2',
            maintenanceCheckInfo: {
              id: this.id,
              facility: this.facility.facility,
              facilityId: this.facility.facilityId,
              fileUrl: this.fileList.join(','),
              type: this.type,
              result: this.result.value,
              processCode: this.processNumber,
              planId: this.planId,
              date: this.date.date,
              concernsList: concernsList
            }
          }
          console.log(req)
          submitImplement(req)
            .then(res => {
              if (this.$store.getters.cachedView === 'EquipmentMaintenanceResultEntry') {
                this.$store.dispatch('settings/setCachedView', 'Null')
              }
              this.$router.go(-3)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    // 发起隐患
    startHazard(index, item) {
      // if (!this.facility.facility) {
      //   Toast('请选择设备设施')
      //   return
      // }
      this.startHazardIndex = index
      this.$store.dispatch('settings/setCachedView', 'EquipmentMaintenanceResultEntry')
      this.$router.push({
        path: '/hazard/add',
        query: {
          source: this.facility.facility,
          content: item.content || ''
        }
      })
    }
  },
  created() {
    if (this.$route.query.processCode) {
      this.processNumber = this.$route.query.processCode
    } else {
      this.getProcessNumber()
    }
    if (this.$route.query.deviceName) {
      this.facility.facility = this.$route.query.deviceName
    }
    if (this.$route.query.deviceId) {
      this.facility.facilityId = this.$route.query.deviceId
    }
  },
  activated() {
    const hazardId = this.$store.getters.hazardId
    if (hazardId) {
      this.concernsList[this.startHazardIndex].status = '1'
      this.concernsList[this.startHazardIndex].hazardId = hazardId
      this.$store.dispatch('settings/setHazardId', '')
    }
  },
  mounted() {},
  computed: {
    id() {
      return this.$route.query.id
    },
    // 任务ID
    taskId() {
      return this.$route.query.taskId
    },
    // 计划ID
    planId() {
      return this.$route.query.planId
    },
    type() {
      return this.$route.query.type
    },
    // 设备类型
    // materialTypeId() {
    //   return this.$route.query.materialTypeId
    // },
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.field-wrapper {
  margin: $space-vertical 0;
  background-color: $color-white;
  .field-label {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 12px;
  }
  .field-label-required {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 24px;
    position: relative;
    &::before {
      position: absolute;
      left: -12px;
      color: #ed3458;
      font-size: $font-size-m;
      content: '*';
    }
  }
}
.item-content {
  padding: 12px 20px 18px 20px;
  .item-content-item {
    .item-label {
      color: $color-text-primary;
      font-size: $font-size-ml;
      position: relative;
      margin-left: 12px;
      margin-bottom: 14px;
      &::before {
        position: absolute;
        left: -12px;
        color: #ed3458;
        font-size: $font-size-m;
        content: '*';
      }
    }
    .van-radio-group {
      margin-bottom: 16px;
      .van-radio {
        margin-right: 24px;
      }
    }
    &:nth-last-of-type(1) {
      .van-radio-group {
        margin-bottom: 0;
      }
    }
  }
}
</style>
