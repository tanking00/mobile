<!-- Created by Tanking. -->
<!-- 隐患整改执行信息 -->
<template>
  <div>
    <div class="label">整改结果</div>
    <div class="value1">{{ details.abarbeitungResults }}</div>
    <van-divider v-if="details.file && details.file.length > 0">附件</van-divider>
    <div v-if="details.file && details.file.length > 0" class="flie-list">
      <div v-for="(item, index) in details.file" :key="index" class="file-item flex-center-column">
        <div v-if="item.type === 'pdf'" class="flex-center-column" @click="$filePreviewFun(item)" style="width:100%">
          <van-icon name="bm-otherPdf" class="icon-size-60" />
          <p class="name ellipsis">{{ item.name }}</p>
        </div>
        <div
          v-if="item.type === 'png' || item.type === 'jpg' || item.type === 'jpeg'"
          class="flex-center-column"
          @click="onClickImage(item)"
          style="width:100%"
        >
          <van-image :width="imageW" :height="imageW" :src="item.url" />
          <p class="name ellipsis">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { pxTransform } from '@/utils'
import { ImagePreview } from 'vant'

export default {
  name: 'ExecuteInfo',
  components: {},
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    onClickImage(item) {
      ImagePreview([item.url])
    }
  },
  created() {},
  mounted() {},
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    },
    imageW() {
      return pxTransform(60)
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
