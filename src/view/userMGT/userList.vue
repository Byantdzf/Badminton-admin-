<template>
  <div>
    <Card>
      <Tabs style="margin-top: 12px;">
        <TabPane label="用户列表" name="adminList">
          <Card style="margin-bottom: 32px">
            <span>状态：</span>
            <Select v-model="SelectValue" style="width:200px;margin-right: 16px;">
              <Option value="-1" label="全部"></Option>
              <Option value="1" label="启用"></Option>
              <Option value="0" label="禁用"></Option>
            </Select>
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 300px;"/>
            <p style="margin-top: 22px;">
              <span>注册时间：</span>
              <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate" style="width: 280px"></DatePicker>
            </p>
            <div style="margin-top: 22px;">
                    <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
                    <Button type="primary" style="margin-left: 12px; " @click="reset('addAuthorizationUser')">重置</Button>
                </div>
          </Card>
          <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="exportFn()">导出</Button>
          <Table :loading="loading" ref="selection"  :columns="orgColumns" :data="information" style="width: 100%;" border  @on-selection-change="handleSelect"></Table>
          <div style="margin-top:16px;">
            <Checkbox v-model="CheckboxValue" @on-change="handleSelectAll(true)" style="margin-right: 22px;">全选</Checkbox>
            <Select v-model="SelectValue" style="width:100px;margin-right: 16px;">
              <Option value="启用" label="启用"></Option>
              <Option value="禁用" label="禁用"></Option>
            </Select>
            <Button @click="batchFn()" >确定</Button>
          </div>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="margin-top:30px;margin-bottom:30px;"  show-elevator></Page>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import uAxios from '../../api/index'
import config from '@/config'
import dropdown from '../components/dropdown'
import Cookies from 'js-cookie'

export default {
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      beginDate: [], // 时间
      CheckboxValue: false,
      SelectValue: '',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      ids: [],
      orgColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户ID',
          key: 'id',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: '昵称',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'center',
          editable: true
        },
        {
          title: '所属门店',
          key: 'created_at',
          align: 'center',
          render: (h, params) => {
            if (params.row.store) {
              return h('span', {
              }, params.row.store.name)
            } else {
              return h('span', '未获取')
            }
          }
        },
        {
          title: '最近登录时间',
          key: 'updated_at',
          align: 'center',
          editable: true
        },
        {
          title: '状态',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            let isShow = ''
            if (params.row.is_show == '1') {
              isShow = true
            } else {
              isShow = false
            }
            if (params.row.is_show) {
              return h('i-switch', {
                props: {
                  size: 'large',
                  value: isShow
                },
                scopedSlots: {
                  open: () => h('span', '启用'),
                  close: () => h('span', '禁用')
                },
                on: {
                  'on-change': (value) => {
                    let data = {
                      is_show: value ? '1' : '0'
                    }
                    uAxios.post(`users/${params.row.id}`, data)
                      .then(res => {
                        if (res.code == 0) {
                          this.$Message.success('操作成功!')
                        }
                      })
                  }
                }
              })
            }
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          render: (h, params) => {
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
                      name: 'userDetail',
                      query: { id: params.row.id }
                    })
                  }
                }
              }, '查看详情')
            ])
          }
        }
      ],
      information: [],
      loading: false
    }
  },
  methods: {
    exportFn () { // 导出数据
      let baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
      let oa = document.createElement('a')
      oa.href = `${baseUrl}export/users`
      oa.download = 'htmltable-base64.xls'// 通过A标签 设置文件名
      oa.click()
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
    reset () {
      this.beginDate = []
      this.searchKeyword = '' // 搜索
      this.$Message.info('已重置')
    },
    handleSelect (selection) {
      let ids = []
      for (let item of selection) {
        ids.push(item.id)
      }
      this.ids = ids
      console.log(this.ids, 'asd')
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
    getlist (page) {
      let self = this
      self.loading = true
      if (this.beginDate[0] && this.beginDate[1]) {
        this.beginDate[0] = this.format(this.beginDate[0], 'yyyy-MM-dd HH:ss')
        this.beginDate[1] = this.format(this.beginDate[1], 'yyyy-MM-dd HH:ss')
      }
      uAxios.get(`users?page=${page}&keyword=${self.searchKeyword}&start_time=${this.beginDate[0]}&end_time=${this.beginDate[1]}&is_show=${this.SelectValue}`)
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
