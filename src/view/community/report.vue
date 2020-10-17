<template>
  <div v-model="activeTab">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane label="未处理" name="0">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="搜索用户..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
        </TabPane>
        <TabPane label="已处理" name="1">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="搜索用户..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      v-model="modal2"
      title="温馨提示"
      :ok-text="text"
      @on-ok="sign"
      no-cancel>
      <div style="font-size: 14px">
        是否标记为已处理？
      </div>
    </Modal>
  </div>
</template>

<script>
import uAxios from '../../api/index'
import config from '../../api/config'

export default {
  search: '',
  name: 'report',
  data () {
    return {
      activeTab: '0',
      currentPage: 1,
      searchKeyword: '',
      orgTotal: 0,
      modal2: false,
      type: '',
      id: '',
      modal1: false,
      text: '确认',
      content: '',
      orgColumns: [
        {
          title: '社群ID',
          align: 'center',
          width: 80,
          key: 'community_id'
        },
        {
          title: '社群名称',
          align: 'center',
          width: 120,
          key: 'community_name'
        },
        {
          title: '群主ID',
          align: 'center',
          width: 80,
          key: 'owner_id'
        },
        {
          title: '群主名称',
          align: 'center',
          width: 120,
          key: 'owner_name'
        },
        {
          title: '社群头像',
          key: 'owner_logo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.owner_logo
              },
              style: {
                width: '42px',
                height: '42px',
                marginTop: '6px'
              },
              on: {
                click: () => {
                  let argu = {id: params.row.user_id}
                  this.$router.push({
                    name: 'user_detail',
                    params: argu
                  })
                }
              }
            })
          },
          align: 'center'
        },
        {
          title: '举报ID',
          align: 'center',
          width: 80,
          key: 'user_id'
        },
        {
          title: '举报用户',
          align: 'center',
          width: 100,
          key: 'user_name'
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
                width: '42px',
                height: '42px',
                marginTop: '6px'
              },
              on: {
                click: () => {
                  let argu = {id: params.row.user_id}
                  this.$router.push({
                    name: 'user_detail',
                    params: argu
                  })
                }
              }
            })
          },
          align: 'center'
        },
        {
          title: '手机号',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '举报内容',
          align: 'center',
          key: 'content'
        },
        {
          title: '举报时间',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            if (this.activeTab == '0') {
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
                      console.log(params.row)
                      let argu = {id: params.row.community_id}
                      this.$router.push({
                        name: 'communityParticulars',
                        params: argu
                      })
                    }
                  }
                }, '列表详情'),
                h('Button', {
                  props: {
                    type: 'warning'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.modal2 = true
                      this.complaints_id = params.row.complaints_id
                    }
                  }
                }, '标记举报')
              ])
            }
          }
        }
      ],
      status: '',
      modal: false,
      value: '',
      recommend_id: '',
      image: '',
      information: [],
      complaints_id: '',
      title: '',
      loading: false
    }
  },
  methods: {
    showPhoto (photo) {
      this.$Modal.success({
        title: `查看头像`,
        content: `<img src="${photo}" width="100%" style="margin-left: 22px"/>`
      })
    },
    sign () {
      let self = this
      uAxios.put(`admin/community/complaints/` + self.complaints_id)
        .then(res => {
          if (res.data.code === 0) this.$Message.info('已处理')
          this.information.splice(this.feedbackIndex, 1)
        })
    },
    deleteUser () {
      let self = this
      uAxios.delete('admin/home/recommends/' + self.recommend_id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          this.getlist(this.currentPage)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
      this.getlist(1)
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`admin/community/complaints?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          console.log(result, '9595')
          self.orgTotal = result.total
          self.loading = false
          self.information = result.data.map((item) => {
            return {
              complaints_id: item.id,
              created_at: item.created_at,
              rank_name: item.user.rank_name,
              community_id: item.community_id,
              community_name: item.community.title,
              owner_id: item.community.user_id,
              owner_name: item.community.owner_name,
              owner_logo: item.community.logo,
              content: item.content,
              photo: item.user.photo,
              user_id: item.user.id,
              mobile: item.user.mobile,
              user_name: item.user.name,
              sex: item.user.sex == 1 ? '男' : '女',
              is_approved: item.user.is_approved == 1 ? '已认证' : '未认证',
              type: item.user.type == 'single' ? '单身' : '介绍人'
            }
          })
        })
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      this.getlist(num)
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
  /*@import "../../styles/common";*/
  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
    height: 120px;
    margin-top: -16px;
  }

  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
  }

  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
  }

  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-radius: 0;
    background: #fff;
  }

  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-top: 1px solid #3399ff;
  }

  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
