<!-- Created by Tanking. -->
<!-- 安全检查项信息 -->
<template>
  <div>
    <div v-if="details.checkDate" class="label">检查日期</div>
    <div v-if="details.checkDate" class="value1">{{ formatTimeStamp(details.checkDate, 5) }}</div>
    <div class="label">区域信息</div>
    <div class="value1">
      <span v-for="(item, index) in details.areas" :key="index">
        <i v-if="index !== 0">、</i>
        {{ getDictLabel(checkAreas, item) }}
      </span>
    </div>
    <div v-if="projectName" class="label">项目现场</div>
    <div v-if="projectName" class="value1">
      {{ projectName }}
    </div>
    <div class="label">检查项目</div>
    <van-collapse v-model="activeNames" class="embedded-collapse-2">
      <van-collapse-item v-for="(item, index) in items" :key="item.id" :title="item.itemName" :name="index">
        <div class="checkContent">
          <div class="title">检查内容</div>
          <div class="itemContent">{{ item.itemContent }}</div>
          <van-radio-group v-model="item.isAccord" direction="horizontal" disabled>
            <van-radio name="1">
              符合
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
            </van-radio>
            <van-radio name="2">
              不符合
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
            </van-radio>
            <van-radio name="3">
              不适用
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
            </van-radio>
          </van-radio-group>
          <div v-if="item.isAccord === '2'" class="clearfix label">
            <div class="left">问题描述</div>
            <div
              @click="onClickHazard(item.troubleId)"
              class="right"
              :class="{
                'color-blue': judgeHasClass(item.troubleStatus, '0'),
                'color-gray': judgeHasClass(item.troubleStatus, '1'),
                'color-red': judgeHasClass(item.troubleStatus, '2')
              }"
            >
              {{ sbwbHazardStatus[item.troubleStatus] }}
            </div>
          </div>
          <div v-if="item.isAccord === '2'" class="text">{{ item.problemDescription }}</div>
          <div v-if="item.remark" class="label">备注</div>
          <div v-if="item.remark" class="text">{{ item.remark }}</div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { sbwbHazardStatus } from '@/utils/enum'
import { getDictDataOfCode, getDictLabel, judgeHasClass } from '@/utils'
import { getHazardById } from '@/api/hazard'

export default {
  name: 'CheckItemInfo',
  components: {},
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    },
    projectName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames: [],
      checkAreas: [],
      activeIcon: require('@/assets/icon_images/pitchon.png'),
      inactiveIcon: require('@/assets/icon_images/unselected.png')
    }
  },
  methods: {
    // 点击隐患
    onClickHazard(id) {
      if (!id) return
      getHazardById(id)
        .then(res => {
          const { data } = res
          if (data.hazardDetailsBO) {
            // 一般
            this.$router.push({
              path: '/hazard/general/details',
              query: {
                hazardId: id
              }
            })
          } else {
            // 重大
            this.$router.push({
              path: '/hazard/major/details',
              query: {
                hazardId: id
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created() {
    this.checkAreas = await getDictDataOfCode('security_check_area')
  },
  mounted() {},
  computed: {
    items() {
      return this.details.items
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    getDictLabel() {
      return getDictLabel
    },
    sbwbHazardStatus() {
      return sbwbHazardStatus
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.checkContent {
  .title {
    text-align: center;
    padding: 15px 0 20px 0;
    color: $color-text-secondary;
    font-size: $font-size-m;
  }
  .itemContent {
    color: $color-text-primary;
    font-size: $font-size-ml;
    margin-bottom: 8px;
  }
  .van-radio {
    margin-right: 24px;
  }
  .label {
    color: $color-text-primary;
    font-size: $font-size-ml;
    margin-bottom: 12px;
    margin-top: 20px;
  }
  .text {
    color: $color-text-primary;
    font-size: $font-size-ml;
  }
  ::v-deep .van-radio__label--disabled {
    color: $color-text-primary;
  }
  .img-icon {
    height: 16px;
  }
}
</style>
