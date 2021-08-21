<template>
  <div class="container" :class="{ scroll: !scroll }">
    <van-nav-bar
      :border="false"
      fixed
      placeholder
      :title="$route.meta.title"
      @click-left="onClickLeft"
      @click-right="$router.push({ path: '/newsCenter' })"
    >
      <template #left>
        <ScanCodeButton></ScanCodeButton>
      </template>
      <template #right>
        <MessageButton></MessageButton>
      </template>
    </van-nav-bar>
    <van-pull-refresh v-model="refreshing" success-text="" @refresh="onRefresh" class="refresh-min-height-m">
      <router-link :to="{ path: '/userCenter' }">
        <div class="user-info">
          <div class="user-info-content clearfix">
            <div class="avatar-border left border-radius-circular">
              <van-image :src="getUserAvatar(avatar)" fit="cover" width="100%" height="100%">
                <template v-slot:error>
                  <van-icon name="bm-defaultAvatar" class="icon-size-48 color-text-auxiliary" />
                </template>
              </van-image>
            </div>
            <div class="name-info left color-white margin-left-18">
              <p class="name font-size-ml">{{ name }}</p>
              <p class="font-size-xs">{{ primaryOrg ? primaryOrg.name : '部门' }}</p>
            </div>
            <div class="right arrow-btn">
              <van-icon name="arrow" class="color-white icon-size-20" />
            </div>
          </div>
        </div>
      </router-link>
      <div class="task-container margin-top-bottom padding-left-right">
        <router-link
          :to="{
            path: '/plan/list',
            query: {
              status: '1',
              nowDate: true
            }
          }"
        >
          <div class="task-type flex-center-column color-white background-color-auxiliary border-radius">
            <div class="font-size-en-l font-weight">{{ planCount }}</div>
            <div class="flex-center">
              <van-icon name="bm-systemEye" class="icon-size-18" />
              <span class="font-size-sm margin-left-8">待办计划</span>
            </div>
          </div>
        </router-link>
        <router-link :to="{ path: '/taskCenter' }">
          <div class="task-type flex-center-column color-white background-color-primary border-radius">
            <div class="font-size-en-l font-weight">{{ upcomingCount + toBeReadCount }}</div>
            <div class="flex-center">
              <van-icon name="bm-systemTasktodo" class="icon-size-18" />
              <span class="font-size-sm margin-left-8">待阅/待办任务</span>
            </div>
          </div>
        </router-link>
      </div>
      <div
        v-if="showFuncList.length > 0"
        class="function-container margin-left-right margin-bottom background-color-white border-radius"
      >
        <div class="title-module clearfix">
          <span class="title">功能应用</span>
          <span class="en-title">FUNCTION APPLICATION</span>
          <router-link :to="{ path: '/workbench' }">
            <span class="more">更多</span>
          </router-link>
        </div>
        <div class="list-container flex-center">
          <div v-for="(item, index) in showFuncList" :key="index" class="item-wrapper" @click="onClickItem(item)">
            <van-icon :name="item.icon" class="icon-size-40 color-auxiliary" />
            <span class="title ellipsis center font-size-sm color-text-secondary">{{ item.title }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="$checkPermission('business:accidentCase') && swipes.length > 0"
        class="case-container margin-left-right margin-bottom background-color-white border-radius"
      >
        <div class="title-module clearfix">
          <span class="title">国内外安全事件事故</span>
          <span class="en-title">SAFETY CASE</span>
          <router-link :to="{ path: '/safetyCase' }">
            <span class="more">更多</span>
          </router-link>
        </div>
        <div class="list-container">
          <van-swipe :loop="false" :width="swipeWidth" :stop-propagation="false">
            <van-swipe-item v-for="(item, index) in swipes" :key="index" @click="onClickCase(item)">
              <div class="list-item clearfix">
                <div class="image-wrapper left">
                  <van-image v-if="imageList[index]" :src="imageList[index]" width="100%" height="100%" fit="cover" />
                </div>
                <div class="content-wrapper right">
                  <div class="title font-size-ml ellipsis font-weight">{{ item.title }}</div>
                  <div class="content font-size-m ellipsis-2 color-text-secondary">
                    {{ item.content }}
                  </div>
                  <div class="time color-text-secondary font-size-sm">
                    {{ formatTimeStamp(item.updatedTime, 8) }}
                  </div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <div
        v-if="$checkPermission('security')"
        class="library-container margin-left-right margin-bottom background-color-white border-radius"
      >
        <div class="title-module clearfix">
          <span class="title">安全文库</span>
          <span class="en-title">SAFETY LIBRARY</span>
          <router-link :to="{ path: '/safetyLibrary' }">
            <span class="more">更多</span>
          </router-link>
        </div>
        <div class="list-container clearfix">
          <router-link :to="{ path: '/laws/library/list' }">
            <div
              v-if="$checkPermission('security:law:statute')"
              class="item-wrapper left border-radius background-cover lawsAndRegulations"
            >
              <div class="item flex-center-column color-white">
                <van-icon name="bm-functionalhomeLaw" class="icon-size-28" />
                <span class="title font-size-sm">法律法规</span>
              </div>
            </div>
          </router-link>
          <router-link :to="{ path: '/laws/system/list' }">
            <div
              v-if="$checkPermission('security:law:regime')"
              class="item-wrapper left border-radius background-cover systemDocument"
            >
              <div class="item flex-center-column color-white">
                <van-icon name="bm-functionalhomeRegulations" class="icon-size-28" />
                <span class="title font-size-sm">制度文件</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </van-pull-refresh>
    <SosButton></SosButton>
    <Footer></Footer>
  </div>
</template>

<script>
import { Footer, SosButton, MessageButton, ScanCodeButton } from '@/components'
import { mapGetters } from 'vuex'
import { Dialog, Toast } from 'vant'
import { getTaskCount } from '@/api/task'
import { getUserAvatar, pxTransform } from '@/utils'
import { getCaseList } from '@/api/safetyCase'
import { formatTimeStamp } from '@/utils/timeFormat'
import { getFilesOfId, getPlanCount } from '@/api/global'

export default {
  inject: ['reload'],
  name: 'Home',
  components: {
    Footer,
    SosButton,
    MessageButton,
    ScanCodeButton
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'primaryOrg']),
    showFuncList() {
      return this.funcList
        .filter(item => {
          return item.show
        })
        .slice(0, 3)
    },
    swipeWidth() {
      return pxTransform(320)
    },
    getUserAvatar() {
      return getUserAvatar
    },
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  data() {
    return {
      funcList: [
        {
          title: '应急管理',
          icon: 'bm-functionalEmergency',
          path: '/emergency',
          show: this.$checkPermission('productionsafety:emergencyManage')
        },
        {
          title: '隐患排查与治理',
          icon: 'bm-functionalriskIdentification',
          path: '/hazard',
          show: this.$checkPermission('basic:dangercatalog')
        },
        {
          title: '安全检查',
          icon: 'bm-functionalsafetyInspect',
          path: '/safetyCheck',
          show: this.$checkPermission('basic:check')
        },
        {
          title: '安全责任制',
          icon: 'bm-functinalsafetyResposibility',
          path: '/safetyDuty',
          show: this.$checkPermission('basic:duty')
        },
        {
          title: '法规与制度管理',
          icon: 'bm-functionallawLibrary',
          path: '/laws',
          show: this.$checkPermission('security:law')
        },
        {
          title: '计划管理',
          icon: 'bm-functionalLawcommentrecords',
          path: '/plan/list',
          show: this.$checkPermission('business:planManList')
        },
        {
          title: '安全生产风险管理',
          icon: 'bm-functionalriskProduction',
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
          title: '安全奖惩',
          icon: 'bm-functionalsafetyAward',
          path: '/safetyReward',
          show: this.$checkPermission('basic:security')
        }
      ],
      refreshing: false, // 刷新
      upcomingCount: 0, // 待办数量
      toBeReadCount: 0, // 待阅数量
      planCount: 0, // 待办计划数量
      swipes: [],
      scroll: false,
      imageList: []
    }
  },
  created() {
    this.getTaskCount()
    this.getPlanCount()
    document.addEventListener('scroll', this.handleScroll, true)
    if (this.$checkPermission('business:accidentCase')) {
      this.getCaseList()
    }
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.handleScroll)
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
    },
    onRefresh() {
      setTimeout(() => {
        this.reload()
      }, 1000)
    },
    getTaskCount() {
      getTaskCount()
        .then(res => {
          const { data } = res
          this.upcomingCount = data.toBeUpcoming
          this.toBeReadCount = data.toBeRead
          // this.upcomingCount = data.upcoming
        })
        .catch(err => {
          console.log(err)
        })
    },
    getPlanCount() {
      getPlanCount()
        .then(res => {
          const { data } = res
          console.log(data)
          this.planCount = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleScroll(event) {
      const top = event.target.scrollTop
      if (top > 10) {
        this.scroll = true
      } else {
        this.scroll = false
      }
    },
    onClickLeft() {
      const that = this
      window.wx.scanQRCode({
        desc: 'scanQRCode desc',
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果
        scanType: ['qrCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
        success: function(res) {
          // 回调
          const { resultStr } = res
          if (resultStr && resultStr.indexOf('ehs-') > -1) {
            const id = resultStr.split('-')[1]
            that.$router.push({
              path: '/equipment/check/pointInfo',
              query: {
                id: id
              }
            })
          } else {
            Toast('无效的二维码')
          }
        },
        error: function(res) {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            Toast('版本过低请升级')
          }
        }
      })
    },
    getCaseList() {
      const req = {
        limit: 3,
        offset: 0,
        status: '1'
      }
      getCaseList(req)
        .then(res => {
          const { data } = res
          this.swipes = data.rows || []
          this.swipes.forEach((item, index) => {
            if (item.attachmentId) {
              this.getFilesOfId(item.attachmentId, index)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickCase(data) {
      this.$router.push({
        path: '/safetyCase/details',
        query: {
          id: data.id
        }
      })
    },
    getFilesOfId(id, index) {
      getFilesOfId(id)
        .then(res => {
          // const { data } = res
          this.$set(this.imageList, index, res.url)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
::v-deep .van-swipe__indicator {
  background-color: #e0e0e0;
  width: 4px;
  height: 3px;
  opacity: 1;
  border-radius: 0;
  &.van-swipe__indicator--active {
    background-color: $color-primary;
    width: 10px;
  }
}
.scroll {
  ::v-deep .van-nav-bar__placeholder {
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100% 50px;
    background-image: url(~@/assets/navbar_bg/bg-top.png);
  }
  ::v-deep .van-nav-bar {
    background-color: rgba(26, 43, 106, 0.96);
  }
}
.container {
  .user-info {
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 100% 88px;
    background-image: url(~@/assets/navbar_bg/bg-bto.png);
    .user-info-content {
      background-color: rgba(26, 43, 106, 0.96);
      padding: 14px 16px 22px 14px;
    }
    .avatar-border {
      border: 2px solid $color-white;
      width: 52px;
      height: 52px;
      overflow: hidden;
    }
    .name-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 52px;
      .name {
        margin-bottom: 3px;
      }
    }
    .arrow-btn {
      height: 52px;
      display: flex;
      align-items: center;
    }
  }
  .task-container {
    display: flex;
    justify-content: space-between;
    .task-type {
      width: 173.5px;
      height: 76px;
      box-shadow: 0 0 20px 0 rgba(5, 12, 27, 0.08);
    }
  }
  .title-module {
    line-height: 24px;
    padding: 8px 12px 20px 12px;
    .title {
      font-size: $font-size-l;
      font-weight: $font-weight;
    }
    .en-title {
      font-size: $font-size-en-m;
      color: $color-text-secondary;
      margin-left: 8px;
    }
    .more {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      float: right;
    }
  }
  .function-container {
    .list-container {
      justify-content: start;
      flex-wrap: wrap;
      padding-top: 5px;
      .item-wrapper {
        width: 30%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        &:nth-of-type(3n + 2) {
          margin-left: 5%;
          margin-right: 5%;
        }
        .title {
          width: 100%;
          margin-top: 8px;
        }
      }
    }
  }
  .case-container {
    .list-container {
      .list-item {
        padding: 0 8px 30px 16px;
        .image-wrapper {
          border-radius: $border-radius;
          width: 100px;
          height: 100px;
          overflow: hidden;
          background-color: $color-text-auxiliary;
        }
        .content-wrapper {
          width: 182px;
          .content {
            margin-top: 6px;
          }
          .time {
            margin-top: 10px;
            line-height: 20px;
            text-align: right;
          }
        }
      }
    }
  }
  .library-container {
    .list-container {
      .item-wrapper {
        width: 100px;
        height: 85px;
        margin: 0 0 16px 16px;
        overflow: hidden;
        &.lawsAndRegulations {
          background-image: url(~@/assets/safetyLibrary_images/lawsAndRegulations.jpg);
        }
        &.systemDocument {
          background-image: url(~@/assets/safetyLibrary_images/systemDocument.jpg);
        }
        .item {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          .title {
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
