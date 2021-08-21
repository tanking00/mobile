<!-- 应急演练详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="实施情况综述">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">演练过程综述</div>
          <div class="value1">{{ details.exerciseDesc }}</div>
          <div class="label">演练效果评价及改进意见</div>
          <div class="value1">{{ details.exerciseAdvice }}</div>
          <div class="label">演练评价总结报告</div>
          <div class="value1">见附件</div>
          <div v-if="details.exerciseReport">
            <van-divider>附件</van-divider>
            <div class="flie-list">
              <div
                v-for="(value, index) in details.bfiles"
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
        <van-collapse-item v-if="details.isProblem === '1'" name="2" title="问题项">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <div v-for="(item, index) in problems" :key="index">
            <div class="label">问题{{ index + 1 }}</div>
            <div class="value1">{{ item.des }}</div>
            <div class="label">整改状态</div>
            <div
              class="padding-bottom"
              style="line-height: 30px"
              :class="{
                'color-blue': judgeHasClass(item.status, '进行中'),
                'color-gray': judgeHasClass(item.status, '已完成'),
                'color-red': judgeHasClass(item.status, '已超期')
              }"
            >
              {{ item.status }}
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass } from '@/utils'
import { issueCorrectiveStatus } from '@/utils/enum'
export default {
  name: 'EmergencyDrillDetails',
  props: {},
  data() {
    return {
      activeNames: ['1', '2'],
      details: this.$route.query.data || {},
      problems: []
    }
  },
  methods: {},
  created() {
    if (this.details.problemDesc) {
      var desList = this.details.problemDesc.split('<!!!>')
      var statusList = this.details.troubleStatus.split(',')
      this.problems = []
      desList.forEach((element, index) => {
        this.problems.push({
          des: element,
          status: statusList[index]
        })
      })
    }
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    issueCorrectiveStatus() {
      return issueCorrectiveStatus
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
