<!-- Created by Tanking. -->
<!-- 一般隐患详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="基础信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <BasicInfo :details="details.hazardDetailsBO"></BasicInfo>
        </van-collapse-item>
        <van-collapse-item name="2" title="隐患提报">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <ReportInfo :details="details.hazardDetailsBO"></ReportInfo>
        </van-collapse-item>
        <van-collapse-item v-if="dutyDepts.length > 0" name="3" title="提报部门审核">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="dutyDept-wrapper" v-for="(item, index) in dutyDepts" :key="item.id">
              <div class="item-top clearfix">
                <div class="title left">{{ '整改方案' + toChinesNum(index + 1) }}</div>
                <div class="btn right" @click="onClickDetails(item)">详情</div>
              </div>
              <div class="item-center">
                <div class="label">整改责任部门</div>
                <div class="text">{{ item.deptName }}</div>
                <div class="label">部门经理</div>
                <div class="text">{{ item.deptManager + '（' + item.deptManagerId + '）' }}</div>
                <!-- <div class="label">督办总监</div>
                <div class="text">{{ item.deptSupervise + '（' + item.deptSuperviseId + '）' }}</div> -->
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
  </div>
</template>

<script>
import { getHazardById } from '@/api/hazard'
import { toChinesNum } from '@/utils'
import { BasicInfo, ReportInfo } from '../components'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'HazardGeneralDetails',
  components: { BasicInfo, ReportInfo },
  data() {
    return {
      activeNames: [],
      stepActive: 0,
      steps: [
        { title: '隐患提报', time: '' },
        { title: '提报部门审核', time: '' },
        { title: '整改责任部门审核', time: '' },
        { title: '制定整改方案', time: '' },
        { title: '安全部门审核', time: '' },
        { title: '隐患整改执行', time: '' },
        { title: '整改验收', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      details: {},
      dutyDepts: [],
      activeDeptNames: []
    }
  },
  methods: {
    getDetails() {
      getHazardById(this.hazardId)
        .then(res => {
          const { data } = res
          this.details = data
          this.processCode = data.hazardDetailsBO.processCode
          this.dutyDepts = data.dutyDepts
          this.stepActive = data.hazardDetailsBO.nodeIndex * 1
          if (this.stepActive === 7) {
            this.stepActive = 8
          }
          console.log(this.stepActive)
          if (data.hazardDetailsBO.nodeIndex > 1) {
            this.activeNames.push('3')
          } else if (data.hazardDetailsBO.nodeIndex > 0) {
            this.activeNames.push('2')
          } else {
            this.activeNames.push('1')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击详情
    onClickDetails(data) {
      this.$router.push({
        path: '/hazard/general/branchDetails',
        query: {
          hazardId: this.hazardId,
          hazardSubId: data.hazardSubId
        }
      })
    }
  },
  async created() {
    this.getDetails()
  },
  computed: {
    hazardId() {
      return this.$route.query.hazardId
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    toChinesNum() {
      return toChinesNum
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.dutyDept-wrapper {
  background-color: #f6fafb;
  border-radius: $border-radius;
  margin-bottom: $space-vertical;
  padding: 0 12px 12px 12px;
  :nth-last-of-type(1) {
    margin-bottom: 0;
  }
  .item-top {
    line-height: 43px;
    margin-bottom: 10px;
    .title {
      font-size: $font-size-ml;
      color: $color-text-primary;
      font-weight: $font-weight;
    }
    .btn {
      font-size: $font-size-m;
      color: $color-auxiliary;
    }
  }
  .item-center {
    .label {
      font-size: $font-size-m;
      color: $color-text-secondary;
      margin-bottom: 10px;
    }
    .text {
      font-size: $font-size-m;
      color: $color-text-primary;
      margin-bottom: 20px;
      :nth-last-of-type(1) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
