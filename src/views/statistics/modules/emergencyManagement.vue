<template>
  <div class="container-main">
    <div class="container-item" :style="{ height: personnelHeight }">
      <zEchartPie
        title="应急人员占比"
        :data="personnelOptions.data"
        :labelFormatter="personnelOptions.labelFormatter"
        :tooltipFormatter="personnelOptions.tooltipFormatter"
        :colors="personnelOptions.colors"
        :legend="personnelOptions.legend"
        :center="personnelOptions.center"
      />
      <div class="no-data" v-if="!personnelOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item" :style="{ height: materialsHeight }">
      <zEchartPie
        title="应急物资占比"
        :data="materialsOptions.data"
        :labelFormatter="materialsOptions.labelFormatter"
        :tooltipFormatter="materialsOptions.tooltipFormatter"
        :colors="materialsOptions.colors"
        :legend="materialsOptions.legend"
        :center="materialsOptions.center"
      />
      <div class="no-data" v-if="!materialsOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item" style="height:225px">
      <zEchartBar
        class="container-item-echart"
        style="height:225px"
        title="应急演练次数"
        :series="exerciseTimeOptions.series"
        :colors="exerciseTimeOptions.colors"
        :xAxisData="exerciseTimeOptions.xAxisData"
        :dataZoom="exerciseTimeOptions.dataZoom"
        :yAxis="exerciseTimeOptions.yAxis"
        :grid="exerciseTimeOptions.grid"
      />
      <SelectorDataBtn
        class="container-item-btn"
        @select="selectExerciseTimeValue"
        :options="options"
        :value="search.exerciseTime.value"
      />
    </div>
    <div class="container-item " :style="{ height: height }">
      <zEchartBar
        :series="planOptions.series"
        title="应急预案统计"
        :colors="planOptions.colors"
        :xAxisData="planOptions.xAxisData"
        :legend="planOptions.legend"
        :dataZoom="planOptions.dataZoom"
        :grid="planOptions.grid"
      />
      <SelectorDataBtn
        class="container-item-btn"
        @select="selectPlanValue"
        :options="options"
        :value="search.plan.value"
      />
    </div>
  </div>
</template>

<script>
import { zEchartBar, SelectorDataBtn, zEchartPie } from '../components'
import {
  getEmergencyPersonnelRatio,
  getEmergencyMaterialsRatio,
  getEmergencyDrillTime,
  getEmergencyPlan
} from '@/api/dashboard'
export default {
  components: {
    zEchartBar,
    SelectorDataBtn,
    zEchartPie
  },
  props: {
    year: { type: [Number, String] }
  },
  data() {
    return {
      // 应急演练次数源数据
      exerciseTimeOriginData: [],
      // 应急人员占比 源数据
      personnelOriginData: [],
      // 物资占比源数据
      materialsOriginData: [],
      // 应急预案统计数据源
      planOriginData: [],
      search: {
        // 应急演练次数
        exerciseTime: {
          value: '1'
        },
        // 应急预案
        plan: {
          value: '1'
        }
      },
      options: [
        { text: '分/子公司', value: '1' },
        { text: '部门', value: '2' }
      ]
    }
  },
  computed: {
    // 应急人员占比 容器高度
    personnelHeight() {
      return 341 + Math.floor(this.personnelOriginData.length / 3) * 10 + 'px'
    },
    // 应急物资占比 容器高度
    materialsHeight() {
      return 341 + Math.floor(this.materialsOriginData.length / 3) * 10 + 'px'
    },
    // 部门奖励人次分布 容器高度
    height() {
      return 229 + this.planOptions.aotuHeight + 'px'
    },
    // 应急演练次数配置项
    exerciseTimeOptions() {
      // 图表
      let series = []
      // 横坐标 label
      let xAxisData = []
      //  纵坐标
      const yAxis = { show: false }
      // 网格配置
      const grid = {
        left: 12,
        right: 12,
        top: 70,
        bottom: 40,
        containLabel: true
      }
      // 数据源
      const originData = this.exerciseTimeOriginData
      // 柱状图颜色
      const colors = ['rgba(0,144,255,0.2)', '#0090ff']
      // 默认配置
      const defaultOption = {
        type: 'bar',
        barWidth: 12,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontSize: 12,
          textStyle: {
            color: '#8C8C8C'
          }
        }
      }

      if (originData && originData.length) {
        // 横坐标 label 数据
        xAxisData = originData.map(item => {
          return item.name
        })
        if (originData[0].children && originData[0].children.length) {
          series = originData[0].children.map((item, index) => {
            const obj = {
              name: item.name,
              data: [],
              ...defaultOption,
              barGap: '-100%',
              tooltip: {
                show: false
              },
              z: item.name === '计划演练次数' ? 1 : 0
            }
            if (item.name === '计划演练次数') {
              obj.markLine = {
                silent: true,
                lineStyle: {
                  type: 'solid',
                  color: '#eee'
                },
                symbol: 0,
                data: [{ yAxis: 0 }],
                label: { show: false }
              }
              obj.tooltip = {
                trigger: 'item',
                backgroundColor: 'rgba(15,21,28,.8)',
                padding: 12,
                textStyle: {
                  fontSize: 10,
                  color: '#fff'
                },
                formatter: param => {
                  const data = originData[param.dataIndex].children
                  let str = param.name + '</br>'
                  data.forEach((item, index) => {
                    str += item.name + '：' + item.value
                    if (index !== data.length - 1) {
                      str += '</br>'
                    }
                  })
                  return str
                }
              }
            }
            obj.data = originData.map(data => {
              return data.children[index].value
            })
            return obj
          })
        }
      }
      return {
        series,
        colors,
        xAxisData,
        yAxis,
        grid,
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
    // 应急人员占比
    personnelOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      // 数据源
      const originData = this.personnelOriginData
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
      const labelFormatter = '{font|{b}：}\n {font|{c}}{font|（{d}%）}'
      const tooltipFormatter = '{b}:</br>占比：{d}% </br>数量：{c}'
      const center = ['50%', '45%']
      return {
        labelFormatter,
        data: originData,
        tooltipFormatter,
        colors,
        legend,
        center
      }
    },
    // 应急物资占比
    materialsOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      // 数据源
      const originData = this.materialsOriginData
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
      const labelFormatter = '{font|{b}：}\n {font|{c}}{font|（{d}%）}'
      const tooltipFormatter = '{b}:</br>占比：{d}% </br>数量：{c}'
      return {
        labelFormatter,
        data: originData,
        tooltipFormatter,
        colors,
        legend,
        center
      }
    },
    // 应急预案统计配置项
    planOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.planOriginData
      // 柱状图颜色
      let colors = []
      const legend = { data: [] }
      const grid = {
        left: 12,
        right: 12,
        top: 54,
        bottom: 24,
        containLabel: true
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
          colors = originData[0].children.map((item, index) => {
            const tempColors = ['#ffc600', '#39dcac', '#0090ff']
            if (index < tempColors.length) return tempColors[index]
            return this.randomColor()
          })
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
      const aotuHeight = Math.floor(legend.data.length / 3) * 10
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
    }
  },
  watch: {
    year: {
      handler(newValue) {
        // 应急人员占比
        this.getEmergencyPersonnelRatio(newValue)
        // 应急物资占比
        this.getEmergencyMaterialsRatio(newValue)
        // 应急演练次数
        this.getEmergencyDrillTime(newValue, this.search.exerciseTime.value)
        // 应急预案
        this.getEmergencyPlan(newValue, this.search.plan.value)
      },
      immediate: true
    },
    'search.exerciseTime.value': {
      handler(newValue) {
        // 应急演练次数
        this.getEmergencyDrillTime(this.year, newValue)
      }
    },
    'search.plan.value': {
      handler(newValue) {
        // 应急预案
        this.getEmergencyPlan(this.year, newValue)
      }
    }
  },
  methods: {
    // 应急人员占比
    async getEmergencyPersonnelRatio(time) {
      const data = await getEmergencyPersonnelRatio(time)
      this.personnelOriginData = data
    },
    // 应急物资
    async getEmergencyMaterialsRatio(time) {
      const data = await getEmergencyMaterialsRatio(time)
      this.materialsOriginData = data
    },
    // 应急演练次数
    async getEmergencyDrillTime(time, sign) {
      const data = await getEmergencyDrillTime(time, sign)
      this.exerciseTimeOriginData = data
        .map(item => {
          const obj = { name: item.name, children: [] }
          obj.children.push({ value: item.planDrill, name: '计划演练次数' })
          obj.children.push({ value: item.actualDrill, name: '实际演练次数' })
          return obj
        })
        .sort((a, b) => {
          return b.children[1].value - a.children[1].value
        })
    },
    // 应急预案
    async getEmergencyPlan(time, sign) {
      const data = await getEmergencyPlan(time, sign)
      this.planOriginData = data
        .map(item => {
          const obj = { name: item.name, children: [], value: 0 }
          obj.children = item.plans.map(element => {
            obj.value += element.planNumber
            return {
              name: element.planName,
              value: element.planNumber
            }
          })
          return obj
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 选中应急演练次数的查询条件
    selectExerciseTimeValue(obj) {
      this.search.exerciseTime.value = obj.value
    },
    selectPlanValue(obj) {
      this.search.plan.value = obj.value
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
    &-echart {
      position: absolute;
      width: 100%;
      z-index: 0;
    }
    &-btn {
      position: absolute;
      z-index: 0;
      right: 12px;
      top: 12px;
    }
    .splitLine {
      position: absolute;
      bottom: 36px;
      left: 16px;
      width: calc(100% - 32px);
      border-bottom: 1px solid #eee;
      z-index: 0;
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
