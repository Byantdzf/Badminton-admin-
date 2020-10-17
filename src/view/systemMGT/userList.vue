<template>
  <div>
    <Card>
      <Tabs style="margin-top: 12px;">
        <TabPane label="用户列表" name="adminList">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="搜索用户..."
            style="width: 160px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                    <Button type="warning" icon="ios-search" style="margin-left: 12px; margin-bottom: 22px;">搜索</Button>
                    <Button type="primary" icon="md-add" style="margin-left: 12px; margin-bottom: 22px;" @click="gotoPage('addAuthorizationUser')">新增管理员</Button>
                </span>
          <Table :loading="loading" ref="selection"  :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <div style="margin-top:16px;">
            <Checkbox v-model="CheckboxValue" @click="handleSelectAll(true)" style="margin-right: 22px;">全选</Checkbox>
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
      orgColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'adminId',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: 'UserID',
          key: 'id',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: '用户名',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '头像',
          key: 'photo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.photo
              },
              style: {
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                  let argu = {id: params.row.id}
                  this.$router.push({
                    name: 'user_detail',
                    params: argu
                  })
                }
              }
            })
          },
          width: 80,
          align: 'center'
        },
        {
          title: '单身/介绍人',
          key: 'type',
          align: 'center',
          editable: true
        },
        {
          title: '权限类型',
          key: 'admin_type',
          align: 'center',
          editable: true
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
                      name: 'addAuthorizationUser',
                      query: 'id=12'
                    })
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除权限?</p>`,
                      onOk: () => {
                        this.removeAdmin(params.row.adminId, params.index)
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
        name: title,
        query: {id: '12'}
      })
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    batchFn () {
      this.$Message.info('This is a test');
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
