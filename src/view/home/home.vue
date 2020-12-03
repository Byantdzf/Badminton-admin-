<template>
  <div id="name" >
    <Card :bordered="false">
      <div slot="title">
        <span style="font-weight: bold;">筛选所有用户：</span>
        <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate" @on-change="getNewData" style="width: 280px"></DatePicker>
        <div style="margin-top: 10px">
          <span style="font-weight: bold;">筛选新增用户：</span>
          <DatePicker type="date" placeholder="选择查询时间" @on-change="changeDate" :value="date" style="width: 200px"></DatePicker>
        </div>
      </div>
      <div>
        <Row :gutter="5">
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="allUser_count"
              :end-val="count1.allUser"
              iconType="android-person-add"
              color="#2d8cf0"
              intro-text="所有用户"
            ></infor-card>
          </Col>
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="certificationUser_count"
              :end-val="count1.certificationUser"
              iconType="android-person-add"
              color="#ffd572"
              intro-text="认证用户"
            ></infor-card>
          </Col>
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="shutDownDataUser_count"
              :end-val="count1.shutDownDataUser"
              iconType="android-person-add"
              color="#000000"
              intro-text="关闭资料"
            ></infor-card>
          </Col>
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="single_count"
              :end-val="count1.single"
              iconType="android-person-add"
              color="#2B2CF2"
              intro-text="单身用户"
            ></infor-card>
          </Col>
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="references_count"
              :end-val="count1.references"
              iconType="android-person-add"
              color="#f25e43"
              intro-text="介绍人"
            ></infor-card>
          </Col>
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="user_created_count"
              :end-val="count.createUser"
              iconType="android-person-add"
              color="#E6F232"
              intro-text="今日新增用户"
            ></infor-card>
          </Col>
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="collection_count"
              :end-val="count.collection"
              iconType="android-person-add"
              color="#F26C8C"
              intro-text="+单身"
            ></infor-card>
          </Col>
          <Col :xs="20" :sm="10" :md="5" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="transfer_count"
              :end-val="count.transfer"
              iconType="android-person-add"
              color="#CB5CF2"
              intro-text="+介绍人"
            ></infor-card>
          </Col>
        </Row>
      </div>
      <!--<div>-->
        <!--<Row :gutter="5">-->
          <!---->
        <!--</Row>-->
      <!--</div>-->
    </Card>
    <Card style="margin-top: 22px;">
      <Tabs @on-click="getTab">
        <TabPane label="最近七天注册人数" name="0">
          <Row class="margin-top-10">
            <h4 style="text-align: center;margin: 22px;">本周营销总收入：{{income}}</h4>
            <div class="line-chart-con">
              <service-requests :option="option"></service-requests>
            </div>
          </Row>
        </TabPane>
        <TabPane label="年龄分布" name="1" v-if="access === 'admin'">
          <Row class="margin-top-10">
            <div class="line-chart-con">
              <classify-data :classify="classify"></classify-data>
            </div>
          </Row>
        </TabPane>
        <TabPane label="男女分布" name="2" v-if="access === 'admin'">
          <Row class="margin-top-10">
            <div class="line-chart-con">
              <men-data :menUsers="menUsers"></men-data>
            </div>
          </Row>
        </TabPane>
        <TabPane label="周收入报表" name="3" v-if="access === 'admin'">
          <Row class="margin-top-10">
            <h4 style="text-align: center;margin: 22px;">幻鹰数据</h4>
            <div class="line-chart-con">
              <report-data :columnar="columnar"></report-data>
            </div>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import uAxios from '../../api/index'
import inforCard from './components/inforCard.vue'
import serviceRequests from './components/serviceRequests.vue'
import reportData from './components/reportData.vue'
import classifyData from './components/classifyData.vue'
import menData from './components/menData.vue'

export default {
  name: 'home',
  components: {
    inforCard,
    serviceRequests,
    reportData,
    menData,
    classifyData
  },
  data () {
    return {
      value1: false,
      count: {
        createUser: 0, // 新增总数
        collection: 0, // 单身
        transfer: 0 // 介绍人
      },
      count1: {
        allUser: 0, // 所有用户
        certificationUser: 0, // 认证用户
        shutDownDataUser: 0, // 关闭资料用户
        single: 0, // 单身
        references: 0, // 介绍人
        sex_group: [], // 性别
        age_group: [], // 年龄
        age_sex: []
      },
      beginDate: [],
      date: '', // 当前日期
      income: '', // 周总收入
      Data_arr: {}, // XY轴参数
      option: {}, // 折线图参数
      columnar: {},
      classify: {},
      menUsers: {},
      womenUsers: {},
      Data_newArr: {},
      start_time: [],
      activeTab: '0',
      money: '',
      womenProportion: '',
      menProportion: '',
      unknownProportion: '',
      access: localStorage.getItem('access')
    }
  },
  methods: {
    getTab (type) {
      // 获得激活的Tab页
      console.log(type)
      this.activeTab = type
      if (this.activeTab == 1 || this.activeTab == 2) {
        this.classifyData()
      } else if (this.activeTab == 3) {
        this.newData()
      }
    },
    changeDate (res) {
      this.date = res
      console.log(res, '6363')
      uAxios.get(`admin/daliy/stat?start_time=${this.date}`)
        .then(res => {
          let result = res.data.data
          this.count = {
            createUser: result.courtship_count + result.marriage_count,
            collection: result.courtship_count,
            transfer: result.marriage_count
          }
        })
      uAxios.get(`admin/week/stat`)
        .then(res => {
          let result = res.data.data
          console.log(result)
          this.Data_arr.xData = result.day_arr
          this.Data_arr.marriage_arr = result.marriage_arr
          this.Data_arr.courtship_arr = result.courtship_arr
          this.income = result.income
          let self = this
          this.option = {
            legend: {
              data: ['介绍人人数', '单身人数']
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: self.Data_arr.xData
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '介绍人人数',
                type: 'line',
                areaStyle: {
                  normal: {
                    color: '#f25e43'
                  }
                },
                data: self.Data_arr.marriage_arr
              },
              {
                name: '单身人数',
                type: 'line',
                areaStyle: {
                  normal: {
                    color: '#ffd572'
                  }
                },
                data: self.Data_arr.courtship_arr
              }
            ]
          }
        })
    },
    format (time, format) {
      var t = new Date(time)
      var tf = function (i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
            break
          case 'MM':
            return tf(t.getMonth() + 1)
            break
          case 'mm':
            return tf(t.getMinutes())
            break
          case 'dd':
            return tf(t.getDate())
            break
          case 'HH':
            return tf(t.getHours())
            break
          case 'ss':
            return tf(t.getSeconds())
            break
        }
      })
    },
    getNewData () {
      this.getData()
      this.classifyData()
    },
    getData () {
      if (this.beginDate[0] && this.beginDate[1]) {
        this.beginDate[0] = this.format(this.beginDate[0], 'yyyy-MM-dd HH:ss')
        this.beginDate[1] = this.format(this.beginDate[1], 'yyyy-MM-dd HH:ss')
      }
      let self = this
      uAxios.get(`admin/user/count?start_time=${this.beginDate[0]}&end_time=${this.beginDate[1]}`)
        .then(res => {
          let result = res.data.data
          this.count1 = {
            allUser: result.user_count.all,
            certificationUser: result.user_count.is_approved,
            shutDownDataUser: result.user_count.hidden_profile,
            single: result.user_count.single,
            references: result.user_count.marriage
          }
        })
    },
    classifyData () {
      if (this.beginDate[0] && this.beginDate[1]) {
        this.beginDate[0] = this.format(this.beginDate[0], 'yyyy-MM-dd HH:ss')
        this.beginDate[1] = this.format(this.beginDate[1], 'yyyy-MM-dd HH:ss')
      }
      uAxios.get(`admin/user/count?start_time=${this.beginDate[0]}&end_time=${this.beginDate[1]}`)
        .then(res => {
          let result = res.data.data
          this.count1 = {
            allUser: result.user_count.all,
            certificationUser: result.user_count.is_approved,
            shutDownDataUser: result.user_count.hidden_profile,
            single: result.user_count.single,
            references: result.user_count.marriage,
            age_sex: result.user_count.age_sex,
            age_group: result.user_count.age_group,
            sex_group: result.user_count.sex_group
          }
          if (this.count1.sex_group.length != 0) {
            this.womenProportion = parseFloat(parseInt(this.count1.sex_group[2]) / (parseInt(this.count1.sex_group[0]) + parseInt(this.count1.sex_group[1]) + parseInt(this.count1.sex_group[2]))).toFixed(2) * 100 + '%'
            this.menProportion = parseFloat(parseInt(this.count1.sex_group[1]) / (parseInt(this.count1.sex_group[0]) + parseInt(this.count1.sex_group[1]) + parseInt(this.count1.sex_group[2]))).toFixed(2) * 100 + '%'
            this.unknownProportion = parseFloat(parseInt(this.count1.sex_group[0]) / (parseInt(this.count1.sex_group[0]) + parseInt(this.count1.sex_group[1]) + parseInt(this.count1.sex_group[2]))).toFixed(2) * 100 + '%'
          } else {
            this.womenProportion = '0%'
            this.menProportion = '0%'
            this.unknownProportion = '0%'
          }
          console.log(this.count1.age_sex['21-30'][1], '123')
          let self = this
          if (self.activeTab == 1) {
            this.classify = {
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                orient: 'vertical',
                left: 10,
                data: ['20岁以下', '21-30岁', '30-41岁', '41-50岁', '51-60岁', '61岁以上']
              },
              series: [
                {
                  name: '幻鹰数据',
                  type: 'pie',
                  selectedMode: 'single',
                  radius: [0, '30%'],

                  label: {
                    position: 'inner'
                  },
                  labelLine: {
                    show: false
                  }
                },
                {
                  name: '幻鹰数据',
                  type: 'pie',
                  radius: ['40%', '55%'],
                  label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    rich: {
                      a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                      },
                      hr: {
                        borderColor: '#aaa',
                        width: '100%',
                        borderWidth: 0.5,
                        height: 0
                      },
                      b: {
                        fontSize: 16,
                        lineHeight: 33
                      },
                      per: {
                        color: '#eee',
                        backgroundColor: '#334455',
                        padding: [2, 4],
                        borderRadius: 2
                      }
                    }
                  },
                  data: [
                    { value: self.count1.age_group.length == 0 ? 0 : self.count1.age_group[2].count, name: '31-40岁' },
                    { value: self.count1.age_group.length == 0 ? 0 : self.count1.age_group[1].count, name: '21-30岁' },
                    { value: self.count1.age_group.length == 0 ? 0 : self.count1.age_group[5].count, name: '61岁以上' },
                    { value: self.count1.age_group.length == 0 ? 0 : self.count1.age_group[0].count, name: '20岁以下' },
                    { value: self.count1.age_group.length == 0 ? 0 : self.count1.age_group[3].count, name: '41-50岁' },
                    { value: self.count1.age_group.length == 0 ? 0 : self.count1.age_group[4].count, name: '51-60岁' }
                  ]
                }
              ]
            }
          } else {
            this.menUsers = {
              color: ['#323CF0'],
              title: {
                text: '幻鹰数据',
                subtext: '总人数 ' + (parseInt(this.count1.sex_group.length == 0 ? 0 : this.count1.sex_group[0]) + parseInt(this.count1.sex_group.length == 0 ? 0 : this.count1.sex_group[1]) + parseInt(this.count1.sex_group.length == 0 ? 0 : this.count1.sex_group[2])),
                left: 'left',
                padding: [0, 0, 14, 0],
                textStyle: {
                  color: '#323CF0'
                }
              },
              legend: {
                data: ['男性比例：' + this.menProportion, '女性比例：' + this.womenProportion, '未知用户：' + this.unknownProportion]
              },
              tooltip: {
                show: true,
                feature: {
                  dataView: { show: true, readOnly: false },
                  magicType: { show: true, type: ['line', 'bar'] },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              calculable: true,
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: ['20岁以下', '21-30岁', '31-40岁', '41-50岁', '51-60岁', '61岁以上'],
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '男性比例：' + this.menProportion,
                  type: 'bar',
                  data: [this.count1.age_sex['20'].length == 0 ? 0 : this.count1.age_sex['20'][1], this.count1.age_sex['21-30'].length == 0 ? 0 : this.count1.age_sex['21-30'][1], this.count1.age_sex['31-40'].length == 0 ? 0 : this.count1.age_sex['31-40'][1], this.count1.age_sex['41-50'].length == 0 ? 0 : this.count1.age_sex['41-50'][1], this.count1.age_sex['51-60'].length == 0 ? 0 : this.count1.age_sex['51-60'][1], this.count1.age_sex['61'].length == 0 ? 0 : this.count1.age_sex['61'][1]],
                  itemStyle: {
                    emphasis: { color: '#323CF0' },
                    normal: {
                      color: function (params) {
                        var colorList = ['rgb(50,63,240)']
                        return colorList[params.dataIndex]
                      },
                      label: {
                        show: true,
                        position: 'top',
                        textstyle: { color: 'black', fontSize: 14 }
                      }
                    }
                  }
                },
                {
                  name: '女性比例：' + this.womenProportion,
                  type: 'bar',
                  data: [this.count1.age_sex['20'].length == 0 ? 0 : this.count1.age_sex['20'][2], this.count1.age_sex['21-30'].length == 0 ? 0 : this.count1.age_sex['21-30'][2], this.count1.age_sex['31-40'].length == 0 ? 0 : this.count1.age_sex['31-40'][2], this.count1.age_sex['41-50'].length == 0 ? 0 : this.count1.age_sex['41-50'][2], this.count1.age_sex['51-60'].length == 0 ? 0 : this.count1.age_sex['51-60'][2], this.count1.age_sex['61'].length == 0 ? 0 : this.count1.age_sex['61'][2]],
                  itemStyle: {
                    emphasis: { color: '#ff0006' },
                    normal: {
                      color: function (params) {
                        var colorList = ['rgb(255,0,0)']
                        return colorList[params.dataIndex]
                      },
                      label: {
                        show: true,
                        position: 'top',
                        textstyle: { color: 'black', fontSize: 14 }
                      }
                    }
                  }
                },
                {
                  name: '未知用户：' + this.unknownProportion,
                  type: 'bar',
                  data: [this.count1.age_sex['20'].length == 0 ? 0 : this.count1.age_sex['20'][0], this.count1.age_sex['21-30'].length == 0 ? 0 : this.count1.age_sex['21-30'][0], this.count1.age_sex['31-40'].length == 0 ? 0 : this.count1.age_sex['31-40'][0], this.count1.age_sex['41-50'].length == 0 ? 0 : this.count1.age_sex['41-50'][0], this.count1.age_sex['51-60'].length == 0 ? 0 : this.count1.age_sex['51-60'][0], this.count1.age_sex['61'].length == 0 ? 0 : this.count1.age_sex['61'][0]],
                  itemStyle: {
                    emphasis: { color: '#9f9f95' },
                    normal: {
                      color: function (params) {
                        var colorList = ['rgb(159,159,159)']
                        return colorList[params.dataIndex]
                      },
                      label: {
                        show: true,
                        position: 'top',
                        textstyle: { color: 'black', fontSize: 14 }
                      }
                    }
                  }
                }
              ]
            }
          }
        })
    },
    newData () {
      uAxios.get('admin/weeks/stat')
        .then(res => {
          let result = res.data.data
          this.start_time = []
          this.Data_newArr.xDay = result.time_arr.map((item) => {
            return {
              start_time: item.start_time
            }
          })
          for (let i in this.Data_newArr.xDay) {
            this.start_time.push(this.Data_newArr.xDay[i].start_time)
          }
          console.log(this.start_time, '5464645')
          this.Data_newArr.activity_cash_arr = result.activity_cash_arr // 活动金额
          this.Data_newArr.pay_orders_cash_arr = result.pay_orders_cash_arr // 订单金额
          this.Data_newArr.award_cash_arr = result.award_cash_arr // 推荐注册金额
          this.Data_newArr.approve_refund_cash_arr = result.approve_refund_cash_arr // 认证退款金额
          let self = this
          this.columnar = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['认证退款金额', '订单金额', '活动金额', '推荐注册金额']
            },
            calculable: true,
            animation: true,
            xAxis: [
              {
                type: 'category',
                data: self.start_time
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '认证退款金额',
                type: 'bar',
                data: self.Data_newArr.approve_refund_cash_arr,
                itemStyle: {
                  emphasis: { color: '#19F0CD' },
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(25,240,205)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: { color: 'black', fontSize: 14 }
                    }
                  }
                }
              },
              {
                name: '订单金额',
                type: 'bar',
                data: self.Data_newArr.pay_orders_cash_arr,
                itemStyle: {
                  emphasis: { color: '#2999B7' },
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(41,153,183)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: { color: 'black', fontSize: 14 }
                    }
                  }
                }
              },
              {
                name: '活动金额',
                type: 'bar',
                data: self.Data_newArr.activity_cash_arr,
                itemStyle: {
                  emphasis: { color: '#F27844' },
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(242,120,68)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: { color: 'black', fontSize: 14 }
                    }
                  }
                }
              },
              {
                name: '推荐注册金额',
                type: 'bar',
                data: self.Data_newArr.award_cash_arr,
                itemStyle: {
                  emphasis: { color: '#909090' },
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(114,114,114)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: { color: 'black', fontSize: 14 }
                    }
                  }
                }
              }
            ]
          }
        })
    }
  },
  mounted () {
    var myDate = new Date()
    this.date = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`
    this.getData()
    this.classifyData()
    this.changeDate()
  }
}
</script>

<style lang="less">
  .line-chart-con {
    height: 300px;
  }
  .height-100{
    text-align: center;
  }
  /*.ivu-tabs-bar{*/
  /*margin-bottom: 0;*/
  /*margin-top: 15px;*/
  /*background: #fff;*/
  /*}*/
  /*.ivu-tabs-nav{*/
  /*padding: 10px 0 10px 0;*/
  /*font-weight: bold;*/
  /*}*/
  /*.ivu-row-flex{*/
  /*border-radius: 4px;*/
  /*border-top-left-radius: 0;*/
  /*margin-left: -4px;*/
  /*border: 1px solid #dcdee2;*/
  /*border-color: #e8eaec;*/
  /*}*/
  /*.infor-card-icon-con{*/
  /*z-index: 999;*/
  /*}*/
  /*.ivu-card-bordered{*/
  /*border: 0;*/
  /*}*/
</style>
