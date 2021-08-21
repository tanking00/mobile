<!-- Created by Tanking. -->
<!-- 条款信息 -->
<template>
  <div>
    <div v-if="details.content" class="label">条款内容</div>
    <div v-if="details.content" class="value pre-wrap">{{ details.content }}</div>
    <div v-if="details.implementDetail" class="label">实施情况</div>
    <div v-if="details.implementDetail" class="value pre-wrap">{{ details.implementDetail }}</div>
    <div v-if="notEmpty(details.docTypes)" class="label">合规证据类别</div>
    <div v-if="notEmpty(details.docTypes)" class="value">
      {{ formatDocTypes(details.docTypes) }}
    </div>
    <div v-if="notEmpty(details.regimes, 1)" class="label">管理制度</div>
    <div v-if="notEmpty(details.regimes)" class="value">
      {{ details.regimes ? arrJoinStr(details.regimes, '、', 'regimeName') : '' }}
    </div>
  </div>
</template>

<script>
import { arrJoinStr, getDictDataOfCode, getDictLabel } from '@/utils'
import { getClauseDetails } from '@/api/laws'
import { notEmpty } from '@/utils/validate'

export default {
  name: 'ClauseInfo',
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
      docTypes: [] // 合规证据类别
    }
  },
  methods: {
    getDetails() {
      getClauseDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    formatDocTypes(docTypes) {
      if (!docTypes) {
        return ''
      }
      const res = []
      docTypes.forEach(item => {
        const label = getDictLabel(this.docTypes, item.typeName)
        if (label) {
          res.push(label)
        } else {
          res.push(item.typeName)
        }
      })
      return res.join('、')
    }
  },
  async created() {
    this.getDetails()
    this.docTypes = await getDictDataOfCode('laws_provision_type')
  },
  mounted() {},
  computed: {
    notEmpty() {
      return notEmpty
    },
    arrJoinStr() {
      return arrJoinStr
    }
  }
}
</script>
