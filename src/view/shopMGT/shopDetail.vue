<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane :label="title" name="adminList">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="22">
            <Col span="20">
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
                    <Select v-model="formItem.user_id" style="width: 220px;margin-right: 22px;" filterable @on-query-change="getGropData" >
                      <Option v-for="item in userList" :value="item.id" :key="item.id" >{{ item.name }}</Option>
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
                <Button @click="getBack" style="margin: 22px 12px;">返回</Button>
                <Button type="primary" @click="saveFn" >保存</Button>
              </Card>
              <Card title="门店课程" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="addCourseFn()">新建课程</Button>
                <Table border :columns="courseList" :data="courseData"></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="margin-top:30px;margin-bottom:30px;"  show-elevator></Page>
              </Card>
              <Card title="预约券列表" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="showTicketFn()">新增预约券</Button>
                <Table border :columns="ticketColumns" :data="tickets"></Table>
              </Card>
              <Card title="门店提成记录" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="setFn()">设置提成</Button>
                <Table border :columns="columns" :data="push_money"></Table>
              </Card>
              <Card title="教练列表" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="showCoachFn()">新增教练</Button>
                <Table border :columns="coachColumns" :data="coaches"></Table>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Modal v-model="addCoach" width="460" :title="coacheTitle" @on-ok="addCoachFn" >
      <Form :label-width="100" >
        <FormItem label="教练头像：">
          <uploadImage v-on:uploadPictures="uploadCoachPic" :pic="coachPic"></uploadImage>
        </FormItem>
        <FormItem label="教练昵称：">
          <Input v-model="coachName" placeholder="请输入昵称" style="max-width:220px;"></Input>
        </FormItem>
        <FormItem label="教练简介：">
          <Input v-model="coachIntro" placeholder="请输入昵称" style="max-width:220px;"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showTicket" width="460" title="预约券详情" @on-ok="addTitleFn" >
      <Form :label-width="100" >
        <FormItem label="卡券名称：">
          <Input v-model="TicketData.name" placeholder="请输入卡券名称" style="max-width:220px;"></Input>
        </FormItem>
        <FormItem label="预约次数：">
          <Input v-model="TicketData.total_num" placeholder="请输入可预约次数" style="max-width:220px;"></Input>
        </FormItem>
        <FormItem label="有效天数：">
          <Input v-model="TicketData.valid_days" placeholder="请输入有效天数" style="max-width:220px;"></Input>
        </FormItem>
        <FormItem label="实付价格：">
          <Input v-model="TicketData.price" placeholder="请输入价格" style="max-width:220px;"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showMapModel" width="860" title="活动地址" @on-ok="ok">
      <Geolocation  @getLocation="getLocation"  @hideModal="hideModal" :setLocation="setLocation" ></Geolocation>
    </Modal>
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
      showTicket: false,
      TicketData: {
        name: '',
        total_num: '',
        valid_days: '',
        price: ''
      },
      coachPic: '',
      coachId: '',
      ticketId: '',
      coachName: '',
      coachIntro: '',
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
      orgTotal: 0, // 分页
      coaches: [],
      title: '新增门店详情',
      coacheTitle: '新增门店教练',
      filePath: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
      sizeList: [
        { title: '10次卡' },
        { title: '3次卡' }
      ],
      courseData: [],
      courseList: [
        {
          title: '课程ID',
          key: 'id',
          align: 'center'
        },
        {
          title: '课程名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '头像',
          key: 'photo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.pic
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
        // {
        //   title: '总次数',
        //   key: 'total_num',
        //   align: 'center'
        // },
        // {
        //   title: '已预约',
        //   key: 'valid_days',
        //   align: 'center'
        // },
        {
          title: '状态',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            if (params.row.is_show == '1') {
              return h('span', '启用')
            } else {
              return h('span', '禁用')
            }
          }
        },
        {
          title: '创建时间',
          key: 'created_at',
          align: 'center'
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
                      name: 'editCourseDetailTeam',
                      query: { id: this.id, courseId: params.row.id }
                    })
                    console.log(this.coachId)
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
                      content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除?</p>`,
                      onOk: () => {
                        this.removeCourse(params.row.id, params.index)
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tickets: [],
      ticketColumns: [
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '总次数',
          key: 'total_num',
          align: 'center'
        },
        {
          title: '有效天数',
          key: 'valid_days',
          align: 'center'
        },
        {
          title: '价格',
          key: 'price',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'created_at',
          align: 'center'
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
                    this.TicketData.name = params.row.name
                    this.TicketData.total_num = params.row.total_num
                    this.TicketData.valid_days = params.row.valid_days
                    this.TicketData.price = params.row.price
                    this.ticketId = params.row.id
                    this.showTicket = !this.showTicket
                    console.log(this.coachId)
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
                      content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除?</p>`,
                      onOk: () => {
                        this.removeTicket(params.row.id, params.index)
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      id: '',
      modal: false,
      modal1: false,
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
                    this.coacheTitle = '编辑门店教练'
                    this.coachName = params.row.name
                    this.coachPic = params.row.photo
                    this.coachIntro = params.row.intro
                    this.coachId = params.row.id
                    this.addCoach = !this.addCoach
                    console.log(this.coachId)
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
                      content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除?</p>`,
                      onOk: () => {
                        this.removeCoach(params.row.id, params.index)
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
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
    showCoachFn () {
      this.coachName = ''
      this.coachPic = ''
      this.coachIntro = ''
      this.coachId = 0
      this.coacheTitle = '新增门店教练'
      this.addCoach = !this.addCoach
    },
    showTicketFn () {
      this.showTicket = !this.showTicket
    },
    addCourseFn () {
      this.$router.push({
        name: 'editCourseDetailTeam',
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
    removeCoach (id) { // 删除教练
      let vm = this
      uAxios.delete(`stores/coaches/${id}`)
        .then(res => {
          if (res.data.code == 0) {
            vm.$Message.success('删除成功!')
            vm.getlist(1)
          }
        })
    },
    removeTicket (id) { // 删除预约券
      let vm = this
      uAxios.delete(`course/tickets?store_id=${id}`)
        .then(res => {
          if (res.data.code == 0) {
            vm.$Message.success('删除成功!')
            vm.getTickets(1)
          }
        })
    },
    removeCourse (id) { // 删除删除课程
      let vm = this
      uAxios.delete(`courses/${id}`)
        .then(res => {
          if (res.data.code == 0) {
            vm.$Message.success('删除成功!')
            vm.getCourseData(1)
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
    addTitleFn () { // 添加预约券
      let data = {
        name: this.TicketData.name,
        total_num: this.TicketData.total_num,
        valid_days: this.TicketData.valid_days,
        price: this.TicketData.price,
        store_id: this.id,
        is_show: 1
      }
      console.log(data)
      // return
      if (this.ticketId) {
        uAxios.put(`course/tickets`, data)
          .then(res => {
            let result = res.data.data
            console.log(result)
            this.$Message.success('修改成功')
            this.getTickets(1)
          })
      } else {
        uAxios.post(`course/tickets`, data)
          .then(res => {
            let result = res.data.data
            console.log(result)
            this.$Message.success('添加成功')
            this.getTickets(1)
          })
      }
    },
    addCoachFn () { // 添加教练
      let data = {
        photo: this.coachPic,
        name: this.coachName,
        intro: this.coachIntro
      }
      if (this.coachId) {
        uAxios.put(`stores/coaches/${this.coachId}`, data)
          .then(res => {
            let result = res.data.data
            console.log(result)
            this.$Message.success('修改成功')
            this.getlist(1)
          })
      } else {
        uAxios.post(`stores/${this.id}/coach`, data)
          .then(res => {
            let result = res.data.data
            console.log(result)
            this.$Message.success('添加成功')
            this.getlist(1)
          })
      }
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
      this.getCourseData(num)
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
    getCourseData (page) {
      let self = this
      self.loading = true
      uAxios.get(`courses?store_id=${this.id}&nopage=1&type=league`)
        .then(res => {
          let result = res.data.data
          self.courseData = result.data
          self.orgTotal = result.total
          console.log(self.courseData, 'tickets')
        })
    },
    getTickets (page) {
      let self = this
      self.loading = true
      uAxios.get(`course/tickets?store_id=${this.id}&nopage=1`)
        .then(res => {
          let result = res.data.data
          self.tickets = result
          console.log(self.tickets)
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
      this.getTickets(1)
      this.getCourseData(1)
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
