<!-- 奖励提报-发起 -->
<template>
  <div class="container submit-button-height">
    <van-nav-bar :title="$route.meta.title" left-arrow fixed placeholder @click-left="$router.go(-1)" />
    <div class="container-main padding-all">
      <van-collapse v-model="actives" class="default-collapse">
        <van-collapse-item name="1" title="提报发起信息">
          <template #right-icon>
            <CollapseIcon :isOpen="actives.indexOf('1') >= 0"></CollapseIcon>
          </template>
          <div class="label">发起人员</div>
          <div class="value1">{{ details.submitUserName }}</div>
          <div class="label">发起部门</div>
          <div class="value1">{{ details.submitDeptName }}</div>
          <div class="label">提报发起说明</div>
          <div class="value1">{{ details.description }}</div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <SubmitButton v-if="taskTypeToBeRead" @click="readClik" position="fixed" text="已阅"></SubmitButton>
    <router-link
      v-else
      :to="{
        path: '/safetyReward/library/rewardSubmitAdd'
      }"
    >
      <SubmitButton position="fixed" text="提交"></SubmitButton>
    </router-link>
  </div>
</template>

<script>
import { rewardSubmitsPonsorDetails, readLaunchPropose } from '@/api/safetyReward'
export default {
  name: 'RewardSubmitInitiate',
  data() {
    return {
      actives: ['1'],
      details: {}
    }
  },
  methods: {
    async readClik() {
      if (this.taskTypeToBeRead) {
        await readLaunchPropose(this.$route.query.taskId)
      }
      this.$router.go(-1)
    },
    onClickSubmit() {},
    getDetails() {
      rewardSubmitsPonsorDetails(this.id)
        .then(res => {
          const { data } = res
          this.details = data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getDetails()
  },
  computed: {
    id() {
      return this.$route.query.sponsorId
    },
    isDone() {
      console.log('isDone=', this.$route.query.isDone)
      return this.$route.query.isDone
    },
    taskId() {
      return this.$route.query.taskId
    },
    taskTypeToBeRead() {
      return this.$route.query.taskTypeToBeRead
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
</style>
