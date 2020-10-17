<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='communitie_name' name="detail">
        <Row>
          <Col span="11">
            <Card>
              <div style="width: 100%;color: red;text-align: center;font-size: 26px">动态内容</div>
              <div style="text-align: center">
                <i-input type="textarea" :rows="5" readonly placeholder="没有内容......" v-model="content" style="width: 500px;"></i-input>
              </div>
              <div style="width: 100%;color: red;text-align: center;font-size: 26px;margin-top: 20px">动态图片</div>
              <div class="picture" v-for="(item,index) in arrPhoto" :key="index">
                <div :style="'background-image: url('+item+')'" class="main-image"></div>
              </div>
              <div style="text-align: center;margin-top: 20px">
                <Button type="error" @click="show()">删除动态</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modal"
      title='温馨提示'
      ok-text="确定"
      @on-ok="deletedynamic"
      no-cancel>
      <p>是否删除该条动态？</p>
    </Modal>
  </div>
</template>

<script>
import uAxios from '../../api'
// import uploadImages from '../components/uploadImages'

export default {
  data () {
    return {
      searchKeyword: '',
      communitie_name: '动态详情',
      loading: false,
      content: '',
      modal: false,
      arrPhoto: [],
      BtnText: '保存修改',
      id: ''
    }
  },
  methods: {
    handleSearch () {
      this.getlist(1)
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
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
    show () {
      this.modal = true
    },
    getlist (page) {
      let self = this
      uAxios.get('admin/community/moments/' + self.id)
        .then(res => {
          let result = res.data.data
          self.content = result.content
          self.arrPhoto = result.photos
          console.log(self.arrPhoto, '999999')
        })
    },
    deletedynamic () {
      let self = this
      uAxios.delete('admin/community/moments/' + self.id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          setTimeout(() => {
            this.$router.push({
              name: 'community'
            })
          }, 800)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
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
  .picture{
    width: 150px;
    height: 150px;
    display: inline-block;
    margin-left: 20px;
  }
  .main-image{
    width: 100%;
    height: 100%;
    margin-left: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
