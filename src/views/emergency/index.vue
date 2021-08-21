<!-- Created by Tanking. -->
<!-- 应急管理 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="default-function-list">
      <router-link :to="{ path: '/emergency/emergencyPrePlanList' }">
        <div v-if="$checkPermission('productionsafety:planManage:planList')" class="item-wrapper">
          <van-icon name="bm-yingjiyuan1" />
          <span class="title">应急预案信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/emergency/emergencyWorkersList' }">
        <div v-if="$checkPermission('productionsafety:emergencyManage:peopleList')" class="item-wrapper">
          <van-icon name="bm-yingjirenyuan" />
          <span class="title">应急人员信息</span>
        </div>
      </router-link>

      <router-link :to="{ path: '/emergency/emergencyMaterialsList' }">
        <div v-if="$checkPermission('productionsafety:facilityManage:facilityList')" class="item-wrapper">
          <van-icon name="bm-yingjiwuzi" />
          <span class="title">应急物资信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/emergency/emergencyFirstAidList' }">
        <div v-if="$checkPermission('productionsafety:suppliesManage:suppliesList')" class="item-wrapper">
          <van-icon name="bm-jijiuwuzi" />
          <span class="title">急救物资信息</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/emergency/emergencyDrillList' }">
        <div v-if="$checkPermission('productionsafety:emergencyExercise:emergencyExerciseList')" class="item-wrapper">
          <van-icon name="bm-yingjiyanlian" />
          <span class="title">应急演练信息</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Emergency'
}
</script>
