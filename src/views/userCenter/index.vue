<template>
  <div class="container">
    <div class="container-header" :class="{ scroll: !scroll }">
      <div class="container-header-content">
        <van-nav-bar
          :title="$route.meta.title"
          left-arrow
          @click-left="$router.go(-1)"
          :border="false"
          fixed
          placeholder
        />
        <div class="user-header center">
          <div class="avatar-border border-radius-circular">
            <van-image :src="getUserAvatar(avatar)" fit="cover" width="100%" height="100%">
              <template v-slot:error>
                <van-icon name="bm-defaultAvatar" class="icon-size-48 color-text-auxiliary" />
              </template>
            </van-image>
          </div>
          <div class="user-name">{{ name }}</div>
          <div class="user-org">{{ primaryOrg ? primaryOrg.name : '部门' }}</div>
        </div>
      </div>
    </div>

    <div v-if="certificates.length > 0" class="user-certificate margin-bottom">
      <div class="top-bg">
        <div class="top-bg-content"></div>
      </div>
      <div class="content border-radius">
        <div class="title clearfix">
          <span class="font-size-l font-weight">安全资质</span>
          <span class="font-size-en-m color-text-secondary margin-left-8">SAFETY CERTIFICATE</span>
          <router-link :to="{ path: '/userCenter/qualifications' }">
            <span class="font-size-sm color-text-secondary right">更多</span>
          </router-link>
        </div>
        <div class="list-container flex-center">
          <div v-for="(item, index) in certificates" :key="index" class="item-wrapper" @click="onClickItem(item)">
            <van-icon
              :name="item.icon"
              class="icon-size-48"
              :class="{
                'icon-size-48': true,
                'color-blue': judgeHasClass(item.color, 'blue'),
                'color-yellow': judgeHasClass(item.color, 'yellow'),
                'color-red': judgeHasClass(item.color, 'red')
              }"
            />
            <span class="name ellipsis center font-size-sm color-text-secondary">{{ item.userQmame }}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <van-cell icon="bm-systemMessage" title="消息中心" is-link to="newsCenter" value="" size="large">
        <template>
          <van-tag v-if="countUnread" round type="primary">{{ countUnread }}</van-tag>
        </template>
      </van-cell>
      <van-cell icon="bm-systemVersionabout" title="关于" :value="'Version' + version" size="large" />
      <!-- <van-cell icon="bm-systemMessage" title="调试" is-link to="test" value="" size="large" /> -->
      <van-cell
        v-if="env !== 'production'"
        icon="bm-systemTasktodo"
        title="退出登录"
        is-link
        @click="showLogout = true"
        size="large"
      />
    </div>
    <van-action-sheet
      v-model="showLogout"
      :actions="actions"
      cancel-text="取消"
      description="确定要退出登录吗？"
      close-on-click-action
      @select="logout"
    />
    <van-dialog
      v-model="showCertificate"
      :show-confirm-button="false"
      :close-on-click-overlay="true"
      class="dialog-certificate"
    >
      <div class="content">
        <div class="cancle-wrapper clearfix">
          <van-icon
            name="bm-systemClose"
            class="icon-size-16 color-text-auxiliary right"
            @click="showCertificate = false"
          />
        </div>
        <h4>资质名称</h4>
        <p>{{ qualification.userQmame }}</p>
        <h4>资质有效期</h4>
        <p>
          {{
            formatTimeStamp(qualification.userQbeginDate, 3) + '至' + formatTimeStamp(qualification.userQexpireDate, 3)
          }}
        </p>
        <h4>资质状态</h4>
        <p :class="{ overdue: qualification.expire }">{{ qualification.status }}</p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '../../../package.json'
import { judgeHasClass, getUserAvatar } from '@/utils'
import { timeStampExpire, formatTimeStamp } from '@/utils/timeFormat'
import { getMsgCountUnread } from '@/api/newsCenter'

export default {
  name: 'UserCenter',
  data() {
    return {
      showLogout: false,
      showCertificate: false,
      actions: [{ name: '退出登录', color: this.$store.getters.theme }],
      qualification: {},
      scroll: false,
      env: process.env.VUE_APP_ENV,
      countUnread: 0
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'primaryOrg', 'qualifications']),
    version() {
      return config.version
    },
    judgeHasClass() {
      return judgeHasClass
    },
    getUserAvatar() {
      return getUserAvatar
    },
    certificates() {
      if (this.qualifications) {
        const list = []
        this.qualifications.forEach((item, index) => {
          if (index < 3) {
            let icon, expire, color, status
            if (timeStampExpire(item.userQexpireDate)) {
              expire = true
              color = 'red'
              status = '已逾期'
            } else {
              expire = false
              color = 'blue'
              status = '有效'
            }
            switch (item.userQmame) {
              case '境外公共安全资质':
                icon = expire ? 'bm-functionalCertificate01delayed' : 'bm-functionalCertificate01normal'
                break
              case '员工三级安全资质':
                icon = expire ? 'bm-functionalCertificate02delayed' : 'bm-functionalCertificate02normal'
                break
              case '现场安全上岗资质':
                icon = expire ? 'bm-functionalCertificate03delayed' : 'bm-functionalCertificate03normal'
                break
              default:
                icon = expire ? 'bm-functionalCertificate01delayed' : 'bm-functionalCertificate01normal'
                break
            }
            list.push({
              icon: icon,
              expire: expire,
              color: color,
              status: status,
              userQmame: item.userQmame,
              userQbeginDate: item.userQbeginDate,
              userQexpireDate: item.userQexpireDate
            })
          }
        })
        return list
      } else {
        return []
      }
    },
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  created() {
    this.getMsgCountUnread()
    document.addEventListener('scroll', this.handleScroll, true)
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/loginPwd')
    },
    onClickItem(value) {
      this.qualification = value
      this.showCertificate = true
    },
    handleScroll(event) {
      const top = event.target.scrollTop
      if (top > 10) {
        this.scroll = true
      } else {
        this.scroll = false
      }
    },
    getMsgCountUnread() {
      getMsgCountUnread(this.$store.getters.code)
        .then(res => {
          const { data } = res
          this.countUnread = data
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
::v-deep .van-cell__left-icon {
  color: $color-text-auxiliary;
  font-size: 20px;
  margin-right: 12px;
}
.scroll ::v-deep .van-nav-bar {
  background-color: transparent;
}

.container {
  .container-header {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(~@/assets/navbar_bg/bg.png);
    .container-header-content {
      background-color: rgba(26, 43, 106, 0.96);
    }
  }

  .user-header {
    padding-top: 18px;
    height: 145px;
    .avatar-border {
      border-radius: 50%;
      border: 2px solid #fff;
      width: 52px;
      height: 52px;
      overflow: hidden;
      margin: 0 auto;
    }
    .user-name {
      font-size: $font-size-ml;
      font-weight: $font-weight;
      color: $color-white;
      margin-top: 14px;
    }
    .user-org {
      opacity: 0.6;
      font-size: $font-size-sm;
      color: $color-white;
    }
  }
  .user-certificate {
    position: relative;
    height: 140px;
    .top-bg {
      height: 60px;
      width: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url(~@/assets/navbar_bg/bg.png);
      border-bottom-left-radius: 250px 25px;
      border-bottom-right-radius: 250px 25px;
      overflow: hidden;
      .top-bg-content {
        height: 60px;
        width: 100%;
        background-color: rgba(26, 43, 106, 0.96);
      }
    }
    .content {
      box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.03);
      background-color: $color-white;
      height: 140px;
      width: 355px;
      position: absolute;
      top: 0;
      left: 10px;
      .title {
        padding: 8px 12px;
        line-height: 24px;
      }
      .list-container {
        margin-top: 12px;
        justify-content: start;
        .item-wrapper {
          width: 30%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          &:nth-of-type(3n + 2) {
            margin-left: 5%;
            margin-right: 5%;
          }
          .name {
            width: 90%;
            margin-top: 8px;
          }
        }
      }
    }
  }
  .dialog-certificate {
    width: 350px;
    top: 50%;
    .content {
      padding: 12px 12px 0 26px;
      height: calc(100vh * 0.7);
      .cancle-wrapper {
        margin-bottom: 8.4px;
      }
      h4 {
        font-size: $font-size-sm;
        color: $color-text-auxiliary;
        margin-bottom: 4.3px;
      }
      p {
        font-size: $font-size-m;
        color: $color-text-primary;
        margin-bottom: 20px;
        &.overdue {
          color: $color-red;
        }
      }
    }
  }
}
</style>
