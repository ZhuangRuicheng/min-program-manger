// pages/index/hotelReservation/hotelReservation.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
var map = require('../../../utils/qqmap-wx-jssdk.min.js');
var request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    imgUrls: [],
    ModalStatus: false,
    checkInStartTime: '',
    checkOutStartTime: "",
    liveDate: '',
    checkInDate: "",
    checkOutDate: "",
    CLOCK_ROOM: [],
    DAY_ROOM: [],
    HALF_DAY_ROOM: [],
    address: '',
    hotelName: '',
    notification: '',
    name: '',
    bed: '',
    area: '',
    stay: '',
    window: '',
    floor: '',
    Addbed: '',
    description: '',
    imgUrl: '',
    id: 0,
    price: '',
    useType: '',
    HotelId: 0,
    latitude: '',
    longitude: '',
    checkDate: '',
    telePhone: '',
    isOpenBook: '',
    roomCount: '',
    showTips: true,
    headerImg: util.imgUrl + '/header.jpg',
    optionsHotelId: 0,
    optionsId: 0,
    facilities: [],
    getUseInfo: false,
    getPhoneInfo: false,
    getUseInfoImg: util.imgUrl + '/getUseInfo.png',
    getPhoneInfoImg: util.imgUrl + '/getPhoneInfo.png',
  },
  //隐藏提示显示
  stopTips: function(e) {

    this.setData({
      showTips: false
    })
    wx.setStorageSync("showTips", "showTips")
  },
  //点击分享
  shareBtn: function(e) {

  },
  //点击图片显示房间详情弹出框
  detailsShow: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.idx;
    var roomCount = e.currentTarget.dataset.roomcount;
    that.setData({
      roomCount: roomCount
    })
    // var isOpenBook = e.currentTarget.dataset.isopenbook;
    var url = util.url + Interface.getRoomTypeDetailById;
    var params = {
      'roomTypeId': id
    };
    var successData = function(res) {
      if (res.data.code == 0) {
        that.setData({
          ModalStatus: true,
          name: res.data.data.typeName,
          bed: res.data.data.bedType,
          area: res.data.data.area,
          stay: res.data.data.stayNum,
          window: res.data.data.window,
          floor: res.data.data.floor,
          Addbed: res.data.data.addBed,
          description: res.data.data.description,
          imgUrl: res.data.data.imgUrl,
          id: res.data.data.roomTypeId,
          price: res.data.data.price,
          isOpenBook: res.data.data.isOpenBook,
          useType: res.data.data.useType,
        })
      }
    };
    var failData = function(res) {};
    request.Request("GET", "加载中", url, params, successData, failData)


  },
  //点击取消隐藏房间详情弹出框
  hideStatus: function(e) {
    this.setData({
      ModalStatus: false
    })
  },

  //跳转酒店介绍
  hotelIntroduction: function(e) {
    var HotelId = this.data.HotelId;
    wx.navigateTo({
      url: '../hotel_Introduction/hotel_Introduction?HotelId=' + HotelId,
    })
  },
  //获取位置导航

  map: function(e) {
    var that = this;

    //获取位置
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // const latitude = res.latitude
        // const longitude = res.longitude
        wx.openLocation({
          latitude: parseFloat(that.data.latitude),
          longitude: parseFloat(that.data.longitude),
          name: that.data.address,
          address: that.data.address,
        })
      },
      fail: function(res) {
        util.showToastMsg("请检查手机是否开启定位功能")
      },
      complete: function(res) {},
    })
  },
  preventTouchMove: function(e) {},
  //日租房预订跳转
  orderFilling: function(e) {
    this.setData({
      ModalStatus: false
    })
    var name = e.currentTarget.dataset.names;
    var id = e.currentTarget.dataset.idx;
    var price = e.currentTarget.dataset.prices;
    var checkInStartTime = new Date(this.data.checkInStartTime.replace(/-/g, "/"));
    var checkOutStartTime = new Date(this.data.checkOutStartTime.replace(/-/g, "/"));
    var days = checkOutStartTime.getTime() - checkInStartTime.getTime();
    if (days <= 0) {
      util.showToastMsg('离开时间不能小于或等于入住时间，请重新选择')
      return
    } else {
      var hotelName = this.data.hotelName;
      var checkInStartTime = this.data.checkInStartTime;
      var checkOutStartTime = this.data.checkOutStartTime;
      var liveDate = this.data.liveDate;
      var price = price * this.data.liveDate;
      var HotelId = this.data.HotelId;
      wx.navigateTo({
        url: './orderFilling/orderFilling?checkInStartTime=' + checkInStartTime + '&name=' + name + '&price=' + price + '&id=' + id + '&hotelName=' + hotelName + '&checkOutStartTime=' + checkOutStartTime + '&liveDate=' + liveDate + '&HotelId=' + HotelId,
      })

    }

  },
  //钟点房预订
  clockOrderFilling: function(e) {
    this.setData({
      ModalStatus: false
    })
    var that = this;
    var name = e.currentTarget.dataset.names;
    var id = e.currentTarget.dataset.idx;
    var price = e.currentTarget.dataset.prices;
    var checkInStartTime = that.data.checkInStartTime;
    var hotelName = that.data.hotelName;
    var HotelId = this.data.HotelId;
    wx.navigateTo({
      url: './clockOrderFilling/clockOrderFilling?checkInStartTime=' + checkInStartTime + '&name=' + name + '&price=' + price + '&id=' + id + '&hotelName=' + hotelName + '&HotelId=' + HotelId,

    })

  },
  //半日房
  halfDayFilling: function(e) {
    this.setData({
      ModalStatus: false
    })
    var that = this;
    var name = e.currentTarget.dataset.names;
    var id = e.currentTarget.dataset.idx;
    var price = e.currentTarget.dataset.prices;
    var checkInStartTime = that.data.checkInStartTime;
    var hotelName = that.data.hotelName;
    var HotelId = this.data.HotelId;
    wx.navigateTo({
      url: './halfDayFilling/halfDayFilling?checkInStartTime=' + checkInStartTime + '&name=' + name + '&price=' + price + '&id=' + id + '&hotelName=' + hotelName + '&HotelId=' + HotelId,

    })

  },

  //入住时间选择事件
  checkInDateChange: function(e) {
    this.setData({
      checkInStartTime: e.detail.value
    })
  },
  //离开时间选择事件
  checkOutDateChange: function(e) {

    this.setData({
      checkOutStartTime: e.detail.value,
    })

    var checkInStartTime = new Date(this.data.checkInStartTime.replace(/-/g, "/"));
    var checkOutStartTime = new Date(this.data.checkOutStartTime.replace(/-/g, "/"));
    var days = checkOutStartTime.getTime() - checkInStartTime.getTime();
    if (days <= 0) {
      util.showToastMsg('离开时间不能小于或等于入住时间，请重新选择')
      return
    } else {
      var liveDate = Math.floor(days / (24 * 3600 * 1000));

      this.setData({
        liveDate: liveDate
      })
    }

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var scene = wx.getStorageSync("scene");
    var HotelId = options.HotelId;
    var id = options.id;
    that.setData({
      optionsHotelId: HotelId,
      optionsId: id
    })
    var date = new Date();
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var checkOutD = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);

    //当月天数
    var monthDaySize;
    //当月号数
    var checkOutDay = date.getDate();
    //当月月份
    var checkOutMonth = date.getMonth() + 1;
    var checkOutYear = date.getFullYear();
    if (date.getMonth() + 1 == 1 || date.getMonth() + 1 == 3 || date.getMonth() + 1 == 5 || date.getMonth() + 1 == 7 || date.getMonth() + 1 == 8 || date.getMonth() + 1 == 10 || date.getMonth() + 1 == 12) {
      monthDaySize = 31;
      if (checkOutDay - monthDaySize == 0) {
        checkOutDay = "01";
        checkOutMonth = checkOutMonth + 1;
      } else {
        checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
      }
      if (checkOutDay == 31) {
        checkOutYear = checkOutYear + 1;
      }

    } else if (date.getMonth() + 1 == 4 || date.getMonth() + 1 == 6 || date.getMonth() + 1 == 9 || date.getMonth() + 1 == 11) {
      monthDaySize = 30;
      if (checkOutDay - monthDaySize == 0) {
        checkOutDay = "01";
        checkOutMonth = checkOutMonth + 1;
      } else {
        checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
      }
    } else if (date.getMonth() + 1 == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((checkOutYear - 2000) % 4 == 0) {
        monthDaySize = 29;
        if (checkOutDay - monthDaySize == 0) {
          checkOutDay = "01";
          checkOutMonth = checkOutMonth + 1;
        } else {
          checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
        }
      } else {
        monthDaySize = 28;
        if (checkOutDay - monthDaySize == 0) {
          checkOutDay = "01";
          checkOutMonth = checkOutMonth + 1;
        } else {
          checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
        }
      }
    };

    var liveDate = checkOutD - D;
    var time = Y + "-" + M + "-" + D;
    var checkOutDate = Y + "-" + M + "-" + checkOutD;
    var checkDate = checkOutYear + "-" + checkOutMonth + "-" + checkOutDay;
    that.setData({
      checkInStartTime: time,
      checkOutStartTime: checkDate,
      checkInDate: D,
      checkOutDate: checkOutD,
      liveDate: liveDate,
      HotelId: HotelId,
    });

    if (scene == 1007 || scene == 1008) {
      wx.login({
        success: function(res) {
          var url = util.url + Interface.wechatLogin;
          var params = {
            "code": res.code,
          };
          var successData = function(res) {
            if (res.data.code == 0) {
              that.hotelReservationInfo(HotelId, that);
              wx.setStorageSync("authenticat", res.data.data.loginToken);
              if (!res.data.data.hasWxInfo) {
                that.setData({
                  hasWeiXinInfo: res.data.data.hasWxInfo,
                  hasWxPhone: res.data.data.hasWxPhone,
                  getUseInfo: true
                })
              } else {
                if (!res.data.data.hasWxPhone) {
                  that.setData({
                    getPhoneInfo: true
                  })
                }
              }
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
    } else {
      that.hotelReservationInfo(HotelId, that);

    }
  },
  //获取酒店信息函数封装
  hotelReservationInfo: function(HotelId, that) {
    var url = util.url + Interface.hotelReservationInfo;
    var params = {
      "hotelId": HotelId
    };
    var successData = function(res) {
      // 实例化API核心类
      var demo = new map({
        key: '7IKBZ-WQJKU-MBXVB-2U47V-K6BEE-GKBR5' // 必填
      });
      // 调用接口
      demo.geocoder({
        address: res.data.data.address,
        success: function(res) {
          that.setData({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng
          })
        },
        fail: function(res) {
          util.showToastMsg(res.message)
        },
        complete: function(res) {}
      });
      that.setData({
        CLOCK_ROOM: res.data.data.roomTypeList.CLOCK_ROOM,
        DAY_ROOM: res.data.data.roomTypeList.DAY_ROOM,
        HALF_DAY_ROOM: res.data.data.roomTypeList.HALF_DAY_ROOM,
        // roomTypeList: res.data.data.roomTypeList,
        address: res.data.data.address,
        hotelName: res.data.data.hotelName,
        notification: res.data.data.notification,
        telePhone: res.data.data.phone,
        facilities: res.data.data.facilities,
        imgUrls: res.data.data.banners
      })
      wx.setStorageSync("hotelName", res.data.data.hotelName);
    };
    var failData = function(res) {};
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.setData({
      tabbarColor: app.globalData.tabbarColor,
      titleColor: app.globalData.titleColor
    })
    var authenticat = wx.getStorageSync("authenticat")
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.hotelReservePvAdd;
    Interface.PVCount(url, HotelId, authenticat);
    var showTips = wx.getStorageSync("showTips")
    if (showTips == "showTips") {
      console.log("showTips:" + showTips)
      that.setData({
        showTips: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    var authenticat = wx.getStorageSync("authenticat")
    var HotelId = that.data.optionsHotelId;
    wx.request({
      url: util.url + Interface.hotelReservationInfo,
      data: {
        "hotelId": HotelId
      },
      header: {
        'content-type': 'application/json',
        'Token': authenticat
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        // 实例化API核心类
        var demo = new map({
          key: '7IKBZ-WQJKU-MBXVB-2U47V-K6BEE-GKBR5' // 必填
        });

        // 调用接口
        demo.geocoder({
          address: res.data.data.address,
          success: function(res) {
            that.setData({
              latitude: res.result.location.lat,
              longitude: res.result.location.lng
            })
          },
          fail: function(res) {
            util.showToastMsg(res.message)
          },
          complete: function(res) {}
        });
        util.showToastMsg("刷新成功")
        that.setData({
          CLOCK_ROOM: res.data.data.roomTypeList.CLOCK_ROOM,
          DAY_ROOM: res.data.data.roomTypeList.DAY_ROOM,
          address: res.data.data.address,
          hotelName: res.data.data.hotelName,
          notification: res.data.data.notification,
          telePhone: res.data.data.phone,
          facilities: res.data.data.facilities,
          imgUrls: res.data.data.banners
        })
        wx.setStorageSync("hotelName", res.data.data.hotelName);
      },
      fail: function(res) {},
      complete: function(res) {
        wx.stopPullDownRefresh();
      },
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = that.data.HotelId;
    var url = util.url + Interface.share;
    Interface.PVCount(url, HotelId, authenticat);
    //数据统计
    var scene = wx.getStorageSync("scene");
    if (scene == 1007 || scene == 1008) {
      var forwardUrl = util.url + Interface.forward;
      Interface.PVCount(forwardUrl, HotelId, authenticat);
    }
    return {
      title: that.data.hotelName + "，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId=' + HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }

  }
})