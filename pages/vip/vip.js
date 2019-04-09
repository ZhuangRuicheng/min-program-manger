// pages/vip/vip.js
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
    vipData: [],
    state:true,
    takeUpState:false,
    showMoreVip:false,
    uhide: 0,
    hide:0,
    privilege: [],
    orderNo:'',
    text:'更多权限',
    img:'../img/lower.png'
  },
  //  普卡会充值函数
  commonViv: function (e) {
    // 获取订单号请求
    var id = e.currentTarget.dataset.idx
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    wx.request({
      url: util.url + Interface.createVIPOrder,
      data:{
        vipGradeId: id,
      },
      header: {
        'content-type': 'application/json',
        'Token': authenticat
      }, 
      method: 'POST',
      success: function(res) {
        console.log(res);
        if(res.data.code == 0 ){
          if (!res.data.data.tradeNo) {
            util.showToastMsg("领取成功");
            wx.navigateTo({
              url: '../vipInfo/vipInfo?id=' + id,
            })
          } else { 
            var orderNo = res.data.data.tradeNo;
            wx.request({
              url: util.url + Interface.unifiedOrder,
              data: {
                tradeNo: orderNo,
              },
              header: {
                'content-type': 'application/json',
                'Token': authenticat
              },
              method: 'POST',
              success: function (res) {
                console.log(res);
                // 微信支付
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.packageValue,
                  'signType': res.data.data.signType,
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    console.log(res)
                    wx.navigateTo({
                      url: '../vipInfo/vipInfo?id=' + id,
                    })
                  },
                  'fail': function (res) {
                  }
                })
              },
              fail: function (res) { },
              complete: function (res) { },
            })
            }
        }else{
          util.showToastMsg(res.data.msg)
        }
      
      },
      fail: function(res) {},
      complete: function(res) {

      },
    })
  },

  // 点击更多权限图标改变隐藏图标事件
  changeImg:function(e){
    var that = this;
    var uhide = that.data.uhide;
    var id = e.currentTarget.dataset.id;
    
  that.setData({
    uhide: id,
    hide: id,
    state: false,
    takeUpState: true,
  })
  
  },
  
   
  // 点击收起更多权限图标改变图标事件
  takeUpchangeImg:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var hide = that.data.hide;

    if(id == hide){

      that.setData({
        uhide: 0,
        hide:0,
        height: '80rpx',
        rpx: 'rpx',
        state: true,
        takeUpState: false,
      })
    }
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = util.url + Interface.getHotelVipGradeList;
    var params = {};
    var successData = function(res){
      if(res.data.code == 0){
        that.setData({
        vipData:res.data.data,
      })
      }else{
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res){};
    request.Request("GET", "加载中", url, params, successData, failData)
  
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
    var url = util.url + Interface.vipPvAdd;
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