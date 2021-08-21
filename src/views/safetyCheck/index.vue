<!-- Created by Tanking. -->
<!-- 安全检查 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="default-function-list">
      <router-link :to="{ path: '/safetyCheck/library/list' }">
        <div v-if="$checkPermission('basic:check:items')" class="item-wrapper">
          <van-icon name="bm-xinxiku" />
          <span class="title">检查项信息库</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyCheck/check/list' }">
        <div v-if="$checkPermission('basic:check:info')" class="item-wrapper">
          <van-icon name="bm-jianchaxinxi" />
          <span class="title">安全检查信息</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SafetyCheck'
}
</script>
