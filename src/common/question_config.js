export default {
  qustion: {
    template1: {
      type: 1,
      text: '单选',
      item: [
          {
          score: 1,
          answer: true,
          answerList: false,
          thumb: '../assets/images/question/question1.png',
          type: 1,
          topic: 1,
          text: 1,
          option_num: 2,
          option_text: 1,
          isChange: 1,
          info: 'q_title+o_text',
          isVoice: 0
        },
        {
          score: 1,
          answer: true,
          answerList: false,
          thumb: '../assets/images/question/question2.png',
          type: 2,
          topic: 1,
          text: 1,
          question_img: 1,
          option_text: 1,
          option_num: 2,
          info: 'q_title+q_img+o_text'
        },
        {
          score: 1,
          answer: true,
          answerList: false,
          thumb: '../assets/images/question/question3.png',
          type: 3,
          topic: 1,
          text: 1,
          option_num: 2,
          option_img: true,
          info: 'q_title+o_img'
        },
        {
          score: 1,
          answer: true,
          answerList: false,
          thumb: '../assets/images/question/question4.png',
          type: 3,
          topic: 1,
          text: 1,
          option_num: 4,
          option_img: true,
          info: 'q_title+o_img'
        },
        {
          // answer: true,
          // answerList: true,
          thumb: '../assets/images/question/question5.png',
          type: 1,
          topic: 1,
          vote: true,
          text: 1,
          info: 'q_title+vote'
        },
        {
          answer: true,
          answerList: false,
          thumb: '../assets/images/question/question7.png',
          type: 7,
          topic: 1,
          text: 1,
          score: 1,
          vote: false,
          info: 'q_title+audio',
          isAudio: 1,
          isChangeAudio: 1,
          option_num: 2,
          option_text: 1,
          isChange: 1,
          Audio_num: 1,
          isVoice: 1,
          isKeyword: 1,
          ansDuration: 1
        },
        {
          thumb: '../assets/images/question/question8.png',
          type: 8,
          topic: 1,
          text: 1,
          score: 1,
          vote: false,
          answerList: true,
          info: 'q_title+audio+img',
          isAudio: 1,
          isChangeAudio: 1,
          option_num: 2,
          option_text: 1,
          isChange: 1,
          Audio_num: 1,
          isVoice: 0,
          isKeyword: 0,
          option_img: false,
          switch: 1,
          ansDuration: 6,
          optionAudio: 1
        }
      ]
    },
    // template2: {
    //   type: 2,
    //   text: 'vote',
    //   item: [{
    //     thumb: '../assets/images/question/question5.png',
    //     type: 1,
    //     info: 'q_title+vote'
    //   }]
    // },
    template4: {
      type: 1,
      text: '单选',
      item: [
        {
          score: 1,
          thumb: '../assets/images/question/question100.png',
          type: 1,
          letter: 1,
          text: 1,
          ansDuration: 6,
          option_num: 1,
          info: 'q_title+o_img'
        }
    ]
    }
  }
}
