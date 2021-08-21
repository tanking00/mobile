<!-- Created by Tanking. -->
<!-- 隐患提报信息 -->
<template>
  <div>
    <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
      <div class="field-wrapper">
        <van-field
          v-model="classifyName"
          name="隐患分类"
          label="隐患分类"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="true"
          size="large"
          @click="showPickerClassify = true"
          :rules="[{ required: true, message: '请选择隐患分类' }]"
        />
        <van-field
          v-model="subclassName"
          name="隐患细类"
          label="隐患细类"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="true"
          size="large"
          @click="onClickShowPickerSubclass"
          :rules="[{ required: true, message: '请选择隐患细类' }]"
        />
        <van-field
          v-model="levelName"
          name="隐患等级"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="true"
          size="large"
          @click="onClickShowPickerLevel"
          :rules="[{ required: true, message: '请选择隐患等级' }]"
        >
          <template #label>
            隐患等级
            <van-icon
              name="bm-systemVersionabout"
              class="icon-size-14 color-text-secondary"
              @click.stop="showTips = true"
            />
          </template>
        </van-field>
        <van-field
          v-model="sourceName"
          name="隐患来源"
          label="隐患来源"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="true"
          size="large"
          @click="showPickerSource = true"
          :rules="[{ required: true, message: '请选择隐患来源' }]"
        />
        <van-field
          v-model="areaName"
          name="隐患区域"
          label="隐患区域"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="true"
          size="large"
          @click="showPickerArea = true"
          :rules="[{ required: true, message: '请选择隐患区域' }]"
        />
        <van-field
          v-if="areaName === '项目现场'"
          v-model="projectName"
          name="项目现场"
          label="项目现场"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showSearchProjectPanel = true"
          :rules="[{ required: true, message: '请选择项目现场' }]"
        />
        <div class="form-label-required">隐患描述</div>
        <van-field
          v-model="narrate"
          name="隐患描述"
          rows="3"
          type="textarea"
          maxlength="1000"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写隐患描述' }]"
          show-word-limit
          @input="onChange"
        />
        <div class="form-label">附件</div>
        <van-field name="images">
          <template #input>
            <UploadFile
              v-model="fileList"
              :default="defaultList"
              :maxCount="10"
              :maxSize="50"
              :isSmall="true"
              :accepts="['pdf', 'png', 'jpg']"
              tips="支持格式：png、jpg，pdf，50M以内"
            ></UploadFile>
          </template>
        </van-field>
      </div>
    </van-form>
    <!-- 释义 -->
    <Interpretation v-model="showTips" @change="showTips = false"></Interpretation>
    <!-- 隐患分类 -->
    <van-popup v-model="showPickerClassify" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columnsClassify"
        @cancel="showPickerClassify = false"
        @confirm="onConfirmClassify"
      />
    </van-popup>
    <!-- 隐患细类 -->
    <van-popup v-model="showPickerSubclass" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columnsSubclass"
        @cancel="showPickerSubclass = false"
        @confirm="onConfirmSubclass"
      />
    </van-popup>
    <!-- 隐患等级 -->
    <van-popup v-model="showPickerLevel" round position="bottom">
      <van-picker show-toolbar :columns="columnsLevel" @cancel="showPickerLevel = false" @confirm="onConfirmLevel" />
    </van-popup>
    <!-- 隐患来源 -->
    <van-popup v-model="showPickerSource" round position="bottom">
      <van-picker show-toolbar :columns="columnsSource" @cancel="showPickerSource = false" @confirm="onConfirmSource" />
    </van-popup>
    <!-- 隐患区域 -->
    <van-popup v-model="showPickerArea" round position="bottom">
      <van-picker show-toolbar :columns="columnsArea" @cancel="showPickerArea = false" @confirm="onConfirmArea" />
    </van-popup>
    <!-- 项目现场 -->
    <SearchProjectPanel v-model="showSearchProjectPanel" @select="onSelectProject"></SearchProjectPanel>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import Interpretation from './interpretation'
import SearchProjectPanel from './searchProjectPanel'
import { Toast } from 'vant'
import { getDictOfCode } from '@/api/global'
import { getTypeAndLevelById } from '@/api/hazard'

export default {
  name: 'ReportInfoEdit',
  components: { Interpretation, SearchProjectPanel },
  model: {
    prop: 'hazardCommit',
    event: 'change'
  },
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    },
    hazardCommit: {
      type: Object,
      default() {
        return {}
      }
    },
    isMajor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 隐患分类
      classifyId: '',
      classifyName: '',
      columnsClassify: [],
      showPickerClassify: false,
      // 隐患细类
      subclassId: '',
      subclassName: '',
      columnsSubclass: [],
      showPickerSubclass: false,
      // 隐患等级
      levelId: '',
      levelName: '',
      columnsLevel: [],
      showPickerLevel: false,
      // 隐患来源
      sourceName: '',
      columnsSource: [],
      showPickerSource: false,
      // 隐患区域
      areaId: '',
      areaName: '',
      columnsArea: [],
      showPickerArea: false,
      // 隐患描述
      narrate: '',
      // 附件
      fileList: [],
      // 默认附件
      defaultList: [],
      tempIsMajor: '',
      showTips: false,
      // 项目现场
      projectName: '',
      projectNo: '',
      showSearchProjectPanel: false
    }
  },
  methods: {
    // 获取隐患分类
    getHazardType() {
      getDictOfCode('hazard_type')
        .then(res => {
          const { data } = res
          this.columnsClassify = []
          data.forEach(item => {
            this.columnsClassify.push({ text: item.label, value: item.value })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择隐患分类回调
    onConfirmClassify(data) {
      console.log(data)
      this.showPickerClassify = false
      this.classifyId = data.value
      this.classifyName = data.text

      this.subclassId = ''
      this.subclassName = ''
      this.levelId = ''
      this.levelName = ''

      this.getTypeAndLevel(data.value)
      this.onChange()
    },
    // 获取隐患细类和隐患等级
    getTypeAndLevel(id) {
      getTypeAndLevelById(id)
        .then(res => {
          const { data } = res
          console.log(data)
          this.columnsSubclass = []
          this.columnsLevel = []
          data.forEach(item => {
            if (item.type === '1') {
              this.columnsSubclass.push({ text: item.name, value: item.id, isMajor: item.isMajor })
            }
            if (item.type === '2') {
              this.columnsLevel.push({ text: item.name, value: item.id, isMajor: item.isMajor })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击隐患细类
    onClickShowPickerSubclass() {
      if (this.columnsSubclass.length > 0) {
        this.showPickerSubclass = true
      } else {
        Toast('请选择隐患分类！')
      }
    },
    // 选择隐患细类回调
    onConfirmSubclass(data) {
      this.showPickerSubclass = false
      this.subclassId = data.value
      this.subclassName = data.text
      this.onChange()
    },
    // 点击隐患等级
    onClickShowPickerLevel() {
      if (this.columnsLevel.length > 0) {
        this.showPickerLevel = true
      } else {
        Toast('请选择隐患分类！')
      }
    },
    // 选择隐患等级回调
    onConfirmLevel(data) {
      this.showPickerLevel = false
      this.levelId = data.value
      this.levelName = data.text
      this.tempIsMajor = data.isMajor
      this.onChange()
    },
    // 获取隐患来源
    getHazardSource() {
      getDictOfCode('hazard_Sources')
        .then(res => {
          const { data } = res
          this.columnsSource = []
          data.forEach(item => {
            this.columnsSource.push({ text: item.label, value: item.value })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择隐患来源回调
    onConfirmSource(data) {
      console.log(data)
      this.showPickerSource = false
      this.sourceName = data.text
      this.onChange()
    },
    // 获取隐患区域
    getHazardArea() {
      getDictOfCode('security_check_area')
        .then(res => {
          const { data } = res
          this.columnsArea = []
          data.forEach(item => {
            this.columnsArea.push({ text: item.label, value: item.value })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择隐患区域回调
    onConfirmArea(data) {
      console.log(data)
      this.showPickerArea = false
      this.areaId = data.value
      this.areaName = data.text
      if (data.text !== '项目现场') {
        this.projectNo = ''
        this.projectName = ''
      }
      this.onChange()
    },
    // 选择项目现场回调
    onSelectProject(data) {
      console.log(data)
      this.projectNo = data.projectNo
      this.projectName = data.projectName
      this.onChange()
    },
    // 表单错误回调
    onFailedForm(info) {
      Toast(info.errors[0].message)
      const res = {
        classifyId: this.classifyId,
        levelId: this.levelId,
        narrate: this.narrate,
        source: this.source,
        subclassId: this.subclassId,
        files: this.fileList.join(','),
        isMajor: this.tempIsMajor,
        projectName: this.projectName,
        projectNo: this.projectNo
      }
      this.$emit('change', res, false)
    },
    // 表单正确回调
    onSubmitForm() {
      console.log(123123)
      const res = {
        classifyId: this.classifyId,
        levelId: this.levelId,
        narrate: this.narrate,
        source: this.source,
        subclassId: this.subclassId,
        files: this.fileList.join(','),
        isMajor: this.tempIsMajor,
        projectName: this.projectName,
        projectNo: this.projectNo
      }
      this.$emit('change', res, true)
    },
    onChange() {
      this.$refs['form'].submit()
    }
  },
  created() {
    this.getHazardType()
    this.getHazardSource()
    this.getHazardArea()
  },
  mounted() {
    this.tempIsMajor = this.isMajor
  },
  computed: {
    formatTimeStamp() {
      return formatTimeStamp
    }
  },
  watch: {
    details(val, old) {
      if (val && val !== {} && val !== old) {
        this.classifyId = val.classifyId
        this.classifyName = val.type
        this.subclassId = val.subclassId
        this.subclassName = val.subclass
        this.levelId = val.levelId
        this.levelName = val.level
        this.sourceName = val.source
        this.areaId = val.areaId
        this.areaName = val.area
        this.narrate = val.narrate
        this.processCode = val.processCode
        this.projectName = val.projectName
        this.projectNo = val.projectNo
        this.defaultList = val.fileList
        this.getTypeAndLevel(val.classifyId)
      }
    },
    fileList(val, old) {
      console.log(val)
      console.log(old)
      this.onChange()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.field-wrapper {
  margin: $space-vertical 0;
  // background-color: $color-white;
  .field-label {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 12px;
  }
  .field-label-required {
    color: $color-text-primary;
    font-size: $font-size-m;
    padding-top: 12px;
    margin: 0 24px;
    position: relative;
    &::before {
      position: absolute;
      left: -12px;
      color: #ed3458;
      font-size: $font-size-m;
      content: '*';
    }
  }
}
.form-label-required {
  margin-top: 0;
  padding-top: 10px;
}
.form-label {
  margin-top: 0;
  padding-top: 10px;
}
.field-wrapper {
  &.not-margin-top {
    margin-top: 0;
  }
  &.not-margin-bottom {
    margin-bottom: 0;
  }
}
</style>
