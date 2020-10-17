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
                <Option value="全部" label="全部"></Option>
                <Option value="微信" label="微信"></Option>
                <Option value="现金支付" label="现金支付"></Option>
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
        <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="reset('addAuthorizationUser')">
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
// import Cookies from 'js-cookie'

export default {
  name: 'authorization',
  components: {
    dropdown: dropdown,
    countUp: countUp
  },
  data () {
    return {
      countList: [
        {
          text: '历史总收入（元）',
          endVal: 200.00,
          name: 'idName1'
        },
        {
          text: '昨日总收入（元）',
          endVal: 12.00,
          name: 'idName2'
        },
        {
          text: '上周总收入（元）',
          endVal: 52.00,
          name: 'idName3'
        },
        {
          text: '上月总收入（元）',
          endVal: 68.00,
          name: 'idName4'
        }
      ],
      beginDate: '', // 反馈时间
      CheckboxValue: false,
      SelectValue: '全部',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        {
          title: '流水号',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '昵称',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '类型',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '金额',
          key: 'type',
          align: 'center'
        },
        {
          title: '关联订单',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '支付方式',
          key: 'type',
          align: 'center'
        },
        {
          title: '到账方式',
          key: 'type',
          align: 'center'
        },
        {
          title: '发生时间',
          key: 'type',
          align: 'center'
        }
      ],
      information: [],
      loading: false
    }
  },
  methods: {
    reset () {
      this.$Message.info('This is a 重置')
    },
    gotoPage (title) {
      this.$router.push({
        name: title,
        query: {id: '12'}
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
      uAxios.get(`admin/admins?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data.map((item) => {
              let {user} = item
              user.adminId = item.id
              user.created_at = item.created_at
              user.sex = user.sex == 1 ? '男' : '女'
              user.type = user.type == 'single' ? '单身' : '介绍人'
              user.admin_type = item.type == 'SUPER' ? '超级管理员' : `《${item.paas.title}》管理员`
              return user
            })
            self.orgTotal = result.total
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
