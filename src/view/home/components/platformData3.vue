<template>
  <div style="width:40%;height: 400px;position: absolute;top: 410px;right: 0;" id="platform_data_con"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'platformData',
  props: ['platformList3'],
  data () {
    return {
    }
  },
  watch: {
    platformList3: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('platform_data_con'))
      serviceRequestCharts.setOption(this.platformList3)
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize()
      })
    }
  },
  mounted () {
  }
}
</script>
