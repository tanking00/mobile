<!-- Created by Tanking. -->
<!--  -->
<template>
  <div class="container-screenColumn" :style="{ zIndex: zIndex }">
    <div class="screen-wrapper">
      <div v-if="showReward" class="screen-item" @click="showPickerReward = true">
        <span>{{ rewardName }}</span>
        <van-icon name="bm-shaixuan" class="icon-size-12 color-auxiliary" />
      </div>
      <div class="screen-item" @click="showPickerYear = true">
        <span>{{ `年份：${year}` }}</span>
        <van-icon name="bm-shaixuan" class="icon-size-12 color-auxiliary" />
      </div>
    </div>
    <!-- 年份 -->
    <van-popup v-model="showPickerYear" round position="bottom">
      <van-picker show-toolbar :columns="columnsYear" @cancel="showPickerYear = false" @confirm="onConfirmYear" />
    </van-popup>
    <!-- 奖惩 -->
    <van-popup v-model="showPickerReward" round position="bottom">
      <van-picker show-toolbar :columns="columnsReward" @cancel="showPickerReward = false" @confirm="onConfirmReward" />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'ScreenColumn',
  components: {},
  props: {
    showReward: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 年份
      year: '',
      showPickerYear: false,
      columnsYear: [],
      // 奖惩
      rewardName: '奖励表彰',
      showPickerReward: false,
      columnsReward: ['奖励表彰', '违规处罚'],
      zIndex: 1
    }
  },
  methods: {
    onConfirmYear(value) {
      this.showPickerYear = false
      this.year = value
      this.$emit('selectYear', value)
    },
    onConfirmReward(value) {
      this.showPickerReward = false
      this.rewardName = value
      this.$emit('selectReward', value)
    }
  },
  created() {
    let year = new Date().getFullYear()
    this.columnsYear = []
    for (let i = 0; i <= 50; i++) {
      this.columnsYear.push(year)
      year--
    }
    this.year = this.columnsYear[0]
    this.$emit('selectYear', this.year)
    this.$emit('selectReward', this.rewardName)
  },
  mounted() {},
  computed: {},
  watch: {
    showPickerYear(v) {
      if (v) {
        this.zIndex = 2
      } else {
        setTimeout(() => {
          this.zIndex = 1
        }, 300)
      }
    },
    showPickerReward(v) {
      if (v) {
        this.zIndex = 2
      } else {
        setTimeout(() => {
          this.zIndex = 1
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-screenColumn {
  width: 100%;
  height: 50px;
  position: fixed;
  left: 0;
  top: $navbar-height + 50px;
  z-index: 1;
  .screen-wrapper {
    height: 55px;
    width: 100%;
    background-color: $color-bg;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 8px;
    .screen-item {
      margin-left: 16px;
      width: 110px;
      height: 32px;
      background-color: $color-white;
      padding: 0 8px 0 12px;
      font-size: $font-size-sm;
      border-radius: 32px;
      line-height: 32px;
      color: #666666;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
