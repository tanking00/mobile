<!-- Created by Tanking. -->
<!-- 应急预案详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="应急预案信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">编制人</div>
          <div class="value1">{{ details.realName + '(' + details.userId + ')' }}</div>
          <div class="label">编制部门</div>
          <div class="value1">{{ details.deptName }}</div>
          <div class="label">预案名称</div>
          <div class="value1">{{ details.planName }}</div>
          <div class="label">预案分类</div>
          <div class="value1">{{ planCategoryName }}</div>
          <div class="label">生效日期</div>
          <div class="value1">{{ formatTimeStamp(details.startTime, 5) }}</div>
          <div class="label">失效日期</div>
          <div class="value1">{{ formatTimeStamp(details.endTime, 5) }}</div>
          <div class="label">适用范围</div>
          <div class="value1 targets">
            <table>
              <thead>
                <tr>
                  <td>地点</td>
                  <td>区域</td>
                  <td>作业单元</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in details.list" :key="index">
                  <td>{{ item.item }}</td>
                  <td>{{ item.content }}</td>
                  <td>{{ item.unit }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="label">备注</div>
          <div class="value1 pre-wrap">{{ details.remark }}</div>
          <div v-if="details.accessory">
            <van-divider>附件</van-divider>
            <div class="flie-list">
              <div
                v-for="(value, index) in details.files"
                :key="index"
                class="file-item flex-center-column"
                @click="$filePreviewFun(value)"
              >
                <van-icon name="bm-otherPdf" class="icon-size-60" />
                <p class="name ellipsis">{{ value.name }}</p>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getEmergencyPrePlanDetails } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
export default {
  name: 'EmergencyPrePlanDetails',
  props: {},
  data() {
    return {
      activeNames: ['1', '2'],
      details: {
        list: []
      },
      categorys: [],
      planCategoryName: this.$route.query.planCategoryName || ''
    }
  },
  methods: {
    getDetails() {
      getEmergencyPrePlanDetails(this.id)
        .then(res => {
          const { data } = res
          // 处理地点
          if (data.site) {
            var sites = JSON.parse(data.site)
            data.list = sites
          }
          this.details = data
        })
        .catch(err => {
          console.log(err)
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
