<!-- Created by Tanking. -->
<!-- 文件上传 -->
<template>
  <div class="container-uploadImage" :class="{ 'small-container': isSmall }">
    <van-uploader
      v-model="list"
      :before-read="asyncBeforeRead"
      :after-read="afterRead"
      @delete="onChangeList"
      @oversize="onOversize"
      :max-count="maxCount"
      :max-size="maxSize * 1024 * 1024"
      :accept="accept"
      :deletable="!disabled"
      :show-upload="!disabled"
      :capture="capture"
      :upload-text="uploadText"
      :image-fit="imageFit"
      :upload-icon="uploadIcon"
    >
      <div v-if="list.length === 0" class="upload-big-wrapper">
        <div class="upload-btn van-hairline--surround">
          <van-icon :name="uploadIcon" class="icon-size-32 color-text-auxiliary" />
          <span v-if="uploadText">{{ uploadText }}</span>
        </div>
        <div v-if="tips" class="tips">{{ tips }}</div>
      </div>
    </van-uploader>
  </div>
</template>

<script>
import { uploadFile } from '@/api/global'
import { compressAccurately } from 'image-conversion'
import { Toast } from 'vant'
import { deepClone } from '@/utils'

export default {
  name: 'UploadFile',
  model: {
    prop: 'fileList',
    event: 'change'
  },
  props: {
    // 列表
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    // 默认展示文件
    default: {
      type: Array,
      default() {
        return []
      }
    },
    // 允许上传的文件类型数组,不传不限制,可选值['png','jpg','word','pdf','excel']
    accepts: {
      type: Array,
      default() {
        return []
      }
    },
    // 上传数量限制
    maxCount: {
      type: Number,
      default: 6
    },
    // 选取大小限制，单位为M
    maxSize: {
      type: Number,
      default: 10
    },
    // 上传图片大小限制，单位为M
    maxUploadSize: {
      type: Number,
      default: 1
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 图片选取模式，可选值为 camera (直接调起摄像头)
    capture: {
      type: String,
      default: null
    },
    // 上传区域文字提示
    uploadText: {
      type: String,
      default: '点击上传'
    },
    // 预览图裁剪模式
    imageFit: {
      type: String,
      default: 'cover'
    },
    // 上传区域图标
    uploadIcon: {
      type: String,
      default: 'photograph'
    },
    // 下面的提示文字
    tips: {
      type: String,
      default: ''
    },
    // 是否小格式
    isSmall: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    // 文件读取前的回调函数
    asyncBeforeRead(file) {
      return new Promise((resolve, reject) => {
        console.log(file)
        const type = file.type
        if (this.accepts && this.accepts.length > 0) {
          let format = ''
          switch (type) {
            case 'image/png':
              format = 'png'
              break
            case 'image/jpeg':
              format = 'jpg'
              break
            case 'application/pdf':
              format = 'pdf'
              break
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              format = 'excel'
              break
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
              format = 'word'
              break
          }
          if (this.accepts.indexOf(format) < 0) {
            Toast('请上传正确格式的文件')
            reject()
            return
          }
        }
        // 判断是否超过文件大小
        if (file.size > this.maxSize * 1024 * 1024) {
          Toast('文件大小不能超过' + this.maxSize + 'M')
          reject()
          return
        }
        // 上传图片前进行压缩
        if (type.indexOf('image/') > -1 && file.size > this.maxUploadSize * 1024 * 1024) {
          try {
            compressAccurately(file, this.maxUploadSize * 1024).then(res => {
              // 压缩后是Blob,需要转为File
              const newFile = new File([res], file.name, { type: res.type, lastModified: Date.now() })
              resolve(newFile)
            })
          } catch (err) {
            reject()
          }
        } else {
          resolve(file)
        }
      })
    },
    // 文件读取完成后的回调函数
    afterRead(file, detail) {
      file.status = 'uploading'
      file.message = '上传中...'
      this.httpUploadFile(file, detail)
    },
    // 上传
    httpUploadFile(file, detail) {
      const param = new FormData()
      param.append('file', file.file)
      uploadFile(param)
        .then(res => {
          console.log(res)
          file.status = 'done'
          file.url = res.url
          file.id = res.id
          file.message = '上传成功'
          this.onChangeList()
        })
        .catch(err => {
          console.log(err)
          file.status = 'failed'
          this.list.splice(detail.index, 1)
        })
    },
    onOversize(file) {
      // Toast('文件大小不能超过' + this.maxSize + 'M')
    },
    onChangeList() {
      const res = []
      this.list.forEach(item => {
        if (item.status !== 'failed') {
          res.push(item.id)
        }
      })
      this.$emit('change', res)
    }
  },
  created() {},
  watch: {
    default(val, old) {
      console.log('val1=', val)
      if (val !== old && this.list.length === 0) {
        console.log('val2=', val)
        const tempList = deepClone(val)
        this.list = tempList.map(item => {
          const file = { name: item.name }
          item.file = file
          return item
        })
        this.onChangeList()
      }
    }
  },
  computed: {
    accept() {
      if (this.accepts && this.accepts.length > 0) {
        let res = ''
        this.accepts.forEach(item => {
          switch (item) {
            case 'png':
              res += 'image/png,'
              break
            case 'jpg':
              res += 'image/jpeg,'
              break
            case 'pdf':
              res += 'application/pdf,'
              break
            case 'excel':
              res += 'application/vnd.ms-excel,'
              res += 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,'
              break
            case 'word':
              res += 'application/msword,'
              res += 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,'
              break
          }
        })
        return res
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-uploadImage {
  width: 100%;
}
.van-uploader {
  width: 100%;
}
.van-uploader__wrapper {
  width: 100%;
}
::v-deep .van-uploader__input-wrapper {
  width: 100%;
}
.upload-big-wrapper {
  width: 100%;
  .upload-btn {
    width: 100%;
    margin: 0 auto;
    height: 120px;
    border: 0 solid #edeff7;
    background: $color-white;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    span {
      color: $color-text-secondary;
      font-size: $font-size-sm;
      margin-top: 12px;
    }
  }
  .tips {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    margin-top: 6px;
  }
}
</style>
