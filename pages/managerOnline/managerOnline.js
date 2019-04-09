// pages/managerOnline/managerOnline.js
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
    text:"",
    feedBackContent:'',
    QrModalStatus: false,
    CustomerServiceImg: 'https://eimg.doorconn.com/hotel_assistant/images/header.png',
  },
  
  /**
   * 自定义函数
   */
  //提示框隐藏
  QRhideModal: function (e) {
    this.setData({
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
  formSubmit: util.throttle(function (e) {
    var feedBackContent = this.data.feedBackContent;
    if (util.stringIsEmpty(feedBackContent)) {
      util.showToastMsg('请输入您想反馈事情')
      return
    } else {
      var formId = e.detail.formId;
      var params = {
        "content": feedBackContent,
        "formId": formId
      };
      var successFunction = function (successData) {

        console.log("code:" + successData.data.code)
        switch (successData.data.code) {

          case 0:

            that.setData({
              feedBackContent: '',
              QrModalStatus: true
            })
            break;
          case 1:
            util.showToastMsg('提交失败')
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)
            break;
          case 3:
            util.showToastMsg('系统繁忙')
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)
            break;
          case 10:
            util.showToastMsg('请先登录')
            wx.clearStorageSync("authenticat")
            wx.clearStorageSync("loginToken")
            wx.redirectTo({
              url: '../Scavenging/Scavenging',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            break;
        }
      };
      var failFunction = function (failData) {

      };
      var that = this;
      Interface.POSTRequest(util.url + Interface.feedBack, params, successFunction, failFunction, "发送中...")
    }
  }, 1000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    wx.request({
      url: util.url +Interface.getManagerLeaveMessage,
      header: {
        'Content-Type': 'application/json',
        'Token': authenticat
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        that.setData({
          text:res.data.data
        })
        console.log(that.data.text)
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
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.feedbackPvAdd;
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