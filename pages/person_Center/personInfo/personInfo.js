// pages/person_Center/personInfo/personInfo.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
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
    canIUse: wx.canIUse('open-type.getUserInfo'),
    isLogin: false,
    nameShow:false,
    idShow:false,
    name:'',
    phoneNum:'',
    id:''
  },
  // 获取手机号码
  getPhoneNumber(e) {
    var that = this;
    var url = util.url + Interface.decodePhone;
    var params = {
      "signature": wx.getStorageSync('signature'),
      "rawData": wx.getStorageSync('rawData'),
      "encryptedData": e.detail.encryptedData,
      "iv": e.detail.iv
    };
    var successData = function(res){
      if(res.data.code == 0){
        that.setData({
          phoneNum: res.data.data.phoneNumber
        })
      }
    };
    var failData = function (res) { };
    request.Request("POST", "提交中", url, params, successData, failData)
  },
  //切换手机号码
  upDatePhoneNum:function(e){
    wx.navigateTo({
      url: '../updatePhoneNum/updatePhoneNum',
    })
  },
  //防止页面滑动
  preventTouchMove:function(e){},
  //点击显示输入名字弹出层
  clickInputName:function(e){
    this.setData({
      nameShow:true
    })
  },
  //取消输入名字弹出层
  cancelInputName:function(e){
    this.setData({
      nameShow:false
    })
  },
  //点击显示输入身份证弹出层
  clickInputId:function(e){
    this.setData({
      idShow:true
    })
  },
  //取消输入身份证弹出层
  cancelInputId: function (e) {
    this.setData({
      idShow: false
    })
  },
  //获取更改输入框内容
  getInput:function(e){
    switch (e.currentTarget.id) {
      case 'name':
        this.setData({
          name: e.detail.value.replace(/\s+/g, '')
        })
        break;
      case 'id':
        this.setData({
          id: e.detail.value.replace(/\s+/g, '')
        })
        break;
    }
  },
  //身份证解绑
  untying:function(e){
    var phoneNum = this.data.phoneNum;
    wx.navigateTo({
      url: '../untying/untying?phoneNum=' + phoneNum,
    })
  },

  //绑定名字
  bindName:function(e){
    var that = this;
    var name = that.data.name;
    var url = util.url + Interface.saveName;
    var params = {
      'name': name
    };
    var successData = function(res){
      if(res.data.code == 0){
        util.showToastMsg("保存成功")
        that.setData({
          nameShow: false
        })
      }else{
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res){};
    request.Request("POST", "提交中", url, params, successData, failData)
  },
  //绑定身份证
  bindIdCard:function(e){
    var that = this;
    var id = that.data.id;
    var url = util.url + Interface.saveIdCard;
    var params = {
      'idCard':id
    };
    var successData = function(res){
      if(res.data.code == 0){
        
        util.showToastMsg("绑定成功")
        that.checkPermission(that)
        that.setData({
          idShow: false
        })
      }else{
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function (res) { };
    request.Request("POST", "提交中", url, params, successData, failData)
  },
  //获取权限
  checkPermission: function (that) {
    var hotelId = wx.getStorageSync('HotelId');
    var url = util.url + Interface.checkPermission;
    var params = {
      'hotelId': hotelId
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        wx.setStorageSync("expireTime", res.data.data.expireTime)
        wx.setStorageSync("hasIdCard", res.data.data.hasIdCard)
        wx.setStorageSync("openIhc", res.data.data.openIhc)
        wx.setStorageSync("roomNum", res.data.data.roomNum)
        that.setData({
          openIhc: res.data.data.openIhc,
          hasIdCard: res.data.data.hasIdCard,
        })
        if (res.data.data.hasPermission) {
          app.globalData.currentTab = 1;
          wx.reLaunch({
            url: '../../cuestControl/cuestControl',
          })
        }
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        setTimeout(function () {
          wx.redirectTo({
            url: '../../Scavenging/Scavenging',
          })
        }, 1500)
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        setTimeout(function () {
          wx.redirectTo({
            url: '../../Scavenging/Scavenging',
          })
        }, 1500)
      }else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function (res) { };
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  //获取用户信息
  getCustomerInfo:function(that){
    var url = util.url + Interface.getCustomerInfo;
    var params = {};
    var failData = function (res) { };
    var successData = function (res) {
      if (res.data.code == 0) {
        that.setData({
          name: res.data.data.name,
          phoneNum: res.data.data.phone,
          id: res.data.data.idCard
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function (e) { };
    request.Request("GET", "提交中", url, params, successData, failData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.login({
      success: function (res) {
        that.setData({
          isLogin: true
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    that.getCustomerInfo(that)
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
    that.getCustomerInfo(that)
    var hotelId = wx.getStorageSync('HotelId');
    var url = util.url + Interface.checkPermission;
    var params = {
      'hotelId': hotelId
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        wx.setStorageSync("expireTime", res.data.data.expireTime)
        wx.setStorageSync("hasIdCard", res.data.data.hasIdCard)
        wx.setStorageSync("openIhc", res.data.data.openIhc)
        wx.setStorageSync("roomNum", res.data.data.roomNum)
        wx.setStorageSync("hasPermission", res.data.data.hasPermission)
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function (res) { };
    request.Request("GET", "加载中", url, params, successData, failData)
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