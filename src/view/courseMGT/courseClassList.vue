<template>
<!--  课程列表-->
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="课程分类列表" name="adminList">
        <Card style="margin-bottom: 32px">
          <Row :gutter="20">
            <Col span="20">
              <span>启用状态：</span>
              <Select v-model="SelectValue" style="width:200px;margin-right: 20px;">
                <Option value="全部" label="全部"></Option>
                <Option value="启用" label="启用"></Option>
                <Option value="禁用" label="禁用"></Option>
              </Select>
              <span>搜索关键词：</span>
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."
                style="width: 200px;"/>
            </Col>
            <Col span="20" style="margin-top: 32px">
              <span>更新时间：</span>
              <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate"style="width:200px;margin-right: 20px;"></DatePicker>
            </Col>
          </Row>
          <div style="margin-top: 22px;">
            <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
            <Button type="primary" style="margin-left: 12px; " @click="reset('addAuthorizationUser')">重置</Button>
          </div>
        </Card>
        <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="modal = true">
          新增分类
        </Button>
        <Table :loading="loading" ref="selection" :columns="orgColumns" :data="information" style="width: 100%;"
               border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
              style="margin-top:30px;margin-bottom:30px;" show-elevator></Page>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modal"
      title="新增规格"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :model="formItem" :label-width="80">
        <FormItem label="课程名称：">
          <Input v-model="formItem.name" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
        <FormItem label="分类状态：">
          <RadioGroup v-model="formItem.radio">
            <Radio label="启用">启用</Radio>
            <Radio label="禁用">禁用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
import config from '../../api/config'
import dropdown from '../components/dropdown'
import Cookies from 'js-cookie'

export default {
  name: 'authorization',
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      modal: false,
      formItem: {
        name: '',
        radio: ''
      },
      beginDate: '', // 反馈时间
      CheckboxValue: false,
      SelectValue: '全部',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '分类ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '分类昵称',
          key: 'id',
          align: 'center'
        },
        {
          title: '状态',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '排序',
          key: 'type',
          align: 'center'
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'evaluateDetail',
                      query: {id: 12}
                    })
                  }
                }
              }, '编辑'),
              h('span', {
                style: {
                  color: '#ed4014',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>你确定该订单已付款吗？</p>`,
                      onOk: () => {
                        this.$Message.info('点击了确认')
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除')
            ])
            // return h('div', [
            //   h('span', {
            //     style: {
            //       color: '#2d8cf0',
            //       marginRight: '18px'
            //     },
            //     on: {
            //       click: () => {
            //         this.$router.push({
            //           name: 'orderDetail',
            //           query: {id: 12}
            //         })
            //       }
            //     }
            //   }, '查看'),
            //   h('span', {
            //     style: {
            //       color: '#ed4014',
            //       marginRight: '18px'
            //     },
            //     on: {
            //       click: () => {
            //         this.$Modal.confirm({
            //           title: '温馨提示',
            //           content: `<p>你确定该订单已付款吗？</p>`,
            //           onOk: () => {
            //             this.$Message.info('点击了确认')
            //           },
            //           onCancel: () => {
            //             console.log('点击了取消')
            //           }
            //         })
            //       }
            //     }
            //   }, '通过'),
            //   h('span', {
            //     style: {
            //       color: '#ed4014',
            //       marginRight: '18px'
            //     },
            //     on: {
            //       click: () => {
            //         this.$Modal.confirm({
            //           title: '温馨提示',
            //           content: `<p>你确定该订单已付款吗？</p>`,
            //           onOk: () => {
            //             this.$Message.info('点击了确认')
            //           },
            //           onCancel: () => {
            //             console.log('点击了取消')
            //           }
            //         })
            //       }
            //     }
            //   }, '拒绝')
            // ])
          }
        }
      ],
      information: [],
      loading: false
    }
  },
  methods: {
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
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
