<!-- Created by Tanking. -->
<!-- 安全责任制 -->
<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="default-function-list">
      <router-link :to="{ path: '/safetyDuty/templateList' }">
        <div v-if="$checkPermission('basic:duty:template')" class="item-wrapper">
          <van-icon name="bm-functionalsafetypaperLibrary" />
          <span class="title">责任书签署模板</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyDuty/dutySignList' }">
        <div v-if="$checkPermission('basic:duty:sign')" class="item-wrapper">
          <van-icon name="bm-functionalsafetyresponsiblitySign" />
          <span class="title">责任书签署</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyDuty/dutyTest/dutyTestTemplateList' }">
        <div v-if="$checkPermission('basic:duty:assess')" class="item-wrapper">
          <van-icon name="bm-functinalsafetyResposibility" />
          <span class="title">责任制考核模板</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/safetyDuty/dutyTest/dutyTestList' }">
        <div v-if="$checkPermission('basic:duty:assessSign')" class="item-wrapper">
          <van-icon name="bm-functinalsafetyResposibility" />
          <span class="title">责任制考核</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SafetyDuty'
}
</script>
