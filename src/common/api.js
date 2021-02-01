import Config from '@/common/config.js';

let domain = Config.global_env == "dev" ? "/jidaadm" : "/jidaadm"

const api = {
    domain: domain
};
export default api
