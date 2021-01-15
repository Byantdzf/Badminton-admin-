<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="首页轮播管理" name="adminList">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="22">
            <Col span="20">
              <Card title="轮播列表" style="margin-top: 22px;">
                <Button type="primary" style="margin-bottom: 22px; " @click="showCarouselsFn()">新增轮播</Button>
                <Table border :columns="columns" :data="carousels"></Table>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Modal v-model="showCarousels" width="460" :title="title" @on-ok="addCarouselFn" >
      <Form :label-width="100" >
        <FormItem label="轮播图片：">
          <uploadImage v-on:uploadPictures="uploadCoachPic" :pic="pic"></uploadImage>
        </FormItem>
        <FormItem label="跳转链接：">
          <Input v-model="path" placeholder="请输入昵称" style="max-width:220px;"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showImage" width="460" title="查看图片">
      <div style="text-align: center">
        <img :src="image" alt="" width="400" >
      </div>
    </Modal>
<!--    <Button type="primary" @click="saveFn" style="margin-right: 12px;">保存</Button>-->
<!--    <Button @click="getBack" style="margin: 22px 0">返回</Button>-->
  </Card>
</template>

<script>
import uAxios from '../../api/index'
import dropdown from '../components/dropdown'
import Geolocation from '../components/Geolocation'
import uploadImage from '../components/uploadImage'

export default {
  components: {
    dropdown,
    uploadImage,
    Geolocation
  },
  data () {
    return {
      showCarousels: false,
      showImage: false,
      pic: '',
      image: '',
      path: '',
      carouselId: '',
      carousels: [],
      title: '',
      columns: [
        {
          title: '创建时间',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '轮播图片',
          key: 'pic',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.pic
              },
              style: {
                width: '60px',
                height: '60px',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                  this.image = params.row.pic
                  this.showImage = !this.showImage
                }
              }
            })
          },
          align: 'center'
        },
        {
          title: '跳转链接',
          key: 'path',
          align: 'center'
        },
        {
          title: '更新时间',
          key: 'updated_at',
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
                    this.title = '编辑'
                    this.carouselId = params.row.id
                    this.pic = params.row.pic
                    this.path = params.row.path
                    this.showCarousels = !this.showCarousels
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
                      content: `<p>是否将移除该轮播图?</p>`,
                      onOk: () => {
                        this.removeCarousel(params.row.id, params.index)
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
    showCarouselsFn () {
      // this.coachName = ''
      // this.coachPic = ''
      // this.coachIntro = ''
      // this.coachId = 0
      // this.coacheTitle = '新增门店教练'
      this.showCarousels = !this.showCarousels
    },
    showTicketFn () {
      this.showTicket = !this.showTicket
    },
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
    removeCarousel (id) { // 删除教练
      let vm = this
      uAxios.delete(`carousels/${id}`)
        .then(res => {
          if (res.data.code == 0) {
            vm.$Message.success('删除成功!')
            vm.getlist(1)
          }
        })
    },
    hideModal (val) {
      this.showMapModel = val
    },
    uploadPicture (image) { // 单
      this.formItem.pic = image //
    },
    uploadPictureV2 (image) {
      this.formItem.business_license = image //
    },
    uploadCoachPic (image) {
      this.pic = image // 教练头像
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
    addCarouselFn () { // 添加轮播
      let data = {
        pic: this.pic,
        path: this.path,
        is_show: 1
      }
      if (!this.pic) return this.$Message.error('请上传图片')
      if (!this.path) return this.$Message.error('请填写跳转链接')
      if (this.carouselId) {
        uAxios.put(`carousels/${this.carouselId}`, data)
          .then(res => {
            let result = res.data.data
            console.log(result)
            this.$Message.success('修改成功')
            this.getlist(1)
          })
      } else {
        uAxios.post(`carousels`, data)
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
      this.getlist(num)
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`carousels?nopage=1&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          self.carousels = result
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    this.getlist(1)
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
