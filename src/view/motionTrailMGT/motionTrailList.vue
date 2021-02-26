<template>
  <!--  运动轨迹列表-->
  <Card title="运动轨迹列表">
    <Card style="margin-bottom: 32px">
      <Row :gutter="20">
        <Col span="20">
          <span>评星等级：</span>
          <Select v-model="rate" style="width:200px;margin-right: 20px;">
            <Option value="全部" label="全部"></Option>
            <Option value="1" label="一星"></Option>
            <Option value="2" label="二星"></Option>
            <Option value="3" label="三星"></Option>
            <Option value="4" label="四星"></Option>
            <Option value="5" label="五星"></Option>
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
    <Tabs style="margin-top: 12px;" v-model="type" @on-click="tabFn">
      <TabPane label="打卡视频" name="CLOCKIN">
        <Table :loading="loading" ref="selection" :columns="orgColumns" :data="information" style="width: 100%;"
               border></Table>
      </TabPane>
      <TabPane label="训练视频" name="TRAIN">
        <Table :loading="loading" ref="selection" :columns="orgColumns" :data="information" style="width: 100%;"
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
      type: 'CLOCKIN',
      rate: 0,
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
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '用户ID',
          key: 'user_id',
          align: 'center',
          width: 100
        },
        {
          title: '学员名称',
          align: 'center',
          width: 100,
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
          title: '视频标题',
          key: 'name',
          align: 'center',
          editable: true
        },
        // {
        //   title: '教练名称',
        //   align: 'center',
        //   render: (h, params) => {
        //     if (params.row.other_user) {
        //       return h('span', {
        //       }, params.row.other_user.name)
        //     } else {
        //       return h('span', '未获取')
        //     }
        //   }
        // },
        // {
        //   title: '评星等级',
        //   key: 'store_name',
        //   align: 'center'
        // },
        // {
        //   title: '评论内容',
        //   key: 'store_name',
        //   align: 'center'
        // },
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
                    if (this.type == 'CLOCKIN') {
                      this.$router.push({
                        name: 'cardVideoDetail',
                        query: { id: params.row.id }
                      })
                    } else {
                      this.$router.push({
                        name: 'drillVideoDetail',
                        query: { id: params.row.id }
                      })
                    }
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
                        this.deleteFn(params.index)
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
  methods: {
    deleteFn (index) {
      let { id } = this.information[index]
      uAxios.delete(`video/logs/${id}`)
        .then(res => {
          this.information.splice(index, 1)
          this.$Message.info('删除成功')
        })
    },
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
    tabFn () {
      this.getlist(1)
      // this.$Message.info('This is a test')
    },
    handlePage (num) { // 分页
      this.getlist(num)
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`video/logs?page=${page}&keyword=${self.searchKeyword}&rate=${self.rate == '全部' ? '' : self.rate}&type=${self.type}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data
            self.orgTotal = result.total
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
