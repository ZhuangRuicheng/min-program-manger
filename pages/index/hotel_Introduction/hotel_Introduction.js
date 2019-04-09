// pages/index/hotel_Introduction/hotel_Introduction.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
var request = require('../../../utils/request.js');
var map = require('../../../utils/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    content:"",
    hotelName:'',
    telphone:"",
    textAddress:'',
    imgUrls:[],
    address: '',
    latitude: '',
    longitude: '',
    animationData: {},
    showTips:true,
    facilities: [],
    HotelId:0,
    mapImg:util.imgUrl+'/map.png'
  },
  map:function(e){
    var that = this;
   
    //获取位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // const latitude = res.latitude
        // const longitude = res.longitude
        wx.openLocation({
          latitude: parseFloat(that.data.latitude),
          longitude: parseFloat(that.data.longitude),
          name: that.data.address,
          address: that.data.address,
        })
      },
      fail: function (res) { 
       util.showToastMsg("请检查手机是否开启定位功能")
      },
      complete: function (res) { },
    })
  },
  callPhone:function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.telphone,
    })
  },
  //跳转至房型
  hotelReservation:function(e){
    var HotelId = this.data.HotelId;
    wx.navigateTo({
      url: '../hotelReservation/hotelReservation?HotelId='+HotelId,
    })
  },
  //隐藏提示显示
  stopTips:function(e){
    this.setData({
      showTips: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var HotelId = options.HotelId;
    var authenticat = wx.getStorageSync("authenticat");
    console.log("携带id："+HotelId)
    wx.setStorageSync("HotelId");
    that.setData({
      HotelId: HotelId
    })
    var url = util.url + Interface.hotelReservationInfo;
    var params = {
      "hotelId": HotelId
    };
    var successData = function(res){
      // 实例化API核心类
      console.log("res:"+res)
      var demo = new map({
        key: '7IKBZ-WQJKU-MBXVB-2U47V-K6BEE-GKBR5' // 必填
      });
      // 调用接口
      demo.geocoder({
        address: res.data.data.address,
        success: function (res) {
          that.setData({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng
          })
        },
        fail: function (res) {
          util.showToastMsg(res.message)
        },
        complete: function (res) {}
      });
      that.setData({
        content: res.data.data.description,
        hotelName: res.data.data.hotelName,
        telphone: res.data.data.phone,
        textAddress: res.data.data.address,
        imgUrls: res.data.data.banners,
        address: res.data.data.address,
        facilities: res.data.data.facilities
      })
    };
    var failData = function(res){};
    request.Request("GET", "加载中", url, params, successData, failData)
    // wx.request({
    //   url: util.url +Interface.getHotelInfoById,
    //   data:{
    //     "hotelId": HotelId
    //   },
    //   header: {
    //     'content-type': 'application/json',
    //     'Token': authenticat
    //   },
    //   method: 'GET',
    //   success: function(res) {
    //     console.log(res)
    //     // 实例化API核心类
    //     var demo = new map({
    //       key: '7IKBZ-WQJKU-MBXVB-2U47V-K6BEE-GKBR5' // 必填
    //     });
    //     // 调用接口
    //     demo.geocoder({
    //       address: res.data.data.address,
    //       success: function (res) {
    //         that.setData({
    //           latitude: res.result.location.lat,
    //           longitude: res.result.location.lng
    //         })
    //       },
    //       fail: function (res) {
    //         util.showToastMsg(res.message)
    //       },
    //       complete: function (res) {
      
    //       }
    //     });
    //     that.setData({
    //       content: res.data.data.description,
    //       hotelName: res.data.data.hotelName,
    //       telphone: res.data.data.telephone,
    //       textAddress: res.data.data.address,
    //       imgUrls: res.data.data.banners,
    //       address: res.data.data.address,
    //       facilities: res.data.data.facilities
    //     })
       
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
   
   
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
    var HotelId = that.data.HotelId;
    var scene = wx.getStorageSync("scene");
    var url = util.url + Interface.share;
    Interface.PVCount(url, HotelId, authenticat);
    return {
      title: that.data.hotelName+"，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId='+HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }
  }
})