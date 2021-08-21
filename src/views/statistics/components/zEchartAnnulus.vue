<template>
  <div class="bm-charts"></div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  props: {
    title: {
      type: String
    },
    seriesData1: {
      type: Array,
      default: () => {
        return []
      }
    },
    formatter1: {
      // 里层悬停效果
      type: [String, Function]
    },
    formatter2: {
      // 外层悬停效果
      type: [String, Function]
    },
    seriesData2: {
      type: Array,
      default: () => {
        return []
      }
    },
    colors: {
      type: Array,
      default: () => {
        return ['#ffc600', '#36dcac', '#0090ff', '#5d6fff', '#676C7A']
      }
    },
    legend: {
      type: Object,
      default: () => {
        return {
          show: false
        }
      }
    }
  },
  data() {
    return {
      chart: null,
      center: ['50%', '48%']
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
    }
  },
  computed: {
    echartData() {
      return {
        inner: this.seriesData1,
        outer: this.seriesData2
      }
    },
    option() {
      return {
        backgroundColor: 'transparent',
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
        tooltip: {
          trigger: 'item'
        },
        legend: {
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
        series: [
          {
            name: 'a',
            color: this.colors,
            type: 'pie',
            hoverAnimation: false,
            clockwise: false,
            radius: ['10%', '30%'],
            center: this.center,
            minAngle: 10,
            startAngle: 90,
            avoidLabelOverlap: true,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1
              }
            },
            label: {
              normal: {
                position: 'inner',
                fontSize: 10,
                formatter: params => {
                  this.$nextTick(() => {
                    this.$emit('getItemPercent', { percent: params.percent, index: params.dataIndex })
                  }, 10)
                  return `{percent|${params.percent}%}`
                },
                rich: {
                  percent: {
                    textBorderColor: '#fff',
                    textBorderWidth: 1,
                    fontSize: 10,
                    color: '#333',
                    padding: [0, 0, 10, 0]
                  }
                },
                textStyle: {
                  color: '#ff0000'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.echartData.inner,
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(13,5,30,.6)',
              borderWidth: 0,
              padding: 12,
              textStyle: {
                fontSize: 10,
                color: '#fff'
              },
              formatter: this.formatter1
            }
          },
          {
            type: 'pie',
            name: 'b',
            startAngle: 90,
            hoverAnimation: false,
            clockwise: false,
            avoidLabelOverlap: true,
            color: this.colors,
            radius: ['30%', '50%'],
            center: this.center,
            data: this.echartData.outer,
            tooltip: {
              trigger: 'item',
              borderWidth: 0,
              backgroundColor: 'rgba(13,5,30,.6)',
              padding: 12,
              textStyle: {
                fontSize: 10,
                color: '#fff'
              },
              formatter: this.formatter2
            },
            minAngle: 10,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1
              }
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 5,
                lineStyle: {
                  color: '#8c8c8c'
                }
              }
            },
            label: {
              normal: {
                fontSize: 10,
                formatter: function(params) {
                  return '{font|' + params.name + '}\n{font|' + params.value + '}'
                },
                distanceToLabelLine: 0,
                padding: [-2, 0, 0, 0],
                rich: {
                  font: {
                    color: '#8c8c8c',
                    fontSize: 12,
                    padding: [4, 0],
                    align: 'center'
                  }
                }
              }
            }
          }
        ]
      }
    }
  },
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
