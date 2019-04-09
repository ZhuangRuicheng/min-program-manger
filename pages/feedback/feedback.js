// pages/feedback/feedback.js
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
    feedBackContent: '',
    QrModalStatus: false
  },
  preventTouchMove:function(e){},
  //提示框隐藏
  QRhideModal: function (e) {
    this.setData({
      feedBackContent: '',
      QrModalStatus: false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  feedBackInput: function (e) {
    this.setData({
      feedBackContent: e.detail.value.replace(/\s+/g, '')
    })
  },
  Submit: util.throttle(function (e) {
    var feedBackContent = this.data.feedBackContent;

    if (util.stringIsEmpty(feedBackContent)) {
      util.showToastMsg('请输入您想反馈问题')
      return
    } else {
      var that = this;
      var formId = e.detail.formId;
      var url = util.url + Interface.customerFeedback;
      var params = {
        "content": feedBackContent,
        "formId": formId
      };
      var successData = function(res){
        if (res.data.code == 0) {
          that.setData({
            QrModalStatus: true
          })
        } else if (res.data.code == 10) {
          util.showToastMsg(res.data.msg)
          wx.clearStorageSync("authenticat")
          wx.clearStorageSync("loginToken")
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        } else {
          util.showToastMsg(res.data.msg)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        }
      };
      var failData = function(res){};
      request.Request("POST", "提交中", url, params, successData, failData)
    }
  }, 3000),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
      path: 'pages/index/hotelReservation/hotelReservation?HotelId='+HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }
  }
})