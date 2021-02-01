export default {
  "code": "0000",
  "data": {
      "roles": [
          "admin"
      ],
      "access_control": {
          "menuList": [
                 /* Issue */
                {
                  name: '试卷管理',
                  childList: [
                    {
                      name: 'ExeQuestion列表'
                    },
                    {
                      name: '试题组'
                    },
                    {
                      name: '题组列表'
                    },
                    {
                      name: '试卷列表'
                    },
                    {
                      name: 'Publish'
                    }
                  ]
                },
                /** 校区管理 */
                {
                  name: '校区管理',
                  childList: [
                    {
                      name: '班级信息'
                    },
                    {
                      name: '上传用户'
                    },
                    {
                      name: '查询用户'
                    },
                    {
                      name: '编辑校区'
                    },
                    {
                      name: '校区列表'
                    },
                    {
                      name: '编辑班级'
                    },
                    {
                      name: '班级列表'
                    }
                  ]
                },
              /* 新作资源 */
                // resource
                {
                  name: '资源',
                  childList: [{
                      name: '图片'
                    },
                    {
                      name: '视频'
                    },
                    {
                      name: '音频'
                    }
                  ]
                },
              /** 约课 */
                {
                  name: '约课',
                  childList: [
                    {
                      name: '批量约课'
                    },
                    {
                      name: '创建约课'
                    },
                    {
                      name: '约课列表'
                    },
                    {
                      name: '新增时序'
                    },
                    {
                      name: '时序列表'
                    }
                  ]
                },
                /* 录播 */
                {
                  name: '录播',
                  childList: [
                    {
                      name: '录播课表'
                    },
                    {
                      //新加的录播课路由
                      name: '选择录播课表'
                    },
                    {
                      name: '录播列表'
                    },
                    {
                      //新加的录播课路由
                      name: '已选择的录播课表'
                    }
                  ]
                },
                /** monitor */
                {
                  name: 'Monitor',
                  childList: [{
                      name: '当天直播列表'
                    },
                    {
                      name: '执教日志'
                    }
                  ]
                },
                /* 教师管理 */
                {
                  name: '教师管理',
                  childList: [{
                      name: '教师列表'
                    },
                    {
                      name: '教师编辑'
                    }
                  ]
                },
                /* Library 资源 */
                {
                  name: 'Library',
                  childList: [
                    {
                      name: 'Unit',
                      childList: [{
                          name: 'Unit列表'
                        },
                        {
                          name: 'Unit增加'
                        }
                      ]
                    },
                    {
                      name: 'Level',
                      childList: [
                        {
                          name: '编辑等级'
                        },
                        {
                          name: '等级列表'
                        }
                      ]
                    },
                    // block
                    {
                      name: 'Block',
                      childList: [
                        {
                          name: 'Block管理'
                        },
                        {
                          name: 'Block增加'
                        },
                        {
                          name: 'BlockLesson管理'
                        },
                        {
                          name: 'BlockLesson增加'
                        }
                      ]
                    },
                    {
                      name: 'Config',
                      childList: [{
                          name: 'Config列表'
                        },
                        {
                          name: 'Config管理'
                        }
                      ]
                    },
                    {
                      name: 'New Banner',
                      childList: [{
                          name: 'Banner列表'
                        },
                        {
                          name: 'Banner新增'
                        }
                      ]
                    },
                    //game
                    {
                      name: '游戏管理'
                    },
                    /* Flashcard */
                    {
                      name: 'Flashcard管理'
                    },
                    {
                      name: 'Flashcard编辑'
                    },
                    {
                      name: 'Question列表'
                    },
                    {
                      name: 'Question管理'
                    }
                  ]
                },
                 /**编辑等级 */
                // {
                //   name: '编辑等级'
                // },
                // {
                //   name: '等级列表'
                // },
                {
                  name: '课件管理',
                  childList: [
                      {
                        name: '课件列表'
                      },
                      {
                        name: '添加课件'
                      },
                      {
                        name: '编辑Layout'
                      },
                      {
                        name: '课件上架'
                      }
                  ]
                }
          ],
          "permissions": [
              {
                  "isBtn": 1,
                  "permissionNo": "flashcard_add"
              },
              {
                  "isBtn": 1,
                  "permissionNo": "flashcard_edit"
              },
              {
                  "isBtn": 1,
                  "permissionNo": "lesson_edit"
              },
              {
                  "isBtn": 1,
                  "permissionNo": "lesson_publish"
              },
              {
                  "isBtn": 1,
                  "permissionNo": "lesson_on_shelf"
              }
          ]
      }
  },
  "msg": "OK"
}
