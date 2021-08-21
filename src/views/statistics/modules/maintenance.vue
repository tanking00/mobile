<template>
  <div class="container-main">
    <div class="container-item" style="height:305px;">
      <zEchartLiquid title="设备总体在用率" :data="usageRateOriginData" />
    </div>
    <div class="container-item" style="height:305px;">
      <zEchartPie
        title="设备设施类别统计"
        :data="equipmentCategoryOptions.data"
        :labelFormatter="equipmentCategoryOptions.labelFormatter"
        :color="equipmentCategoryOptions.colors"
        :tooltipFormatter="equipmentCategoryOptions.tooltipFormatter"
      />
      <div class="no-data" v-if="!equipmentCategoryOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item" style="height:242px;">
      <zEchartBar
        :series="deviceUndoneOptions.series"
        title="设备点检未完成数统计"
        :colors="deviceUndoneOptions.colors"
        :dataZoom="deviceUndoneOptions.dataZoom"
        :yAxis="deviceUndoneOptions.yAxis"
        :xAxis="deviceUndoneOptions.xAxis"
        :legend="deviceUndoneOptions.legend"
        :grid="deviceUndoneOptions.grid"
      />
      <div class="splitLine"></div>
      <div class="no-data" v-if="!deviceUndoneOptions.series.length">暂无数据！</div>
    </div>
    <div class="container-item " style="height: 229px;">
      <zEchartBar
        :series="deviceNumOptions.series"
        title="消防设施数量统计"
        :colors="deviceNumOptions.colors"
        :xAxisData="deviceNumOptions.xAxisData"
        :legend="deviceNumOptions.legend"
        :dataZoom="deviceNumOptions.dataZoom"
        :grid="deviceNumOptions.grid"
      />
    </div>
  </div>
</template>

<script>
import { zEchartBar, zEchartPie, zEchartLiquid } from '../components'
import {
  getDataMapEquipmentInUseRate,
  getDataMapEquipmentType,
  getDataMapEquipmentRecord,
  getDataMapEquipmentFireCount
} from '@/api/dashboard'
export default {
  components: {
    zEchartBar,
    zEchartPie,
    zEchartLiquid
  },
  props: {
    year: { type: [Number, String] }
  },
  data() {
    return {
      // 设备总体 在用率
      usageRateOriginData: {
        name: '设备总体在用率',
        value: 0
      },
      // 设备设施类别数据源
      equipmentCategoryOriginData: [],
      // 消防设施数量统计数据
      deviceNumOriginData: [],
      // 设备点检未完成数统计
      deviceUndoneOriginData: []
    }
  },
  computed: {
    // 设备设施类别
    equipmentCategoryOptions() {
      const colors = ['#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      const length = this.equipmentCategoryOriginData.length
      if (length > colors.length) {
        const count = length - colors.length
        for (let i = 0; i < count; i++) {
          colors.push(this.randomColor())
        }
      }
      const labelFormatter = '{font|{b}：}\n {font|{c}}{font|（{d}%）}'
      const tooltipFormatter = parms => {
        let str = `${parms.name}<br/>`
        parms.data.children.forEach((item, index) => {
          str += item.name + '：' + item.value
          if (index !== parms.data.children.length - 1) {
            str += '</br>'
          }
        })
        return str
      }
      return {
        labelFormatter,
        data: this.equipmentCategoryOriginData,
        tooltipFormatter,
        colors
      }
    },
    // 设备点检未完成数统计
    deviceUndoneOptions() {
      // 图表
      let series = []
      const fontSize = 10
      // 数据源
      const originData = this.deviceUndoneOriginData
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
          const tempColors = ['#ff1f34', '#ff7100', '#ffc600', '#39dcac', '#0090ff', '#2044af']
          if (index < tempColors.length) return tempColors[index]
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
    // 消防 设施 数量统计 配置项
    deviceNumOptions() {
      // 图表
      let series = []
      // 横坐标 label
      const xAxisData = []
      // 数据源
      const originData = this.deviceNumOriginData
      // 柱状图颜色
      let colors = []
      const legend = { data: [] }
      const grid = {
        left: 12,
        right: 12,
        top: 54,
        bottom: 34,
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
      return {
        series,
        colors,
        xAxisData,
        legend,
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
    }
  },
  watch: {
    year: {
      handler(newValue) {
        if (!newValue) return
        // 获取在用率
        this.getDataMapEquipmentInUseRate(newValue)
        // 获取设备分类
        this.getDataMapEquipmentType(newValue)
        // 获取未点检记录
        this.getDataMapEquipmentRecord(newValue)
        // 消防设施数量统计
        this.getDataMapEquipmentFireCount(newValue)
      },
      immediate: true
    }
  },
  methods: {
    // 获取在用率
    async getDataMapEquipmentInUseRate(time) {
      const data = await getDataMapEquipmentInUseRate(time)
      this.usageRateOriginData.value = data
    },
    // 获取设备分类
    async getDataMapEquipmentType(time) {
      const data = await getDataMapEquipmentType(time)
      this.equipmentCategoryOriginData =
        data
          .map(item => {
            return {
              name: item.name,
              value: item.value,
              children: item.list.map(element => {
                return { name: element.name, value: element.value }
              })
            }
          })
          .filter(item => {
            return item.value
          }) || []
    },
    // 获取未点检记录
    async getDataMapEquipmentRecord(time) {
      const data = await getDataMapEquipmentRecord(time)
      const labelNames = data.length ? data[0].list.map(obj => obj.name) : []
      this.deviceUndoneOriginData = data
        .map(item => {
          const data1 = item.list.filter(item => {
            return item.name === labelNames[0]
          })
          const data2 = item.list.filter(item => {
            return item.name === labelNames[1]
          })
          return {
            name: item.name,
            value: item.value,
            children: data1.concat(data2)
          }
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 消防设施数量统计
    async getDataMapEquipmentFireCount(time) {
      const data = await getDataMapEquipmentFireCount(time)
      this.deviceNumOriginData = data
        .map(item => {
          return {
            name: item.name,
            value: item.value,
            children: item.list.map(element => {
              return { name: element.name, value: element.value }
            })
          }
        })
        .sort((a, b) => {
          return b.value - a.value
        })
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
