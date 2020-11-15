const Main = () => import('@/view/main')
const Login = () => import('@/view/login/login.vue')
const reset = () => import('@/view/login/reset.vue')
const Home = () => import('@/view/home/home.vue')
const Error401 = () => import('@/view/error-page/401.vue')
const Error500 = () => import('@/view/error-page/500.vue')
const Error404 = () => import('@/view/error-page/404.vue')

export const routerMap = {
  Main,
  Login, Home,
  reset,
  Error401,
  Error500,
  Error404
}
export const staticRouters = [
  {path: '/login', name: 'login', meta: {title: 'Login - 登录', hideInMenu: true}, component: routerMap['Login']},
  {path: '/reset', name: 'reset', meta: {title: 'Login - 修改密码', hideInMenu: true}, component: routerMap['reset']},
  {path: '/401', name: 'error_401', meta: {hideInMenu: true}, component: routerMap['Error401']},
  {path: '/500', name: 'error_500', meta: {hideInMenu: true}, component: routerMap['Error500']},
  {path: '*', name: 'error_404', meta: {hideInMenu: true}, component: routerMap['Error404']},
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    meta: {notCache: true, hideInMenu: true},
    component: routerMap['Main'],
    children: [{
      path: '/home',
      name: 'home',
      meta: {notCache: true, hideInMenu: true, title: '首页'},
      component: () => import('@/view/systemMGT/userList.vue')
    }]
  },
  {
    path: '/',
    name: '系统管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'logo-windows',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'authorization',
        path: 'authorization',
        icon: 'logo-youtube',
        meta: {
          hideInMenu: false,
          notCache: true,
          title: '后台用户管理'
        },
        component: () => import('@/view/systemMGT/userList.vue')
      },
      {
        name: 'roleList',
        path: 'roleList',
        icon: 'ios-contacts',
        meta: {
          // access: ['paas_admin'],
          hideInMenu: false,
          notCache: true,
          title: '角色管理'
        },
        component: () => import('@/view/systemMGT/roleList.vue')
      },
      {
        name: 'feedbackList',
        path: 'feedbackList',
        icon: 'ios-contacts',
        meta: {
          // access: ['paas_admin'],
          hideInMenu: false,
          notCache: true,
          title: '意见反馈管理'
        },
        component: () => import('@/view/systemMGT/feedbackList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '用户管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'ios-contacts',
    },
    component: Main,
    children: [
      {
        name: 'userList',
        path: 'userList',
        icon: 'ios-contacts',
        meta: {
          // access: ['paas_admin'],
          hideInMenu: false,
          notCache: true,
          title: '用户列表'
        },
        component: () => import('@/view/userMGT/userList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '门店管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'logo-foursquare',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'shopList',
        path: 'shopList',
        icon: 'ios-contacts',
        meta: {
          // access: ['paas_admin'],
          hideInMenu: false,
          notCache: true,
          title: '门店列表'
        },
        component: () => import('@/view/shopMGT/shopList.vue')
      },
      {
        name: 'shopRanking',
        path: 'shopRanking',
        icon: 'ios-contacts',
        meta: {
          // access: ['paas_admin'],
          hideInMenu: false,
          notCache: true,
          title: '门店排名'
        },
        component: () => import('@/view/shopMGT/shopRanking.vue')
      }
    ]
  },
  {
    path: '/',
    name: '预约管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'ios-time',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'BookingList',
        path: 'BookingList',
        icon: 'ios-wine',
        meta: {
          // access: ['admin', 'paas_admin'],
          hideInMenu: false,
          notCache: true,
          title: '预约列表'
        },
        component: () => import('@/view/BookingMGT/BookingList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '订单管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'ios-list-box',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'orderList',
        path: 'orderList',
        icon: 'ios-contacts',
        meta: {
          // access: ['admin'],
          hideInMenu: false,
          notCache: true,
          title: '订单列表'
        },
        component: () => import('@/view/orderMGT/orderList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '评价管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'md-star-half',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'evaluateMGT',
        path: 'evaluateMGT',
        icon: 'md-bonfire',
        meta: {
          // access: ['admin'],
          hideInMenu: false,
          notCache: true,
          title: '评价列表'
        },
        component: () => import('@/view/evaluateMGT/evaluateList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '财务管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'logo-yen',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'financeList',
        path: 'financeList',
        icon: 'ios-contacts',
        meta: {
          access: ['admin'],
          hideInMenu: false,
          notCache: true,
          title: '流水系统汇总'
        },
        component: () => import('@/view/financeMGT/financeList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '课程管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'ios-paper',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'courseList',
        path: 'courseList',
        icon: 'ios-rose',
        meta: {
          access: ['admin'],
          hideInMenu: false,
          notCache: true,
          title: '课程列表'
        },
        component: () => import('@/view/courseMGT/courseList.vue')
      },
      {
        name: 'courseClassList',
        path: 'courseClassList',
        icon: 'ios-pricetag',
        meta: {
          access: ['admin'],
          hideInMenu: false,
          notCache: true,
          title: '课程分类列表'
        },
        component: () => import('@/view/courseMGT/courseClassList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '运动轨迹管理',
    meta: {
      access: [],
      notCache: true, hideInMenu: false,
      showAlways: true,
      icon: 'logo-playstation',
    },
    component: routerMap['Main'],
    children: [
      {
        name: 'motionTrailList',
        path: 'motionTrailList',
        icon: 'ios-rose',
        meta: {
          access: ['admin'],
          hideInMenu: false,
          notCache: true,
          title: '运动轨迹列表'
        },
        component: () => import('@/view/motionTrailMGT/motionTrailList.vue')
      }
    ]
  },
  {
    path: '/',
    name: '二级页面',
    meta: {
      icon: 'logo-windows',
      title: 'admin',
      access: [],
      notCache: false,
      hideInMenu: true
    },
    component: routerMap['Main'],
    children: [
      {
        path: 'addAuthorizationUser',
        name: 'addAuthorizationUser',
        meta: {
          title: '新增账号',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/systemMGT/addUser.vue'),
      },
      {
        path: 'addRole',
        name: 'addRole',
        meta: {
          title: '新增角色',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/systemMGT/addRole.vue'),
      },
      {
        path: 'feedbackDetail',
        name: 'feedbackDetail',
        meta: {
          title: '反馈详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/systemMGT/feedbackDetail.vue'),
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        meta: {
          title: '用户详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/userMGT/userDetail.vue'),
      },
      {
        path: 'BookingDetail',
        name: 'BookingDetail',
        meta: {
          title: '预约详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/BookingMGT/BookingDetail.vue'),
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        meta: {
          title: '订单详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/orderMGT/orderDetail.vue'),
      },
      {
        path: 'shopDeduct',
        name: 'shopDeduct',
        meta: {
          title: '门店提成',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/shopMGT/shopDeduct.vue'),
      },
      {
        path: 'editShopDetail',
        name: 'editShopDetail',
        meta: {
          title: '门店详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/shopMGT/editShopDetail.vue'),
      },
      {
        path: 'evaluateDetail',
        name: 'evaluateDetail',
        meta: {
          title: '评价详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/evaluateMGT/evaluateDetail.vue'),
      },
      {
        path: 'courseDetailTeam',
        name: 'courseDetailTeam',
        meta: {
          title: '团课详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/courseMGT/courseDetailTeam.vue'),
      },
      {
        path: 'editCourseDetailTeam',
        name: 'editCourseDetailTeam',
        meta: {
          title: '编辑团课详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/courseMGT/editCourseDetailTeam.vue'),
      },
      {
        path: 'editCourseDetailNetwork',
        name: 'editCourseDetailNetwork',
        meta: {
          title: '编辑网课详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/courseMGT/editCourseDetailNetwork.vue'),
      },
      {
        path: 'courseDetailNetwork',
        name: 'courseDetailNetwork',
        meta: {
          title: '网课详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/courseMGT/courseDetailNetwork.vue'),
      },
      {
        path: 'editCourseDetailExperience',
        name: 'editCourseDetailExperience',
        meta: {
          title: '编辑体验课详情',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/courseMGT/editCourseDetailExperience.vue'),
      },
      {
        path: 'cardVideoDetail',
        name: 'cardVideoDetail',
        meta: {
          title: '打卡视频信息',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/motionTrailMGT/cardVideoDetail.vue'),
      },
      {
        path: 'drillVideoDetail',
        name: 'drillVideoDetail',
        meta: {
          title: '训练视频信息',
          hideInMenu: true,
          notCache: false
        },
        component: () => import('@/view/motionTrailMGT/drillVideoDetail.vue'),
      }
    ]
  }
]





