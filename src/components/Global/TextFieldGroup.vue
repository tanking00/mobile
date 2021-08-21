<!-- Created by Tanking. -->
<!-- 文本域组 -->
<template>
  <div class="container-textFieldGroup">
    <div v-for="(item, index) in list" :key="index">
      <div class="textarea-label clearfix" :class="{ 'textarea-label-required': required }">
        <div class="left">{{ '问题' + toChinesNum(index + 1) }}</div>
        <div v-show="item.content" class="right">
          <span v-if="item.status === '0'" class="color-blue" @click="onClickHazard(index, item)">发起隐患整改</span>
          <span v-if="item.status === '1'" class="color-text-secondary">已发起</span>
        </div>
      </div>
      <div class="textarea-wrapper">
        <div v-show="list.length > 1" class="button-del" @click="onClickDel(index)">
          <van-icon name="bm-guanbi" class="icon-size-12 color-white" />
        </div>
        <van-field
          v-model="item.content"
          :name="toChinesNum(index + 1)"
          rows="4"
          type="textarea"
          maxlength="1000"
          :placeholder="placeholder"
          :rules="[{ required: required, message: errMessage + toChinesNum(index + 1) }]"
          show-word-limit
          class="form-textarea"
        />
      </div>
    </div>
    <div class="button-add-wrapper">
      <van-button plain block type="info" icon="add-o" native-type="button" @click="onClickAdd"></van-button>
    </div>
  </div>
</template>

<script>
import { toChinesNum } from '@/utils'

export default {
  name: 'TextFieldGroup',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请填写问题描述'
    },
    // 错误提示
    errMessage: {
      type: String,
      default: '请填写问题描述'
    },
    // 是否必填
    required: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    onClickAdd() {
      this.list.push({ content: '', status: '0' })
    },
    onClickDel(index) {
      if (this.list.length > 1) {
        this.list.splice(index, 1)
      }
    },
    onClickHazard(index, item) {
      this.$emit('startHazard', index, item)
    }
  },
  mounted() {
    if (this.value) {
      this.list = this.value
    }
  },
  computed: {
    toChinesNum() {
      return toChinesNum
    }
  },
  watch: {
    list: {
      handler: function(val, oldval) {
        this.$emit('input', val)
      },
      deep: true // 对象内部的属性监听，也叫深度监听
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-textFieldGroup {
  width: 100%;
  padding: 10px 0;
  .textarea-label {
    color: $color-text-primary;
    font-size: $font-size-m;
    margin: 0 24px;
    position: relative;
  }
  .textarea-label-required {
    &::before {
      position: absolute;
      left: -12px;
      color: #ed3458;
      font-size: $font-size-m;
      content: '*';
    }
  }
  .textarea-wrapper {
    position: relative;
    .button-del {
      position: absolute;
      top: 10px;
      right: 16px;
      z-index: 1;
      width: 20px;
      height: 20px;
      background-image: url(~@/assets/icon_images/delbg.png);
      background-position: center;
      background-size: 100%;
      background-repeat: no-repeat;
      opacity: 0.2;
      text-align: center;
    }
  }
  .button-add-wrapper {
    padding: 0 16px;
  }
}
</style>
