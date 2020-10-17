<template>
  <div id="name">
    <div v-model="activeTab">
      <Card>
        <Tabs @on-click="getTab">
          <TabPane label="用户社群" name="association">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
              <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
            </span>
            <Card>
              <p slot="title" style="color: #ff6c4c ">社群列表</p>
              <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
    <Modal
      v-model="modal1"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deleteUser"
      no-cancel>
      <p>是否删除该社群？</p>
    </Modal>
  </div>
</template>

<script>
import uAxios from '../../api'

export default {
  data () {
    return {
      id: '',
      searchKeyword: '',
      loading: false,
      modal1: false,
      modal: false,
      title: '',
      intro: '',
      logo: '',
      switchLoading: false,
      activeTab: 'association',
      orgTotal: 0,
      chart: {},
      Columns: [
        {
          title: 'ID',
          align: 'center',
          width: 90,
          key: 'id'
        },
        {
          title: '群名称',
          align: 'center',
          width: 90,
          key: 'title'
        },
        {
          title: '群头像',
          key: 'logo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.logo
              },
              style: {
                width: '46px',
                height: '46px',
                marginTop: '6px'
              },
              on: {
                click: () => {
                }
              }
            })
          },
          align: 'center'
        },
        {
          title: '群主名字',
          align: 'center',
          key: 'owner_name'
        },
        {
          title: '群主微信',
          align: 'center',
          key: 'owner_wechat'
        },
        {
          title: '群主头像',
          key: 'owner_photo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.owner_photo
              },
              style: {
                width: '46px',
                height: '46px',
                marginTop: '6px'
              },
              on: {
                click: () => {
                }
              }
            })
          },
          align: 'center'
        },
        {
          title: '群二维码',
          key: 'qrcode',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.qrcode
              },
              style: {
                width: '46px',
                height: '46px',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                  this.showPhoto (params.row.qrcode)
                }
              }
            })
          },
          align: 'center'
        },
        {
          title: '群成员数',
          align: 'center',
          width: 100,
          key: 'member_num'
        },
        {
          title: '访问数',
          align: 'center',
          width: 100,
          key: 'click_num'
        },
        {
          title: '操作',
          key: 'title',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'communityParticulars',
                      params: argu
                    })
                  }
                }
              }, '社群详情')
            ])
          }
        }
      ],
      information: []
    }
  },
  methods: {
    showPhoto (photo) {
      this.$Modal.success({
        title: `查看头像`,
        content: `<img src="${photo}" width="100%" style="margin-left: -22px"/>`
      })
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      this.getlist(num)
    },
    uploadlogo (image) {
      this.logo = image // LoGo 单
    },
    handleSearch () {
      this.getlist(1)
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`admin/users/` + self.id + `/communities?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          console.log(result, '666')
          self.information = result.communities.data.map((item) => {
            return {
              id: item.id,
              user_id: item.user_id,
              created_at: item.created_at,
              intro: item.intro,
              logo: item.logo,
              member_num: item.member_num,
              click_num: item.click_num,
              title: item.title,
              owner_name: item.owner_name,
              owner_photo: item.owner_photo,
              owner_wechat: item.owner_wechat,
              qrcode: item.qrcode
            }
          })
          self.orgTotal = result.communities.total
          self.loading = false
        })
    },
    deleteUser () {
      let self = this
      uAxios.delete('admin/community/groups/' + self.group_id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          this.information.splice(this.deleteIndex, 1)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getlist(1)
  }
}
</script>

<style lang="less" scoped>
  .line-chart-con {
    height: 300px;
  }
  .ivu-card-body {
    text-align: center;
  }
  ._bc-list {
    box-shadow: 0 0 12px #d3d3d3;
    margin-bottom: 12px;
    padding: 12px;
    position: relative;
  }
  ._bc-num {
    font-size: 42px;
    font-weight: bold;
    position: absolute;
    right: 6%;
    top: 40%;
  }
  .bc-style {
    width: 54px;
    position: absolute;
    right: 2%;
    top: 2%;
  }
  .float_l {
    float: left;
  }
  ._bc-name {
    font-size: 16px;
    margin-left: 12px;
    font-weight: bold;
  }
</style>
