// pages/invoice/invoice.js
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
    invoice: '0',
    invoiceType: ['电子发票', '纸质发票'],
  },
    // 发票自定义函数
  bindPickerinvoice: function (e) {
    this.setData({
      pay: e.detail.value
    })
  },
    //按钮触发函数
  invoice:function(e){
    wx:wx.chooseInvoiceTitle({
      success: function(res) {

        var types = res.type;
        var title = res.title;
        var taxNumber = res.taxNumber;
        var companyAddress = res.companyAddress;
        var telephone = res.telephone;
        var bankName = res.bankName;
        var bankAccount = res.bankAccount;
        res.errMsg//接口调用结果
        wx.navigateTo({
          url: "../../pages/invoice/invoiceInfo/invoiceInfo?types=" + types + '&title=' + title + '&taxNumber=' + taxNumber + '&companyAddress=' + companyAddress + '&telephone=' + telephone + '&bankName=' + bankName + '&bankAccount=' + bankAccount,
        })
      },
      fail: function(res) {},
      complete: function(res) {
       
      },
    })
  },
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
    var url = util.url + Interface.invoicePvAdd;
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