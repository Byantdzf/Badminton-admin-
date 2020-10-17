<template>
  <div class="hello">
    <Card style="margin-top: 18px;">
      <p slot="title" style="color: #ff6c4c;">管理员操作</p>
      <div style="display: inline-block;margin-left: 22px;width: 100%;">
        <Col span="11">
          <informPic v-on:uploadPictures="uploadInformPic"></informPic>
          <div v-if="photo.length" v-for="item,index in photo">
            <Input  type="text" placeholder="Enter message..." :value="item"  style="max-width: 80%;margin-top: 12px;">
              <span slot="prepend">第 {{index+1}} 张</span>
              <Icon type="md-copy" slot="append" @click="copyUrl(item)"/>
            </Input>
          </div>
        </Col>
      </div>

    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api'
  import uploadImage from '../components/uploadImages'
  import dropdown from '../components/dropdown'

  export default {
    name: 'Org',
    components: {
      dropdown: dropdown,
      uploadImage: uploadImage,
      informPic: uploadImage
    },
    data () {
      return {
        photo: []
      }
    },
    methods: {
      copyUrl (item) {
        console.log(item)
        const input = document.createElement('input')
        document.body.appendChild(input)
        input.setAttribute('value', item)
        input.select()
        document.execCommand(`copy`); // 执行浏览器复制命令
        this.$Message.success('复制成功')
      },
      uploadInformPic (image) {
        this.photo = image
        console.log(this.photo)
      },
    },
    mounted () {
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }
  .bc_item{
    margin-top: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
    position: relative;
  }
  .move_box{
    position: absolute;
    top: 0;
    right: 12px;
    .moveUp,.moveDown{
      margin-top: 4px;
      padding: 2px 8px;
    }
    .moveUp{
      border-top: 2px solid #33c627;
      color: #33c627;
      /*border-bottom-left-radius: 12px;*/
    }
    .moveDown{
      border-bottom: 2px solid #ec5a39;
      color: #ec5a39;
      margin-top: 12px;
    }
  }

</style>
