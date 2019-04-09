const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



//showModalMsg
const showModalMsg = (msg, defaultMsg = '') => {

  if (stringIsEmpty(msg)) {
    msg = defaultMsg
  }
  wx.showModal({
    title: '',
    content: msg,
    showCancel: false,
    cancelText: '',
    cancelColor: '',
    confirmText: '确定',
    confirmColor: showModalColor(),
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}



//showToastMsg
const showToastMsg = (msg, defaultMsg = '') => {

  if (stringIsEmpty(msg)) {
    msg = defaultMsg
  }
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2500,
    mask: true,
  })

}

//---------------String-------------------//
//字符串为空
const stringIsEmpty = str => {
  if (str == null || str == '') {
    return true
  }
  return false
}
//字符串为空
const stringNotEmpty = str => {
  if (str != null && str.length > 0) {
    return true
  }
  return false
}

//如果为空返回默认
const ifEmptyReturn = (str, defaultStr = '') => {
  if (stringNotEmpty(str)) {
    return str
  }

  return defaultStr
}
//获取url 参数
let getQueryString = function(url, name) {
  console.log("url = " + url)
  console.log("name = " + name)
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    console.log("r = " + r)
    console.log("r[2] = " + r[2])
    return r[2]
  }
  return null;
}
//测试环境
const url = 'https://hotelassistant-test.doorconn.com';
//本地
//const url = 'http://192.168.0.18:8080';
//生产环境
//const url = 'https://hotelassistant.doorconn.com'
//图片
//const url = 'http://192.168.0.18:8080';
//生产环境
//const url = 'https://hotelassistant.doorconn.com'
//测试环境
//const imgUrl = 'https://eimg-test.doorconn.com/hotel_assistant/img';
//生产环境
const imgUrl = 'https://eimg.doorconn.com/hotel_assistant/img';

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
};
module.exports = {
  formatTime: formatTime,
  showModalMsg: showModalMsg,
  showToastMsg: showToastMsg,
  //string
  stringIsEmpty: stringIsEmpty,
  stringNotEmpty: stringNotEmpty,
  // ifEmptyReturn: ifEmptyReturn,
  // splitStr: splitStr,
  // sliceStr: sliceStr,
  url: url,
  getQueryString: getQueryString,
  imgUrl: imgUrl,
  throttle: throttle
}