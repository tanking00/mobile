<template>
  <div class="bm-charts"></div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    legend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    series: {
      type: Array,
      default: () => {
        return []
      }
    },
    tooltipFormatter: {
      type: [String, Function],
      default: '{b} : {c} ({d}%)'
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
    option() {
      return {
        backgroundColor: 'transparent',
        // animation: true,
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
        color: ['#ff1f34', '#ff7100', '#ffc600'],
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
