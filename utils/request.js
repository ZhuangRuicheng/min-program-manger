//判断字符串是否为空
const stringNotEmpty = str => {
  if (str != null && str.length > 0) {
    return true
  }
  return false
}

const stringIsEmpty = str => {
  if (str == null || str == '') {
    return true
  }
  return false
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
    // confirmColor: showModalColor(),
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
    duration: 2000,
    mask: true,
  })

}

//showModalMsg
const showModalMsgs = (showNodalMsg) => {

  wx.showModal({
    title: '',
    content: showNodalMsg,
    showCancel: false,
    confirmText: '确定',
  })
}
//request 封装

const Request = (method, showLoadingText, url, params, successData, failData, showModalMsg = true) => {
  var authenticat = wx.getStorageSync("authenticat")
  wx.showLoading({
    title: showLoadingText,
    mask: true,
  })
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json',
      'Token': authenticat
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      wx.hideLoading()
      if (res.statusCode == 200) {
        console.log(res)
        successData(res)
      } else if (res.statusCode == 404) {
        showModalMsgs("请求资源不存在")
      } else if (res.statusCode == 502) {
        showModalMsgs("服务器正在维护")
      } else {
        showModalMsgs("请求失败，请检查您的网络")
      }

    },
    fail: function(res) {
      wx.hideLoading()
      failData(res)
      var showModalMsg = '请求失败，请检查网络'
      if (res.statusCode == 404) {
        showModalMsg = '请求资源不存在'
      }
      showModalMsgs(showModalMsg)
    },
    complete: function(res) {},
  })
}

//迷你吧request封装
const storeRequest = (method, showLoadingText, url, params, successData, failData, showModalMsg = true) => {
  var authenticat = wx.getStorageSync("authenticat")
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json',
      'Token': authenticat
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      if (res.statusCode == 200) {
        console.log(res)
        successData(res)
      } else if (res.statusCode == 404) {
        showModalMsgs("请求资源不存在")
      } else if (res.statusCode == 502) {
        showModalMsgs("服务器正在维护")
      } else {
        showModalMsgs("请求失败，请检查您的网络")
      }

    },
    fail: function(res) {
      failData(res)
      var showModalMsg = '请求失败，请检查网络'
      if (res.statusCode == 404) {
        showModalMsg = '请求资源不存在'
      }
      showModalMsgs(showModalMsg)
    },
    complete: function(res) {},
  })
}

//客控request请求封装
const controlRequest = (method, url, params, successData, failData, showModalMsg = true) => {
  var authenticat = wx.getStorageSync("authenticat")
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json',
      'Token': authenticat
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      if (res.statusCode == 200) {
        console.log(res)
        successData(res)
      } else if (res.statusCode == 404) {
        showModalMsgs("请求资源不存在")
      } else if (res.statusCode == 502) {
        showModalMsgs("服务器正在维修")
      } else {
        showModalMsgs("请求失败，请检查您的网络")
      }

    },
    fail: function(res) {
      failData(res)
      var showModalMsg = '请求失败，请检查网络'
      if (res.statusCode == 404) {
        showModalMsg = '请求资源不存在'
      }
      showModalMsgs(showModalMsg)
    },
  })
}

//根据订单id获取订单详情方法封装
const orderDetails = (code, authenticat, that, url, success, fail, loadingText, ) => {
  wx.request({
    url: url,
    data: {
      "orderId": code,
    },
    header: {
      'content-type': 'application/json',
      'Token': authenticat
    },
    method: 'GET',
    success: function(res) {
      console.log(res)
      if (stringNotEmpty(loadingText)) {
        wx.hideLoading()
      }

      success(res)

      switch (res.data.data.orderDetail.status) {
        case "SUBMIT":
          that.setData({
            color: "#3cb639",
            status: res.data.data.orderDetail.status
          })

          break;
        case "ACCEPT":
          that.setData({
            acceptColor: "#3cb639",
            status: res.data.data.orderDetail.status
          })
          break;
        case "FINISH":
          that.setData({
            finishColor: "#3cb639",
            status: res.data.data.orderDetail.status
          })
          break;
      }

      switch (res.data.data.orderDetail.customerEvaluate) {
        case 'SATISFIED':
          that.setData({
            satisfiedImg: '../../img/satisfied.png',
            NotSatisfiedShow: false
          })
          break;
        case 'DISSATISFIED':
          that.setData({
            NotSatisfiedImg: '../../img/NotSatisfiedImg_s.png',
            satisfiedShow: false
          })
          break;
      }

    },
    fail: function(res) {
      if (stringNotEmpty(loadingText)) {
        wx.hideLoading()
      }

      res.err = 'network'
      fail(res)

      var errMsg = '请求失败，请检查网络'
      if (res.statusCode == 404) {
        errMsg = '请求资源不存在'
      }
      showModalMsg(errMsg)
    },
    complete: function(res) {},
  })

};

//打赏函数封装
const reward = (urlOrderNo, unifiedOrder, money, rewardSuccess, authenticat, that, util, orderId) => {
  wx.request({
    url: urlOrderNo,
    data: {
      "money": money,
      'orderId': orderId
    },
    header: {
      'content-type': 'application/json',
      'Token': authenticat
    },
    method: 'POST',
    success: function(res) {
      console.log(res)
      if (res.data.code == 0) {
        var orderNo = res.data.data.tradeNo;
        wx.request({
          url: unifiedOrder,
          data: {
            tradeNo: orderNo,
          },
          header: {
            'content-type': 'application/json',
            'Token': authenticat
          },
          method: 'POST',
          success: function(res) {
            console.log(res)
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.packageValue,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              success: function(res) {
                setTimeout(function() {
                  util.showToastMsg('已收到打赏￥' + money + ",谢谢您的鼓励！");
                }, 1500)
                rewardSuccess(res)
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
    },
    fail: function(res) {},
    complete: function(res) {},
  })
};
//首页打赏函数封装
const indexReward = (urlOrderNo, unifiedOrder, money, rewardSuccess, authenticat, that, util, orderId) => {
  wx.request({
    url: urlOrderNo,
    data: {
      "money": money,
      'orderId': orderId,
      'hotelId': wx.getStorageSync("HotelId")
    },
    header: {
      'content-type': 'application/json',
      'Token': authenticat
    },
    method: 'POST',
    success: function(res) {
      console.log(res)
      if (res.data.code == 0) {
        var orderNo = res.data.data.tradeNo;
        wx.request({
          url: unifiedOrder,
          data: {
            tradeNo: orderNo,
          },
          header: {
            'content-type': 'application/json',
            'Token': authenticat
          },
          method: 'POST',
          success: function(res) {
            console.log(res)
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.packageValue,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              success: function(res) {
                setTimeout(function() {
                  util.showToastMsg('已收到打赏￥' + money + ",谢谢您的鼓励！");
                }, 1500)
                rewardSuccess(res)
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
    },
    fail: function(res) {},
    complete: function(res) {},
  })
};

//评价请求函数封装
const customerEvaluate = (url, orderId, SATISFIED, authenticat, succes, that, util) => {
  wx.request({
    url: url,
    data: {
      "orderId": orderId,
      "evaluate": SATISFIED
    },
    header: {
      'content-type': 'application/json',
      'Token': authenticat
    },
    method: 'POST',
    success: function(res) {
      console.log(res)
      succes(res);

      util.showToastMsg('感谢您对我们的服务进行评价')
    },
    fail: function(res) {},
    complete: function(res) {},
  })
};

//微信登录函数封装
const wechatLogin = (util, Interface, request,that) => {
  wx.login({
    success: function(res) {
      var url = util.url + Interface.wechatLogin;
      var params = {
        "code": res.code,
      };
      var successData = function(res) {
        if(res.data.code == 0){
          wx.setStorageSync("authenticat", res.data.data.loginToken);
          if (!res.data.data.hasWxInfo){
            that.setData({
              hasWeiXinInfo: res.data.data.hasWxInfo,
              hasWxPhone: res.data.data.hasWxPhone,
              authenticat: res.data.data.loginToken,
              getUseInfo:true
            })
          } else {
            if (!res.data.data.hasWxPhone) {
              that.setData({
                getPhoneInfo: true
              })
            }
          }
        }else{
          util.showToastMsg(res.data.msg)
        }
      }
      var failData = function(res) {};
      // 微信登录获取token接口
      request.Request("POST", "加载中", url, params, successData, failData)
    },
    fail: function(res) {},
    complete: function(res) {},
  })
};

//查询可以切换房间公共函数
const getRoomLists = (util, Interface, successData, request) => {
  var url = util.url + Interface.getRoomList;
  var params = {};
  var successData = successData;
  var failData = function(res){};
  request.Request("GET", "加载中", url, params, successData, failData)
};
//切换房间函数封装
const selectRoom = (util, Interface, request, params, successData) => {
  var url = util.url + Interface.selectedRoom;
  var params = params;
  var successData = successData;
  var failData = function (res) { };
  request.Request("POST", "加载中", url, params, successData, failData)
};
module.exports = {
  orderDetails: orderDetails,
  reward: reward,
  customerEvaluate: customerEvaluate,
  Request: Request,
  showModalMsgs: showModalMsgs,
  controlRequest: controlRequest,
  storeRequest: storeRequest,
  indexReward: indexReward,
  wechatLogin: wechatLogin,
  getRoomLists: getRoomLists,
  selectRoom: selectRoom
}