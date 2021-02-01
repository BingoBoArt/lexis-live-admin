// import Request from '@/common/request'
const state = {
  lessonNo: '',
  ruleForm: {
    titleEn: '',
    titleCh: '',
    intro: '',
    lessonNo: '',
    selectLevel: '',
    selectUnit: '',
    selectBlock: '',
    selectLesson: '',
    selectLessonType: ''
  },
  lessonSceneList: [],
  selectItems: [],
  lessonTypes: []
}

// getters
const getters = {
  lessonNo: state => state.lessonNo,
  ruleForm: state => state.ruleForm,
  lessonSceneList: state => state.lessonSceneList,
  selectItems: state => state.selectItems,
  lessonTypes: state => state.lessonTypes
}

// actions
const actions = {
}

// mutations
const mutations = {
  setRuleForm(state, _ruleForm) {
      state.ruleForm = {
          ...state.ruleForm,
          ..._ruleForm
      }
  },
  setLessonNo(state, _lessonNo) {
      state.lessonNo = _lessonNo
  },
  setLessonSceneList(state, _lessonSceneList) {
      state.lessonSceneList = _lessonSceneList;
  },
  setSelectItems(state, _selectItems) {
      state.selectItems = _selectItems;
  },
  setLessonTypes(state, _lessonTypes) {
      state.lessonTypes = _lessonTypes;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
