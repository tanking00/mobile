<!-- Created by Tanking. -->
<!-- 法律法规详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="法规信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <LawInfo :id="id"></LawInfo>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { LawInfo } from '../components'

export default {
  name: 'LawsLibraryDetails',
  components: { LawInfo },
  data() {
    return {
      activeNames: ['1']
    }
  },
  methods: {},
  created() {},
  computed: {
    id() {
      return this.$route.query.id
    }
  }
}
</script>
