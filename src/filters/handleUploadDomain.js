/**
 * @param  {Number} path 请求路径 /xxx/xxx/xxx
 * @return {String}
 */
import Api from '@/common/api.js'
export default function handleUploadDomain(path) {
    return Api.domain + path
}
