<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane :label="title" name="adminList">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="22">
            <Col span="12">
              <Card title="基础信息">
                <FormItem label="课程名称：" prop="account">
                  <Input v-model="formItem.input" placeholder="请输入..." style="max-width:220px;"></Input>
                </FormItem>
                <FormItem label="所属球场：" prop="account">
                  <Select v-model="formItem.ballPark" style="width:100px;margin-right: 16px;">
                    <Option value="球场名字" label="球场名字"></Option>
                    <Option value="球场名字1" label="球场名字1"></Option>
                  </Select>
                </FormItem>
                <FormItem label="课程图片：" prop="account">
                  <img
                    src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg"
                    alt="" width="140">
                  <Button style="width: 58px;height:58px;line-height: 48px; margin-left: 22px;margin-top: -42px;">
                    <Icon type="ios-images" size="28"/>
                  </Button>
                </FormItem>
                <FormItem label="课程详请信息：" prop="account">
                  <tinymce-editor ref="editor"
                                  v-model="formItem.msg"
                                  style="max-width: 600px;height: 200px;">
                  </tinymce-editor>
                </FormItem>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Button type="primary" style="margin-right: 22px; " @click="saveFn()">保存</Button>
    <Button @click="getBack" style="margin: 22px 0">返回</Button>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
// import config from '../../api/config'
import dropdown from '../components/dropdown'
// import Cookies from 'js-cookie'
import TinymceEditor from '../../../public/richEncapsulation'

export default {
  components: {
    dropdown,
    TinymceEditor
  },
  data () {
    return {
      title: '新增网课详情',
      sizeList: [
        {title: '10次卡'},
        {title: '3次卡'}
      ],
      modal: false,
      modal1: false,
      formItem1: {
        name: '',
        price: '',
        num: ''
      },
      formItem2: {
        name: '',
        day: '',
        time: '',
        num: ''
      },
      columns: [
        {
          title: '规格',
          key: 'name',
          align: 'center'
        },
        {
          title: '库存',
          key: 'num',
          align: 'center'
        },
        {
          title: '销售价',
          key: 'price',
          align: 'center'
        }
      ],
      data: [
        {
          name: '10次卡',
          num: 18,
          price: '12.00'
        },
        {
          name: '3次卡',
          num: 12,
          price: '4.00'
        }
      ],
      columns1: [
        {
          title: '课时',
          key: 'name',
          align: 'center'
        },
        {
          title: '时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '有效期（天）',
          key: 'day',
          align: 'center'
        },
        {
          title: '上课人数',
          key: 'num',
          align: 'center'
        }
      ],
      data2: [
        {
          name: '第一课时',
          num: 18,
          day: '12',
          time: '2020-10-12 8:00 ~ 2020-10-15 12:00'
        },
        {
          name: '第二课时',
          num: 12,
          day: '12',
          time: '2020-10-12 8:00 ~ 2020-10-15 12:00'
        }
      ],
      formItem: {
        name: '',
        state: '',
        ballPark: '',
        msg: '其实加个接口不贵，然而思路上有问题。现在国内这些都是高端一款低端一款，加一个输出口的话，高端那个就尴尬了。还有就是这个麦克风阵列他们是测好的，你接到自己的喇叭上，怎么摆他们就管不了了，到时候你喊它未必答应，他们不希望你归罪于产品。亚马逊的dot是带输出的，但是还需要复杂的上网流程，很烦。还有一点，现在这些国内的智能音响基本属于赔钱卖，如果真的就值这个价，漫步者的千元系列应该自己就把这功能加进去了。所以还需要等一段日子。',
        coach: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: ''
      }
    }
  },
  methods: {
    addStyle () {
      this.modal = true
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    deleteRender (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认删除该规格</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            this.$Message.info('删除成功')
          }, 2000)
        }
      })
    },
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
    saveFn () {
      this.$Message.info('保存成功')
      setTimeout(() => {
        this.$router.back(-1)
      }, 800)
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
    if (this.$route.query.id) this.title = '编辑网课详情'
    this.getlist(1)
    console.log(this.$route.query)
  }
}
</script>

<style lang="less">
.skuBox {
  padding: 8px 22px;
  border: 1px solid #bbbaba;
  width: 120px;
  text-align: center;
  margin-top: 12px;
}

.float_l {
  float: left
}

.float_r {
  float: right
}

.inlineBlock {
  display: inline-block
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
