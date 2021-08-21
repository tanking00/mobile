<template>
  <div class="container-main">
    <div class="container-item" style="height:227px">
      <zEchartBar
        :series="systemunsafetyNumOptions.series"
        :dataZoom="systemunsafetyNumOptions.dataZoom"
        title="系统安全隐患数量"
        :colors="systemunsafetyNumOptions.colors"
        :xAxisData="systemunsafetyNumOptions.xAxisData"
        :legend="systemunsafetyNumOptions.legend"
        :tooltip="systemunsafetyNumOptions.tooltip"
      />
    </div>
    <div class="container-item" style="height:227px">
      <zEchartBar
        :series="productionUnsafetyNumOptions.series"
        :dataZoom="productionUnsafetyNumOptions.dataZoom"
        title="生产安全隐患数量"
        :colors="productionUnsafetyNumOptions.colors"
        :xAxisData="productionUnsafetyNumOptions.xAxisData"
        :legend="productionUnsafetyNumOptions.legend"
        :tooltip="productionUnsafetyNumOptions.tooltip"
      />
    </div>
    <div class="container-item" style="height:227px">
      <zEchartBar
        :series="exitRateOptions.series"
        :dataZoom="exitRateOptions.dataZoom"
        title="安全隐患关闭率"
        :colors="exitRateOptions.colors"
        :xAxisData="exitRateOptions.xAxisData"
        :legend="exitRateOptions.legend"
        :tooltip="exitRateOptions.tooltip"
      />
    </div>
    <div class="container-item" style="height:242px">
      <div class="splitLine"></div>
      <zEchartBar
        class="container-item-echart"
        title="隐患区域分布"
        :series="troubleAreaOptions.series"
        :dataZoom="troubleAreaOptions.dataZoom"
        :yAxis="troubleAreaOptions.yAxis"
        :xAxis="troubleAreaOptions.xAxis"
        :legend="troubleAreaOptions.legend"
        :grid="troubleAreaOptions.grid"
      />
      <div class="no-data" v-if="!troubleAreaOptions.series.length">暂无数据！</div>
    </div>
    <div class="container-item" style="height:242px">
      <div class="splitLine"></div>
      <zEchartBar
        class="container-item-echart"
        style="height:242px"
        title="隐患整改统计"
        :series="abarbeitungOptions.series"
        :dataZoom="abarbeitungOptions.dataZoom"
        :yAxis="abarbeitungOptions.yAxis"
        :xAxis="abarbeitungOptions.xAxis"
        :legend="abarbeitungOptions.legend"
        :grid="abarbeitungOptions.grid"
      />
      <SelectorDataBtn
        class="container-item-btn"
        @select="abarbeitungValue"
        :options="options"
        :value="search.abarbeitung.value"
      />
    </div>
    <div class="container-item" style="height: 285px;">
      <zEchartAnnulus
        title="生产安全隐患分类"
        @getItemPercent="getClassifyItemPercent"
        :seriesData1="classifyData"
        :seriesData2="formatClassifySeriesData"
        :colors="annulusColors"
        :formatter1="formatterInnerTooltip"
        :formatter2="formatterClassifyOuterTooltip"
        :legend="annularLegend(classifyData)"
      />
      <div class="no-data" v-if="!classifyData.length">暂无数据！</div>
    </div>
    <div class="container-item" style="height: 285px;">
      <zEchartAnnulus
        title="系统安全隐患分类"
        @getItemPercent="getSystemItemPercent"
        :seriesData1="systemData"
        :seriesData2="formatSystemSeriesData"
        :colors="annulusColors"
        :formatter1="formatterInnerTooltip"
        :formatter2="formatterSystemOuterTooltip"
        :legend="annularLegend(systemData)"
      />
      <div class="no-data" v-if="!systemData.length">暂无数据！</div>
    </div>
  </div>
</template>

<script>
import { zEchartBar, zEchartAnnulus, SelectorDataBtn } from '../components'
import {
  getDataMapHazard,
  getDataMapHazardArea,
  getDataMapHazardClose,
  getDataMapHazardRectify,
  getDataMapHazardType
} from '@/api/dashboard'
export default {
  components: {
    zEchartBar,
    zEchartAnnulus,
    SelectorDataBtn
  },
  props: {
    year: { type: [Number, String] }
  },
  data() {
    return {
      // 对应颜色的  rgba 数值  用于 修改最后一项的透明度
      colorsRgba: [
        [255, 198, 0],
        [54, 220, 172],
        [0, 144, 255],
        [93, 111, 255],
        [103, 108, 122]
      ],
      // 生产安全隐患分类
      classifyData: [],
      // 系统安全隐患分类
      systemData: [],
      // 生产安全隐患分类 格式化 悬停内容
      formatterClassifyOuterTooltip: parms => {
        const data = this.classifyData[parms.data.index]
        let str = `${data.name}</br> 占比：${data.percent}%</br>`
        data.children.forEach((element, index) => {
          str = str + `${element.name}：${element.value}`
          if (index !== data.children.length - 1) {
            str = str + `</br>`
          }
        })
        return str
      },
      // 系统安全隐患分类 格式化 悬停内容
      formatterSystemOuterTooltip: parms => {
        const data = this.systemData[parms.data.index]
        let str = `${data.name}</br> 占比：${data.percent}%</br>`
        data.children.forEach((element, index) => {
          str = str + `${element.name}：${element.value}`
          if (index !== data.children.length - 1) {
            str = str + `</br>`
          }
        })
        return str
      },
      // 系统安全 隐患数量
      systemUnsafetyNumOriginData: [],
      // 生产安全隐患数量 数据源
      productionUnsafetyNumOriginData: [],
      // 安全隐患关闭率
      exitRateOriginData: [],
      // 隐患分布区域
      troubleAreaOriginData: [],
      // 隐患整改统计数据源
      abarbeitungOriginData: [],
      search: {
        // 隐患整改统计
        abarbeitung: {
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
    // 饼状图颜色
    annulusColors() {
      return this.colorsRgba.map(item => {
        return `rgba(${item[0]},${item[1]},${item[2]},1)`
      })
    },
    // 格式化 生产 安全隐患分类
    formatClassifySeriesData() {
      const seriesData = []
      this.classifyData.forEach((item, index) => {
        const childData = item.children.sort(function(a, b) {
          return a.level - b.level
        })
        if (this.colorsRgba.length <= index) {
          this.colorsRgba.push(this.randomColor1())
        }
        childData.forEach(child => {
          const alphas = [1, 0.7, 0.4]
          // 拼接对应颜色
          let str = `rgba(${this.colorsRgba[index][0]},${this.colorsRgba[index][1]},${this.colorsRgba[index][2]}`
          if (child.level && child.level > 0 && child.level <= 3) {
            str = `${str},${alphas[child.level - 1]})`
          } else if (child.level > 3) {
            str = `${str},0.2)`
          }
          seriesData.push({
            name: child.name,
            value: child.value,
            index,
            itemStyle: {
              color: str
            }
          })
        })
      })
      return seriesData
    },
    // 格式化 系统 安全隐患分类
    formatSystemSeriesData() {
      const seriesData = []
      this.systemData.forEach((item, index) => {
        const childData = item.children.sort(function(a, b) {
          return a.level - b.level
        })
        childData.forEach(child => {
          const alphas = [1, 0.7, 0.4]
          // 拼接对应颜色
          let str = `rgba(${this.colorsRgba[index][0]},${this.colorsRgba[index][1]},${this.colorsRgba[index][2]}`
          if (child.level && child.level > 0 && child.level <= 3) {
            str = `${str},${alphas[child.level - 1]})`
          } else if (child.level > 3) {
            str = `${str},0.2)`
          }
          seriesData.push({
            name: child.name,
            value: child.value,
            index,
            itemStyle: {
              color: str
            }
          })
        })
      })
      return seriesData
    },
    // 系统安全隐患数量
    systemunsafetyNumOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.systemUnsafetyNumOriginData
      // 柱状图颜色
      const colors = ['#0090ff', '#39dcac']
      const legend = {
        textStyle: {
          color: '#8C8C8C',
          padding: [0, 0, 0, 4],
          fontSize: 10,
          overflow: 'truncate',
          width: 30
        }
      }
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
          return `${parms[0].axisValue}<br/>
          ${parms[0].marker} ${parms[0].seriesName} 隐患数量: ${parms[0].data}条<br />
          ${parms[1].marker} ${parms[1].seriesName} 隐患数量: ${parms[1].data}条`
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
          endValue: 11, // 柱状图固定最多显示数量 0开始
          zoomLock: true
        }
      }
    },
    // 生产安全隐患数量
    productionUnsafetyNumOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.productionUnsafetyNumOriginData
      // 柱状图颜色
      const colors = ['#0090ff', '#39dcac']
      const legend = {
        textStyle: {
          color: '#8C8C8C',
          padding: [0, 0, 0, 4],
          fontSize: 10,
          overflow: 'truncate',
          width: 30
        }
      }
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
          return `${parms[0].axisValue}<br/>
        ${parms[0].marker} ${parms[0].seriesName} 隐患数量: ${parms[0].data}条<br />
          ${parms[1].marker} ${parms[1].seriesName} 隐患数量: ${parms[1].data}条`
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
          endValue: 11, // 柱状图固定最多显示数量 0开始
          zoomLock: true
        }
      }
    },
    // 安全隐患 关闭率
    exitRateOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.exitRateOriginData
      // 柱状图颜色
      const colors = ['#0090ff', '#39dcac']
      const xAxis = {
        boundaryGap: false
      }
      const legend = {
        textStyle: {
          color: '#8C8C8C',
          padding: [0, 0, 0, 4],
          fontSize: 10,
          overflow: 'truncate',
          width: 45
        },
        icon: 'rect'
      }
      const yAxis = {
        // show: false,
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      }
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
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: parms => {
          return `${parms[0].axisValue}<br/>
        ${parms[0].marker} ${parms[0].seriesName}: ${parms[0].data}%<br />
          ${parms[1].marker} ${parms[1].seriesName}: ${parms[1].data}%`
        }
      }
      // 默认配置
      const defaultOption = {
        type: 'line',
        label: {
          show: false
        },
        smooth: true,
        showSymbol: false
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
              ...defaultOption,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0.07,
                      color: index === 0 ? 'rgba(0,144,255,0.3)' : 'rgba(54,220,172,0.3)' // 0% 处的颜色
                    },
                    {
                      offset: 0.98,
                      color: index === 0 ? 'rgba(0,144,255,0)' : 'rgba(54,220,172,0.3)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
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
        xAxis,
        yAxis,
        dataZoom: {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0, // 默认为1
          endValue: 11, // 柱状图固定最多显示数量 0开始
          zoomLock: true
        }
      }
    },
    // 隐患 分布 区域
    troubleAreaOptions() {
      // 图表
      const series = []
      const fontSize = 10
      // 数据源
      const originData = this.troubleAreaOriginData
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#0090ff']
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
        obj.data = originData.map(item => {
          const childObj = {
            value: item.value,
            itemStyle: { color: '#0090ff', borderRadius: [0, 2, 2, 0] }
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
            formatter: param => {
              const data = param.data.data
              return `${data.name}</br>隐患数量：${data.value}条`
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
                  return `${param.data.data.value}`
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
    // 隐患整改统计
    abarbeitungOptions() {
      // 图表
      const series = []
      const fontSize = 10
      // 数据源
      const originData = this.abarbeitungOriginData
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#0090ff']
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
        max: 100,
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
          formatter: `{value}%`
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
        obj.data = originData.map(item => {
          const childObj = {
            value: item.value,
            itemStyle: { color: item.color, borderRadius: [0, 2, 2, 0] }
          }
          return childObj
        })
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
            formatter: param => {
              const data = param.data.data
              return `${data.name}</br>隐患总数：${data.total}条</br>未整改数：${data.undoneValue}条</br>整改率：${data.value}%`
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
                  return `${param.data.data.value}%`
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
        // 系统安全隐患数量
        this.getDataMapHazard(1, newValue, 'systemUnsafetyNumOriginData')
        // 生产安全隐患数量
        this.getDataMapHazard(0, newValue, 'productionUnsafetyNumOriginData')
        // 隐患关闭率
        this.getDataMapHazardClose(newValue)
        // 隐患分布区域
        this.getDataMapHazardArea(newValue)
        // 隐患整改统计
        this.getDataMapHazardRectify(this.search.abarbeitung.value, this.year)
        // 生产安全隐患分类
        this.getDataMapHazardType(1, newValue, 'classifyData')
        // 系统安全隐患分类
        this.getDataMapHazardType(2, newValue, 'systemData')
      },
      immediate: true
    }
  },
  methods: {
    // 获取隐患数量 type  1系统安全  0生产安全
    async getDataMapHazard(type, year, OriginDataKey) {
      const data = await getDataMapHazard(type, year)
      const keys = Object.keys(data)
      this[OriginDataKey] = data[keys[0]].map((item, index) => {
        return {
          name: item.month + '月',
          children: keys.map(key => {
            return { name: key, value: Number(data[key][index].value) }
          })
        }
      })
    },
    // 隐患区域分布
    async getDataMapHazardArea(year) {
      const data = await getDataMapHazardArea(year)
      this.troubleAreaOriginData = data
        .map(item => {
          return { name: item.name, value: item.value }
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 获取隐患关闭率
    async getDataMapHazardClose(year) {
      const data = await getDataMapHazardClose(year)
      const keys = Object.keys(data)
      const list = data[keys[0]].map((item, index) => {
        return {
          name: item.month + '月',
          children: keys.map(key => {
            return { name: key, value: Number(data[key][index].value) }
          })
        }
      })
      this.exitRateOriginData = list
    },
    // 隐患整改统计
    async getDataMapHazardRectify(type, year) {
      const data = await getDataMapHazardRectify(type, year)
      this.abarbeitungOriginData = data
        .map(item => {
          // undoneValue 未整改数量  value  整改率   value 隐患总数
          const obj = { name: item.name, value: 0, undoneValue: 0, total: 0, color: null }
          item.dataMap.forEach(element => {
            if (element.name === '隐患总数') {
              obj.total = element.value
            }
            if (element.name === '未整改数') {
              obj.undoneValue = element.value
            }
          })
          obj.value = obj.total ? Number((((obj.total - obj.undoneValue) / obj.total) * 100).toFixed(2)) : 0
          const tempColors = ['#ff1f34', '#ff7100', '#ffc600', '#0090ff']
          if (obj.value < 70) {
            obj.color = tempColors[0]
          } else if (obj.value <= 90) {
            obj.color = tempColors[1]
          } else if (obj.value < 100) {
            obj.color = tempColors[2]
          } else {
            obj.color = tempColors[3]
          }
          return obj
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 安全隐患分类 type  2系统安全  1生产安全
    async getDataMapHazardType(type, year, OriginDataKey) {
      const data = await getDataMapHazardType(type, year)
      this[OriginDataKey] = data
        .map(item => {
          return {
            name: item.name,
            value: Number(item.value),
            children: item.dtoS
              .map(element => {
                return {
                  name: element.name,
                  value: Number(element.value),
                  level: Number(element.level)
                }
              })
              .filter(item => {
                return item.value
              })
              .sort((a, b) => {
                return a.level - b.level
              })
          }
        })
        .filter(item => {
          return item.value
        })
    },
    abarbeitungValue(obj) {
      this.search.abarbeitung.value = obj.value
      // 隐患整改统计
      this.getDataMapHazardRectify(this.search.abarbeitung.value, this.year)
    },
    annularLegend(data) {
      // 格式化 环形图 图例
      return {
        show: true,
        data: data.map(item => {
          return { name: item.name }
        }),
        selectedMode: false, // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成
        orient: 'horizontal',
        right: 'center',
        bottom: 10,
        itemWidth: 10,
        itemHeight: 10,
        width: '100%'
      }
    },
    // 内环 线图
    formatterInnerTooltip(parms) {
      let str = `${parms.data.name}</br> 占比：${parms.percent}%</br>`
      parms.data.children.forEach((element, index) => {
        str = str + `${element.name}：${element.value}`
        if (index !== parms.data.children.length - 1) {
          str = str + `</br>`
        }
      })
      return str
    },
    // 获取生产安全隐患分类 内圈对应区域的 百分比 用于 鼠标移入外圈时 tooltip 格式化数据
    getClassifyItemPercent(item) {
      this.classifyData[item.index].percent = item.percent
    },
    // 获取系统安全隐患 内圈对应区域的 百分比 用于 鼠标移入外圈时 tooltip 格式化数据
    getSystemItemPercent(item) {
      this.systemData[item.index].percent = item.percent
    },
    randomColor1() {
      const r = parseInt(Math.random() * 256)
      const g = parseInt(Math.random() * 256)
      const b = parseInt(Math.random() * 256)
      return [r, g, b]
    },
    randomColor() {
      const r = parseInt(Math.random() * 256)
      const g = parseInt(Math.random() * 256)
      const b = parseInt(Math.random() * 256)
      const rgb = 'rgb(' + r + ',' + g + ',' + b + ')'
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
</style>
