<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane :label="title" name="adminList">
        <Form :model="formData" :label-width="100">
          <Row :gutter="22">
            <Col span="12">
              <Card title="基础信息">
                <FormItem label="课程名称：" prop="account">
                  <Input v-model="formData.name" placeholder="请输入..." style="max-width:220px;"></Input>
                </FormItem>
                <FormItem label="课程分类：" prop="account">
                  <span v-if="category_name">
                    <Input v-model="category_name" placeholder="店长" style="max-width:220px;margin-right: 22px;"></Input>
                    <Button type="primary" @click="category_name = ''">重新选择</Button>
                  </span>
                  <span v-else>
                    <Select v-model="formData.category_id" style="width: 220px;margin-right: 22px;" filterable @on-query-change="getClassData" >
                      <Option v-for="item in classList" :value="item.id" :key="item.id" >{{ item.name }}</Option>
                    </Select>
                  </span>
                </FormItem>
                <FormItem label="状态：" prop="account">
                  <RadioGroup v-model="formData.is_show">
                    <Radio label="1">显示</Radio>
                    <Radio label="0">隐藏</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="网课图片：" prop="account">
                  <Card style="max-width: 420px;">
                    <uploadImage v-on:uploadPictures="uploadPicture" :pic="formData.pic"></uploadImage>
                  </Card>
                </FormItem>
                <span v-if="formData.video_id">
                  <FormItem label="课程视频：" prop="account">
                  <div class='videoStyle'>
                    <video-player class="video-player vjs-custom-skin"
                                  ref="videoPlayer"
                                  :playsinline="true"
                                  :options="playerOptions">
                    </video-player>
                  </div>
                </FormItem>
                </span>
                <span v-else>
                  <FormItem label="网课视频：" prop="account">
                    <Card style="max-width: 420px;">
                      <uploadImage v-on:uploadPictures="uploadVideo" :pic="formData.video_id"></uploadImage>
                    </Card>
                </FormItem>
                </span>
                <FormItem label="课程详请信息：" prop="account">
                  <tinymce-editor ref="editor"
                                  v-model="formData.detail"
                                  style="width: 400px;">
                  </tinymce-editor>
                </FormItem>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Button type="primary" style="margin-right: 22px; " @click="saveFn()">保存</Button>
    <Button @click="getBack" style="margin: 22px 0">返回</Button>
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
      title: '新增网课',
      classList: [],
      modal: false,
      category_name: '',
      id: '',
      modal1: false,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 类型
          src: '' // url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
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
      formData: {
        name: '',
        is_show: '1',
        type: 'online',
        category_id: '',
        video_id: '',
        detail: '',
        pic: ''
      }
    }
  },
  methods: {
    uploadPicture (image) { // 单
      this.formData.pic = image //
    },
    uploadVideo (image) { // 单
      this.formData.video_id = image //
      this.playerOptions.sources[0].src = image
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
    saveFn () {
      let vm = this
      console.log(vm.formData)
      for (let item in vm.formData) {
        if (!vm.formData[item]) {
          return this.$Message.error('你有信息项未填写，请先填写!')
        }
      }
      console.log(vm.formData)
      if (this.id) {
        uAxios.put(`courses/${this.id}`, vm.formData)
          .then(res => {
            if (res.data.code == 0) {
              this.$Message.success('修改成功!')
              setTimeout(() => {
                this.$router.go(-1) // 返回上一层
              }, 800)
            }
          })
      } else {
        uAxios.post(`courses`, vm.formData)
          .then(res => {
            if (res.data.code == 0) {
              this.$Message.success('创建成功!')
              setTimeout(() => {
                this.$router.go(-1) // 返回上一层
              }, 800)
            }
          })
      }
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
    getCoursesData (value) {
      let self = this
      self.loading = true
      // const msg = self.$Message.loading('正在加载中...', 0)
      uAxios.get(`courses/${self.id}?keyword=${value}&nopage=1`)
        .then(res => {
          self.loading = false
          let result = res.data.data
          console.log(result)
          self.formData = {
            name: result.name,
            is_show: result.is_show,
            type: result.type,
            category_id: result.category_id,
            video_id: result.video_id,
            detail: result.detail,
            pic: result.pic
          }
          self.category_name = result.category.name
          self.playerOptions.sources[0].src = result.video_id
        })
        .catch(error => {
          self.loading = false
        })
    },
    getClassData (value) {
      let self = this
      self.loading = true
      const msg = self.$Message.loading('正在加载中...', 0)
      uAxios.get(`courses/categories?keyword=${value}&nopage=1`)
        .then(res => {
          setTimeout(msg, 3000)
          self.loading = false
          let result = res.data.data.data
          this.classList = result.map((item) => {
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
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.title = '编辑网课详情'
      this.id = this.$route.query.id
      this.getCoursesData(1)
    }
    console.log(this.$route.query)
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
.videoStyle {
  //margin: 42px;
  width: 320px;
  height: auto;
  box-shadow: 1px 1px 12px #afaeae;
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
