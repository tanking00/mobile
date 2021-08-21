<!-- 奖励提报-录入 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
      <div class="field-wrapper">
        <van-cell title="提报人员" value="内容">
          <template #default>
            <div class="color-text-primary">{{ form.user.name }}</div>
          </template>
        </van-cell>
        <van-cell title="提报部门" value="内容">
          <template #default>
            <div class="color-text-primary">{{ form.user.primaryOrg.name }}</div>
          </template>
        </van-cell>
      </div>
      <div class="field-wrapper">
        <van-field
          v-model="form.type.text"
          name="业务分类"
          label="业务分类"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showTypes = true"
          :rules="[{ required: true, message: '请选择业务分类' }]"
        />
        <van-field
          v-model="form.award.text"
          name="奖项名称"
          label="奖项名称"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showAward = true"
          :rules="[{ required: true, message: '请选择奖项名称' }]"
        />
        <van-cell required title="奖励对象"></van-cell>
        <van-cell>
          <van-radio-group @change="gourpChange" v-model="form.isGourp" direction="horizontal">
            <van-radio name="1">
              个人
              <template #icon="props">
                <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
            </van-radio>
            <van-radio name="2">
              团体
              <template #icon="props">
                <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
            </van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell value="请选择奖励对象" is-link @click="showPeopleSearchPanel = true">
          <template #title>
            <van-tag
              class="background-color-bg color-text-secondary margin-right margin-bottom"
              v-for="(item, index) in form.users"
              :key="index"
              closeable
              size="large"
              round
              @close="deleteUser(item, index)"
            >
              {{ item.name }}
            </van-tag>
          </template>
        </van-cell>
      </div>
      <div class="field-wrapper">
        <van-cell required title="事迹标题" :border="false"></van-cell>
        <van-field
          v-model="form.deedsTitle"
          rows="4"
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          :rules="[{ required: true, message: '请输入事迹标题' }]"
          show-word-limit
          class="form-textarea"
          :border="false"
        />
      </div>
      <div class="field-wrapper">
        <van-cell required title="事迹详述" :border="false"></van-cell>
        <van-field
          v-model="form.deedsDetailed"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请输入"
          :rules="[{ required: true, message: '请输入事迹详述' }]"
          show-word-limit
          class="form-textarea"
          :border="false"
        />
      </div>
      <div class="field-wrapper">
        <van-cell title="附件" :border="false"></van-cell>
        <div class="padding-left padding-right padding-bottom">
          <UploadFile
            v-model="form.fileList"
            :default="form.defaultList"
            :maxCount="1"
            :maxSize="50"
            :disabled="false"
            :accepts="['pdf', 'word', 'png', 'jpg']"
            tips="支持图片、pdf，word格式，50M以内"
          ></UploadFile>
        </div>
      </div>
    </van-form>
    <SubmitButton>
      <SubmitButtonItem @click="$router.go(-1)" type="gray">取消</SubmitButtonItem>
      <SubmitButtonItem v-if="$route.query.taskId && id" @click="invalidClik" type="danger">作废</SubmitButtonItem>
      <SubmitButtonItem @click="onClickSubmit">提交</SubmitButtonItem>
    </SubmitButton>
    <van-popup v-model="showTypes" round position="bottom">
      <van-picker show-toolbar :columns="typeLabels" @cancel="showCheckArea = false" @confirm="onSelectType" />
    </van-popup>
    <van-popup v-model="showAward" round position="bottom">
      <van-picker show-toolbar :columns="awardLabels" @cancel="showCheckArea = false" @confirm="onSelectaward" />
    </van-popup>
    <PeopleSearchPanel v-model="showPeopleSearchPanel" @select="onSelectPeople"></PeopleSearchPanel>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getDropdownDataOfCode, getDictLabelOfCode } from '@/utils'
import {
  getRewardStandardList,
  addSubmission,
  getSubmissionDetails,
  addResubmit,
  destroySubmission
} from '@/api/safetyReward'
import { getProcessCode } from '@/api/global'
export default {
  name: 'RewardSubmitAdd',
  props: {},
  data() {
    return {
      form: {
        user: {
          id: this.$store.getters.id,
          name: this.$store.getters.name + '(' + this.$store.getters.code + ')',
          primaryOrg: this.$store.getters.primaryOrg,
          code: this.$store.getters.code
        },
        isGourp: '1',
        deedsTitle: '', // 事迹标题
        deedsDetailed: '', // 事迹详述
        fileList: [],
        defaultList: [],
        type: {
          text: '',
          value: ''
        },
        award: {
          text: '',
          value: ''
        }, // 奖项
        users: []
      },
      showTypes: false,
      typeLabels: [],
      types: [],
      showAward: false,
      awardLabels: [],
      awardList: [], // 奖项list
      activeIcon: require('@/assets/icon_images/pitchon.png'),
      inactiveIcon: require('@/assets/icon_images/unselected.png'),
      showPeopleSearchPanel: false,
      processNumber: ''
    }
  },
  methods: {
    onSelectType(value, index) {
      this.showTypes = false
      const item = this.types[index]
      this.form.type = item
    },
    gourpChange(val) {
      // 个人
      if (this.form.isGourp === '1') {
        // 人数大于1则操作有意义
        if (this.form.users.length > 1) {
          this.form.users = []
        }
      }
    },
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
      if (this.form.users.length === 0) {
        Toast('请选择奖励对象')
        return
      }
      Dialog.confirm({
        message: '确认要提交吗？'
      })
        .then(() => {
          this.submitCheck()
        })
        .catch(() => {
          // on cancel
        })
    },
    // 作废
    invalidClik() {
      Dialog.confirm({
        message: '确认要作废吗？'
      })
        .then(async () => {
          var params = {
            id: this.id,
            taskId: this.$route.query.taskId
          }
          await destroySubmission(params)
          Toast('提交成功')
          this.$router.go(-1)
        })
        .catch(() => {
          // on cancel
        })
    },
    // 正常提交
    async submitCheck() {
      if (this.processNumber === null) {
        this.getProcessCode()
        Toast('processNumber为空，请重试')
        return
      }
      var user = this.form.users.map(item => {
        return {
          userId: item.id,
          userName: item.name,
          userDeptId: item.orgId,
          userDeptName: item.orgName
        }
      })

      var params = {
        awardObject: this.form.isGourp === '1' ? '个人' : '团体',
        category: this.form.type.value,
        detail: this.form.deedsDetailed,
        processCode: this.processNumber,
        submitDeptId: this.form.user.primaryOrg.id,
        submitDeptName: this.form.user.primaryOrg.name,
        submitterId: this.form.user.id,
        submitterName: this.form.user.name,
        title: this.form.deedsTitle,
        awardsId: this.form.award.value,
        awardsName: this.form.award.text,
        users: user
      }
      // 如果有，则赋值
      params.taskId = this.$route.query.taskId
      if (this.form.fileList.length !== 0) {
        params.attachment = this.form.fileList[0]
      }
      // 只有任务id和提报id同时存在，才是退回-重新提交，其它则是新增提交
      if (this.$route.query.taskId && this.id) {
        this.submitForTask(params)
        return
      }
      await addSubmission(params)
      Toast('提报成功')
      this.$router.go(-1)
    },
    async submitForTask(params) {
      params.id = this.id
      await addResubmit(params)
      Toast('提报成功')
      this.$router.go(-1)
    },
    // 删除人员回调
    deleteUser(item, index) {
      this.form.users.splice(index, 1)
    },
    // 人员选择回调
    onSelectPeople(val) {
      if (this.form.isGourp === '1') {
        this.form.awardUser = val.name
        this.form.users = [val]
      } else {
        var everyResult = this.form.users.some(function(item, index, array) {
          return item.id === val.id
        })
        if (everyResult) {
          // 已经选过
        } else {
          // 未选
          this.form.users.push(val)
          var nameList = this.form.users.map(item => {
            return item.name
          })
          this.form.awardUser = nameList.join('、')
        }
      }
    },
    // 选择奖项
    onSelectaward(value, index) {
      this.showAward = false
      const item = this.awardList[index]
      this.form.award = {
        text: item.name,
        value: item.id
      }
    },
    getProcessCode() {
      getProcessCode('JLTB')
        .then(res => {
          const { data } = res
          this.processNumber = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDetails() {
      if (!this.id) {
        console.log('无奖励提报id==add')
        return
      }
      getSubmissionDetails(this.id)
        .then(async res => {
          const { data } = res
          this.form.type.text = await getDictLabelOfCode('security_submission_category', data.category)
          this.form.type.value = data.category
          this.form.deedsTitle = data.title
          this.form.deedsDetailed = data.detail
          this.form.isGourp = data.awardObject === '个人' ? '1' : '2'
          this.form.award.text = data.awardsName
          this.form.award.value = data.awardsId
          this.form.users = data.users.map(item => {
            return {
              id: item.userId,
              name: item.userName,
              orgId: item.userDeptId,
              orgName: item.userDeptName
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created() {
    if (this.$route.query.taskId) {
      this.processNumber = this.$route.query.processCode
      this.getDetails()
    } else {
      this.getProcessCode()
    }
    this.types = await getDropdownDataOfCode('security_submission_category', false)
    this.typeLabels = this.types.map((item, index, arr) => {
      return item.text
    })
    let res = await getRewardStandardList({ limit: 10, offset: 0 })
    this.awardList = res.data.rows
    if (res.data.total > 10) {
      res = await getRewardStandardList({ limit: res.data.total, offset: 0 })
      this.awardList = res.data.rows
    }
    this.awardLabels = this.awardList.map((item, index, arr) => {
      return item.name
    })
  },
  mounted() {},
  computed: {
    // 以下属性-只有在任务中进入才会有值
    id() {
      return this.$route.query.rewardId
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
  margin: 10px 0;
  padding: 0 0 0 8px;
  background-color: $color-white;
}
.checkContent {
  .title {
    text-align: center;
    padding: 15px 0 20px 0;
    color: $color-text-secondary;
    font-size: $font-size-m;
  }
  .itemContent {
    color: $color-text-primary;
    font-size: $font-size-ml;
    padding-top: 20px;
    margin: 0 20px 15px 32px;
    position: relative;
    &::before {
      position: absolute;
      left: -12px;
      color: #ed3458;
      font-size: $font-size-m;
      content: '*';
    }
  }
  .van-radio-group {
    margin: 0 20px 0 20px;
    .van-radio {
      margin-right: 24px;
    }
  }
  .description-label {
    padding: 20px 20px 0 20px;
    font-size: $font-size-m;
    .left {
      color: $color-text-secondary;
    }
    .right {
      color: $color-auxiliary;
    }
  }
}
</style>
