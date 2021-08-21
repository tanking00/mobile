<!-- Created by Tanking. -->
<!-- 调试 -->
<template>
  <div class="container">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="padding-all">
      <UploadImage
        v-model="imageList"
        :default="defaultList"
        :maxCount="6"
        :maxSize="5"
        :maxUploadSize="0.5"
        :disabled="false"
      ></UploadImage>
    </div>
    <div class="padding-all">
      <UploadFile v-model="fileList" :maxCount="6" :maxSize="5" :maxUploadSize="0.5" :disabled="false"></UploadFile>
    </div>
    <!-- <StepBars :active="0">
      <StepBar></StepBar>
    </StepBars> -->
    <!-- <video class="video-wrapper" src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" controls="controls">
      您的浏览器不支持 video 标签。
    </video> -->
    <!-- <div class="anniu"></div> -->
    <van-button type="primary" @click="onClickSubmit">提交返回</van-button>
  </div>
</template>

<script>
// import { Toast } from 'vant'
// import { StepBars, StepBar } from '@/components'

export default {
  name: 'TestDetails',
  components: {
    // StepBars,
    // StepBar
  },
  data() {
    return {
      defaultList: [],
      imageList: [],
      videoList: [],
      fileList: [],
      testFile: {
        id: 595,
        name: '[PDF-10mb]列宁全集 第60卷.pdf',
        size: 11004097,
        type: 'pdf',
        path: '/data/files/file/78bf2a1a-bf21-46fb-80a1-815ff9a6ac1a.pdf',
        url: '//demo.bowmann.cn:2020/file/78bf2a1a-bf21-46fb-80a1-815ff9a6ac1a.pdf',
        uploadTime: 1616048949104
      }
    }
    // url: '//192.168.2.232/file/78bf2a1a-bf21-46fb-80a1-815ff9a6ac1a.pdf',
  },
  methods: {
    onClickSubmit() {
      setTimeout(() => {
        this.$store.dispatch('settings/setHazardId', '123456')
        this.$router.go(-1)
      }, 500)
    }
  },
  created() {},
  mounted() {
    this.defaultList = [
      {
        id: 81,
        name: 'image123.png',
        path: '/data/files/file/a7789d78-e71e-4238-8e36-9d1b4994ff4c.png',
        size: 503997,
        type: 'png',
        uploadTime: 1612578688184,
        url: '//192.168.2.232/file/a7789d78-e71e-4238-8e36-9d1b4994ff4c.png'
      }
    ]
  },
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.video-wrapper {
  width: 100%;
  height: 200px;
  z-index: 100;
}
.anniu {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  background-color: red;
  z-index: 99999;
}
</style>
