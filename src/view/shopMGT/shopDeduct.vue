<template>
<!--  门店收益-->
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="门店提成" name="adminList">
          <Row :gutter="16">
            <Col span="16">
              <Card title="规则">
                <p class="" style="color: #5cadff;text-align: right;margin-top: -50px;margin-bottom: 42px;"  @click.stop="addRule"> + 新增规则</p>
                <Table border :columns="columns" :data="information"></Table>
              </Card>
            </Col>
          </Row>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modal"
      title="新增规格"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :label-width="100">
        <FormItem label="营业额: " >
          <Input v-model="formValidate.value" placeholder="请输入..." style="width: 200px"></Input>
        </FormItem>
        <FormItem label="提成（%）: " prop="account">
          <Input v-model="formValidate.ratio" placeholder="请输入..." style="width: 200px"></Input>
        </FormItem>
      </Form>
    </Modal>
<!--    <Button @click="getBack" style="margin-left: 8px">返回</Button>-->
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
      modal: false,
      id: '',
      formValidate: {
        value: '',
        ratio: ''
      },
      editID: '',
      information: [],
      indeterminate: true,
      checkAll: false,
      checkAllGroup: ['香蕉', '西瓜'],
      columns: [
        {
          title: '营业额',
          width: 150,
          align: 'center',
          key: 'value'
        },
        {
          title: '提成比例（%）',
          align: 'center',
          width: 150,
          key: 'ratio'
        },
        {
          title: '更新时间',
          align: 'center',
          width: 150,
          key: 'updated_at'
        },
        {
          title: '操作',
          key: 'action',
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
                    this.editRule(params.index)
                  }
                }
              }, '编辑'),
              h('span', {
                style: {
                  color: '#f02d44',
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>是否将该提成规则删除?</p>`,
                      onOk: () => {
                        this.removeAdmin(params.row.id, params.index)
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    addRule (index) {
      this.modal = true
    },
    editRule (index) {
      this.modal = true
      this.editID = this.information[index].id
      if (this.editID) {
        this.formValidate.value = this.information[index].value
        this.formValidate.ratio = this.information[index].ratio
      }
      console.log(this.information[index])
      console.log(this.formValidate)
    },
    removeAdmin (id, index) {
      let self = this
      self.loading = true
      uAxios.delete(`stores/push/money/logs/${id}`)
        .then(res => {
          this.$Message.info('删除成功！')
          this.getlist(1)
        })
    },
    ok () {
      let data = {
        value: this.formValidate.value,
        ratio: this.formValidate.ratio
      }
      if (!this.formValidate.value) return this.$Message.error('请输入营业额！')
      if (!this.formValidate.ratio) return this.$Message.error('请输入提成！')
      if (!this.editID) {
        uAxios.post(`stores/${this.id}/push/money/logs`, data)
          .then(res => {
            let result = res.data
            if (result.data) {
              this.$Message.info('创建成功！')
              this.getlist()
            }
          })
      } else {
        uAxios.put(`stores/push/money/logs/${this.editID}`, data)
          .then(res => {
            let result = res.data
            if (result.data) {
              this.$Message.info('修改成功！')
              this.getlist()
            }
          })
      }
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
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
      uAxios.get(`stores/${this.id}/push/money/logs?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data
          if (result.data) {
            self.information = result.data
            console.log(this.information)
          }
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    this.id = this.$route.query.id
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
