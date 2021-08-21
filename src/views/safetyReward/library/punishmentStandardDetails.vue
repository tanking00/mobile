<!-- 处罚标准详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="处罚信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">处罚形式</div>
          <div class="value1">{{ details.form }}</div>
          <div class="label">违规类型</div>
          <div class="value1">{{ details.typeName }}</div>
          <div class="label">违规等级</div>
          <div class="value1">{{ details.levelName }}</div>
          <div class="label">违规情节</div>
          <div class="value1">
            {{ details.description }}
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getPunishmentStandardDetails } from '@/api/safetyReward'
import { getDictLabelOfCode } from '@/utils'
export default {
  name: 'PunishmentStandardDetails',
  props: {},
  data() {
    return {
      activeNames: ['1'],
      details: {}
    }
  },
  methods: {
    getDetails() {
      getPunishmentStandardDetails(this.id)
        .then(async res => {
          const { data } = res
          data.typeName = await getDictLabelOfCode('safety_illegal_type', data.typeId)
          data.levelName = await getDictLabelOfCode('safety_illegal_level', data.levelId)
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
