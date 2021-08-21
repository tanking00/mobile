<!-- Created by Tanking. -->
<!-- 提报部门审核 -->
<template>
  <div class="container" :class="{ 'submit-button-height': taskId, 'container-supports': !taskId }">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="activeNames" class="default-collapse">
        <van-collapse-item name="1" title="基础信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <BasicInfo :details="details"></BasicInfo>
        </van-collapse-item>
        <van-collapse-item name="2" title="隐患提报">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('2') >= 0"></CollapseIcon>
          </template>
          <ReportInfoEdit
            :details="details"
            :hazardCommit="hazardCommit"
            isMajor="1"
            @change="onChange"
          ></ReportInfoEdit>
        </van-collapse-item>
        <van-collapse-item v-if="recordList && recordList.length > 0" name="3" title="历史审批信息">
          <template #right-icon>
            <CollapseIcon :isOpen="activeNames.indexOf('3') >= 0"></CollapseIcon>
          </template>
          <ApprovalRecordInfo :recordList="recordList"></ApprovalRecordInfo>
        </van-collapse-item>
      </van-collapse>
      <ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
    </div>
    <SubmitButton v-if="taskId">
      <SubmitButtonItem @click="showPanel1 = true" type="primary">退回</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel2 = true">转办</SubmitButtonItem>
      <SubmitButtonItem @click="showPanel3 = true">同意</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel v-model="showPanel1" title="审批意见" buttonText="确认退回" @submit="onClickForm1">
      <van-form ref="form1" @failed="onFailedForm1" @submit="onSubmitForm1" :show-error-message="false">
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="form1.opinion"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
          :rules="[{ required: true, message: '请填写意见说明' }]"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
    <SubmitPanel v-model="showPanel2" title="审批意见" buttonText="确认转办" @submit="onClickForm2">
      <van-form ref="form2" @failed="onFailedForm2" @submit="onSubmitForm2" :show-error-message="false">
        <van-field
          v-model="form2.nextUserName"
          name="转办处理人"
          label="转办处理人"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="showPeopleSearchPanel = true"
          :rules="[{ required: true, message: '请选择转办处理人' }]"
        />
        <div class="form-label-required">意见说明</div>
        <van-field
          v-model="form2.opinion"
          name="意见说明"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
          :rules="[{ required: true, message: '请填写意见说明' }]"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
    <SubmitPanel v-model="showPanel3" title="审批意见" buttonText="确认提交" :isLarge="true" @submit="onClickForm3">
      <van-form ref="form3" @failed="onFailedForm3" @submit="onSubmitForm3" :show-error-message="false">
        <van-collapse v-model="activeDeptNames" class="embedded-collapse">
          <van-collapse-item
            v-for="(item, index) in deptList"
            :key="item.id"
            :title="'整改方案' + toChinesNum(index + 1)"
            :name="index + 1"
          >
            <div>
              <div class="text">{{ `整改责任部门：${item.deptName}` }}</div>
              <div class="text">{{ `部门经理：${item.deptManager}（${item.deptManagerId}）` }}</div>
              <div v-if="hazardCommit.isMajor === '1'" class="text">
                {{ `督办总监：${item.deptSupervise}（${item.deptSuperviseId}）` }}
              </div>
              <div v-if="taskId" class="wrapper-operation van-hairline--top">
                <div class="operation-btn color-primary" @click="onClickDelDept(item, index)">删除</div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
        <van-field
          v-if="deptList.length < 3"
          v-model="form3.deptName"
          name="整改责任部门"
          label="整改责任部门"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          :is-link="true"
          size="large"
          @click="showPickerDept = true"
        />
        <van-field
          v-if="deptList.length < 3"
          v-model="form3.deptManager"
          name="部门经理"
          label="部门经理"
          placeholder="自动带入"
          readonly
          input-align="right"
          size="large"
        />
        <van-field
          v-if="deptList.length < 3 && hazardCommit.isMajor === '1'"
          v-model="form3.deptSupervise"
          name="督办总监"
          label="督办总监"
          placeholder="自动带入"
          readonly
          input-align="right"
          size="large"
        />
        <div v-if="deptList.length < 3" class="padding-left-right">
          <van-button
            v-if="taskId"
            plain
            type="info"
            block
            icon="add"
            hairline
            class="margin-bottom"
            @click="onClickAdd"
            native-type="button"
            >添加整改责任部门</van-button
          >
        </div>
        <div class="form-label">意见说明</div>
        <van-field
          v-model="opinion"
          rows="4"
          type="textarea"
          maxlength="1000"
          placeholder="请填写意见说明"
          show-word-limit
          class="form-textarea"
        />
      </van-form>
    </SubmitPanel>
    <PeopleSearchPanel v-model="showPeopleSearchPanel" @select="onSelect"></PeopleSearchPanel>
    <!-- 部门选择 -->
    <van-popup v-model="showPickerDept" round position="bottom">
      <van-picker show-toolbar :columns="columnsDept" @cancel="showPickerDept = false" @confirm="onConfirmDept" />
    </van-popup>
  </div>
</template>

<script>
import { getHazardMajorDetails, commitAssignDep, getUserOrg } from '@/api/hazard'
import { BasicInfo, ReportInfoEdit, ApprovalRecordInfo } from '../components'
import { formatTimeStamp } from '@/utils/timeFormat'
import { Dialog, Toast } from 'vant'
import { getAllOrg } from '@/api/global'
import { formatTree, toChinesNum } from '@/utils'

export default {
  name: 'HazardMajorAssignDept',
  components: { BasicInfo, ReportInfoEdit, ApprovalRecordInfo },
  data() {
    return {
      activeNames: ['2'],
      stepActive: 1,
      steps: [
        { title: '隐患提报（已完成）', time: '' },
        { title: '提报部门审核（进行中）', time: '' },
        { title: '整改责任部门审核', time: '' },
        { title: '制定整改方案', time: '' },
        { title: '督办总监审核', time: '' },
        { title: '安全部门审核', time: '' },
        { title: '首席安全官审核', time: '' },
        { title: '隐患整改执行', time: '' },
        { title: '督办总监确认', time: '' },
        { title: '整改验收', time: '' },
        { title: '首席安全官确认', time: '' },
        { title: '流程结束', time: '' }
      ],
      processCode: '',
      details: {},
      recordList: [],
      showPanel1: false, // 退回
      showPanel2: false, // 转办
      showPanel3: false, // 同意
      form1: { opinion: '' },
      form2: {
        nextUserId: '',
        nextUserName: '',
        opinion: ''
      },
      form3: {
        deptName: '',
        mainDeptId: '',
        deptManager: '',
        deptManagerId: '',
        deptSupervise: '',
        deptSuperviseId: '',
        hazardSubId: '',
        delDept: ''
      },
      opinion: '',
      deptList: [],
      activeDeptNames: [],
      columnsDept: [],
      showPickerDept: false,
      showPeopleSearchPanel: false,
      hazardCommit: {}, // 提报信息
      canSubmit: true, // 是否可以同意，提报信息不完整不可以同意
      oldFiles: '' // 原来的附件
    }
  },
  methods: {
    getDetails() {
      getHazardMajorDetails(this.hazardId, this.hazardSubId)
        .then(res => {
          const { data } = res
          this.details = data
          this.hazardCommit.classifyId = this.details.classifyId
          this.hazardCommit.levelId = this.details.levelId
          this.hazardCommit.narrate = this.details.narrate
          this.hazardCommit.source = this.details.source
          this.hazardCommit.subclassId = this.details.subclassId
          this.hazardCommit.projectName = this.details.projectName
          this.hazardCommit.projectNo = this.details.projectNo
          this.hazardCommit.isMajor = '1'

          let files = ''
          if (this.details.fileList) {
            this.details.fileList.forEach((item, index) => {
              if (index !== 0) {
                files += ',' + item.id
              } else {
                files += item.id
              }
            })
          }
          this.oldFiles = files
          this.hazardCommit.files = files

          this.processCode = data.processCode
          this.recordList = data.hazardRecords
          const stepInfo1 = []
          data.hazardRecords.forEach(item => {
            if (item.nodeName === '隐患提报') {
              stepInfo1.push(item)
            }
          })
          this.steps[0].time = stepInfo1[0] ? formatTimeStamp(stepInfo1[0].createdTime, 6) : ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选中转办人
    onSelect(data) {
      this.form2.nextUserName = data.name
      this.form2.nextUserId = data.id
    },
    // 退回
    onClickForm1() {
      this.$refs['form1'].submit()
    },
    onFailedForm1(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm1() {
      Dialog.confirm({
        message: '确认要退回审批？'
      })
        .then(() => {
          // on confirm
          const req = {
            action: 'SUBMIT_REJECT',
            hazardId: this.hazardId,
            taskId: this.taskId,
            opinion: this.form1.opinion,
            hazardCommit: {
              classifyId: this.details.classifyId,
              levelId: this.details.levelId,
              narrate: this.details.narrate,
              source: this.details.source,
              subclassId: this.details.subclassId,
              projectName: this.details.projectName,
              projectNo: this.details.projectNo,
              files: this.oldFiles
            }
          }
          commitAssignDep(req)
            .then(res => {
              this.showPanel1 = false
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    // 转办
    onClickForm2() {
      this.$refs['form2'].submit()
    },
    onFailedForm2(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm2() {
      Dialog.confirm({
        message: '确认要转办审批？'
      })
        .then(() => {
          // on confirm
          const req = {
            action: 'SUBMIT_DELIVER',
            hazardId: this.hazardId,
            taskId: this.taskId,
            opinion: this.form2.opinion,
            nextUserId: this.form2.nextUserId,
            nextUserName: this.form2.nextUserName,
            hazardCommit: {
              classifyId: this.details.classifyId,
              levelId: this.details.levelId,
              narrate: this.details.narrate,
              source: this.details.source,
              subclassId: this.details.subclassId,
              projectName: this.details.projectName,
              projectNo: this.details.projectNo,
              files: this.oldFiles
            }
          }
          commitAssignDep(req)
            .then(res => {
              this.showPanel2 = false
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    // 同意
    onClickForm3() {
      this.$refs['form3'].submit()
    },
    onFailedForm3(info) {
      Toast(info.errors[0].message)
    },
    onSubmitForm3() {
      if (this.deptList.length <= 0) {
        Toast('请选择整改责任部门')
        return
      }
      if (!this.canSubmit) {
        Toast('请完成必填项填写！')
        return
      }
      Dialog.confirm({
        message: '确认要同意审批？'
      })
        .then(() => {
          // on confirm
          const req = {
            action: 'SUBMIT_PASS',
            hazardId: this.hazardId,
            taskId: this.taskId,
            opinion: this.opinion,
            nextUserId: '',
            nextUserName: '',
            hazardCommit: this.hazardCommit,
            deptList: this.deptList
          }
          commitAssignDep(req)
            .then(res => {
              this.showPanel3 = false
              this.$router.go(-1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    // 获取部门
    getAllOrg() {
      getAllOrg()
        .then(res => {
          const { data } = res
          console.log(data)
          this.columnsDept = formatTree(data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 部门选择回调
    async onConfirmDept(values, indexs) {
      this.showPickerDept = false
      let dept
      indexs.forEach((item, index) => {
        if (index === 0) {
          dept = this.columnsDept[item]
        } else {
          dept = dept.children[item]
        }
      })
      let isFind = false
      this.deptList.forEach(item => {
        if (item.mainDeptId === dept.id) {
          isFind = true
        }
      })
      if (!isFind) {
        const res = await getUserOrg(dept.id)
        const org = res.data
        this.form3.deptManagerId = org.id // 责任部门经理ID
        this.form3.deptManager = org.name // 责任部门经理
        this.form3.mainDeptId = dept.id // 整改责任部门id
        this.form3.deptName = dept.text // 整改责任部门名称
        this.form3.deptSupervise = org.managerName // 督办总监
        this.form3.deptSuperviseId = org.managerId // 督办总监id
      } else {
        Toast('该部门已存在！')
      }
    },
    // 添加
    onClickAdd() {
      if (this.form3.deptName && this.form3.deptManager && this.form3.deptSupervise) {
        this.deptList.push(this.form3)
        this.activeDeptNames.push(this.deptList.length)
        this.form3 = {
          opinion: '',
          deptName: '',
          mainDeptId: '',
          deptManager: '',
          deptManagerId: '',
          deptSupervise: '',
          deptSuperviseId: '',
          hazardSubId: '',
          delDept: ''
        }
      } else {
        Toast('请选择整改责任部门')
      }
    },
    // 删除
    onClickDelDept(item, index) {
      console.log(item, index)
      this.deptList.splice(index, 1)
    },
    // 查询部门领导
    getUserOrg() {
      getUserOrg()
        .then(res => {
          const { data } = res
          console.log(data)
          this.columnsDept = formatTree(data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 提报信息改变
    onChange(hazardCommit, canSubmit) {
      this.hazardCommit = hazardCommit
      this.canSubmit = canSubmit
    }
  },
  async created() {
    this.getDetails()
    this.getAllOrg()
  },
  computed: {
    hazardId() {
      return this.$route.query.hazardId
    },
    hazardSubId() {
      return this.$route.query.hazardSubId
    },
    taskId() {
      return this.$route.query.taskId
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    toChinesNum() {
      return toChinesNum
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.wrapper-operation {
  display: flex;
  .operation-btn {
    height: 45px;
    width: 100%;
    font-weight: $font-weight;
    font-size: $font-size-ml;
    text-align: center;
    line-height: 45px;
  }
}
.embedded-collapse {
  margin-top: 10px;
}
</style>
