<template>
  <div style="width:100%;height: 100%;margin-top: 10px" id="men_data_con"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'menData',
  props: ['menUsers'],
  data () {
    return {

    }
  },
  watch: {
    menUsers: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('men_data_con'))
      serviceRequestCharts.setOption(this.menUsers)
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize()
      })
    }
  },
  mounted () {
  }
}
</script>
