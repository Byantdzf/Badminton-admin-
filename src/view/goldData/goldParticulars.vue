<template>
  <div>
    <div id="name">
      <div v-model="activeTab">
        <Tabs @on-click="getTab">
          <TabPane label="匹配列表" name="association">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
              <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
            </span>
            <Card>
              <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
        </Tabs>
      </div>
      <Modal
        v-model="modal1"
        title='温馨提示'
        ok-text="确定"
        @on-ok="deleteProfile"
        no-cancel>
        <p>是否删除该推荐？</p>
      </Modal>
    </div>
  </div>
</template>

<script>
import uAxios from '../../api/index'

export default {
  components: {},
  data () {
    return {
      filePath: null,
      id: '',
      searchKeyword: '',
      loading: false,
      modal1: false,
      modal: false,
      title: '',
      count: [],
      profiles_id: '',
      intro: '',
      logo: '',
      switchLoading: false,
      activeTab: 'association',
      chart: {},
      Columns1: [
        {
          title: 'ID',
          align: 'center',
          key: 'id'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '年龄',
          align: 'center',
          key: 'age'
        },
        {
          title: '性别',
          align: 'center',
          key: 'sex'
        },
        {
          title: '身高',
          align: 'center',
          key: 'stature'
        },
        {
          title: '学历',
          align: 'center',
          key: 'degree'
        },
        {
          title: '婚姻状态',
          align: 'center',
          key: 'state'
        },
        {
          title: '工作地址',
          align: 'center',
          key: 'address'
        },
        {
          title: '故乡地址',
          align: 'center',
          key: 'resident_address'
        },
        {
          title: '操作',
          key: 'title',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    console.log(params)
                    this.deleteIndex = params.index
                    this.modal1 = true
                    this.profiles_id = params.row.id
                  }
                }
              }, '删除匹配')
            ])
          }
        }
      ],
      orgTotal: 0,
      deleteIndex: 0,
      entering: '',
      currentPage: 1,
      information: [],
      profile: [],
      age: '',
      sex: '',
      Index: 1,
      min_age: 3,
      max_age: 5,
      other_profiles: {}
    }
  },
  methods: {
    getlist (page) {
      let self = this
      uAxios.get(`admin/matching/single/profiles/` + this.id + `?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          console.log(result)
          let profiles = result.other_profiles.data
          self.information = result.other_profiles.data.map((item) => {
            return {
              id: item.other_single_profile.id,
              address: item.other_single_profile.address,
              name: item.other_single_profile.name,
              age: item.other_single_profile.age,
              resident_address: item.other_single_profile.resident_address,
              mobile: item.other_single_profile.mobile,
              sex: item.other_single_profile.sex,
              stature: item.other_single_profile.stature,
              state: item.other_single_profile.state,
              degree: item.other_single_profile.degree,
            }
          })
          self.other_profiles = profiles
          self.profile = result.profile
          self.loading = false
          self.orgTotal = result.other_profiles.total
        })
    },
    deleteProfile () {
      let self = this
      let id = self.other_profiles[self.deleteIndex].id
      uAxios.delete('admin/matching/single/profiles/' + id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('删除成功')
          this.information.splice(this.Index, 1)
          this.getlist(this.currentPage)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      this.getlist(num)
    },
    handleSearch () {
      this.getlist(1)
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getlist(1)
  }
}
</script>

<style scoped>
  .choice{
    display: inline-block;
    margin-right: 10px;
  }
</style>
