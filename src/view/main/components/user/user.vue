<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="resetPassword">
          <Icon :size="14" type="md-lock" style="margin-bottom: 2px;"></Icon>
          修改密码
        </DropdownItem>
        <DropdownItem name="logout">
          <Icon type="ios-log-out"/>
          安全登出
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="logoutm" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>温馨提示</span>
      </p>
      <div style="text-align:center">
        <p>确定要退出系统吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="loading" @click="logout">确定退出</Button>
      </div>
    </Modal>
    <Modal v-model="modal" width="360" ok-text="OK"
           @on-ok="changePassword"
           no-cancel>
      <p slot="header" style="text-align: center">
        <Icon type="md-heart-outline"></Icon>
        <span style="margin-left: 5px">福恋智能后台管理系统</span>
      </p>
      <div class="form-con">
        <login-code @on-changePassword="changePassword"></login-code>
      </div>
      <div slot="footer">
        <p class="login-tip" style="text-align: center;color: red">【福恋智能】 -- 后台</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import {mapActions} from 'vuex'
import LoginForm from '../../../../components/login-form/login-form'
import LoginCode from '../../../../components/login-form/login-code'
import config from '@/libs/api.request'
import uAxios from '../../../../api/index'

export default {
  name: 'User',
  components: {
    LoginForm,
    LoginCode
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      logoutm: false,
      loading: false,
      modal: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.logoutm = true
          break
        default :
          // this.$router.push({
          //   name: 'reset'
          // })
          this.modal = true
          break
      }
    },
    changePassword (newPassword) {
      let vm = this,
        {password, confirm_password} = newPassword
      uAxios.post(`admin/reset/password?password=${password}&confirm_password=${confirm_password}`)
        .then((response) => {
          if (response.data.code === 0) {
            vm.$Message.success('已修改密码！')
            vm.changeCode = false
            vm.modal = false
            this.logout()
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
    },
    logout () {
      this.loading = true
      this.handleLogOut().then(() => {
        setTimeout(() => {
          this.logoutm = false
          this.loading = false
          this.$router.push({
            name: 'login'
          })
        }, 1500)
      }).catch(() => {
        setTimeout(() => {
          this.logoutm = false
          this.loading = false
          this.$router.push({
            name: 'login'
          })
        }, 1500)
      })
    }
  }
}
</script>
