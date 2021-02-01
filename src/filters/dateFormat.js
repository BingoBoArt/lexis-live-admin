/**
 * @param  {Number} timestr 时间戳
 * @param  {String} pattern    格式化类型
 * @return {String}
 */
export default function dateFormat(timestr, pattern = "YYYY-MM-dd hh:mm:ss") {
  if (!timestr) {
    return "--";
  }
  var d = null;
  if (timestr.constructor == Date) {
    d = timestr;
  } else if (isNaN(timestr)) {
    d = new Date(timestr.replace(/-/gm, "/"));
  } else {
    d = new Date(parseInt(timestr));
  }
  var y = d.getFullYear().toString();
  var o = {
    M: d.getMonth() + 1, //month
    d: d.getDate(), //day
    h: d.getHours(), //hour
    m: d.getMinutes(), //minute
    s: d.getSeconds() //second
  };
  pattern = pattern.replace(/(y+)/gi, function(a, b) {
    return y.substr(4 - Math.min(4, b.length));
  });
  for (var i in o) {
    pattern = pattern.replace(new RegExp("(" + i + "+)", "g"), function(a, b) {
      return o[i] < 10 && b.length > 1 ? "0" + o[i] : o[i];
    });
  }
  return pattern;
}
