// pages/person_Center/person_Center.js
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    canIUse: wx.canIUse('open-type.getUserInfo'),
    isLogin: false,
    winWidth: 0,
    winHeight: 0,
    currentTab: '',
    pagePath: '',
  },
  //获取用户信息
  bindGetUserInfo(e) {
    var that = this;
      wx.getUserInfo({
        success: function (res) {
          wx.setStorageSync('signature', res.signature)
          wx.setStorageSync('rawData', res.rawData)
        }
        })
  },
  /**
  * 自定义函数
  */
  myOrder: function (e) {
    wx.navigateTo({
      url: '../../pages/myOrder/myOrder',
    })
  },
  ticket: function (e) {
    wx.navigateTo({
      url: '../../pages/ticket/ticket',
    })
  },
  feedback: function (e) {
    wx.navigateTo({
      url: '../../pages/feedback/feedback',
    })
  },
//个人信息
  untying:function(e){
    wx.navigateTo({
      url: './personInfo/personInfo',
    })
  },
  swichNav: function (e) {
    var that = this;
    app.globalData.currentTab = e.currentTarget.dataset.current;
    console.log("currentTab:" + e.currentTarget.dataset.current)
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      if (e.currentTarget.dataset.current == 1) {
        wx.redirectTo({
            url: '../cuestControl/cuestControl',
          })
        // var hasPermission = wx.getStorageSync('hasPermission')
        // if (hasPermission) {
        //   wx.redirectTo({
        //     url: '../cuestControl/cuestControl',
        //   })
        // } else {
        //   wx.redirectTo({
        //     url: '../NoAuthority/NoAuthority',
        //   })
        // }
      } else if (e.currentTarget.dataset.current == 0) {
        wx.redirectTo({
          // url: that.data.pagePath,
          url: '../index/index',
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getApp().editTabBar(); 

    var that = this;
    that.setData({
      currentTab: app.globalData.currentTab,
      pagePath: app.globalData.pagePath
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    wx.login({
      success: function (res) {
        that.setData({
          isLogin: true
        })
      },
      fail: function (res) { },
      complete: function (res) { },
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
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.allPvAdd;
    Interface.PVCount(url, HotelId, authenticat);
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