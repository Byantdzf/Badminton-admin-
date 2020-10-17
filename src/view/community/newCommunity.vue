<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='communitie_name' name="detail">
        <Row>
          <Col span="9">
            <Card>
              <Form :label-width="100" style="height: 600px">
                <FormItem label="社群LoGo" prop="image">
                  <Card style="max-width: 420px;height: 95px">
                    <div>
                      <uploadImage v-on:uploadPictures="uploadlogo" :pic="logo"></uploadImage>
                    </div>
                  </Card>
                </FormItem>
                <FormItem label="社区名称" prop="name">
                  <Input placeholder="Enter communitie title" v-model="title"></Input>
                </FormItem>
                <FormItem label="社群介绍" prop="name">
                  <div style="max-width: 420px;">
                    <Input placeholder="Enter communitie intro" type="textarea" v-model="intro" :rows="4"></Input>
                  </div>
                </FormItem>
                <FormItem label="群主ID" prop="name">
                  <Input placeholder="Enter communitie owner_id" v-model="owner_id"></Input>
                </FormItem>
                <FormItem label="海报链接" prop="name">
                  <Input placeholder="Enter communitie owner_link" v-model="poster_path"></Input>
                </FormItem>
                <FormItem label="群主微信" prop="name">
                  <Row>
                    <Input placeholder="Enter communitie owner_wechat" v-model="owner_wechat"></Input>
                  </Row>
                </FormItem>
                <FormItem label="群成员数" prop="number">
                  <Row>
                    <Input v-model="member_num" readonly></Input>
                  </Row>
                </FormItem>
                <FormItem label="访问数" prop="number">
                  <Row>
                    <Input v-model="click_num" readonly></Input>
                  </Row>
                </FormItem>
              </Form>
              <div style="text-align: center">
                <Button type="primary" @click="cancel ()">{{BtnText}}</Button>
              </div>
            </Card>
          </Col>
          <Col span="12" offset="1">
            <Card>
              <Form :label-width="100">
                <FormItem label="群主二维码" prop="image">
                  <Card style="max-width: 420px;height: 95px">
                    <uploadImage v-on:uploadPictures="uploadwechatQrcode" :pic="wechat_qrcode"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="群二维码" prop="image">
                  <Card style="max-width: 420px;height: 95px">
                    <uploadImage v-on:uploadPictures="uploadqrcode" :pic="qrcode"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="社区海报" prop="image">
                  <Card style="max-width: 420px;height: 95px">
                    <uploadImage v-on:uploadPictures="uploadposter" :pic="poster"></uploadImage>
                  </Card>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
    <!--<Modal-->
      <!--v-model="modal"-->
      <!--title='温馨提示'-->
      <!--ok-text="确定"-->
      <!--@on-ok="addition"-->
      <!--no-cancel>-->
      <!--<Select v-model="communityID" style="width: 300px;" filterable @on-query-change="classify">-->
        <!--<Option v-for="item in group_id" :value="item.id" :key="item.id">{{ item.title }}</Option>-->
      <!--</Select>-->
    <!--</Modal>-->
  </div>
</template>

<script>
import uAxios from '../../api'
import uploadImage from '../components/uploadImage'
// import uploadImages from '../components/uploadImages'

export default {
  components: {
    uploadImage
  },
  data () {
    return {
      communitie_name: '社群平台',
      loading: false,
      client_id: 0,
      modal: false,
      information: [],
      informations: [],
      BtnText: '保存新建',
      intro: '',
      group_id: [],
      classifyID: 0,
      orgTotal: 0,
      ID: 0,
      poster_path: '',
      logo: '',
      owner_link: '',
      owner_name: '',
      owner_id: '',
      wechat_qrcode: '',
      owner_photo: '',
      owner_wechat: '',
      qrcode: '',
      poster: '',
      communityID: 0,
      title: '',
      member_num: '',
      click_num: '',
      id: '',
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
                  }
                }
              }, '删除分类')
            ])
          }
        }
      ],
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'key'
        }
      ]
    }
  },
  methods: {
    uploadPicture (image) {
      this.owner_photo = image // 群头像  单
    },
    uploadqrcode (image) {
      this.qrcode = image // 群二维码 单
    },
    uploadposter (image) {
      this.poster = image // 群海报 单
    },
    uploadlogo (image) {
      this.logo = image // LoGo 单
    },
    uploadwechatQrcode (image) {
      this.wechat_qrcode = image // 群主二维码 单
    },
    // reveal () {
    //   this.modal = true
    // },
    // addition () {
    //   console.log(this.ID[0], '56')
    //   let idArray = []
    //   idArray.push(this.communityID)
    //   idArray.push(this.ID)
    //   let data = {
    //     group_ids: idArray
    //   }
    //   uAxios.post('admin/community', data)
    //     .then(res => {
    //       if (res.data.code === 0) this.$Message.info('添加成功')
    //       this.information.splice(this.feedbackIndex, 1)
    //     })
    // },
    cancel () {
      this.modal = false
      let self = this,
        data = {
          id: this.id,
          intro: this.intro,
          poster_path: this.poster_path,
          owner_name: this.owner_name,
          user_id: this.owner_id,
          owner_photo: this.owner_photo,
          owner_wechat: this.owner_wechat,
          qrcode: this.qrcode,
          poster: this.poster,
          wechat_qrcode: this.wechat_qrcode,
          logo: this.logo,
          title: this.title
        }
      if (!this.logo) return this.$Message.error('缺少LoGo!')
      if (!this.title) return this.$Message.error('缺少社区名称!')
      if (!this.owner_id) return this.$Message.error('缺少群主ID!')
      if (!this.qrcode) return this.$Message.error('缺少群二维码!')
      if (!this.poster) return this.$Message.error('缺少社群海报!')
      uAxios.post('admin/community', data)
        .then(res => {
          if (res.data.code === 0) this.$Message.info('新建成功')
          this.information.splice(this.feedbackIndex, 1)
          setTimeout(() => {
            this.$router.push({
              name: 'community'
            })
          }, 800)
        })
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      if (this.social.length == 0) {
        this.getlist(num)
      } else {
        this.filterLabel(num)
      }
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
    },
    // getlist (page) {
    //   let self = this
    //   uAxios.get('admin/communities')
    //     .then(res => {
    //       let result = res.data.data
    //       // self.ID = result.data.map((item) => {
    //       //   return {
    //       //     id: item.id
    //       //   }
    //       // })
    //       for (let item of result.data) {
    //         self.ID = result.data[0].id
    //       }
    //       console.log(self.ID, '999999')
    //     })
    // },
    // classify (value) {
    //   let self = this
    //   uAxios.get(`admin/community/groups`)
    //     .then(res => {
    //       let result = res.data.data.data
    //       console.log(result, '9696')
    //       this.group_id = result.map((item) => {
    //         return {
    //           id: item.id,
    //           title: item.title
    //         }
    //       })
    //       self.loading = false
    //       console.log(this.communityID, '000')
    //     })
    // }
  },
  mounted () {
    // if (this.$route.params.id != 0) {
    //   this.id = this.$route.params.id
    //   this.getlist()
    //   this.classify()
    //   return
    // }
    // this.getlist()
    // this.classify()
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
    max-width: 420px;
  }
</style>
