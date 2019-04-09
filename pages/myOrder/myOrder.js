// pages/myOrder/myOrder.js
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
    clearRoom:[],
    checkOut:'请即打扫',
    VIP:[],
    feedback:[],
    continueStey:[],
    goodsList:[],
    orderInfo:[],
    invoiceState:"",
    clearRoomState:'',
    checkOutState:'',
    vipState:'',
    selfState:'',
    managerState:'',
    MiniState:'',
    orderList:[],
    pageNum:1,
    isLastPage:false
  },
  clearRoom:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './orderDetails/orderDetails?orderId='+orderId,
    })
  },
  checkOut:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './checkOutDetails/checkOutDetails?orderId='+orderId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  feedback:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './feedbackDetails/feedbackDetails?orderId='+orderId,
    })
  },
  StoreOrderInfo:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './storeDetails/storeDetails?orderId='+orderId,
    })
  },
  mealsDatails: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './mealsDatails/mealsDatails?orderId=' + orderId,
    })
  },
  invoice:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './invoiceDetails/invoiceDetails?orderId='+orderId,
    })
  },
  VIP:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './vipDetails/vipDetails?orderId='+orderId,
    })
  },
  continueStey:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './continueSteyDetails/continueSteyDetails?orderId='+orderId,
    })
  },
  hotelReservation:function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './hotelReservationDetails/hotelReservationDetails?orderId='+orderId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = util.url + Interface.findOrderList;
    var params = {
      "pageNum": 1,
      "pageSize":100
    };
    var successData = function(res){
      if(res.data.code == 0){
        for (var i = 0; i < res.data.data.list.length; i++) {
          switch (res.data.data.list[i].orderType) {
            case "INVOICE":
              var object = res.data.data.list[i];
              object.title = JSON.parse(res.data.data.list[i].orderInfo).title;
              object.invoiceType = JSON.parse(res.data.data.list[i].orderInfo).invoiceType;
              break;
            case "VIP":
              var object = res.data.data.list[i];
              object.vipType = JSON.parse(res.data.data.list[i].orderInfo).vipType;
              object.customerName = JSON.parse(res.data.data.list[i].orderInfo).customerName;
              object.idCard = JSON.parse(res.data.data.list[i].orderInfo).idCard;
              object.telephone = JSON.parse(res.data.data.list[i].orderInfo).telephone;
              break;
            case "FEEDBACK":
              var object = res.data.data.list[i];
              object.content = JSON.parse(res.data.data.list[i].orderInfo).content;
              break;
            case "CONTINUE_STAY":
              var object = res.data.data.list[i];
              object.days = JSON.parse(res.data.data.list[i].orderInfo).days;
              object.leaveTime = JSON.parse(res.data.data.list[i].orderInfo).leaveTime;
              break;
            case "MINI_BAR":
              var object = res.data.data.list[i];
              object.orderInfo = JSON.parse(res.data.data.list[i].orderInfo);
              break;
            case "MEAL":
              var object = res.data.data.list[i];
              object.orderInfo = JSON.parse(res.data.data.list[i].orderInfo);
              break;
            case "HOTEL_RESERVE":
              var object = res.data.data.list[i];
              object.orderInfo = JSON.parse(res.data.data.list[i].orderInfo);
              break;
          }
        }
        that.setData({
          orderList: res.data.data.list
        })
      }else{
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res){};
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  /**
   * 自定义函数
   */
  clearDetails:function(e){
    wx.navigateTo({
      url: './orderDetails/orderDetails',
      success: function(res) {},
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
    var that = this;
    var pageNum = that.data.pageNum + 1;
    if (!that.data.isLastPage){
      var url = util.url + Interface.findOrderList;
      var params = {
        "pageNum": pageNum,
        "pageSize": 100
      };
      var successData = function(res){
        if(res.data.code == 0){
          that.setData({
            orderList: that.data.orderList.concat(res.data.data.list),
            isLastPage: res.data.data.isLastPage
          })
        }else{
          util.showToastMsg(res.data.msg)
        }
      };
      var failData = function(res){};
      request.Request("GET", "加载中", url, params, successData, failData)
    }else{
      util.showToastMsg('已加载完全')
    }
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