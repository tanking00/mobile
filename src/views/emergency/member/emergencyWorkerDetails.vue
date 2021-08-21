<!-- Created by Tanking. -->
<!-- 应急人员详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="人员信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">姓名</div>
          <div class="value1">{{ details.realName + '(' + details.userId + ')' }}</div>
          <div class="label">工号</div>
          <div class="value1">{{ details.userCode }}</div>
          <div class="label">部门</div>
          <div class="value1">{{ details.deptName }}</div>
        </van-collapse-item>
        <van-collapse-item name="2" title="应急信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <div class="label">应急预案</div>
          <div class="value1 targets">
            <table>
              <thead>
                <tr>
                  <td>应急预案</td>
                  <td>应急角色</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in details.list" :key="index">
                  <td>{{ item.prePlan }}</td>
                  <td>{{ item.role }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="label">备注</div>
          <div class="value1 pre-wrap">{{ details.remark }}</div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getEmergencyMemberDetails } from '@/api/emergency'

export default {
  name: 'EmergencyWorkerDetails',
  props: {},
  data() {
    return {
      activeNames: ['1', '2'],
      details: {}
    }
  },
  methods: {
    getDetails() {
      getEmergencyMemberDetails(this.id)
        .then(res => {
          const { data } = res
          const planName = data.planName
          var planList = JSON.parse(planName)
          var list = []
          console.log('planList=', planList)
          planList.forEach(planItem => {
            var role = planItem.content.map(function(item, index, ary) {
              return item.roleName
            })
            var dict = {
              prePlan: planItem.item.label,
              role: role.join('、')
            }
            list.push(dict)
          })
          console.log('list=', list)
          data.list = list
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
        &:nth-of-type(1) {
          width: 50%;
        }
        &:nth-of-type(2) {
          width: 50%;
        }
      }
    }
  }
}
.indexContent {
  font-size: $font-size-sm !important;
  line-height: 20px !important;
}
</style>
