<!-- Created by Tanking. -->
<!-- 计划详情 -->
<template>
  <div class="container" :class="{ 'submit-button-height': showBtn, 'container-supports': !showBtn }">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="计划信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <PlanInfo :details="details" :planType="planType"></PlanInfo>
        </van-collapse-item>
      </van-collapse>
    </div>
    <SubmitButton v-if="showBtn">
      <SubmitButtonItem v-if="showBtnEdit" @click="onClickEdit">
        编辑
      </SubmitButtonItem>
      <SubmitButtonItem v-if="showBtnImplement" @click="onClickAdd">实施</SubmitButtonItem>
      <SubmitButtonItem v-if="showBtnDetails" @click="onClickDetails">实施详情查看</SubmitButtonItem>
    </SubmitButton>
  </div>
</template>

<script>
import { PlanInfo } from './components'
import { getPlanDetails, getExeByPlanId, getCheckByPlanId, getMaintenanceByPlanId } from '@/api/plan'

export default {
  name: 'PlanDetails',
  components: { PlanInfo },
  data() {
    return {
      activeNames: ['1'],
      details: {},
      date: '',
      showBtnEdit: false, // 是否显示编辑按钮
      showBtnImplement: false, // 是否显示实施按钮
      showBtnDetails: false, // 是否显示实施详情查看按钮
      showBtn: false
    }
  },
  methods: {
    getDetails() {
      getPlanDetails(this.id, this.planType)
        .then(res => {
          const { data } = res
          this.details = data
          this.date = data.executeDate
          this.showBtnEdit =
            this.details.cancellationTag === '0' &&
            this.details.expiredTag === '0' &&
            this.details.updateTag === '0' &&
            this.$checkPermission('business:planManList:edit')
          this.showBtnImplement =
            this.details.cancellationTag === '0' &&
            this.details.expiredTag === '0' &&
            this.details.implementTag === '0' &&
            this.planType !== '设备点检' &&
            this.$checkPermission('business:planManList:implement')
          this.showBtnDetails = this.details.implementTag !== '0' && this.planType !== '设备点检'
          this.showBtn = this.showBtnEdit || this.showBtnImplement || this.showBtnDetails
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickEdit() {
      this.$router.push({
        path: '/plan/edit',
        query: {
          id: this.id,
          date: this.date
        }
      })
    },
    onClickAdd() {
      if (this.planType === '应急演练') {
        // 计划管理-返回的人员名称=名字加工号，这里去掉，演练计划名字和code分开
        console.log('this.details=', this.details)
        var makeCode = ''
        const makeNames = this.details.enactPerson.split('(')
        if (makeNames.length > 1) {
          makeCode = makeNames[1].split(')')[0]
        }
        var userCode = ''
        const realNames = this.details.personLiable.split('(')
        if (realNames.length > 1) {
          userCode = realNames[1].split(')')[0]
        }
        const planManageData = {
          planManageId: this.id,
          makeDeptId: this.details.enactDeptId, // 制定部门id
          makeDeptName: this.details.enactDept, // 制定部门名字
          makeCode: makeCode, // 制定人员Code
          makeId: this.details.enactPersonId, // 制定人员ID
          makeName: makeNames[0], // 制定人员姓名
          executeTime: this.details.executeDate, // 执行时间(计划管理)
          exercisePlan: this.details.planName, // 计划名称
          deptName: this.details.liableDept, // 责任部门
          deptId: this.details.liableDeptId, // 责任部门id
          realName: realNames[0], // 责任人
          userId: this.details.personLiableId, // 责任人ID
          userCode: userCode, // 责任人Code
          categoryId: this.details.typeId,
          categoryName: this.details.planType // 分类名称
        }
        this.$router.push({
          path: '/emergency/emergencyDrillFormulateBegin',
          query: {
            planManageData: JSON.stringify(planManageData)
          }
        })
      } else {
        this.$router.push({
          path: '/plan/implement',
          query: {
            id: this.id,
            planType: this.planType
          }
        })
      }
    },
    // 跳转实施详情
    async onClickDetails() {
      if (this.planType === '安全检查') {
        const { data } = await getCheckByPlanId(this.id)
        this.$router.push({
          path: '/safetyCheck/check/details',
          query: {
            id: data.id
          }
        })
      }
      if (this.planType === '设备年度检查') {
        const { data } = await getMaintenanceByPlanId(this.id)
        this.$router.push({
          path: '/equipment/maintenance/details',
          query: {
            id: data.id,
            type: '2'
          }
        })
      }
      if (this.planType === '设备维保') {
        const { data } = await getMaintenanceByPlanId(this.id)
        this.$router.push({
          path: '/equipment/maintenance/details',
          query: {
            id: data.id,
            type: '1'
          }
        })
      }
      if (this.planType === '应急演练') {
        const { data } = await getExeByPlanId(this.id)
        this.$router.push({
          path: '/emergency/emergencyDrillDetails',
          query: {
            id: data
          }
        })
      }
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    planType() {
      return this.$route.query.planType
    }
  }
}
</script>
