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
      <UploadFile
        v-model="fileList"
        :default="defaultList"
        :maxCount="6"
        :maxSize="5"
        :maxUploadSize="1"
        :disabled="false"
      ></UploadFile>
    </div>
    <!-- <StepBars :active="0">
      <StepBar></StepBar>
    </StepBars> -->
    <!-- <video class="video-wrapper" src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" controls="controls">
      您的浏览器不支持 video 标签。
    </video> -->
    <!-- <div class="anniu"></div> -->
    <van-button type="primary" @click="$filePreviewFun(testFile2)">预览文件</van-button>
    <van-button type="primary" @click="onClickSubmit">发起隐患</van-button>
    <div>
      <div v-for="(item, index) in hazardIds" :key="index">
        {{ item }}
      </div>
    </div>
    <van-button type="primary" @click="onClickClose">关闭窗口</van-button>
    <van-button type="primary" @click="show = true">选择人员</van-button>
    <van-button type="primary" @click="onDelUser">删除人员</van-button>

    <PeoplesSearchPanel ref="peoplesSearchPanel" v-model="show" @select="onSelect"></PeoplesSearchPanel>
  </div>
</template>

<script>
// import { Toast } from 'vant'
// import { StepBars, StepBar } from '@/components'

export default {
  name: 'Test',
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
        id: 967,
        name: '123123.doc',
        size: 10240,
        type: 'doc',
        path: '/data/files/file/b0b642f6-7632-4628-81f9-fb65561ec1ab.doc',
        url: '//demo.bowmann.cn:2020/file/b0b642f6-7632-4628-81f9-fb65561ec1ab.doc',
        uploadTime: 1616048949104
      },
      testFile2: {
        id: 1017,
        name: 'testpdf.pdf',
        size: 125934,
        type: 'pdf',
        path: '/data/files/file/5d8c0f67-17a6-41af-ade6-e7548068052f.pdf',
        url: '//demo.bowmann.cn:2020/file/5d8c0f67-17a6-41af-ade6-e7548068052f.pdf',
        uploadTime: 1617934999381
      },
      hazardIds: [],
      show: false
    }
    // url: '//demo.bowmann.cn:2020/file/78bf2a1a-bf21-46fb-80a1-815ff9a6ac1a.pdf',
    // url: 'http://demo.bowmann.cn:2020/file/b0b642f6-7632-4628-81f9-fb65561ec1ab.doc',
  },
  methods: {
    onClickSubmit() {
      this.$store.dispatch('settings/setCachedView', 'Test')
      this.$router.push({
        path: '/testDetails'
      })
    },
    onClickClose() {
      console.log(123)
      window.wx.closeWindow()
    },
    onSelect(data) {
      console.log(data)
    },
    onDelUser() {
      this.$refs.peoplesSearchPanel.parentDelUser({ id: '20262' })
    }
  },
  created() {
    // const url = '//192.168.2.232/file/a7789d78-e71e-4238-8e36-9d1b4994ff4c.png'
    // const newUrl = 'http://' + url.split('//')[1].replace(/[\\]/g, '/')
    // console.log(url)
    // console.log(newUrl)
  },
  mounted() {
    // this.defaultList = [
    //   {
    //     id: 81,
    //     name: 'image123.png',
    //     path: '/data/files/file/a7789d78-e71e-4238-8e36-9d1b4994ff4c.png',
    //     size: 503997,
    //     type: 'png',
    //     uploadTime: 1612578688184,
    //     url: '//192.168.2.232/file/a7789d78-e71e-4238-8e36-9d1b4994ff4c.png'
    //   }
    // ]

    this.defaultList = [
      {
        id: 595,
        name: '[PDF-10mb]列宁全集 第60卷.pdf',
        size: 11004097,
        type: 'pdf',
        path: '/data/files/file/78bf2a1a-bf21-46fb-80a1-815ff9a6ac1a.pdf',
        url: '//demo.bowmann.cn:2020/file/78bf2a1a-bf21-46fb-80a1-815ff9a6ac1a.pdf',
        uploadTime: 1616048949104
      }
    ]
  },
  activated() {
    console.log('进来了')
    console.log(this.$store.getters.hazardId)
    if (this.$store.getters.hazardId) {
      this.hazardIds.push(this.$store.getters.hazardId)
      this.$store.dispatch('settings/setHazardId', '')
    }
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
