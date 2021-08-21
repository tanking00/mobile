<!-- Created by Tanking. -->
<!-- Word预览 -->
<template>
  <div class="container">
    <van-nav-bar :title="name" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-word">
      <div id="wordView" class="wordView" ref="docPreview" />
    </div>
  </div>
</template>

<script>
import mammoth from 'mammoth'
export default {
  name: 'Word',
  metaInfo: {
    meta: []
  },
  data() {
    return {
      wordURL: '',
      name: 'Word预览'
    }
  },
  methods: {
    previewFile() {
      const _this = this
      try {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', this.wordURL)
        xhr.responseType = 'arraybuffer'
        const self = this

        xhr.onload = function(e) {
          var arrayBuffer = xhr.response // arrayBuffer
          console.log(arrayBuffer)
          mammoth
            .convertToHtml({ arrayBuffer: arrayBuffer })
            .then(displayResult)
            .done()

          function displayResult(result) {
            console.log(123)
            console.log(result)
            self.$refs.docPreview.innerHTML = result.value || ''
          }
        }
        xhr.send()
      } catch (e) {
        console.log(e)
        _this.$emit('errorPreview')
      }
    }
  },
  created() {
    if (this.$route.query.name) {
      this.name = this.$route.query.name
    }
    this.wordURL = this.$route.query.url
    this.previewFile()
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container {
  width: 100%;
  .container-word {
    width: 100%;
    background: $color-white;
    padding: 16px;
    .wordView {
      width: 100%;
      overflow: hidden;
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
