<!-- Created by Tanking. -->
<!-- 隐患提报信息 -->
<template>
  <div>
    <div class="label">隐患分类</div>
    <div class="value1">{{ details.type }}</div>
    <div class="label">隐患细类</div>
    <div class="value1">{{ details.subclass }}</div>
    <div class="label">
      隐患等级
      <van-icon name="bm-systemVersionabout" class="icon-size-14 color-text-secondary" @click="showTips = true" />
    </div>
    <div class="value1">{{ details.level }}</div>
    <div class="label">隐患来源</div>
    <div class="value1">{{ details.source }}</div>
    <div class="label">隐患区域</div>
    <div class="value1">{{ details.area }}</div>
    <div v-if="details.area === '项目现场' && details.projectName" class="label">项目现场</div>
    <div v-if="details.area === '项目现场' && details.projectName" class="value1">{{ details.projectName }}</div>
    <div class="label">隐患描述</div>
    <div class="value1">{{ details.narrate }}</div>
    <van-divider v-if="details.fileList && details.fileList.length > 0">附件</van-divider>
    <div v-if="details.fileList && details.fileList.length > 0" class="flie-list">
      <div v-for="(item, index) in details.fileList" :key="index" class="file-item flex-center-column">
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
    <!-- 释义 -->
    <Interpretation v-model="showTips" @change="showTips = false"></Interpretation>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import Interpretation from './interpretation'
import { pxTransform } from '@/utils'

export default {
  name: 'ReportInfo',
  components: { Interpretation },
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showTips: false
    }
  },
  methods: {},
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
