<template>
  <!--<div class="echartLayout">-->
    <div id="container" style="width:100%; height:100%; overflow:hidden;"></div>
  <!--</div>-->
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'shareStatistics',
  props: ['chart'],
  data () {
    return {

    }
  },
  watch: {
    chart: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('container'))
      serviceRequestCharts.setOption(this.chart)
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize()
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
  
</style>
