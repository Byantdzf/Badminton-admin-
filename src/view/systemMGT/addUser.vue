<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :label-width="80">
      <FormItem label="启用状态" prop="state">
        <RadioGroup v-model="formValidate.state">
          <Radio label="start">启用</Radio>
          <Radio label="stop">禁用</Radio>
        </RadioGroup>
        <span style="margin-left: 12px;">*不启用则无法使用该账号登录</span>
      </FormItem>
      <FormItem label="账号" prop="account">
        <Input v-model="formValidate.account" placeholder="请输入" style="width: 320px;"></Input>
        <span style="margin-left: 12px;">*支持字母、下划线、数字，初次设置后不可修改</span>
      </FormItem>
      <FormItem label="登陆密码" prop="password">
        <Input v-model="formValidate.password" placeholder="请输入" style="width: 320px;"></Input>
        <span style="margin-left: 12px;">*8-20位，支持字母、下划线、数字</span>
      </FormItem>
      <FormItem label="确认密码" prop="confirmPassword">
        <Input v-model="formValidate.confirmPassword" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="角色选择" prop="role" style="width: 200px;">
        <Select v-model="formValidate.role" placeholder="请选择角色">
          <Option value="beijing">财务</Option>
          <Option value="shanghai">订单</Option>
          <Option value="shenzhen">管理</Option>
          <Option value="shenzhen">商务</Option>
          <Option value="shenzhen">运营</Option>
        </Select>
      </FormItem>
      <FormItem label="名字" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="手机" prop="mobile">
        <Input v-model="formValidate.mobile" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="E-mail" prop="mail">
        <Input v-model="formValidate.mail" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 320px;"
               placeholder="请输入备注..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button @click="getBack" style="margin-left: 8px">返回</Button>
      </FormItem>
    </Form>
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
      }
    }
  },
  methods: {
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
