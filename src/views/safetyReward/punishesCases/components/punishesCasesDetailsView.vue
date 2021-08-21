<!-- 违规处罚信息-详情-组件 -->
<template>
  <div>
    <van-collapse v-if="details" v-model="actives" class="default-collapse">
      <van-collapse-item name="1" title="发起信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('1') >= 0"></CollapseIcon>
        </template>
        <div class="label">提报人员</div>
        <div class="value1">{{ details.reportStaffName }}</div>
        <div class="label">提报部门</div>
        <div class="value1">{{ details.reportDeptName }}</div>
      </van-collapse-item>
      <van-collapse-item name="2" title="处罚信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('2') >= 0"></CollapseIcon>
        </template>
        <div class="label">违规人员</div>
        <div class="value1">{{ details.illegalStaffName }}</div>
        <div class="label">连带责任人</div>
        <div class="value1" v-if="details.isRelevance == '1'">是</div>
        <div class="value1" v-else>否</div>
        <!--  员工违规信息 -->
        <van-collapse v-model="jointLiabilityMembersActives" class="embedded-collapse" :border="false">
          <van-collapse-item
            v-for="(item, index) in details.staffInfo"
            :key="'1-' + index"
            :title="'信息' + (index + 1)"
          >
            <div class="label">违规过程</div>
            <div class="value1">{{ item.illegalProcess }}</div>
            <div class="label">相关规定</div>
            <div class="value1">{{ item.relevantRegulation }}</div>
            <div class="label">违规情节</div>
            <div class="value1">{{ item.illegalPlot }}</div>
            <div class="label">违规类型</div>
            <div class="value1">{{ item.illegalCategoryName }}</div>
            <div class="label">违规等级</div>
            <div class="value1">{{ item.illegalLevelName }}</div>
          </van-collapse-item>
          <div class="label">处罚建议</div>
          <div class="value1">{{ details.staffForm }}</div>
          <div v-if="details.isRelevance == '1'">
            <div class="label">安全责任领导</div>
            <div class="value1">{{ details.dutyLeaderName + '(' + details.dutyLeaderId + ')' }}</div>
            <van-collapse-item
              v-for="(item, index) in details.leaderInfo"
              :key="'2-' + index"
              :title="'信息' + (index + 1)"
            >
              <div class="label">违规过程</div>
              <div class="value1">{{ item.illegalProcess }}</div>
              <div class="label">相关规定</div>
              <div class="value1">{{ item.relevantRegulation }}</div>
              <!-- <div class="label">违规情节</div>
            <div class="value1">{{ item.illegalPlot }}</div> -->
              <div class="label">违规等级</div>
              <div class="value1">{{ item.illegalLevelName }}</div>
            </van-collapse-item>
            <div class="label">处罚建议</div>
            <div class="value1">{{ details.leaderForm }}</div>
          </div>
          <div v-if="details.files">
            <van-divider>附件</van-divider>
            <div class="flie-list">
              <div
                v-for="(value, index) in details.files"
                :key="index"
                class="file-item flex-center-column"
                @click="$filePreviewFun(value)"
              >
                <van-icon name="bm-otherPdf" class="icon-size-60" />
                <p class="name ellipsis">{{ value.name }}</p>
              </div>
            </div>
          </div>
        </van-collapse>
      </van-collapse-item>
      <van-collapse-item v-if="details.records && details.records.length > 0" name="10" title="历史审批信息">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf('10') >= 0"></CollapseIcon>
        </template>
        <div>
          <div v-for="(item, index) in details.records" :key="item.id">
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
            <van-divider v-if="index !== details.records.length - 1" />
          </div>
        </div>
      </van-collapse-item>
      <!-- <van-collapse-item v-for="(item, index) in myRecords" :key="index" :name="index + 3 + ''" :title="item.nodeName">
        <template #right-icon>
          <CollapseIcon :isOpen="actives.indexOf(index + 3 + '') >= 0"></CollapseIcon>
        </template>
        <div class="label">意见说明</div>
        <div class="value1">{{ item.opinion }}</div>
      </van-collapse-item> -->
    </van-collapse>
    <ProcessInfoPanel
      v-if="stepData"
      :processCode="stepData.processCode"
      :steps="stepData.steps"
      :stepActive="stepData.stepActive"
    ></ProcessInfoPanel>
  </div>
</template>

<script>
import { getDropdownDataOfCode, joinNameAndCode } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
// import { safetyCheckOperation } from '@/utils/enum'

export default {
  name: 'PunishesCasesDetailsView',
  props: {
    details: {
      type: Object
      // default: {}
    },
    stepData: {
      type: Object,
      default() {
        return {
          stepActive: 0,
          processCode: '',
          steps: []
        }
      }
    }
  },
  data() {
    return {
      actives: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      jointLiabilityMembersActives: [],
      myRecords: [],
      categoryList: [
        // { text: 'A类违规', value: 'a' },
        // { text: 'B类违规', value: 'b' },
        // { text: 'C类违规', value: 'c' }
      ],
      safetyCheckOperation: {
        '1': '提交',
        '2': '同意',
        '3': '退回',
        '4': '转办',
        '5': '结束',
        '6': '申诉'
      }
    }
  },
  methods: {
    getLastNode(nodes, nodeName) {
      const list = nodes.filter(item => {
        return item.nodeName === nodeName
      })
      if (list.length === 0) {
        return null
      }
      list.sort(function(a, b) {
        return b.approvalTime - a.approvalTime
      })
      return list[0]
    },
    setupNodes() {
      // var arr = [
      //   '审核',
      //   '人员确认',
      //   '首席安全官批准',
      //   '工会主席批准',
      //   '行政人事总监会签',
      //   '安委会常务副主任会签',
      //   '战略副总裁会签'
      // ]
      // if (this.details.records.length === 0) {
      //   return
      // }
      // // 一级一级退回后，不显示后面的审批，只显示我的上一级的退回审批意见
      // const firstName = this.details.records[0].nodeName
      // const index = arr.indexOf(firstName)
      // if (index !== -1) {
      //   arr.splice(index + 1)
      // }
      // this.myRecords = []
      // for (const nodeName of arr) {
      //   const node = this.getLastNode(this.details.records, nodeName)
      //   if (node) {
      //     if (node.operation === '3') {
      //       node.nodeName = '退回原因' // 修改标题为退回原因
      //     }
      //     this.myRecords.push(node)
      //   }
      // }
    },
    setupCategory() {
      this.details.staffInfo.forEach(async element => {
        for (const cItem of this.categoryList) {
          if (element.illegalCategoryId && element.illegalCategoryId === cItem.value) {
            element.illegalCategoryName = cItem.text
            break
          }
        }
      })
      this.details.leaderInfo.forEach(async element => {
        for (const cItem of this.categoryList) {
          if (element.illegalCategoryId && element.illegalCategoryId === cItem.value) {
            element.illegalCategoryName = cItem.text
            break
          }
        }
      })
    }
  },
  async created() {
    this.categoryList = await getDropdownDataOfCode('safety_illegal_level', false)
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    // safetyCheckOperation() {
    //   return safetyCheckOperation
    // },
    joinNameAndCode() {
      return joinNameAndCode
    }
  },
  watch: {
    details(val, old) {
      if (val !== old && val !== this.show) {
        this.details = val
        this.setupNodes()
        this.setupCategory()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
