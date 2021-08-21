<!-- Created by Tanking. -->
<!-- 隐患提报 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)">
      <template #left>
        <van-icon name="bm-guanbi" class="icon-size-20" />
      </template>
    </van-nav-bar>
    <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
      <div class="label-score padding-top">
        基础信息
      </div>
      <div class="field-wrapper">
        <van-field
          v-model="introducerName"
          name="提报人员"
          label="提报人员"
          placeholder=""
          readonly
          input-align="right"
          size="large"
        />
        <van-field
          v-model="putDeptName"
          name="部门"
          label="部门"
          placeholder=""
          readonly
          input-align="right"
          size="large"
        />
      </div>
      <div class="label-score">
        隐患提报
      </div>
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
          :is-link="source ? false : true"
          size="large"
          @click="source ? null : (showPickerSource = true)"
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
      </div>
      <div class="field-wrapper">
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
        />
      </div>
      <div class="field-wrapper">
        <div class="form-label">附件</div>
        <van-field name="images">
          <template #input>
            <UploadFile
              v-model="fileList"
              :default="defaultList"
              :maxCount="10"
              :maxSize="50"
              :accepts="['pdf', 'png', 'jpg']"
              tips="支持格式：png、jpg，pdf，50M以内"
            ></UploadFile>
          </template>
        </van-field>
      </div>
    </van-form>
    <SubmitButton>
      <SubmitButtonItem v-if="!hazardId" @click="$router.go(-1)" type="gray">取消</SubmitButtonItem>
      <SubmitButtonItem v-if="hazardId" @click="onClickDelete" type="gray">作废</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSubmit">提交</SubmitButtonItem>
    </SubmitButton>
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
import { mapGetters } from 'vuex'
import { Dialog, Toast } from 'vant'
import { getDictOfCode, getProcessCode } from '@/api/global'
import { getTypeAndLevelById, hazardCommit, getHazardById } from '@/api/hazard'
import { Interpretation, SearchProjectPanel } from './components'

export default {
  name: 'HazardAdd',
  components: { Interpretation, SearchProjectPanel },
  data() {
    return {
      // 流程编号
      processCode: '',
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
      // 提示
      showTips: false,
      // 其他模块过来的来源
      source: '',
      // 项目现场
      projectName: '',
      projectNo: '',
      showSearchProjectPanel: false
    }
  },
  methods: {
    // 点击提交按钮
    onClickSubmit() {
      this.$refs['form'].submit()
    },
    // 表单错误回调
    onFailedForm(info) {
      Toast(info.errors[0].message)
    },
    // 表单正确回调
    onSubmitForm() {
      Dialog.confirm({
        message: '确认要提交吗？'
      })
        .then(() => {
          const req = {
            classifyId: this.classifyId,
            introducerId: this.code,
            introducerName: this.name,
            levelId: this.levelId,
            narrate: this.narrate,
            putDeptId: this.putDeptId,
            source: this.sourceName,
            subclassId: this.subclassId,
            processCode: this.processCode,
            areaId: this.areaId,
            id: this.hazardId || '',
            taskId: this.taskId || '',
            files: this.fileList.join(','),
            projectName: this.projectName,
            projectNo: this.projectNo
          }
          hazardCommit(req)
            .then(res => {
              const { data } = res
              if (this.source) {
                this.$store.dispatch('settings/setHazardId', data)
              }
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    // 获取隐患流程编号
    getHiddenDangerNum() {
      getProcessCode('YHPC')
        .then(res => {
          const { data } = res
          this.processCode = data
        })
        .catch(err => {
          console.log(err)
        })
    },
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
    },
    // 选择项目现场回调
    onSelectProject(data) {
      console.log(data)
      this.projectNo = data.projectNo
      this.projectName = data.projectName
    },
    // 获取详情
    getDetails() {
      getHazardById(this.hazardId)
        .then(res => {
          const { data } = res
          const details = data.hazardDetailsBO || data
          this.classifyId = details.classifyId
          this.classifyName = details.type
          this.subclassId = details.subclassId
          this.subclassName = details.subclass
          this.levelId = details.levelId
          this.levelName = details.level
          this.sourceName = details.source
          this.areaId = details.areaId
          this.areaName = details.area
          this.narrate = details.narrate
          this.processCode = details.processCode
          this.defaultList = details.fileList
          this.projectName = details.projectName || ''
          this.projectNo = details.projectNo || ''
          this.getTypeAndLevel(details.classifyId)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 作废
    onClickDelete() {
      Dialog.confirm({
        message: '确认要作废吗？'
      })
        .then(() => {
          const req = {
            isAbolish: '1',
            classifyId: this.classifyId,
            introducerId: this.code,
            introducerName: this.name,
            levelId: this.levelId,
            narrate: this.narrate,
            putDeptId: this.putDeptId,
            source: this.sourceName,
            subclassId: this.subclassId,
            processCode: this.processCode,
            areaId: this.areaId,
            id: this.hazardId || '',
            taskId: this.taskId || '',
            files: this.fileList.join(','),
            projectName: this.projectName,
            projectNo: this.projectNo
          }
          hazardCommit(req)
            .then(res => {
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    }
  },
  created() {
    this.getHazardType()
    this.getHazardSource()
    this.getHazardArea()
    // 其他模块过来
    if (this.$route.query.source) {
      console.log(this.$route.query.source)
      this.source = this.$route.query.source
      this.sourceName = this.$route.query.source
      this.narrate = this.$route.query.content || ''
    }
    if (this.hazardId) {
      this.getDetails()
    } else {
      this.getHiddenDangerNum()
    }
  },
  computed: {
    ...mapGetters(['id', 'name', 'code', 'primaryOrg']),
    // 提出人员
    introducerName() {
      return `${this.name}(${this.code})`
    },
    // 提出部门
    putDeptId() {
      return this.primaryOrg?.id
    },
    putDeptName() {
      return this.primaryOrg?.name
    },
    hazardId() {
      return this.$route.query.hazardId
    },
    taskId() {
      return this.$route.query.taskId
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.field-wrapper {
  margin: $space-vertical 0;
  background-color: $color-white;
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
.item-content {
  padding: 12px 20px 18px 20px;
  .item-content-item {
    .item-label {
      color: $color-text-primary;
      font-size: $font-size-ml;
      position: relative;
      margin-left: 12px;
      margin-bottom: 14px;
      &::before {
        position: absolute;
        left: -12px;
        color: #ed3458;
        font-size: $font-size-m;
        content: '*';
      }
    }
    .van-radio-group {
      margin-bottom: 16px;
      .van-radio {
        margin-right: 24px;
      }
    }
    &:nth-last-of-type(1) {
      .van-radio-group {
        margin-bottom: 0;
      }
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
.label-score {
  padding-left: 16px;
  color: $color-text-primary;
  font-size: $font-size-m;
}
</style>
