<template>
  <!--  打卡视频详情-->
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="打卡视频详情" name="adminList">
        <Form>
          <Row :gutter="22">
            <Col span="14">
              <Card title="视频信息" style="overflow: hidden;">
                <Col span="3">
                  <div
                    style="background-image: url('https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg')"
                    class="photo"></div>
                </Col>
                <Col span="14">
                  <p style="margin-top: 12px;">{{ video.updated_at }}</p>
                  <p style="margin-top: 12px;">{{video.name}}</p>
                  <p style="margin-top: 12px;">发布时间： {{video.updated_at}}</p>
                </Col>
                <Col span="14" offset="1">
                  <div class='videoStyle'>
                    <video-player class="video-player vjs-custom-skin"
                                  ref="videoPlayer"
                                  :playsinline="true"
                                  :options="playerOptions">
                    </video-player>
                  </div>
                </Col>
              </Card>
              <Card title="评价信息" style="margin-top: 24px;overflow: hidden;">
                <span v-if="comments.length < 1">暂无评价信息</span>
                <div v-for="(item,i) in comments">
                  <Col span="3">
                    <!--                  <div-->
                    <!--                    :style="{backgroundImage: 'url('+ item.commentable.user.name +')'}"-->
                    <!--                    class="photo"></div>-->
                  </Col>
                  <Col span="20">
                    <p style="margin-top: 12px;">mamba
                      <Rate allow-half v-model="item.rate" style="float: right"/>
                    </p>
                    <p style="margin-top: 12px;">发布时间： {{item.created_at}}</p>

                  </Col>
                  <Col span="20">
                    <p style="margin-top: 12px;">{{item.comment}}</p>
                  </Col>
                </div>
              </Card>
              <Col span="22">
                <Button type="error" @click="deleteFn()">删除</Button>
                <Button @click="getBack" style="margin: 22px">返回</Button>
              </Col>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>

  </Card>
</template>

<script>
import uAxios from '../../api/index'
// import config from '../../api/config'
import dropdown from '../components/dropdown'
// import Cookies from 'js-cookie'

export default {
  components: {
    dropdown: dropdown
  },
  data () {
    return {
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
          src: 'https://image.ufutx.com/video/1471212834390.mp4' // url地址
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
      formValidate: {},
      valueHalf: 3, // 评分
      indeterminate: true,
      checkAll: false,
      video: {},
      comments: {},
      columns: [
        {
          title: '课程名称',
          key: 'name',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', 'XXX')
            ])
          }
        },
        {
          // width: 150,
          title: '课程规格',
          align: 'center',
          key: 'specification'
        },
        {
          // width: 150,
          title: '数量',
          align: 'center',
          key: 'num'
        },
        {
          // width: 150,
          title: '单价',
          align: 'center',
          key: 'totalPrice'
        },
        {
          title: '合计',
          align: 'center',
          // width: 150,
          key: 'totalPrice'
        }
      ],
      data: [
        {
          name: 'John Brown',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        },
        {
          name: 'Jim Green',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        },
        {
          name: 'Joe Black',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '续费',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        },
        {
          name: 'Jon Snow',
          age: '拉杆教学',
          specification: '10次卡',
          num: '9',
          price: '22.00',
          pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg',
          address: '首次购买',
          time: '2020-08-12 12:56',
          totalPrice: '￥190.00'
        }
      ]
    }
  },
  methods: {
    deleteFn (index) {
      let vm = this
      vm.$Modal.confirm({
        title: '温馨提示',
        content: `<p>你删除该视频吗？</p>`,
        onOk: () => {
          uAxios.delete(`video/logs/${vm.id}`)
            .then(res => {
              vm.$Message.info('删除成功')
              vm.$router.back(-1)
            })
        },
        onCancel: () => {
          console.log('点击了取消')
        }
      })
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
      uAxios.get(`video/logs/${self.id}?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data
          if (result.data) {
            self.comments = result.data.comments.data
            for (let item of self.comments) {
              item.rate = Math.round(item.rate)
            }
            self.video = result.data.video
            self.orgTotal = result.data.comments.total
            self.playerOptions.sources[0].src = self.video.play_url
            console.log(self.comments, self.video)
          }
          self.loading = false
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    let id = this.$route.query.id
    if (id) {
      this.id = id
      this.getlist(1)
    }
    console.log(this.$route.query)
  }
}
</script>

<style lang="less">
.videoStyle {
  margin: 28px;
  box-shadow: 1px 1px 12px #afaeae;
}

.photo {
  width: 50px;
  height: 50px;
  background-repeat: no-repeat;
  background-size: cover;
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  display: inline-block;
  float: left;
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
