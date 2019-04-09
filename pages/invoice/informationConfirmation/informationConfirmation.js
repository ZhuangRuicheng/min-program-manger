// pages/invoice/informationConfirmation/informationConfirmation.js
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
    types: '',
    title: '',
    taxNumber: '',
    companyAddress: '',
    telephone: '',
    bankName: '',
    bankAccount: '',
    name:'',
    remarks:'',
    typeArray:'',
    QrModalStatus: false
  },
  //提示框隐藏
  QRhideModal: function (e) {
    this.setData({
      QrModalStatus: false
    })
    wx.navigateBack({
      delta: 3,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var typeArray = options.typeArray;
    var types = options.types;
    var title = options.title;
    var taxNumber = options.taxNumber;
    var companyAddress = options.companyAddress;
    var telephone = options.telephone;
    var bankName = options.bankName;
    var bankAccount = options.bankAccount;
    var customerName = wx.getStorageSync("customerName");
    this.setData({
      title: title,
      typeArray: typeArray,
      types: types,
      taxNumber: taxNumber,
      companyAddress: companyAddress,
      telephone: telephone,
      bankName: bankName,
      bankAccount: bankAccount,
      name: customerName
    })
    console.log(this.data.companyAddress)
  },
  /**
   * 自定义函数
   */
  // 获取改变输入框的值
  inputChanged:function (e) {
    switch (e.currentTarget.id) {
      case 'name':

        this.setData({
          name: e.detail.value.replace(/\s+/g, '')
        })
        break;
      case 'remarks':
        this.setData({
          remarks: e.detail.value.replace(/\s+/g, '')
        })

        break;
    }
    console.log(this.data.name)
  },
  formSubmit: util.throttle(function (e) {
    var name = this.data.name;
    if (name == '') {
      util.showToastMsg('请输入您的姓名')
      return
    } else {
      var that = this;
      var types = that.data.types;
      var typeArray = that.data.typeArray;
      var title = that.data.title;
      var taxNumber = that.data.taxNumber;
      var companyAddress = that.data.companyAddress;
      var telephone = that.data.telephone;
      var bankName = that.data.bankName;
      var bankAccount = that.data.bankAccount;
      var name = that.data.name;
      var remarks = that.data.remarks;
      var formId = e.detail.formId;
      var url = util.url + Interface.applyInvoice;
      var params = {
        'invoiceType': typeArray,
        'invoiceItem': types,
        'title': title,
        'taxNumber': taxNumber,
        'companyAddress': companyAddress,
        'telephone': telephone,
        'bankName': bankName,
        'bankAccount': bankAccount,
        'name': name,
        'remarks': remarks,
        'formId': formId
      };
      var successData = function(res){
        if (res.data.code == 0) {
          that.setData({
            QrModalStatus: true
          })
          wx.setStorageSync("customerName", name)
        } else if (res.data.code == 10) {
          util.showToastMsg(res.data.msg)
          wx.clearStorageSync("authenticat")
          wx.clearStorageSync("loginToken")
          wx.redirectTo({
            url: '../../Scavenging/Scavenging',
          })
        } else {
          util.showToastMsg(res.data.msg)
        }
      };
      var failData = function(res){};
      request.Request("POST", "提交中", url, params, successData, failData)
    }
  }, 3000),

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
      title: hotelName+"，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId='+HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }
  }
})