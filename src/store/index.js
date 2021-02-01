import vuex from 'vuex';
import createLogger from 'vuex/dist/logger'; // 修改日志

import course from './modules/course'
import user from './modules/user'
import game from './modules/game'
import permission from './modules/permission'

// vue.use(vuex);

const debug = process.env.NODE_ENV !== 'production'; // 开发环境中为true，否则为false

export default new vuex.Store({
  modules: {
    course,
    user,
    game,
    permission
  },
  plugins: debug ? [createLogger()] : [] // 开发环境下显示vuex的状态修改
});
