<template>
  <div>
    <div>
      <uplpadfiles v-on:childByValue="childByValue"></uplpadfiles>
    </div>
    <div id="name">
      <div v-model="activeTab">
        <Card>
          <Tabs @on-click="getTab">
            <TabPane label="所有用户" name="data_matching">
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."                style="width: 200px; margin-bottom: 22px;"/>
              <span @click="handleSearch">
                <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
              </span>
              <Card>
                <p slot="title" style="color: #ff6c4c ">用户列表<span style="margin-left: 50px">今日录入人数: {{entering}}</span></p>
                <Table height="700" :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
                <div style="clear: both"></div>
              </Card>
            </TabPane>
            <TabPane label="AG用户" name="Gold_data">
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."
                style="width: 200px; margin-bottom: 22px;"/>
              <span @click="handleSearch">
                <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
              </span>
              <Card>
                <p slot="title" style="color: #ff6c4c ">用户列表<span style="margin-left: 50px">录入人数: {{entering}}</span></p>
                <Table height="700" :loading="loading" :columns="Columns1" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
                <div style="clear: both"></div>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </div>
      <!--<Modal-->
        <!--v-model="modal1"-->
        <!--title='温馨提示'-->
        <!--ok-text="确定"-->
        <!--@on-ok="deleteUser"-->
        <!--no-cancel>-->
        <!--<p>是否删除该社群？</p>-->
      <!--</Modal>-->
    </div>
  </div>
</template>

<script>
import uplpadfiles from '../components/uplpadfiles'
import uAxios from '../../api/index'

export default {
  name: 'goldData',
  components: {uplpadfiles},
  data () {
    return {
      filePath: null,
      id: '',
      searchKeyword: '',
      loading: false,
      modal1: false,
      modal: false,
      title: '',
      intro: '',
      logo: '',
      switchLoading: false,
      activeTab: 'data_matching',
      chart: {},
      Columns: [
        {
          title: '用户ID',
          align: 'center',
          key: 'user_id',
          fixed: 'left',
          width: 80
        },
        {
          title: '头像',
          width: 100,
          fixed: 'left',
          key: 'photo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.photo
              },
              style: {
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                  console.log(params.row)
                  let argu = {id: params.row.user_id}
                  this.$router.push({
                    name: 'user_detail',
                    params: argu
                  })
                }
              }
            })
          },
          align: 'center'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name',
          fixed: 'left',
          width: 100
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'mobile',
          width: 116
        },
        {
          title: '会员类型',
          align: 'center',
          key: 'rank_id',
          width: 90
        },
        {
          title: '购买服务',
          align: 'center',
          key: 'service_name',
          width: 100
        },
        {
          title: '年龄',
          align: 'center',
          key: 'age',
          width: 70
        },
        {
          title: '性别',
          align: 'center',
          key: 'sex',
          width: 60
        },
        {
          title: '身高',
          align: 'center',
          key: 'stature',
          width: 80
        },
        {
          title: '信仰',
          align: 'center',
          key: 'belief',
          width: 80
        },
        {
          title: '学历',
          align: 'center',
          key: 'degree',
          width: 90
        },
        {
          title: '婚姻状态',
          align: 'center',
          key: 'state',
          width: 90
        },
        {
          title: '实名认证',
          align: 'center',
          key: 'is_approved',
          width: 90
        },
        {
          title: '工作城市',
          align: 'center',
          key: 'address',
          width: 80
        },
        {
          title: '出生城市',
          align: 'center',
          key: 'resident_address',
          width: 80
        },
        {
          title: '人工匹配人数',
          align: 'center',
          key: 'match_single_count',
          width: 90
        },
        {
          title: '智能匹配人数',
          align: 'center',
          key: 'recommend_notice_num',
          width: 90
        },
        {
          title: '小助手',
          align: 'center',
          key: 'is_subscribe',
          width: 90
        },
        {
          title: '加入时间',
          align: 'center',
          width: 150,
          key: 'created_at'
        },
        {
          title: '操作',
          key: 'title',
          width: 120,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    console.log(params.row, '22')
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'DataProceed',
                      params: argu,
                      query: { age: params.row.age, sex: params.row.sex, user_id: params.row.user_id}
                    })
                  }
                }
              }, '进行匹配'),
              // h('Badge', {
              //   props: {
              //     count: '未'
              //   },
              //   style: {
              //     position: 'absolute',
              //     marginTop: '-50px',
              //     marginLeft: '24px'
              //   }
              // }),
            ])
          }
        }
      ],
      Columns1: [
        {
          title: '用户ID',
          align: 'center',
          key: 'user_id',
          fixed: 'left',
          width: 80
        },
        {
          title: '头像',
          key: 'photo',
          fixed: 'left',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.photo
              },
              style: {
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                  let argu = {id: params.row.user_id}
                  this.$router.push({
                    name: 'user_detail',
                    params: argu
                  })
                }
              }
            })
          },
          align: 'center',
          width: 100
        },
        {
          title: '姓名',
          fixed: 'left',
          align: 'center',
          key: 'name',
          width: 100
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'mobile',
          width: 116
        },
        {
          title: '会员类型',
          align: 'center',
          key: 'rank_id',
          width: 90
        },
        {
          title: '购买服务',
          align: 'center',
          key: 'service_name',
          width: 80
        },
        {
          title: '年龄',
          align: 'center',
          key: 'age',
          width: 70
        },
        {
          title: '性别',
          align: 'center',
          key: 'sex',
          width: 60
        },
        {
          title: '身高',
          align: 'center',
          key: 'stature',
          width: 80
        },
        {
          title: '信仰',
          align: 'center',
          key: 'belief',
          width: 80
        },
        {
          title: '学历',
          align: 'center',
          key: 'degree',
          width: 90
        },
        {
          title: '婚姻状态',
          align: 'center',
          key: 'state',
          width: 90
        },
        {
          title: '实名认证',
          align: 'center',
          key: 'is_approved',
          width: 90
        },
        {
          title: '工作城市',
          align: 'center',
          key: 'address',
          width: 80
        },
        {
          title: '出生城市',
          align: 'center',
          key: 'resident_address',
          width: 80
        },
        {
          title: '人工匹配人数',
          align: 'center',
          key: 'match_single_count',
          width: 90
        },
        {
          title: '智能匹配人数',
          align: 'center',
          key: 'recommend_notice_num',
          width: 90
        },
        {
          title: '小助手',
          align: 'center',
          key: 'is_subscribe',
          width: 90
        },
        {
          title: '加入时间',
          align: 'center',
          width: 150,
          key: 'created_at'
        },
        {
          title: '操作',
          key: 'title',
          width: 120,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    console.log(params.row, '22')
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'goldProceed',
                      params: argu,
                      query: { age: params.row.age, sex: params.row.sex, user_id: params.row.user_id}
                    })
                  }
                }
              }, '进行匹配'),
            ])
          }
        }
      ],
      orgTotal: 0,
      entering: '',
      photo_null: 'http://img3.imgtn.bdimg.com/it/u=2804421204,2297174131&fm=26&gp=0.jpg',
      currentPage: 1,
      information: []
    }
  },
  methods: {
    childByValue (file) {
      this.filePath = file
      this.getlist(1)
    },
    getlist (page) {
      let self = this
      if (this.activeTab == 'data_matching') {
        uAxios.get(`admin/single/profiles?page=${page}&status=${self.activeTab}&keyword=${encodeURIComponent(self.searchKeyword)}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.entering = result.count
            self.information = result.profiles.data.map((item) => {
              return {
                id: item.id,
                name: item.name,
                mobile: item.mobile,
                user_id: item.user_id,
                sex: item.sex,
                recommend_notice_num: item.recommend_notice_num,
                resident_address: item.resident_address,
                address: item.address,
                age: item.age,
                is_subscribe: item.is_subscribe == '1' ? '已关注' : '未关注',
                belief: item.belief,
                is_approved: item.user.is_approved == '1' ? '已认证' : '未认证',
                state: item.state,
                service_name: item.service_name ? item.service_name : '未购买',
                degree: item.degree,
                photo: item.user.photo === null ? self.photo_null : item.user.photo,
                rank_id: this.typeFn(item.user.rank_id, item.user.temp_member),
                created_at: item.created_at,
                match_single_count: item.match_single_count,
                stature: item.stature != null ? item.stature + 'cm' : item.stature
              }
            })
            self.loading = false
            self.orgTotal = result.profiles.total
          })
      } else {
        uAxios.get(`admin/gold/ingle/profiles?page=${page}&status=${self.activeTab}&keyword=${encodeURIComponent(self.searchKeyword)}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.entering = result.count
            self.information = result.profiles.data.map((item) => {
              return {
                id: item.id,
                name: item.name,
                mobile: item.mobile,
                user_id: item.user_id,
                sex: item.sex,
                resident_address: item.resident_address,
                is_subscribe: item.is_subscribe == '1' ? '已关注' : '未关注',
                recommend_notice_num: item.recommend_notice_num,
                address: item.address,
                age: item.age,
                belief: item.belief,
                state: item.state,
                degree: item.degree,
                rank_id: this.typeFn(item.user.rank_id, item.user.temp_member),
                created_at: item.created_at,
                photo: item.user.photo === null ? self.photo_null : item.user.photo,
                service_name: item.service_name ? item.service_name : '未购买',
                match_single_count: item.match_single_count,
                is_approved: item.user.is_approved == '1' ? '已认证' : '未认证',
                stature: item.stature != null ? item.stature + 'cm' : item.stature
              }
            })
            self.loading = false
            self.orgTotal = result.profiles.total
          })
      }
    },
    typeFn (rank_id, temp_member) {
      if (temp_member == '1') {
        return '临时'
      } else {
        if (rank_id == '0') {
          return '普通'
        } else if (rank_id == '1') {
          return '市级'
        } else if (rank_id == '2') {
          return '黄金'
        } else {
          return '钻石'
        }
      }
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
      this.getlist(1)
    }
  },
  mounted () {
    this.getlist(1)
  }
}
</script>

<style scoped>
  .show{
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }
  .show:hover{
    color: red;
    text-decoration: underline;
  }
</style>
