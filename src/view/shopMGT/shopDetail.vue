<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane :label="title" name="adminList">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="22">
            <Col span="18">
              <Card title="基础信息">
                <FormItem label="门店名称：" prop="account">
                  <Input v-model="formItem.name" placeholder="请输入..." style="max-width:220px;"></Input>
                </FormItem>
                <FormItem label="门店地址：" prop="account">
                  <Row>
                    <Input  placeholder="右侧地图定位选择地址" :value="address" style="width: 320px;margin-right: 22px;"/>
                    <Button type="primary" @click="showMapModel = true">地图定位</Button>
                  </Row>
                </FormItem>
                <FormItem label="门店店长：" prop="account">
                  <span v-if="!showEdit">
                    <Input v-model="formItem.manager_name" placeholder="店长" style="max-width:220px;margin-right: 22px;"></Input>
                    <Button type="primary" @click="showEdit = true">重新选择</Button>
                  </span>
                  <span v-else>
                    <Select v-model="formItem.user_id" style="width: 220px;margin-right: 22px;" filterable @on-query-change="getGropData">
                      <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Button type="" @click="showEdit = true">取消</Button>
                  </span>

                </FormItem>
                <FormItem label="门店图片：" prop="account">
                  <Card style="max-width: 420px;">
                    <uploadImage v-on:uploadPictures="uploadPicture" :pic="formItem.pic"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="门店详请介绍：" prop="detail">
                  <tinymce-editor ref="editor"
                                  v-model="formItem.detail"
                                  style="width: 400px;">
                  </tinymce-editor>
                </FormItem>
                <FormItem label="营业执照：" prop="business_license">
                  <Card style="max-width: 420px;">
                    <uploadImage v-on:uploadPictures="uploadPictureV2" :pic="formItem.business_license"></uploadImage>
                  </Card>
                </FormItem>
              </Card>
              <Card title="门店课程" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="setFn()">新建课程</Button>
                <Table border :columns="courseList" :data="courseData"></Table>
              </Card>
              <Card title="门店提成记录" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="setFn()">设置提成</Button>
                <Table border :columns="columns" :data="push_money"></Table>
              </Card>
              <Card title="教练列表" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="addCoach=!addCoach">新增教练</Button>
                <Table border :columns="coachColumns" :data="coaches"></Table>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Modal v-model="addCoach" width="460" title="新增门店教练" @on-ok="addCoachFn" >
      <Form :label-width="100" >
        <FormItem label="教练头像：">
          <uploadImage v-on:uploadPictures="uploadCoachPic" :pic="coachPic"></uploadImage>
        </FormItem>
        <FormItem label="教练昵称：">
          <Input v-model="coachName" placeholder="请输入昵称" style="max-width:220px;"></Input>
        </FormItem>
        <FormItem label="教练简介：">
          <Input v-model="intro" placeholder="请输入昵称" style="max-width:220px;"></Input>
        </FormItem>
        <FormItem label="教练手机号：">
          <Input v-model="coachMobile" placeholder="请输入昵称" style="max-width:220px;"></Input>
        </FormItem>
        <FormItem label="登录密码：">
          <Input v-model="coachPassword" placeholder="请输入登录密码" style="max-width:220px;"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showMapModel" width="860" title="活动地址" @on-ok="ok">
      <Geolocation  @getLocation="getLocation"  @hideModal="hideModal" :setLocation="setLocation" ></Geolocation>
    </Modal>
    <Button type="primary" @click="saveFn" style="margin-right: 12px;">保存</Button>
    <Button @click="getBack" style="margin: 22px 0">返回</Button>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
// import config from '../../api/config'
import dropdown from '../components/dropdown'
import Geolocation from '../components/Geolocation'

// import Cookies from 'js-cookie'
import uploadImage from '../components/uploadImage'

import TinymceEditor from '../../../public/richEncapsulationV2'

export default {
  components: {
    dropdown,
    TinymceEditor,
    uploadImage,
    Geolocation
  },
  data () {
    return {
      addCoach: false,
      coachPic: '',
      coachName: '',
      intro: '',
      coachMobile: '',
      coachPassword: '',
      userID: '',
      showMapModel: false,
      showEdit: false,
      userList: [],
      poster: '',
      shopDetail: {},
      setLocation: [],
      push_money: [],
      coaches: [],
      title: '新增门店详情',
      filePath: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
      sizeList: [
        { title: '10次卡' },
        { title: '3次卡' }
      ],
      courseData: {},
      courseList: {},
      id: '',
      modal: false,
      modal1: false,
      formItem1: {
        name: '',
        price: '',
        num: ''
      },
      formItem2: {
        name: '',
        day: '',
        time: '',
        num: ''
      },
      coachList: [],
      coachColumns: [
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
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                }
              }
            })
          },
          width: 80,
          align: 'center'
        },
        {
          title: '昵称',
          key: 'name',
          align: 'center'
        },
        {
          title: '简介',
          key: 'intro',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'created_at',
          align: 'center'
        }
      ],
      columns: [
        {
          title: '创建时间',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '提成金额（元）',
          key: 'value',
          align: 'center'
        },
        {
          title: '提成比例（%）',
          key: 'ratio',
          align: 'center'
        },
        {
          title: '更新时间',
          key: 'updated_at',
          align: 'center'
        }
      ],
      address: '',
      formItem: {
        name: '',
        province: '',
        city: '',
        dist: '',
        address: '',
        pic: '',
        business_license: '',
        detail: '',
        longitude: '',
        latitude: '',
        user_id: ''
      }
    }
  },
  methods: {
    setFn () {
      this.$router.push({
        name: 'shopDeduct',
        query: { id: this.id }
      })
    },
    saveFn () {
      let vm = this
      console.log(vm.formItem)
      for (let item in vm.formItem) {
        if (!vm.formItem[item]) {
          return this.$Message.error('你有信息项未填写，请先填写!')
        }
      }
      uAxios.put(`stores/${this.id}`, vm.formItem)
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success('修改成功!')
            setTimeout(() => {
              this.$router.go(-1) // 返回上一层
            }, 800)
          }
        })
    },
    hideModal (val) {
      this.showMapModel = val
    },
    getLocation (childValue, lnglat) {
      let { address, dist } = childValue
      if (address) {
        console.log(address.split(dist))
      }
      this.address = `${childValue.address}`
      this.formItem.province = childValue.province
      this.formItem.city = childValue.city != '' ? childValue.city : childValue.province
      this.formItem.dist = childValue.dist
      this.formItem.address = address.split(dist)[1]
      this.formItem.longitude = lnglat[0]
      this.formItem.latitude = lnglat[1]
    },
    getGropData (value) {
      let self = this
      self.loading = true
      const msg = self.$Message.loading('正在加载中...', 0)
      uAxios.get(`users?keyword=${value}`)
        .then(res => {
          setTimeout(msg, 3000)
          self.loading = false
          let result = res.data.data.data
          this.userList = result.map((item) => {
            return {
              name: item.name,
              id: item.id
            }
          })
        })
        .catch(error => {
          self.loading = false
        })
    },
    uploadPicture (image) { // 单
      this.formItem.pic = image //
    },
    uploadPictureV2 (image) {
      this.formItem.business_license = image //
    },
    uploadCoachPic (image) {
      this.coachPic = image // 教练头像
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    // 删除
    handleRemove (file) {
      this.filePath = ''
      this.$emit('uploadPictures', this.filePath)
    },
    addStyle () {
      this.modal = true
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    addCoachFn () { // 添加教练
      let data = {
        photo: this.coachPic,
        name: this.coachName,
        intro: this.intro,
        mobile: this.coachMobile,
        password: this.coachPassword
      }
      uAxios.post(`stores/${this.id}/coach`, data)
        .then(res => {
          let result = res.data.data
          console.log(result)
          this.$Message.success('添加成功')
          this.getlist(1)
        })
    },

    cancel () {
      this.$Message.info('Clicked cancel')
    },
    deleteRender (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认删除该规格</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            this.$Message.info('删除成功')
          }, 2000)
        }
      })
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        this.checkAllGroup = ['香蕉', '苹果', '西瓜']
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === 3) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
      console.log(this.formValidate)
    },
    getBack () {
      this.$router.back(-1)
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // =========
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
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
      uAxios.get(`stores/${this.id}?nopage=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          self.address = `${result.province}${result.city}${result.dist}${result.address}`
          self.formItem = result
          self.push_money = result.push_money
          self.coaches = result.coaches
          self.loading = false
          console.log(self.formItem)
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getlist(1)
      this.title = '编辑门店详情'
    }
    console.log(this.$route.query)
  }
}
</script>

<style lang="less">
.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
