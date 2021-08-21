<!-- Created by Tanking. -->
<!-- 检查项详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="检查项信息" disabled>
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.itemName" class="label">检查项目</div>
            <div v-if="details.itemName" class="value">{{ details.itemName }}</div>
            <div v-if="details.itemType" class="label">检查类型</div>
            <div v-if="details.itemType" class="value">{{ getDictLabel(itemTypes, details.itemType) }}</div>
            <div v-if="details.itemContent" class="label">检查内容</div>
            <div v-if="details.itemContent" class="value pre-wrap">{{ details.itemContent }}</div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getCheckItemDetails } from '@/api/safetyCheck'
import { getDictDataOfCode, getDictLabel } from '@/utils'

export default {
  name: 'SafetyCheckLibraryDetails',
  components: {},
  data() {
    return {
      activeNames: ['1'],
      details: {},
      itemTypes: []
    }
  },
  methods: {
    getDetails() {
      getCheckItemDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created() {
    this.getDetails()
    this.itemTypes = await getDictDataOfCode('security_check_type')
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    getDictLabel() {
      return getDictLabel
    }
  }
}
</script>
