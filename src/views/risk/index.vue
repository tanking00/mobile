<!-- Created by Tanking. -->
<!-- 安全生产风险管理 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="default-function-list">
      <router-link :to="{ path: '/risk/library/list' }">
        <div v-if="$checkPermission('productionsafety:prodSafety:hazardAssessmentBank')" class="item-wrapper">
          <van-icon name="bm-hazards1" />
          <span class="title">危险源辨识库</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/risk/identification/list' }">
        <div v-if="$checkPermission('productionsafety:prodSafety:hazardAssessmentIdentification')" class="item-wrapper">
          <van-icon name="bm-hazards3" />
          <span class="title">危险源辨识评价</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/risk/evaluate/list' }">
        <div v-if="$checkPermission('productionsafety:prodSafety:hazardIdentification')" class="item-wrapper">
          <van-icon name="bm-hazards2" />
          <span class="title">危险源评价与控制</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Risk'
}
</script>
