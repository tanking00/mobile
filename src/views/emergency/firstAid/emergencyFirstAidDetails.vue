<!-- Created by Tanking. -->
<!-- 急救物资详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="急救物详情资信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">物资名称</div>
          <div class="value1">{{ details.suppliesName }}</div>
          <div class="label">物资类型</div>
          <div class="value1">{{ details.typeName }}</div>
          <div class="label">物资编号</div>
          <div class="value1">{{ details.suppliesCode }}</div>
          <div class="label">数量</div>
          <div class="value1">{{ details.suppliesNum }}</div>
          <div class="label">单位</div>
          <div class="value1">{{ details.suppliesUnit }}</div>
          <div class="label">有效期限</div>
          <div class="value1">{{ formatTimeStamp(details.validTime, 5) }}</div>
          <div class="label">状态</div>
          <div class="value1">
            <span
              :class="{
                'color-blue': judgeHasClass(details.status, '10'),
                'color-red': judgeHasClass(details.status, '20'),
                'color-gray': judgeHasClass(details.status, '30')
              }"
              >{{ firstAidMaterialsStatus[details.status] }}</span
            >
          </div>
          <div class="label">放置地点</div>
          <div class="value1">{{ details.suppliesSite }}</div>
          <div class="label">责任人员</div>
          <div class="value1">{{ details.realName + '(' + details.userCode + ')' }}</div>
          <div class="label">使用说明</div>
          <div class="value1">{{ details.remark }}</div>
        </van-collapse-item>
        <van-collapse-item v-if="details.files !== null" name="2" title="相关图片">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <van-image v-for="(img, index) in details.files" :key="index" :src="img.url" @click="imgClik(index)" />
        </van-collapse-item>
        <van-collapse-item name="3" title="变更记录">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <van-steps
            v-if="history"
            direction="vertical"
            :active="history.length"
            active-icon="underway"
            inactive-icon="underway"
          >
            <van-step v-for="(item, index) in history" :key="index">
              <!-- <div class="label">变更前：“数量：12、有效期限：2020-12-31”</div> -->
              <p>{{ item.changedInfo }}</p>
              <p>{{ formatTimeStamp(item.createdTime, 6) }}</p>
            </van-step>
          </van-steps>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { getEmergencyFirstAidDetails, getEmergencyFirstAidHistory } from '@/api/emergency'
import { judgeHasClass } from '@/utils'
import { firstAidMaterialsStatus } from '@/utils/enum'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'EmergencyFirstAidDetails',
  props: {},
  data() {
    return {
      activeNames: ['1', '2', '3'],
      details: {},
      history: []
    }
  },
  methods: {
    getDetails() {
      getEmergencyFirstAidDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.getHistory()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getHistory() {
      var req = { limit: 100, offset: 0, suppliesCode: this.details.suppliesCode }
      getEmergencyFirstAidHistory(req)
        .then(res => {
          const { data } = res
          this.history = data.rows
        })
        .catch(err => {
          console.log(err)
        })
    },
    imgClik(index) {
      var images = this.details.files.map(function(item, index, ary) {
        return item.url
      })
      ImagePreview({
        images: images,
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
    firstAidMaterialsStatus() {
      return firstAidMaterialsStatus
    },
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
