<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :label-width="80">
<!--      <FormItem label="启用状态" prop="state">-->
<!--        <RadioGroup v-model="formValidate.state">-->
<!--          <Radio label="start">启用</Radio>-->
<!--          <Radio label="stop">禁用</Radio>-->
<!--        </RadioGroup>-->
<!--        <span style="margin-left: 12px;">*不启用则无法使用该账号登录</span>-->
<!--      </FormItem>-->
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
      <FormItem label="角色选择" prop="role_id" style="width: 200px;">
        <Select v-model="formValidate.role_id" placeholder="请选择角色">
          <Option :value="item.id" v-for="item of roleList">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="名字" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="手机" prop="mobile">
        <Input v-model="formValidate.mobile" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="E-mail" prop="email">
        <Input v-model="formValidate.email" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 320px;"
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
        email: '',
        role_id: '',
        mobile: '',
        account: '', // 账号
        password: '', // 密码
        confirmPassword: '', // 确认密码
        remark: ''
      },
      id: '',
      roleList: [] // 角色列表
    }
  },
  methods: {
    handleSubmit (name) {
      let vm = this
      console.log(vm.formValidate)
      for (let item in vm.formValidate) {
        if (!vm.formValidate[item]) {
          return this.$Message.error('你有信息项未填写，请先填写!')
        }
      }
      if (vm.formValidate.confirmPassword !== vm.formValidate.password) return this.$Message.error('2次密码不一致!')
      if (!this.id) {
        uAxios.post(`admins`, vm.formValidate)
          .then(res => {
            console.log(res)
            if (res.data.code == 0) {
              this.$Message.success('创建成功!')
              this.$router.go(-1) // 返回上一层
            }
          })
        console.log(this.formValidate)
      } else {
        uAxios.put(`admins/${this.id}`, vm.formValidate)
          .then(res => {
            console.log(res)
            if (res.data.code == 0) {
              this.$Message.success('修改成功!')
              this.$router.go(-1) // 返回上一层
            }
          })
        console.log(this.formValidate)
      }
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
      uAxios.get(`admins/${self.id}?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          console.log(result)
          this.formValidate = {
            name: result.name,
            email: result.email,
            role_id: result.role_id,
            mobile: result.mobile,
            account: result.account, // 账号
            // password: result.role_id, // 密码
            // confirmPassword: result.role_id, // 确认密码
            remark: result.remark
          }
          // self.roleList = result.data
          // self.loading = false
          // console.log(self.roleList)
        })
    },
    getlistV2 (page) {
      let self = this
      self.loading = true
      uAxios.get(`roles/${self.id}?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          self.roleList = result.data
          self.loading = false
          console.log(self.roleList)
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    this.getlistV2()
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
