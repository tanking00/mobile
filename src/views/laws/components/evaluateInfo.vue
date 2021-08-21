<!-- Created by Tanking. -->
<!-- 条款信息 -->
<template>
  <div>
    <div class="label">合规评价</div>
    <div class="value">{{ clauseCompliance[details.assessmentStatus] }}</div>
    <div class="label">评审人</div>
    <div class="value">{{ details.assessmentUserName }}</div>
    <div class="label">评审时间</div>
    <div class="value">{{ formatTimeStamp(details.assessmentTime, 5) }}</div>
    <div v-if="details.assessmentStatus === '1'">
      <div class="label">符合性证据</div>
      <div class="value">见附件</div>
      <van-divider v-if="files.length > 0">附件</van-divider>
      <div v-if="files.length > 0" class="flie-list">
        <div
          v-for="(item, index) in files"
          :key="index"
          class="file-item flex-center-column"
          @click="$filePreviewFun(item)"
        >
          <van-icon name="bm-otherPdf" class="icon-size-60" />
          <p class="name ellipsis">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div v-if="details.assessmentStatus === '0'">
      <div class="label">不符合内容</div>
      <div class="value pre-wrap">{{ details.denyContent }}</div>
      <div class="label">不符合整改措施</div>
      <div class="value pre-wrap">{{ details.rectificationMeasures }}</div>
      <div class="label">完成时间</div>
      <div class="value">{{ formatTimeStamp(details.completionTime, 5) }}</div>
      <div class="label">责任人</div>
      <div class="value">{{ details.liableUserName }}</div>
      <div class="label">责任人工号</div>
      <div class="value">{{ details.liableUserCode }}</div>
      <div class="label">责任人部门</div>
      <div class="value">{{ details.liableUserDept }}</div>
      <div class="label">完成结果</div>
      <div class="value">{{ details.result === '1' ? '完成' : '未完成' }}</div>
    </div>
  </div>
</template>

<script>
import { getClauseDetails } from '@/api/laws'
import { clauseCompliance } from '@/utils/enum'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'EvaluateInfo',
  components: {},
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      details: {},
      files: []
    }
  },
  methods: {
    getDetails() {
      getClauseDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data.lawsEvaluateDetailVO
          if (data.lawsEvaluateDetailVO && data.lawsEvaluateDetailVO.attachment) {
            this.files.push(data.lawsEvaluateDetailVO.attachment)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created() {
    this.getDetails()
  },
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    clauseCompliance() {
      return clauseCompliance
    }
  }
}
</script>
