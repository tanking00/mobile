<template>
  <div class="bm-charts"></div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  data() {
    return {
      chart: null,
      pieData: []
    }
  },
  props: {
    color: {
      type: Array,
      default: () => {
        return ['#ff1f34', '#ff7100', '#ffc600', '#00dca2', '#0090ff', '#5d6fff', '#676C7A']
      }
    },
    title: {
      type: String
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    isSort: {
      type: Boolean,
      default: true
    },
    labelFormatter: {
      type: [String, Function],
      default: '{font|{b}}\n {font|{c} }{font|条}{font|{d}%}'
    },
    tooltipFormatter: {
      type: [String, Function],
      default: '{b} : {c} ({d}%)'
    },
    maxLength: {
      type: Number,
      default: 10
    },
    startAngle: {
      // 起始角度
      type: Number,
      default: 90
    },
    roseType: {
      // 扇区圆心角展现数据的百分比，半径展现数据的大小。radius
      // 所有扇区圆心角相同，仅通过半径展现数据大小   area
      type: [String, Boolean],
      default: 'radius'
    },
    grid: {
      type: Object,
      default: () => {
        return {
          left: 10,
          top: 10,
          bottom: 10,
          right: 10,
          width: 'auto',
          height: '100%', // 图例高度
          containLabel: true
        }
      }
    },
    legend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    length2: {
      type: Number,
      default: 4
    },
    emphasis: {
      type: Object,
      default: () => {
        return {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }
    },
    center: {
      type: Array,
      default: () => {
        return ['50%', '50%']
      }
    },
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    option: {
      handler() {
        if (this.chart) {
          this.setOptions()
          this.$nextTick(() => {
            this.chart.resize()
          }, 10)
        } else {
          this.$nextTick(() => {
            this.initChart()
          }, 200)
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (this.isSort) {
            this.pieData = newValue.sort(function(a, b) {
              return b.value - a.value
            })
          } else {
            this.pieData = newValue
          }
        }
      },
      immediate: true
    }
  },
  computed: {
    option() {
      const series = [
        {
          stack: 'a',
          type: 'pie',
          clockwise: false,
          minAngle: 10, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
          avoidLabelOverlap: true,
          radius: ['35%', '60%'],
          center: this.center,
          roseType: this.roseType,
          startAngle: this.startAngle,
          label: {
            normal: {
              formatter: this.labelFormatter,
              rich: {
                font: {
                  fontSize: 10,
                  color: '#8c8c8c',
                  align: 'center'
                }
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: '#8c8c8c'
            },
            length: 6,
            length2: 4,
            smooth: 0
          },
          emphasis: { scale: false },
          itemStyle: this.itemStyle,
          data: this.pieData
        }
      ]
      if (this.data.length) {
        series.push({
          type: 'pie',
          radius: ['22%', '25%'],
          center: this.center,
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
              name: '',
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
      }
      return {
        color: this.color,
        title: {
          text: this.title,
          left: 12,
          top: 12,
          textStyle: {
            color: '#333',
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        legend: {
          show: true,
          selectedMode: false,
          orient: 'horizontal',
          right: 'center',
          bottom: 12,
          itemWidth: 8,
          itemHeight: 8,
          width: 270,
          textStyle: {
            color: '#8C8C8C',
            padding: [0, 0, 0, 2],
            fontSize: 10,
            overflow: 'truncate',
            width: 45
          },
          ...this.legend
        },
        grid: this.grid,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15,21,28,.8)',
          padding: 12,
          borderWidth: 0,
          textStyle: {
            fontSize: 10,
            color: '#fff'
          },
          formatter: this.tooltipFormatter
        },
        calculable: true,
        series
      }
    }
  },
  mounted() {},
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption(this.option, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.bm-charts {
  height: 100%;
  width: 100%;
}
</style>
