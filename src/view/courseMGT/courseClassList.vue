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
                <Option value="" label="全部"></Option>
                <Option value="1" label="启用"></Option>
                <Option value="0" label="禁用"></Option>
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
        <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="addClass('-1')">
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
      <Form  :label-width="80">
        <FormItem label="课程名称：">
          <Input v-model="ClassData.name" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
        <FormItem label="分类状态：">
          <RadioGroup v-model="ClassData.value">
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
      beginDate: [], //
      CheckboxValue: false,
      SelectValue: '',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '分类ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '分类昵称',
          key: 'name',
          align: 'center'
        },
        {
          title: '状态',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            if (params.row.is_show == '1') {
              return h('span', '启用')
            } else {
              return h('span', '禁用')
            }
          }
        },
        {
          title: '创建时间',
          key: 'created_at',
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
                    this.addClass(params.index)
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
                      content: `<p>你确定删除该分类吗？</p>`,
                      onOk: () => {
                        uAxios.delete(`courses/categories/${params.row.id}`)
                          .then(res => {
                            console.log(res.data)
                            let result = res.data
                            if (result.code == 0) {
                              this.information.splice(params.index, 1)
                              console.log(result)
                              this.$Message.info('操作成功')
                            }
                          })
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
      ],
      information: [],
      ClassId: '',
      ClassData: {
        name: '',
        is_show: '',
        value: ''
      },
      loading: false
    }
  },
  methods: {
    addClass (index) {
      this.modal = true
      if (index != '-1') {
        this.ClassId = this.information[index].id
        this.ClassData = this.information[index]
        this.ClassData.value = this.ClassData.is_show == '1' ? '启用' : '禁用'
      } else {
        this.ClassData = {
          name: '',
          is_show: '',
          value: ''
        }
      }
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
    ok () {
      this.$Message.info('Clicked ok')
      let data = {
        name: this.ClassData.name,
        is_show: this.ClassData.value == '启用' ? '1' : '0'
      }
      console.log(data)
      if (this.ClassId) {
        uAxios.put(`courses/categories/${this.ClassId}`, data)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.getlist(1)
              this.$Message.info('操作成功')
            }
          })
      } else {
        uAxios.post(`courses/categories`)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.getlist(1)
              this.$Message.info('操作成功')
            }
          })
      }
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
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
      uAxios.get(`courses/categories?page=${page}&keyword=${self.searchKeyword}&start_time=${this.beginDate[0] ? this.beginDate[0] : ''}&end_time=${this.beginDate[1] ? this.beginDate[1] : ''}&is_show=${this.SelectValue ? this.SelectValue : ''}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data
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
