// pages/person_Center/untying/untying.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
var request = require('../../../utils/request.js');
var interval = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight, //获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    currentTime: 61,
    time: '',
    phoneNum: '12345678998',
    showTips: true,
    code: '',
    // num:''
  },
  //获取验证码输入
  inputCode: function(e) {
    this.setData({
      code: e.detail.value.replace(/\s+/g, '')
    })
  },
  //验证码倒计时
  getCode: function() {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + 's',
        showTips: true
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          showTips: false
        })
      }
    }, 1000)
  },
  //  重新获取验证码
  getVerificationCode: function(e) {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var url = util.url + Interface.sendUnBindIdCardCode;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        that.setData({
          num: res.data.data
        })
        that.getCode();
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    request.Request("POST", "正在获取验证码", url, params, successData, failData)
  },
  //提交验证码
  submitCode: function(e) {
    var that = this;
    var code = that.data.code;
    var url = util.url + Interface.unBindIdCard;
    var params = {
      'code': code
    };
    var successData = function(res) {
      if (res.data.code == 0) {
        util.showToastMsg("解绑成功")
        wx.navigateBack({
          delta: 1,
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    request.Request("POST", "正在获取验证码", url, params, successData, failData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var phoneNum = options.phoneNum;
    that.setData({
      phoneNum: phoneNum
    })
    var url = util.url + Interface.sendUnBindIdCardCode;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        // that.setData({
        //   num:res.data.data
        // })
        that.getCode();
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    request.Request("POST", "正在获取验证码", url, params, successData, failData)
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

  }
})