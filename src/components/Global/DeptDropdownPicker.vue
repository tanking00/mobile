<!-- Created by Tanking. -->
<!-- 部门下拉选择 -->
<template>
  <van-dropdown-item ref="deptDropdown" :title="title">
    <van-picker show-toolbar :columns="columns" cancel-button-text="重置" @confirm="onConfirm" @cancel="onCancel" />
  </van-dropdown-item>
</template>

<script>
import { getAllOrg } from '@/api/global'
import { formatTree } from '@/utils'

export default {
  name: 'DeptDropdownPicker',
  components: {},
  props: {
    title: {
      type: String,
      default: '责任部门'
    }
  },
  data() {
    return {
      columns: []
    }
  },
  methods: {
    // 确定回调
    onConfirm(values, indexs) {
      this.$refs['deptDropdown'].toggle()
      let res
      indexs.forEach((item, index) => {
        if (index === 0) {
          res = this.columns[item]
        } else {
          res = res.children[item]
        }
      })
      this.$emit('change', res)
    },
    // 取消回调
    onCancel() {
      this.$refs['deptDropdown'].toggle()
      this.$emit('change', '')
    },
    getAllOrg() {
      getAllOrg()
        .then(res => {
          const { data } = res
          console.log(data)
          this.columns = formatTree(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getAllOrg()
  }
}
</script>
