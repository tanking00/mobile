<!-- Created by Tanking. -->
<!-- 检查表库详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="检查表信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.tableName" class="label">检查表名称</div>
            <div v-if="details.tableName" class="value">{{ details.tableName }}</div>
            <div class="label">检查标准</div>
            <div class="value items">
              <table>
                <thead>
                  <tr>
                    <td>检查标准</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.content }}</td>
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
import { getCheckLibraryDetails } from '@/api/equipment'

export default {
  name: 'EquipmentLibraryDetails',
  components: {},
  data() {
    return {
      activeNames: ['1'],
      details: {},
      items: []
    }
  },
  methods: {
    getDetails() {
      getCheckLibraryDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          this.items = data.items
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
.items {
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
      }
    }
  }
}
</style>
