<!-- Created by Tanking. -->
<!-- 法规与制度管理 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="default-function-list">
      <router-link :to="{ path: '/laws/library/list' }">
        <div v-if="$checkPermission('security:law:statute')" class="item-wrapper">
          <van-icon name="bm-functionalhomeLaw1" />
          <span class="title">法律法规库</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/laws/clause/list' }">
        <div v-if="$checkPermission('security:law:provision')" class="item-wrapper">
          <van-icon name="bm-functionalLawsuitableitems" />
          <span class="title">适用条款</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/laws/system/list' }">
        <div v-if="$checkPermission('security:law:regime')" class="item-wrapper">
          <van-icon name="bm-functionalLawRegulations" />
          <span class="title">管理制度</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/laws/evaluate/list' }">
        <div v-if="$checkPermission('security:law:evaluationRecords')" class="item-wrapper">
          <van-icon name="bm-functionalLawcommentrecords" />
          <span class="title">合规性评价记录</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Laws'
}
</script>
