<template>
  <!--<div class="tinymce-editor">-->
    <editor v-model="myValue"
            id="tinymce"
            :init="init"
            :disabled="disabled"
            @onClick="onClick">
    </editor>
  <!--</div>-->
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import uAxios from '../src/api'
import axios from 'axios'
import md5 from 'js-md5'
import 'tinymce/themes/silver'
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/link'// 插入超链接插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table wordcount link'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | bold italic forecolor backcolor link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat '
    }
  },
  data () {
    return {
      ossConfig: '',
      host: '',
      file: null,
      init: {
        selector: 'tinymce',
        language_url: './tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: './tinymce/skins/ui/oxide',
        content_css: './tinymce/skins/content/default/content.css',
        // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
        height: 400,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: true,
        file_picker_types: 'media image',
        file_picker_callback: (callback, value, meta) => {
          // if(meta.filetype == 'image media'){
          let input = document.createElement('input')// 创建一个隐藏的input
          input.setAttribute('type', 'file')
          let that = this
          input.onchange = function () {
            let file = this.files[0]// 选取第一个文件
            // that.uploadImg(that.qiniuToken, file, 'video'); // 上传视频拿到url
            that.file = file
            that.upload().then((val) => {
              callback(val, { title: file.name }) // 将url显示在弹框输入框中
            }).catch((err) => {
              console.log('上传失败')
            })
            // if(that.uploaded){
            //   callback(that.resVideo, { title: file.name }) //将url显示在弹框输入框中
            // }else{
            //   setTimeout(()=>{
            //     callback(that.resVideo, { title: file.name })
            //   },2000)
            // }
          }
          // 触发点击
          input.click()
          // }
        },
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          console.log(blobInfo.blob(), 'asdad111111')
          console.log(blobInfo, success, failure, 'dasdasda')
          this.file = blobInfo.blob()
          this.upload().then((val) => {
            success(val)
          }).catch((err) => {
            console.log(err)
          })
          // const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        }
      },
      myValue: this.value
    }
  },
  mounted () {
    this.getSignature()
    setTimeout(() => {
      this.Initialize()
    }, 1000)
  },
  methods: {
    getSignature () {
      const self = this
      uAxios.get('upload/signature').then(res => {
        let result = res.data.data
        self.ossConfig = result
        self.host = result.host
      })
    },
    upload () {
      let self = this
      let p = new Promise((resolve, reject) => {
        self.loadingStatus = true
        var formData = new FormData()
        var fileName = md5(self.file.name) + '.' + self.file.type.split('/').pop().toLowerCase()
        var filePath = self.host + '/' + self.ossConfig.dir + fileName
        formData.append('name', self.ossConfig.dir + fileName)
        formData.append('key', self.ossConfig.dir + fileName)
        formData.append('policy', self.ossConfig.policy)
        formData.append('OSSAccessKeyId', self.ossConfig.accessid)
        formData.append('success_action_status', '200')
        formData.append('signature', self.ossConfig.signature)
        formData.append('file', self.file)
        formData.append('filename', self.file.name)
        axios.post(self.ossConfig.host, formData, {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(function (response) {
          if (response.status === 200) {
            console.log(filePath)
            resolve(filePath)
            self.$Notice.success({
              title: '文件上传成功',
              desc: `${filePath}上传成功!`
            })
          } else {
            reject('上传失败')
          }
        })
      })
      return p
    },
    Initialize () {
      tinymce.init({})
      // console.log('ttythto')
      // console.log(tinymce.init, 'ttythto')
    },
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick (e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear () {
      this.myValue = ''
    }
  },
  watch: {
    value (newValue) {
      this.myValue = newValue
      console.log(this.myValue, '78')
    },
    myValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
