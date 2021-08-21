<!-- Created by Tanking. -->
<!-- PDF预览 -->
<template>
  <div class="container">
    <van-nav-bar :title="name" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-pdf">
      <pdf v-for="i in numPages" :key="i" :src="url" :page="i"></pdf>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  name: 'PDF',
  components: { pdf },
  data() {
    return {
      url: '',
      numPages: undefined,
      name: 'PDF预览' // 文件名称
    }
  },
  methods: {},
  created() {
    this.url = this.$route.query.url
    if (this.$route.query.name) {
      this.name = this.$route.query.name
    }
  },
  mounted() {
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    this.url = pdf.createLoadingTask(this.url)
    this.url.promise.then(pdf => {
      this.numPages = pdf.numPages
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  width: 100%;
  .container-pdf {
    width: 100%;
    overflow: hidden;
  }
}
</style>
