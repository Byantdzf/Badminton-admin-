<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane :label="title" name="adminList">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="22">
            <Col span="18">
              <Card title="基础信息">
                <FormItem label="课程名称：" prop="account">
                  <Input v-model="formItem.name" placeholder="请输入..." style="max-width:220px;"></Input>
                </FormItem>
                <FormItem label="门店地址：" prop="account">
                  <Row>
                    <Input  placeholder="右侧地图定位选择地址" :value="address" style="width: 320px;margin-right: 22px;"/>
                    <Button type="primary" @click="showMapModel = true">地图定位</Button>
                  </Row>
                </FormItem>
                <FormItem label="所属店长：" prop="account">
                  <Select v-model="formItem.user_id" style="width: 220px;" filterable @on-query-change="getGropData">
                    <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="课程图片：" prop="account">
                  <Card style="max-width: 420px;">
                    <uploadImage v-on:uploadPictures="uploadPicture" :pic="formItem.pic"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="课程详请信息：" prop="detail">
                  <tinymce-editor ref="editor"
                                  v-model="formItem.detail"
                                  style="max-width: 600px;height: 200px;">
                  </tinymce-editor>
                </FormItem>
                <FormItem label="营业执照：" prop="business_license">
                  <Card style="max-width: 420px;">
                    <uploadImage v-on:uploadPictures="uploadPictureV2" :pic="formItem.business_license"></uploadImage>
                  </Card>
                </FormItem>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Modal v-model="showMapModel" width="860" title="活动地址" @on-ok="ok">
      <Geolocation  @getLocation="getLocation"  @hideModal="hideModal" :setLocation="setLocation" ></Geolocation>
    </Modal>
<!--    新增规格-->
    <Modal
      v-model="modal"
      title="新增规格"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :model="formItem1" :label-width="80">
        <FormItem label="规格名称：">
          <Input v-model="formItem1.name" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
        <FormItem label="库存：">
          <Input v-model="formItem1.num" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
        <FormItem label="销售价：">
          <Input v-model="formItem1.price" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
      </Form>
    </Modal>
<!--    新增课时-->
    <Modal
      v-model="modal1"
      title="新增课时"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :model="formItem2" :label-width="120">
        <FormItem label="规格名称：">
          <Input v-model="formItem2.name" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
        <FormItem label="时间：">
          <DatePicker type="datetimerange" placeholder="选择查询日期" style="width:200px;"></DatePicker>
        </FormItem>
        <FormItem label="有效期（天）：">
          <Input v-model="formItem2.day" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
        <FormItem label="上课人数：">
          <Input v-model="formItem2.num" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
      </Form>
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
      userID: '',
      showMapModel: false,
      userList: [],
      poster: '',
      setLocation: [],
      title: '新增门店详情',
      filePath: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
      sizeList: [
        { title: '10次卡' },
        { title: '3次卡' }
      ],
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
      columns: [
        {
          title: '规格',
          key: 'name',
          align: 'center'
        },
        {
          title: '库存',
          key: 'num',
          align: 'center'
        },
        {
          title: '销售价',
          key: 'price',
          align: 'center'
        }
      ],
      data: [
        {
          name: '10次卡',
          num: 18,
          price: '12.00'
        },
        {
          name: '3次卡',
          num: 12,
          price: '4.00'
        }
      ],
      columns1: [
        {
          title: '课时',
          key: 'name',
          align: 'center'
        },
        {
          title: '时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '有效期（天）',
          key: 'day',
          align: 'center'
        },
        {
          title: '上课人数',
          key: 'num',
          align: 'center'
        }
      ],
      data2: [
        {
          name: '第一课时',
          num: 18,
          day: '12',
          time: '2020-10-12 8:00 ~ 2020-10-15 12:00'
        },
        {
          name: '第二课时',
          num: 12,
          day: '12',
          time: '2020-10-12 8:00 ~ 2020-10-15 12:00'
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
        location_longitude: '',
        location_latitude: '',
        user_id: ''
      }
    }
  },
  methods: {
    saveFn () {
      let vm = this
      console.log(vm.formItem)
      for (let item in vm.formItem) {
        if (!vm.formItem[item]) {
          return this.$Message.error('你有信息项未填写，请先填写!')
        }
      }
      uAxios.post(`stores`, vm.formItem)
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success('创建成功!')
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
      this.formItem.location_longitude = lnglat[0]
      this.formItem.location_latitude = lnglat[1]
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
      uAxios.get(`admin/admins?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data.map((item) => {
              let { user } = item
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
    if (this.$route.query.id) {
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
