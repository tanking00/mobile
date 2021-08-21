<!-- Created by Tanking. -->
<!-- 导航栏右侧消息按钮 -->
<template>
  <div class="container-messageButton">
    <van-badge :dot="hasDot" class="flex-center-column color-white">
      <van-icon name="bm-systemMessage" class="icon-size-20" />
      <span class="font-size-xs text">消息</span>
    </van-badge>
  </div>
</template>

<script>
import { getMsgCountUnread } from '@/api/newsCenter'

export default {
  name: 'MessageButton',
  data() {
    return {
      hasDot: false
    }
  },
  methods: {
    getMsgCountUnread() {
      getMsgCountUnread(this.$store.getters.code)
        .then(res => {
          const { data } = res
          console.log(data)
          if (data && data > 0) {
            this.hasDot = true
          } else {
            this.hasDot = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getMsgCountUnread()
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-messageButton {
  .van-badge__wrapper {
    ::v-deep .van-badge {
      border: 0;
    }
  }
  .text {
    line-height: 15px;
    margin-top: 1px;
  }
}
</style>
