<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="团课详情" name="adminList">
        <Form>
          <Row :gutter="22">
            <Col span="8">
              <Card title="基础信息">
                <FormItem label="课程类型：" prop="account">
                  <span>团课</span>
                </FormItem>
                <FormItem label="课程名称：" prop="account">
                  <span>Mamba 第一课</span>

                </FormItem>
                <FormItem label="所属球场：" prop="account">
                  <span>洛杉矶球场</span>
                </FormItem>
                <FormItem label="所属教练：" prop="account">
                  <span>mamba</span>
                </FormItem>
                <FormItem label="课程图片：" prop="account">
                  <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg" alt="" width="140">
                </FormItem>
                <FormItem label="课程详请信息：" prop="account">
                  <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.</span>
                </FormItem>
                <FormItem label="状态" prop="account">
                  <span>上架</span>/
                  <span>下架</span>
                </FormItem>
              </Card>
              <Col span="10">
                <Card title="课程规格属性" style="margin-top: 16px;">
                  <p class="skuBox">十次卡</p>
                  <p></p>
                  <p class="skuBox">二十次卡</p>
                </Card>
              </Col>
            </Col>
            <Col span="14">
              <Card title="库存价格管理">
                <Table border :columns="columns" :data="data"></Table>
              </Card>
            </Col>
            <Col span="8">
              <Card title="课程表" style="margin-top: 22px;">
                <Table border :columns="columns1" :data="data"></Table>
              </Card>
            </Col>
            <!--            <Col span="6">-->
            <!--              <Card title="个人资料信息">-->
            <!--                <FormItem label="姓名" prop="account">-->
            <!--                  <span>小王</span>-->
            <!--                </FormItem>-->
            <!--                <FormItem label="性别" prop="account">-->
            <!--                  <span>男</span>-->
            <!--                </FormItem>-->
            <!--                <FormItem label="出生年月日" prop="account">-->
            <!--                  <span>1995-12-9</span>-->
            <!--                </FormItem>-->
            <!--                <FormItem label="电话" prop="account">-->
            <!--                  <span>15707534403</span>-->
            <!--                </FormItem>-->
            <!--                <FormItem label="用户状态" prop="account">-->
            <!--                  <span>禁用</span>-->
            <!--                </FormItem>-->
            <!--                <FormItem label="预期收获" prop="account">-->
            <!--                  <span>增强抵抗力</span>-->
            <!--                </FormItem>-->
            <!--                <FormItem label="正在培训课程" prop="account">-->
            <!--                  <span>培训班</span>-->
            <!--                </FormItem>-->
            <!--              </Card>-->
            <!--            </Col>-->
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <!--    <Row :gutter="20">-->
    <!--      <Col span="20">-->
    <!--        <Tabs style="margin: 22px 0;">-->
    <!--          <TabPane label="购买课程信息" name="course">-->
    <!--            <Table border :columns="columns" :data="data"></Table>-->
    <!--          </TabPane>-->
    <!--          <TabPane label="运动轨迹信息" name="exercise">-->
    <!--            <Table border :columns="columns2" :data="data2"></Table>-->
    <!--          </TabPane>-->
    <!--        </Tabs>-->
    <!--      </Col>-->
    <!--    </Row>-->
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
      formValidate: {
        state: 'start', // 状态
        name: '',
        mail: '',
        role: '',
        mobile: '',
        account: '', // 账号
        password: '', // 密码
        confirmPassword: '', // 确认密码
        desc: ''
      },
      indeterminate: true,
      checkAll: false,
      checkAllGroup: ['香蕉', '西瓜'],
      columns: [
        {
          title: '规格',
          key: 'name',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', 'XXX')
            ])
          }
        },
        {
          // width: 150,
          title: '上课人数',
          align: 'center',
          key: 'specification'
        },
        {
          // width: 150,
          title: '库存',
          align: 'center',
          key: 'num'
        },
        {
          // width: 150,
          title: '销售价',
          align: 'center',
          key: 'totalPrice'
        }
      ],
      columns1: [
        {
          title: '课时',
          key: 'name',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', 'XXX')
            ])
          }
        },
        {
          title: '时间',
          align: 'center',
          key: 'specification'
        }
      ],
      data: [
        {
          name: 'John Brown',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        },
        {
          name: 'Jim Green',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        },
        {
          name: 'Joe Black',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '续费',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        },
        {
          name: 'Jon Snow',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        }
      ]
    }
  },
  methods: {
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        this.checkAllGroup = ['香蕉', '苹果', '西瓜']
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === 3) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
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
    console.log(this.$route.query)
  }
}
</script>

<style lang="less">
.skuBox {
  padding: 8px 22px;border: 1px solid #bbbaba;width: 120px;text-align: center;margin-top: 12px;
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
