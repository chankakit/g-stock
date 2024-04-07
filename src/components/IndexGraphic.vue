<script setup>
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, computed, onMounted } from 'vue'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
]);

provide(THEME_KEY, "dark");

const props = defineProps({
  changePct: Number,
  graphicData: Array,
})

const gColor = computed(() => {
  let gColor1 = ''
  let gColor2 = ''

  if (props.changePct < 0) {
    gColor1 = 'rgb(0, 186, 146)'
    gColor2 = 'rgba(0, 186, 146, 0)'
  } else if (props.changePct > 0) {
    gColor1 = 'rgb(255, 41, 59)'
    gColor2 = 'rgba(255, 0, 0, 0)'
  } else {
    gColor1 = 'rgb(100, 100, 100)'
    gColor2 = 'rgba(100, 100, 100, 0)'
  }
  return [gColor1, gColor2]
})

const option = {
  xAxis: {
    show: false,
    type: 'category',
    boundaryGap: false,
    axisTick: {
      show: false,
    }
  },
  yAxis: {
    show: false,
    type: 'value',
    min: function (value) {
          return value.min - 5;
         }
  },
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  backgroundColor: 'transparent',
  series: [
    {
      data: props.graphicData,
      type: 'line',
      silent: true,
      lineStyle: {
        width: 0
      },
      emphasis: {
        disabled: true
      },
      showSymbol: false,
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: gColor.value[0]
          },
          {
            offset: 1,
            color: gColor.value[1]
          }
        ])
      }
    }
  ]
};
onMounted(() => {

})
</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style lang="scss" scoped>
$chartHeight: 110px;
.chart {
  height: $chartHeight;
  margin-top: 80px - $chartHeight;
  opacity: .4;
}
</style>
