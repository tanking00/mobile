<template>
  <div class="container-main">
    <div class="container-item" style="height:212px;">
      <zEchartBar
        :series="riskGradeOptions.series"
        title="风险等级"
        :dataZoom="riskGradeOptions.dataZoom"
        :yAxis="riskGradeOptions.yAxis"
        :xAxis="riskGradeOptions.xAxis"
        :legend="riskGradeOptions.legend"
        :grid="riskGradeOptions.grid"
      />
      <div class="splitLine"></div>
    </div>
    <div class="container-item" style="height:212px;">
      <zEchartBar
        :series="riskPointOptions.series"
        title="风险点位统计分析"
        :colors="riskPointOptions.colors"
        :dataZoom="riskPointOptions.dataZoom"
        :yAxis="riskPointOptions.yAxis"
        :xAxis="riskPointOptions.xAxis"
        :legend="riskPointOptions.legend"
        :grid="riskPointOptions.grid"
      />
      <div class="splitLine"></div>
    </div>
  </div>
</template>

<script>
import { zEchartBar } from '../components'
import { getDataMapRiskGrade, getDataMapRiskGradePoint } from '@/api/dashboard'
export default {
  components: {
    zEchartBar
  },
  props: {
    year: { type: [Number, String] }
  },
  data() {
    return {
      // 风险等级源数据
      riskGradeOriginData: [],
      // 风险点位统计分析
      riskPointOriginData: []
    }
  },
  computed: {
    // 风险等级
    riskGradeOptions() {
      const fontSize = 10
      // 图表
      const series = []
      // 数据源
      const originData = this.riskGradeOriginData
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
        // 柱状图配置项
        const obj = {
          data: [],
          name: 'value',
          stack: 'sum',
          ...defaultOption,
          label: {
            show: false
          },
          tooltip: { show: false }
        }
        let total = 0
        obj.data = originData.map(item => {
          total += item.value
          const tempColors = ['#ff1f34', '#ff7100', '#ffc600', '#0090ff']
          const childObj = {
            value: item.value,
            itemStyle: { color: tempColors[item.level - 1], borderRadius: [0, 2, 2, 0] }
          }
          return childObj
        })
        series.push(obj)
        if (!total) {
          // 当所有风险等级都为0的时候  要给总数设置一个默认值 这样才会有个底图
          total = 100
        }
        xAxis.max = total
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
              const data = param.data.data
              const percent = param.value ? Number(((data.value / param.value) * 100).toFixed(2)) : 0
              return `${data.name}</br>数量：${data.value}条</br>百分比：${percent}%`
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
    // 风险点位统计分析
    riskPointOptions() {
      // 图表
      let series = []
      const fontSize = 10
      // 数据源
      const originData = this.riskPointOriginData
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#0090ff']
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
            endValue: 3,
            zoomLock: true
          }
        ]
      }
    }
  },
  watch: {
    year: {
      handler(newValue) {
        if (!newValue) return
        // 风险等级
        this.getDataMapRiskGrade(newValue)
        // 根据点位获取风险等级
        this.getDataMapRiskGradePoint(newValue)
      },
      immediate: true
    }
  },
  methods: {
    // 获取危化源数据统计
    async getDataMapRiskGrade(time) {
      const res = await getDataMapRiskGrade(time)
      this.riskGradeOriginData = res
        .map(item => {
          let level = null
          switch (item.name) {
            case '重大风险':
              level = 1
              break
            case '较大风险':
              level = 2
              break
            case '一般风险':
              level = 3
              break
            case '低风险':
              level = 4
              break
            default:
              level = 4
              break
          }
          return { level, ...item }
        })
        .sort((a, b) => {
          return b.level - a.level
        })
    },
    // 风险点位统计分析
    async getDataMapRiskGradePoint(time) {
      const res = await getDataMapRiskGradePoint(time)
      this.riskPointOriginData = res
        .map(item => {
          const obj = {
            name: item.name,
            value: 0,
            children: []
          }
          obj.children = item.dataMap
            .map(element => {
              obj.value += element.value
              let level = null
              switch (element.name) {
                case '重大风险':
                  level = 1
                  break
                case '较大风险':
                  level = 2
                  break
                case '一般风险':
                  level = 3
                  break
                case '低风险':
                  level = 4
                  break
                default:
                  break
              }
              return { level, ...element }
            })
            .sort((a, b) => {
              return a.level - b.level
            })
          return obj
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 格式化bar数据
    formatTooltip(param, colors) {
      const reverseColors = JSON.parse(JSON.stringify(colors)).reverse()
      const reverseData = JSON.parse(JSON.stringify(param.data.children)).reverse()
      let str = `<div><div>${param.name}<div>`
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/basicStyle.scss';
.container-main {
  padding: 116px 8px 6px;
  .container-item {
    background: $color-white;
    border-radius: 8px;
    border-radius: 8px;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
  }
  .splitLine {
    position: relative;
    top: -36px;
    left: 16px;
    width: calc(100% - 32px);
    border-bottom: 1px solid #eee;
  }
}
</style>
