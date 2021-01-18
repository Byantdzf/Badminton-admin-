<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane :label="title" name="adminList">
        <Form :model="formData" :label-width="100">
          <Row :gutter="22">
            <Col span="10">
              <Card title="基础信息">
                <FormItem label="课程名称：" prop="account">
                  <Input v-model="formData.name" placeholder="请输入..." style="max-width:220px;"></Input>
                </FormItem>
                <FormItem label="所属门店：" prop="account">
                  <Input v-model="formData.store_name" placeholder="店长" disabled style="max-width:220px;margin-right: 22px;"></Input>
                </FormItem>
                <FormItem label="所属店长：" prop="account">
                  <Input v-model="manager_name" placeholder="店长" disabled style="max-width:220px;margin-right: 22px;"></Input>
                </FormItem>
                <FormItem label="课程图片：" prop="account">
                  <uploadImage v-on:uploadPictures="uploadPicture" :pic="formData.pic"></uploadImage>
                </FormItem>
                <FormItem label="状态：" prop="account">
                  <RadioGroup v-model="formData.is_show">
                    <Radio label="1">显示</Radio>
                    <Radio label="0">隐藏</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="课程详请信息：" prop="account">
                  <tinymce-editor ref="editor"
                                  v-model="formData.detail"
                                  style="max-width: 600px;height: 200px;">
                  </tinymce-editor>
                </FormItem>
                <Button @click="getBack" style="margin: 22px 12px;">返回</Button>
                <Button type="primary" @click="saveFn" >保存</Button>
              </Card>
            </Col>
            <Col span="14" v-if="courseId">
              <Card title="课程表">
                <p class="" style="color: #5cadff;text-align: right;margin-top: -50px;margin-bottom: 42px;"  @click.stop="modal1 = true"> + 新增课时</p>
                <Table border :columns="columns" :data="data"></Table>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
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
          <DatePicker type="datetimerange" v-model="day" placeholder="选择查询日期" style="width:200px;"></DatePicker>
        </FormItem>
<!--        <FormItem label="有效天数">-->
<!--          <Input v-model="formItem2.valid_day"  placeholder="请输入..." style="width:200px;"></Input>-->
<!--        </FormItem>-->
        <FormItem label="上课人数：">
          <Input v-model="formItem2.num" placeholder="请输入..." style="width:200px;"></Input>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
import dropdown from '../components/dropdown'
import TinymceEditor from '../../../public/richEncapsulation'
import uploadImage from '../components/uploadImage'

export default {
  components: {
    dropdown,
    TinymceEditor,
    uploadImage
  },
  data () {
    return {
      title: '新增团课详情',
      modal: false,
      modal1: false,
      courseId: '',
      day: '',
      formItem2: {
        name: '',
        start_time: '',
        end_time: '',
        num: ''
      },
      columns: [
        {
          title: '课时ID',
          key: 'id',
          align: 'center'
        },
        {
          title: '课时',
          key: 'name',
          align: 'center'
        },
        {
          title: '开始时间',
          key: 'start_time',
          align: 'center'
        },
        {
          title: '结束时间',
          key: 'end_time',
          align: 'center'
        },
        {
          title: '上课人数',
          key: 'num',
          align: 'center'
        },
        {
          title: '已经预约',
          key: 'valid_bookings_count',
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
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除?</p>`,
                      onOk: () => {
                        this.removeFn(params.row.id, params.index)
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
      data: [],
      manager_name: '',
      stores: {},
      formData: {
        type: 'league',
        name: '',
        pic: '',
        // manager_name: '', // 门店店长
        store_name: '', // 门店名称
        store_id: '', // 门店ID
        is_show: '1', // 是否展示，0：否，1：是
        detail: ''
      }
    }
  },
  methods: {
    getBack () {
      this.$router.back(-1)
    },
    removeFn (id) { // 删除课表
      let vm = this
      uAxios.delete(`courses/schedules/${id}`)
        .then(res => {
          if (res.data.code == 0) {
            vm.$Message.success('删除成功!')
            vm.getlist(1)
          }
        })
    },
    format (time, format) {
      let t = new Date(time)
      let tf = function (i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
            break
          case 'MM':
            return tf(t.getMonth() + 1)
            break
          case 'mm':
            return tf(t.getMinutes())
            break
          case 'dd':
            return tf(t.getDate())
            break
          case 'HH':
            return tf(t.getHours())
            break
          case 'ss':
            return tf(t.getSeconds())
            break
        }
      })
    },
    ok () {
      let self = this
      self.loading = true
      if (this.day[0] && this.day[1]) {
        this.formItem2.start_time = this.format(this.day[0], 'yyyy-MM-dd HH:ss')
        this.formItem2.end_time = this.format(this.day[1], 'yyyy-MM-dd HH:ss')
      }
      for (let item in self.formItem2) {
        if (!self.formItem2[item]) {
          return this.$Message.error('你有信息项未填写，请先填写!')
        }
      }
      console.log(this.formItem2)
      uAxios.post(`courses/${self.courseId}/schedules`, this.formItem2)
        .then(res => {
          let result = res.data.data
          console.log(result)
          this.getlist(1)
          this.$Message.success('新增成功!')
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
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`courses/${self.courseId}?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          console.log(result)
          self.data = result.schedules
          self.manager_name = result.store.manager_name
          self.formData = {
            type: 'league',
            name: result.name,
            pic: result.pic,
            store_name: result.store.name, // 门店名称
            store_id: result.store_id, // 门店ID
            is_show: result.is_show, // 是否展示，0：否，1：是
            detail: result.detail
          }
        })
    },
    handleSearch () {
      this.getlist(1)
    },
    getStores (page) {
      let self = this
      self.loading = true
      uAxios.get(`stores/${this.id}?nopage=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          this.manager_name = result.manager_name
          this.formData.store_name = result.name
          this.formData.store_id = result.id
          console.log(this.formData, 'dasdasd')
        })
    },
    uploadPicture (image) { // 单
      this.formData.pic = image //
    },
    saveFn () {
      let vm = this
      console.log(vm.formData)
      for (let item in vm.formData) {
        if (!vm.formData[item]) {
          return this.$Message.error('你有信息项未填写，请先填写!')
        }
      }
      if (vm.courseId) {
        uAxios.put(`courses/${vm.courseId}`, vm.formData)
          .then(res => {
            if (res.data.code == 0) {
              // this.courseId = res.data.data.id
              this.$Message.success('修改成功!')
              // setTimeout(() => {
              //   this.$router.go(-1) // 返回上一层
              // }, 800)
            }
          })
      } else {
        uAxios.post(`courses`, vm.formData)
          .then(res => {
            if (res.data.code == 0) {
              // this.courseId = res.data.data.id
              this.$Message.success('新增成功!')
              // setTimeout(() => {
              //   this.$router.go(-1) // 返回上一层
              // }, 800)
            }
          })
      }
    }
  },
  mounted () {
    if (this.$route.query.id) this.id = this.$route.query.id
    if (this.$route.query.courseId) {
      this.courseId = this.$route.query.courseId
      this.title = '编辑团课详情'
      this.getlist(1)
    } else {
      this.getStores(1)
    }
    //
    // console.log(this.$route.query)
  }
}
</script>

<style lang="less">
.skuBox {
  padding: 8px 22px;
  border: 1px solid #bbbaba;
  width: 120px;
  text-align: center;
  margin-top: 12px;
}

.float_l {
  float: left
}

.float_r {
  float: right
}

.inlineBlock {
  display: inline-block
}

.ivu-tree-title-selected, .ivu-tree-title-selected:hover {
  background-color: #d5e8fc;
  position: relative;
  padding-right: 22px;

  &:after {
    content: '';
    position: absolute;
    right: 4px;
    top: 5px;
    width: 12px;
    height: 18px;
    background-image: url("http://images.ufutx.com/201905/15/c09ba0a5ed976879bc389cc9cfd8c43a.png");
    background-size: contain;
    background-repeat: no-repeat;
  }

  /*box-shadow: 1px 1px 12px #d3d3d3;*/
}
</style>
