<!-- Created by Tanking. -->
<!-- 管理制度详情 -->
<template>
  <div class="container container-supports">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="制度信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div>
            <div v-if="details.regimeName" class="label">制度名称</div>
            <div v-if="details.regimeName" class="value">{{ details.regimeName }}</div>
            <div v-if="details.regimeType" class="label">制度类别</div>
            <div v-if="details.regimeType" class="value">{{ getDictLabel(regimeTypes, details.regimeType) }}</div>
            <div v-if="details.publishTime" class="label">发布日期</div>
            <div v-if="details.publishTime" class="value">{{ formatTimeStamp(details.publishTime, 5) }}</div>
            <div v-if="details.deptName" class="label">制定部门</div>
            <div v-if="details.deptName" class="value">{{ details.deptName }}</div>
            <div v-if="details.controlObj" class="label">适用对象</div>
            <div v-if="details.controlObj" class="value">{{ joinControlObj(details.controlObj) }}</div>
            <div v-if="details.remark" class="label">备注</div>
            <div v-if="details.remark" class="value pre-wrap">{{ details.remark }}</div>
            <van-divider v-if="files.length > 0">附件</van-divider>
            <div v-if="files.length > 0" class="flie-list">
              <div
                v-for="(item, index) in files"
                :key="index"
                class="file-item flex-center-column"
                @click="$filePreviewFun(item)"
              >
                <van-icon name="bm-otherPdf" class="icon-size-60" />
                <p class="name ellipsis">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { getRegimeDetails } from '@/api/laws'
import { getDictDataOfCode, getDictLabel } from '@/utils'
import { formatTimeStamp } from '@/utils/timeFormat'

export default {
  name: 'LawsSystemDetails',
  components: {},
  data() {
    return {
      activeNames: ['1'],
      details: {},
      files: [],
      regimeTypes: [],
      controlObjs: []
    }
  },
  methods: {
    getDetails() {
      getRegimeDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          if (data.attachment) {
            this.files.push(data.attachment)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    joinControlObj(data) {
      if (data.indexOf(',') > -1) {
        const list = data.split(',')
        let res = ''
        list.forEach((item, index) => {
          if (index > 0) {
            res += ','
          }
          res += getDictLabel(this.controlObjs, item)
        })
        return res
      } else {
        return getDictLabel(this.controlObjs, data)
      }
    }
  },
  async created() {
    this.getDetails()
    this.regimeTypes = await getDictDataOfCode('laws_regime_type')
    this.controlObjs = await getDictDataOfCode('laws_regime_obj')
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    getDictLabel() {
      return getDictLabel
    },
    formatTimeStamp() {
      return formatTimeStamp
    }
  }
}
</script>
