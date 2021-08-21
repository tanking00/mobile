<!-- Created by Tanking. -->
<!-- 消息详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="消息信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">消息类型</div>
            <div class="value">{{ details.title }}</div>
            <div class="label">通知时间</div>
            <div class="value">{{ formatTimeStamp(details.sendTime) }}</div>
            <div class="label">消息内容</div>
            <div class="value pre-wrap" v-html="details.context"></div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getMsgInfo } from '@/api/newsCenter'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'NewsCenterDetails',
  components: {},
  data() {
    return {
      activeNames: ['1'],
      details: {}
    }
  },
  methods: {
    getMsgInfo() {
      getMsgInfo(this.id)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getMsgInfo()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>
