<template>
  <div class="container-main">
    <div class="container-item" style="height: 255px;">
      <zEchartBar
        :series="yearlyCheckOptions.series"
        :dataZoom="yearlyCheckOptions.dataZoom"
        title="安全检查类型统计"
        :colors="yearlyCheckOptions.colors"
        :xAxisData="yearlyCheckOptions.xAxisData"
        :legend="yearlyCheckOptions.legend"
        :tooltip="yearlyCheckOptions.tooltip"
      />
    </div>
    <div class="container-item" style="height:242px;">
      <zEchartBar
        :series="workingAreaOptions.series"
        title="安全检查工作区域统计"
        :colors="workingAreaOptions.colors"
        :dataZoom="workingAreaOptions.dataZoom"
        :yAxis="workingAreaOptions.yAxis"
        :xAxis="workingAreaOptions.xAxis"
        :legend="workingAreaOptions.legend"
        :grid="workingAreaOptions.grid"
      />
      <div class="splitLine"></div>
    </div>
    <div class="container-item" style="height: 255px;">
      <zEchartBar
        :series="securityCheckOptions.series"
        :dataZoom="securityCheckOptions.dataZoom"
        title="安全检查部门统计"
        :colors="securityCheckOptions.colors"
        :xAxisData="securityCheckOptions.xAxisData"
        :legend="securityCheckOptions.legend"
        :tooltip="securityCheckOptions.tooltip"
      />
      <SelectorDataBtn
        class="container-item-btn"
        @select="selectSecurityCheckValue"
        :options="options"
        :value="search.securityCheck.value"
      />
    </div>
  </div>
</template>

<script>
import { zEchartBar, SelectorDataBtn } from '../components'
import { getDataMapSecurityCheck, getDataMapSecurityCheckWorkArea, getDataMapSecurityCheckCount } from '@/api/dashboard'
export default {
  components: {
    zEchartBar,
    SelectorDataBtn
  },
  props: {
    year: { type: [Number, String] }
  },
  data() {
    return {
      // 工作区域安全检查统计源数据
      workingAreaOriginData: [],
      // 全年安全检查统计源数据
      yearlyCheckOriginData: [],
      // 安全检查统计源数据
      securityCheckOriginData: [],
      search: {
        // 安全检查类型统计
        securityCheck: {
          value: '1'
        }
      },
      options: [
        { text: '分/子公司', value: '1' },
        { text: '部门', value: '2' }
      ],
      tempColors: [
        '#ff4141',
        '#ff7100',
        '#ffc600',
        '#39dcac',
        '#0090ff',
        '#2044af',
        'rgb(248,249,126)',
        'rgb(1,136,44)',
        'rgb(40,135,142)',
        'rgb(235,11,73)',
        'rgb(235,133,116)',
        'rgb(116,115,4)',
        'rgb(171,33,25)',
        'rgb(14,89,194)',
        'rgb(11,148,60)',
        'rgb(131,225,185)',
        'rgb(232,228,53)',
        'rgb(242,78,81)',
        'rgb(26,39,19)',
        'rgb(235,31,200)',
        'rgb(10,154,163)',
        'rgb(125,44,136)',
        'rgb(67,170,141)',
        'rgb(1,145,20)',
        'rgb(28,63,169)'
      ]
    }
  },
  computed: {
    // 安全检查类型统计 柱状图配置项
    yearlyCheckOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.yearlyCheckOriginData
      // 柱状图颜色
      const colors = ['#0090ff', '#ff4141']
      const legend = {}
      const tooltip = {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,.8)',
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
          return `<div style="font-size:10px;"><h2 style="margin-bottom:6px;">${parms[0].axisValue}</h2>
           <p style="margin-bottom:6px;">${parms[0].marker} ${parms[0].seriesName}: ${parms[0].data}</p>
           <p >${parms[1].marker} ${parms[1].seriesName}: ${parms[1].data}</p></div>`
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'bar',
        barWidth: 8,
        barGap: 0,
        label: {
          show: false
        }
      }

      if (originData && originData.length) {
        if (originData[0].children && originData[0].children.length) {
          // 图例
          legend.data = originData[0].children.map(item => {
            return item.name.toString()
          })
          // 配置 柱状图系列
          series = originData[0].children.map((item, index) => {
            const obj = {
              name: item.name,
              data: [],
              ...defaultOption
            }
            obj.data = originData.map(data => {
              return data.children[index].value
            })
            return obj
          })
        }
        originData.forEach(item => {
          // 横坐标 label 数据
          xAxisData.push(item.name)
        })
      }
      return {
        series,
        colors,
        xAxisData,
        tooltip,
        legend,
        dataZoom: {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0, // 默认为1
          endValue: 4, // 柱状图固定最多显示数量 0开始
          zoomLock: true
        }
      }
    },
    // 安全检查工作区域统计
    workingAreaOptions() {
      // 图表
      let series = []
      const fontSize = 10
      // 数据源
      const originData = this.workingAreaOriginData
      let colors = []
      const legend = {
        show: false
      }
      const grid = {
        left: 16,
        right: 16,
        top: 45,
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
          fontSize: fontSize,
          padding: [0, 0, 0, 6]
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
        // 颜色码 前三个固定  后面出现的类型 随机颜色
        colors = originData[0].children.map((item, index) => {
          // const tempColors = ['#ff4141', '#ff7100', '#ffc600', '#39dcac', '#0090ff', '#2044af']

          if (index < this.tempColors.length) return this.tempColors[index]
          return this.randomColor()
        })
        // 配置 柱状图系列
        series = originData[0].children.map((item, index) => {
          const obj = {
            name: item.name,
            data: [],
            ...defaultOption,
            stack: 'sum',
            label: {
              show: false
            },
            itemStyle: { color: colors[item.levle - 1] }
          }
          if (index === originData[0].children.length - 1) {
            obj.itemStyle.borderRadius = [0, 2, 2, 0]
          }
          obj.data = originData.map(data => {
            return data.children[index].value
          })
          return obj
        })

        xAxis.max =
          Math.max(
            ...originData.map(item => {
              return item.value
            })
          ) || 1
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
            formatter: param => {
              return this.formatTooltip(param.data, colors)
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
            endValue: 4,
            zoomLock: true
          }
        ]
      }
    },
    // 安全检查部门统计 柱状图配置项
    securityCheckOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.securityCheckOriginData
      // 柱状图颜色
      const colors = ['#0090ff', '#ff4141']
      const legend = {}
      const tooltip = {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,.8)',
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
          return `<div style="font-size:10px;"><h2 style="margin-bottom:6px;">${parms[0].axisValue}</h2>
           <p style="margin-bottom:6px;">${parms[0].marker} ${parms[0].seriesName}: ${parms[0].data}</p>
           <p >${parms[1].marker} ${parms[1].seriesName}: ${parms[1].data}</p></div>`
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'bar',
        barWidth: 8,
        barGap: 0,
        label: {
          show: false
        }
      }

      if (originData && originData.length) {
        if (originData[0].children && originData[0].children.length) {
          // 图例
          legend.data = originData[0].children.map(item => {
            return item.name.toString()
          })
          // 配置 柱状图系列
          series = originData[0].children.map((item, index) => {
            const obj = {
              name: item.name,
              data: [],
              ...defaultOption
            }
            obj.data = originData.map(data => {
              return data.children[index].value
            })
            return obj
          })
        }
        originData.forEach(item => {
          // 横坐标 label 数据
          xAxisData.push(item.name)
        })
      }
      return {
        series,
        colors,
        xAxisData,
        tooltip,
        legend,
        dataZoom: {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0, // 默认为1
          endValue: 4, // 柱状图固定最多显示数量 0开始
          zoomLock: true
        }
      }
    }
  },
  watch: {
    year: {
      handler(newValue) {
        // 获取全年安全检查统计
        this.getDataMapSecurityCheck(newValue)
        // 获取工作区域安全检查
        this.getDataMapSecurityCheckWorkArea(newValue)
        // 获取安全检查统计
        this.getDataMapSecurityCheckCount(newValue, this.search.securityCheck.value)
      },
      immediate: true
    },
    'search.securityCheck.value': {
      handler(newValue) {
        // 获取安全检查统计
        this.getDataMapSecurityCheckCount(this.year, newValue)
      }
    }
  },
  methods: {
    // 获取全年安全检查统计
    async getDataMapSecurityCheck(time) {
      const data = await getDataMapSecurityCheck(time)
      this.yearlyCheckOriginData = data
        .map(item => {
          return { name: item.name, children: item.dataMap }
        })
        .sort((a, b) => {
          return b.children[0].value - a.children[0].value
        })
        .sort((a, b) => {
          if (b.children[0].value - a.children[0].value === 0) {
            return b.children[1].value - a.children[1].value
          }
          return true
        })
    },
    // 获取工作区域安全检查
    async getDataMapSecurityCheckWorkArea(time) {
      const data = await getDataMapSecurityCheckWorkArea(time)
      this.workingAreaOriginData = data
        .map(item => {
          return { name: item.name, value: item.value, children: item.dataMap }
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 获取安全检查统计
    async getDataMapSecurityCheckCount(time, sign) {
      const data = await getDataMapSecurityCheckCount(time, sign)
      this.securityCheckOriginData = data
        .map(item => {
          return { name: item.name, value: item.value, children: item.dataMap }
        })
        .sort((a, b) => {
          return b.children[0].value - a.children[0].value
        })
        .sort((a, b) => {
          if (b.children[0].value - a.children[0].value === 0) {
            return b.children[1].value - a.children[1].value
          }
          return true
        })
    },
    selectSecurityCheckValue(obj) {
      this.search.securityCheck.value = obj.value
    },
    // 格式化bar数据
    formatTooltip(param, colors) {
      const reverseColors = JSON.parse(JSON.stringify(colors)).reverse()
      const reverseData = JSON.parse(JSON.stringify(param.data.children)).reverse()
      const formatData = reverseData
        .map((item, i) => {
          return {
            color: reverseColors[i],
            name: item.name,
            value: item.value
          }
        })
        .filter(item => {
          return item.value
        })

      let str = `<div><div >${param.name}<div>`
      const childDiv = formatData.map(child => {
        return `<div ><span style="display:inline-block;
                        margin-right:5px;
                        border-radius:8px;
                        width:8px;
                        height:8px;
                        background-color:${child.color};
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
