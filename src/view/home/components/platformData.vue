<template>
  <div style="width:40%;height: 100%;" id="report_data_con"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'reportData',
  props: ['platformList2'],
  data () {
    return {
    }
  },
  watch: {
    platformList2: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('report_data_con'))
      serviceRequestCharts.setOption(this.platformList2)
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize()
      })
    }
  },
  mounted () {
  }
}
</script>
