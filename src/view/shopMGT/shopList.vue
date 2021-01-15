<template>
  <div>
    <Card>
      <Tabs style="margin-top: 12px;">
        <TabPane label="门店列表" name="adminList">
          <Card style="margin-bottom: 32px">
            <span>搜索关键词：</span>
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 300px;"/>
            <p style="margin-top: 22px;">
              <span>预约时间：</span>
              <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate" style="width: 280px"></DatePicker>
            </p>
            <div style="margin-top: 22px;">
                    <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
                    <Button type="primary" style="margin-left: 12px; " @click="reset('addAuthorizationUser')">重置</Button>
                </div>
          </Card>
          <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="gotoPage('editShopDetail')">新增门店</Button>
          <Table :loading="loading" ref="selection"  :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
<!--          <div style="margin-top:16px;">-->
<!--            <Checkbox v-model="CheckboxValue" @click="handleSelectAll(true)" style="margin-right: 22px;">全选</Checkbox>-->
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
  name: 'authorization',
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      beginDate: [],
      searchKeyword: '', // 搜索
      CheckboxValue: false,
      SelectValue: '全部',
      search: '',
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '门店id',
          key: 'id',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: '门店名称',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '电话',
          key: 'mobile',
          align: 'center',
          render: (h, params) => {
            if (params.row.user) {
              return h('span', {
              }, params.row.user.mobile)
            } else {
              return h('span', '未获取')
            }
          }
        },
        {
          title: '店长',
          key: 'created_at',
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
          title: '地址',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            return h('span', {
            }, `${params.row.province}.${params.row.city}.${params.row.dist}.${params.row.address}`)
          }
        },
        {
          title: '更新时间',
          key: 'updated_at',
          align: 'center',
          editable: true
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
                      name: 'shopDetail',
                      query: { id: params.row.id }
                    })
                  }
                }
              }, '查看/编辑'),
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>你确定删除该门店吗？</p>`,
                      onOk: () => {
                        uAxios.delete(`stores/${params.row.id}`)
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
              }, '删除'),
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'shopDeduct',
                      query: { id: params.row.id }
                    })
                  }
                }
              }, '设置提成')
            ])
          }
        }
      ],
      information: [],
      loading: false
    }
  },

  methods: {
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
      this.searchKeyword = '' // 搜索
      this.$Message.info('已重置')
    },
    gotoPage (title) {
      this.$router.push({
        name: title
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    batchFn () {
      this.$Message.info('')
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
      uAxios.get(`stores?page=${page}&keyword=${self.searchKeyword}&start_time=${this.beginDate[0]}&end_time=${this.beginDate[1]}`)
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
      console.log(this.searchKeyword)
      console.log(this.beginDate)
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
