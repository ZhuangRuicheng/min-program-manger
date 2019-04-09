//app.js
const app = getApp()
var util = require('utils/util.js')
var Interface = require('utils/url.js')
var request = require('utils/request.js');
App({
  // pagePath:"/pages/index/index",

  onLaunch: function(options) {
    this.globalData.getUseInfo = true
    //debugger
    //版本更新
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用进行更新',
        showCancel: false,
        cancelText: '',
        cancelColor: '',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
    })
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
        // console.log("宽度：" + ww);
        // console.log("高度："+hh)
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())

    wx.setStorageSync('logs', logs)
    console.log("进入场景值:" + options.scene)
    wx.setStorageSync("scene", options.scene)

    if (options.scene === 1089) {

      wx.redirectTo({
        url: '../pages/index/index',
      })


    } else if (options.scene === 1006 || options.scene === 1005) {
      wx.redirectTo({
        url: '../pages/Scavenging/Scavenging',
      })

    }

  },
  //第三方程序跳转上传手机号
  updataJempPhone: function(util, phone) {
    var url = util.url + Interface.getJumpPhone;
    var params = {
      'phone': phone
    };
    var successData = function(res) {
      if (res.data.code == 0) {} else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    request.Request("POST", "加载中", url, params, successData, failData)
  },
  onShow: function(options) {

    var that = this;
    if (options.scene == 1037) {
      wx.login({
        success: function(res) {
          var url = util.url + Interface.wechatLogin;
          var params = {
            "code": res.code,
          };
          var successData = function(res) {
            if (res.data.code == 0) {
              wx.setStorageSync("authenticat", res.data.data.loginToken);
              that.updataJempPhone(util, options.referrerInfo.extraData.userPhone)
              wx.setStorageSync("orderGuid", options.referrerInfo.extraData.orderGuid)
            } else {
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
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.globalData.timestamp = timestamp;

  },
  onHide: function() {
    var timestamp = this.globalData.timestamp;
    var leaveTimestamp = Date.parse(new Date());
    leaveTimestamp = leaveTimestamp / 1000;
    var stayTimestamp = leaveTimestamp - timestamp;
    var authenticat = wx.getStorageSync("authenticat");
    // wx.clearStorage()
    var HotelId = wx.getStorageSync("HotelId");
    var params = {
      "hotelId": HotelId,
      "stayTime": stayTimestamp
    }
    Interface.PVStayTime(params, authenticat, util, Interface);
  },
  editTabBar: function() {

    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var MyTabbar = this.globalData.tabbar;
    for (var i = 0; i < MyTabbar.list.length; i++) {
      MyTabbar.list[i].selected = false;
      // debugger
      if (MyTabbar.list[i].pagePath == _pagePath) {
        MyTabbar.list[i].selected = true; //根据页面地址设置当前页面状态  
      }
    }
    _curPage.setData({
      tabbar: MyTabbar
    });
  },

  bezier: function(pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }

    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0]; //点击
      pointB = points[1]; //中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  },

  globalData: {
    currentTab: '',
    pagePath: '',
    tabbarColor: '#ea5415',
    titleColor: 'white',
    userInfo: null,
    tabbar: {
      "selectedColor": "#EA5415",
      "borderStyle": "#999999",
      "backgroundColor": "#ffffff",
      "color": "#999999",
      list: [{
          pagePath: "/pages/Scavenging/Scavenging",
          text: "客房助手",
          iconPath: "../img/server_Normal.png",
          selectedIconPath: "../img/server_Selection.png",
          selected: true
        },
        {
          pagePath: "/pages/person_Center/person_Center",
          text: "个人中心",
          iconPath: "../img/person_Normal.png",
          selectedIconPath: "../img/person_Selection.png",
          selected: false
        }
      ],
      position: "bottom"
    },
    getUseInfo: false,
    hasWeiXinInfo: '',
    timestamp: '',
    isLogin: '',
    ww: '',
    hh: ''
  }
})