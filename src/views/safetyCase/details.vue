<!-- Created by Tanking. -->
<!-- 消息详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main">
      <div class="title">{{ details.title }}</div>
      <div class="time">{{ formatTimeStamp(details.updatedTime, 5) }}</div>
      <div class="content pre-wrap">{{ details.content }}</div>
      <div class="image" v-if="url">
        <van-image width="100%" :src="url" @click="onClickImage" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCaseDetails } from '@/api/safetyCase'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getFilesOfId } from '@/api/global'
import { ImagePreview } from 'vant'

export default {
  name: 'SafetyCaseDetails',
  components: {},
  data() {
    return {
      details: {},
      url: ''
    }
  },
  methods: {
    getDetails() {
      getCaseDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          if (data.attachmentId) {
            this.getFilesOfId(data.attachmentId)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getFilesOfId(id) {
      getFilesOfId(id)
        .then(res => {
          // const { data } = res
          this.url = res.url
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickImage() {
      ImagePreview([this.url])
    }
  },
  created() {
    this.getDetails()
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

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  min-height: 100%;
}
.container-main {
  padding: 12px 20px;
  min-height: 100%;
  background-color: $color-white;
  .title {
    color: $color-text-primary;
    font-size: $font-size-xl;
    font-weight: $font-weight;
  }
  .time {
    margin: 12px 0 8px 0;
    color: $color-text-secondary;
    font-size: $font-size-ml;
  }
  .content {
    font-size: $font-size-ml;
    color: $color-text-primary;
    line-height: 30px;
  }
  .image {
    width: 100%;
    height: auto;
    margin-top: 20px;
  }
}
</style>
