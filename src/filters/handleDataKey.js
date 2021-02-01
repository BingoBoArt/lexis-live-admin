/**
 * 处理namespace
 * 如：data = {a: {b: 1}}
 * handleDataKey(data, "a.b")
 */
export default function handleDataKey(data, key) {
    let keys = key.split(".");
    let data_value = data;
    for(var i=0,len=keys.length; i<len; i++){
      data_value = data_value[keys[i]]
    }
    return data_value
}
