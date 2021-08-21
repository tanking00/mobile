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
    colors: {
      type: Array,
      default: () => {
        return ['#2044af', '#0090ff', '#39dcac', '#ffc600', '#ff7100', '#ff4141']
      }
    },
    legend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    grid: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tooltip: {
      type: Object,
      default: () => {
        return {
          trigger: 'item'
        }
      }
    },
    series: {
      type: Array,
      default: () => {
        return []
      }
    },
    xAxisData: {
      type: Array,
      default: () => {
        return []
      }
    },
    xAxis: {
      type: Object,
      default: () => {
        return {}
      }
    },
    yAxis: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataZoom: {
      type: [Object, Array],
      default: () => {
        return {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0, // 默认为1
          endValue: 20,
          zoomLock: true // 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
        }
      }
    }
  },
  data() {
    return {
      chart: null
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
    option() {
      return {
        backgroundColor: 'transparent',
        color: this.colors,
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
        tooltip: this.tooltip,
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
            padding: [0, 0, 0, 4],
            fontSize: 10,
            overflow: 'truncate',
            width: 65
          },
          ...this.legend
        },
        grid: {
          left: 12,
          right: 12,
          top: 54,
          bottom: 54,
          containLabel: true,
          ...this.grid
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxisData,
            axisTick: {
              alignWithLabel: true,
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#8C8C8C'
              }
            },
            axisLabel: {
              interval: 0,
              color: '#8C8C8C',
              fontSize: 10,
              formatter: function(value) {
                var ret = '' // 拼接加\n返回的类目项
                var maxLength = 4 // 每项显示文字个数
                var valLength = value.length // X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) {
                  // 如果类目项的文字大于6,
                  for (var i = 0; i < rowN; i++) {
                    var temp = '' // 每次截取的字符串
                    var start = i * maxLength // 开始截取的位置
                    var end = start + maxLength // 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            },
            ...this.xAxis
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            minInterval: 1,
            splitLine: {
              lineStyle: {
                color: '#eee'
              }
            },
            axisLine: {
              show: false, // 去除网格线
              lineStyle: {
                color: '#8C8C8C'
              }
            },
            splitArea: {
              // 保留网格区域
              show: false
            },
            ...this.yAxis
          }
        ],
        dataZoom: this.dataZoom,
        calculable: false,
        series: this.series
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
