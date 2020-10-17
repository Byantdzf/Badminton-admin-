<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='communitie_name' name="detail">
        <Row>
          <Col span="9">
            <Card>
              <Form :label-width="100">
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
                <FormItem label="群主名称" prop="name">
                  <Input placeholder="Enter communitie owner_name" v-model="owner_name"></Input>
                </FormItem>
                <FormItem label="社群链接" prop="name">
                  <Input placeholder="Enter communitie owner_link" v-model="intro_path"></Input>
                </FormItem>
                <FormItem label="群主微信" prop="name">
                  <Row>
                    <Input placeholder="Enter communitie owner_wechat" v-model="owner_wechat"></Input>
                  </Row>
                </FormItem>
                <FormItem label="群主头像" prop="image">
                  <Card style="max-width: 420px;height: 95px">
                    <uploadImage v-on:uploadPictures="uploadPicture" :pic="owner_photo"></uploadImage>
                  </Card>
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
          <Col span="9" offset="1">
            <Card>
              <Form :label-width="100" style="height: 730px">
                <FormItem label="群二维码" prop="image">
                  <Card style="max-width: 420px;height: 95px">
                    <uploadImage v-on:uploadPictures="uploadqrcode" :pic="qrcode"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="群二维码" prop="image">
                  <img :src="qrcode" style="width: 300px" alt="">
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import uAxios from '../../api'
import uploadImages from '../components/uploadImages'
import uploadImage from '../components/uploadImage'
// import uploadImages from '../components/uploadImages'

export default {
  components: {
    uploadImages,
    uploadImage
  },
  data () {
    return {
      communitie_name: '社群平台',
      loading: false,
      information: [],
      BtnText: '保存修改',
      intro: '',
      intro_path: '',
      logo: '',
      owner_link: '',
      owner_name: '',
      owner_photo: '',
      owner_wechat: '',
      qrcode: '',
      title: '',
      member_num: '',
      click_num: '',
      id: '',
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
    uploadlogo (image) {
      this.logo = image // LoGo 单
    },
    // uploadPictures (image) {
    //   this.logo = image // 详情image
    // },
    cancel () {
      this.modal = false
      let self = this,
        data = {
          id: this.id,
          intro: this.intro,
          intro_path: this.intro_path,
          owner_name: this.owner_name,
          owner_photo: this.owner_photo,
          owner_wechat: this.owner_wechat,
          qrcode: this.qrcode,
          logo: this.logo,
          title: this.title
        }
      uAxios.put('admin/communities/' + self.id, data)
        .then(res => {
          if (res.data.code === 0) this.$Message.info('修改成功')
          this.information.splice(this.feedbackIndex, 1)
        })
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get('admin/communities/' + self.id)
        .then(res => {
          let result = res.data.data
          console.log(result, '999999')
          self.id = result.id
          self.title = result.title
          self.intro = result.intro
          self.logo = result.logo
          self.owner_name = result.owner_name
          self.owner_wechat = result.owner_wechat
          self.owner_photo = result.owner_photo
          self.qrcode = result.qrcode
          self.member_num = result.member_num
          self.click_num = result.click_num
          self.intro_path = result.intro_path
        })
    }
  },
  mounted () {
    if (this.$route.params.id != 0) {
      this.id = this.$route.params.id
      this.getlist()
      return
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
    max-width: 420px;
  }
</style>
