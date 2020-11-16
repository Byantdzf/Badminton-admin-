<template>
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="预约详情" name="adminList">
        <Form>
          <Row :gutter="16">
            <Col span="12">
              <Card title="基本信息">
<!--                <FormItem label="头像：" prop="account">-->
<!--                  <img :src="information.name"-->
<!--                       alt="" width="80rpx" style="margin: 12px 22px 0 -6px;border: 2px solid #f3f3f3;">-->
<!--                </FormItem>-->
                <FormItem label="预约人" prop="account">
                  <span>{{ information.name }}</span>
                </FormItem>
                <FormItem label="电话" prop="account">
                  <span>{{ information.mobile }}</span>
                </FormItem>
                <FormItem label="预约时间" prop="account">
                  <span>{{ information.booking_time }}</span>
                </FormItem>
                <FormItem label="预约门店" prop="account">
                  <span>{{ information.store_name }}</span>
                </FormItem>
                <FormItem label="教练名称" prop="account">
                  <span>{{ information.coach_name }}</span>
                </FormItem>
                <FormItem label="预约课程" prop="account">
                  <span>{{ information.course_name }}</span>
                </FormItem>
                <FormItem label="上课状态" prop="account">
                  <span>{{ information.status }}</span>
<!--                  <span>已完成</span>-->
<!--                  <span>已取消</span>-->
<!--                  <span>未开课</span>-->
                </FormItem>
              </Card>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
    <Button @click="getBack" style="margin: 22px 0">返回</Button>
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
      id: '',
      information: {}
    }
  },
  methods: {

    getBack () {
      this.$router.back(-1)
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`course/bookings/${this.id}`)
        .then(res => {
          let result = res.data
          if (result.data) {
            self.information = result.data
            self.orgTotal = result.total
            console.log(this.information)
          }
          self.loading = false
        })
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getlist(1)
    }
    console.log(this.$route.query)
  }
}
</script>

<style lang="less">
._bold {
  font-weight: bold;
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
