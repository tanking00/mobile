<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" fixed placeholder @click-right="$router.push({ path: '/newsCenter' })">
      <template #right>
        <MessageButton></MessageButton>
      </template>
    </van-nav-bar>
    <EmptyList v-if="showList.length <= 0" description="暂无可用功能" top="l" />
    <div v-else class="container-main padding-left-right">
      <div v-for="(item, index) in showList" :key="index" class="type-wrapper">
        <div class="font-size-l font-weight">{{ item.type }}</div>
        <div class="list border-radius background-color-white">
          <div v-for="(value, idx) in item.child" :key="idx" class="item-wrapper" @click="onClickItem(value)">
            <van-icon :name="value.icon" class="icon-size-40" :class="value.color || 'color-auxiliary'" />
            <span class="title ellipsis center font-size-sm color-text-secondary">{{ value.title }}</span>
          </div>
        </div>
      </div>
    </div>
    <SosButton></SosButton>
    <Footer></Footer>
  </div>
</template>

<script>
import { Footer, SosButton, MessageButton } from '@/components'
import { Dialog } from 'vant'
export default {
  name: 'Workbench',
  components: {
    Footer,
    SosButton,
    MessageButton
  },
  data() {
    return {
      list: [
        {
          type: '基础模块',
          child: [
            {
              title: '安全责任制',
              icon: 'bm-functinalsafetyResposibility',
              path: '/safetyDuty',
              show: this.$checkPermission('basic:duty')
            },
            {
              title: '安全检查',
              icon: 'bm-functionalsafetyInspect',
              color: 'color-yellow',
              path: '/safetyCheck',
              show: this.$checkPermission('basic:check')
            },
            {
              title: '隐患排查治理',
              icon: 'bm-functionalriskIdentification',
              color: 'color-yellow',
              path: '/hazard',
              show: this.$checkPermission('basic:dangercatalog')
            },
            {
              title: '安全奖惩',
              icon: 'bm-functionalsafetyAward',
              color: 'color-red-dark',
              path: '/safetyReward',
              show: this.$checkPermission('basic:security')
            },
            {
              title: '计划管理',
              icon: 'bm-functionalLawcommentrecords',
              path: '/plan/list',
              show: this.$checkPermission('business:planManList')
            }
          ]
        },
        {
          type: '安全生产',
          child: [
            {
              title: '安全生产风险管理',
              icon: 'bm-functionalriskProduction',
              color: 'color-red-dark',
              path: '/risk',
              show: this.$checkPermission('productionsafety:prodSafety')
            },
            {
              title: '设备设施管理',
              icon: 'bm-functionalEquipment',
              path: '/equipment',
              show: this.$checkPermission('productionsafety:equipmentManagement')
            },
            {
              title: '应急管理',
              icon: 'bm-functionalEmergency',
              color: 'color-red-dark',
              path: '/emergency',
              show: this.$checkPermission('productionsafety:emergencyManage')
            }
          ]
        },
        {
          type: '安全文库',
          child: [
            {
              title: '法规与制度管理',
              icon: 'bm-functionallawLibrary',
              path: '/laws',
              show: this.$checkPermission('security:law')
            }
          ]
        }
      ]
    }
  },
  computed: {
    showList() {
      // 过滤全false的分类
      const temp = this.list.filter(type => {
        return type.child.some(item => {
          return item.show
        })
      })
      // 过滤分类下的false
      const res = temp.map(type => {
        const t = {}
        t.type = type.type
        t.child = type.child.filter(item => {
          return item.show
        })
        return t
      })
      return res
    }
  },
  methods: {
    onClickItem(value) {
      switch (value.title) {
        case '':
          break
        default:
          if (value.path) {
            this.$router.push({ path: value.path })
          } else {
            Dialog.alert({
              title: '提示',
              message: '该功能暂未实现',
              closeOnClickOverlay: true
            })
              .then(() => {
                // on close
              })
              .catch(() => {
                // on cancel
              })
          }
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  .container-main {
    padding-top: 12px;
    .type-wrapper {
      .list {
        margin-top: 12px;
        margin-bottom: 12px;
        box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.03);
        display: flex;
        align-items: center;
        align-content: center;
        flex-wrap: wrap;
        padding-top: 20px;
        .item-wrapper {
          width: 30%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          margin-top: 4px;
          &:nth-of-type(3n + 2) {
            margin-left: 5%;
            margin-right: 5%;
          }
          .title {
            margin-top: 8px;
            width: 90%;
          }
        }
      }
    }
  }
}
</style>
