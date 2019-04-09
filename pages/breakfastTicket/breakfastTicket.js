// pages/breakfastTicket/breakfastTicket.js
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
var request = require('../../utils/request.js');
let animationShowHeight = 300;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    description: '',
    url: [],
    price: '28',
    payShow: false,
    payhide: true,
    name: "早餐券",
    QrModalStatus: false,
    isOpenPay: false,
  },
  free: function(e) {
    var that = this;
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.takeBreakfastVoucherInRoom;
    var params = {
      'hotelId': HotelId
    };
    var successData = function(res) {
      if (res.data.code == 0) {
        setTimeout(function() {
          util.showToastMsg("领取成功");
          that.setData({
            QrModalStatus: true,
            payShow: false
          })
        }, 1000)

      } else {
        setTimeout(function () {
          util.showToastMsg(res.data.msg)
        }, 1500)
        
      }
    };
    var failData = function(res) {};
    request.Request("POST", "领取中", url, params, successData, failData)
  },
  pay: function(e) {
    this.setData({
      payShow: true,
      payhide: false
    })
  },
  closePay: function(e) {
    this.setData({
      payShow: false,
      payhide: true
    })
  },
  cancel: function(e) {
    this.setData({
      QrModalStatus: false
    })
  },
  QRhideModal: function() {
    // 隐藏遮罩层
    this.setData({
      QrModalStatus: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../ticket/ticket',
      })
    }, 1500)
  },
  // 调用支付AIP
  payMoney: function(e) {
    var that = this;
    var HotelId = wx.getStorageSync("HotelId");
    var authenticat = wx.getStorageSync("authenticat");
    var url = util.url + Interface.createBreakfastCouponOrder;
    var params = {
      'hotelId': HotelId
    };
    var successData = function(res) {
      if (res.data.code == 0) {
        var orderNo = res.data.data.tradeNo;
        wx.request({
          url: util.url + Interface.unifiedOrder,
          data: {
            'tradeNo': orderNo,
          },
          header: {
            'content-type': 'application/json',
            'Token': authenticat
          },
          method: 'POST',
          success: function(res) {
            console.log(res);
            if (res.data.code == 0) {
              //价格不为0
              wx.requestPayment({
                'timeStamp': res.data.data.timeStamp,
                'nonceStr': res.data.data.nonceStr,
                'package': res.data.data.packageValue,
                'signType': res.data.data.signType,
                'paySign': res.data.data.paySign,
                'success': function(res) {
                  console.log(res)
                  that.setData({
                    QrModalStatus: true,
                    payShow: false
                  })
                },
                'fail': function(res) {}
              })
            } else {
              util.showToastMsg(res.data.msg)
            }
          },
          fail: function(res) {},
          complete: function(res) {

          },
        })
      } else {
        util.showToastMsg(res.data.msg);
      }
    };
    var failData = function(res) {};
    request.Request("POST", "请稍等", url, params, successData, failData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var url = util.url + Interface.getBreakFastCouponConfig;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        that.setData({
          url: res.data.data.images,
          // name: res.data.data.name,
          price: res.data.data.price,
          description: res.data.data.description,
          isOpenPay: res.data.data.isOpenPay
        })
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        util.showToastMsg(res.data.msg);
        wx.navigateBack({
          delta: 1,
        })
      }
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
    var that = this;
    that.setData({
      tabbarColor: app.globalData.tabbarColor,
      titleColor: app.globalData.titleColor
    })
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.breakfastCouponPvAdd;
    Interface.PVCount(url, HotelId, authenticat);

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
    //数据统计
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var hotelName = wx.getStorageSync("hotelName");
    var url = util.url + Interface.share;
    Interface.PVCount(url, HotelId, authenticat);
    return {
      title: hotelName + "，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId=' + HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }
  }
})