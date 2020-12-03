<template>
<!--  系统流水汇总-->
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="系统流水" name="adminList">
        <Card style="margin-bottom: 32px">
          <Row :gutter="20">
            <Col span="20">
              <span>支付方式：</span>
              <Select v-model="SelectValue" style="width:200px;margin-right: 20px;">
                <Option value="" label="全部"></Option>
                <Option value="wechat" label="微信支付"></Option>
                <Option value="cash" label="现金支付"></Option>
              </Select>
              <span>搜索关键词：</span>
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."
                style="width: 200px;"/>
            </Col>
            <Col span="20" style="margin-top: 32px">
              <span>下单时间：</span>
              <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate"style="width:200px;margin-right: 20px;"></DatePicker>
            </Col>
          </Row>
          <div style="margin-top: 22px;">
            <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
            <Button type="primary" style="margin-left: 12px; " @click="reset('addAuthorizationUser')">重置</Button>
          </div>
        </Card>
        <Col span="16" class="height-100">
          <Row type="flex" align="middle" class="height-100 ">
            <count-up
              class="infor-card-count user-created-count cardStyle"
              :id-name="item.name"
              :end-val="item.endVal"
              color="#f84646"
              v-for="item of countList"
            >
              <p class="infor-intro-text" slot="intro">{{item.text}}</p>
            </count-up>
          </Row>
        </Col>
        <Row :gutter="20">
          <Col span="20">
          </Col>
        </Row>
        <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="exportFn()">
          导出
        </Button>
        <Table :loading="loading" ref="selection" :columns="orgColumns" :data="information" style="width: 100%;"
               border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
              style="margin-top:30px;margin-bottom:30px;" show-elevator></Page>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
import countUp from './components/countUp.vue'
// import config from '../../api/config'
import dropdown from '../components/dropdown'
import config from '@/config'
// import Cookies from 'js-cookie'

export default {
  components: {
    dropdown: dropdown,
    countUp: countUp
  },
  data () {
    return {
      countList: [
        {
          text: '历史总收入（元）',
          endVal: 0,
          name: 'idName1'
        },
        {
          text: '昨日总收入（元）',
          endVal: 0,
          name: 'idName2'
        },
        {
          text: '上周总收入（元）',
          endVal: 0,
          name: 'idName3'
        },
        {
          text: '上月总收入（元）',
          endVal: 0,
          name: 'idName4'
        }
      ],
      beginDate: [], // 反馈时间
      CheckboxValue: false,
      SelectValue: '',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        {
          title: '流水号',
          key: 'order_no',
          align: 'center',
          width: 100
        },
        {
          title: '昵称',
          key: 'id',
          align: 'center',
          render: (h, params) => {
            if (params.row.user) {
              return h('span', {
              }, params.row.user.name)
            } else {
              return h('span', '未获取')
            }
          }
        },
        {
          title: '价格',
          key: 'price',
          align: 'center'
        },
        {
          title: '实付价格',
          key: 'real_price',
          align: 'center'
        },
        {
          title: '关联订单',
          key: 'trade_no',
          align: 'center'
        },
        {
          title: '类型',
          key: 'pay_type',
          align: 'center',
          render: (h, params) => {
            if (params.row.pay_type == 'wechat') {
              return h('span', '微信支付')
            } else {
              return h('span', '现金支付')
            }
          }
        },
        {
          title: '发生时间',
          key: 'updated_at',
          align: 'center'
        }
      ],
      information: [],
      loading: false
    }
  },
  methods: {
    exportFn () { // 导出数据
      let baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
      let oa = document.createElement('a')
      oa.href = `${baseUrl}export/running/account`
      oa.download = 'htmltable-base64.xls'// 通过A标签 设置文件名
      oa.click()
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
    reset () {
      this.beginDate = []
      this.SelectValue = ''
      this.searchKeyword = '' // 搜索
      this.$Message.info('已重置')
    },
    gotoPage (title) {
      this.$router.push({
        name: title,
        query: { id: '12' }
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    batchFn () {
      this.$Message.info('This is a test')
    },
    handlePage (num) { // 分页
      this.getlist(num)
    },
    getlist (page) {
      let self = this
      self.loading = true
      if (this.beginDate[0] && this.beginDate[1]) {
        this.beginDate[0] = this.format(this.beginDate[0], 'yyyy-MM-dd HH:ss')
        this.beginDate[1] = this.format(this.beginDate[1], 'yyyy-MM-dd HH:ss')
      }
      uAxios.get(`running/account?page=${page}&keyword=${self.searchKeyword}&start_time=${this.beginDate[0]}&end_time=${this.beginDate[1]}&pay_type=${this.SelectValue}`)
        .then(res => {
          let result = res.data.data
          self.countList[0].endVal = result.total_income
          self.countList[1].endVal = result.day_income
          self.countList[2].endVal = result.week_income
          self.countList[3].endVal = result.month_income
          console.log(result)
          if (result.orders.data) {
            self.information = result.orders.data
            self.orgTotal = result.orders.total
            console.log(this.information)
          }
          self.loading = false
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    this.getlist(1)
  }
}
</script>

<style lang="less">
.cardStyle {
  padding: 12px 24px;
  margin: 0 28px 32px 4px;
  box-shadow: 1px 1px 12px #dcdcdc;
  border-radius: 4px;
}

.ivu-tree-title-selected, .ivu-tree-title-selected:hover {
  background-color: #d5e8fc;
  position: relative;
  padding-right: 22px;

  &:after {
    content: '';
    position: absolute;
    right: 4px;
    top: 5px;
    width: 12px;
    height: 18px;
    background-image: url("http://images.ufutx.com/201905/15/c09ba0a5ed976879bc389cc9cfd8c43a.png");
    background-size: contain;
    background-repeat: no-repeat;
  }

  /*box-shadow: 1px 1px 12px #d3d3d3;*/
}
</style>
