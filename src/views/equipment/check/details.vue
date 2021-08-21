<!-- Created by Tanking. -->
<!-- 点检信息详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="设施信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.materialType" class="label">
              {{ `设施类型${details.type == 1 ? '（消防设施）' : '（特殊设备）'}` }}
            </div>
            <div v-if="details.materialType" class="value">{{ details.materialType }}</div>
            <div v-if="details.materialName" class="label">设施名称</div>
            <div v-if="details.materialName" class="value">{{ details.materialName }}</div>
            <div v-if="details.materialNumber" class="label">设施编号</div>
            <div v-if="details.materialNumber" class="value">{{ details.materialNumber }}</div>
            <div v-if="details.principal" class="label">责任人员</div>
            <div v-if="details.principal" class="value">{{ details.principal }}</div>
            <div v-if="details.quantity" class="label">数量</div>
            <div v-if="details.quantity" class="value">{{ details.quantity }}</div>
            <div v-if="details.materialStatus" class="label">设施状态</div>
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
            <div v-if="details.manufacturer" class="label">制造商</div>
            <div v-if="details.manufacturer" class="value">{{ details.manufacturer }}</div>
            <div v-if="details.address" class="label">放置地点</div>
            <div v-if="details.address" class="value">{{ details.address }}</div>
            <div v-if="details.state" class="label">使用说明</div>
            <div v-if="details.state" class="value pre-wrap">{{ details.state }}</div>
          </div>
        </van-collapse-item>
        <van-collapse-item name="2" title="点检信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.checkDate" class="label">点检日期</div>
            <div v-if="details.checkDate" class="value">{{ formatTimeStamp(details.checkDate, 5) }}</div>
            <div class="label">是否涉及隐患</div>
            <div class="value">{{ details.isRisk === '1' ? '是' : '否' }}</div>
            <div v-if="details.remark" class="label">备注</div>
            <div v-if="details.remark" class="value">{{ details.remark }}</div>
            <div v-if="details.riskState && details.isRisk === '1'" class="label">隐患状态</div>
            <div v-if="details.riskState && details.isRisk === '1'" class="value">
              <span
                :class="{
                  'color-blue': judgeHasClass(details.riskState, '0'),
                  'color-red': judgeHasClass(details.riskState, '2'),
                  'color-gray': judgeHasClass(details.riskState, ['1', '3'])
                }"
                @click="onClickHazard(details.hazardId)"
              >
                {{ sbwbHazardStatus[details.riskState] }}
              </span>
            </div>
            <div class="label">检查标准</div>
            <div class="value items">
              <table>
                <thead>
                  <tr>
                    <td>检查标准</td>
                    <td>检查结果</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.content }}</td>
                    <td v-if="item.result === '1'">
                      <van-icon name="info" class="icon-size-12 color-text-auxiliary margin-right-3" />不符合
                    </td>
                    <td v-else><van-icon name="checked" class="icon-size-12 color-blue margin-right-3" />符合</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="label">检查照片</div>
            <div class="value images">
              <UploadImage :default="files" disabled></UploadImage>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getSpotCheckDetails } from '@/api/equipment'
// import { getDictDataOfCode, getDictLabel } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
import { judgeHasClass } from '@/utils'
import { materialStatus, sbwbHazardStatus } from '@/utils/enum'
import { getHazardById } from '@/api/hazard'

export default {
  name: 'EquipmentCheckDetails',
  components: {},
  data() {
    return {
      activeNames: ['2'],
      details: {},
      items: [],
      files: []
    }
  },
  methods: {
    getDetails() {
      getSpotCheckDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.items = data.items
          this.files = data.files
        })
        .catch(err => {
          console.log(err)
        })
    },
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
    this.getDetails()
    // this.regimeTypes = await getDictDataOfCode('laws_regime_type')
    // this.controlObjs = await getDictDataOfCode('laws_regime_obj')
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    // getDictLabel() {
    //   return getDictLabel
    // },
    formatTimeStamp() {
      return formatTimeStamp
    },
    judgeHasClass() {
      return judgeHasClass
    },
    materialStatus() {
      return materialStatus
    },
    sbwbHazardStatus() {
      return sbwbHazardStatus
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
          width: 65%;
        }
        &:nth-of-type(2) {
          width: 35%;
        }
      }
    }
  }
}
</style>
