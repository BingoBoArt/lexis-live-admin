export default {
  global_env: "dev",
  token_key: 'token',
  //游戏以及对应title
  /*
  gameInfo: {
    'yesOrNo': 'Is it a macth?',
    'pickOut': 'What is in the box?',
    'guess': 'Listen and choose.',
    'fillBlank': 'Word scramble',
    'slide': 'Word snake',
    'direction': 'Where is it?'
  },
  */
  gameInfo: {
    'pickOut': 'Game1',
    'guess': 'Game2',
    'yesOrNo': 'Game3',
    'fillBlank': 'Game4',
    'direction': 'Game5',
    'slide': 'Game6',
    'wordBox': 'Game7',
    'slot': 'Game8',
    'halfTime': 'Game9'
  },
  // 客户端游戏封面
  gameCovers: {
    'pickOut': 'http://file.lexislive.com.cn/resource/201901/a8ce89aa-27f7-4b5c-a868-b64efb34a5cf.jpg', // 客户端游戏封面
    'guess': 'http://file.lexislive.com.cn/resource/201901/197a3c22-dfa6-4d7d-ab14-bf75d07da45e.jpg', // 客户端游戏封面
    'yesOrNo': 'http://file.lexislive.com.cn/resource/201901/4cc3a5eb-9589-4900-b265-700921273a57.jpg', // 客户端游戏封面
    'fillBlank': 'http://file.lexislive.com.cn/resource/201901/1b016072-8350-459d-a958-51d37be92f1f.jpg', // 客户端游戏封面
    'direction': 'http://file.lexislive.com.cn/resource/201901/609fe57f-2caa-4894-8196-3372f9bd9139.jpg', // 客户端游戏封面
    'slide': 'http://file.lexislive.com.cn/resource/201901/c43d7919-fa96-4b16-ac7f-60380c9c9f5d.jpg', // 客户端游戏封面
    'wordBox': 'http://file.lexislive.com.cn/resource/201901/e7e7e690-0f58-4f77-b012-df6c7683c74b.jpg', // 客户端游戏封面
    'slot': 'http://file.lexislive.com.cn/resource/201901/33a070cf-12a2-434c-894c-903adc39d543.jpg', // 客户端游戏封面
    'halfTime': 'http://file.lexislive.com.cn/resource/201901/ec0a98af-54d1-429e-82cf-d02cc5b70c62.jpg' // 客户端游戏封面
  },
  // 课程创建layout
  course_layout: {
    layout1: {
      thumb: '../assets/images/layout/layout1.png',
      templates: [{
          thumb: '../assets/images/layout/layout1-1.png',
          story_title: 1,
          story_text: 1,
          story_flashcard: 1,
          note: 1,
          info: 'title+text+flashcard',
          type: 1
        },
        {
          thumb: '../assets/images/layout/layout1-2.png',
          flashcard: 1,
          note: 1,
          info: 'flashcard',
          type: 3
        },
        {
          thumb: '../assets/images/layout/layout1-3.png',
          note: 1,
          wordbank: 1,
          wordbank_title: 1,
          info: 'wordbank',
          type: 8
        },
        {
          thumb: '../assets/images/layout/layout1-4.png',
          note: 1,
          wordbank: 1,
          wordbank_pic: 1,
          wordbank_title: 1,
          info: 'wordbank+pic',
          type: 8
        },
        {
          thumb: '../assets/images/layout/layout1-5.png',
          story_text: 1,
          story_image: 1,
          story_flashcard: 1,
          note: 1,
          info: 'text+image+flashcard',
          type: 1
        },
        {
          thumb: '../assets/images/layout/layout1-6.png',
          story_title: 1,
          story_text: 1,
          story_image: 1,
          note: 1,
          info: 'title+text+image',
          type: 1
        }
      ]
    },
    layout2: {
      thumb: '../assets/images/layout/layout2.png',
      templates: [{
          thumb: '../assets/images/layout/layout2-1.png',
          story_title: 1,
          zoom: 1,
          zoom_image: 1,
          note: 1,
          info: 'zoomIn',
          type: 1
        },
        {
          thumb: '../assets/images/layout/layout2-2.png',
          video_image: 1, // 视频封面
          video: 1,
          note: 1,
          info: 'video',
          type: 7
        },
        {
          thumb: '../assets/images/layout/layout2-3.png',
          audio_title: 1,
          audio_image: 1, // 音频封面
          audio: 1,
          note: 1,
          info: 'audio',
          type: 13
        },
        {
          thumb: '../assets/images/layout/layout2-4.png',
          multi_audio_title: 1,
          note: 1,
          multiAudio: 1,
          multi_audio_group: 1, // 多音频
          info: 'multiAudioTitle',
          type: 14
        },
        {
          thumb: '../assets/images/layout/layout2-5.png',
          multi_image_title: 1,
          note: 1,
          multi_image_group: 1,
          info: 'multiImageTitle',
          type: 15
        },
        {
          thumb: '../assets/images/layout/layout2-6.png',
          pop_title: 1,
          question_select: ['1-8'],
          pop_question_group: 1,
          note: 1,
          isChange: 1,
          info: 'multiPopQuestion',
          type: 16
        },
        {
          thumb: '../assets/images/layout/layout2-7.png',
          type: 4,
          question: 1,
          question_select: ['4-1'], //图音组合时选择对应添加的模版
          note: 1, //备注
          isChange: 1,
          info: 'writeGameQuestion'
        }
      ]
    },
    layout3: {
      thumb: '../assets/images/layout/layout3.png',
      templates: [{
          thumb: '../assets/images/layout/layout3-1.png',
          story_title: 1,
          story_image: 1,
          story_text: 1,
          question: 1,
          note: 1,
          info: 'q_text+o_text',
          type: 100, // story和question标签
          question_type: '1-1',
          question_select: ['1-1', '1-7']
        },
        {
          thumb: '../assets/images/layout/layout3-2.png',
          story_title: 1,
          story_text: 1,
          question: 1,
          note: 1,
          info: 'q_text+o_text',
          type: 100, // story和question标签
          question_type: '1-1',
          question_select: ['1-1', '1-7']
        },
        {
          thumb: '../assets/images/layout/layout3-3.png',
          story_text: 1,
          // audio_image: 1, // 音频封面
          story_image: 1,
          audio: 1,
          note: 1,
          info: 'audio',
          type: 104
        }
      ]
    },
    layout5: {
      thumb: '../assets/images/layout/layout5.png',
      templates: [{
          thumb: '../assets/images/layout/layout5-6.png',
          note: 1,
          info: 'rank_page',
          type: 12
        },
        {
          thumb: '../assets/images/layout/layout5-1.png',
          note: 1,
          question: 1,
          info: 'q_text+o_text',
          type: 4,
          question_type: '1-1',
          question_select: ['1-1', '1-7']
        },
        {
          thumb: '../assets/images/layout/layout5-2.png',
          question: 1,
          note: 1,
          info: 'q_img+o_text',
          type: 4,
          question_type: "1-2",
          question_select: ["1-2"]
        },
        {
          thumb: '../assets/images/layout/layout5-3.png',
          note: 1,
          question: 1,
          info: 'q_text+o_img',
          type: 4,
          question_type: "1-3",
          question_select: ["1-3"],
          question_option_count: 2 // 选项2个，type: 1-3
        },
        {
          thumb: '../assets/images/layout/layout5-4.png',
          note: 1,
          question: 1,
          info: 'q_text+o_img',
          type: 4,
          question_type: "1-3",
          question_select: ["1-3"],
          question_option_count: 4 // 选项4个，type: 1-3
        },
        {
          thumb: '../assets/images/layout/layout5-5.png',
          note: 1,
          question: 1,
          mold: 2,
          vote: 1,
          info: 'vote',
          type: 10, // vote type对应10
          question_type: "1-1",
          question_select: ["1-1"],
          question_mold: 2 // 2 为vote
        }
      ]
    },
    layoutH5: {
      thumb: '../assets/images/layout/layoutH5.png',
      templates: [{
          thumb: '../assets/images/layout/layoutH5-1.png',
          game: 1,
          note: 1,
          gameType: 'guess',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-2.png',
          game: 1,
          note: 1,
          gameType: 'pickOut',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-3.png',
          game: 1,
          note: 1,
          gameType: 'yesOrNo',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-4.png',
          game: 1,
          note: 1,
          gameType: 'direction',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-5.png',
          game: 1,
          note: 1,
          gameType: 'fillBlank',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-6.png',
          game: 1,
          note: 1,
          gameType: 'slide',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-7.png',
          game: 1,
          note: 1,
          gameType: 'wordBox',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-8.png',
          game: 1,
          note: 1,
          gameType: 'slot',
          type: '6'
        },
        {
          thumb: '../assets/images/layout/layoutH5-9.jpg',
          game: 1,
          note: 1,
          gameType: 'halfTime',
          type: '6'
        }
      ]
    }
  }
}
