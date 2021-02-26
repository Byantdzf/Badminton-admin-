<template>
  <div>
    <Card>
      <Tabs style="margin-top: 12px;">
        <TabPane label="预约列表" name="adminList">
          <Card style="margin-bottom: 32px">
            <span>上课状态：</span>
            <Select v-model="SelectValue" style="width:200px;margin-right: 16px;">
              <Option value="" label="全部"></Option>
              <Option value="0" label="未开始"></Option>
              <Option value="1" label="进行中"></Option>
              <Option value="2" label="已完成"></Option>
              <Option value="3" label="已取消"></Option>
            </Select>
            <span>搜索关键词：</span>
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="搜索用户..."
              style="width: 300px;"/>
            <p style="margin-top: 22px;">
              <span>预约时间：</span>
              <DatePicker type="datetimerange" placeholder="选择查询日期" v-model="beginDate" style="width: 280px"></DatePicker>
            </p>
            <div style="margin-top: 22px;">
                    <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
                    <Button type="primary" style="margin-left: 12px; " @click="reset()">重置</Button>
                </div>
          </Card>
          <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="exportFn()">导出</Button>
          <Table :loading="loading" ref="selection"  :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="margin-top:30px;margin-bottom:30px;"  show-elevator></Page>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import uAxios from '../../api/index'
import config from '@/config'
import dropdown from '../components/dropdown'
import Cookies from 'js-cookie'

export default {
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      CheckboxValue: false,
      SelectValue: '',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '预约ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '预约人',
          key: 'name',
          align: 'center',
          editable: true
        },
        {
          title: '电话',
          key: 'mobile',
          align: 'center',
          editable: true
        },
        {
          title: '预约时间',
          key: 'booking_time',
          align: 'center',
          editable: true
        },
        {
          title: '预约门店',
          key: 'store_name',
          align: 'center',
          editable: true
        },
        {
          title: '预约课程',
          key: 'course_name',
          align: 'center',
          editable: true
        },
        // {
        //   title: '教练',
        //   key: 'coach_name',
        //   align: 'center',
        //   editable: true
        // },
        {
          title: '上课状态',
          key: 'status',
          align: 'center',
          editable: true
        },
        {
          title: '操作',
          key: 'id',
          width: 180,
          align: 'center',
          render: (h, params) => {
            if (params.row.status == '已取消') {
              return h('div', [
                h('span', {
                  style: {
                    color: '#2d8cf0',
                    marginRight: '18px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'BookingDetail',
                        query: { id: params.row.id }
                      })
                    }
                  }
                }, '查看详情'),
                h('span', {
                  style: {
                    color: '#666666'
                  },
                  on: {
                    click: () => {
                      // this.$Modal.confirm({
                      //   title: '温馨提示',
                      //   content: `<p>你确定取消该预约吗？</p>`,
                      //   onOk: () => {
                      //     this.cancelFn(params.index)
                      //   },
                      //   onCancel: () => {
                      //     console.log('点击了取消')
                      //   }
                      // })
                    }
                  }
                }, '已取消')
              ])
            } else {
              return h('div', [
                h('span', {
                  style: {
                    color: '#2d8cf0',
                    marginRight: '18px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'BookingDetail',
                        query: { id: params.row.id }
                      })
                    }
                  }
                }, '查看详情'),
                h('span', {
                  style: {
                    color: '#ed4014'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '温馨提示',
                        content: `<p>你确定取消该预约吗？</p>`,
                        onOk: () => {
                          this.cancelFn(params.index)
                        },
                        onCancel: () => {
                          console.log('点击了取消')
                        }
                      })
                    }
                  }
                }, '取消预约')
              ])
            }
          }
        }
      ],
      information: [],
      beginDate: [],
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
    exportFn () { // 导出数据
      let baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
      let oa = document.createElement('a')
      oa.href = `${baseUrl}export/course/bookings`
      oa.download = 'htmltable-base64.xls'// 通过A标签 设置文件名
      oa.click()
    },
    cancelFn (index) { // 取消预约
      let { id } = this.information[index]
      uAxios.post(`cancel/course/bookings/${id}`)
        .then(res => {
          let result = res.data.data
          // this.information.splice(index,1)
          console.log(result)
          if (result) {
            this.information[index].status = '已取消'
            // this.getlist(1)
            this.$Message.info('已取消')
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
      uAxios.get(`course/bookings?page=${page}&keyword=${self.searchKeyword}&start_time=${this.beginDate[0]}&end_time=${this.beginDate[1]}&status=${this.SelectValue ? this.SelectValue : ''}`)
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
