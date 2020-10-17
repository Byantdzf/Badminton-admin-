<template>
  <!--  运动轨迹列表-->
  <Card title="运动轨迹列表">
    <Card style="margin-bottom: 32px">
      <Row :gutter="20">
        <Col span="20">
          <span>评星等级：</span>
          <Select v-model="SelectValue" style="width:200px;margin-right: 20px;">
            <Option value="全部" label="全部"></Option>
            <Option value="一星" label="一星"></Option>
            <Option value="二星" label="二星"></Option>
            <Option value="三星" label="三星"></Option>
            <Option value="四星" label="四星"></Option>
            <Option value="五星" label="五星"></Option>
          </Select>
          <span>搜索关键词：</span>
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="课程ID/课程名称"
            style="width: 200px;"/>
        </Col>
        <Col span="20" style="margin-top: 32px">
          <span>更新时间：</span>
          <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate"
                      style="width:200px;margin-right: 20px;"></DatePicker>
        </Col>
      </Row>
      <div style="margin-top: 22px;">
        <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
        <Button type="primary" style="margin-left: 12px; " @click="reset('addAuthorizationUser')">重置</Button>
      </div>
    </Card>
    <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="reset('addAuthorizationUser')">
      导出
    </Button>
    <Tabs style="margin-top: 12px;" v-model="type">
      <TabPane label="打卡视频" name="card">
        <Table :loading="loading" ref="selection" :columns="orgColumns" :data="information" style="width: 100%;"
               border></Table>
      </TabPane>
      <TabPane label="训练视频" name="drill">
        <Table :loading="loading" ref="selection" :columns="orgColumns1" :data="information" style="width: 100%;"
               border></Table>
      </TabPane>
    </Tabs>
    <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
          style="margin-top:30px;margin-bottom:30px;" show-elevator></Page>
  </Card>
</template>

<script>
import uAxios from '../../api/index'
import config from '../../api/config'
import dropdown from '../components/dropdown'
import Cookies from 'js-cookie'

export default {
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      type: 'card',
      type2: '',
      type_name: 'editCourseDetailTeam',
      beginDate: '', // 反馈时间
      CheckboxValue: false,
      SelectValue: '全部',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        {
          title: '用户ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '用户名称',
          key: 'id',
          align: 'center',
          width: 100
        },
        // {
        //   title: '视频标题',
        //   key: 'photo',
        //   render: (h, params) => {
        //     return h('img', {
        //       attrs: {
        //         src: params.row.photo
        //       },
        //       style: {
        //         width: '48px',
        //         height: '48px',
        //         marginTop: '6px',
        //         border: '4px solid #f4f4f4'
        //       },
        //       on: {
        //         click: () => {
        //         }
        //       }
        //     })
        //   },
        //   width: 80,
        //   align: 'center'
        // },
        {
          title: '视频标题',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '教练名称',
          key: 'type',
          align: 'center'
        },
        {
          title: '评星等级',
          key: 'type',
          align: 'center'
        },
        {
          title: '评论内容',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '发布时间',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '操作',
          key: 'id',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'cardVideoDetail',
                      query: {id: 12}
                    })
                  }
                }
              }, '查看'),
              h('span', {
                style: {
                  color: '#ed4014',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>你删除该视频吗？</p>`,
                      onOk: () => {
                        this.$Message.info('点击了确认')
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      orgColumns1: [
        {
          title: '用户ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '用户名称',
          key: 'id',
          align: 'center',
          width: 100
        },
        // {
        //   title: '视频标题',
        //   key: 'photo',
        //   render: (h, params) => {
        //     return h('img', {
        //       attrs: {
        //         src: params.row.photo
        //       },
        //       style: {
        //         width: '48px',
        //         height: '48px',
        //         marginTop: '6px',
        //         border: '4px solid #f4f4f4'
        //       },
        //       on: {
        //         click: () => {
        //         }
        //       }
        //     })
        //   },
        //   width: 80,
        //   align: 'center'
        // },
        {
          title: '视频标题',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '教练名称',
          key: 'type',
          align: 'center'
        },
        {
          title: '评星等级',
          key: 'type',
          align: 'center'
        },
        {
          title: '评论内容',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '发布时间',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '操作',
          key: 'id',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'drillVideoDetail',
                      query: {id: 12}
                    })
                  }
                }
              }, '查看'),
              h('span', {
                style: {
                  color: '#ed4014',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>你确定该订单已付款吗？</p>`,
                      onOk: () => {
                        this.$Message.info('点击了确认')
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      information: [],
      loading: false
    }
  },
  watch: {
    type () {
      if (this.type === 'card') {
        this.type_name = 'editCourseDetailTeam'
      } else if (this.type === 'network') {
        this.type_name = 'editCourseDetailNetwork'
      } else {
        this.type_name = 'editCourseDetailExperience'
      }
    }
  },
  methods: {
    reset () {
      this.$Message.info('This is a 重置')
    },
    gotoPage (title) {
      this.$router.push({
        name: title
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
      uAxios.get(`admin/admins?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data.map((item) => {
              let {user} = item
              user.adminId = item.id
              user.created_at = item.created_at
              user.sex = user.sex == 1 ? '男' : '女'
              user.type = user.type == 'single' ? '单身' : '介绍人'
              user.admin_type = item.type == 'SUPER' ? '超级管理员' : `《${item.paas.title}》管理员`
              return user
            })
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
