<template>
  <div class="container-main">
    <div class="container-item" style="height:242px">
      <div class="splitLine"></div>
      <zEchartBar
        class="container-item-echart"
        title="未按时完成责任签署统计"
        :series="undoneSignOptions.series"
        :dataZoom="undoneSignOptions.dataZoom"
        :yAxis="undoneSignOptions.yAxis"
        :xAxis="undoneSignOptions.xAxis"
        :legend="undoneSignOptions.legend"
        :grid="undoneSignOptions.grid"
        :colors="undoneSignOptions.colors"
      />
      <div class="no-data" v-if="!undoneSignOptions.series.length">暂无数据！</div>
    </div>
    <div class="container-item" style="height:242px">
      <div class="splitLine"></div>
      <zEchartBar
        class="container-item-echart"
        title="未按时完成责任制考核统计"
        :series="undoneAssessOptions.series"
        :dataZoom="undoneAssessOptions.dataZoom"
        :yAxis="undoneAssessOptions.yAxis"
        :xAxis="undoneAssessOptions.xAxis"
        :legend="undoneAssessOptions.legend"
        :grid="undoneAssessOptions.grid"
        :colors="undoneAssessOptions.colors"
      />
      <div class="no-data" v-if="!undoneAssessOptions.series.length">暂无数据！</div>
    </div>
    <div class="container-item " style="height:255px;">
      <zEchartBar
        title="安全岗位类型考核平均得分统计"
        :series="averageAssessOptions.series"
        :colors="averageAssessOptions.colors"
        :xAxisData="averageAssessOptions.xAxisData"
        :dataZoom="averageAssessOptions.dataZoom"
        :tooltip="averageAssessOptions.tooltip"
        :legend="averageAssessOptions.legend"
      />
    </div>
    <div class="container-item" style="height:242px;">
      <zEchartBar
        title="各部门考核平均得分统计"
        :series="deptAverageAssessOptions.series"
        :colors="deptAverageAssessOptions.colors"
        :xAxisData="deptAverageAssessOptions.xAxisData"
        :dataZoom="deptAverageAssessOptions.dataZoom"
        :tooltip="deptAverageAssessOptions.tooltip"
        :legend="deptAverageAssessOptions.legend"
      />
      <SelectorDataBtn
        class="container-item-btn"
        @select="deptAverageAssessValue"
        :options="search.deptAverageAssess.options"
        :value="search.deptAverageAssess.value"
      />
    </div>
    <div class="container-item" style="height:341px;">
      <zEchartPie
        title="考核总体失分占比统计"
        :data="punishmentOptions.data"
        :labelFormatter="punishmentOptions.labelFormatter"
        :tooltipFormatter="punishmentOptions.tooltipFormatter"
        :colors="punishmentOptions.colors"
        :legend="punishmentOptions.legend"
      />
      <div class="no-data" v-if="!punishmentOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item" style="height:341px;">
      <zEchartPie
        title="各人员层级考核失分占比统计"
        :data="hierarchyOptions.data"
        :labelFormatter="hierarchyOptions.labelFormatter"
        :tooltipFormatter="hierarchyOptions.tooltipFormatter"
        :colors="hierarchyOptions.colors"
        :legend="hierarchyOptions.legend"
      />
      <SelectorDataBtn
        class="container-item-btn"
        @select="hierarchyValue"
        :options="search.hierarchy.options"
        :value="search.hierarchy.value"
      />
      <div class="no-data" v-if="!hierarchyOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item" style="height:341px;">
      <zEchartPie
        title="各考核单项失分占比统计"
        :data="singleOptions.data"
        :labelFormatter="singleOptions.labelFormatter"
        :tooltipFormatter="singleOptions.tooltipFormatter"
        :colors="singleOptions.colors"
        :legend="singleOptions.legend"
      />
      <SelectorDataBtn
        class="container-item-btn"
        @select="singleValue"
        :options="search.single.options"
        :value="search.single.value"
      />
      <div class="no-data" v-if="!singleOptions.data.length">暂无数据！</div>
    </div>
  </div>
</template>

<script>
import { zEchartBar, SelectorDataBtn, zEchartPie } from '../components'
import {
  getDictOfCode,
  getDataMapDuty,
  getDataMapDutyAssess,
  getDataMapDutAverages,
  getDataMapDutBranchCount,
  getDataMapDutIndividualEventCount,
  getDataMapDutLosePoint,
  getDataMapDutPersonnelCount
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
      //  考核总体失分占比统计数据源
      punishmentOriginData: [],
      // 各人员层级考核失分占比统计数据源
      hierarchyOriginData: [],
      // 考核单项失分占比统计数据源
      singleOriginData: [],
      // 未按时完成责任 签署 统计数据源
      undoneSignOriginData: [],
      // 未按时完成责任 签署 考核统计数据源
      undoneAssessOriginData: [],
      // 考核总体平均得分统计数据源
      averageAssessOriginData: [],
      // 各部门考核平均得分统计数据源
      deptAverageAssessOriginData: [],
      search: {
        // 隐患整改统计
        deptAverageAssess: {
          value: '1',
          options: [
            { text: '分/子公司', value: '1' },
            { text: '部门', value: '2' }
          ]
        },
        hierarchy: {
          value: null,
          options: []
        },
        single: {
          value: null,
          options: []
        }
      }
    }
  },
  computed: {
    // 考核总体 平均 得分统计
    averageAssessOptions() {
      // 图表
      const series = []
      // 横坐标 label
      let xAxisData = []
      // 数据源
      const originData = this.averageAssessOriginData
      // 柱状图颜色
      const colors = ['#7FC5FC']
      const legend = {
        textStyle: {
          color: '#8c8c8c',
          fontSize: 10
        }
      }
      //  格式化提示框
      const tooltip = {
        trigger: 'axis',
        backgroundColor: 'rgba(15,21,28,.8)',
        padding: 12,
        borderWidth: 0,
        textStyle: {
          fontSize: 10,
          color: '#fff'
        },
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: parms => {
          return `${parms[0].name}<br/>平均分：${parms[0].value}`
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        barWidth: 14,
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
        // 柱状图配置项
        const obj = {
          data: [],
          ...defaultOption
        }
        // let total = 0
        // originData.forEach(item => {
        //   total += item.value
        // })
        // const average = Number((total / originData.length).toFixed(1))
        const average = originData[0].total
        obj.name = '总体平均分' + '：' + average + '分'
        obj.data = originData.map(item => {
          const childObj = {
            value: item.value,
            average: average,
            itemStyle: {},
            children: item.children
          }
          if (item.value < average) {
            childObj.itemStyle.color = '#ff1f34'
          } else {
            childObj.itemStyle.color = '#008CF9'
          }
          return childObj
        })
        obj.markArea = {
          data: [
            [
              {
                yAxis: 0
              },
              {
                yAxis: average
              }
            ]
          ],
          silent: true,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                // 上->下
                {
                  offset: 0.07,
                  color: 'rgba(0,140,249,0.2)' // 0% 处的颜色
                },
                {
                  offset: 0.98,
                  color: 'rgba(0,140,249,0)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
        series.push(obj)
        // 横坐标 label 数据
        xAxisData = originData.map(item => {
          return item.name
        })
      }
      return {
        series,
        colors,
        tooltip,
        xAxisData,
        legend,
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
    // 各部门考核平均得分统计
    deptAverageAssessOptions() {
      // 图表
      const series = []
      // 横坐标 label
      let xAxisData = []
      // 数据源
      const originData = this.deptAverageAssessOriginData
      // 柱状图颜色
      const colors = ['#7FC5FC']
      const legend = {
        textStyle: {
          color: '#8c8c8c',
          fontSize: 10
        }
      }
      //  格式化提示框
      const tooltip = {
        trigger: 'axis',
        backgroundColor: 'rgba(15,21,28,.8)',
        padding: 12,
        borderWidth: 0,
        textStyle: {
          fontSize: 10,
          color: '#fff'
        },
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: parms => {
          return `${parms[0].name}<br/>平均分：${parms[0].value}`
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        barWidth: 14,
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
        // 柱状图配置项
        const obj = {
          data: [],
          ...defaultOption
        }
        // let total = 0
        // originData.forEach(item => {
        //   total += item.value
        // })
        // const average = Number((total / originData.length).toFixed(1))
        const average = originData[0].total
        obj.name = '总体平均分' + '：' + average + '分'
        obj.data = originData.map(item => {
          const childObj = {
            value: item.value,
            average: average,
            itemStyle: {},
            children: item.children
          }
          if (item.value < average) {
            childObj.itemStyle.color = '#ff1f34'
          } else {
            childObj.itemStyle.color = '#008CF9'
          }
          return childObj
        })
        obj.markArea = {
          data: [
            [
              {
                yAxis: 0
              },
              {
                yAxis: average
              }
            ]
          ],
          silent: true,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                // 上->下
                {
                  offset: 0.07,
                  color: 'rgba(0,140,249,0.2)' // 0% 处的颜色
                },
                {
                  offset: 0.98,
                  color: 'rgba(0,140,249,0)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
        series.push(obj)
        // 横坐标 label 数据
        xAxisData = originData.map(item => {
          return item.name
        })
      }
      return {
        series,
        colors,
        tooltip,
        xAxisData,
        legend,
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
    // 未按时完成责任签署统计
    undoneSignOptions() {
      // 图表
      const series = []
      const fontSize = 10
      // 数据源
      const originData = this.undoneSignOriginData
      const colors = ['#0090FF']
      const legend = {
        show: false
      }
      const grid = {
        left: 16,
        right: 16,
        top: 55,
        bottom: 12,
        containLabel: true
      }
      const xAxis = {
        type: 'value',
        show: true,
        axisTick: {
          show: false
        },
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#8C8C8C',
          fontSize: fontSize
        },
        axisLine: {
          lineStyle: {
            color: '#8C8C8C' // X轴颜色
          }
        }
      }
      const yAxis = {
        type: 'category',
        data: originData.map(item => {
          return item.name
        }),
        splitLine: {
          show: false
        },
        inverse: true,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'bar',
        barWidth: 10,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontSize: fontSize,
          textStyle: {
            color: '#8C8C8C'
          }
        }
      }
      if (originData && originData.length) {
        const obj = {
          data: [],
          name: 'value',
          ...defaultOption,
          label: {
            show: false
          },
          z: 2,
          tooltip: { show: false }
        }
        obj.data = originData.map((item, index) => {
          const childObj = {
            value: item.value,
            itemStyle: {}
          }
          if (index === 0) {
            childObj.itemStyle.color = '#ff4141'
          }
          if (index === 1) {
            childObj.itemStyle.color = '#ff7100'
          }
          if (index === 2) {
            childObj.itemStyle.color = '#ffc600'
          }
          return childObj
        })
        xAxis.max =
          Math.max(
            ...originData.map(item => {
              return item.value
            })
          ) || 1
        series.push(obj)
        series.push({
          name: 'label',
          type: 'bar',
          barWidth: 10,
          z: 0,
          tooltip: {
            show: false
          },
          label: {
            show: true,
            position: 'top',
            offset: [0, 0],
            color: '#8C8C8C',
            fontSize: fontSize,
            align: 'left'
          },
          data: originData.map(item => {
            return {
              value: 0,
              label: {
                formatter() {
                  return item.name
                }
              }
            }
          })
        })
        series.push({
          name: '总数',
          ...defaultOption,
          barGap: '-100%',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15,21,28,.8)',
            padding: 12,
            textStyle: {
              fontSize: fontSize,
              color: '#fff'
            },
            formatter: parms => {
              let str = `${parms.name}<br/>`
              parms.data.data.children.forEach((item, index) => {
                str += item.name + '：' + item.value
                if (index !== parms.data.data.children.length - 1) {
                  str += '</br>'
                }
              })
              return str
            }
          },
          z: 5,
          data: originData.map(item => {
            return {
              value: xAxis.max,
              data: item,
              name: item.name,
              itemStyle: { color: 'rgba(255,255,255,0)', borderRadius: [0, 2, 2, 0] },
              label: {
                position: 'insideTopRight',
                fontSize: fontSize,
                offset: [0, -20],
                align: 'right',
                color: '#8C8C8C',
                formatter(param) {
                  return `总数：${param.data.data.value}`
                }
              }
            }
          })
        })
        series.push({
          name: '遮罩',
          ...defaultOption,
          barGap: '-100%',
          z: 1,
          data: originData.map(item => {
            return {
              value: xAxis.max,
              itemStyle: { color: '#F1F3F7', borderRadius: [0, 2, 2, 0] },
              label: {
                show: false
              }
            }
          })
        })
      }
      return {
        series,
        colors,
        yAxis,
        xAxis,
        legend,
        grid,
        dataZoom: [
          {
            type: 'inside',
            show: true,
            yAxisIndex: [0],
            startValue: 0, // 默认为1
            endValue: 3,
            zoomLock: true
          }
        ]
      }
    },
    // 未按时完成责任制考核统计
    undoneAssessOptions() {
      // 图表
      const series = []
      const fontSize = 10
      // 数据源
      const originData = this.undoneAssessOriginData
      const colors = ['#0090FF']
      const legend = {
        show: false
      }
      const grid = {
        left: 16,
        right: 16,
        top: 55,
        bottom: 12,
        containLabel: true
      }
      const xAxis = {
        type: 'value',
        show: true,
        axisTick: {
          show: false
        },
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#8C8C8C',
          fontSize: fontSize
        },
        axisLine: {
          lineStyle: {
            color: '#8C8C8C' // X轴颜色
          }
        }
      }
      const yAxis = {
        type: 'category',
        data: originData.map(item => {
          return item.name
        }),
        splitLine: {
          show: false
        },
        inverse: true,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'bar',
        barWidth: 10,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontSize: fontSize,
          textStyle: {
            color: '#8C8C8C'
          }
        }
      }
      if (originData && originData.length) {
        const obj = {
          data: [],
          name: 'value',
          ...defaultOption,
          label: {
            show: false
          },
          z: 2,
          tooltip: { show: false }
        }
        obj.data = originData.map((item, index) => {
          const childObj = {
            value: item.value,
            itemStyle: {}
          }
          if (index === 0) {
            childObj.itemStyle.color = '#ff4141'
          }
          if (index === 1) {
            childObj.itemStyle.color = '#ff7100'
          }
          if (index === 2) {
            childObj.itemStyle.color = '#ffc600'
          }
          return childObj
        })
        xAxis.max =
          Math.max(
            ...originData.map(item => {
              return item.value
            })
          ) || 1
        series.push(obj)
        series.push({
          name: 'label',
          type: 'bar',
          barWidth: 10,
          z: 0,
          tooltip: {
            show: false
          },
          label: {
            show: true,
            position: 'top',
            offset: [0, 0],
            color: '#8C8C8C',
            fontSize: fontSize,
            align: 'left'
          },
          data: originData.map(item => {
            return {
              value: 0,
              label: {
                formatter() {
                  return item.name
                }
              }
            }
          })
        })
        series.push({
          name: '总数',
          ...defaultOption,
          barGap: '-100%',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15,21,28,.8)',
            padding: 12,
            textStyle: {
              fontSize: fontSize,
              color: '#fff'
            },
            formatter: parms => {
              let str = `${parms.name}<br/>`
              parms.data.data.children.forEach((item, index) => {
                str += item.name + '：' + item.value
                if (index !== parms.data.data.children.length - 1) {
                  str += '</br>'
                }
              })
              return str
            }
          },
          z: 5,
          data: originData.map(item => {
            console.log(item)
            return {
              value: xAxis.max,
              data: item,
              name: item.name,
              itemStyle: { color: 'rgba(255,255,255,0)', borderRadius: [0, 2, 2, 0] },
              label: {
                position: 'insideTopRight',
                fontSize: fontSize,
                offset: [0, -20],
                align: 'right',
                color: '#8C8C8C',
                formatter(param) {
                  return `总数：${param.data.data.value}`
                }
              }
            }
          })
        })
        series.push({
          name: '遮罩',
          ...defaultOption,
          barGap: '-100%',
          z: 1,
          data: originData.map(item => {
            return {
              value: xAxis.max,
              itemStyle: { color: '#F1F3F7', borderRadius: [0, 2, 2, 0] },
              label: {
                show: false
              }
            }
          })
        })
      }
      return {
        series,
        colors,
        yAxis,
        xAxis,
        legend,
        grid,
        dataZoom: [
          {
            type: 'inside',
            show: true,
            yAxisIndex: [0],
            startValue: 0, // 默认为1
            endValue: 3,
            zoomLock: true
          }
        ]
      }
    },
    // 考核总体失分占比统计
    punishmentOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      const length = this.punishmentOriginData.length
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
      const labelFormatter = '{font|{b}：}\n {font|{c}分}{font|（{d}%）}'
      const tooltipFormatter = '{b}:</br>占比：{d}% </br>分数：{c}'
      return {
        labelFormatter,
        data: this.punishmentOriginData,
        tooltipFormatter,
        colors,
        legend
      }
    },
    // 各人员层级考核失分占比统计
    hierarchyOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      const length = this.hierarchyOriginData.length
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
      const labelFormatter = '{font|{b}：}\n {font|{c}分}{font|（{d}%）}'
      const tooltipFormatter = '{b}:</br>占比：{d}% </br>分数：{c}'
      return {
        labelFormatter,
        data: this.hierarchyOriginData,
        tooltipFormatter,
        colors,
        legend
      }
    },
    // 各考核单项失分占比统计
    singleOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      const length = this.singleOriginData.length
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
      const labelFormatter = '{font|{b}：}\n {font|{c}分}{font|（{d}%）}'
      const tooltipFormatter = '{b}:</br>占比：{d}% </br>分数：{c}'
      return {
        labelFormatter,
        data: this.singleOriginData,
        tooltipFormatter,
        colors,
        legend
      }
    }
  },
  watch: {
    year: {
      handler(newValue) {
        // 未按时完成责任书签署统计
        this.getDataMapDuty(newValue)
        // 未按时完成责任制考核统计
        this.getDataMapDutyAssess(newValue)
        // 考核总体平均得分统计
        this.getDataMapDutAverages(newValue)
        // 各部门考核平均得分统计
        this.getDataMapDutBranchCount(newValue, this.search.deptAverageAssess.value)
        // 考核总体失分占比统计
        this.getDataMapDutLosePoint(newValue)
        // 各人员层级考核失分占比统计
        if (this.search.hierarchy.value) {
          this.getDataMapDutPersonnelCount(newValue, this.search.hierarchy.value)
        }
        // 各考核单项失分占比统计
        if (this.search.single.value) {
          this.getDataMapDutIndividualEventCount(newValue, this.search.single.value)
        }
      },
      immediate: true
    },
    // 各部门考核平均分
    'search.deptAverageAssess.value': {
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.getDataMapDutBranchCount(this.year, newValue)
        }
      },
      immediate: true
    },
    // 各人员层级考核失分占比统计
    'search.hierarchy.value': {
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.getDataMapDutPersonnelCount(this.year, newValue)
        }
      },
      immediate: true
    },
    // 各考核单项失分占比统计
    'search.single.value': {
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.getDataMapDutIndividualEventCount(this.year, newValue)
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取各层级类型
    this.getDict('duty_safety_job', 'hierarchy')
    // 获取各项考核
    this.getDict('duty_target_first', 'single')
  },
  methods: {
    async getDict(code, key) {
      // code  duty_safety_job 各层级   duty_target_first 各项考核
      // 获取数据字典
      const res = await getDictOfCode(code)
      this.search[key].options = res.data.map(item => {
        return { text: item.label, value: item.value }
      })
      if (this.search[key].options.length) {
        this.search[key].value = this.search[key].options[0].value
      }
    },
    // 未按时完成责任书签署统计
    async getDataMapDuty(time) {
      const data = await getDataMapDuty(time)
      this.undoneSignOriginData = data
        .map(item => {
          return {
            value: item.value,
            name: item.name,
            children: item.dataMap
          }
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 未按时完成责任制考核统计
    async getDataMapDutyAssess(time) {
      const data = await getDataMapDutyAssess(time)
      this.undoneAssessOriginData = data
        .map(item => {
          return {
            value: item.value,
            name: item.name,
            children: item.dataMap
          }
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 考核总体平均得分统计
    async getDataMapDutAverages(time) {
      const data = await getDataMapDutAverages(time)
      this.averageAssessOriginData = data
    },
    // 各部门考核平均得分统计
    async getDataMapDutBranchCount(time, type) {
      const data = await getDataMapDutBranchCount(time, type)
      this.deptAverageAssessOriginData = data
    },
    // 各考核单项失分占比统计
    async getDataMapDutIndividualEventCount(time, value) {
      const data = await getDataMapDutIndividualEventCount(time, value)
      this.singleOriginData =
        data
          .sort((a, b) => {
            return b.value - a.value
          })
          .filter(item => {
            return item.value > 0
          }) || []
    },
    // 考核总体失分占比统计
    async getDataMapDutLosePoint(time) {
      const data = await getDataMapDutLosePoint(time)
      // 这里把数据为0的过滤掉   UI要求
      this.punishmentOriginData =
        data
          .sort((a, b) => {
            return b.value - a.value
          })
          .filter(item => {
            return item.value > 0
          }) || []
    },
    // 各人员层级考核失分占比统计
    async getDataMapDutPersonnelCount(time, type) {
      this.hierarchyOriginData = []
      const data = await getDataMapDutPersonnelCount(time, type)
      this.hierarchyOriginData =
        data
          .sort((a, b) => {
            return b.value - a.value
          })
          .filter(item => {
            return item.value > 0
          }) || []
    },
    // 部门平均分 条件选择
    deptAverageAssessValue(obj) {
      this.search.deptAverageAssess.value = obj.value
    },
    // 各人员层级  条件选择
    hierarchyValue(obj) {
      this.search.hierarchy.value = obj.value
    },
    // 各考核单项失分占比
    singleValue(obj) {
      this.search.single.value = obj.value
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
