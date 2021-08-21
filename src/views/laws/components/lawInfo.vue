<!-- Created by Tanking. -->
<!-- 法规信息 -->
<template>
  <div>
    <div v-if="details.regulationName" class="label">法规名称</div>
    <div v-if="details.regulationName" class="value">{{ details.regulationName }}</div>
    <div v-if="details.regulationType" class="label">法规类别</div>
    <div v-if="details.regulationType" class="value">
      {{ getDictLabel(regulationTypes, details.regulationType) }}
    </div>
    <div v-if="details.regulationScope" class="label">适用区域</div>
    <div v-if="details.regulationScope" class="value">
      {{ getDictLabel(regulationScopes, details.regulationScope) }}
    </div>
    <div v-if="details.regulationEffect" class="label">法律效力</div>
    <div v-if="details.regulationEffect" class="value">
      {{ getDictLabel(regulationEffects, details.regulationEffect) }}
    </div>
    <div class="label">生效状态</div>
    <div class="value">
      <span
        :class="{
          'color-blue': judgeHasClass(details.status, '1'),
          'color-gray': judgeHasClass(details.status, '0')
        }"
        >{{ lawsStatus[details.status] }}</span
      >
    </div>
    <div v-if="details.publishTime" class="label">颁布日期</div>
    <div v-if="details.publishTime" class="value">{{ formatTimeStamp(details.publishTime, 5) }}</div>
    <div v-if="details.effectiveTime" class="label">生效日期</div>
    <div v-if="details.effectiveTime" class="value">
      {{ formatTimeStamp(details.effectiveTime, 5) }}
    </div>
    <div v-if="details.revisionTime" class="label">修订日期</div>
    <div v-if="details.revisionTime" class="value">{{ formatTimeStamp(details.revisionTime, 5) }}</div>
    <div v-if="details.publishAgency" class="label">颁布部门</div>
    <div v-if="details.publishAgency" class="value">
      {{ getDictLabel(publishAgencys, details.publishAgency) }}
    </div>
    <div v-if="details.referenceNumber" class="label">文号/标准号</div>
    <div v-if="details.referenceNumber" class="value">{{ details.referenceNumber }}</div>
    <div v-if="details.remark" class="label">备注</div>
    <div v-if="details.remark" class="value pre-wrap">
      {{ details.remark }}
    </div>
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
</template>

<script>
import { getDictDataOfCode, getDictLabel, judgeHasClass } from '@/utils'
import { getLawsDetails } from '@/api/laws'
import { lawsStatus } from '@/utils/enum'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'LawInfo',
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
      regulationTypes: [],
      regulationScopes: [],
      regulationEffects: [],
      publishAgencys: [],
      files: []
    }
  },
  methods: {
    getDetails() {
      getLawsDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          if (data.attachment) {
            this.files.push(data.attachment)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickFile(data) {
      // try {
      //   // eslint-disable-next-line
      //   wx.previewFile({
      //     url: data.url, // 需要预览文件的地址(必填，可以使用相对路径)
      //     name: data.name, // 需要预览文件的文件名，必须有带文件格式的后缀，例如.doc(不填的话取url的最后部分，最后部分是个包含格式后缀的文件名)
      //     size: data.size // 需要预览文件的字节大小(必填，而且大小必须正确，否则会打开失败)
      //   })
      // } catch (error) {
      //   this.$router.push({
      //     path: '/tools/pdf',
      //     query: { url: data.url, name: data.name }
      //   })
      // }
    }
  },
  async created() {
    this.getDetails()
    this.regulationTypes = await getDictDataOfCode('laws_law_type')
    this.regulationScopes = await getDictDataOfCode('laws_law_scope')
    this.regulationEffects = await getDictDataOfCode('laws_law_effect')
    this.publishAgencys = await getDictDataOfCode('laws_law_dept')
  },
  mounted() {},
  computed: {
    getDictLabel() {
      return getDictLabel
    },
    lawsStatus() {
      return lawsStatus
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    }
  }
}
</script>
