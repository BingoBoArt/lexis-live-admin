export default {
  // 80001
  guess: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题",
        default: 'Listen and choose'
      }
    ],
    question: [
      {
        type: 'title',
        label: "题目信息(title)(必填)"
      },
      {
        type: 'score',
        label: "分值"
      }
    ],
    option: {
      type: 'image',
      canAddOrReduceOption: true
    }
  },
  // 100001
  yesOrNo: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题",
        default: 'Is it a match ?'
      }
    ],
    question: [
      {
          type: 'title',
          label: "题目信息(title)(必填)"
      },
      {
          dataKey: 'img',
          type: 'image',
          label: "图片一(choice1)"
      }, {
          dataKey: 'img2',
          type: 'image',
          label: "图片二(choice2)"
      },
      {
        type: 'score',
        label: "分值"
      },
    ],
    option: {
      type: 'text'
    }
  },
  // 90001
  pickOut: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题",
        default: "What's in the box?"
      }
    ],
    question: [
      {
        type: 'title',
        label: "题目信息(title)(必填)"
      },
      {
        type: 'score',
        label: "分值"
      },
    ],
    option: {
      type: 'image',
      canAddOrReduceOption: false,
    }
  },
  fillBlank: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题"
      }
    ],
    question: [
      {
        type: 'image',
        dataKey: 'img1',
        label: "题目图片"
      },
      {
        type: 'title',
        dataKey: 'question_title',
        label: "题目标题(副标题)"
      },
      {
        type: 'score',
        label: "分值"
      },
      {
        type: 'select',
        dataKey: 'isLetter',
        label: "是否去除##间空格",
        options: [
          {
            label: "否",
            value: 0
          },
          {
            label: "是",
            value: 1
          }
        ]
      },
      {
        type: 'title',
        dataKey: "title",
        label: "题目信息(title)"
      },
      {
        type: 'title',
        dataKey: "answerTitle",
        label: "结果页显示文案",
        readOnly: true
      }
    ],
    option: {
      canAddOrReduceOption: true,
      type: 'text',
      dataKey: 'info',
      showRightOption: true,
    }
  },
  direction: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题"
      }
    ],
    question: [
      {
        type: 'score',
        label: "分值"
      },
      {
        type: 'title',
        dataKey: 'question_title',
        label: "题目标题(副标题)"
      }
    ],
    option: {
      type: 'image',
      dataKey: 'img'
    }
  },
  slide: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题"
      }
    ],
    question: [
      {
        type: 'title',
        dataKey: "question_title",
        label: "题目标题(副标题)"
      },
      {
        type: 'image',
        dataKey: 'img1',
        label: "题目图片"
      },
      {
        type: 'score',
        label: "分值"
      },
      {
        type: 'title',
        dataKey: "title",
        label: "题干信息(必填)"
      },
      {
        type: 'rightAnswer',
        dataKey: "rightAnswer",
        label: "正确答案(rightAnswer)"
      }
    ]
  },
  wordBox: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题"
      }
    ],
    question: [
      {
        type: 'title',
        dataKey: "title",
        label: "题目标题(副标题)"
      },
      {
        type: 'number',
        dataKey: "countdown",
        label: "倒计时"
      },
      {
        type: 'title',
        dataKey: "question",
        label: "题干信息(必填)"
      },
      {
        type: 'title',
        dataKey: "result",
        label: "正确答案文字提示(必填)"
      },
      {
        type: 'image',
        dataKey: "imgRight",
        label: "正确图片"
      },
    ],
    option: {
      type: 'text',
      dataKey: 'word',
      rightKey: 'right'
    }
  },
  slot: {
    main: [
      {
        type: 'title',
        dataKey: 'title',
        label: "游戏主标题"
      },
      {
        type: 'select',
        dataKey: 'no_answer',
        label: "是否无需答题",
        options: [
          {
            label: "需要答题",
            value: 0
          },
          {
            label: "无需答题",
            value: 1
          }
        ]
      }
    ],
    question: [
      {
        type: 'title',
        dataKey: "question_title",
        label: "题目标题(副标题)"
      },
      {
        type: 'number',
        dataKey: "countdown",
        label: "倒计时"
      },
      {
        type: 'score',
        label: "分值"
      }
    ],
    option_list: [
      {
        type: 'text_image',
        textKey: 'word',
        imageKey: 'img',
        rightKey: 'right',
        canAddOrReduceOption: true,
        optionKey: "slot_left",
        label: '老虎机左侧(图片优先)'
      },
      {
        type: 'text_image',
        textKey: 'word',
        imageKey: 'img',
        rightKey: 'right',
        canAddOrReduceOption: true,
        optionKey: "slot_right",
        label: '老虎机右侧(图片优先)'
      },
      {
        type: 'text_image',
        textKey: 'word',
        imageKey: 'img',
        rightKey: 'right',
        optionKey: 'answer',
        label: "选项(图片优先)"
      }
    ]
  },
  halfTime: {
    main: [
        {
          type: 'title',
          dataKey: 'title',
          label: "游戏主标题",
          default: 'halfTime'
        },
        {
          type: 'tips',
          dataKey: "tips",
          label: "首行文本"
        },
        {
          type: 'part',
          dataKey: "part",
          label: "第二行文本"
        },
        {
          type: 'total_time',
          dataKey: "total_time",
          label: "倒计时时间"
        }
    ],
    question: [
      {
        type: 'image',
        dataKey: 'img',
        label: "背景图片"
      }
    ]
  }
}