import Config from '@/common/config.js'
import {
  Message
} from 'element-ui'
export default {
  /**
   * 判断是否为空对象
   * @param {*} obj
   */
  isEmpty(obj) {
    if (obj == null) {
      return true;
    }
    if (obj.constructor == Array) {
      return obj.length == 0
    }

    if (obj.constructor == Object) {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    }
    return !!obj == false;
  },
  getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  // 跳转到登录页面
  goToLoginPage() {
    const ran = parseInt(Math.random() * 1000);
    location.replace(`/?${ran}#login`)
  },
  /**
   * 格式化日期
   * @method format
   * @static
   * @param {Date} d 日期对象
   * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为"yyyy-MM-dd"
   * @return {string}  返回format后的字符串
   * @example
   var d=new Date();
      alert(format(d," yyyy年M月d日\n yyyy-MM-dd\n MM-dd-yy\n yyyy-MM-dd hh:mm:ss"));
      */
  formatDate(d, pattern) {
    pattern = pattern || 'yyyy-MM-dd';
    var y = d.getFullYear().toString();
    var o = {
      M: d.getMonth() + 1, //month
      d: d.getDate(), //day
      h: d.getHours(), //hour
      m: d.getMinutes(), //minute
      s: d.getSeconds() //second
    };
    pattern = pattern.replace(/(y+)/ig, function (a, b) {
      return y.substr(4 - Math.min(4, b.length));
    });
    for (var i in o) {
      pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), function (a, b) {
        return (o[i] < 10 && b.length > 1) ? '0' + o[i] : o[i];
      });
    }
    return pattern;
  },
  /**
   * 验证数据
   * @param {}} validate_data
   * [{
        data: this.selectItem.lessonNo,
        message: '请选择课件'
      }]
   */
  validate(validate_data) {
    let _validate_data = validate_data;
    if (validate_data.constructor != Array) {
      _validate_data = [validate_data]
    }
    for (let i = 0, len = _validate_data.length; i < len; i++) {
      let item = _validate_data[i];
      if (this.isEmpty(item.data)) {
        Message.error(String(item.message)).showClose = true
        return false;
      }
    }
    return true;
  },
  /**
   * rgb -> #xxxxxx
   */
  changeColorFormate(rgb_color_text) {
    // 修改颜色格式 rgb() => #xxxxxx
    rgb_color_text = rgb_color_text.replace(/rgb\((.*?)\)/mg, function (a, b, c) {
      let all_text = a;
      let rgb_text = b;
      var array = rgb_text.split(",");
      if (array.length > 3) {
        return "";
      }
      let value = "#";
      for (var i = 0, color; color = array[i++];) {
        color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
        value += color.length == 1 ? "0" + color : color;
      }
      value = value.toUpperCase();
      return value;
    })
    return rgb_color_text;
  },
  changeSpaceFormate(text_space) {
    let str = text_space
    let arr = str.match(/<(.*?)>/mg)
    let str2 = str.replace(/<.*?>/mg, "@")
    var str3 = str2.replace(/ /mg, "&nbsp;")
    for (const key in arr) {
      str3 = str3.replace(/@/, arr[key])
    }
    text_space = str3
    return text_space;
  }
}
