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
                <div class="circle-num">{{ punishmentsValue }}<span class="circle-text">人次</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-item " style="height:282px;">
      <zEchartCustomPie
        class="container-item-echart"
        title="违规级别统计"
        :legend="violationLevelOptions.legend"
        :series="violationLevelOptions.series"
        :tooltipFormatter="violationLevelOptions.tooltipFormatter"
      />
      <div class="no-data" v-if="!violationLevelOriginData.length">暂无数据！</div>
    </div>
    <div class="container-item" :style="{ height: violateTypeHeight }">
      <zEchartPie
        class="container-item-echart"
        title="违规类型统计"
        :data="violateTypeOptions.data"
        :labelFormatter="violateTypeOptions.labelFormatter"
        :tooltipFormatter="violateTypeOptions.tooltipFormatter"
        :colors="violateTypeOptions.colors"
        :legend="violateTypeOptions.legend"
        :center="violateTypeOptions.center"
      />
      <div class="no-data" v-if="!violateTypeOptions.data.length">暂无数据！</div>
    </div>
    <div class="container-item " style="height:244px;">
      <zEchartBar
        class="container-item-echart"
        :series="deptPunishOptions.series"
        title="部门处罚人次分布"
        :colors="deptPunishOptions.colors"
        :dataZoom="deptPunishOptions.dataZoom"
        :yAxis="deptPunishOptions.yAxis"
        :xAxis="deptPunishOptions.xAxis"
        :legend="deptPunishOptions.legend"
        :grid="deptPunishOptions.grid"
      />
      <div class="no-data" v-if="!deptPunishOptions.series.length">暂无数据！</div>
      <div class="splitLine" v-show="deptPunishOptions.series.length"></div>
    </div>
  </div>
</template>

<script>
import { zEchartBar, zEchartCustomPie, zEchartPie } from '../components'
import {
  getDataMapRewardsViolationDeptLevel,
  getDataMapRewardsViolationLevel,
  getDataMapRewardsViolationPerson,
  getDataMapRewardsViolationType
} from '@/api/dashboard'
export default {
  components: {
    zEchartBar,
    zEchartCustomPie,
    zEchartPie
  },
  props: {
    year: { type: [Number, String] }
  },
  data() {
    return {
      // 累计奖励处罚
      punishmentsValue: 0,
      // 违规级别 数据源
      violationLevelOriginData: [],
      // 部门 处罚 人次分布
      deptPunishOriginData: [],
      // 违规级别
      violateTypeOriginData: []
    }
  },
  computed: {
    // 违规级别统计 容器高度
    violateTypeHeight() {
      return 341 + Math.floor(this.violateTypeOriginData.length / 3) * 10 + 'px'
    },
    // 违规级别统计
    violationLevelOptions() {
      // 数据源
      const originData = this.violationLevelOriginData
      const legend = {
        data: []
      }
      // 图表
      let series = []
      // 格式化悬浮数据
      const tooltipFormatter = parms => {
        return `${parms.data.item.name}<br/>占比：${parms.percent}%<br/>人数：${parms.value}`
      }
      if (originData && originData.length) {
        const defaultOption = {
          name: '违规级别统计',
          type: 'pie',
          center: ['50%', '55%'],
          hoverAnimation: false, // 设置饼图默认的展开样式
          clockwise: false,
          startAngle: 90,
          labelLine: {
            lineStyle: {
              color: '#8c8c8c'
            }
          },
          data: []
        }
        series = originData.map((item, index) => {
          legend.data.push(item.name)
          const x = '30%'
          const y = index < 3 ? 60 - index * 10 + '%' : 40 - (index - 2) * 2 + '%'
          return {
            ...defaultOption,
            radius: [x, y],
            zlevel: originData.length - index,
            data: originData.map((data, i) => {
              const colors = originData.map((item, index) => {
                const tempColors = ['#ff1f34', '#ff7100', '#FFC600']
                if (index < tempColors.length) return tempColors[index]
                return this.randomColor()
              })

              const obj = {
                name: data.name,
                item: data,
                value: data.value,
                itemStyle: {
                  color: data.level < 3 ? colors[data.level] : colors[i]
                },
                label: {
                  show: false
                }
              }
              if (i !== index) {
                obj.name += index
                obj.itemStyle.color = 'transparent'
              } else {
                obj.label = {
                  show: true,
                  normal: {
                    formatter: '{font|{b}：}\n {font|{c}( }{font|{d}%)}',
                    rich: {
                      font: {
                        fontSize: 10,
                        color: '#8c8c8c',
                        align: 'center'
                      }
                    }
                  }
                }
              }
              return obj
            })
          }
        })
      }
      series.push({
        type: 'pie',
        zlevel: 10,
        radius: ['15%', '18%'],
        center: ['50%', '55%'],
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        data: [
          {
            value: 0,
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#5181ff'
              }
            }
          }
        ]
      })
      return {
        legend,
        series,
        tooltipFormatter
      }
    },
    // 违规级别统计
    violateTypeOptions() {
      const colors = ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      // 数据源
      const originData = this.violateTypeOriginData
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
    // 部门处罚人次分布
    deptPunishOptions() {
      // 图表
      let series = []
      // 数据源
      const originData = this.deptPunishOriginData
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
          fontSize: 10,
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
        barWidth: 8,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontSize: 10,
          textStyle: {
            color: '#8C8C8C'
          }
        }
      }
      if (originData && originData.length) {
        // 配置 柱状图系列
        // 颜色码 前三个固定  后面出现的类型 随机颜色
        colors = originData[0].children.map((item, index) => {
          const tempColors = ['#ff1f34', '#ff7100', '#ffc600']
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

        xAxis.max = Math.max(
          ...originData.map(item => {
            return item.value
          })
        )
        series.push({
          name: 'label',
          type: 'bar',
          barWidth: 8,
          z: 0,
          tooltip: {
            show: false
          },
          label: {
            show: true,
            position: 'top',
            offset: [0, 0],
            color: '#8C8C8C',
            fontSize: 10,
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
              fontSize: 10,
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
                fontSize: 10,
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
    }
  },
  watch: {
    year: {
      handler(newValue) {
        // 违规人次统计
        this.getDataMapRewardsViolationPerson(newValue)
        // 违规级别统计
        this.getDataMapRewardsViolationLevel(newValue)
        // 违规类型统计
        this.getDataMapRewardsViolationType(newValue)
        // 部门违规级别
        this.getDataMapRewardsViolationDeptLevel(newValue)
      },
      immediate: true
    }
  },
  methods: {
    // 部门违规级别
    async getDataMapRewardsViolationDeptLevel(year) {
      const data = await getDataMapRewardsViolationDeptLevel(year)
      this.deptPunishOriginData = data
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
    // 违规级别统计
    async getDataMapRewardsViolationLevel(year) {
      const data = await getDataMapRewardsViolationLevel(year)
      this.violationLevelOriginData = data
        .filter(item => {
          return item.value
        })
        .map(item => {
          let index
          if (item.name.indexOf('B') !== -1) {
            index = 1
          } else if (item.name.indexOf('C') !== -1) {
            index = 2
          } else if (item.name.indexOf('A') !== -1) {
            index = 0
          } else {
            index = 3
          }
          return {
            ...item,
            level: index
          }
        })
        .sort((a, b) => {
          return a.level - b.level
        })
    },
    // 违规人次统计
    async getDataMapRewardsViolationPerson(year) {
      const data = await getDataMapRewardsViolationPerson(year)
      this.punishmentsValue = data
    },
    // 违规类型统计
    async getDataMapRewardsViolationType(year) {
      const data = await getDataMapRewardsViolationType(year)
      this.violateTypeOriginData = data
        .filter(item => {
          return item.value
        })
        .sort((a, b) => {
          return b.value - a.value
        })
    },
    // 格式化bar数据
    formatTooltip(param, colors) {
      const reverseColors = JSON.parse(JSON.stringify(colors))
      const reverseData = JSON.parse(JSON.stringify(param.data.children))
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
          border: 15px solid #ff1f34;
          border-radius: 50%;
          .circle-3 {
            width: 166px;
            height: 166px;
            border: 2px solid rgba($color: #ff1f34, $alpha: 0.2);
            border-radius: 50%;
            .circle-4 {
              width: 157px;
              height: 157px;
              border: 2px solid rgba($color: #ff1f34, $alpha: 0.1);
              border-radius: 50%;
              .circle-text {
                font-size: 14px;
                color: #333;
                line-height: 20px;
              }
              .circle-num {
                font-size: 48px;
                font-weight: bold;
                color: #ff1f34;
              }
            }
          }
        }
      }
    }
    .splitLine {
      position: absolute;
      bottom: 36px;
      left: 16px;
      width: calc(100% - 32px);
      border-bottom: 1px solid #eee;
      z-index: 0;
    }
    &-echart {
      position: absolute;
      width: 100%;
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
