<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :label-width="80">
      <FormItem label="启用状态" prop="state">
        <RadioGroup v-model="formValidate.state">
          <Radio label="start">启用</Radio>
          <Radio label="stop">禁用</Radio>
        </RadioGroup>
        <span style="margin-left: 12px;">*禁用后则创建账号时无法选择该角色，且属于该角色的账号夜会被禁用</span>
      </FormItem>
      <FormItem label="角色名称" prop="account">
        <Input v-model="formValidate.account" placeholder="请输入" style="width: 320px;"></Input>
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 320px;"
               placeholder="请输入备注..."></Input>
      </FormItem>
      <FormItem>
        <span>权限配置（设置允许该后台用户访问的功能模块，无权访问的页面将对其不可见）</span>
      </FormItem>
      <FormItem>
        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">访问页面管理</Checkbox>
        </div>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <Checkbox label="系统管理"></Checkbox>
          <Checkbox label="用户管理"></Checkbox>
          <Checkbox label="门店管理"></Checkbox>
          <Checkbox label="预约管理"></Checkbox>
          <Checkbox label="订单管理"></Checkbox>
          <Checkbox label="评价管理"></Checkbox>
          <Checkbox label="财务管理"></Checkbox>
          <Checkbox label="网课管理"></Checkbox>
          <Checkbox label="运动轨迹管理"></Checkbox>
        </CheckboxGroup>
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
      },
      indeterminate: true,
      checkAll: false,
      checkAllGroup: ['香蕉', '西瓜']
    }
  },
  methods: {
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
      uAxios.get(`roles/${self.id}`)
        .then(res => {
          console.log(res.data)
          this.formValidate.account = res.data.data.name
          this.formValidate.desc = res.data.data.description
          self.loading = false
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getlist(1)
      // this.title = '编辑门店详情'
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
