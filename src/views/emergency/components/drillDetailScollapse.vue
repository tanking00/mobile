<!-- 应急演练各个审批信息 -->
<template>
  <van-collapse v-model="actives" class="default-collapse">
    <van-collapse-item v-if="planInfo" name="1" title="应急演练计划信息">
      <template #right-icon>
        <CollapseIcon :isOpen="actives.indexOf('1') >= 0"></CollapseIcon>
      </template>
      <div class="label">演练名称</div>
      <div class="value1">{{ planInfo.exercisePlan }}</div>
      <div class="label">预案分类</div>
      <div class="value1">{{ planInfo.categoryName }}</div>
      <div v-if="planInfo.makeName">
        <div class="label">制定人</div>
        <div class="value1">{{ makeName }}</div>
      </div>
      <div v-if="planInfo.makeDeptName">
        <div class="label">制定人部门</div>
        <div class="value1">{{ planInfo.makeDeptName }}</div>
      </div>

      <div v-if="planInfo.realName">
        <div class="label">责任人</div>
        <div class="value1">{{ responsible }}</div>
      </div>
      <div v-if="planInfo.deptName">
        <div class="label">责任人部门</div>
        <div class="value1">{{ planInfo.deptName }}</div>
      </div>
      <div v-if="planInfo.executeTime">
        <div class="label">执行日期</div>
        <div class="value1">{{ formatTimeStamp(planInfo.executeTime, 7) }}</div>
      </div>
    </van-collapse-item>
    <van-collapse-item v-if="implemenInfo" name="2" title="实施方案信息">
      <template #right-icon>
        <CollapseIcon :isOpen="actives.indexOf('2') >= 0"></CollapseIcon>
      </template>
      <div class="label">演练日期</div>
      <div class="value1">{{ formatTimeStamp(implemenInfo.exerciseTime, 5) }}</div>
      <div class="label">演练地点</div>
      <div class="value1">{{ implemenInfo.exerciseSite }}</div>
      <div class="label">演练人员</div>
      <div class="value1">{{ exerciseRealNameAndCode }}</div>
      <div class="label">演练形式</div>
      <div class="value1">{{ implemenInfo.exerciseType }}</div>
      <div class="label">关联应急预案</div>
      <div class="value1">{{ implemenInfo.planName }}</div>
      <div class="label">演练策划方案</div>
      <div class="value1">见附件</div>
      <div v-if="implemenInfo.accessory">
        <van-divider>附件</van-divider>
        <div class="flie-list">
          <div
            v-for="(value, index) in implemenInfo.afiles"
            :key="index"
            class="file-item flex-center-column"
            @click="$filePreviewFun(value)"
          >
            <van-icon name="bm-otherPdf" class="icon-size-60" />
            <p class="name ellipsis">{{ value.name }}</p>
          </div>
        </div>
      </div>
    </van-collapse-item>
    <!-- <div v-if="auditList">
      <div v-for="(item, index) in auditList" :key="index">
        <van-collapse-item v-if="item.nodeName !== '实施情况综述'" :title="item.nodeName">
          <template #right-icon>
            <CollapseIcon :isOpen="actives.indexOf('3-' + index) >= 0"></CollapseIcon>
          </template>
          <div class="value1">审核人：{{ item.approverName }}</div>
          <div class="value1">审核时间：{{ formatTimeStamp(item.approvalTime, 1) }}</div>
          <div class="value1">审核结果：{{ safetyCheckOperation[item.operation] }}</div>
          <div class="label">备注</div>
          <div class="value1">{{ item.opinion || '未填写' }}</div>
        </van-collapse-item>
      </div>
    </div> -->

    <van-collapse-item v-if="auditList && auditList.length > 0" name="3" title="历史审批信息">
      <template #right-icon>
        <CollapseIcon :isOpen="actives.indexOf('3') >= 0"></CollapseIcon>
      </template>
      <div>
        <div v-for="(item, index) in auditList" :key="item.id">
          <div v-if="item.nodeName" class="value1">{{ `流程节点：${item.nodeName}` }}</div>
          <div v-if="item.approverName" class="value1">{{ `审核人：${item.approverName}` }}</div>
          <div v-if="item.approvalTime" class="value1">
            {{ `审核时间：${formatTimeStamp(item.approvalTime, 6)}` }}
          </div>
          <div v-if="item.operation" class="value1">{{ `审核结果：${safetyCheckOperation[item.operation]}` }}</div>
          <div v-if="item.receiverName" class="value1">
            {{ `接收人：${joinNameAndCode(item.receiverName, item.receiverId)}` }}
          </div>
          <div v-if="item.opinion" class="label">意见说明</div>
          <div v-if="item.opinion" class="value1">{{ item.opinion }}</div>
          <van-divider v-if="index !== auditList.length - 1" />
        </div>
      </div>
    </van-collapse-item>

    <router-link
      v-if="reviewInfo && reviewInfo.status === '20'"
      :to="{
        path: '/emergency/emergencyImplementDetails',
        query: {
          data: reviewInfo
        }
      }"
    >
      <van-collapse-item name="1000-1" title="实施情况综述" disabled>
        <template #right-icon>
          <van-icon name="bm-systemRightarrow" class="color-gray margin-left-5" />
        </template>
      </van-collapse-item>
    </router-link>
  </van-collapse>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { safetyCheckOperation } from '@/utils/enum'
import { joinNameAndCode } from '@/utils'

export default {
  name: 'DrillDetailScollapse',
  components: {},
  props: {
    planInfo: {
      // 应急演练计划信息
      type: Object
    },
    implemenInfo: {
      // 实施方案信息
      type: Object
    },
    auditList: {
      // 审批流信息
      type: Array
      // default() {
      //   return []
      // }
    },
    reviewInfo: {
      // 实施情况综述
      type: Object
    },
    activeNames: {
      // 哪些collapse-item需要打开
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      actives: [],
      makeName: '', // 制定人
      responsible: '', // 责任人
      exerciseRealNameAndCode: '' // 演练人员
      // list: []
    }
  },
  methods: {},
  created() {
    this.actives = this.activeNames
  },
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    safetyCheckOperation() {
      return safetyCheckOperation
    },
    joinNameAndCode() {
      return joinNameAndCode
    }
  },
  watch: {
    planInfo: {
      handler(val, old_value) {
        console.log('val=', val)
        if (!val) {
          return
        }
        this.makeName = val.makeName
        if (val.makeName && val.makeCode) {
          this.makeName = this.makeName + '(' + val.makeCode + ')'
        }
        this.responsible = val.realName
        if (val.userCode) {
          this.responsible = this.responsible + '(' + val.userCode + ')'
        }
        if (val.exerciseRealName && val.exerciseUserCode) {
          const names = val.exerciseRealName.split(',')
          const codes = val.exerciseUserCode.split(',')
          if (names.length === codes.length) {
            var nameTemps = []
            for (let index = 0; index < names.length; index++) {
              const name = names[index]
              const code = codes[index]
              var nameString = name
              if (code && code.length !== 0) {
                nameString = name + '(' + code + ')'
              }
              nameTemps.push(nameString)
            }
            this.exerciseRealNameAndCode = nameTemps.join(',')
          } else {
            this.exerciseRealNameAndCode = val.exerciseRealName
          }
        } else {
          this.exerciseRealNameAndCode = val.exerciseRealName
        }
      },
      immediate: true
      // deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
