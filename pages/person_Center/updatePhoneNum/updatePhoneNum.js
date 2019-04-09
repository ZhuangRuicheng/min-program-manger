// pages/person_Center/updatePhoneNum/updatePhoneNum.js
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
    time: '获取验证码',
    phoneNum: '',
    code: '',
    currentTime: 60,
    disabled: '',
  },
  //文本框输入更改
  phone: function(e) {
    switch (e.currentTarget.id) {
      case 'phoneNum':
        this.setData({
          phoneNum: e.detail.value.replace(/\s+/g, '')
        });
        break;
      case 'code':
        this.setData({
          code: e.detail.value.replace(/\s+/g, '')
        });
        break;
    }
  },
  //获取验证码
  getCode: function() {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: ''
        })
      }
    }, 1000)
  },
  getVerificationCode: function(e) {

    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var phoneNum = that.data.phoneNum;
    if (phoneNum == '') {
      util.showToastMsg('请先输入手机号码')
      return
    } else {
      var url = util.url + Interface.updatePhoneVerificationCode;
      var params = {
        'phoneNumber': phoneNum,
      };
      var successData = function(res) {
        if (res.data.code == 0) {
          setTimeout(function() {
            that.getCode();
          }, 500)
          that.setData({
            disabled: "disable"
          })
        } else {
          util.showToastMsg(res.data.msg)
        }
      };
      var failData = function(res) {};
      request.Request("POST", "正在获取验证码", url, params, successData, failData)
    }
  },
  //提交信息
  submit: function(e) {
    var that = this;
    var phoneNumber = that.data.phoneNum;
    var verificationCode = that.data.code;
    var params = {
      'phoneNumber': phoneNumber,
      'verificationCode': verificationCode
    };
    var successData = function(res) {
      if (res.data.code == 0) {
        util.showToastMsg("更改成功")
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    var url = util.url + Interface.updatePhoneNumber;
    request.Request("POST", "提交中", url, params, successData, failData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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