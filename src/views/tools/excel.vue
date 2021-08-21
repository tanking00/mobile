<!-- Created by Tanking. -->
<!-- Excel预览 -->
<template>
  <div class="container">
    <van-nav-bar :title="name" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-excel">
      <div ref="preview"></div>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'Excel',
  data() {
    return {
      url: '',
      data: [],
      name: 'Excel预览'
    }
  },
  methods: {
    previewFile() {
      try {
        var req = new XMLHttpRequest()
        req.open('GET', this.url, true)
        req.responseType = 'arraybuffer'
        req.onload = e => {
          console.log(req.response, 'req.response')
          var binary = ''
          var bytes = new Uint8Array(req.response)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var wb = XLSX.read(binary, { type: 'binary' })
          var wsname = wb.SheetNames[0]
          var ws = wb.Sheets[wsname]
          var HTML = XLSX.utils.sheet_to_html(ws)
          if (this.$refs.preview) {
            this.$refs.preview.innerHTML = HTML
          }
        }

        req.send()
      } catch (e) {
        console.log(e)
        this.$emit('errorPreview')
      }
    }
  },
  created() {
    if (this.$route.query.name) {
      this.name = this.$route.query.name
    }
    this.url = this.$route.query.url
    this.previewFile()
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  width: 100%;
  overflow: hidden;
  .container-excel {
    width: 100%;
    overflow-y: auto;
    background: $color-white;
    padding: 16px;
  }
}
// ::v-deep table {
//   width: 100%;
//   border: 1px solid #ccc;
// }
</style>
