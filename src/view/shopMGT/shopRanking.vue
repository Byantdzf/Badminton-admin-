<template>
<!--  门店排名-->
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="门店排名" name="adminList">
        <Table :loading="loading" ref="selection"  :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
<!--        <div style="margin-top:16px;">-->
<!--          <Checkbox v-model="CheckboxValue" @click="handleSelectAll(true)" style="margin-right: 22px;">全选</Checkbox>-->
<!--          <Select v-model="SelectValue" style="width:100px;margin-right: 16px;">-->
<!--            <Option value="启用" label="启用"></Option>-->
<!--            <Option value="禁用" label="禁用"></Option>-->
<!--          </Select>-->
<!--          <Button @click="batchFn()" >确定</Button>-->
<!--        </div>-->
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
              style="margin-top:30px;margin-bottom:30px;"  show-elevator></Page>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
import config from '../../api/config'
import dropdown from '../components/dropdown'
import Cookies from 'js-cookie'

export default {
  name: 'authorization',
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      beginDate: '', // 反馈时间
      CheckboxValue: false,
      SelectValue: '全部',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        {
          title: '排名',
          key: 'id',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: '门店名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '店长',
          key: 'created_at',
          align: 'center',
          render: (h, params) => {
            if (params.row.user) {
              return h('span', {
              }, params.row.user.name)
            } else {
              return h('span', '未获取')
            }
          }
        },
        {
          title: '营业额',
          key: 'turnover',
          align: 'center',
          editable: true
        },
        {
          title: '总课时',
          key: 'courses_count',
          align: 'center',
          editable: true
        }
      ],
      information: [],
      loading: false
    }
  },
  methods: {
    reset () {
      this.$Message.info('This is a 重置')
    },
    gotoPage (title) {
      this.$router.push({
        name: title,
        query: { id: '12' }
      })
    },
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
      uAxios.get(`stores/ranking?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data
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
