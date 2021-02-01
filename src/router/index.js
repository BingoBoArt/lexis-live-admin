// import Vue from 'vue'
import Router from 'vue-router'

// Vue.use(Router)

export const DynamicRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      name: '登录'
    },
    component: require('@/components/login/index')
  },
  {
    path: '/',
    name: '',
    meta: {
      name: ''
    },
    redirect: '/dashboard'
  },
  {
    path: '/401',
    meta: {
      name: '没权限'
    },
    component: () => import('@/components/401'),
    hidden: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: require('@/components/DashboardPage'),
    meta: {
      breadcrumbName: "首页",
      name: '首页'
    },
    children: [
    ]
  }
  // { path: '*', redirect: '/dashboard' }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/401' }
]

export const dynamicRoutes = [
    // {
    //   path: 'EditLevel',
    //   name: 'EditLevel',
    //   component: require('@/components/Level/index.vue'),
    //   meta: {
    //     name: '编辑等级',
    //     breadcrumbName: '编辑等级',
    //     icon: 'icon-library'
    //   }
    // },
    // {
    //   path: 'LevelList',
    //   name: 'LevelList',
    //   component: require('@/components/Level/LevelList.vue'),
    //   meta: {
    //     name: '等级列表',
    //     breadcrumbName: '等级列表',
    //     icon: 'icon-library'
    //   }
    // },
    {
      name: 'Course',
      path: 'Course',
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: '课件管理',
        name: '课件管理',
        icon: 'icon-library'
      },
      children: [
          {
            name: 'List',
            path: 'List',
            component: require('@/components/Course/List'),
            meta: {
              breadcrumbName: "课件列表",
              name: '课件列表',
              icon: 'icon-circle'
            }
          },
          {
            name: 'Edit',
            path: 'Edit',
            component: require('@/components/Course/Edit'),
            meta: {
              breadcrumbName: "添加课件",
              name: '添加课件',
              icon: 'icon-circle'
            }
          },
          {
            name: 'AddLayout',
            path: 'AddLayout',
            component: require('@/components/Course/AddLayout'),
            meta: {
              breadcrumbName: "编辑Layout",
              name: '编辑Layout',
              icon: 'icon-circle'
            }
          },
          {
            name: 'Publish',
            path: 'Publish',
            component: require('@/components/Course/Publish'),
            meta: {
              breadcrumbName: "课件上架",
              name: '课件上架',
              icon: 'icon-circle'
            }
          }
      ]
    },
    /* 新作资源 */
    // resource
    {
      path: 'Resource',
      name: 'Resource',
      redirect: {
        name: 'dashboard'
      },
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: '资源',
        name: '资源',
        icon: 'icon-resource'
      },
      children: [{
          path: 'Image',
          name: 'Image',
          component: require('@/components/Resource/ImageManage'),
          meta: {
            breadcrumbName: '图片',
            name: '图片',
            icon: 'icon-circle'
          }
        },
        {
          path: 'Audio',
          name: 'Audio',
          component: require('@/components/Resource/AudioManage'),
          meta: {
            breadcrumbName: '音频',
            name: '音频',
            icon: 'icon-circle'
          }
        },
        {
          path: 'Video',
          name: 'Video',
          component: require('@/components/Resource/VideoManage'),
          meta: {
            breadcrumbName: '视频',
            name: '视频',
            icon: 'icon-circle'
          }
        }
      ]
    },
    /* Library 资源 */
    {
      path: 'Library',
      name: 'Library',
      redirect: {
        name: "dashboard"
      },
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "Library",
        name: 'Library',
        icon: 'icon-library'
      },
      children: [
        //level等级列表
        {
          name: 'Level',
          path: 'Level',
          component: require('@/components/SubDashboardPage'),
          meta: {
            breadcrumbName: 'Level',
            name: 'Level',
            icon: 'icon-library'
          },
          children: [
            {
              path: 'EditLevel',
              name: 'EditLevel',
              component: require('@/components/Level/index.vue'),
              meta: {
                name: '编辑等级',
                breadcrumbName: '编辑等级',
                icon: 'icon-library'
              }
            },
            {
              path: 'LevelList',
              name: 'LevelList',
              component: require('@/components/Level/LevelList.vue'),
              meta: {
                name: '等级列表',
                breadcrumbName: '等级列表',
                icon: 'icon-library'
              }
            }
          ]
        },
        /** unit */
        {
          name: 'Unit',
          path: 'Unit',
          component: require('@/components/SubDashboardPage'),
          meta: {
            breadcrumbName: 'Unit',
            name: 'Unit',
            icon: 'icon-library'
          },
          children: [{
              path: 'ListUnit',
              name: 'ListUnit',
              component: require('@/components/Library/Unit/List'),
              meta: {
                breadcrumbName: 'Unit列表',
                name: 'Unit列表',
                icon: 'icon-circle'
              }
            },
            {
              path: 'AddUnit',
              name: 'AddUnit',
              component: require('@/components/Library/Unit/Add'),
              meta: {
                breadcrumbName: 'Unit增加',
                name: 'Unit增加',
                icon: 'icon-circle'
              }
            }
          ]
        },
        // block
        {
          name: 'Block',
          path: 'Block',
          component: require('@/components/SubDashboardPage'),
          meta: {
            breadcrumbName: 'Block',
            name: 'Block',
            icon: 'icon-library'
          },
          children: [
            {
              path: 'ListBlock',
              name: 'ListBlock',
              component: require('@/components/Library/Block/BlockList'),
              meta: {
                breadcrumbName: 'Block管理',
                name: 'Block管理',
                icon: 'icon-circle'
              }
            },
            {
              path: 'LessonList',
              name: 'LessonList',
              component: require('@/components/Library/Block/BlockLessonList'),
              meta: {
                breadcrumbName: 'BlockLesson管理',
                name: 'BlockLesson管理',
                icon: 'icon-circle'
              }
            },
            {
              path: 'AddBlock',
              name: 'AddBlock',
              component: require('@/components/Library/Block/BlockAdd'),
              meta: {
                breadcrumbName: 'Block增加',
                name: 'Block增加',
                icon: 'icon-circle'
              }
            },
            {
              path: 'LessonAdd',
              name: 'LessonAdd',
              component: require('@/components/Library/Block/BlockLessonAdd'),
              meta: {
                breadcrumbName: 'BlockLesson增加',
                name: 'BlockLesson增加',
                icon: 'icon-circle'
              }
            }
          ]
        },
        /** config */
        {
          name: 'Config',
          path: 'Config',
          component: require('@/components/SubDashboardPage'),
          meta: {
            breadcrumbName: 'Config',
            name: 'Config',
            icon: 'icon-library'
          },
          children: [{
              path: 'ListConfig',
              name: 'ListConfig',
              component: require('@/components/Library/Config/List'),
              meta: {
                breadcrumbName: 'Config列表',
                name: 'Config列表',
                icon: 'icon-circle'
              }
            },
            {
              path: 'AddConfig',
              name: 'AddConfig',
              component: require('@/components/Library/Config/Add'),
              meta: {
                breadcrumbName: 'Config管理',
                name: 'Config管理',
                icon: 'icon-circle'
              }
            }
          ]
        },
        /** banner管理 */
        {
          name: 'New Banner',
          path: 'Banner',
          component: require('@/components/SubDashboardPage'),
          meta: {
            breadcrumbName: 'New Banner',
            name: 'New Banner',
            icon: 'icon-library'
          },
          children: [{
              path: 'ListBanner',
              name: 'ListBanner',
              component: require('@/components/Library/Banner/List'),
              meta: {
                breadcrumbName: 'Banner列表',
                name: 'Banner列表',
                icon: 'icon-circle'
              }
            },
            {
              path: 'AddBanner',
              name: 'AddBanner',
              component: require('@/components/Library/Banner/Add'),
              meta: {
                breadcrumbName: 'Banner新增',
                name: 'Banner新增',
                icon: 'icon-circle'
              }
            }
          ]
        },
        //game
        {
          name: 'gameRes',
          path: 'gameRes',
          component: require('@/components/Library/Game/GameResPage'),
          meta: {
            breadcrumbName: "游戏管理",
            name: '游戏管理',
            icon: 'icon-circle'
          }
        },
        /* Flashcard */
        {
          name: 'Flashcards/List',
          path: 'Flashcards/List',
          component: require('@/components/Library/Flashcards/List'),
          meta: {
            breadcrumbName: "Flashcard管理",
            name: 'Flashcard管理',
            icon: 'icon-circle'
          }
        },
        {
          name: 'Flashcards/Add',
          path: 'Flashcards/Add',
          component: require('@/components/Library/Flashcards/Add'),
          meta: {
            breadcrumbName: "Flashcard编辑",
            name: 'Flashcard编辑',
            icon: 'icon-circle'
          }
        },
        /* Question */
        // {
        //   path: 'Question',
        //   name: 'Question',
        //   redirect: {
        //     name: "QuestionList"
        //   },
        //   component: require('@/components/SubDashboardPage'),
        //   meta: {
        //     breadcrumbName: "Question",
        //     name: 'Question',
        //     icon: 'icon-library'
        //   },
        //   children: [
        /** question列表 */
        {
          path: 'Question/ListQuestion',
          name: 'Question/ListQuestion',
          component: require('@/components/Library/Question/List'),
          meta: {
            breadcrumbName: "Question列表",
            name: 'Question列表',
            icon: 'icon-circle'
          }
        },
        {
          path: 'Question/AddQuestion',
          name: 'Question/AddQuestion',
          component: require('@/components/Library/Question/Add'),
          meta: {
            breadcrumbName: "Question管理",
            name: 'Question管理',
            icon: 'icon-circle'
          }
        }
        //   ]
        // }
      ]
    },
    /** 约课 */
    {
      name: 'OrderLive',
      path: 'OrderLive',
      redirect: {
        name: 'dashboard'
      },
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "约课",
        name: '约课',
        icon: 'icon-order'
      },
      children: [
        {
          name: 'BatchLesson',
          path: 'BatchLesson',
          component: require('@/components/OrderLive/BatchLesson'),
          meta: {
            breadcrumbName: "批量约课",
            name: '批量约课',
            icon: 'icon-circle'
          }
        },
        {
          name: 'AddLive',
          path: 'AddLive',
          component: require('@/components/OrderLive/Add'),
          meta: {
            breadcrumbName: "创建约课",
            name: '创建约课',
            icon: 'icon-circle'
          }
        },
        {
          name: 'ListLive',
          path: 'ListLive',
          component: require('@/components/OrderLive/List'),
          meta: {
            breadcrumbName: "约课列表",
            name: '约课列表',
            icon: 'icon-circle'
          }
        },
        {
          name: 'CurriculumAdd',
          path: 'CurriculumAdd',
          component: require('@/components/OrderLive/CurriculumAdd'),
          meta: {
            breadcrumbName: "新增时序",
            name: '新增时序',
            icon: 'icon-circle'
          }
        },
        {
          name: 'CurriculumList',
          path: 'CurriculumList',
          component: require('@/components/OrderLive/CurriculumList'),
          meta: {
            breadcrumbName: "时序列表",
            name: '时序列表',
            icon: 'icon-circle'
          }
        }
      ]
    },
/** Example */
    {
      path: 'Example/ListExample',
      name: 'Example/ListExample',
      component: require('@/components/Example/List'),
      meta: {
        name: 'Example/List',
        icon: 'icon-circle'
      }
    },
    {
      path: 'Example/Add',
      name: 'Example/Add',
      component: require('@/components/Example/Add'),
      meta: {
        name: 'Example/Add',
        icon: 'icon-circle'
      }
    },
    /* 录播 */
    {
      name: 'Record',
      path: 'Record',
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "录播",
        name: '录播',
        icon: 'icon-resource'
      },
      children: [
        {
          name: 'Table',
          path: 'Table',
          component: require('@/components/RecordLive/RecordTable'),
          meta: {
            breadcrumbName: "录播课表",
            name: '录播课表',
            icon: 'icon-circle'
          }
        },
        {
          //新加的录播课路由
          name: 'Select',
          path: 'Select',
          component: require('@/components/RecordLive/RecordSelect'),
          meta: {
            breadcrumbName: "选择录播课表",
            name: '选择录播课表',
            icon: 'icon-circle'
          }
        },
        {
          //新加的录播课路由
          name: 'Selected',
          path: 'Selected',
          component: require('@/components/RecordLive/RecordSelected'),
          meta: {
            breadcrumbName: "已选择的录播课表",
            name: '已选择的录播课表',
            icon: 'icon-circle'
          }
        },
        {
          name: 'Live',
          path: 'Live',
          component: require('@/components/RecordLive/RecordLive'),
          meta: {
            breadcrumbName: "录播列表",
            name: '录播列表',
            icon: 'icon-resource'
          }
        }
      ]
    },
    /* monitor */
    {
      name: 'Monitor',
      path: 'monitor',
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "监控",
        name: 'Monitor',
        icon: 'icon-resource'
      },
      children: [{
          name: 'liveInfoList',
          path: 'liveInfoList',
          component: require('@/components/Monitor/LiveInfoList'),
          meta: {
            breadcrumbName: "当天直播列表",
            name: '当天直播列表',
            icon: 'icon-circle'
          }
        },
        // {
        //   name: 'TeachLogList',
        //   path: 'teachLogList',
        //   component: require('@/components/Monitor/TeachLogList'),
        //   meta: {
        //     breadcrumbName: "教师日志表",
        //     name: '教师日志表',
        //     icon: 'icon-circle'
        //   }
        // },
        {
          name: 'teachLogListV2',
          path: 'teachLogListV2',
          component: require('@/components/Monitor/TeachLogListV2'),
          meta: {
            breadcrumbName: "执教日志",
            name: '执教日志',
            icon: 'icon-circle'
          }
        }
      ]
    },
    /* 教师管理 */
    {
      name: 'Teacher',
      path: 'Teacher',
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "教师管理",
        name: '教师管理',
        icon: 'icon-order'
      },
      children: [{
          name: 'ListTeacher',
          path: 'ListTeacher',
          component: require('@/components/Teacher/List'),
          meta: {
            breadcrumbName: "教师列表",
            name: '教师列表',
            icon: 'icon-circle'
          }
        },
        {
          name: 'AddTeacher',
          path: 'AddTeacher',
          component: require('@/components/Teacher/Add'),
          meta: {
            breadcrumbName: "教师编辑",
            name: '教师编辑',
            icon: 'icon-circle'
          }
        }
      ]
    },
    // cdn --预热
    {
      name: 'cdn',
      path: 'cdn',
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "CDN",
        name: 'CDN',
        icon: 'icon-order'
      },
      children: [{
        name: 'preheat',
        path: 'preheat',
        component: require('@/components/CDN/Preheat'),
        meta: {
          breadcrumbName: "预热",
          name: '预热',
          icon: 'icon-circle'
        }
      }]
    },
    // {
    //   name: 'LessonManage',
    //   path: 'Library/Lesson/LessonManage',
    //   component: require('@/components/Library/Lesson/LessonManage'),
    //   meta: {
    //     breadcrumbName: "课件管理",
    //     name: '课件管理',
    //     icon: 'icon-yishitubiaoshuchu-'
    //   }
    // },
    /* 试卷管理 */
    {
      path: 'Issue',
      name: '试卷管理',
      redirect: {
        name: "dashboard"
      },
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "Issue",
        name: '试卷管理',
        icon: 'icon-order'
      },
      children: [
        {
          path: 'ExeQuestion',
          name: 'ExeQuestion',
          component: require('@/components/Issue/ExeQuestion'),
          meta: {
            breadcrumbName: "ExeQuestion列表",
            name: 'ExeQuestion列表',
            icon: 'icon-circle'
          }
        },
        {
          path: 'ExeQuesGroup',
          name: 'ExeQuesGroup',
          component: require('@/components/Issue/ExeQuesGroup'),
          meta: {
            breadcrumbName: "试题组",
            name: '试题组',
            icon: 'icon-circle'
          }
        },
        {
          path: 'ExeGroupList',
          name: 'ExeGroupList',
          component: require('@/components/Issue/ExeGroupList'),
          meta: {
            breadcrumbName: "ExeGroup列表",
            name: '题组列表',
            icon: 'icon-circle'
          }
        },
        {
          path: 'ExeIssueList',
          name: 'ExeIssueList',
          component: require('@/components/Issue/ExeIssueList'),
          meta: {
            breadcrumbName: "ExeIssueList列表",
            name: '试卷列表',
            icon: 'icon-circle'
          }
        },
        {
          path: 'Publish',
          name: 'Publish',
          component: require('@/components/Issue/Publish'),
          meta: {
            breadcrumbName: "Publish",
            name: 'Publish',
            icon: 'icon-circle'
          }
        }
      ]
    },
    /** 校区管理 */
    {
      path: 'School',
      name: 'School',
      redirect: {
        name: "dashboard"
      },
      component: require('@/components/SubDashboardPage'),
      meta: {
        breadcrumbName: "School",
        name: '校区管理',
        icon: 'icon-order'
      },
      children: [
        {
          path: 'ClassDetail',
          name: 'ClassDetail',
          component: require('@/components/School/ClassDetail'),
          meta: {
            breadcrumbName: "班级信息",
            name: '班级信息',
            icon: 'icon-circle'
          }
        },
        {
          path: 'SchoolUserExcel',
          name: 'SchoolUserExcel',
          component: require('@/components/School/SchoolUserExcel'),
          meta: {
            breadcrumbName: "上传用户",
            name: '上传用户',
            icon: 'icon-circle'
          }
        },
        {
          path: 'SchoolUserExcelSearch',
          name: 'SchoolUserExcelSearch',
          component: require('@/components/School/SchoolUserExcelSearch'),
          meta: {
            breadcrumbName: "查询用户",
            name: '查询用户',
            icon: 'icon-circle'
          }
        },
        {
          path: 'SchoolEditor',
          name: 'SchoolEditor',
          component: require('@/components/School/SchoolEditor.vue'),
          meta: {
            name: '编辑校区',
            breadcrumbName: '编辑校区',
            icon: 'icon-circle'
          }
        },
        {
          path: 'SchoolList',
          name: 'SchoolList',
          component: require('@/components/School/SchoolList.vue'),
          meta: {
            name: '校区列表',
            breadcrumbName: '校区列表',
            icon: 'icon-circle'
          }
        },
        {
          path: 'ClassEditor',
          name: 'ClassEditor',
          component: require('@/components/School/ClassEditor.vue'),
          meta: {
            name: '编辑班级',
            breadcrumbName: '编辑班级',
            icon: 'icon-circle'
          }
        },
        {
          path: 'ClassList',
          name: 'ClassList',
          component: require('@/components/School/ClassList.vue'),
          meta: {
            name: '班级列表',
            breadcrumbName: '班级列表',
            icon: 'icon-circle'
          }
        }
      ]
    }
  ]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: DynamicRoutes
})

const router = createRouter()

// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

export default router
