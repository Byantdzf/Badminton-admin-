<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :label-width="80">
      <FormItem label="启用状态：" prop="state">
        <span>未处理</span>
      </FormItem>
      <FormItem label="用户ID：" >
        <span>121212</span>
      </FormItem>
      <FormItem label="用户昵称：" >
        <span>小林</span>
      </FormItem>
      <FormItem label="反馈时间：" >
        <span>2020-09-12 12:12</span>
      </FormItem>
      <FormItem label="反馈内容：">
        <span>交友很好！！！</span>
        <div style="">
          <img :src="item" alt="" width="80rpx" style="margin: 12px 22px 0 -6px;border: 2px solid #f3f3f3;"
               @click="showModal(index)" v-for="(item,index) in Photos"/>
        </div>
      </FormItem>
      <FormItem label="处理人：" >
        <span>莫夏普</span>
      </FormItem>
      <FormItem label="处理时间：" >
        <span>2020-09-12 12:12</span>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">标记为已处理</Button>
        <Button @click="getBack" style="margin-left: 8px">返回</Button>
      </FormItem>
    </Form>
    <Modal
      v-model="modal"
      title="图片预览"
    >
      <div style="text-align: center">
        <img :src="previewPic" style="width: 400px;"/>
      </div>
    </Modal>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
// import config from '../../api/config'
import dropdown from '../components/dropdown'
// import Cookies from 'js-cookie'

export default {
  name: 'authorization',
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      formValidate: {
        state: 'start', // 状态
        name: '',
        mail: '',
        role: '',
        mobile: '',
        account: '', // 账号
        password: '', // 密码
        confirmPassword: '', // 确认密码
        desc: ''
      },
      previewPic: '', // 预览照片
      modal: false,
      Photos: ['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3482753663,1816494568&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1577133426,2347321117&fm=26&gp=0.jpg'
      ],
      indeterminate: true,
      checkAll: false,
      checkAllGroup: ['香蕉', '西瓜']
    }
  },
  methods: {
    showModal (index) {
      this.modal = true
      this.previewPic = this.Photos[index]
      // this.message.type_v = 'image'
      // this.message.image = item ? item : 'http://images.ufutx.com/201905/13/599151d27fc07ba1bc4cc57a291525e5.jpeg'
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = ['香蕉', '苹果', '西瓜'];
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange (data) {
      if (data.length === 3) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
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
              let {user} = item
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
    this.getlist(1)
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
