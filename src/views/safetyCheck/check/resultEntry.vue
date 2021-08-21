<!-- Created by Tanking. -->
<!-- 检查结果录入 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
      <div class="field-wrapper">
        <van-field
          v-model="checkDate"
          name="检查日期"
          label="检查日期"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showDatePickerSheet = true"
          :rules="[{ required: true, message: '请选择检查日期' }]"
        />
      </div>
      <div class="field-wrapper">
        <van-field
          name="checkAreaNames"
          required
          placeholder="请选择区域信息"
          readonly
          v-model="checkAreaNames[0]"
          :rules="[{ required: true, message: '请选择区域信息' }]"
        >
          <template #input>
            <div class="default-multipleChoice" @click="showCheckArea = true">
              <div class="label">区域信息</div>
              <div class="content">
                <div v-if="checkAreaNames && checkAreaNames.length > 0" class="value-inline">
                  <span v-for="(item, index) in checkAreaNames" :key="index" class="item">
                    {{ item }}
                    <van-icon
                      name="close"
                      class="icon-size-16 color-text-auxiliary margin-left-4"
                      @click.stop="onDelCheckArea(index)"
                    />
                  </span>
                </div>
                <div v-else class="placeholder">请选择</div>
                <van-icon name="bm-systemRightarrow" class="icon-size-16 color-text-auxiliary" />
              </div>
            </div>
          </template>
        </van-field>
        <van-field
          v-model="projectName"
          name="项目现场"
          label="项目现场"
          placeholder="请选择"
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showSearchProjectPanel = true"
        />
      </div>
      <van-collapse v-model="activeNames" class="form-collapse">
        <van-collapse-item
          v-for="(item, index) in items"
          :key="item.id"
          :title="'检查项目：' + item.itemName"
          :name="index"
        >
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf(index) >= 0"></CollapseIcon>
          </template>
          <template #value>
            <div>{{ '检查内容：' + item.itemContent }}</div>
          </template>
          <div class="checkContent">
            <div class="itemContent">{{ item.itemContent }}</div>
            <van-radio-group
              v-model="item.isAccord"
              direction="horizontal"
              @change="onChangeAccord($event, index)"
              :rules="[{ required: true, message: '请选择检查结果' }]"
            >
              <van-radio name="1">
                符合
                <template #icon="props">
                  <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
              <van-radio name="2">
                不符合
                <template #icon="props">
                  <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
              <van-radio name="3">
                不适用
                <template #icon="props">
                  <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
            </van-radio-group>
            <div v-if="item.isAccord === '2'" class="description-label clearfix">
              <div class="left">问题描述</div>
              <div class="right" v-show="item.problemDescription">
                <span v-if="!item.troubleStatus" class="color-blue" @click="onClickHazard(index)">发起隐患整改</span>
                <span v-else class="color-text-secondary">已发起</span>
              </div>
            </div>
            <van-field
              v-if="item.isAccord === '2'"
              v-model="item.problemDescription"
              :name="'描述' + index"
              rows="4"
              type="textarea"
              maxlength="1000"
              placeholder="请填写描述信息"
              :rules="[{ required: true, message: '请填写描述信息' }]"
              show-word-limit
              class="form-textarea"
            />
            <van-field
              v-model="item.remark"
              rows="4"
              type="textarea"
              maxlength="1000"
              placeholder="请填写备注信息"
              show-word-limit
              class="form-textarea"
            />
          </div>
        </van-collapse-item>
      </van-collapse>
    </van-form>
    <SubmitButton @click="onClickSubmit" text="提交"></SubmitButton>
    <DatePickerSheet v-model="showDatePickerSheet" @select="onSelectDate" :maxDate="new Date()"></DatePickerSheet>
    <SearchProjectPanel v-model="showSearchProjectPanel" @select="onSelectProject"></SearchProjectPanel>
    <van-popup v-model="showCheckArea" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columnsCheckArea"
        @cancel="showCheckArea = false"
        @confirm="onSelectCheckArea"
      />
    </van-popup>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass, getDictLabel, getDictLabelOfCode } from '@/utils'
import { getSafetyCheckDetails, securityCheckPlanResubmit, securityCheckPlanImpl, getProject } from '@/api/safetyCheck'
import { Dialog, Toast } from 'vant'
import { getPlanDetails } from '@/api/plan'
import { getProcessCode, getDictOfCode } from '@/api/global'
import { SearchProjectPanel } from '../components'

export default {
  name: 'SafetyCheckCheckResultEntry',
  components: { SearchProjectPanel },
  props: {},
  data() {
    return {
      details: {},
      activeNames: [],
      items: [],
      checkDate: '', // 检查日期
      checkAreaIds: [], // 检查区域ID集合
      checkAreaNames: [], // 检查区域名称集合
      showCheckArea: false,
      columnsCheckArea: [],
      additionalArea: '', // 项目现场ID
      projectName: '', // 项目现场名称
      showSearchProjectPanel: false,
      activeIcon: require('@/assets/icon_images/pitchon.png'),
      inactiveIcon: require('@/assets/icon_images/unselected.png'),
      showDatePickerSheet: false,
      planId: '', // 计划ID
      processCode: '', // 流程编号
      startHazardIndex: 0 // 发起隐患index
    }
  },
  methods: {
    getDetails() {
      getSafetyCheckDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.checkDate = this.formatTimeStamp(data.checkDate, 5)
          if (!this.checkDate) {
            this.initCheckDate()
          }
          this.items = data.items
          this.checkAreaIds = data.areas
          this.additionalArea = data.checkArea
          this.getProjectName(data.checkArea)
          data.areas.forEach(async item => {
            const checkAreaName = await getDictLabelOfCode('security_check_area', item)
            this.checkAreaNames.push(checkAreaName)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击提交按钮
    onClickSubmit() {
      this.$refs['form'].submit()
    },
    // 表单错误回调
    onFailedForm(info) {
      Toast(info.errors[0].message)
    },
    // 表单正确回调
    onSubmitForm() {
      let resIdx = ''
      const res = this.items.some((item, index) => {
        if (!item.isAccord) {
          resIdx = index
          return true
        } else {
          return false
        }
      })
      if (res) {
        Toast('请选择检查结果')
        if (this.activeNames.indexOf(resIdx) < 0) {
          this.activeNames.push(resIdx)
        }
        return
      }
      let resIdx2 = ''
      const res2 = this.items.some((item, index) => {
        if (item.isAccord === '2' && !item.troubleStatus) {
          resIdx2 = index
          return true
        } else {
          return false
        }
      })
      if (res2) {
        Toast('请发起隐患整改')
        if (this.activeNames.indexOf(resIdx2) < 0) {
          this.activeNames.push(resIdx2)
        }
        return
      }
      Dialog.confirm({
        message: '确认要提交吗？'
      })
        .then(() => {
          if (this.planId) {
            this.submitCheckPlan()
          } else {
            this.submitCheck()
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    // 选择日期回调
    onSelectDate(value) {
      this.checkDate = this.formatTimeStamp(value, 5)
      this.details.checkDate = value
    },
    // 正常提交
    submitCheck() {
      const req = {
        areas: this.checkAreaIds,
        checkArea: this.additionalArea,
        checkDate: this.details.checkDate,
        checkName: this.details.checkName,
        checkType: this.details.checkType,
        dutyDeptId: this.details.dutyDeptId,
        dutyDeptName: this.details.dutyDeptName,
        dutyPersonnelId: this.details.dutyPersonnelId,
        dutyPersonnelName: this.details.dutyPersonnelName,
        makeDept: this.details.makeDept,
        makePersonnel: this.details.makePersonnel,
        processCode: this.details.processCode,
        checkPlanItems: this.items,
        id: this.id,
        operation: '0',
        taskId: this.taskId,
        planId: this.details.planId
      }
      securityCheckPlanResubmit(req)
        .then(res => {
          if (this.$store.getters.cachedView === 'SafetyCheckCheckResultEntry') {
            this.$store.dispatch('settings/setCachedView', 'Null')
          }
          this.$router.go(-2)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 生成流程编号
    getProcessCode(moduleCode) {
      getProcessCode(moduleCode)
        .then(res => {
          const { data } = res
          this.processCode = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取计划信息
    getPlanDetails() {
      getPlanDetails(this.planId, '安全检查')
        .then(res => {
          const { data } = res
          this.details = data
          this.checkDate = ''
          this.initCheckDate()
          const checkPlanItems = []
          this.details.checkDTOList.forEach(item => {
            const temp = {
              id: item.id,
              isAccord: '',
              itemContent: item.itemContent,
              itemName: item.itemName,
              problemDescription: '',
              remark: '',
              troubleStatus: ''
            }
            checkPlanItems.push(temp)
          })
          this.items = checkPlanItems
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 从计划实施提交
    submitCheckPlan() {
      const req = {
        areas: this.checkAreaIds,
        checkArea: this.additionalArea,
        checkDate: this.details.checkDate,
        checkName: this.details.planName,
        checkType: this.details.typeId,
        dutyDeptId: this.details.liableDeptId,
        dutyDeptName: this.details.liableDept,
        dutyPersonnelId: this.details.personLiableId,
        dutyPersonnelName: this.details.personLiable,
        makeDeptId: this.details.enactDeptId,
        makeDeptName: this.details.enactDept,
        makePersonnelId: this.details.enactPersonId,
        makePersonnelName: this.details.enactPerson,
        processCode: this.processCode,
        checkPlanItems: this.items,
        executionTime: this.details.executeDate,
        operation: '0',
        planId: this.planId,
        id: '',
        nextUserId: '',
        opinion: '',
        taskId: ''
      }
      securityCheckPlanImpl(req)
        .then(res => {
          if (this.$store.getters.cachedView === 'SafetyCheckCheckResultEntry') {
            this.$store.dispatch('settings/setCachedView', 'Null')
          }
          this.$router.go(-3)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取检查区域
    getCheckArea() {
      getDictOfCode('security_check_area')
        .then(res => {
          const { data } = res
          this.columnsCheckArea = []
          data.forEach(item => {
            this.columnsCheckArea.push({ text: item.label, value: item.value })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 检查区域回调
    onSelectCheckArea(data) {
      this.showCheckArea = false
      if (this.checkAreaIds.indexOf(data.value) > -1) {
        return
      } else {
        this.checkAreaIds.push(data.value)
        this.checkAreaNames.push(data.text)
      }
    },
    // 额外区域回调
    onSelectProject(data) {
      this.additionalArea = data.projectNo
      this.projectName = data.projectName
    },
    // 获取额外区域名称
    getProjectName(projectNo) {
      if (!projectNo) {
        return
      }
      const req = {
        projectName: '',
        projectNo: projectNo
      }
      getProject(req)
        .then(res => {
          const { data } = res
          if (data && data[0]) {
            this.projectName = data[0].projectName
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除区域
    onDelCheckArea(index) {
      this.checkAreaIds.splice(index, 1)
      this.checkAreaNames.splice(index, 1)
    },
    // 发起隐患
    async onClickHazard(index) {
      this.startHazardIndex = index
      await this.$store.dispatch('settings/setCachedView', 'SafetyCheckCheckResultEntry')
      this.$router.push({
        path: '/hazard/add',
        query: {
          source: this.details.planName || this.details.checkName,
          content: this.items[index].problemDescription || ''
        }
      })
    },
    // 适不适合改变
    onChangeAccord(name, index) {
      if (name !== '2') {
        this.items[index].problemDescription = ''
        this.items[index].troubleId = ''
        this.items[index].troubleStatus = ''
      }
    },
    // 初始化检查日期
    initCheckDate() {
      const nowDate = parseInt(new Date().getTime() / 1000)
      console.log(nowDate)
      this.details.checkDate = nowDate
      this.checkDate = this.formatTimeStamp(nowDate, 5)
    }
  },
  created() {
    this.getCheckArea()
    if (this.$route.query.planId) {
      this.planId = this.$route.query.planId
      this.getPlanDetails()
      this.getProcessCode('AQJC')
    } else {
      this.getDetails()
    }
  },
  activated() {
    const hazardId = this.$store.getters.hazardId
    if (hazardId) {
      this.items[this.startHazardIndex].troubleStatus = '1'
      this.items[this.startHazardIndex].troubleId = hazardId
      this.$store.dispatch('settings/setHazardId', '')
    }
  },
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    taskId() {
      return this.$route.query.taskId
    },
    id() {
      return this.$route.query.id
    },
    getDictLabel() {
      return getDictLabel
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.field-wrapper {
  margin: 10px 0;
  padding: 0 0 0 8px;
  background-color: $color-white;
}
.checkContent {
  .title {
    text-align: center;
    padding: 15px 0 20px 0;
    color: $color-text-secondary;
    font-size: $font-size-m;
  }
  .itemContent {
    color: $color-text-primary;
    font-size: $font-size-ml;
    padding-top: 20px;
    margin: 0 20px 15px 32px;
    position: relative;
    &::before {
      position: absolute;
      left: -12px;
      color: #ed3458;
      font-size: $font-size-m;
      content: '*';
    }
  }
  .van-radio-group {
    margin: 0 20px 0 20px;
    .van-radio {
      margin-right: 24px;
    }
  }
  .description-label {
    padding: 20px 20px 0 20px;
    font-size: $font-size-m;
    .left {
      color: $color-text-secondary;
    }
    .right {
      color: $color-auxiliary;
    }
  }
}
</style>
