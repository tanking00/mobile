<template>
  <div class="container-main">
    <div class="container-item " style="height: 304px;">
      <div class="title">累计奖励处罚</div>
      <div class="content flex-center">
        <div class="circle-1 flex-center">
          <div class="circle-2 flex-center">
            <div class="circle-3 flex-center">
              <div class="circle-4 flex-center">
                <div class="circle-text">累计奖励处罚</div>
                <div class="circle-num">{{ rewardValue }}<span class="circle-text">人次</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-item" :style="{ height: rewardsLevelHeight }">
      <zEchartPie
        title="奖励级别统计"
        :data="rewardsLevelOptions.data"
        :labelFormatter="rewardsLevelOptions.labelFormatter"
        :tooltipFormatter="rewardsLevelOptions.tooltipFormatter"
        :colors="rewardsLevelOptions.colors"
        :legend="rewardsLevelOptions.legend"
        :center="rewardsLevelOptions.center"
      />
      <div class="no-data" v-if="!rewardsLevelOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item" :style="{ height: awardsHeight }">
      <zEchartPie
        title="奖励奖金统计"
        :data="awardsOptions.data"
        :labelFormatter="awardsOptions.labelFormatter"
        :tooltipFormatter="awardsOptions.tooltipFormatter"
        :colors="awardsOptions.colors"
        :legend="awardsOptions.legend"
        :center="awardsOptions.center"
      />
      <div class="no-data" v-if="!awardsOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item " :style="{ height: height }">
      <zEchartBar
        :series="deptRewardsOptions.series"
        title="部门奖励人次分布"
        :colors="deptRewardsOptions.colors"
        :xAxisData="deptRewardsOptions.xAxisData"
        :legend="deptRewardsOptions.legend"
        :dataZoom="deptRewardsOptions.dataZoom"
        :grid="deptRewardsOptions.grid"
      />
    </div>
  </div>
</template>

<script>
import { zEchartBar, zEchartPie } from '../components'
import {
  getDataMapRewardsAwards,
  getDataMapRewardsDepartmentPerson,
  getDataMapRewardsGrade,
  getDataMapRewardsPerson
} from '@/api/dashboard'
export default {
  components: {
    zEchartBar,
    zEchartPie
  },
  props: {
    year: { type: [Number, String] }
  },
  data() {
    return {
      // 累计奖励表彰
      rewardValue: 0,
      // 奖励级别统计源数据
      rewardsLevelOriginData: [],
      // 奖励奖项统计源数据
      awardsOriginData: [],
      // 部门奖励人次分布源数据
      deptRewardsOriginData: []
    }
  },
  computed: {
    // 奖励级别统计
    rewardsLevelOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      // 数据源
      const originData = this.rewardsLevelOriginData
      const length = originData.length
      if (length > colors.length) {
        const count = length - colors.length
        for (let i = 0; i < count; i++) {
          colors.push(this.randomColor())
        }
      }
      const legend = {
        textStyle: {
          color: '#8C8C8C',
          padding: [0, 0, 0, 2],
          fontSize: 10,
          overflow: 'truncate',
          width: 65
        }
      }
      const center = ['50%', '45%']
      const labelFormatter = '{font|{b}：}\n {font|{c}人}{font|（{d}%）}'
      const tooltipFormatter = '{b}:</br>占比：{d}% </br>人数：{c}'
      return {
        labelFormatter,
        data: originData,
        tooltipFormatter,
        colors,
        legend,
        center
      }
    },
    // 奖励奖项统计
    awardsOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      // 数据源
      const originData = this.awardsOriginData
      const length = originData.length
      if (length > colors.length) {
        const count = length - colors.length
        for (let i = 0; i < count; i++) {
          colors.push(this.randomColor())
        }
      }
      const legend = {
        textStyle: {
          color: '#8C8C8C',
          padding: [0, 0, 0, 2],
          fontSize: 10,
          overflow: 'truncate',
          width: 65
        }
      }
      const center = ['50%', '45%']
      const labelFormatter = '{font|{b}：}\n {font|{c}人}{font|（{d}%）}'
      const tooltipFormatter = '{b}:</br>占比：{d}% </br>人数：{c}'
      return {
        labelFormatter,
        data: originData,
        tooltipFormatter,
        colors,
        legend,
        center
      }
    },
    // 部门奖励人次分布 配置项
    deptRewardsOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.deptRewardsOriginData
      // 柱状图颜色
      let colors = []
      const grid = {
        left: 12,
        right: 12,
        top: 54,
        bottom: 44,
        containLabel: true
      }
      const legend = {
        data: [],
        width: '90%',
        textStyle: {
          color: '#8C8C8C',
          padding: [0, 0, 0, 4],
          fontSize: 10,
          overflow: 'truncate',
          width: 65
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'bar',
        barWidth: 12,
        barGap: 0,
        label: {
          show: false
        }
      }

      if (originData && originData.length) {
        if (originData[0].children && originData[0].children.length) {
          // 颜色码 前三个固定  后面出现的类型 随机颜色
          colors = originData[0].children
            .map((item, index) => {
              const tempColors = ['#ff4141', '#ff7100', '#ffc600', '#39dcac', '#0090ff', '#2044af']
              if (index < tempColors.length) return tempColors[index]
              return this.randomColor()
            })
            .reverse()
          // 配置 柱状图系列
          series = originData[0].children.map((item, index) => {
            // 图例
            legend.data.push(item.name.toString())
            //  柱状图系列
            const obj = {
              name: item.name,
              data: [],
              ...defaultOption,
              stack: 'sum'
            }
            obj.data = originData.map(data => {
              return data.children[index].value
            })
            return obj
          })
        }
        const obj = {
          name: '总数',
          data: [],
          ...defaultOption,
          barGap: '-100%',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15,21,28,.8)',
            padding: 12,
            textStyle: {
              fontSize: 10,
              color: '#fff'
            },
            position: ['30%', '30%'],
            formatter: param => {
              return this.formatTooltip(param, colors)
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            fontSize: 10,
            textStyle: {
              color: '#8C8C8C'
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(128, 128, 128, 0)' // 柱状图颜色设为透明
            }
          }
        }
        originData.forEach(item => {
          // 横坐标 label 数据
          xAxisData.push(item.name)
          // 增加总数
          obj.data.push({ value: item.value, children: item.children })
        })
        series.push(obj)
      }
      // 动态改变高度
      const aotuHeight = Math.ceil(legend.data.length / 3) * 15
      grid.bottom += aotuHeight
      return {
        series,
        colors,
        xAxisData,
        legend,
        grid,
        aotuHeight,
        dataZoom: {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0, // 默认为1
          endValue: 5,
          zoomLock: true
        }
      }
    },
    // 奖励级别统计 容器高度
    rewardsLevelHeight() {
      return 341 + Math.ceil(this.rewardsLevelOriginData.length / 3) * 15 + 'px'
    },
    // 奖励奖项统计 容器高度
    awardsHeight() {
      return 341 + Math.ceil(this.awardsOriginData.length / 3) * 15 + 'px'
    },
    // 部门奖励人次分布 容器高度
    height() {
      return 229 + this.deptRewardsOptions.aotuHeight + 'px'
    }
  },
  watch: {
    year: {
      handler(newValue) {
        // 奖励奖项统计
        this.getDataMapRewardsAwards(newValue)
        // 部门奖励人次分布
        this.getDataMapRewardsDepartmentPerson(newValue)
        // 奖励级别统计
        this.getDataMapRewardsGrade(newValue)
        // 奖励人次
        this.getDataMapRewardsPerson(newValue)
      },
      immediate: true
    }
  },
  methods: {
    // 奖励奖项统计
    async getDataMapRewardsAwards(year) {
      const data = await getDataMapRewardsAwards(year)
      this.awardsOriginData = data
    },
    // 部门奖励人次分布
    async getDataMapRewardsDepartmentPerson(year) {
      const data = await getDataMapRewardsDepartmentPerson(year)
      this.deptRewardsOriginData = data
        .map(item => {
          return {
            name: item.name,
            value: item.value,
            children: item.dataMap
          }
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 奖励级别统计
    async getDataMapRewardsGrade(year) {
      const data = await getDataMapRewardsGrade(year)
      this.rewardsLevelOriginData = data
    },
    // 奖励人次
    async getDataMapRewardsPerson(year) {
      const data = await getDataMapRewardsPerson(year)
      this.rewardValue = data
    },
    // 格式化bar数据
    formatTooltip(param, colors) {
      const reverseColors = JSON.parse(JSON.stringify(colors)).reverse()
      const reverseData = JSON.parse(JSON.stringify(param.data.children)).reverse()
      let str = `<div><div >${param.name}<div>`
      const childDiv = reverseData.map((child, index) => {
        return `<div ><span style="display:inline-block;
                        margin-right:5px;
                        border-radius:8px;
                        width:8px;
                        height:8px;
                        background-color:${reverseColors[index]};
                        "></span> ${child.name}：${child.value}</div>`
      })
      // 长度为 15 一组
      const count = 15
      const group = Math.ceil(childDiv.length / count)
      const doubleDimensional = []
      // 转二维数组
      for (let i = 0; i < group; i++) {
        const length = (i + 1) * count
        if (length < childDiv.length) {
          doubleDimensional.push(childDiv.slice(i * count, length))
        } else {
          doubleDimensional.push(childDiv.slice(i * count, childDiv.length))
        }
      }
      doubleDimensional.forEach(element => {
        str += '<div style="float:left;margin-right:12px;">'
        element.forEach(cell => {
          str += cell
        })
        str += '</div>'
      })
      str += '</div>'
      return str
    },
    randomColor() {
      var r = parseInt(Math.random() * 256)
      var g = parseInt(Math.random() * 256)
      var b = parseInt(Math.random() * 256)
      var rgb = 'rgb(' + r + ',' + g + ',' + b + ')'
      return rgb
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-main {
  padding: 116px 8px 6px;
  .container-item {
    position: relative;
    background: $color-white;
    border-radius: 8px;
    border-radius: 8px;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
    .title {
      padding: 12px 0 0 12px;
      font-weight: bold;
      color: #333;
      font-size: 14px;
    }
    .flex-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .content {
      padding: 0 12px;
      margin-top: 16px;
      .circle-1 {
        width: 240px;
        height: 240px;
        border: 20px solid rgba($color: #f1f3f7, $alpha: 0.3);
        border-radius: 50%;
        .circle-2 {
          width: 201px;
          height: 201px;
          border: 15px solid #008cf9;
          border-radius: 50%;
          .circle-3 {
            width: 166px;
            height: 166px;
            border: 2px solid rgba($color: #008cf9, $alpha: 0.2);
            border-radius: 50%;
            .circle-4 {
              width: 157px;
              height: 157px;
              border: 2px solid rgba($color: #008cf9, $alpha: 0.1);
              border-radius: 50%;
              .circle-text {
                font-size: 14px;
                color: #333;
                line-height: 20px;
              }
              .circle-num {
                font-size: 48px;
                font-weight: bold;
                color: #008cf9;
              }
            }
          }
        }
      }
    }
    .no-data {
      width: 100%;
      height: calc(100% - 40px);
      position: absolute;
      top: 40px;
      z-index: 0;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 14px;
      color: #8c8c8c;
    }
  }
}
</style>
