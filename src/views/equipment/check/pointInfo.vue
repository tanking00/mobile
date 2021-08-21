<!-- Created by Tanking. -->
<!-- 点位信息 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="点位信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.facility" class="label">物资名称</div>
            <div v-if="details.facility" class="value">{{ details.facility }}</div>
            <div v-if="details.materialType" class="label">物资类型</div>
            <div v-if="details.materialType" class="value">{{ details.materialType }}</div>
            <div v-if="details.principal" class="label">责任人员</div>
            <div v-if="details.principal" class="value">{{ details.principal }}</div>
            <div v-if="details.materialNumber" class="label">物资编号</div>
            <div v-if="details.materialNumber" class="value">{{ details.materialNumber }}</div>
            <div v-if="details.quantity" class="label">数量</div>
            <div v-if="details.quantity" class="value">{{ details.quantity }}</div>
            <div v-if="details.manufacturer" class="label">制造商</div>
            <div v-if="details.manufacturer" class="value">{{ details.manufacturer }}</div>
            <div v-if="details.address" class="label">放置地点</div>
            <div v-if="details.address" class="value">{{ details.address }}</div>
            <div v-if="details.materialStatus" class="label">物资状态</div>
            <div v-if="details.materialStatus" class="value">
              <span
                :class="{
                  'color-blue': judgeHasClass(details.materialStatus, '0'),
                  'color-yellow': judgeHasClass(details.materialStatus, '1'),
                  'color-gray': judgeHasClass(details.materialStatus, '2')
                }"
              >
                {{ materialStatus[details.materialStatus] }}
              </span>
            </div>
            <div v-if="details.instructions" class="label">使用说明</div>
            <div v-if="details.instructions" class="value pre-wrap">{{ details.instructions }}</div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <SubmitButton @click="onClickSubmit" text="开始检查"></SubmitButton>
  </div>
</template>

<script>
import { getMaterialDetails } from '@/api/equipment'
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass } from '@/utils'
import { materialStatus } from '@/utils/enum'

export default {
  name: 'EquipmentCheckPointInfo',
  components: {},
  data() {
    return {
      activeNames: ['1'],
      details: {}
    }
  },
  methods: {
    getDetails() {
      getMaterialDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
          this.$router.go(-1)
        })
    },
    onClickSubmit() {
      this.$router.push({
        path: '/equipment/check/checkList',
        query: {
          id: this.id,
          inspectId: this.details.inspectId,
          facility: this.details.facility
        }
      })
    }
  },
  async created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    materialStatus() {
      return materialStatus
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.items {
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
        &:nth-of-type(1) {
          width: 38%;
        }
        &:nth-of-type(2) {
          width: 62%;
        }
      }
    }
  }
}
</style>
