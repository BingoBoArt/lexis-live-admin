import Config from '@/common/config.js';
const resAdminHost = {
    'dev': 'http://123.56.221.25:8360/index', //资源管理后台ip
    'test': 'http://123.56.221.25:8360/index',
    'pro': 'http://101.201.35.176:8360/index'
}
const staticResHost = {
    'dev': 'http://123.56.221.25:8002', //游戏端口
    'test': 'http://123.56.221.25:8002',
    'pro': 'http://101.201.35.176:8013'
}
const socketHost = {
  'dev': 'http://123.56.221.25:8010', // 房间服务器地址
  'test': 'http://123.56.221.25:8010',
  'pro': 'http://pomelo.lexislive.com.cn'
}
export default {
    resAdminHost: resAdminHost[Config.global_env],
    staticResHost: staticResHost[Config.global_env],
    socketHost: socketHost[Config.global_env]
}