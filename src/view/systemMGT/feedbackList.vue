<template>
  <div>
    <Card>
      <Tabs style="margin-top: 12px;">
        <TabPane label="意见反馈列表" name="adminList">
          <Card style="margin-bottom: 32px">
            <span>状态：</span>
            <Select v-model="SelectValue" style="width:200px;margin-right: 16px;">
              <Option value="-1" label="全部"></Option>
              <Option value="1" label="已处理"></Option>
              <Option value="0" label="未处理"></Option>
            </Select>
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 300px;"/>
            <p style="margin-top: 22px;">
              <span>反馈时间：</span>
              <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate" style="width: 280px"></DatePicker>
            </p>
            <div style="margin-top: 22px;">
                    <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
                    <Button type="primary" style="margin-left: 12px; " @click="reset('addAuthorizationUser')">重置</Button>
                </div>
          </Card>
          <Table :loading="loading" ref="selection"  :columns="orgColumns" :data="information" style="width: 100%;" border @on-selection-change="handleSelect"></Table>
<!--          <div style="margin-top:16px;">-->
<!--            <Checkbox v-model="CheckboxValue" @on-change="handleSelectAll(true)" style="margin-right: 22px;">全选</Checkbox>-->
<!--            <Select v-model="SelectValue" style="width:100px;margin-right: 16px;">-->
<!--              <Option value="启用" label="启用"></Option>-->
<!--              <Option value="禁用" label="禁用"></Option>-->
<!--            </Select>-->
<!--            <Button @click="batchFn()" >确定</Button>-->
<!--          </div>-->
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="margin-top:30px;margin-bottom:30px;"  show-elevator></Page>
        </TabPane>
      </Tabs>
    </Card>
  </div>
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
      beginDate: '', // 反馈时间
      CheckboxValue: false,
      SelectValue: '',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      ids: [],
      orgColumns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '序号',
          key: 'index',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('span', {
            }, params.index + 1)
          }
        },
        {
          title: '用户ID',
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
          title: '昵称',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '内容',
          key: 'content',
          align: 'center',
          editable: true
        },
        {
          title: '反馈时间',
          key: 'created_at',
          align: 'center',
          editable: true
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('span', {
              }, '已处理')
            } else {
              return h('span', '未处理')
            }
          }
        },
        {
          title: '处理人ID',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            if (params.row.admin_id) {
              return h('span', {
              }, params.row.admin_id)
            } else {
              return h('span', '未处理')
            }
          }
        },
        {
          title: '处理时间',
          key: 'deal_time',
          align: 'center',
          render: (h, params) => {
            if (params.row.deal_time) {
              return h('span', {
              }, params.row.deal_time)
            } else {
              return h('span', '未处理')
            }
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: '220',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'feedbackDetail',
                        query: { id: params.row.id }
                      })
                    }
                  }
                }, '查看详情'),
                h('Button', {
                  props: {
                    type: 'dashed',
                    disabled: 'disabled'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '已处理')
              ])
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'feedbackDetail',
                        query: { id: params.row.id }
                      })
                    }
                  }
                }, '查看详情'),
                h('Button', {
                  props: {
                    type: 'warning'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '温馨提示',
                        content: `<p>你确定标记为已处理吗？</p>`,
                        onOk: () => {
                          this.disposeFn(params.index)
                        },
                        onCancel: () => {
                          console.log('点击了取消')
                        }
                      })
                    }
                  }
                }, '标记处理')
              ])
            }
          }
        }
      ],
      information: [],
      loading: false
    }
  },
  methods: {
    format (time, format) {
      if (!time) return ''
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
    handleSelect (selection) {
      let ids = []
      for (let item of selection) {
        ids.push(item.id)
      }
      this.ids = ids
      console.log(this.ids, 'asd')
    },
    reset () {
      this.$Message.info('This is a 重置')
    },
    gotoPage (title) {
      this.$router.push({
        name: title,
        query: { id: '12' }
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(this.CheckboxValue)
    },
    batchFn () {
      this.$Message.info('This is a test')
    },
    handlePage (num) { // 分页
      this.getlist(num)
    },
    disposeFn (index) { // 标记方法
      console.log(this.information[index].id)
      let { id } = this.information[index]
      uAxios.post(`deal/feedback/logs/${id}`)
        .then(res => {
          // let result = res.data
          this.$Message.info('点击了确认')
          this.getlist(1)
        })
    },
    getlist (page) {
      let self = this
      self.loading = true
      if (this.beginDate[0] && this.beginDate[1]) {
        this.beginDate[0] = this.format(this.beginDate[0], 'yyyy-MM-dd HH:ss')
        this.beginDate[1] = this.format(this.beginDate[1], 'yyyy-MM-dd HH:ss')
      }
      uAxios.get(`feedback/logs?page=${page}&keyword=${self.searchKeyword}&status=${self.SelectValue}&start_time=${this.beginDate[0] ? this.beginDate[0] : ''}&end_time=${this.beginDate[1] ? this.beginDate[1] : ''}`)
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
