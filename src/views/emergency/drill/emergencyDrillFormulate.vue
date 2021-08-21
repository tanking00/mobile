<!-- 应急演练方案制定-->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main">
      <div v-if="isSpontaneous">
        <div class="margin-top">
          <van-field
            v-model="exercisePlan"
            name="演练计划"
            label="演练计划"
            placeholder="请输入"
            required
            input-align="right"
            size="large"
            maxlength="50"
            :rules="[{ required: true, message: '请输入演练计划' }]"
          />
        </div>
        <div class="margin-top">
          <van-field
            v-model="categoryName"
            name="预案分类"
            label="预案分类"
            placeholder="请选择"
            required
            readonly
            input-align="right"
            is-link
            size="large"
            @click="showCategory = true"
            :rules="[{ required: true, message: '请选择预案分类' }]"
          />
        </div>
      </div>
      <div class="margin-top">
        <van-cell @click="showExercise = true" required title="演练形式" is-link value="请选择">
          <template v-if="exerciseType" #default>
            <div class="color-text-primary">{{ exerciseType }}</div>
          </template>
        </van-cell>
      </div>
      <div class="margin-top">
        <van-cell required title="应急预案" is-link value="请选择" @click="showPrePlan = true">
          <template v-if="planData.id" #default>
            <div class="color-text-primary">{{ planData.planName }}</div>
          </template>
        </van-cell>
      </div>
      <div class="margin-top" style="color:red">
        <van-cell @click="showDatePickerSheet = true" required title="演练日期" is-link value="请选择">
          <template v-if="drillDate" #default>
            <div class="color-text-primary">{{ drillDateStr }}</div>
          </template>
        </van-cell>
      </div>
      <div class="margin-top">
        <van-cell @click="clikUserCell" required title="演练人员" is-link value="请选择">
          <template v-if="selectMembers.length != 0" #default>
            <van-tag
              style="margin-right:10px"
              round
              v-for="(item, index) in selectMembers"
              :key="index"
              closeable
              size="medium"
              type="primary"
              @close="delUser(item, index)"
            >
              {{ item.name }}
            </van-tag>
          </template>
        </van-cell>
      </div>
      <div class="margin-top">
        <van-cell :border="false" required title="演练地点"> </van-cell>
        <van-field
          v-model="location"
          rows="3"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          show-word-limit
        />
      </div>
      <div class="margin-top margin-bottom background-color-white">
        <van-cell :border="false" required title="演练策划方案"> </van-cell>
        <div class="padding-left padding-right padding-bottom">
          <UploadFile
            v-model="fileList"
            :default="defaultList"
            :maxCount="1"
            :maxSize="50"
            :disabled="false"
            :accepts="['pdf', 'word']"
            tips="支持格式：pdf、word，50M以内"
          ></UploadFile>
        </div>
      </div>
    </div>
    <SubmitButton @click="onClickSubmit" position="fixed" text="提交"></SubmitButton>
    <PrePlanListPanel v-model="showPrePlan" @select="onSelectPrePlan" :planCategory="categoryId"></PrePlanListPanel>
    <van-action-sheet
      v-model="showExercise"
      :actions="exerciseTypeList"
      cancel-text="取消"
      close-on-click-action
      @select="onExerciseTypeSelect"
    />
    <DatePickerSheet
      :minDate="minDate"
      v-model="showDatePickerSheet"
      type="date"
      @select="onDateSelect"
    ></DatePickerSheet>
    <!-- <van-action-sheet v-model="showMember" :actions="members" cancel-text="取消" @select="onMemberSelect">
    </van-action-sheet> -->
    <PeoplesSearchPanel v-model="showMember" @select="onSelect"></PeoplesSearchPanel>
    <van-action-sheet
      @select="onCategorySelect"
      close-on-click-action
      v-model="showCategory"
      :actions="categorys"
      cancel-text="取消"
    >
    </van-action-sheet>
  </div>
</template>

<script>
import { getPersonByPlanId, uploadEmergencyPlan } from '@/api/emergency'
import { formatTimeStamp } from '@/utils/timeFormat'
import { Dialog, Toast } from 'vant'
import { getDropdownDataOfCode } from '@/utils'
// import { use } from 'echarts'

export default {
  name: 'EmergencyDrillFormulate',
  props: {},
  data() {
    return {
      showPrePlan: false,
      showExercise: false,
      showCategory: false,
      exerciseType: '', // 演练形式
      exerciseTypeList: [{ name: '桌面' }, { name: '实际' }],
      showDatePickerSheet: false,
      minDate: new Date(),
      // Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      drillDate: '',
      drillDateStr: '',
      planData: {}, // 应急预案信息
      location: '', // 地点
      fileList: [],
      defaultList: [],
      showMember: false,
      // members: [], // 所有的人员
      selectMembers: [], // 选择的人员
      details: this.$route.query.details || {},
      isSpontaneous: false,
      exercisePlan: '', // 演练计划名称
      categoryId: '',
      categoryName: '',
      categorys: []
    }
  },
  methods: {
    // 获取人员
    getPersons(isAdd) {
      if (!this.planData.id) {
        return
      }
      var params = {
        planId: this.planData.id
      }
      getPersonByPlanId(params)
        .then(res => {
          const { data } = res
          var names = data.map(function(item, index, ary) {
            return {
              name: item.realName,
              id: item.id,
              userId: item.userId,
              code: item.userCode,
              deptName: item.deptName || ''
            }
          })
          // if (names.length === 0) {
          //   Toast('当前应急预案无演练人员')
          // }
          if (isAdd) {
            this.selectMembers = names
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 人员组件回调
    onSelect(users) {
      console.log('users =', users)
      var names = users.map(function(item, index, ary) {
        return {
          name: item.name,
          id: '',
          userId: item.id,
          code: item.code,
          deptName: item.orgName || '',
          roleName: ''
        }
      })
      const tempArr = this.selectMembers.concat(names)
      var result = []
      var obj = {}
      for (var i = 0; i < tempArr.length; i++) {
        if (!obj[tempArr[i].userId]) {
          result.push(tempArr[i])
          obj[tempArr[i].userId] = true
        }
      }
      this.selectMembers = result
    },
    delUser(item, index) {
      this.selectMembers.splice(index, 1)
    },
    onExerciseTypeSelect(val) {
      this.showExercise = false
      this.exerciseType = val.name
    },
    onDateSelect(value) {
      var str = this.formatTimeStamp(value, 5)
      str = str + ' 23:59:59'
      var time = new Date(str).getTime() / 1000
      // console.log('time=', time)
      // 日期选择器-时间返回当天00：00：00，业务需要 当前23：59：59
      this.drillDate = time
      this.drillDateStr = this.formatTimeStamp(this.drillDate, 5)
    },
    clikUserCell() {
      if (!this.planData.id) {
        Toast('请先选择应急预案')
        return
      }
      this.showMember = true
    },
    onSelectPrePlan(item) {
      // 接受选择的应急预案
      this.planData = item
      this.selectMembers = []
      this.getPersons(true)
    },
    // 预案分类选择
    onCategorySelect(item) {
      if (this.categoryName !== item.name) {
        this.planData = {}
        this.selectMembers = []
      }
      this.categoryName = item.name
    },
    onClickSubmit() {
      if (this.isSpontaneous) {
        if (!this.exercisePlan.trim()) {
          Toast('请输入演练计划')
          return
        }
        if (!this.categoryId) {
          Toast('请选择预案分类')
          return
        }
      }
      if (!this.exerciseType) {
        Toast('请选择演练形式')
        return
      }
      if (!this.planData.id) {
        Toast('请选择应急预案')
        return
      }
      if (!this.drillDate) {
        Toast('请选择演练日期')
        return
      }
      if (this.selectMembers.length === 0) {
        Toast('请选择演练人员')
        return
      }
      if (!this.location) {
        Toast('请输入演练地点')
        return
      }
      if (this.fileList.length === 0) {
        Toast('请上传策划方案')
        return
      }
      Dialog.confirm({
        message: '确认提交方案？'
      })
        .then(() => {
          var names = this.selectMembers.map(function(item, index, ary) {
            return item.name
          })
          var userIds = this.selectMembers.map(function(item, index, ary) {
            return item.userId
          })
          var ids = this.selectMembers.map(function(item, index, ary) {
            return item.id
          })
          var codes = this.selectMembers.map(function(item, index, ary) {
            return item.code
          })
          var deps = this.selectMembers.map(function(item, index, ary) {
            return item.deptName
          })
          var rotes = this.selectMembers.map(function(item, index, ary) {
            return item.roleName
          })

          var memberNames = names.join(',')
          var memberUserIds = userIds.join(',')
          var memberCodes = codes.join(',')
          var memberIds = ids.join(',')
          var memberDeps = deps.join(',')
          var memberRotes = rotes.join('<!!!>')
          if (memberIds.length !== memberUserIds.length) {
            memberIds = ''
          }
          let params = {
            taskId: this.taskId,
            id: this.id,
            exerciseType: this.exerciseType,
            planId: this.planData.id,
            planName: this.planData.planName,
            exerciseTime: this.drillDate,
            exerciseSite: this.location,
            accessory: this.fileList.join(','), // 演练方案
            exerciseUserId: memberUserIds,
            exerciseRealName: memberNames,
            emergencyPersonId: memberIds,
            exerciseUserCode: memberCodes,
            exerciseUserDept: memberDeps,
            exerciseUserRole: memberRotes,
            course: '1'
          }
          // 判断是否从计划管理进入
          var planManageData = this.$route.query.planManageData
          if (planManageData) {
            params = Object.assign(params, planManageData)
          } else {
            params.exercisePlan = this.exercisePlan
            params.categoryId = this.categoryId
            params.categoryName = this.categoryName
            params.processCode = this.details.processCode
          }
          uploadEmergencyPlan(params)
            .then(res => {
              this.$router.go(-2)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  async created() {
    this.categorys = await getDropdownDataOfCode('emergency_plan', false)
    this.categorys.forEach(item => {
      item.name = item.text
    })
  },
  mounted() {
    // console.log('this.$route.query=', this.$route.query)
    if (this.$route.query.details) {
      const details = this.$route.query.details
      if (!details.planManageId || details.planManageId.length === 0) {
        this.isSpontaneous = true
        this.categoryId = details.categoryId
        this.categoryName = details.categoryName
        this.exercisePlan = details.exercisePlan
      }
      // console.log('details=', details)
      this.exerciseType = details.exerciseType
      this.planData = {
        id: details.planId,
        planName: details.planName
      }
      this.location = details.exerciseSite
      if (details.accessory && details.accessory.length !== 0) {
        this.defaultList = details.afiles
        this.fileList = details.accessory.split(',')
      }
      this.getPersons()
      this.drillDate = details.exerciseTime
      this.drillDateStr = this.formatTimeStamp(details.exerciseTime, 5)
      const names = details.exerciseRealName.split(',')
      const userIds = details.exerciseUserId.split(',')
      const codes = details.exerciseUserCode ? details.exerciseUserCode.split(',') : []
      const ids = details.emergencyPersonId ? details.emergencyPersonId.split(',') : []
      const deps = details.exerciseUserDept ? details.exerciseUserDept.split(',') : []
      const roles = details.exerciseUserRole ? details.exerciseUserRole.split('<!!!>') : []
      var users = names.map(function(item, index, ary) {
        return {
          name: item,
          userId: userIds[index],
          code: index < codes.length ? codes[index] : '',
          id: index < ids.length ? ids[index] : '',
          deptName: index < deps.length ? deps[index] : '',
          roleName: index < roles.length ? roles[index] : ''
        }
      })
      this.selectMembers = users
    } else if (this.$route.query.planManageData) {
      this.categoryId = this.$route.query.planManageData.categoryId
      this.categoryName = this.$route.query.planManageData.categoryName
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    formatTimeStamp() {
      return formatTimeStamp
    },
    taskId() {
      return this.$route.query.taskId
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
