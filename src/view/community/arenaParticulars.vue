<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='arena_name' name="detail">
        <Row>
          <Col span="9">
            <Card>
              <Form :label-width="100" style="height: 600px">
                <FormItem label="竞技简介" prop="image">
                  <Card style="max-width: 350px;height: 95px">
                    <div>
                      <uploadImages v-on:uploadPictures="uploadPictures" :pic="intro"></uploadImages>
                    </div>
                  </Card>
                </FormItem>
                <FormItem label="二维码" prop="image">
                  <Card style="max-width: 350px;height: 95px">
                    <div>
                      <uploadImage v-on:uploadPictures="uploadqrcode" :pic="qrcode"></uploadImage>
                    </div>
                  </Card>
                </FormItem>
                <FormItem label="主播头像" prop="image">
                  <Card style="max-width: 350px;height: 95px">
                    <div>
                      <uploadImage v-on:uploadPictures="uploadavatar" :pic="guest_avatar"></uploadImage>
                    </div>
                  </Card>
                </FormItem>
                <FormItem label="竞技标题" prop="name">
                  <Input placeholder="Enter communitie title" v-model="title"></Input>
                </FormItem>
                <FormItem label="竞技子标题" prop="name">
                  <Input placeholder="Enter communitie sub_title" v-model="sub_title"></Input>
                </FormItem>
                <FormItem label="主播名字" prop="name">
                  <Input placeholder="Enter communitie guest_name" v-model="guest_name"></Input>
                </FormItem>
                <FormItem label="分类ID" prop="name">
                  <Select v-model="arena_ID" style="width: 350px;" filterable @on-change="getlist">
                    <Option v-for="item in group_id" :value="item.id" :key="item.id">{{ item.title }}</Option>
                  </Select>
                </FormItem>
              </Form>
              <div style="text-align: center;">
                <Button type="primary" @click="cancel ()">{{BtnText}}</Button>
              </div>
            </Card>
          </Col>
          <Col span="9" offset="1">
            <Card>
              <Form :label-width="100" style="height: 632px">
                <FormItem label="开始时间" prop="number">
                  <Date-picker type="datetime" placeholder="选择日期和时间" format="yyyy-MM-dd HH:mm" style="width: 350px" v-model="start_time" @on-change="start_time=$event"></Date-picker>
                </FormItem>
                <FormItem label="结束时间" prop="number">
                  <Date-picker type="datetime" placeholder="选择日期和时间" format="yyyy-MM-dd HH:mm" style="width: 350px" v-model="end_time" @on-change="end_time=$event"></Date-picker>
                </FormItem>
                <FormItem label="二维码标题" prop="name">
                  <Input placeholder="Enter communitie qrcode_intro" v-model="qrcode_intro"></Input>
                </FormItem>
                <FormItem label="男队队名" prop="name">
                  <Input placeholder="Enter communitie male_team_name" v-model="male_team_name"></Input>
                </FormItem>
                <FormItem label="女队队名" prop="name">
                  <Input placeholder="Enter communitie female_team_name" v-model="female_team_name"></Input>
                </FormItem>
                <FormItem label="播放链接" prop="number">
                  <Input placeholder="Enter communitie play_url" v-model="play_url"></Input>
                </FormItem>
                <FormItem label="回放链接" prop="number">
                  <Input placeholder="Enter communitie playback_url" v-model="playback_url"></Input>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <!--<Col span="19" style="margin-top: 10px" v-if="id !== 0">-->
            <!--<Card>-->
              <!--<p slot="title" style="color: #ff6c4c ">标签列表</p>-->
              <!--<Button type="success" style="margin-left: 6px;margin-bottom: 10px" @click="show">搜索分类</Button>-->
              <!--<Table :loading="loading" :columns="Columns" :data="informations" style="width: 100%;" border></Table>-->
              <!--<Page :total="orgTotal" @on-change="handlePage" :page-size="15"-->
                    <!--style="float:right;margin-top:10px;"></Page>-->
              <!--<div style="clear: both"></div>-->
            <!--</Card>-->
          <!--</Col>-->
        </Row>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modal"
      title='温馨提示'
      ok-text="确定"
      @on-ok="addition"
      no-cancel>
      <Select v-model="arenalable_id" style="width: 300px;" filterable @on-query-change="arenalable">
        <Option v-for="item in arena_lable" :value="item.id" :key="item.id">{{ item.title }}</Option>
      </Select>
    </Modal>
    <Modal
      v-model="modal2"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deletelabel"
      no-cancel>
      <p>是否删除该标签？</p>
    </Modal>
  </div>
</template>

<script>
import uAxios from '../../api'
import uploadImages from '../components/uploadImages'
import uploadImage from '../components/uploadImage'

export default {
  components: {
    uploadImages,
    uploadImage
  },
  data () {
    return {
      arena: '社群平台',
      loading: false,
      BtnText: '保存修改',
      orgTotal: 0,
      group: false,
      intro: [],
      modal: false,
      arena_ID: '',
      modal2: false,
      arenalable_id: '',
      arena_lable: [],
      arena_label_link: '',
      arena_name: '',
      informations: [],
      judge: false,
      sub_title: '',
      guest_avatar: '',
      guest_name: '',
      qrcode: '',
      Columns: [
        {
          title: 'ID',
          align: 'center',
          key: 'id'
        },
        {
          title: '标签名称',
          align: 'center',
          key: 'title'
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
                  type: 'error'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.modal2 = true
                    this.arena_label_link = params.row.id
                  }
                }
              }, '删除标签')
            ])
          }
        }
      ],
      qrcode_intro: '',
      group_id: [],
      male_team_name: '',
      female_team_name: '',
      start_time: '',
      end_time: '',
      deleteIndex: 0,
      play_url: '',
      playback_url: '',
      title: '',
      id: 0
    }
  },
  methods: {
    uploadPictures (image) {
      this.intro = image // 详情image
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      this.getlable(num)
    },
    show () {
      this.modal = true
    },
    uploadqrcode (image) {
      this.qrcode = image // 主播头像 单
    },
    uploadavatar (image) {
      this.guest_avatar = image // 主播头像 单
    },
    cancel () {
      let self = this,
        data = {
          id: this.id,
          intro: this.intro,
          title: this.title,
          qrcode: this.qrcode,
          qrcode_intro: this.qrcode_intro,
          guest_avatar: this.guest_avatar,
          guest_name: this.guest_name,
          sub_title: this.sub_title,
          group_id: this.arena_ID,
          male_team_name: this.male_team_name,
          female_team_name: this.female_team_name,
          start_time: this.start_time,
          end_time: this.end_time,
          play_url: this.play_url,
          playback_url: this.playback_url
        }
      if (!this.qrcode) return this.$Message.error('缺少二维码!')
      if (!this.qrcode_intro) return this.$Message.error('缺少标题!')
      if (!this.guest_avatar) return this.$Message.error('缺少标题!')
      if (!this.guest_name) return this.$Message.error('缺少子标题!')
      if (!this.intro) return this.$Message.error('缺少简介!')
      if (!this.title) return this.$Message.error('缺少标题!')
      if (!this.group_id) return this.$Message.error('缺少标题!')
      if (!this.sub_title) return this.$Message.error('缺少子标题!')
      if (!this.male_team_name) return this.$Message.error('缺少男队队名!')
      if (!this.female_team_name) return this.$Message.error('缺少女队队名!')
      if (!this.start_time) return this.$Message.error('缺少开始时间!')
      if (!this.end_time) return this.$Message.error('缺少结束时间!')
      if (!this.play_url) return this.$Message.error('缺少播放链接!')
      if (this.id === 0) {
        uAxios.post(`admin/arenas`, data).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('创建成功!')
            setTimeout(() => {
              this.$router.push({
                name: 'squareList'
              })
            }, 800)
          } else {
            alert('操作失败！')
          }
        })
        return
      }
      uAxios.put(`admin/arenas/${this.id}`, data).then(response => {
        if (response.data.code === 0) {
          this.$Message.success('保存成功!')
          setTimeout(() => {
            this.$router.push({
              name: 'squareList'
            })
          }, 800)
        } else {
          alert('操作失败！')
        }
      })
    },
    addition () { // 添加竞技场标签
      let label_ids = []
      label_ids.push(this.arenalable_id)
      console.log(label_ids, '000')
      let data = {
        label_ids: label_ids
      }
      uAxios.post('admin/link/arenas/' + this.id + '/labels', data)
        .then(res => {
          if (res.data.code === 0) this.$Message.info('添加成功')
          this.getlable()
        })
    },
    arenalable () { // 标签列表
      let self = this
      uAxios.get(`admin/arena/labels?nopage=1`)
        .then(res => {
          let result = res.data.data
          self.arena_lable = result.map((item) => {
            return {
              id: item.id,
              title: item.title
            }
          })
          self.loading = false
          self.orgTotal = result.total
        })
    },
    arenaList () {
      let self = this
      uAxios.get('admin/arenas/' + this.id)
        .then(res => {
          let result = res.data.data
          this.intro = JSON.parse(result.intro)
          this.title = result.title
          this.guest_avatar = result.guest_avatar
          this.guest_name = result.guest_name
          this.qrcode = result.qrcode
          this.qrcode_intro = result.qrcode_intro
          this.sub_title = result.sub_title
          this.male_team_name = result.male_team_name
          this.female_team_name = result.female_team_name
          this.arena_ID = result.group.title
          this.start_time = result.start_time
          this.end_time = result.end_time
          this.play_url = result.play_url
          this.playback_url = result.playback_url
        })
    },
    getlable (page) {
      let self = this
      uAxios.get('admin/arenas/' + this.id + '/labels')
        .then(res => {
          let result = res.data.data
          self.informations = result.data.map((item) => {
            return {
              id: item.id,
              title: item.label.title,
              created_at: item.label.created_at
            }
          })
          self.orgTotal = result.total
        })
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get('admin/arena/groups')
        .then(res => {
          let result = res.data.data
          self.group_id = result.data.map((item) => {
            return {
              id: item.id,
              title: item.title
            }
          })
          for (let item of self.group_id) {
            if (self.arena_ID === item.title) {
              self.arena_ID = item.id
            }
          }
        })
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
    },
    deletelabel (index) {
      uAxios.delete('admin/arena/label/links/' + this.arena_label_link).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          this.getlable(this.currentPage)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    }
  },
  mounted () {
    if (this.$route.params.id != 0) {
      this.id = this.$route.params.id
      this.arenaList()
      this.getlable()
    }
    this.getlist()
    this.arenalable()
    if (this.id === 0) {
      this.BtnText = '保存新建'
    }
  }
}
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }
  #container {width:300px; height: 180px;}

  .distpicker-address-wrapper select {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0 12px !important;
    margin-right: 12px !important;
    font-size: 14px !important;
  }
  Input{
    max-width: 350px;
  }
</style>
