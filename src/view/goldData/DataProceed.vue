<template>
  <div>
    <div id="name">
      <div v-model="activeTab">
        <Row>
          <Col span="6">
            <Card style="margin-bottom: 8px;">
              <div v-model="profile">
                <div style="overflow: hidden;margin-bottom: 12px" @click="getUser">
                  <div style="float: left;margin-top: 20px">头像：</div>
                  <img :src="profile.user.photo" alt="" width="60px" style="border-radius: 50%;float: left">
                </div>
                <div class="user_data">用户ID：{{profile.user_id}}</div>
                <div class="user_data">名字：{{profile.user.name}}</div>
                <div class="user_data">电话：{{profile.user.mobile}}</div>
                <div class="user_data">年龄：{{profile.age == null ? '' : profile.age + '岁'}}</div>
                <div class="user_data">性别：{{profile.sex == '1' ? '男' : '女'}}</div>
                <div class="user_data">身高：{{profile.stature == null ? '' : profile.stature + 'cm'}}</div>
                <div class="user_data">学历：{{profile.degree}}</div>
                <div class="user_data">信仰：{{profile.belief}}</div>
                <div class="user_data">婚姻状态：{{profile.state == null ? '未填写' : profile.state}}</div>
                <div class="user_data">工作城市：{{profile.province}} {{profile.city}}</div>
                <div class="user_data">出生城市：{{profile.resident_province}} {{profile.resident_city}}</div>
                <div class="user_data">加入时间：{{profile.user.created_at}}</div>
              </div>
            </Card>
          </Col>
          <Col span="8" style="margin-left: 30px">
            <Card style="margin-bottom: 8px">
              <div class="choice">
                信仰：
                <i-select v-model="belief_value" style="width:100px;" clearable @on-change="getlist(1)">
                  <i-option v-for="item in belief" :value="item">{{ item }}</i-option>
                </i-select>
              </div>
              <div class="choice">
                年龄：
                <i-select v-model="min_age" style="width:60px;" placeholder="最小" clearable @on-change="getlist(1)">
                  <i-option v-for="item in min_years" :value="item">{{ item }}</i-option>
                </i-select>
                <span style="color: #D92553;margin-left: 10px;margin-right: 10px">{{age}}</span>
                <i-select v-model="max_age" style="width:60px;" placeholder="最大" clearable @on-change="getlist(1)">
                  <i-option v-for="item in max_years" :value="item">{{ item }}</i-option>
                </i-select>
              </div>
              <div class="choice">
                身高：
                <i-select v-model="min_stature" style="width:80px;" placeholder="最小" clearable @on-change="getlist(1)">
                  <i-option v-for="item in stature" :value="item">{{ item }}cm</i-option>
                </i-select>
                <span> ~ </span>
                <i-select v-model="max_stature" style="width:80px;" placeholder="最大" clearable @on-change="getlist(1)">
                  <i-option v-for="item in stature" :value="item">{{ item }}cm</i-option>
                </i-select>
              </div>
              <div class="choice">
                学历：
                <i-select v-model="degree_value" style="width:100px;" clearable @on-change="getlist(1)">
                  <i-option v-for="item in degree" :value="item">{{ item }}</i-option>
                </i-select>
              </div>
              <div class="choice">
                是否认证：
                <i-select v-model="authentication_value" style="width:100px;" clearable @on-change="getlist(1)">
                  <i-option v-for="item in authentication" :value="item">{{ item }}</i-option>
                </i-select>
              </div>
              <div class="choice">
                工作城市：
                <Cascader :data="address" v-model="address_value" style="width: 150px;display: inline-block;"></Cascader>
              </div>
              <div class="choice">
                出生城市：
                <Cascader :data="resident" v-model="resident_value" style="width: 150px;display: inline-block;"></Cascader>
              </div>
              <div class="choice">
                婚姻状态：
                <i-select v-model="marriage_value" style="width:100px;" clearable @on-change="getlist(1)">
                  <i-option v-for="item in marriage" :value="item">{{ item }}</i-option>
                </i-select>
              </div>
              <div class="choice">
                <span class="titleStyle">是否有孩子：</span>
                <i-select v-model="child_value" style="width:100px;" clearable @on-change="getlist(1)">
                  <i-option v-for="item in childValueList" :value="item">{{ item }}</i-option>
                </i-select>
                <!--<Radio-group v-model="child_value">-->
                <!--<Radio label="有"></Radio>-->
                <!--<Radio label="无"></Radio>-->
                <!--</Radio-group>-->
              </div>
              <div class="choice">
                <span class="titleStyle">是否含有金数据：</span>
                <Checkbox v-model="is_gold">{{is_gold?'金数据用户':'所有用户'}}</Checkbox>
                <!--<Radio-group v-model="is_gold">-->
                <!--<Radio label="含"></Radio>-->
                <!--<Radio label="不含"></Radio>-->
                <!--</Radio-group>-->
              </div>
            </Card>
          </Col>
        </Row>
        <Card>
          <Tabs @on-click="getTab">
            <TabPane label="基础匹配" name="screen">
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."
                style="width: 200px; margin-bottom: 22px;"/>
              <span @click="handleSearch">
              <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
            </span>
              <Button type="success" style=" margin-bottom: 22px;margin-left: 20px;" @click="postProfile">保存匹配</Button>
              <Card>
                <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
                <div style="clear: both"></div>
              </Card>
            </TabPane>
            <TabPane label="人工匹配" name="matching">
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."
                style="width: 200px; margin-bottom: 22px;"/>
              <span @click="handleSearch">
                <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
              </span>
              <Card>
                <Table :loading="loading" :columns="Columns1" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
                <div style="clear: both"></div>
              </Card>
            </TabPane>
            <TabPane label="人工智能匹配" name="artificialIntelligence">
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."
                style="width: 200px; margin-bottom: 22px;"/>
              <span @click="handleSearch">
                <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
              </span>
              <Card>
                <Table :loading="loading" :columns="Columns2" :data="information" style="width: 100%;" border></Table>
                <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                      style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
                <div style="clear: both"></div>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </div>
      <Modal
        v-model="modal1"
        title='温馨提示'
        ok-text="确定"
        @on-ok="deleteProfile"
        no-cancel>
        <p>是否删除该推荐？</p>
      </Modal>
      <Modal
        v-model="modal2"
        title='温馨提示'
        ok-text="确定"
        @on-ok="sendTemplate"
        no-cancel>
        <p>是否给该用户发送推荐模板消息？</p>
      </Modal>
    </div>
  </div>
</template>

<script>
import uAxios from '../../api/index'

export default {
  name: 'DataProceed',
  components: {},
  data () {
    return {
      filePath: null,
      id: '',
      user_id: '',
      searchKeyword: '',
      loading: false,
      modal1: false,
      modal2: false,
      modal: false,
      title: '',
      u_id: '',
      count: [],
      childValueList: ['有', '无', '取消'],
      address: [],
      address_value: [],
      resident: [],
      is_gold: '',
      resident_value: [],
      belief_value: '',
      belief: ['基督教', '佛教', '伊斯兰教', '其他'],
      marriage_value: '',
      marriage: ['未婚', '离异', '丧偶'],
      max_stature: '',
      min_stature: '',
      authentication_value: '',
      authentication: ['是', '否'],
      degree_value: '',
      degree: ['初中', '中专', '高中', '大专', '本科', '硕士', '博士', '其他'],
      stature: ['140', '150', '160', '170', '180', '190'],
      child_value: '',
      min_years: [],
      max_years: [],
      intro: '',
      logo: '',
      switchLoading: false,
      activeTab: 'screen',
      chart: {},
      ids: [],
      disabled: false,
      Columns: [
        {
          title: 'ID',
          align: 'center',
          key: 'user_id'
        },
        {
          title: '头像',
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
          key: 'name'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '会员类型',
          align: 'center',
          key: 'rank_id'
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
          title: '信仰',
          align: 'center',
          key: 'belief'
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
          title: '实名认证',
          align: 'center',
          key: 'is_approved'
        },
        {
          title: '工作城市',
          align: 'center',
          key: 'address'
        },
        {
          title: '出生城市',
          align: 'center',
          key: 'resident_address'
        },
        {
          title: '含金数据',
          align: 'center',
          key: 'is_gold'
        },
        {
          title: '加入时间',
          align: 'center',
          width: 160,
          key: 'created_at'
        },
        {
          title: '推荐匹配',
          align: 'center',
          width: 100,
          key: 'is_recommend',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                size: 'large'
                // value: Boolean(params.row.is_recommend == '0' ? false : true)
              },
              scopedSlots: {
                open: () => h('span', '推荐'),
                close: () => h('span', 'NO')
              },
              on: {
                'on-change': (value) => {
                  if (value) {
                    this.ids.push(params.row.user_id)
                  } else {
                    this.ids.splice(params.index, 1)
                  }
                }
              }
            })
          }
        }
      ],
      Columns1: [
        {
          title: 'ID',
          align: 'center',
          key: 'user_id'
        },
        {
          title: '头像',
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
                  let argu = {id: params.row.user_id}
                  console.log(params.row, '456')
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
          key: 'name'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '会员类型',
          align: 'center',
          key: 'rank_id'
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
          title: '信仰',
          align: 'center',
          key: 'belief'
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
          title: '实名认证',
          align: 'center',
          key: 'is_approved'
        },
        {
          title: '工作城市',
          align: 'center',
          key: 'address'
        },
        {
          title: '出生城市',
          align: 'center',
          key: 'resident_address'
        },
        {
          title: '加入时间',
          width: 160,
          align: 'center',
          key: 'created_at'
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
              }, '删除匹配'),
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
                    this.modal2 = true
                    this.other_user_id = params.row.other_user_id
                    this.user_id = params.row.user_id
                  }
                }
              }, '模板消息')
            ])
          }
        }
      ],
      Columns2: [
        {
          title: 'ID',
          align: 'center',
          key: 'user_id'
        },
        {
          title: '头像',
          key: 'photo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.photo ? params.row.photo : ''
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
          align: 'center'
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
          title: '会员类型',
          align: 'center',
          key: 'rank_id'
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
          title: '信仰',
          align: 'center',
          key: 'belief'
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
          title: '实名认证',
          align: 'center',
          key: 'is_approved'
        },
        {
          title: '工作城市',
          align: 'center',
          key: 'address'
        },
        {
          title: '出生城市',
          align: 'center',
          key: 'resident_address'
        },
        {
          title: '匹配时间',
          align: 'center',
          width: 160,
          key: 'created_at'
        }
      ],
      orgTotal: 0,
      entering: '',
      currentPage: 1,
      information: [],
      profile: [],
      Index: 1,
      page: 1,
      age: '',
      temp_member: '',
      sex: '',
      min_age: 3,
      max_age: 5
    }
  },
  watch: {
    address_value () {
      this.getlist(1)
    },
    resident_value () {
      this.getlist(1)
    }
  },
  methods: {
    getlist (page) {
      let self = this,
        data = {
          max_age: self.max_age? self.max_age:'',
          min_age: self.min_age? self.min_age:'',
          province: self.address_value[0] ? self.address_value[0] : [],
          city: self.address_value[1] ? self.address_value[1] : [],
          resident_province: self.resident_value[0] ? self.resident_value[0] : [],
          resident_city: self.resident_value[1] ? self.resident_value[1] : [],
          belief: self.belief_value? self.belief_value:'',
          state: self.marriage_value? self.marriage_value:'',
          has_child: self.child_value == '取消' ? '' : self.child_value,
          is_gold: self.is_gold? '1' : '0',
          min_stature: self.min_stature? self.min_stature:'',
          max_stature: self.max_stature? self.max_stature:'',
          degree: self.degree_value? self.degree_value:'',
          is_approved: self.authentication_value? self.authentication_value:''
        }
      self.belief_value = self.belief_value ? self.belief_value : ''
      if (this.activeTab == 'screen') {
        let transmit = '';
        for (let item in data){
          transmit = `${transmit}&${item}=${data[item]}`
        }
        uAxios.get(`admin/other/single/profiles/` + this.id + `?page=${page}&status=${self.activeTab}&keyword=${encodeURIComponent(self.searchKeyword)}${transmit}`)
          .then(res => {
            let result = res.data.data
            self.temp_member =
            self.information = result.profiles.data.map((item) => {
              return {
                id: item.id,
                name: item.name,
                user_id: item.user_id,
                mobile: item.mobile,
                sex: item.sex,
                resident_address: item.resident_address,
                address: item.address,
                age: item.age,
                state: item.state,
                degree: item.degree,
                photo: item.user.photo != null ? item.user.photo : '',
                belief: item.belief,
                is_gold: item.is_gold == '1' ? '含' : '不含',
                created_at: item.created_at,
                rank_id: this.typeFn(item.user.rank_id, item.user.temp_member),
                stature: item.stature != null ? item.stature + 'cm' : item.stature,
                is_approved: item.user.is_approved == '1' ? '已认证' : '未认证'
              }
            })
            self.profile = result.profile
            self.orgTotal = result.profiles.total
            self.loading = false
          })
      } else if (this.activeTab == 'matching') {
        uAxios.get(`admin/matching/single/profiles/` + this.id + `?page=${page}&status=${self.activeTab}&keyword=${encodeURIComponent(self.searchKeyword)}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            let profiles = result.other_profiles.data
            self.information = result.other_profiles.data.map((item) => {
              return {
                other_user_id: item.other_user_id,
                user_id: item.other_single_profile.user_id,
                address: item.other_single_profile.address,
                name: item.other_single_profile.name,
                age: item.other_single_profile.age,
                resident_address: item.other_single_profile.resident_address,
                mobile: item.other_single_profile.mobile,
                sex: item.other_single_profile.sex,
                stature: item.other_single_profile.stature,
                state: item.other_single_profile.state,
                service_name: item.service_name,
                degree: item.other_single_profile.degree,
                photo: item.other_single_profile.user.photo != null ? item.other_single_profile.user.photo : '',
                created_at: item.other_single_profile.user.created_at,
                belief: item.other_single_profile.user.belief,
                rank_id: this.typeFn(item.other_single_profile.user.rank_id, item.other_single_profile.user.temp_member),
                is_approved: item.other_single_profile.user.is_approved == '1' ? '已认证' : '未认证'
              }
            })
            self.other_profiles = profiles
            self.loading = false
            self.orgTotal = result.other_profiles.total
          })
      } else {
        uAxios.get(`admin/users/` + this.u_id + `/recommend/single/profiles?page=${page}&status=${self.activeTab}&keyword=${encodeURIComponent(self.searchKeyword)}`)
          .then(res => {
            let result = res.data.data
            self.information = result.data.map((item) => {
              return {
                id: item.id,
                user_id: item.other_user.profile_courtship.user_id,
                address: item.other_user.profile_courtship.province + ' ' + item.other_user.profile_courtship.city,
                name: item.other_user.name,
                age: item.age,
                resident_address: item.other_user.profile_courtship.resident_province + ' ' + item.other_user.profile_courtship.resident_city,
                mobile: item.other_user.mobile,
                sex: item.other_user.sex == 2? '女' : '男',
                stature: item.other_user.profile_courtship.stature,
                state: item.other_user.profile_courtship.state,
                // service_name: item.other_user.service_name,
                degree: item.other_user.profile_courtship.degree,
                photo: item.other_user.photo,
                created_at: item.created_at,
                belief: item.other_user.belief,
                rank_id: this.typeFn(item.other_user.rank_id, item.other_user.temp_member),
                is_approved: item.other_user.is_approved == '1' ? '已认证' : '未认证'
              }
            })
            self.loading = false
            self.orgTotal = result.total
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
    getUser () {
      let argu = {id: this.profile.user_id}
      this.$router.push({
        name: 'user_detail',
        params: argu
      })
    },
    getChildren (item) {
      let data = item.son.map((item_son) => {
        return {
          value: item_son.name,
          label: item_son.name
        }
      })
      return data
    },
    getData () {
      let self = this
      uAxios.get(`addresses/v3`)
        .then(res => {
          let result = res.data.data
          result.map((item) => {
            self.address.push(
              {
                label: item.name,
                value: item.name,
                children: this.getChildren(item)
              }
            )
          })
          result.map((item) => {
            self.resident.push(
              {
                label: item.name,
                value: item.name,
                children: this.getChildren(item)
              }
            )
          })
          console.log(self.address)
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
    postProfile () {
      let self = this,
        data = {
          user_ids: this.ids
        }
      uAxios.post('admin/match/single/profiles/' + this.id, data).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('添加成功')
          this.getlist(1)
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    sendTemplate () {
      let self = this
      uAxios.post(`admin/recommend/notice/` + this.other_user_id + `/to/` + this.u_id).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('发送成功')
          this.getlist(1)
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
      this.information = []
      this.getlist(1)
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.age = this.$route.query.age
    this.sex = this.$route.query.sex
    this.u_id = this.$route.query.user_id
    for (let i = Number(this.age) - 10; i <= this.age; i++) {
      this.max_years.push(i + '')
    }
    for (let i = this.age; i <= Number(this.age) + 10; i++) {
      this.max_years.push(i + '')
    }
    for (let i = Number(this.age) - 10; i <= this.age; i++) {
      this.min_years.push(i + '')
    }
    if (this.sex === '女') {
      this.max_age = parseInt(this.age) + this.max_age
      this.min_age = parseInt(this.age) - this.min_age
    } else {
      this.max_age = parseInt(this.age) + this.min_age
      this.min_age = parseInt(this.age) - this.max_age
    }
    this.getlist(1)
    this.getData()
  }
}
</script>

<style scoped>
  .choice{
    margin-bottom: 5px;
  }
  .user_data{
    margin-bottom: 3px;
  }
</style>
