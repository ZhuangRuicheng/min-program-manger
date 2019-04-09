//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
var request = require('../../utils/request.js');
var orderDetails = require('../../utils/request.js');
Page({
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight, //获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    tabbarTitle: '客房助手',
    hotelName: '',
    hotelNum: "",
    // hotelNum: '',
    password: '',
    phone: '',
    imgUrls: [],
    swiperCurrent: 0,
    links: [],
    info: '',
    WIFI: true,
    BREAKFAST_COUPON: true,
    CONTINUE_STAY: true,
    CLEAN_ROOM: true,
    MINI_BAR: true,
    INVOICE: true,
    CHECKOUT: true,
    MGR_PHONE_NUMBER: true,
    VIP: false,
    FEEDBACK: false,
    MEAL: false,
    hasWeiXinInfo: '',
    hasWxPhone: false,
    two: '0.5',
    five: '1.1',
    ten: '2.5',
    twenty: '6.6',
    fifty: '8.8',
    showModalStatus: false,
    notState: true,
    orders: false,
    orderStatus: '',
    orderType: '',
    orderContent: '',
    hiddenmodalput: false,
    clearRewardShow: false,
    text: '',
    orderId: 0,
    orderTypes: '',
    getUseInfo: false,
    signature: '',
    rawData: '',
    authenticat: '',
    getPhoneInfo: false,
    HotelId: 0,
    scene: false,
    getUseInfoImg: util.imgUrl + '/getUseInfo.png',
    getPhoneInfoImg: util.imgUrl + '/getPhoneInfo.png',
    vipImg: util.imgUrl + '/vip.png',
    CustomerServiceImg: util.imgUrl + '/CustomerService.png',
    shareImgs: util.imgUrl + '/share.png',
    // tab切换  
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,

  },
  //事件处理函数
  //首页跳转
  swiperChange: function(e) {
    if (e.detail.source == "touch") {
      let that = this;
      if (e.detail.current == 0 && that.data.swiperCurrent > 1) {
        that.setData({
          swiperCurrent: swiperCurrent
        })
      } else {
        that.setData({
          swiperCurrent: e.detail.current
        })
      }
    }

  },
  swipclick: function(e) {
    // var HotelId = wx.getStorageSync("HotelId");
    var HotelId = this.data.HotelId;
    wx.navigateTo({
      url: './hotel_Introduction/hotel_Introduction?HotelId=' + HotelId,
    })
  },
  NOvip: function(e) {
    util.showToastMsg('酒店暂未开通此服务')
  },
  NOmanagerOnline: function(e) {
    util.showToastMsg('酒店暂未开通此服务')
  },

  Roomvoucher: function(e) {
    var HotelId = this.data.HotelId;
    wx.navigateTo({
      url: './hotelReservation/hotelReservation?HotelId=' + HotelId,
    })
  },
  discount: function(e) {
    util.showToastMsg('酒店暂未开通此服务')
  },
  //酒店介绍
  Hoteladdress: function(e) {
    var HotelId = this.data.HotelId;
    console.log("轮播id:" + HotelId)
    wx.navigateTo({
      url: './hotel_Introduction/hotel_Introduction?HotelId=' + HotelId,
    })
  },
  //跳转到订单详情页面
  orderDetails: function(e) {
    console.log("orderId:" + this.data.orderId)
    switch (this.data.orderTypes) {
      case 'VIP':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/vipDetails/vipDetails?orderId=' + orderId,
        })
        break;
      case 'CONTINUE_STAY':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/continueSteyDetails/continueSteyDetails?orderId=' + orderId,
        })
        break;
      case 'CLEAN_ROOM':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/orderDetails/orderDetails?orderId=' + orderId,
        })
        break;
      case 'MINI_BAR':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/storeDetails/storeDetails?orderId=' + orderId,
        })
        break;
      case 'MEAL':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/mealsDatails/mealsDatails?orderId=' + orderId,
        })
        break;
      case 'CHECKOUT':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/checkOutDetails/checkOutDetails?orderId=' + orderId,
        })
        break;
      case 'INVOICE':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/invoiceDetails/invoiceDetails?orderId=' + orderId,
        })
        break;
      case 'FEEDBACK':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/feedbackDetails/feedbackDetails?orderId=' + orderId,
        })
        break;
      case 'HOTEL_RESERVE':
        var orderId = this.data.orderId;
        wx.navigateTo({
          url: '../myOrder/hotelReservationDetails/hotelReservationDetails?orderId=' + orderId,
        })
        break;
    }
  },
  //打赏模块
  reward: function(e) {
    this.setData({
      showModalStatus: true,
      clearRewardShow: true,
      hiddenmodalput: false,
    })
  },
  //金额打赏
  rewardCost: function(e) {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var money = e.currentTarget.id;
    var urlOrderNo = util.url + Interface.rewardOnHome;
    var unifiedOrder = util.url + Interface.unifiedOrder
    var rewardSuccess = function(data) {
      that.setData({
        showModalStatus: false,
        hiddenmodalput: false,
      })
    };
    orderDetails.indexReward(urlOrderNo, unifiedOrder, money, rewardSuccess, authenticat, that, util)
  },

  //随意打赏
  atWill: function(e) {
    this.setData({
      hiddenmodalput: true,
      clearRewardShow: false
    })
  },

  //取消按钮  
  cancel: function() {
    this.setData({
      hiddenmodalput: false,
      text: '',
      showModalStatus: false,

    });
  },
  //取消打赏
  cancelReward: function(e) {
    this.setData({
      showModalStatus: false,
      clearRewardShow: false,
    })
  },
  //获取输入文本框值
  inputContent: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  //VIP模块函数
  vip: function(e) {
    var url = util.url + Interface.checkEmptyInfo;
    var params = {};
    var successData = function(res) {
      if (!res.data.data.hasEmptyInfo) {
        wx.navigateTo({
          url: '../../pages/vip/vip',
        })
      } else {
        wx.navigateTo({
          url: '../../pages/vipInfo/vipInfo',
        })
      }
    };
    var failData = function(res) {};
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  // 经理在线模块函数
  managerOnline: function(e) {
    wx.navigateTo({
      url: '../../pages/managerOnline/managerOnline',
    })
  },
  //酒店预订
  hotelReservation: function(e) {
    var HotelId = this.data.HotelId;
    wx.navigateTo({
      url: './hotelReservation/hotelReservation?HotelId=' + HotelId,
    })
  },
  //早餐券
  breakfastTicket: function(e) {
    wx.navigateTo({
      url: '../../pages/breakfastTicket/breakfastTicket',
    })
  },
  // 自助续住
  SelfRenewal: function(e) {
    wx.navigateTo({
      url: '../../pages/self/self',
    })
  },

  // 房间清扫
  clearRoom: function(e) {
    wx.navigateTo({
      url: '../../pages/clearRoom/clearRoom',
    })
  },
  // 迷你小清吧
  Shopping: function(e) {
    wx.navigateTo({
      url: '../../pages/store/store',
    })
  },
  //客房送餐
  meals: function() {
    wx.navigateTo({
      url: '../meals/meals',
    })
  },
  // 发票预约
  invoice: function(e) {
    wx.navigateTo({
      url: '../../pages/invoice/invoice',
    })
  },
  //退房模块函数
  leaveRoom: function(e) {
    wx.navigateTo({
      url: '../../pages/leaveRoom/leaveRoom',
    })
  },

  // 店长联系模块函数
  callPhone: function(e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },
  //  复制密码
  copypwd: function(e) {
    wx.setClipboardData({
      data: this.data.password,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  //第三方服务
  //叫车
  // callCar: function(e) {
  //   //util.showToastMsg('该功能暂未开通，敬请期待')
  //   wx.navigateTo({
  //     url: './callCar/callCar',
  //   })
  // },
  //外卖连接
  // takeOutFood:function(e){
  //   wx.navigateTo({
  //     url: './takeOutFood/takeOutFood',
  //   })
  // },
  //预订机票
  // planeTicket:function(e){
  //   wx.navigateTo({
  //     url: './planeTicket/planeTicket',
  //   })
  // },
  //共用模块
  wait: function(e) {
    util.showToastMsg('该功能暂未开通，敬请期待')
  },
  //获取手机号码
  getPhoneNumber(e) {
    var that = this;
    that.setData({
      getPhoneInfo: false
    })
    var url = util.url + Interface.decodePhone;
    var params = {
      "signature": that.data.signature,
      "rawData": that.data.rawData,
      "encryptedData": e.detail.encryptedData,
      "iv": e.detail.iv
    };
    var successData = function(res) {
      that.setData({
        getPhoneInfo: false
      })
    };
    var failData = function(res) {
      that.setData({
        getPhoneInfo: false
      })
    };
    request.Request("POST", "提交中", url, params, successData, failData)

  },
  //获取用户信息
  bindGetUserInfo(e) {
    var that = this;
    that.setData({
      getUseInfo: false
    })
    //获取敏感信息请求
    if (!that.data.hasWeiXinInfo) {
      wx.getUserInfo({
        success: function(res) {
          that.setData({
            signature: res.signature,
            rawData: res.rawData,
          })
          var url = util.url + Interface.decodeUserInfo;
          var params = {
            "signature": res.signature,
            "rawData": res.rawData,
            "encryptedData": res.encryptedData,
            "iv": res.iv
          };
          var successData = function(res) {
            var hasWxPhone = that.data.hasWxPhone;
            if (res.data.code == 0) {
              //未获取手机号，执行获取
              if (!hasWxPhone) {
                that.setData({
                  getPhoneInfo: true,
                })
              }
            }
          };
          var failData = function(res) {
            if (hasWxPhone == false) {
              that.setData({
                getPhoneInfo: true,
              })
            }
          };
          request.Request("POST", "提交中", url, params, successData, failData)

        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }
  },
  //底部导航事件
  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      if (e.currentTarget.dataset.current == 1) {
        // var hasPermission = wx.getStorageSync('hasPermission')
        // if (hasPermission) {
        wx.redirectTo({
          url: '../cuestControl/cuestControl',
        })
        // } else {
        //   wx.redirectTo({
        //     url: '../NoAuthority/NoAuthority',
        //   })
        // }

      } else if (e.currentTarget.dataset.current == 2) {

        wx.redirectTo({
          url: '../person_Center/person_Center',
        })
      }
      app.globalData.currentTab = e.currentTarget.dataset.current;

    }
  },

  onLoad: function(options) {
    var that = this;
    app.globalData.pagePath = '../index/index';
    var openCode = options.q;
    let q = decodeURIComponent(options.q)
    console.log("携带字符：" + q)
    //截取字符b
    if (q.indexOf("?") != -1) {
      var char = q.split("?")[0];
      var backChar = q.split("?")[1]
      var len = char.length;
      var letter = char[len - 1];
    }
    //截取字符b
    var codes = util.getQueryString(q, 'code');
    if (letter == 'b') {

      wx.redirectTo({
        url: '../coupon/coupon?' + backChar,
      })
    } else {
      if (options.q != undefined) {

        wx.getLocation({
          type: 'wgs84',
          success: function(res) {
            //纬度
            var latitude = JSON.stringify(res.latitude);
            //经度
            var longitude = JSON.stringify(res.longitude);
            wx.login({
              success: function(res) {
                var url = util.url + Interface.wechatLogin;
                var params = {
                  "code": res.code,
                  "latitude": latitude,
                  "longitude": longitude,
                };
                var successData = function(res) {
                  wx.setStorageSync("authenticat", res.data.data.loginToken);
                  if (!res.data.data.hasWxInfo) {
                    that.setData({
                      hasWeiXinInfo: res.data.data.hasWxInfo,
                      hasWxPhone: res.data.data.hasWxPhone,
                      authenticat: res.data.data.loginToken,
                      getUseInfo: true
                    })
                  } else {
                    if (!res.data.data.hasWxPhone) {
                      that.setData({
                        hasWxPhone: res.data.data.hasWxPhone,
                        getPhoneInfo: true
                      })
                    }
                  }
                  // wx.setStorageSync("authenticat", res.data.data.loginToken);
                  // that.setData({
                  //   hasWeiXinInfo: res.data.data.hasWxInfo,
                  //   hasWxPhone: res.data.data.hasWxPhone,
                  //   authenticat: res.data.data.loginToken
                  // })
                  // wx.setStorageSync("hasWxPhone", res.data.data.hasWxPhone);
                  // app.globalData.hasWeiXinInfo = res.data.data.hasWeiXinInfo;
                  //判断是否有权限
                  // setTimeout(function () {
                  var successData = function(res) {
                    if (res.data.code == 0) {
                      wx.setStorageSync("hasPermission", res.data.data.hasPermission)
                      wx.setStorageSync("expireTime", res.data.data.expireTime)
                      wx.setStorageSync("hasIdCard", res.data.data.hasIdCard)
                      wx.setStorageSync("openIhc", res.data.data.openIhc)
                      wx.setStorageSync("roomNum", res.data.data.roomNum)
                      if (res.data.data.hasPermission == true) {
                        app.globalData.currentTab = 1;
                        wx.redirectTo({
                          url: '../cuestControl/cuestControl',
                        })
                      }
                    } else if (res.data.code == 10) {
                      util.showToastMsg(res.data.msg)
                      wx.clearStorageSync("authenticat")
                      wx.clearStorageSync("loginToken")
                      setTimeout(function() {
                        wx.redirectTo({
                          url: '../Scavenging/Scavenging',
                        })
                      }, 1500)
                    } else if (res.data.code == 20) {
                      util.showToastMsg(res.data.msg)
                      wx.clearStorageSync("authenticat")
                      wx.clearStorageSync("loginToken")
                      setTimeout(function() {
                        wx.redirectTo({
                          url: '../Scavenging/Scavenging',
                        })
                      }, 1500)
                    }
                  };
                  that.checkPermission(that, successData)
                  // }, 500)
                  //扫码进入函数
                  that.scanRoomQrCode(that, latitude, longitude, codes)

                };
                var failData = function(res) {};
                request.Request("POST", "加载中", url, params, successData, failData)
              },
              //登录
              fail: function(res) {},
              complete: function(res) {},
            })
          },
          //定位
          fail: function(res) {
            util.showToastMsg("使用期间请打开手机定位服务功能");
            setTimeout(function() {
              wx.redirectTo({
                url: '../Scavenging/openLocation/openLocation?q=' + openCode,
              })
            }, 3000)
          },
          complete: function(res) {},
        })

      } else {
        //登录获取手机号码等信息
        request.wechatLogin(util, Interface, request, that)
        //判断是否有权限
        var successData = function(res) {
          if (res.data.code == 0) {
            that.getHomePageInfo(that)
          } else if (res.data.code == 10) {
            //检查权限返回“请登录”进行微信登录
            wx.login({
              success: function(res) {
                var url = util.url + Interface.wechatLogin;
                var params = {
                  "code": res.code,
                };
                var successData = function(res) {
                  //登录成功再调用权限接口，再调用获取首页信息接口
                  if (res.data.code == 0) {
                    wx.setStorageSync("authenticat", res.data.data.loginToken);
                    var successData = function(res) {
                      //非扫码获取首页信息接口
                      that.getHomePageInfo(that)
                    };
                    //权限接口
                    that.checkPermission(that, successData)
                  }

                }
                var failData = function(res) {};
                // 微信登录获取token接口
                request.Request("POST", "加载中", url, params, successData, failData)
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          } else {
            util.showToastMsg(res.data.msg)
            wx.clearStorageSync("authenticat")
            wx.clearStorageSync("loginToken")
            setTimeout(function() {
              wx.redirectTo({
                url: '../Scavenging/Scavenging',
              })
            }, 1500)
          }
        };
        that.checkPermission(that, successData)
        //非扫码进入函数

      }
    }
  },
  //非扫码进入函数
  getHomePageInfo: function(that) {
    var url = util.url + Interface.getHomePageInfo;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        if (res.data.data.style != undefined) {

          app.globalData.tabbarColor = res.data.data.style.tabbarColor;
          app.globalData.titleColor = res.data.data.style.titleColor;
          console.log("tabbar:" + app.globalData.tabbarColor)
          that.setData({
            tabbarTitle: res.data.data.style.tabbarTitle,
            tabbarColor: app.globalData.tabbarColor,
            titleColor: app.globalData.titleColor
          })
        }
        that.setData({
          hotelName: res.data.data.hotelInfo.name,
          hotelNum: res.data.data.roomNum,
          phone: res.data.data.mgtPhone,
          imgUrls: res.data.data.homePageBanner,
          account: res.data.data.wifi.account,
          password: res.data.data.wifi.password,
          WIFI: res.data.data.functionStatus.WIFI,
          BREAKFAST_COUPON: res.data.data.functionStatus.BREAKFAST_COUPON,
          CONTINUE_STAY: res.data.data.functionStatus.CONTINUE_STAY,
          CLEAN_ROOM: res.data.data.functionStatus.CLEAN_ROOM,
          MINI_BAR: res.data.data.functionStatus.MINI_BAR,
          INVOICE: res.data.data.functionStatus.INVOICE,
          CHECKOUT: res.data.data.functionStatus.CHECKOUT,
          MGR_PHONE_NUMBER: res.data.data.functionStatus.MGR_PHONE_NUMBER,
          VIP: res.data.data.functionStatus.VIP,
          FEEDBACK: res.data.data.functionStatus.FEEDBACK,
          MEAL: res.data.data.functionStatus.MEAL
        })
        wx.setStorageSync("hotelName", res.data.data.hotelInfo.name)
        wx.setStorageSync("HotelId", res.data.data.hotelInfo.id)
        // wx.setStorageSync("roomNum", res.data.data.roomNum)

        that.setData({
          HotelId: res.data.data.hotelInfo.id,
          scene: true
        })
      } else {
        util.showToastMsg(res.data.msg)
        setTimeout(function() {
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        }, 1500)
        wx.clearStorageSync("authenticat")
      }
      //状态栏
      that.status(that)
    };
    var failData = function(res) {};
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  //权限判断
  checkPermission: function(that, successData) {

    var hotelId = wx.getStorageSync('HotelId');
    var url = util.url + Interface.checkPermission;
    var params = {
      'hotelId': hotelId,
      'Token': wx.getStorageSync("authenticat")
    };
    var failData = function(res) {};
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  //扫码进入函数
  scanRoomQrCode: function(that, latitude, longitude, codes) {
    var url = util.url + Interface.scanRoomQrCode;
    var params = {
      'qrCodeParameter': codes,
      "latitude": latitude,
      "longitude": longitude
    };
    var successData = function(res) {
      if (res.data.code == 0) {
        if (res.data.data.style != undefined) {
          app.globalData.tabbarColor = res.data.data.style.tabbarColor;
          console.log("tabbar:" + app.globalData.tabbarColor)
          app.globalData.titleColor = res.data.data.style.titleColor;
          that.setData({
            tabbarTitle: res.data.data.style.tabbarTitle,
            tabbarColor: res.data.data.style.tabbarColor,
            titleColor: res.data.data.style.titleColor
          })
        }
        var getUseInfo = app.globalData.getUseInfo;
        that.setData({
          hotelName: res.data.data.hotelInfo.name,
          hotelNum: res.data.data.roomNum,
          phone: res.data.data.mgtPhone,
          imgUrls: res.data.data.homePageBanner,
          account: res.data.data.wifi.account,
          password: res.data.data.wifi.password,
          WIFI: res.data.data.functionStatus.WIFI,
          BREAKFAST_COUPON: res.data.data.functionStatus.BREAKFAST_COUPON,
          CONTINUE_STAY: res.data.data.functionStatus.CONTINUE_STAY,
          CLEAN_ROOM: res.data.data.functionStatus.CLEAN_ROOM,
          MINI_BAR: res.data.data.functionStatus.MINI_BAR,
          INVOICE: res.data.data.functionStatus.INVOICE,
          CHECKOUT: res.data.data.functionStatus.CHECKOUT,
          MGR_PHONE_NUMBER: res.data.data.functionStatus.MGR_PHONE_NUMBER,
          VIP: res.data.data.functionStatus.VIP,
          FEEDBACK: res.data.data.functionStatus.FEEDBACK,
          MEAL: res.data.data.functionStatus.MEAL
        })
        wx.setStorageSync("hotelName", res.data.data.hotelInfo.name)
        wx.setStorageSync("HotelId", res.data.data.hotelInfo.id)
        wx.setStorageSync("roomNum", res.data.data.roomNum)
        wx.setStorageSync("ihcNo", res.data.data.hotelInfo.ihcNo)
        that.setData({
          HotelId: res.data.data.hotelInfo.id,
          scene: true
        })
      } else {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        setTimeout(function() {
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        }, 1500)
      }
      that.status(that);
    };
    var failData = function(res) {};
    request.Request("POST", "加载中", url, params, successData, failData)
  },
  onShow: function() {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var scene = that.data.scene;
    if (scene) {
      if (authenticat != '') {
        //状态栏
        that.status(that)
      }
    }
    //数据统计
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.allPvAdd;
    Interface.PVCount(url, HotelId, authenticat);
  },

  onPullDownRefresh: function(e) {
    wx.stopPullDownRefresh();
  },
  // 用户分享
  onShareAppMessage: function() {
    //数据统计
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.share;
    Interface.PVCount(url, HotelId, authenticat);
    return {
      title: this.data.hotelName + "，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId=' + HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }

  },
  //状态栏用函数
  status: function(that) {
    var authenticat = wx.getStorageSync("authenticat");
    wx.request({
      url: util.url + Interface.refreshOrderStatus,
      header: {
        'content-type': 'application/json',
        'Token': authenticat
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        // console.log("orderId:" + res.data.orderId)
        if (res.data.data.orderId == undefined) {
          that.setData({
            notState: true,
            orders: false
          })
        } else {
          that.setData({
            notState: false,
            orders: true,
          })
          //console.log("order:" + res.data.data.orderStatus)
          switch (res.data.data.orderType) {
            case 'VIP':
              that.setData({
                orderType: '办理会员',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '欢迎加入我们，您的信息已经录入酒店会员系统，后续提供您的姓名或手机号，即可享受会员特权。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'CONTINUE_STAY':
              that.setData({
                orderType: '自助续住',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '酒店房间已经帮您预留，请在今天18:00前到酒店前厅办理续住手续，感谢您的支持。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'CLEAN_ROOM':
              that.setData({
                orderType: '清扫房间',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '稍后会安排客房服务人员上门清扫，感谢您的支持。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'MINI_BAR':
              that.setData({
                orderType: '在线迷你吧',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '稍后会安排服务人员将您购买的商品送至房间，感谢您的支持。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'MEAL':
              that.setData({
                orderType: '客房送餐',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '稍后会安排服务人员将您购买的商品送至房间，感谢您的支持。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'CHECKOUT':
              that.setData({
                orderType: '退房',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '本酒店免查房，您可以收拾好自己的行李物品，将房卡送至前台后，自行离开即可，欢迎下次光临。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'INVOICE':
              that.setData({
                orderType: '发票',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '发票会提前打印，请离店前到酒店前厅领取即可，感谢您的支持。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'FEEDBACK':
              that.setData({
                orderType: '值班经理在线',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '我们的值班经理正在答复您，请稍后查看。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
            case 'HOTEL_RESERVE':
              that.setData({
                orderType: '酒店预订',
                orderId: res.data.data.orderId,
                orderTypes: res.data.data.orderType
              })
              switch (res.data.data.orderStatus) {
                case "SUBMIT":
                  that.setData({
                    orderContent: '预计5分钟内受理，请稍后',
                    orderStatus: "已下单",
                  })
                  break;
                case "ACCEPT":
                  that.setData({
                    orderStatus: "已受理",
                    orderContent: '信息已核实通过，为您预留房间至今天18:00，恭候您的到来。',
                  })
                  break;
                case "FINISH":
                  that.setData({
                    orderStatus: "已完成",
                    orderContent: '期待您对我们服务进行点评',
                  })
                  break;
              }
              break;
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})