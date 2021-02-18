<template>
  <!--  课程列表-->
  <Card title="网课列表">
    <Card style="margin-bottom: 32px">
      <Row :gutter="20">
        <Col span="20">
          <span>搜索关键词：</span>
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="课程ID/课程名称"
            style="width: 200px;"/>
          <Button type="warning" icon="ios-search" style="margin-left: 12px;" @click="handleSearch">搜索</Button>
        </Col>
      </Row>
    </Card>
    <Button type="primary" style="margin-left: 12px;margin-bottom: 22px; " @click="gotoPage(type_name)">
      新增网课
    </Button>
    <Table :loading="loading" ref="selection" :columns="orgColumns1" :data="information" style="width: 100%;"
           border></Table>
    <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
          style="margin-top:30px;margin-bottom:30px;" show-elevator></Page>

  </Card>
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
      type: 'online',
      // trial:体验课，league:团课, online:网课
      type_name: 'editCourseDetailNetwork', // online:网课
      beginDate: '', // 反馈时间
      CheckboxValue: false,
      SelectValue: '全部',
      search: '',
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      id: '',
      orgColumns1: [
        {
          title: '课程ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '课程昵称',
          key: 'name',
          align: 'center'
        },
        {
          title: '课程图片',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.pic
              },
              style: {
                width: '48px',
                height: '48px',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                }
              }
            })
          },
          width: 100,
          align: 'center'
        },
        {
          title: '分类',
          key: 'category_id',
          align: 'center',
          render: (h, params) => {
            let category = params.row.category
            return h('span', category.name)
          }
        },
        {
          title: '观看量',
          key: 'view_num',
          align: 'center'
        },
        {
          title: '状态',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            if (params.row.is_show == '1') {
              return h('span', '显示')
            } else {
              return h('span', '隐藏')
            }
          }
        },
        {
          title: '更新时间',
          key: 'updated_at',
          align: 'center'
        },
        {
          title: '操作',
          key: 'id',
          width: 140,
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
                      name: 'editCourseDetailNetwork',
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
                      content: `<p>你确定删除该课程吗？</p>`,
                      onOk: () => {
                        this.cancelFn(params.index)
                      },
                      onCancel: () => {
                        console.log('点击了取消')
                      }
                    })
                  }
                }
              }, '删除课程')
            ])
          }
        }
      ],
      orgColumns2: [
        {
          title: '课程ID',
          key: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '课程名称',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '课程图片',
          key: 'pic',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.pic
              },
              style: {
                width: '48px',
                height: '48px',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                }
              }
            })
          },
          width: 80,
          align: 'center'
        },
        {
          title: '分类',
          key: 'category_id',
          align: 'center',
          editable: true
        },
        {
          title: '状态',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            if (params.row.is_show == '1') {
              return h('span', '上架')
            } else {
              return h('span', '下架')
            }
          }
        },
        {
          title: '更新时间',
          key: 'updated_at',
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
                      name: 'evaluateDetail',
                      query: { id: 12 }
                    })
                  }
                }
              }, '查看'),
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '18px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'evaluateDetail',
                      query: { id: 12 }
                    })
                  }
                }
              }, '编辑'),
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
              }, `${params.row.is_show == '1' ? '下架' : '上架'}`)
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
      // trial:体验课，league:团课, online:网课
      if (this.type === 'league') {
        this.type_name = 'editCourseDetailTeam'
      } else if (this.type === 'online') {
        this.type_name = 'editCourseDetailNetwork'
      } else {
        this.type_name = 'editCourseDetailExperience'
      }
    }
  },
  methods: {
    cancelFn (index) { // 取消预约
      let { id } = this.information[index]
      uAxios.delete(`courses/${id}`)
        .then(res => {
          let result = res.data.data
          this.information.splice(index, 1)
          console.log(result)
          // if (result) {
          //   this.information[index].status = '已取消'
          //   // this.getlist(1)
          //   this.$Message.info('已取消')
          // }
        })
    },
    exportFn () { // 导出数据
      let baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
      let oa = document.createElement('a')
      oa.href = `${baseUrl}export/courses`
      oa.download = 'htmltable-base64.xls'// 通过A标签 设置文件名
      oa.click()
    },
    operationFn (index) {
      // 上下架操作
      console.log(index)
      console.log(this.information[index])
    },
    reset () {
      this.$Message.info('This is a 重置')
    },
    gotoPage (title) {
      this.$router.push({
        name: title
      })
    },
    TabFn () { this.getlist(1) },
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
      uAxios.get(`courses?page=${page}&keyword=${self.searchKeyword}&type=${this.type}`)
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
