<!-- Created by Tanking. -->
<!-- 点位检查清单 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="true">
      <van-collapse v-model="activeNames" class="form-collapse-2">
        <van-collapse-item :title="details.tableName" name="1">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="item-content">
            <div v-for="(item, index) in items" :key="item.id" class="item-content-item">
              <div class="item-label">{{ item.content }}</div>
              <van-field :name="'radio' + index" label="" :rules="[{ required: true, message: '请完成此必填项' }]">
                <template #input>
                  <van-radio-group v-model="item.result" direction="horizontal">
                    <van-radio name="0">
                      是
                      <template #icon="props">
                        <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                      </template>
                    </van-radio>
                    <van-radio name="1">
                      否
                      <template #icon="props">
                        <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                      </template>
                    </van-radio>
                  </van-radio-group>
                </template>
              </van-field>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <div class="field-wrapper">
        <div class="field-label-required">图片上传</div>
        <van-field name="images" :rules="[{ required: true, message: '请上传图片' }]">
          <template #input>
            <UploadImage
              v-model="imageList"
              :maxCount="3"
              accept="image/png,image/jpeg"
              tips="说明：支持png、jpg格式，10M以内，最多上传3张"
            ></UploadImage>
          </template>
        </van-field>
      </div>
      <div class="field-wrapper">
        <div class="field-label">备注</div>
        <van-field v-model="remark" rows="2" type="textarea" maxlength="50" placeholder="请输入" show-word-limit />
      </div>
    </van-form>
    <SubmitButton @click="onClickSubmit" text="提交"></SubmitButton>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getCheckLibraryDetails, addPointCheck } from '@/api/equipment'

export default {
  name: 'EquipmentCheckCheckList',
  components: {},
  props: {},
  data() {
    return {
      details: {},
      activeNames: ['1'],
      items: [],
      activeIcon: require('@/assets/icon_images/pitchon.png'),
      inactiveIcon: require('@/assets/icon_images/unselected.png'),
      remark: '', // 备注
      imageList: [], // 图片ID
      isRisk: '0', // 是否隐患
      hazardId: ''
    }
  },
  methods: {
    getDetails() {
      getCheckLibraryDetails(this.inspectId)
        .then(res => {
          const { data } = res
          this.details = data
          this.items = data.items
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击提交按钮
    onClickSubmit() {
      this.$refs['form'].submit()
    },
    // 表单错误回调
    onFailedForm(info) {
      console.log(info)
      if (info.errors[0].message === '请完成此必填项') {
        Toast('请完成必填项')
      } else {
        Toast(info.errors[0].message)
      }
    },
    // 表单正确回调
    onSubmitForm() {
      // 如果上报了隐患，直接提交
      if (this.hazardId) {
        this.isRisk = '1'
        this.onSubmitResult()
      } else {
        Dialog.confirm({
          message: '是否涉及隐患？',
          confirmButtonText: '提报隐患',
          cancelButtonText: '未发现隐患'
        })
          .then(() => {
            this.isRisk = '1'
            this.startHazard()
          })
          .catch(() => {
            this.isRisk = '0'
            this.hazardId = ''
            this.onSubmitResult()
          })
      }
    },
    // 提报
    onSubmitResult() {
      Dialog.confirm({
        message: '确认要提交检查结果？'
      })
        .then(() => {
          const items = []
          this.items.forEach(item => {
            items.push({
              content: item.content,
              result: item.result
            })
          })
          const req = {
            correlationId: this.id,
            fileIds: this.imageList.join(','),
            isRisk: this.isRisk,
            remark: this.remark,
            tableName: this.details.tableName,
            items: items,
            hazardId: this.hazardId || null
          }
          addPointCheck(req)
            .then(res => {
              if (this.$store.getters.cachedView === 'EquipmentCheckCheckList') {
                this.$store.dispatch('settings/setCachedView', 'Null')
              }
              this.$router.go(-2)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    // 发起隐患
    startHazard() {
      this.$store.dispatch('settings/setCachedView', 'EquipmentCheckCheckList')
      this.$router.push({
        path: '/hazard/add',
        query: {
          source: this.facility
        }
      })
    }
  },
  activated() {
    const hazardId = this.$store.getters.hazardId
    if (hazardId) {
      this.hazardId = hazardId
      this.$store.dispatch('settings/setHazardId', '')
    }
  },
  created() {
    this.getDetails()
  },
  mounted() {},
  computed: {
    id() {
      return this.$route.query.id
    },
    inspectId() {
      return this.$route.query.inspectId
    },
    facility() {
      return this.$route.query.facility
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.field-wrapper {
  margin-bottom: $space-vertical;
  background-color: $color-white;
  .field-label {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 12px;
  }
  .field-label-required {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 24px;
    position: relative;
    &::before {
      position: absolute;
      left: -12px;
      color: #ed3458;
      font-size: $font-size-m;
      content: '*';
    }
  }
}
.item-content {
  padding: 12px 20px 18px 20px;
  .item-content-item {
    .item-label {
      color: $color-text-primary;
      font-size: $font-size-ml;
      position: relative;
      margin-left: 12px;
      margin-bottom: 14px;
      &::before {
        position: absolute;
        left: -12px;
        color: #ed3458;
        font-size: $font-size-m;
        content: '*';
      }
    }
    .van-radio-group {
      margin-bottom: 16px;
      .van-radio {
        margin-right: 24px;
      }
    }
    &:nth-last-of-type(1) {
      .van-radio-group {
        margin-bottom: 0;
      }
    }
  }
}
</style>
