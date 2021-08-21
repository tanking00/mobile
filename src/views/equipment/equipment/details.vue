<!-- Created by Tanking. -->
<!-- 消防设施信息详情/特殊设备信息详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" :title="type == '1' ? '消防设施信息' : '设备信息'">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.materialType" class="label">
              {{ type == '1' ? '设施类型（消防设施）' : '设备类型（特殊设备）' }}
            </div>
            <div v-if="details.materialType" class="value">{{ details.materialType }}</div>
            <div v-if="details.facility" class="label">{{ type == '1' ? '设施名称' : '设备名称' }}</div>
            <div v-if="details.facility" class="value">{{ details.facility }}</div>
            <div v-if="details.materialNumber" class="label">{{ type == '1' ? '设施编号' : '设备编号' }}</div>
            <div v-if="details.materialNumber" class="value">{{ details.materialNumber }}</div>
            <div v-if="details.principal" class="label">责任人员</div>
            <div v-if="details.principal" class="value">{{ details.principal }}</div>
            <div v-if="details.quantity" class="label">数量</div>
            <div v-if="details.quantity" class="value">{{ details.quantity }}</div>
            <div v-if="details.materialStatus" class="label">{{ type == '1' ? '设施状态' : '设备状态' }}</div>
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
            <div v-if="details.instructions" class="label">使用说明</div>
            <div v-if="details.instructions" class="value pre-wrap">{{ details.instructions }}</div>
            <div v-if="details.inspect" class="label">点检表</div>
            <div v-if="details.inspect" class="value">{{ details.inspect }}</div>
            <div v-if="details.inspect" class="qr-image-wrapper">
              <vue-qr :text="'ehs-' + details.id" :size="size" :margin="1"></vue-qr>
            </div>
            <van-divider v-if="files.length > 0">附件</van-divider>
            <div v-if="files.length > 0" class="flie-list">
              <div
                v-for="(item, index) in files"
                :key="index"
                class="file-item flex-center-column"
                @click="$filePreviewFun(item)"
              >
                <van-icon name="bm-otherPdf" class="icon-size-60" />
                <p class="name ellipsis">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getFireControlDetails } from '@/api/equipment'
import { judgeHasClass, pxTransform } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'
import { materialStatus } from '@/utils/enum'
import vueQr from 'vue-qr'

export default {
  name: 'EquipmentEquipmentDetails',
  components: { vueQr },
  data() {
    return {
      activeNames: ['1'],
      details: {},
      files: []
    }
  },
  methods: {
    getDetails() {
      getFireControlDetails({ id: this.id, type: this.type })
        .then(res => {
          const { data } = res
          this.details = data
          if (data.file) {
            data.file.forEach(element => {
              if (element) {
                this.files.push(element)
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
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    type() {
      return this.$route.query.type
    },
    judgeHasClass() {
      return judgeHasClass
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    materialStatus() {
      return materialStatus
    },
    size() {
      return pxTransform(70)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.qr-image-wrapper {
  width: 70px;
  height: 70px;
}
</style>
