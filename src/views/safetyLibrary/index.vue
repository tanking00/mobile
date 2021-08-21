<!-- Created by Tanking. -->
<!-- 安全文库 -->
<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <router-link :to="{ path: '/laws/library/list' }">
        <div v-if="$checkPermission('security:law:statute')" class="item-wrapper lawsAndRegulations">
          <div class="item">
            <van-icon name="bm-functionalhomeLaw" class="icon-size-40" />
            <span class="title">法律法规</span>
          </div>
        </div>
      </router-link>
      <router-link :to="{ path: '/laws/system/list' }">
        <div v-if="$checkPermission('security:law:regime')" class="item-wrapper systemDocument">
          <div class="item">
            <van-icon name="bm-functionalhomeRegulations" class="icon-size-40" />
            <span class="title">制度文件</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
// import { xxx }from '@/api/xxx';
export default {
  name: 'SafetyLibrary',
  components: {},
  props: {},
  data() {
    return {}
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  .container-main {
    .item-wrapper {
      height: 140px;
      overflow: hidden;
      margin-bottom: $space-vertical;
      border-radius: $border-radius;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      &.lawsAndRegulations {
        background-image: url(~@/assets/safetyLibrary_images/lawsAndRegulations.jpg);
      }
      &.systemDocument {
        background-image: url(~@/assets/safetyLibrary_images/systemDocument.jpg);
      }
      .item {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $color-white;
        .title {
          margin-top: 8px;
          font-size: $font-size-l;
          font-weight: $font-weight;
        }
      }
    }
  }
}
</style>
