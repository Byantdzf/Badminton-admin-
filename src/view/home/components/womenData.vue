<template>
  <div style="width:100%;height: 100%;" id="women_data_con"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'womenData',
  props: ['womenUsers'],
  data () {
    return {

    }
  },
  watch: {
    womenUsers: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('women_data_con'))
      serviceRequestCharts.setOption(this.womenUsers)
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize()
      })
    }
  },
  mounted () {
  }
}
</script>
