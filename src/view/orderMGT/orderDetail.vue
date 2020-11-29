<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="订单详情" name="adminList">
        <Form>
          <Row :gutter="22">
            <Col span="8">
              <Card title="订单信息">
                <FormItem label="用户ID" prop="account">
                  <span>{{ formValidate.user.id }}</span>
                </FormItem>
                <FormItem label="用户昵称" prop="account">
                  <span>{{ formValidate.user.name }}</span>
                </FormItem>
                <FormItem label="订单编号" prop="account">
                  <span>{{ formValidate.trade_no }}</span>
                </FormItem>
                <FormItem label="下单时间" prop="account">
                  <span>{{ formValidate.created_at }}</span>
                </FormItem>
                <FormItem label="支付时间" prop="account">
                  <span>{{ formValidate.updated_at }}</span>
                </FormItem>
                <FormItem label="支付方式" prop="account">
                  <span v-if="formValidate.pay_type == 'cash'">微信支付</span>
                  <span v-else>现金支付</span>
                </FormItem>
                <FormItem label="课程金额" prop="account">
                  <span>￥{{ formValidate.real_price }}</span>
                </FormItem>
                <FormItem label="用户昵称" prop="account">
                  <span>{{ formValidate.user?formValidate.user.name:"" }}</span>
                </FormItem>
                <FormItem label="购买类型" prop="account">
                  <span>{{ formValidate.status }}</span>
                </FormItem>
              </Card>
              <Card title="提成信息" style="margin-top: 16px;">
                <FormItem label="提成金额：" prop="account">
                  <span>{{ formValidate.push_money }}</span>
                </FormItem>
              </Card>
            </Col>
            <Col span="14">
              <Card title="课程信息">
                <Table border :columns="columns" :data="course"></Table>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Button @click="getBack" style="margin: 22px 0">返回</Button>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
// import config from '../../api/config'
import dropdown from '../components/dropdown'
// import Cookies from 'js-cookie'

export default {
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      formValidate: {},
      course: [],
      user: {},
      id: '',
      indeterminate: true,
      checkAll: false,
      columns: [
        {
          title: '课程名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '课程规格',
          align: 'center',
          key: 'specification'
        },
        {
          title: '数量',
          align: 'center',
          key: 'num'
        },
        {
          title: '单价',
          align: 'center',
          key: 'totalPrice'
        },
        {
          title: '合计',
          align: 'center',
          key: 'totalPrice'
        }
      ]
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
      console.log(this.formValidate)
    },
    getBack () {
      this.$router.back(-1)
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // =========
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
      uAxios.get(`orders/${self.id}?page=${page}`)
        .then(res => {
          let result = res.data.data
          this.formValidate = result
          this.course.push(result.course)
          this.user = result.user
          console.log(result)
          console.log(this.formValidate, this.course, this.user)
          if (result.data) {
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
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getlist(1)
    }
    console.log(this.$route.query)
  }
}
</script>

<style lang="less">
._bold {
  font-weight: bold;
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
