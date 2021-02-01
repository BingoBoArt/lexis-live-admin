var QQV = (rule, value, callback) => {
    // eslint-disable-next-line no-debugger
    if (value === '') {
      callback(new Error('输入QQ号'))
    } else if (/^[1-9][0-9]{4,10}$/.test(value)) {
      callback()
    } else {
      callback(new Error('输入正确的QQ号'))
    }
  }

  //不超过10位数字
  var QQN = (rule, value, callback) => {
    // eslint-disable-next-line no-debugger
    // console.log(58585858, value)
    if (value === '') {
      callback()
    } else if (/^[0-9]{0,10}$/.test(value)) {
      callback()
    } else {
      callback(new Error('不能超过10位的纯数字'))
    }
  }
  // 类似金钱,首位不为0,最多2位小数
  export function checkNumPot2(rule, value, callback) {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    if (!value) {
      return callback(new Error('请填写数字'))
    } else if (!reg.test(value)) {
      return callback(new Error('请填写数字,最多2位小数'))
    } else {
      callback()
    }
  }
  // 身份证
  export function checkIdNum(rule, value, callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!value) {
      return callback(new Error('证件号码不能为空'))
    } else if (!reg.test(value)) {
      return callback(new Error('证件号码不正确'))
    } else {
      callback()
    }
  }
  // 整数
  export function checkInterNum(rule, value, callback) {
    const reg = /^[0-9]*[0-9][0-9]*$/
    if (!value) {
      return callback(new Error('请填写整数'))
    } else if (!reg.test(value)) {
      return callback(new Error('请输入整数'))
    } else {
      callback()
    }
  }
  //纯英文
//   export default onlyEn(rule, value, callback) {

//   }
  export default {
    // eslint-disable-next-line standard/object-curly-even-spacing
    normal: [{ required: true, trigger: 'blur', message: '此项不能为空'}],
    QQ: [{ required: true, validator: QQV, trigger: 'blur' }],
    phone: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }],
    numPot2: [{ required: true, validator: checkNumPot2, trigger: 'blur' }],
    InterNum: [{ required: true, validator: checkInterNum, trigger: 'blur' }],
    checkInterNumLimit: [{ required: true, validator: QQN, trigger: 'blur' }]
  }
