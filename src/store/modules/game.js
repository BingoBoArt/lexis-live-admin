import * as types from './mutation-type.js';
import Config from '@/common/config.js'
import Request from "@/common/request.js"
import host from "@/common/host.js";

const state = {
  gameRes: {
    dataJson: { // 对应游戏中data_json结构
      main: {},
      halftime: {},
      question_list: []
    },
    allGameList: [], // [ { "gameType": "pickOut", "gameId": "90001" }, { "gameType": "pickOut", "gameId": "90002" }]
    tableLoading: false
  }
}

// getters
const getters = {
  allGameList: state => {
    return state.gameRes.allGameList
  },
  dataJson: state => {
    return state.gameRes.dataJson
  },
  tableLoading: state => {
    return state.gameRes.tableLoading
  },
  questionList: state => {
    return state.gameRes.dataJson.question_list;
  },
  allGameType: state => {
    let gameTypeList = [];
    state.gameRes.allGameList.forEach(element => {
      if (gameTypeList.indexOf(element.gameType) == -1) {
        gameTypeList.push(element.gameType)
      }
    });
    gameTypeList = gameTypeList.map(ele => {
      return {
        value: ele,
        label: Config.gameInfo[ele]
      }
    })
    return gameTypeList
  },
  allGameId: state => {
    let gameIdList = [];
    state.gameRes.allGameList.forEach(element => {
      if (gameIdList.indexOf(element.gameId) == -1) {
        gameIdList.push(element.gameId)
      }
    });
    return gameIdList
  }
}

// actions
const actions = {
  async getAllGameList({
    commit
  }, params) {
    Request({
      type: "get",
      url: `${host.resAdminHost}/gamePoolList`,
      data: {
        kind: 'liveClass'
      }
    }).then(res => {
      commit(types.GET_ALL_GAME_LIST, res.data.gameList)
    }).catch(err => {
      console.log('err: ', err);
    })
  },
  async getGameInfo({
    commit,
    dispatch
  }, params) {
    commit(types.TOGGLE_LOADING, true)
    await Request({
      type: "post",
      url: `${host.resAdminHost}/liveGameQuestionInfo`,
      data: {
        gameType: params.gameType,
        gameId: params.gameId
      }
    }).then(res => {
      // console.log('res: ', res);
      // let answerJsonCount = res.data.dataJson.question_list.length && res.data.dataJson.question_list[0].answer.length || 0
      // console.log('answerJsonCount: ', answerJsonCount);
      // let hasTitleImg = res.data.dataJson.question_list[0].img2;
      //兼容两个或三个选项的情况
      commit(types.UPD_GAME_RES_TABLE, {
        jsonData: res.data.dataJson
      })
    })
    // commit(types.TOGGLE_LOADING, false)
  },
  toggleLoading({
    commit,
    state
  }, params) {
    commit(types.TOGGLE_LOADING, params)
  },
  updateDataJson({
    commit,
    state
  }, params) {
    commit(types.GET_DATA_JSON, params)
  },
  updateQuestionSort({
    commit,
    state
  }, params) {
    commit(types.UPDATE_QUESTION_SORT, params)
  },
  addQuestion({
    commit,
    state
  }, params) {
    commit(types.ADD_QUESTION)
  }
}

// mutations
const mutations = {
  [types.GET_DATA_JSON](state, obj) {
    state.gameRes.dataJSON = obj
  },
  [types.GET_ALL_GAME_LIST](state, params) {
    state.gameRes.allGameList = params
  },
  [types.TOGGLE_LOADING](state, params) {
    state.gameRes.tableLoading = params
  },
  [types.UPDATE_QUESTION_SORT](state, params) {
    let list = [];
    params.map((item, index) => {
      item.id = index + 1
      list.push(item)
    })
    state.gameRes.dataJson.question_list = params
  },
  [types.ADD_QUESTION](state) {
      // let item = { ...state.gameRes.dataJson.question_list[0] };
      // item.id = state.gameRes.dataJSON.question_list.length + 1,
      let item = JSON.parse(JSON.stringify(state.gameRes.dataJson.question_list[0]))
      item.id = state.gameRes.dataJson.question_list.length + 1
      state.gameRes.dataJson.question_list.push(item);
  },
  [types.UPD_GAME_RES_TABLE](state, {
    jsonData
  }) {
    let data = { ...state.gameRes.dataJson
    }
    data.question_list = jsonData.question_list || [];
    data.main = jsonData.main || {};
    data.halftime = jsonData.halftime || {};
    state.gameRes.dataJson = { ...data
    };
  },
  [types.UPD_GAME_RES_JSON](state, {
    jsonData
  }) {
    state.gameRes.dataJson.question_list = jsonData.question_list;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
