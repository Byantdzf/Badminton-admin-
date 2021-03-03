<template>
  <div>
    <Card>
      <Tabs style="margin-top: 12px;">
        <TabPane label="管理员列表" name="adminList">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="搜索用户..."
            style="width: 160px; margin-bottom: 22px;"/>
          <span >
                    <Button type="warning" icon="ios-search" style="margin-left: 12px; margin-bottom: 22px;" @click="handleSearch">搜索</Button>
                    <Button type="primary" icon="md-add" style="margin-left: 12px; margin-bottom: 22px;" @click="gotoPage('addAuthorizationUser')">新增管理员</Button>
<!--                    <Button type="error" icon="ios-trash-outline" style="margin-left: 12px; margin-bottom: 22px;" @click="deleteUser()">批量删除</Button>-->
                </span>
          <Table :loading="loading" ref="selection"  :columns="orgColumns" :data="information" style="width: 100%;" border @on-selection-change="handleSelect"></Table>
          <div style="margin-top:16px;">
<!--            <Checkbox v-model="CheckboxValue" @on-change="handleSelectAll" style="margin-right: 22px;">全选</Checkbox>-->
<!--            <Select v-model="SelectValue" style="width:100px;margin-right: 16px;">-->
<!--              <Option value="启用" label="启用"></Option>-->
<!--              <Option value="禁用" label="禁用"></Option>-->
<!--            </Select>-->
<!--            <Button @click="batchFn()" >确定</Button>-->
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
      CheckboxValue: false,
      SelectValue: '',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      userListId: [],
      orgColumns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '管理员账号',
          key: 'account',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '角色',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            if (params.row.role) {
              return h('span', params.row.role.name)
            } else {
              return h('span', '错误')
            }
          }
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'center',
          editable: true
        },
        {
          title: '上次登录时间',
          key: 'updated_at',
          align: 'center',
          editable: true
        },
        // {
        //   title: '状态',
        //   align: 'center',
        //   render: (h, params) => {
        //     console.log(params.row.is_show)
        //     let value = params.row.is_show
        //     if (params.row.is_show) {
        //       return h('i-switch', {
        //         props: {
        //           size: 'large',
        //           value: params.row.is_show == 'true'
        //         },
        //         scopedSlots: {
        //           open: () => h('span', '启用'),
        //           close: () => h('span', '禁用')
        //         },
        //         on: {
        //           'on-change': (value) => {
        //             console.log(value)
        //             let data = {
        //               is_show: value ? '1' : '0'
        //             }
        //             uAxios.put(`admins/${params.row.id}`, data)
        //               .then(res => {
        //                 if (res.code == 0) {
        //                   this.$Message.success('操作成功!')
        //                 }
        //               })
        //           }
        //         }
        //       })
        //     }
        //   }
        // },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'primary'
              //   },
              //   style: {
              //     marginRight: '8px'
              //   },
              //   on: {
              //     click: () => {
              //       this.$router.push({
              //         name: 'addAuthorizationUser',
              //         query: { id: params.row.id }
              //       })
              //     }
              //   }
              // }, '编辑'),
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除管理员权限?</p>`,
                      onOk: () => {
                        this.deleteUser(params.row.id, params.index)
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '移除')
            ])
          }
        }
      ],
      information: [],
      loading: false
    }
  },
  methods: {
    gotoPage (title) {
      this.$router.push({
        name: title
      })
    },
    handleSelect (selection) {
      let ids = []
      for (let item of selection) {
        ids.push(item.id)
      }
      this.userListId = ids
      console.log(selection, 'asd')
    },
    deleteUser (id, index) {
      let vm = this
      console.log(id, index)
      let userListId = []
      userListId.push(id)
      console.log(userListId)
      let data = {
        admin_ids: userListId
      }
      uAxios.delete(`admins/${id}`, data)
        .then(res => {
          if (res.data.code == 0) {
            vm.$Message.success('操作成功!')
            vm.page = 1
            vm.list = []
            vm.getlist()
          }
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
      uAxios.get(`admins?page=${page}&keyword=${self.searchKeyword}`)
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
