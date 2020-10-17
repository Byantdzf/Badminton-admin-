<template>
  <div style="width:100%;height: 100%;" id="classify_data_con"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'classifyData',
  props: ['classify'],
  watch: {
    classify: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('classify_data_con'))
      serviceRequestCharts.setOption(this.classify)
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize()
      })
    }
  },
  mounted () {
  }
}
</script>
