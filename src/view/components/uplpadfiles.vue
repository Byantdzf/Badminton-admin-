<template>
  <div>
    <Upload
      style="width: 300px;"
      multiple
      type="drag"
      :before-upload="handleBeforeUpload"
      :action="host">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="40" style="color: #3399ff"></Icon>
        <p>点击或将文件拖拽到这里上传</p>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import uAxios from '../../api'
import md5 from 'js-md5'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
import {getToken, setToken} from '@/libs/util';

export default {
  name: 'uplpadfile',
  data () {
    return {
      imgName: '',
      file: null,
      ossConfig: '',
      host: '',
      modal1: false,
      loadingStatus: false,
      visible: false,
      filePath: ''
    }
  },
  methods: {
    tirggerFile (file) {
      let self = this
      console.log(file)
      let formData = new FormData()
      formData.append('uploadFile', file)
      console.log(formData)
      axios.post(`${baseUrl}admin/import/single/profiles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + getToken()
        }
      }).then(function (response) {
        if (response.data.code === 0) {
          self.$Notice.success({
            title: '文件上传成功',
            desc: `上传成功!`
          })
          self.$emit('childByValue', file)
          self.file = null
        } else {
          self.$Modal.error({
            content: response.statusText
          })
        }
      })
    },
    handleBeforeUpload (file) {
      this.$Notice.info({
        title: '温馨提示',
        duration: 2,
        desc: `${file.name}开始上传`
      })
      this.tirggerFile(file)
      return false
    },
    getSignature () {
      const self = this
      uAxios.get('upload/signature?type=file').then(res => {
        console.log(res)
        let result = res.data.data
        self.ossConfig = result
        self.host = result.host
      })
    }
    // upload () {
    //   var self = this
    //   self.loadingStatus = true
    //   var formData = new FormData()
    //   var fileName = md5(self.file.name) + '.' + self.file.type.split('/').pop().toLowerCase()
    //   var filePath = self.host + '/' + self.ossConfig.dir + fileName
    //   formData.append('name', self.ossConfig.dir + fileName)
    //   formData.append('key', self.ossConfig.dir + fileName)
    //   formData.append('policy', self.ossConfig.policy)
    //   formData.append('OSSAccessKeyId', self.ossConfig.accessid)
    //   formData.append('success_action_status', '200')
    //   formData.append('signature', self.ossConfig.signature)
    //   formData.append('file', self.file)
    //   formData.append('filename', self.file.name)
    //   console.log(formData)
    //   // axios.post(self.ossConfig.host, formData, {headers: {'Content-Type': 'multipart/form-data'}}
    //   // ).then(function (response) {
    //   //   if (response.status === 200) {
    //   //     self.filePath = filePath
    //   //     self.$emit('uploadPictures', self.filePath)
    //   //     self.$emit('childByValue', self.filePath)
    //   //     self.$Notice.success({
    //   //       title: '文件上传成功',
    //   //       desc: `${filePath}上传成功!`
    //   //     })
    //   //     self.file = null
    //   //   } else {
    //   //     self.$Modal.error({
    //   //       content: response.statusText
    //   //     })
    //   //   }
    //   // })
    //   uAxios.post('admin/import/single/profiles', formData).then((response) => {
    //     console.log(response, '123')
    //     if (response.data.code === 0) {
    //       this.$Message.info('添加成功')
    //     } else {
    //       this.$Modal.error({
    //         content: response.data.message
    //       })
    //     }
    //   })
    //   uAxios.post('admin/import/single/profiles').then((response) => {
    //     console.log(response, '123')
    //     if (response.data.code === 0) {
    //       this.$Message.info('添加成功')
    //     } else {
    //       this.$Modal.error({
    //         content: response.data.message
    //       })
    //     }
    //   })
    //   self.loadingStatus = false
    // }
  },
  mounted () {
    this.getSignature()
  }
}
</script>

<style scoped>

</style>
