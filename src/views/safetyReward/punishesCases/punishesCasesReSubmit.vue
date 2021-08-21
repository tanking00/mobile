<!-- 违规处罚-重新提交 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <PunishesCasesDetailsView :details="details" :stepData="stepData"></PunishesCasesDetailsView>
    </div>
    <SubmitButton>
      <SubmitButtonItem @click="$router.go(-1)" type="gray">取消</SubmitButtonItem>
      <SubmitButtonItem @click="invalidClik" type="danger">作废</SubmitButtonItem>
      <SubmitButtonItem @click="showEdit = true">编辑</SubmitButtonItem>
    </SubmitButton>
    <SubmitPanel isLarge v-model="showEdit" title="编辑" buttonText="提交" @submit="onSubmitForm">
      <van-form ref="form" @failed="onFailedForm" @submit="onSubmitForm" :show-error-message="false">
        <van-field v-model="form.reportStaffName" name="提报人员" label="提报人员" readonly input-align="right" />
        <van-field v-model="form.reportDeptName" name="提报部门" label="提报部门" readonly input-align="right" />
        <van-field
          v-model="form.illegalStaffName"
          name="违规人员"
          label="违规人员"
          placeholder="请选择"
          required
          readonly
          input-align="right"
          is-link
          size="large"
          @click="onClickField(0)"
          :rules="[{ required: true, message: '请选择违规人员' }]"
        />
        <van-field name="连带责任人" label="连带责任人" required readonly input-align="right" size="large"></van-field>
        <van-radio-group
          class="padding-left padding-top padding-bottom"
          v-model="form.isRelevance"
          direction="horizontal"
          @change="relevanceValChange"
        >
          <van-radio name="1">
            是
            <template #icon="props">
              <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
          <van-radio name="0">
            否
            <template #icon="props">
              <img class="radio-img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
          </van-radio>
        </van-radio-group>
        <van-collapse v-model="userActives" class="embedded-collapse padding-left padding-right" :border="false">
          <van-collapse-item v-for="(item, index) in form.staffInfo" :key="index" :title="'信息' + (index + 1)">
            <div class="label padding-bottom">违规过程:{{ item.illegalProcess }}</div>
            <div class="label padding-bottom">相关规定:{{ item.relevantRegulation }}</div>
            <div class="label padding-bottom">违规情节:{{ item.illegalPlot }}</div>
            <div class="label padding-bottom">违规类型:{{ item.illegalCategoryName }}</div>
            <div class="label padding-bottom">违规等级:{{ item.illegalLevelName }}</div>
            <van-divider></van-divider>
            <div class="center">
              <van-button native-type="button" class="delBtn" size="small" @click="delBtnClik(index)">删除</van-button>
            </div>
          </van-collapse-item>
        </van-collapse>
        <van-form ref="entryForm" @failed="onFailedForm" @submit="onUserSubmitForm" :show-error-message="false">
          <div class="form-label-required">违规过程</div>
          <van-field
            v-model="entryVal.illegalProcess"
            name="违规过程"
            rows="4"
            type="textarea"
            maxlength="50"
            placeholder="请填写违规过程"
            :rules="[{ required: true, message: '请填写违规过程' }]"
            show-word-limit
            class="form-textarea"
          />
          <div class="form-label-required">相关规定</div>
          <van-field
            v-model="entryVal.relevantRegulation"
            name="相关规定"
            rows="4"
            type="textarea"
            maxlength="50"
            placeholder="请填写相关规定"
            :rules="[{ required: true, message: '请填写相关规定' }]"
            show-word-limit
            class="form-textarea"
          />
          <van-field
            v-model="entryVal.illegalCategoryName"
            name="违规类型"
            label="违规类型"
            placeholder="请选择"
            required
            is-link
            input-align="right"
            size="large"
            @click="showTypeList = true"
            :rules="[{ required: true, message: '请选择违规类型' }]"
          />
          <van-field
            v-model="entryVal.illegalPlot"
            name="违规情节"
            label="违规情节"
            placeholder="请选择"
            required
            readonly
            input-align="right"
            is-link
            size="large"
            @click="showDesList = true"
            :rules="[{ required: true, message: '请选择违规情节' }]"
          />
          <van-field
            v-model="entryVal.illegalLevelName"
            name="违规等级"
            label="违规等级"
            placeholder="自动带入"
            readonly
            input-align="right"
            size="large"
          />
          <!-- <van-field
            v-model="entryVal.illegalCategoryName"
            name="违规分类"
            label="违规分类"
            placeholder="自动带入"
            readonly
            input-align="right"
            size="large"
          /> -->
          <div class="center padding-all">
            <van-button
              @click="addUserIllegalInfo"
              native-type="button"
              class="color-blue"
              style="width:100%"
              plain
              type="info"
              icon="add-o"
              >新增</van-button
            >
          </div>
        </van-form>
        <div class="padding-left padding-bottom">
          <div class="color-gray">处罚建议</div>
          <div class="value1">{{ form.staffForm }}</div>
          <div v-if="form.isRelevance == '1'">
            <div class="color-gray">安全责任领导</div>
            <div class="value1">{{ form.dutyLeaderName }}</div>
          </div>
        </div>
        <div v-if="form.isRelevance == '1'">
          <van-collapse
            v-model="leaderInfoActives"
            class="embedded-collapse padding-left padding-right"
            :border="false"
          >
            <van-collapse-item v-for="(item, index) in form.leaderInfo" :key="index" :title="'信息' + (index + 1)">
              <div class="label padding-bottom">违规过程:{{ item.illegalProcess }}</div>
              <div class="label padding-bottom">相关规定:{{ item.relevantRegulation }}</div>
              <!-- <div class="label padding-bottom">违规情节:{{ item.illegalPlot }}</div> -->
              <div class="label padding-bottom">违规等级:{{ item.illegalLevelName }}</div>
            </van-collapse-item>
          </van-collapse>
          <div class="padding-left padding-bottom">
            <div class="color-gray">处罚建议</div>
            <div class="value1">{{ form.leaderForm }}</div>
          </div>
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
    </SubmitPanel>
    <PeopleSearchPanel v-model="showPeopleSearchPanel" @select="onSelect"></PeopleSearchPanel>
    <van-action-sheet
      v-model="showTypeList"
      :actions="types"
      cancel-text="取消"
      description="请选择违规类型"
      close-on-click-action
      @select="typeSelected"
    />
    <van-action-sheet
      v-model="showDesList"
      :actions="punishDescriptionList"
      cancel-text="取消"
      description="请选择违规情节"
      close-on-click-action
      @select="cpunishDesSelect"
    />
    <van-action-sheet
      v-model="showCategory"
      :actions="categoryList"
      cancel-text="取消"
      description="请选择违规分类"
      close-on-click-action
      @select="categorySelect"
    />
  </div>
</template>

<script>
import { PunishesCasesDetailsView } from './components'
import {
  getPunishInfoDetails,
  getPunishDescriptionList,
  getUserDutyLeader,
  punishInfoResubmit,
  destroyPunish
} from '@/api/safetyReward'
import { getLastNodeTimeString } from '../components'
import {
  // getDropdownDataOfCode,
  getDictLabelOfCode
} from '@/utils'

import { Dialog, Toast } from 'vant'

export default {
  name: 'PunishesCasesReSubmit',
  components: { PunishesCasesDetailsView },
  data() {
    return {
      showTypeList: false,
      showDesList: false,
      showCategory: false,
      showPeopleSearchPanel: false,
      activeIcon: require('@/assets/icon_images/pitchon.png'),
      inactiveIcon: require('@/assets/icon_images/unselected.png'),
      actives: ['1'],
      details: {},
      stepData: {
        stepActive: 0,
        processCode: '',
        steps: [
          { title: '发起', time: '' },
          { title: '审核', time: '' },
          { title: '人员确认', time: '' },
          { title: '首席安全官批准', time: '' },
          { title: '工会主席批准', time: '' },
          { title: '行政人事总监会签', time: '' },
          { title: '安委会常务副主任会签', time: '' },
          { title: '战略副总裁会签', time: '' },
          { title: '结束', time: '' }
        ]
      },
      showEdit: false,
      form: {
        // 提报人员信息
        reportStaffName: '',
        reportStaffId: '',
        reportStaffCode: '',
        // 提报部门
        reportDeptName: '',
        reportDeptId: '',
        // 违规人员
        illegalStaffName: '',
        illegalStaffId: '',
        isRelevance: '',
        staffInfo: [],
        leaderInfo: [],
        dutyLeaderName: '',
        dutyLeaderId: '',
        leaderForm: '',
        fileList: [],
        defaultList: []
      },
      userActives: [],
      leaderInfoActives: [],
      entryVal: {
        illegalProcess: '', // 违规过程
        relevantRegulation: '', // 相关规定
        illegalPlot: '', // 违规情节
        illegalCategoryName: '', // 违规类型
        illegalCategoryId: '',
        illegalLevelName: '', // 违规等级
        illegalLevelId: ''
      },
      descriptionList: [],
      types: [],
      punishDescriptionList: [],
      categoryList: []
    }
  },
  methods: {
    getDetails() {
      getPunishInfoDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
          if (data.attachment) {
            this.form.fileList = [data.attachment]
            this.form.defaultList = data.files
            console.log('this.form2=', this.form)
          }
          this.form = Object.assign(this.form, data)
          console.log('this.form=', this.form)

          this.stepData.processCode = data.processCode || ''
          this.stepData.stepActive = parseInt(data.schedule) - 1
          const nodes = this.details.records
          this.stepData.steps.forEach((item, index) => {
            if (index < this.stepData.stepActive) {
              item.time = getLastNodeTimeString(item.title, nodes)
              item.title = item.title + '（已完成）'
            } else if (index === this.stepData.stepActive) {
              if (item.title === '结束') {
                this.stepData.stepActive = this.stepData.steps.length + 1
              } else {
                item.title = item.title + '（进行中）'
              }
            }
          })
        })
        .catch(err => {
          console.log(err)
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
            taskId: this.taskId
          }
          await destroyPunish(params)
          Toast('提交成功')
          this.$router.go(-1)
        })
        .catch(() => {
          // on cancel
        })
    },
    onFailedForm(info) {
      Toast(info.errors[0].message)
    },
    async onSubmitForm() {
      if (this.form.staffInfo.length === 0) {
        Toast('请添加员工违规处罚信息')
        return
      }
      if (this.form.isRelevance === '1' && this.form.leaderInfo.length === 0) {
        Toast('请添加领导违规处罚信息')
        return
      }
      // Toast('验证通过')
      var params = Object.assign(this.form, {})
      if (params.fileList.length !== 0) {
        params.attachment = params.fileList[0]
      }

      this.form.staffInfo.sort((a, b) => {
        return a.sort - b.sort
      })
      this.form.leaderInfo.sort((a, b) => {
        return a.sort - b.sort
      })
      this.form.staffViolationLevelId = this.form.staffInfo[0].levelId
      this.form.staffViolationLevelName = this.form.staffInfo[0].illegalLevelName
      this.form.leaderViolationLevelId = this.form.leaderInfo[0].levelId
      this.form.leaderViolationLevelName = this.form.leaderInfo[0].illegalLevelName

      params.records = null
      params = Object.assign(this.form, {
        taskId: this.taskId,
        processCode: this.processCode,
        operation: 1
      })
      console.log('params = ', params)
      await punishInfoResubmit(params)
      Toast('提交成功')
      this.$router.go(-1)
    },
    addLeaderIllegalInfo() {
      this.$refs.entryLeaderForm.submit()
    },
    onLeaderSubmitForm() {
      Toast('leader验证通过')
    },
    addUserIllegalInfo() {
      this.$refs.entryForm.submit()
    },
    // 用户违规信息验证通过
    onUserSubmitForm() {
      const val = Object.assign(this.entryVal, {})
      this.form.staffInfo.push(val)
      this.entryVal = {
        illegalProcess: '', // 违规过程
        relevantRegulation: '', // 相关规定
        illegalPlot: '', // 违规情节
        illegalCategoryName: '', // 违规类型
        illegalCategoryId: '',
        illegalLevelName: '', // 违规等级
        illegalLevelId: ''
      }
      Toast('已添加')
      // 更新处罚建议 = 违规分类“+”+处罚形式（取最高一个分类）
      // 1先把已有的员工违规处罚按照处罚分类进行排序
      var arr = this.form.staffInfo.concat()
      arr.sort((a, b) => {
        return a.sort - b.sort // 1,2,3 等级1最高
      })
      const firstItem = arr[0]
      // 2根据等级最高的分类id查找处罚形式
      const findItem = this.punishDescriptionList.find(item => {
        return item.typeId === firstItem.illegalCategoryId
      }) // 返回子项
      if (findItem === undefined) {
        Toast('该分类处罚形式为空')
        this.form.staffForm = ''
        return
      }
      this.form.staffForm = firstItem.illegalCategoryName + findItem.form
      // 同时添加一个责任领导违规信息
      if (this.form.isRelevance === '1') {
        this.addLeaderInfo(val)
      }
    },
    onClickField() {
      this.showPeopleSearchPanel = true
    },
    // 选择转交人回调
    onSelect(user) {
      this.form.illegalStaffName = user.name
      this.form.illegalStaffId = user.id
      // 获取责任领导
      this.getLeader(user.id)
    },
    // 获取责任领导
    async getLeader(userId) {
      const parameters = { id: userId }
      console.log(parameters)
      const res = await getUserDutyLeader(parameters)
      const { data } = res
      this.form.dutyLeaderId = data.id
      this.form.dutyLeaderName = data.name
    },
    // 是否有连带责任人回调
    relevanceValChange() {
      if (this.form.isRelevance === '1') {
        if (!this.form.illegalStaffId) {
          return
        }
        // 获取责任领导
        this.getLeader(this.form.illegalStaffId)
        this.form.leaderInfo = []
        this.form.staffInfo.forEach(element => {
          this.addLeaderInfo(element)
        })
      }
    },
    async addLeaderInfo(element) {
      const sortL = element.sort + 1
      var sortItem = null
      for (let index = 0; index < this.punishDescriptionList.length; index++) {
        sortItem = this.punishDescriptionList[index]
        if (sortItem.sort === sortL) {
          break
        }
      }
      if (sortItem == null) {
        sortItem = this.punishDescriptionList[this.punishDescriptionList.length - 1]
      }

      this.form.leaderInfo.push({
        illegalProcess: '连带责任',
        relevantRegulation:
          '《CAG036 安全奖惩制度》条款7.6连带责任处罚：员工存在违规行为的，其直属领导负连带责任，并处以违规等级低一级的经济处罚或行政处分',
        illegalPlot: '',
        // illegalCategoryName: categoryName,
        // illegalCategoryId: category,
        illegalLevelId: sortItem.levelId,
        illegalLevelName: await getDictLabelOfCode('safety_illegal_level', sortItem.levelId),
        sort: sortItem.sort
      })
      // 处理领导违规处罚建议
      var arr = this.form.leaderInfo.concat()
      arr.sort((a, b) => {
        return a.sort - b.sort
      }) // 降序
      const firstItem = arr[0]
      const findItem = this.punishDescriptionList.find(item1 => item1.typeId === firstItem.illegalCategoryId) // 返回子项
      if (findItem === undefined) {
        // Toast('该分类处罚形式为空')
        this.form.leaderForm = ''
        return
      }
      this.form.leaderForm = firstItem.illegalCategoryName + findItem.form
    },
    // 员工违规-删除
    delBtnClik(index) {
      if (this.form.isRelevance === '1') {
        if (this.form.staffInfo.length !== this.form.leaderInfo.length) {
          this.form.staffInfo.splice(index, 1)
          this.relevanceValChange()
        } else {
          this.form.leaderInfo.splice(index, 1)
          this.form.staffInfo.splice(index, 1)
        }
      } else {
        this.form.staffInfo.splice(index, 1)
      }
    },
    // 员工-违规情节选择回调
    async cpunishDesSelect(item, index) {
      this.entryVal.sort = item.sort
      this.entryVal.illegalPlot = item.description
      // // 违规类型
      // const typeName = await getDictLabelOfCode('safety_illegal_type', item.typeId)
      // this.entryVal.illegalCategoryName = typeName
      // this.entryVal.illegalCategoryId = item.typeId
      // 违规等级
      const levelName = await getDictLabelOfCode('safety_illegal_level', item.levelId)
      this.entryVal.illegalLevelId = item.levelId
      this.entryVal.illegalLevelName = levelName
    },
    // 违规分类选择
    categorySelect(item, index) {
      // this.entryLeaderVal.illegalCategoryName = item.name
      // this.entryLeaderVal.illegalCategoryId = item.value
      // // 根据等级分类id查找处罚形式
      // const findItem = this.punishDescriptionList.find(item1 => item1.typeId === this.entryLeaderVal.illegalCategoryId) // 返回子项
      // if (!findItem) {
      //   Toast('该分类处罚形式为空')
      //   this.form.leaderForm = ''
      //   return
      // }
      // this.form.leaderForm = this.entryLeaderVal.illegalCategoryName + findItem.form
    },
    // 违规类型选择
    typeSelected(item, index) {
      // console.log('违规类型回调====', item)
      this.entryVal.illegalCategoryName = item.typeName
      this.entryVal.illegalCategoryId = item.typeId
      // 重置情节
      this.entryVal.sort = null
      this.entryVal.illegalPlot = null
      // 重置等级
      this.entryVal.illegalLevelId = null
      this.entryVal.illegalLevelName = null

      var arr = this.descriptionList.filter(function(item2) {
        return item.typeId === item2.typeId
      })
      arr = JSON.parse(JSON.stringify(arr))
      this.punishDescriptionList = arr.map(item3 => {
        item3.name = item3.description
        return item3
      })
      this.punishDescriptionList.sort((a, b) => {
        return a.sort - b.sort
      })
    },
    async getPunishDescriptionList() {
      const res = await getPunishDescriptionList()
      const { data } = res
      this.descriptionList = data
      var obj = {}
      this.descriptionList.forEach(element => {
        obj[element.typeId] = element
      })
      var arr = Object.values(obj)
      this.types = arr.map(item => {
        item.name = item.typeName
        return item
      })
    }
  },
  async created() {
    this.getDetails()
    this.getPunishDescriptionList()
    // this.categoryList = await getDropdownDataOfCode('safety_illegal_type')
    // this.categoryList.forEach(element => {
    //   element.name = element.text
    // })
  },
  computed: {
    id() {
      return this.$route.query.punishId
    },
    taskId() {
      return this.$route.query.taskId
    },
    processCode() {
      return this.$route.query.processCode
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';

// ::v-deep .van-action-sheet__header {
//   text-align: left;
//   padding-left: 12px;
// }
// .content {
//   padding-left: 12px;
//   padding-right: 12px;
// }
::v-deep .van-divider {
  margin: 1px 1px 10px 1px;
}
.delBtn {
  background-color: unset;
  border: unset;
  font-size: 15px;
  color: #ed3458;
  letter-spacing: 0;
  text-align: center;
  // line-height: 225px;
  // font-weight: 500;
  font-family: PingFangSC-Medium;
}
</style>
