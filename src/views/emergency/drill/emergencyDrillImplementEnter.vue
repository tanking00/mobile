<!-- 实施情况综述-录入 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main">
      <form ref="form1">
        <div class="background-color-white padding-all margin-bottom">
          <van-cell :border="false" required title="演练过程综述"> </van-cell>
          <van-field
            v-model="des"
            rows="3"
            autosize
            type="textarea"
            maxlength="1000"
            placeholder="请填写综述信息"
            show-word-limit
            class="form-textarea"
          />
          <van-cell :border="false" required title="演练效果评价及改进意见"> </van-cell>
          <van-field
            v-model="appraise"
            rows="3"
            autosize
            type="textarea"
            maxlength="1000"
            placeholder="请填写评价及改进意见"
            show-word-limit
            class="form-textarea"
            :border="false"
          />
          <van-cell :border="false" required title="演练评价总结报告"> </van-cell>
          <div class="padding-left padding-right padding-bottom">
            <UploadFile
              v-model="fileList"
              :maxCount="3"
              :maxSize="50"
              :disabled="false"
              :accepts="['pdf', 'word']"
              uploadText="点击上传附件"
              tips="支持格式：pdf、word，50M以内"
            ></UploadFile>
          </div>
          <van-cell :border="false" title="是否有问题">
            <template #right-icon>
              <van-switch v-model="isIssue" active-color="#00B9EF" inactive-color="#C4C1D2" />
            </template>
          </van-cell>
          <div v-if="isIssue">
            <TextFieldGroup v-model="concernsList" @startHazard="startHazard"></TextFieldGroup>
          </div>
        </div>
      </form>
    </div>
    <SubmitButton @click="onClickSubmit" position="fixed" text="提交"></SubmitButton>
  </div>
</template>

<script>
import { formatTimeStamp } from '@/utils/timeFormat'
import { Dialog, Toast } from 'vant'
import { entryImplement } from '@/api/emergency'

export default {
  name: 'EmergencyDrillImplementEnter',
  props: {},
  data() {
    return {
      des: '', // 综述
      appraise: '', // 评价
      isIssue: false, // 是否有问题
      concernsList: [{ content: '', status: '0' }], // 问题
      fileList: [],
      details: {
        remark: '',
        list: []
      },
      startHazardIndex: 0 // 发起隐患index
    }
  },
  methods: {
    onClickSubmit() {
      if (!this.des.trim()) {
        Toast('请填写演练过程综述')
        return
      }
      if (!this.appraise.trim()) {
        Toast('请填写演练效果评价及改进意见')
        return
      }
      if (this.fileList.length === 0) {
        Toast('请上传演练评价总结报告')
        return
      }
      // 判断是否需要发起隐患，是否已经发起隐患
      if (this.isIssue) {
        const isHazard = this.concernsList.every(item => {
          if (item.status === '1' && item.content.trim().length !== 0) {
            return true
          } else {
            return false
          }
        })
        if (!isHazard) {
          Toast('请发起隐患整改！')
          return
        }
      }

      Dialog.confirm({
        message: '确认提交？'
      })
        .then(() => {
          this.entryImplementReq()
        })
        .catch(() => {
          // on cancel
        })
    },
    entryImplementReq() {
      var params = {
        id: this.id,
        taskId: this.taskId,
        course: '1', // 1正常2驳回3转办
        exerciseDesc: this.des,
        exerciseAdvice: this.appraise,
        isProblem: this.isIssue ? 1 : 0,
        exerciseReport: this.fileList.join(','),
        processCode: this.processCode
      }
      if (this.isIssue) {
        var ids = []
        var desList = []
        this.concernsList.forEach(element => {
          ids.push(element.hazardId)
          desList.push(element.content)
        })
        params.troubleId = ids.join(',')
        params.problemDesc = desList.join('<!!!>')
      }
      console.log('params=', params)
      entryImplement(params)
        .then(res => {
          this.showPanel = false
          if (this.$store.getters.cachedView === 'EmergencyDrillImplementEnter') {
            this.$store.dispatch('settings/setCachedView', 'Null')
          }
          this.$router.go(-2)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 发起隐患
    startHazard(index, item) {
      this.startHazardIndex = index
      this.$store.dispatch('settings/setCachedView', 'EmergencyDrillImplementEnter')
      this.$router.push({
        path: '/hazard/add',
        query: {
          source: this.exercisePlan || '应急演练计划',
          content: item.content || ''
        }
      })
    }
  },
  activated() {
    const hazardId = this.$store.getters.hazardId
    if (hazardId) {
      this.concernsList[this.startHazardIndex].status = '1'
      this.concernsList[this.startHazardIndex].hazardId = hazardId
      this.$store.dispatch('settings/setHazardId', '')
    }
  },
  created() {},
  computed: {
    id() {
      return this.$route.query.id
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    taskId() {
      return this.$route.query.taskId
    },
    processCode() {
      return this.$route.query.processCode
    },
    exercisePlan() {
      return this.$route.query.exercisePlan
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
