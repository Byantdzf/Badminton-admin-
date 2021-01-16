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
                  <Input v-model="formData.manager_name" placeholder="店长" disabled style="max-width:220px;margin-right: 22px;"></Input>
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
          <DatePicker type="datetimerange" placeholder="选择查询日期" style="width:200px;"></DatePicker>
        </FormItem>
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
      formItem2: {
        name: '',
        day: '',
        time: '',
        num: ''
      },
      columns: [
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
          title: '上课人数',
          key: 'num',
          align: 'center'
        }
      ],
      data: [
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
      stores: {},
      formData: {
        type: 'league',
        name: '',
        pic: '',
        manager_name: '', // 门店店长
        store_name: '', // 门店名称
        store_id: '', // 门店ID
        is_show: '1', // 是否展示，0：否，1：是
        detail: '其实加个接口不贵，然而思路上有问题。现在国内这些都是高端一款低端一款，加一个输出口的话，高端那个就尴尬了。还有就是这个麦克风阵列他们是测好的，你接到自己的喇叭上，怎么摆他们就管不了了，到时候你喊它未必答应，他们不希望你归罪于产品。亚马逊的dot是带输出的，但是还需要复杂的上网流程，很烦。还有一点，现在这些国内的智能音响基本属于赔钱卖，如果真的就值这个价，漫步者的千元系列应该自己就把这功能加进去了。所以还需要等一段日子。'
      }
    }
  },
  methods: {
    getBack () {
      this.$router.back(-1)
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
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`admin/admins?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data.map((item) => {
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
    },
    getStores (page) {
      let self = this
      self.loading = true
      uAxios.get(`stores/${this.id}?nopage=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          this.formData.manager_name = result.manager_name
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
      uAxios.post(`courses`, vm.formData)
        .then(res => {
          if (res.data.code == 0) {
            this.courseId = res.data.data.id
            this.$Message.success('修改成功!')
            // setTimeout(() => {
            //   this.$router.go(-1) // 返回上一层
            // }, 800)
          }
        })
    }
  },
  mounted () {
    if (this.$route.query.id) this.id = this.$route.query.id
    if (this.$route.query.courseId) {
      this.courseId = this.$route.query.courseId
      this.title = '编辑团课详情'
    }
    // this.getlist(1)
    this.getStores(1)
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
