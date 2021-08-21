<!-- Created by Tanking. -->
<!-- sos悬浮按钮 -->
<template>
  <div class="container-sosButton">
    <div class="button border-radius-circular flex-center-column color-white background-color-primary" @click="onClick">
      <van-icon name="bm-systemAlert" class="icon-size-24" />
      <span class="font-size-xs">sos</span>
    </div>
    <van-action-sheet v-model="show">
      <div class="content">
        <div class="item van-hairline--bottom" @click="onClickCall">
          <h3>紧急拨号</h3>
          <p>拨号安全紧急联络人</p>
          <van-icon name="bm-sysEmergencycall" class="icon-size-20 color-primary" />
        </div>
        <div class="item" @click="onClickChat">
          <h3>在线沟通</h3>
          <p>跳转企业微信发起聊天</p>
          <van-icon name="bm-systemEnterpriseWechat" class="icon-size-20 color-auxiliary" />
        </div>
        <div class="spacing"></div>
        <div class="cancle" @click="show = false">取消</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'

export default {
  name: 'SosButton',
  data() {
    return {
      show: false,
      securityNumber: process.env.VUE_APP_PHONE || '',
      openChatUser: process.env.VUE_APP_WXCODE || ''
    }
  },
  methods: {
    onClick() {
      this.show = true
    },
    onClickCall() {
      if (!this.securityNumber) {
        Toast('功能开发中。。。')
        return
      }
      Dialog.confirm({
        message: '即将拨号安全紧急联络人',
        confirmButtonText: '立即拨号'
      })
        .then(() => {
          this.show = false
          window.location.href = 'tel://' + this.securityNumber
        })
        .catch(() => {
          // on cancel
        })
    },
    onClickChat() {
      if (!this.openChatUser) {
        Toast('功能开发中。。。')
        return
      }
      Dialog.confirm({
        message: '即将跳转至企业微信',
        confirmButtonText: '立即跳转'
      })
        .then(() => {
          // on confirm
          this.show = false
          window.wx.openEnterpriseChat({
            // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
            userIds: this.openChatUser, // 参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
            externalUserIds: '', // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
            groupName: '', // 会话名称。单聊时该参数传入空字符串""即可。
            chatId: '', // 若要打开已有会话，需指定此参数。如果是新建会话，chatId必须为空串
            success: function(res) {
              console.log(res.chatId)
              // var chatId = res.chatId // 返回当前群聊ID，仅当使用agentConfig注入该接口权限时才返回chatId
              // 回调
            },
            fail: function(res) {
              if (res.errMsg.indexOf('function not exist') > -1) {
                alert('版本过低请升级')
              }
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-sosButton {
  position: fixed;
  bottom: 73px;
  right: 20px;
  z-index: 10;
  .button {
    width: 52px;
    height: 52px;
    span {
      line-height: 12px;
    }
  }
  .content {
    .item {
      padding: 8px 0;
      text-align: center;
      position: relative;
      box-shadow: inset 0 0 0 0 #edeff7;
      .h3 {
        font-size: $font-size-m;
      }
      p {
        font-size: $font-size-sm;
        color: $color-text-secondary;
      }
      .van-icon {
        position: absolute;
        left: 24px;
        top: 50%;
        margin-top: -10px;
      }
    }
  }
  .spacing {
    background: $color-bg;
    height: 10px;
  }
  .cancle {
    text-align: center;
    padding: 14px 0;
    color: $color-primary;
    font-size: $font-size-ml;
  }
}
@supports (bottom: env(safe-area-inset-bottom)) {
  .container-sosButton {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
