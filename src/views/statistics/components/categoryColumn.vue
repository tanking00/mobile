<!-- Created by Tanking. -->
<!--  -->
<template>
  <div class="container-categoryColumn">
    <ul class="category-wrapper background-color-white">
      <li
        v-for="item in categorys"
        :key="item.category"
        class="category-item"
        :class="{ active: categoryActive == item.category }"
        @click="onClickCategory(item)"
      >
        <div>{{ item.title }}</div>
        <div class="line-wrapper" v-show="categoryActive === item.category">
          <span class="line"></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CategoryColumn',
  components: {},
  props: {
    categoryActive: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      categorys: [
        {
          title: '安全奖惩',
          category: '1'
        },
        {
          title: '安全检查',
          category: '2'
        },
        {
          title: '应急管理',
          category: '3'
        },
        {
          title: '设施设备管理',
          category: '4'
        },
        {
          title: '责任制签署考核',
          category: '5'
        },
        {
          title: '隐患排查治理',
          category: '6'
        },
        {
          title: '风险分级管控',
          category: '7'
        }
      ]
    }
  },
  methods: {
    onClickCategory(data) {
      if (data.category !== this.categoryActive) {
        this.$emit('onTap', data.category)
      }
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-categoryColumn {
  width: 100%;
  height: 50px;
  position: fixed;
  left: 0;
  top: $navbar-height;
  z-index: 1;
  .category-wrapper {
    width: 100%;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .category-item {
      display: inline-block;
      font-size: $font-size-sm;
      height: 50px;
      padding: 0 16px;
      line-height: 50px;
      min-width: 66px;
      text-align: center;
      .line-wrapper {
        width: 100%;
        position: relative;
        top: -2px;
        .line {
          display: block;
          margin: 0 auto;
          width: 44px;
          height: 2px;
          background: $color-secondary;
          border-radius: 1px;
        }
      }
      &.active {
        .line-wrapper {
          .line {
            width: 100%;
            background: $color-primary;
          }
        }
      }
    }
  }
}
</style>
