<!-- Created by Tanking. -->
<!-- 安全资质 -->
<template>
  <div class="container">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
      @click-right="showSheet = true"
    />
    <div class="default-list">
      <div v-for="item in qualifications" :key="item.id" class="list-item">
        <div class="clearfix item-top">
          <span class="left font-size-ml font-weight ellipsis max-width-200">{{ item.userQmame }}</span>
          <span
            class="right"
            :class="{
              'color-red': timeStampExpire(item.userQexpireDate),
              'color-blue': !timeStampExpire(item.userQexpireDate)
            }"
            >{{ timeStampExpire(item.userQexpireDate) ? '已逾期' : '有效' }}</span
          >
        </div>
        <div class="color-text-secondary">
          {{ `有效期：${formatTimeStamp(item.userQbeginDate, 3)}至${formatTimeStamp(item.userQexpireDate, 3)}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatTimeStamp, timeStampExpire } from '@/utils/timeFormat'

export default {
  name: 'UserCenterQualifications',
  data() {
    return {}
  },
  methods: {},
  created() {},
  computed: {
    ...mapGetters(['qualifications']),
    formatTimeStamp() {
      return formatTimeStamp
    },
    timeStampExpire() {
      return timeStampExpire
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  padding-top: $navbar-height;
  height: 100%;
  .default-list {
    padding-top: 1px;
    .item-top {
      margin-bottom: 12px;
    }
  }
}
</style>
