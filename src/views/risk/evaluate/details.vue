<!-- Created by Tanking. -->
<!-- 危险源评价详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="危险源信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div class="label">风险类型</div>
            <div class="value">{{ details.riskType }}</div>
            <div class="label">危险源</div>
            <div class="value">{{ details.sourceDanger }}</div>
            <div class="label">事故后果</div>
            <div class="value">{{ details.accidentConsequence }}</div>
            <div class="label">风险等级</div>
            <div class="value">
              <span
                :class="{
                  'color-red': judgeHasClass(details.grade, '1级风险'),
                  'color-orange': judgeHasClass(details.grade, '2级风险'),
                  'color-yellow': judgeHasClass(details.grade, '3级风险'),
                  'color-blue': judgeHasClass(details.grade, '4级风险')
                }"
                >{{ details.grade }}</span
              >
            </div>
            <div class="label">控制现状</div>
            <div class="value">{{ details.controlStatus }}</div>
            <div v-if="details.manageSystem" class="label">相关管理制度</div>
            <div v-if="details.manageSystem" class="value">
              <span class="color-blue" v-for="(temp, idx) in JSON.parse(details.manageSystem)" :key="temp.id">
                <i v-if="idx !== 0">、</i>
                <router-link
                  :to="{
                    path: '/laws/system/details',
                    query: {
                      id: temp.id
                    }
                  }"
                >
                  {{ temp.name }}
                </router-link>
              </span>
            </div>
            <div v-if="details.meetPlan" class="label">相关应急预案</div>
            <div v-if="details.meetPlan" class="value">
              <span class="color-blue" v-for="(temp, idx) in JSON.parse(details.meetPlan)" :key="temp.id">
                <i v-if="idx !== 0">、</i>
                <router-link
                  :to="{
                    path: '/emergency/emergencyPrePlanDetails',
                    query: {
                      id: temp.id
                    }
                  }"
                >
                  {{ temp.name }}
                </router-link>
              </span>
            </div>
            <div class="label">风险评价</div>
            <div class="value evaluates">
              <table>
                <thead>
                  <tr>
                    <td>评价部门</td>
                    <td>L</td>
                    <td>E</td>
                    <td>C</td>
                    <td>D</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in evaluates" :key="index">
                    <td>{{ item.evaluationDep }}</td>
                    <td>{{ item.lscore }}</td>
                    <td>{{ item.escore }}</td>
                    <td>{{ item.cscore }}</td>
                    <td>{{ item.score }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getSourceEvaluateDetails } from '@/api/risk'
import { judgeHasClass } from '@/utils'

export default {
  name: 'RiskEvaluateDetails',
  components: {},
  data() {
    return {
      activeNames: ['1'],
      details: {},
      evaluates: []
    }
  },
  methods: {
    getDetails() {
      getSourceEvaluateDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.evaluates = data.evaluateVOS
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
    judgeHasClass() {
      return judgeHasClass
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.evaluates {
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
        padding: 6px;
        width: 17%;
        &:nth-of-type(1) {
          width: 32%;
          padding: 6px 12px;
        }
      }
    }
  }
}
</style>
