<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="用户信息" name="adminList">
        <Form>
          <Row :gutter="16">
            <Col span="6">
              <Card title="基本信息">
                <FormItem label="头像：" prop="account">
                  <img :src="userInfo.photo || image"
                       alt="" width="80rpx" style="margin: 12px 22px 0 -6px;border: 2px solid #f3f3f3;">
                </FormItem>
                <FormItem label="用户ID" prop="account">
                  <span>{{userInfo.id}}</span>
                </FormItem>
                <FormItem label="昵称" prop="account">
                  <span>{{userInfo.name}}</span>
                </FormItem>
                <FormItem label="手机号" prop="account">
                  <span>{{userInfo.mobile}}</span>
                </FormItem>
                <FormItem label="所属门店" prop="account">
                  <span>李宁店铺</span>
                </FormItem>
                <FormItem label="账号状态" prop="account">
                  <span v-if="userInfo.is_show">启用</span>
                  <span v-else>禁用</span>
                </FormItem>
                <FormItem label="注册时间" prop="account">
                  <span>{{userInfo.created_at}}</span>
                </FormItem>
                <FormItem label="最近登录时间" prop="account">
                  <span>{{userInfo.updated_at}}</span>
                </FormItem>
              </Card>
            </Col>
            <Col span="6">
              <Card title="个人资料信息">
                <FormItem label="姓名" prop="account">
                  <span>小王</span>
                </FormItem>
                <FormItem label="性别" prop="account">
                  <span>男</span>
                </FormItem>
                <FormItem label="出生年月日" prop="account">
                  <span>1995-12-9</span>
                </FormItem>
                <FormItem label="电话" prop="account">
                  <span>15707534403</span>
                </FormItem>
                <FormItem label="用户状态" prop="account">
                  <span>禁用</span>
                </FormItem>
                <FormItem label="预期收获" prop="account">
                  <span>增强抵抗力</span>
                </FormItem>
                <FormItem label="正在培训课程" prop="account">
                  <span>培训班</span>
                </FormItem>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Row :gutter="20">
      <Col span="20">
        <Tabs style="margin: 22px 0;">
          <TabPane label="购买课程信息" name="course">
            <Table border :columns="columns" :data="data"></Table>
          </TabPane>
          <TabPane label="运动轨迹信息" name="exercise">
            <Table border :columns="columns2" :data="data2"></Table>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
    <Button @click="getBack" style="margin-left: 8px">返回</Button>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
// import config from '../../api/config'
import dropdown from '../components/dropdown'
// import Cookies from 'js-cookie'

export default {
  name: 'authorization',
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      userInfo: {},
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
      image: 'https://images.ufutx.com/202011/16/f3defb534a8d8587179cb32f4d561bca.jpeg',
      indeterminate: true,
      checkAll: false,
      checkAllGroup: ['香蕉', '西瓜'],
      columns: [
        {
          title: '课程ID',
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
              h('strong', '1212')
            ])
          }
        },
        {
          title: '课程名称',
          align: 'center',
          key: 'age'
        },
        {
          title: '课程图片',
          width: 80,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.pic
              },
              style: {
                width: '48px',
                height: '48px',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                  // let argu = {id: params.row.id}
                  // this.$router.push({
                  //   name: 'user_detail',
                  //   params: argu
                  // })
                }
              }
            })
          },
          align: 'center'
        },
        {
          width: 150,
          title: '课程规格',
          align: 'center',
          key: 'specification'
        },
        {
          width: 150,
          title: '剩余次数',
          align: 'center',
          key: 'num'
        },
        {
          width: 150,
          title: '销售价（元）',
          align: 'center',
          key: 'price'
        },
        {
          title: '购买类型',
          align: 'center',
          width: 150,
          key: 'address'
        },
        {
          title: '更新时间',
          align: 'center',
          width: 150,
          key: 'time'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '增加次数')
            ])
          }
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
          time: '2020-08-12 12:56'
        },
        {
          name: 'Jim Green',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56'
        },
        {
          name: 'Joe Black',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '续费',
          time: '2020-08-12 12:56'
        },
        {
          name: 'Jon Snow',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56'
        }
      ],
      columns2: [
        {
          title: '用户ID',
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
              h('strong', '1212')
            ])
          }
        },
        {
          title: '用户名称',
          align: 'center',
          key: 'age'
        },
        {
          title: '视频类型',
          align: 'center',
          key: 'age'
        },
        {
          title: '视频标题',
          align: 'center',
          key: 'age'
        },
        {
          title: '教练名称',
          align: 'center',
          key: 'age'
        },
        {
          title: '评星等级',
          align: 'center',
          key: 'age'
        },
        {
          title: '评论内容',
          align: 'center',
          width: 150,
          key: 'address'
        },
        {
          title: '发布时间',
          align: 'center',
          width: 150,
          key: 'time'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '查看'),
              h('span', {
                style: {
                  color: '#ed4014',
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data2: [
        {
          name: 'John Brown',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56'
        },
        {
          name: 'Jim Green',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56'
        },
        {
          name: 'Joe Black',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '续费',
          time: '2020-08-12 12:56'
        },
        {
          name: 'Jon Snow',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56'
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
      uAxios.get(`users/1?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          self.userInfo = res.data.data
          console.log(self.userInfo)
          let result = res.data.data
          if (result.data) {
            self.information = result.data.map((item) => {
              let { user } = item
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
