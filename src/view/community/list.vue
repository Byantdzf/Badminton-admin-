<template>
  <div id="name">
    <div v-model="activeTab">
      <Card>
        <Tabs @on-click="getTab" :animated="false">
          <TabPane label="分类管理" name="classify" v-if="access == 'admin'">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                <Button type="error" style="margin-bottom: 22px;margin-left: 20px;" @click="report">举报列表</Button>
                <Button type="success" style=" margin-bottom: 22px;margin-left: 12px;" @click="show">新建分类</Button>
            </span>
            <Card>
              <p slot="title" style="color: #ff6c4c ">分类平台</p>
              <Table :loading="loading" :columns="Columns1" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
          <TabPane label="社群管理" name="association">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                <Button type="success" style=" margin-bottom: 22px;margin-left: 20px;" @click="newCommunity">新建社群</Button>
            </span>
            <Card>
              <p slot="title" style="color: #ff6c4c ">社群列表</p>
              <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
          <TabPane label="社群动态" name="dynamic" v-if="access == 'admin'">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
              <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
            </span>
            <Card>
              <p slot="title" style="color: #ff6c4c ">动态列表</p>
              <Table :loading="loading" :columns="Columns2" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
          <TabPane label="动态举报" name="report" v-if="access == 'admin'">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
              <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
            </span>
            <Card>
              <p slot="title" style="color: #ff6c4c ">举报列表</p>
              <Table :loading="loading" :columns="Columns3" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
          <!--<TabPane label="分享树状图" name="2">-->
            <!--<Row style="height: 700px">-->
              <!--<dendrogram :chart="chart"></dendrogram>-->
            <!--</Row>-->
          <!--</TabPane>-->
        </Tabs>
      </Card>
    </div>
    <Modal
      v-model="modal"
      title='温馨提示'
      ok-text="确定"
      @on-ok="addclassify"
      no-cancel>
      <div style="margin-bottom: 15px;">
        <div style="margin-bottom: -40px;margin-top: 30px">群LOGO：</div>
        <uploadImage v-on:uploadPictures="uploadlogo" :pic="logo" v-model="logo" style="margin-left: 62px"></uploadImage>
      </div>
      <p style="margin-bottom: 15px">
        分类名称：
        <Input placeholder="请输入..." class="text" v-model="title"></Input>
      </p>
      <p style="margin-bottom: 15px">
        分类介绍：
        <Input placeholder="请输入..." class="text" v-model="intro"></Input>
      </p>
    </Modal>
    <Modal
      v-model="modal1"
      title='温馨提示'
      ok-text="确定"
      @on-ok="modification"
      no-cancel>
      <p style="margin-bottom: 15px;">
        <div style="margin-bottom: -40px;margin-top: 30px">群LOGO：</div>
        <uploadImage v-on:uploadPictures="uploadlogo" :pic="logo" style="margin-left: 62px" v-model="logo"></uploadImage>
      </p>
      <p style="margin-bottom: 15px">
        分类介绍：
        <Input placeholder="请输入..." class="text" v-model="intro"></Input>
      </p>
      <p style="margin-bottom: 15px">
        分类名称：
        <Input placeholder="请输入..." class="text" v-model="title"></Input>
      </p>
    </Modal>
    <Modal
      v-model="modal2"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deleteclassify"
      no-cancel>
      <p>是否删除该社群？</p>
    </Modal>
    <Modal
      v-model="modal3"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deletecommunity"
      no-cancel>
      <p>是否删除该社群？</p>
    </Modal>
    <Modal
      v-model="modal4"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deletedynamic"
      no-cancel>
      <p>是否删除该条动态？</p>
    </Modal>
  </div>
</template>

<script>
import uAxios from '../../api'
import dendrogram from './components/dendrogram.vue'
import uploadImage from '../components/uploadImage'

export default {
  components: {
    dendrogram,
    uploadImage
  },
  data () {
    return {
      id: '',
      searchKeyword: '',
      currentPage: 1,
      loading: false,
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      switchLoading: false,
      activeTab: 'association',
      orgTotal: 0,
      access: localStorage.getItem('access'),
      tab: [
        {title: '分类管理', name: 'classify'},
        {title: '社群管理', name: 'association'},
        {title: '动态管理', name: 'dynamic'},
        {title: '动态举报', name: 'report'}
      ],
      community_id: '',
      user_id: '',
      dynamic_id: '',
      title: '',
      intro: '',
      logo: '',
      chart: {},
      deleteIndex: 0,
      group_id: '',
      Columns: [
        {
          title: 'ID',
          align: 'center',
          width: 120,
          key: 'id'
        },
        {
          title: '群名称',
          align: 'center',
          width: 120,
          key: 'title',
          render: (h, params) => {
            return h('div', {
              on: {
                click: () => {
                  let argu = {id: params.row.user_id}
                  this.$router.push({
                    name: 'userCommunity',
                    params: argu
                  })
                  console.log(params.row)
                }
              }
            }, params.row.title)
          }
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
                  console.log(params.row)
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
          key: 'member_num',
          sortable: true
        },
        {
          title: '访问数',
          align: 'center',
          key: 'click_num'
        },
        {
          title: '是否展示',
          align: 'center',
          width: 120,
          key: 'is_hided',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                size: 'large',
                value: Boolean(params.row.is_hided == '1' ? false : true)
              },
              scopedSlots: {
                open: () => h('span', '开启'),
                close: () => h('span', '禁止')
              },
              on: {
                'on-change': (value) => {
                  this.group_id = params.row.id
                  this.showAssociation(value)
                }
              }
            })
          }
        },
        {
          title: '操作',
          key: 'title',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info'
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
              }, '社群详情'),
              h('Button', {
                props: {
                  type: 'warning'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'Member',
                      params: argu
                    })
                  }
                }
              }, '社群成员'),
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
                      name: 'dynamicList',
                      params: argu
                    })
                  }
                }
              }, '动态列表'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.modal3 = true
                    this.community_id = params.row.id
                    console.log(params.row, '0101')
                  }
                }
              }, '删除社群')
            ])
          }
        }
      ],
      Columns1: [
        {
          title: 'ID',
          align: 'center',
          width: 90,
          key: 'id'
        },
        {
          title: '分类名称',
          align: 'center',
          key: 'title'
        },
        {
          title: '群LOGO',
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
          title: '分类介绍',
          align: 'center',
          key: 'intro',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.intro
                }
              }, params.row.intro)
            ])
          }
        },
        {
          title: '分类数量',
          align: 'center',
          width: 130,
          key: 'community_group_links_count',
          sortable: true
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
                    this.modal1 = true
                    this.group_id = params.row.id
                    this.title = params.row.title
                    this.intro = params.row.intro
                    this.logo = params.row.logo
                  }
                }
              }, '修改分类'),
              h('Button', {
                props: {
                  type: 'warning'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'classifyList',
                      params: argu
                    })
                  }
                }
              }, '社群列表'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.modal2 = true
                    this.group_id = params.row.id
                  }
                }
              }, '删除分类')
            ])
          }
        }
      ],
      Columns2: [
        {
          title: 'ID',
          align: 'center',
          width: 90,
          key: 'id'
        },
        {
          title: '社群名称',
          align: 'center',
          key: 'community_title'
        },
        {
          title: '用户ID',
          align: 'center',
          key: 'user_id'
        },
        {
          title: '用户名称',
          align: 'center',
          key: 'user_name'
        },
        {
          title: '动态内容',
          align: 'center',
          key: 'content',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.content
                }
              }, params.row.content)
            ])
          }
        },
        {
          title: '发表时间',
          align: 'center',
          width: 130,
          key: 'created_at',
          sortable: true
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
                      name: 'dynamicParticulars',
                      params: argu
                    })
                  }
                }
              }, '动态详情'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    console.log(params.row, '56')
                    this.modal4 = true
                    this.dynamic_id = params.row.id
                  }
                }
              }, '删除动态')
            ])
          }
        }
      ],
      Columns3: [
        {
          title: ' 动态ID',
          align: 'center',
          width: 90,
          key: 'community_moment_id'
        },
        {
          title: '被举报用户ID',
          align: 'center',
          key: 'community_user_id'
        },
        {
          title: '举报用户ID',
          align: 'center',
          key: 'user_id'
        },
        {
          title: '举报用户',
          align: 'center',
          key: 'user_name'
        },
        {
          title: '动态内容',
          align: 'center',
          key: 'community_content',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.community_content
                }
              }, params.row.community_content)
            ])
          }
        },
        {
          title: '举报时间',
          align: 'center',
          width: 130,
          key: 'created_at',
          sortable: true
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
                      name: 'dynamicReport',
                      params: argu
                    })
                  }
                }
              }, '举报详情')
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
    show () {
      this.modal = true
      if (this.modal = true) {
        this.title = ''
        this.logo = ''
        this.intro = ''
      }
    },
    uploadlogo (image) {
      this.logo = image // LoGo 单
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      this.getlist(num)
    },
    report () {
      let argu = {id: 0}
      this.$router.push({
        name: 'report',
        params: argu
      })
    },
    newCommunity () {
      let argu = {id: 0}
      this.$router.push({
        name: 'newCommunity',
        params: argu
      })
    },
    handleSearch () {
      this.getlist(1)
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
      this.getlist(1)
    },
    showAssociation (value) {
      let self = this
      uAxios.put(`admin/hide/communities/` + self.group_id).then(response => {
        if (response.data.code === 0) {
          this.$Message.success('修改成功!')
          this.getlist(this.currentPage)
        } else {
          alert('操作失败！')
        }
      })
    },
    getlist (page) {
      let self = this
      self.loading = true
      if (this.activeTab == 'classify') {
        uAxios.get(`admin/community/groups?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            console.log(result, '666')
            self.information = result.data
            self.loading = false
            self.orgTotal = result.total
          })
      } else if (this.activeTab == 'association') {
        uAxios.get(`admin/communities?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            console.log(result, '0000')
            self.information = result.data
            self.loading = false
            self.orgTotal = result.total
          })
      } else if (this.activeTab == 'dynamic') {
        uAxios.get(`admin/communities/moments?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            console.log(result, '11111')
            self.information = result.data.map((item) => {
              return {
                id: item.id,
                community_title: item.community ? item.community.title : '',
                user_id: item.user.id,
                user_name: item.user.name,
                content: item.content,
                created_at: item.created_at
              }
            })
            self.loading = false
            self.orgTotal = result.total
          })
      } else {
        uAxios.get(`admin/community/moment/complaints?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            console.log(result, '11111')
            self.information = result.data.map((item) => {
              return {
                id: item.id,
                community_moment_id: item.community_moment_id,
                community_user_id: item.community_moment.user_id,
                community_content: item.community_moment.content,
                created_at: item.created_at,
                user_id: item.user.id,
                user_name: item.user.name
              }
            })
            self.loading = false
            self.orgTotal = result.total
          })
      }
    },
    deletecommunity () {
      let self = this
      uAxios.delete('admin/communities/' + self.community_id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          this.information.splice(this.deleteIndex, 1)
          this.getlist()
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    deletedynamic () {
      let self = this
      uAxios.delete('admin/community/moments/' + self.dynamic_id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          this.information.splice(this.deleteIndex, 1)
          this.getlist()
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    deleteclassify () {
      let self = this
      uAxios.delete('admin/community/groups/' + self.group_id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          this.information.splice(this.deleteIndex, 1)
          this.getlist()
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    addclassify () { // 添加
      let self = this,
        data = {
          logo: self.logo,
          title: self.title,
          intro: self.intro
        }
      uAxios.post('admin/community/group', data).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('添加成功')
          this.getlist(this.currentPage)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    modification (value) { // 修改
      console.log(value, '56565')
      let self = this,
        data = {
          logo: self.logo,
          title: self.title,
          intro: self.intro
        }
      uAxios.put('admin/community/groups/' + self.group_id, data).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('修改成功')
          this.getlist(this.currentPage)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    share () {
      this.chart = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            roam: true,
            height: 600,
            data: [
              {
                name: '福恋',
                children: [
                  {
                    name: 'cluster',
                    children: [
                      {name: 'optim'},
                      {name: 'zation'},
                      {name: 'zation'},
                      {name: 'voptim'}
                    ]
                  },
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [{name: 'optim'}, {name: 'zation'}, {name: 'zation'}, {name: 'voptim'}]},
                  {
                    name: 'cluster',
                    children: [
                      {name: 'optim', children: [{name: 'optim', children: [{name: 'optim', children: [{name: 'optim', children: [{name: 'optim', children: [{name: 'optim'}]}]}]}]}]},
                      {name: 'zation'},
                      {name: 'zation'},
                      {name: 'voptim'}
                    ]
                  }
                ]
              }
            ],
            top: '5%',
            bottom: '20%',
            layout: 'radial',
            symbol: 'emptyCircle',
            symbolSize: 7,
            initialTreeDepth: 2,
            animationDurationUpdate: 800,
            expandAndCollapse: true,
            animationDuration: 600
          }
        ]
      }
    }
  },
  mounted () {
    if (this.access === 'admin') {
      this.activeTab = 'classify'
    }
    this.getlist(1)
  }
}
</script>

<style lang="less" scoped>
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
