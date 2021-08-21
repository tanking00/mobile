<!-- Created by Tanking. -->
<!-- 设备设施管理 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="default-function-list">
      <router-link :to="{ path: '/equipment/library/list' }">
        <div v-if="$checkPermission('productionsafety:equipmentManagement:tallysheetlibrary')" class="item-wrapper">
          <van-icon name="bm-dianjianbiao" />
          <span class="title">点检表库</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/equipment/equipment/fireList' }">
        <div
          v-if="$checkPermission('productionsafety:equipmentManagement:FireFightingFacilityList')"
          class="item-wrapper"
        >
          <van-icon name="bm-xiaofangsheshi" />
          <span class="title">消防设施信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/equipment/equipment/specialList' }">
        <div
          v-if="$checkPermission('productionsafety:equipmentManagement:specialequipmentInformationList')"
          class="item-wrapper"
        >
          <van-icon name="bm-teshushebei" />
          <span class="title">特殊设备信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/equipment/check/list' }">
        <div v-if="$checkPermission('productionsafety:equipmentManagement:checktheinformation')" class="item-wrapper">
          <van-icon name="bm-dianjianxinxi" />
          <span class="title">点检信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/equipment/maintenance/maintenanceList' }">
        <div
          v-if="$checkPermission('productionsafety:equipmentManagement:maintenanceinformationList')"
          class="item-wrapper"
        >
          <van-icon name="bm-weibaoxinxi" />
          <span class="title">维保信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/equipment/maintenance/inspectList' }">
        <div v-if="$checkPermission('productionsafety:equipmentManagement:annualInspection')" class="item-wrapper">
          <van-icon name="bm-niandu" />
          <span class="title">年度检查</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Equipment'
}
</script>
