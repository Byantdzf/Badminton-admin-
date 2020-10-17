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
            </span>
            <Button type="success" style=" margin-bottom: 22px;margin-left: 12px;" @click="show">新建分类</Button>
            <Card>
              <p slot="title" style="color: #ff6c4c ">分类平台</p>
              <Table :loading="loading" :columns="Columns1" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
          <TabPane label="标签管理" name="label">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
              <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
            </span>
            <Button type="success" style=" margin-bottom: 22px;margin-left: 20px;" @click="newlabel">添加标签</Button>
            <Card>
              <p slot="title" style="color: #ff6c4c ">标签列表</p>
              <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
          <TabPane label="竞技场" name="arena" v-if="access == 'admin'">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
              <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
            </span>
            <Button type="success" style=" margin-bottom: 22px;margin-left: 20px;" @click="addArena">创建竞技场</Button>
            <Card>
              <p slot="title" style="color: #ff6c4c ">竞技场列表</p>
              <Table :loading="loading" :columns="Columns2" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
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
        <div style="margin-bottom: -40px;margin-top: 30px">分类LOGO：</div>
        <uploadImage v-on:uploadPictures="uploadlogo" :pic="image_url" v-model="image_url" style="margin-left: 80px"></uploadImage>
      </div>
      <p style="margin-bottom: 15px">
        分类名称：
        <Input placeholder="请输入..." class="text" style="width: 300px" v-model="title"></Input>
      </p>
      <p>
        标签选择：{{getLableId}}
        <Select v-model="getLableId" style="width: 300px;" filterable @on-change="getLabels">
          <Option v-for="item in get_lable" :value="item.id" :key="item.id">{{item.title}}</Option>
        </Select>
      </p>
    </Modal>
    <Modal
      v-model="modal1"
      title='温馨提示'
      ok-text="确定"
      @on-ok="modification"
      no-cancel>
      <p style="margin-bottom: 15px;">
        <div style="margin-bottom: -40px;margin-top: 30px;">分类LOGO：</div>
        <uploadImage v-on:uploadPictures="uploadlogo" :pic="image_url" style="margin-left: 80px" v-model="image_url"></uploadImage>
      </p>
      <p style="margin-bottom: 15px">
        分类名称：
        <Input placeholder="请输入..." style="width: 300px" v-model="title"></Input>
      </p>
      <p>
        标签选择：
        <Select v-model="getLableId" style="width: 300px;" filterable @on-change="getLabels">
          <Option v-for="item in get_lable" :value="item.id" :key="item.id">{{item.title}}</Option>
        </Select>
      </p>
    </Modal>
    <Modal
      v-model="modal2"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deleteclassify"
      no-cancel>
      <p>是否删除该分类？</p>
    </Modal>
    <Modal
      v-model="modal3"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deletelabel"
      no-cancel>
      <p>是否删除该标签？</p>
    </Modal>
    <Modal
      v-model="modal4"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deleteAthletics"
      no-cancel>
      <p>是否删除该竞技场？</p>
    </Modal>
    <Modal
      v-model="modal5"
      title='温馨提示'
      ok-text="确定"
      @on-ok="modificationLabel"
      no-cancel>
      <p style="margin-bottom: 15px">
        标签名称：
        <Input placeholder="请输入..." class="text" v-model="title"></Input>
      </p>
    </Modal>
    <Modal
      v-model="modal6"
      title='温馨提示'
      ok-text="确定"
      @on-ok="addLabel"
      no-cancel>
      <p style="margin-bottom: 15px">
        标签名称：
        <Input placeholder="请输入..." class="text" v-model="title"></Input>
      </p>
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
      modal5: false,
      modal6: false,
      switchLoading: false,
      activeTab: 'association',
      getLableId: '',
      get_lable: [],
      orgTotal: 0,
      access: localStorage.getItem('access'),
      label_id: '',
      athletics_id: '',
      user_id: '',
      dynamic_id: '',
      title: '',
      intro: '',
      image_url: '',
      chart: {},
      recommend_id: '',
      group_id: '',
      Columns: [
        {
          title: 'ID',
          align: 'center',
          key: 'id'
        },
        {
          title: '标签名称',
          align: 'center',
          key: 'title',
        },
        {
          title: '添加时间',
          align: 'center',
          key: 'created_at',
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
                    this.modal5 = true
                    this.label_id = params.row.id
                    this.title = params.row.title
                  }
                }
              }, '修改标签'),
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
                    this.label_id = params.row.id
                  }
                }
              }, '删除标签')
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
          title: '分类LOGO',
          key: 'image_url',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.image_url
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
          title: '创建时间',
          align: 'center',
          key: 'created_at'
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
                    this.image_url = params.row.image_url
                    this.getLableId = params.row.label_id
                  }
                }
              }, '分类修改'),
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
          title: '竞技标题',
          align: 'center',
          key: 'title'
        },
        {
          title: '子标题',
          align: 'center',
          key: 'sub_title'
        },
        {
          title: '女队队名',
          align: 'center',
          key: 'male_team_name'
        },
        {
          title: '女队人数',
          align: 'center',
          key: 'male_team_num'
        },
        {
          title: '男队队名',
          align: 'center',
          key: 'male_team_name'
        },
        {
          title: '男队人数',
          align: 'center',
          key: 'male_team_num'
        },
        {
          title: '开始时间',
          align: 'center',
          width: 130,
          key: 'start_time'
        },
        {
          title: '结束时间',
          align: 'center',
          width: 130,
          key: 'end_time'
        },
        {
          title: '是否推荐',
          align: 'center',
          width: 120,
          key: 'is_recommend',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                size: 'large',
                value: Boolean(params.row.is_recommend == '0' ? false : true)
              },
              scopedSlots: {
                open: () => h('span', '推荐'),
                close: () => h('span', 'NO')
              },
              on: {
                'on-change': (value) => {
                  this.recommend_id = params.row.id
                  this.addrecommend(value)
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
                  type: 'success'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'arenaParticulars',
                      params: argu
                    })
                  }
                }
              }, '竞技详情'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.modal4 = true
                    this.athletics_id = params.row.id
                  }
                }
              }, '删除竞技')
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
    addArena () {
      let argu = {id: 0}
      this.$router.push({
        name: 'arenaParticulars',
        params: argu
      })
    },
    show () {
      this.modal = true
      if (this.modal) {
        this.title = ''
        this.image_url = ''
      }
    },
    uploadlogo (image) {
      this.image_url = image // LoGo 单
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      this.getlist(num)
    },
    newlabel () {
      this.modal6 = true
      if (this.modal6) {
        this.title = ''
      }
    },
    handleSearch () {
      this.getlist(1)
    },
    getLabels () {
      let self = this
      uAxios.get(`admin/arena/labels?nopage=1`)
        .then(res => {
          let result = res.data.data
          self.get_lable = result.map((item) => {
            return {
              id: item.id,
              title: item.title
            }
          })
          console.log(self.get_lable, '111')
        })
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
      if (this.activeTab === 'classify') {
        uAxios.get(`admin/arena/groups?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            console.log(result, '000')
            self.information = result.data
            self.loading = false
            self.orgTotal = result.total
          })
      } else if (this.activeTab === 'label') {
        uAxios.get(`admin/arena/labels?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            console.log(result, '0000')
            self.information = result.data
            self.loading = false
            self.orgTotal = result.total
          })
      } else if (this.activeTab === 'arena') {
        uAxios.get(`admin/arenas?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            console.log(result, '11111')
            self.information = result.data.map((item) => {
              return {
                id: item.id,
                female_team_name: item.female_team_name,
                female_team_num: item.female_team_num,
                male_team_name: item.male_team_name,
                male_team_num: item.male_team_num,
                start_time: item.start_time,
                end_time: item.end_time,
                intro: item.intro,
                is_recommend: item.is_recommend,
                play_url: item.play_url,
                playback_url: item.playback_url,
                sub_title: item.sub_title,
                group_id: item.group_id,
                title: item.title,
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
    deletelabel () {
      let self = this
      uAxios.delete('admin/arena/labels/' + self.label_id).then((response) => {
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
    deleteAthletics () {
      let self = this
      uAxios.delete('admin/arenas/' + self.athletics_id).then((response) => {
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
      uAxios.delete('admin/arena/groups/' + self.group_id).then((response) => {
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
    addclassify () { // 添加分类
      let self = this,
        data = {
          image_url: self.image_url,
          title: self.title,
          label_id: self.getLableId
        }
      uAxios.post('admin/arena/groups', data).then((response) => {
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
    addLabel () { // 添加标签
      let self = this,
        data = {
          title: self.title
        }
      uAxios.post('admin/arena/labels', data).then((response) => {
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
    addrecommend (value) { // 添加推荐
      uAxios.post('admin/recommend/arenas/' + this.recommend_id).then((response) => {
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
    modification (value) { // 修改分类
      let self = this,
        data = {
          image_url: self.image_url,
          title: self.title,
          label_id: self.getLableId
        }
      uAxios.put('admin/arena/groups/' + self.group_id, data).then((response) => {
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
    modificationLabel (value) { // 修改标签
      let self = this,
        data = {
          title: self.title
        }
      uAxios.put('admin/arena/labels/' + self.label_id, data).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('修改成功')
          this.getlist(this.currentPage)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    }
  },
  mounted () {
    if (this.access === 'admin') {
      this.activeTab = 'classify'
    }
    this.getLabels()
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
