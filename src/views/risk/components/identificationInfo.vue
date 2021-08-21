<!-- Created by Tanking. -->
<!-- 危险源辨识评价信息 -->
<template>
  <div>
    <van-button v-if="taskId" plain type="info" block icon="add" hairline class="margin-bottom" @click="onClickAdd"
      >添加</van-button
    >
    <van-collapse v-model="activeNames" class="embedded-collapse">
      <van-collapse-item
        v-for="(item, index) in list"
        :key="item.id"
        :title="item.sourceDanger"
        :icon="taskId ? (item.score ? 'checked' : 'bm-systemVersionabout') : ''"
        :name="index + 1"
        :class="{ evaluated: item.score, notEvaluated: !item.score }"
      >
        <div>
          <div class="text">{{ `危险源：${item.sourceDanger}` }}</div>
          <div class="text">{{ `事故后果：${item.accidentConsequence}` }}</div>
          <div class="text">{{ `控制现状：${item.controlStatus}` }}</div>
          <div v-if="item.manageSystem" class="text">
            相关管理制度：
            <span class="color-blue" v-for="(temp, idx) in JSON.parse(item.manageSystem)" :key="temp.id">
              <i v-if="idx !== 0">、</i>
              <router-link
                :to="{
                  path: '/laws/system/details',
                  query: {
                    id: temp.id
                  }
                }"
              >
                {{ temp.name }}
              </router-link>
            </span>
          </div>
          <div v-if="item.meetPlan" class="text">
            相关应急预案：
            <span class="color-blue" v-for="(temp, idx) in JSON.parse(item.meetPlan)" :key="temp.id">
              <i v-if="idx !== 0">、</i>
              <router-link
                :to="{
                  path: '/emergency/emergencyPrePlanDetails',
                  query: {
                    id: temp.id
                  }
                }"
              >
                {{ temp.name }}
              </router-link>
            </span>
          </div>
          <div v-if="item.score" class="text">风险评价：</div>
          <div v-if="item.score" class="value score">
            <table>
              <thead>
                <tr>
                  <td>L</td>
                  <td>E</td>
                  <td>C</td>
                  <td>
                    D
                    <van-icon
                      name="bm-systemVersionabout"
                      class="icon-size-14 color-text-auxiliary"
                      @click="showTips = true"
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ item.lscore }}</td>
                  <td>{{ item.escore }}</td>
                  <td>{{ item.cscore }}</td>
                  <td>{{ item.score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="taskId" class="wrapper-operation van-hairline--top">
            <div v-if="item.score" class="operation-btn color-auxiliary" @click="onClickEdit(item)">编辑</div>
            <div v-else class="operation-btn color-auxiliary" @click="onClickEvaluate(item)">评价</div>
            <div class="operation-btn color-primary" @click="onClickDel(item, index)">删除</div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <van-dialog v-model="showTips" title="" :showConfirmButton="false" :width="dialogWidth" closeOnClickOverlay>
      <div class="wrapper-tips">
        <div class="cancel-btn">
          <van-icon
            name="bm-systemClose"
            class="icon-size-16 color-text-auxiliary"
            @click="showTips = false"
            close-on-click-overlay
          />
        </div>
        <div class="tips-content">
          LEC评价法是对具有潜在危险性作业环境中的危险源进行半定量的安全评价方法，用于评价操作人员在具有潜在危险性环境中作业时的危险性、危害性。<br /><br />
          该方法用与系统风险有关的三种因素指标值的乘积来评价操作人员伤亡风险大小，这三种因素分别是：L（likelihood，事故发生的可能性）、E（exposure，人员暴露于危险环境中的频繁程度）和C（consequence，一旦发生事故可能造成的后果）。<br /><br />
          给三种因素的不同等级分别确定不同的分值，再以三个分值的乘积D（danger，危险性）来评价作业条件危险性的大小，即：D=L×E×C。<br /><br />
          风险分值D=LEC。D值越大，说明该系统危险性大。<br /><br />
          超过 320 非常高的风险，要停止作业 A <br />
          160 至 320 高风险，需要立即整改 B<br />
          70 至 160 中等风险，需要整改 C<br />
          20 至 70 可能的风险， 需要注意 D<br />
          20 以下 可接受的风险， 容忍 E
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { pxTransform } from '@/utils'
import { delRiskEvaluate } from '@/api/risk'
import { Dialog } from 'vant'

export default {
  name: 'IdentificationInfo',
  components: {},
  props: {
    details: {
      type: Object,
      default() {
        return {}
      }
    },
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames: [],
      showTips: false
    }
  },
  methods: {
    onClickAdd() {
      this.$router.push({
        path: '/risk/identification/infoEntry',
        query: {
          processNumber: this.details.processNumber,
          type: 10
        }
      })
    },
    onClickEvaluate(data) {
      this.$router.push({
        path: '/risk/identification/infoEntry',
        query: {
          processNumber: this.details.processNumber,
          id: data.id,
          type: 20
        }
      })
    },
    onClickEdit(data) {
      this.$router.push({
        path: '/risk/identification/infoEntry',
        query: {
          processNumber: this.details.processNumber,
          id: data.id,
          type: 30
        }
      })
    },
    onClickDel(data, index) {
      Dialog.confirm({
        message: '确认要删除该危险源？'
      })
        .then(() => {
          delRiskEvaluate(data.id)
            .then(res => {
              const idx = this.activeNames.indexOf(index + 1)
              this.activeNames.splice(idx, 1)
              this.list.splice(index, 1)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    }
  },
  created() {},
  mounted() {},
  computed: {
    list() {
      return this.details.evaluatesVOS
    },
    dialogWidth() {
      return pxTransform(350)
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.score {
  table {
    border-radius: 4px;
    width: 100%;
    padding: 0;
    border-collapse: collapse;
    thead {
      tr {
        background: #f8f9fc;
      }
    }
    tbody {
      tr {
        background: $color-white;
        font-size: $font-size-sm;
        color: #666666;
      }
    }
    tr {
      text-align: center;
      width: 100%;
      line-height: 20px;
      vertical-align: middle;
      td {
        width: 25%;
        border: 1px solid #e8e8e8;
        text-align: center;
        min-height: 32px;
        padding: 6px 12px;
      }
    }
  }
}
.wrapper-tips {
  padding: 12px;
  .cancel-btn {
    text-align: right;
  }
  .tips-content {
    padding: 0 14px;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
}
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
</style>
