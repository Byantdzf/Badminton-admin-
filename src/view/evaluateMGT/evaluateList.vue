<template>
<!--  评价列表-->
  <Card>
    <Tabs style="margin-top: 12px;">
      <TabPane label="评价列表" name="adminList">
        <Card style="margin-bottom: 32px">
          <Row :gutter="20">
            <Col span="20">
              <span>审核状态：</span>
              <Select v-model="SelectValue" style="width:200px;margin-right: 20px;">
                <Option value="" label="全部"></Option>
                <Option value="1" label="已审核"></Option>
                <Option value="0" label="审核中"></Option>
                <Option value="-1" label="已拒绝"></Option>
              </Select>
              <span>搜索关键词：</span>
              <Input
                v-model="searchKeyword"
                @on-enter="handleSearch"
                placeholder="搜索用户..."
                style="width: 200px;"/>
            </Col>
            <Col span="20" style="margin-top: 32px">
              <span>发布时间：</span>
              <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate"style="width:200px;margin-right: 20px;"></DatePicker>
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
        <Table :loading="loading" ref="selection" :columns="orgColumns" :data="information" style="width: 100%;"
               border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
              style="margin-top:30px;margin-bottom:30px;" show-elevator></Page>
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
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      beginDate: [], // 反馈时间
      CheckboxValue: false,
      SelectValue: '',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        {
          title: '教练昵称',
          align: 'center',
          render: (h, params) => {
            if (params.row.commented) {
              return h('span', params.row.commented.name)
            }
          }
        },
        {
          title: '学员昵称',
          align: 'center',
          render: (h, params) => {
            if (params.row.commentable) {
              return h('span', params.row.commentable.user.name)
            }
          }
        },
        {
          title: '评价视频标题',
          align: 'center',
          render: (h, params) => {
            if (params.row.commentable.name) {
              return h('span', params.row.commentable.name)
            }
          }
        },
        {
          title: '评星等级',
          key: 'rate',
          align: 'center'
        },
        {
          title: '发布时间',
          key: 'created_at',
          align: 'center'
        },
        {
          title: '状态',
          key: 'approved',
          align: 'center'
        },
        {
          title: '操作',
          key: 'id',
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
                      name: 'evaluateDetail',
                      query: { id: params.row.id }
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
                      content: `<p>你确定删除该评价吗？</p>`,
                      onOk: () => {
                        this.$Message.info('暂无接口')
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
    format (time, format) {
      if (!time) return ''
      var t = new Date(time)
      var tf = function (i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
            break
          case 'MM':
            return tf(t.getMonth() + 1)
            break
          case 'mm':
            return tf(t.getMinutes())
            break
          case 'dd':
            return tf(t.getDate())
            break
          case 'HH':
            return tf(t.getHours())
            break
          case 'ss':
            return tf(t.getSeconds())
            break
        }
      })
    },
    reset () {
      this.beginDate = []
      this.SelectValue = ''
      this.searchKeyword = '' // 搜索
      this.$Message.info('已重置')
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
      if (this.beginDate[0] && this.beginDate[1]) {
        this.beginDate[0] = this.format(this.beginDate[0], 'yyyy-MM-dd HH:ss')
        this.beginDate[1] = this.format(this.beginDate[1], 'yyyy-MM-dd HH:ss')
      }

      uAxios.get(`evaluates?page=${page}&keyword=${self.searchKeyword}&start_time=${this.beginDate[0]}&end_time=${this.beginDate[1]}&approved=${this.SelectValue||this.SelectValue==0?this.SelectValue:''}`)
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
