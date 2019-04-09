// pages/Scavenging/openLocation/openLocation.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    q:''
  },
  cancel:function(e){
    wx.redirectTo({
      url: '../Scavenging',
    })
  },
  End:function(e){
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var q = options.q;
    this.setData({
      q:q
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
    that.setData({
      tabbarColor: app.globalData.tabbarColor,
      titleColor: app.globalData.titleColor
    })
    var q = this.data.q;
    setTimeout(function () {
      wx.getLocation({
        type: 'wgs84',
        altitude: true,
        success: function (res) {
          wx.getSetting({
            success: function (res) {
              if (res.authSetting['scope.userLocation']) {
                wx.redirectTo({
                  url: '../../index/index?q=' + q,
                })
              }
            },
            fail: function (res) {
            },
            complete: function (res) { },
          })
        },
        fail: function (res) {
        },
        complete: function (res) { },
      })
    }, 50)
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