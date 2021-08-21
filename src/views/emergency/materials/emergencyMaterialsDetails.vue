<!-- 应急物资详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="应急物详情资信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">物资名称</div>
          <div class="value1">{{ details.facility }}</div>
          <div class="label">物资类型</div>
          <div class="value1">{{ details.materialType }}</div>
          <div class="label">物资编号</div>
          <div class="value1">{{ details.materialNumber }}</div>
          <div class="label">数量</div>
          <div class="value1">{{ details.quantity }}</div>
          <div class="label">状态</div>
          <div class="value1">
            <span
              :class="{
                'color-blue': judgeHasClass(details.materialStatus, '在用'),
                'color-red': judgeHasClass(details.materialStatus, '维修中'),
                'color-gray': judgeHasClass(details.materialStatus, '报废')
              }"
              >{{ details.materialStatus }}</span
            >
          </div>
          <div class="label">放置地点</div>
          <div class="value1">{{ details.address }}</div>
          <div class="label">责任人员</div>
          <div class="value1">{{ details.principal }}</div>
          <div class="label">制造商</div>
          <div class="value1">{{ details.manufacturer }}</div>
          <div class="label">使用说明</div>
          <div class="value1">{{ details.instructions }}</div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { getEmergencyMaterialsDetails } from '@/api/emergency'
import { judgeHasClass } from '@/utils'
// import { emergencyMaterialsStatus } from '@/utils/enum'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'EmergencyMaterialsDetails',
  props: {},
  data() {
    return {
      activeNames: ['1', '2'],
      details: {}
    }
  },
  methods: {
    getDetails() {
      var req = {
        id: this.id
      }
      getEmergencyMaterialsDetails(req)
        .then(res => {
          const { data } = res
          switch (data.materialStatus) {
            case '0':
              data.materialStatus = '在用'
              break
            case '1':
              data.materialStatus = '维修中'
              break
            case '2':
              data.materialStatus = '报废'
              break
          }
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    imgClik(index) {
      ImagePreview({
        images: this.details.images,
        startPosition: index
      })
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    judgeHasClass() {
      return judgeHasClass
    },
    // emergencyMaterialsStatus() {
    //   return emergencyMaterialsStatus
    // },
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.targets {
  table {
    border-radius: 4px;
    width: 100%;
    padding: 0;
    border-collapse: collapse;
    thead {
      tr {
        background: #f8f9fc;
      }
    }
    tbody {
      tr {
        background: $color-white;
        font-size: $font-size-sm;
        color: #666666;
      }
    }
    tr {
      text-align: center;
      width: 100%;
      line-height: 20px;
      vertical-align: middle;
      td {
        border: 1px solid #e8e8e8;
        text-align: center;
        min-height: 32px;
        padding: 6px 12px;
        // &:nth-of-type(1) {
        //   width: 68%;
        // }
        // &:nth-of-type(2) {
        //   width: 32%;
        // }
      }
    }
  }
}
.indexContent {
  font-size: $font-size-sm !important;
  line-height: 20px !important;
}
</style>
