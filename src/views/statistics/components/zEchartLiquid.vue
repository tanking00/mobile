<template>
  <div class="bm-charts"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-liquidfill'
require('echarts/theme/macarons')
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {
        return {
          name: '',
          value: 0
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
          }, 200)
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
    value() {
      return this.data.value
    },
    option() {
      return {
        backgroundColor: 'transparent',
        animation: false,
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
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['52.5%', '59%'],
            center: ['50%', '55%'],
            color: ['#488DFF'],
            hoverAnimation: false, // 设置饼图默认的展开样式
            label: {
              show: false
            },
            zlevel: 2,
            labelLine: {
              show: false
            },
            data: [100]
          },
          {
            type: 'pie',
            radius: ['52.3%', '59%'],
            center: ['50%', '55%'],
            color: ['transparent'],
            hoverAnimation: false, // 设置饼图默认的展开样式
            label: {
              show: false
            },
            zlevel: 1,
            labelLine: {
              show: false
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    borderWidth: 0, // 设置边框粗细
                    borderColor: '#336AFF' // 边框颜色
                  }
                }
              }
            ]
          },
          {
            type: 'pie',
            center: ['50%', '55%'],
            hoverAnimation: false, // 设置饼图默认的展开样式
            label: {
              show: false
            },
            zlevel: 0,
            labelLine: {
              show: false
            },
            cursor: 'auto',
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: { color: 'rgba(241,243,247,0.3)' },
                  emphasis: { color: 'rgba(241,243,247,0.3)' }
                }
              }
            ]
          },
          {
            type: 'liquidFill',
            radius: '52.3%',
            itemStyle: {
              normal: {
                opacity: 0.4,
                shadowBlur: 0,
                shadowColor: 'blue'
              }
            },

            name: this.title,
            data: [this.data, this.data.value / 100 - 0.1],
            backgroundStyle: {
              color: 'transparent',
              borderWidth: 0
            },
            zlevel: 1,
            color: [
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#CEE7FF'
                },
                {
                  offset: 1,
                  color: '#CEE7FF'
                }
              ])
            ],
            center: ['50%', '55%'],
            label: {
              normal: {
                textStyle: {
                  // 此处未生效本地生效
                  // 此处未生效本地生效
                },
                formatter: `{a|{b}}\n{font|${this.value}}{a|%}`,
                rich: {
                  font: {
                    fontSize: 48,
                    color: '#488DFF'
                  },
                  a: {
                    fontSize: 14,
                    lineHeight: 60,
                    color: '#333'
                  }
                }
              }
            },
            outline: {
              itemStyle: {
                borderColor: '#3166f5',
                borderWidth: 0
              },
              borderDistance: 0
            }
          }
        ]
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
      this.chart = echarts.init(this.$el)
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
