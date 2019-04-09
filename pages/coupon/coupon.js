// pages/coupon/coupon.js
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
var request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    hasPay:false,
    code: '',
    hotelId:'',
    hotelName:'',
    price:'',
    expiryTime:'',
    sign:false,
  },
  //跳转到我的票券
  ticket:function(e){
    wx.navigateTo({
      url: '../ticket/ticket',
    })
  },
  //免费
  free:function(e){
    var that = this;
    var hotelId = that.data.hotelId;
    var authenticat = wx.getStorageSync("authenticat");
    wx.request({
      url: util.url + Interface.takeBreakfastVoucherInReception,
      data: {
        "hotelId": hotelId
      },
      header: {
        'content-type': 'application/json',
        'Token': authenticat
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        if(res.data.code == 0){
          setTimeout(function () {
            util.showToastMsg("领取成功")
          }, 1000)
        }else{
          setTimeout(function () {
            util.showToastMsg(res.data.msg)
          }, 500)
        }
      },
      fail: function(res) {},
      complete: function(res) {
        var code = that.data.code;
        wx.request({
          url: util.url + Interface.getTakeBreakfastVoucherInfo,
          data: {
            "qrCodeParam": code
          },
          header: {
            'content-type': 'application/json',
            'Token': authenticat
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            console.log(res)
            that.setData({
              hotelId: res.data.data.hotelId,
              hotelName: res.data.data.hotelName,
              price: res.data.data.price,
              expiryTime: res.data.data.expiryTime,
              sign: true,
            })
            wx.setStorageSync("HotelId", res.data.data.hotelId)
          },
          fail: function (res) { },
          complete: function (res) {
            wx.hideLoading()
          },
        })
      },
    })
  },
  //付费
  pay:function(e){
    var that = this;
    var hotelId = that.data.hotelId;
    var authenticat = wx.getStorageSync("authenticat");
    wx.request({
      url: util.url + Interface.createBreakfastCouponOrder,
      data: {
        'hotelId': hotelId
      },
      header: {
        'content-type': 'application/json',
        'Token': authenticat
      },
      method: 'POST',
      success: function (res) {
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
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.packageValue,
                  'signType': res.data.data.signType,
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    console.log(res)
                    util.showToastMsg("购买成功")
                  },
                  'fail': function (res) {
                  }
                })
              } else {
                util.showToastMsg(res.data.msg)
              }

            },
            fail: function (res) { },
            complete: function (res) {

            },
          })


        } else {
          util.showToastMsg(res.data.msg);
        }

      },
      fail: function (res) { },
      complete: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      },
    })
  },
//获取早餐券信息
  getTakeBreakfastVoucherInfo:function(that){
    var url = util.url + Interface.getTakeBreakfastVoucherInfo;
    var code = that.data.code;
    var hasPay = that.data.hasPay;
    var params = {
      "qrCodeParam": code,
      'hasPay': hasPay
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        that.setData({
          hotelId: res.data.data.hotelId,
          hotelName: res.data.data.hotelName,
          price: res.data.data.price,
          expiryTime: res.data.data.expiryTime
        })
        wx.setStorageSync("HotelId", res.data.data.hotelId)
      } else {
        util.showToastMsg(res.data.msg)
        setTimeout(function () {
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        }, 1500)
      }
    };
    var failData = function (res) { };
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var hasPay = options.hasPay;
    var code = options.p;
    that.setData({
      hasPay: hasPay,
      code: code
    })
    wx.login({
      success: function(res) {
        wx.request({
          url: util.url + Interface.wechatLogin,
          data: {
            "code": res.code,
          },
          header: {
            'content-type': 'application/json',
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            console.log(res)
            var authenticat = wx.setStorageSync("authenticat", res.data.data.loginToken);
            that.getTakeBreakfastVoucherInfo(that)
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      tabbarColor: app.globalData.tabbarColor,
      titleColor: app.globalData.titleColor
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})